import os

from pydantic import BaseModel
import numpy as np

from typing import List, Tuple
from recbole.model.sequential_recommender.gru4rec import GRU4Rec
from recbole.data.dataset.sequential_dataset import SequentialDataset

from recbole.data.interaction import Interaction
from logging import getLogger
from recbole.data import data_preparation

from recbole.utils import init_logger, get_model, init_seed
import torch
import cloudpickle

DATASET = 'dataset.pkl'
MODEL = f'./GRU4Rec-Aug-23-2022_14-11-52.pth'


# CLASES PARA ALMACENAR LA INFORMACIÓN
class ItemHistory(BaseModel):
    sequence: List[str]
    topk: int


class RecommendedItems(BaseModel):
    score_list: List[float]
    item_list: List[str]


def load_model_and_dataset(model_file: str) -> Tuple[GRU4Rec, SequentialDataset]:
    checkpoint = torch.load(model_file, map_location='cpu')
    config = checkpoint["config"]
    print(config)
    init_seed(config["seed"], config["reproducibility"])
    # logger initialization
    init_logger(config)
    logger = getLogger()
    # write config info into log
    logger.info(config)
    # for a server without cpu
    config["device"] = "cpu"
    with open(os.path.join('.', DATASET), 'rb') as f:
        dataset = cloudpickle.load(f)
        train_data, valid_data, test_data = data_preparation(config, dataset)
        model = get_model(config["model"])(config, train_data.dataset).to(config["device"])
        model.load_state_dict(checkpoint["state_dict"])
        model.load_other_parameter(checkpoint.get("other_parameter"))
        return model, dataset


def load_model():
    global model, dataset
    # GRU4REC MODEL
    your_model_checkpoint = MODEL
    model, dataset = load_model_and_dataset(your_model_checkpoint)


# FUNCIONES PARA REALIZAR LA RECOMENDACIÓN

def recommend_items(item_history: ItemHistory):
    item_history_dict = item_history.dict()
    item_sequence = item_history_dict["sequence"]
    item_length = len(item_sequence)
    pad_length = 5  # 5 debido a que las sesiones las consideramos de 5 (tamaño equipo)

    # Obtener los ids internos de recbole a partir de los proporcionados
    # Hacer un padding con 0s hasta completar la entrada esperada
    padded_item_sequence = torch.nn.functional.pad(
        torch.tensor(dataset.token2id(dataset.iid_field, item_sequence)),
        (0, pad_length - item_length),
        "constant",
        0,
    )

    # Crear un objeto Interaction
    input_interaction = Interaction(
        {
            "item_id_list": padded_item_sequence.reshape(1, -1),
            "item_length": torch.tensor([item_length]),
        }
    )

    # LLamar a la función full_sort_predict del modelo
    scores = model.full_sort_predict(input_interaction.to(model.device))
    scores = scores.view(-1, dataset.item_num)
    scores[:, 0] = -np.inf  # pad item score -> -inf
    topk_score, topk_iid_list = torch.topk(scores, item_history_dict["topk"])

    predicted_score_list = topk_score.tolist()[0]

    # Pasar de ids internos a externos
    predicted_item_list = dataset.id2token(
        dataset.iid_field, topk_iid_list.tolist()
    ).tolist()

    # Devolver las recomendaciones en un objeto RecommendedItems
    recommended_items = {
        "score_list": predicted_score_list,
        "item_list": predicted_item_list,
    }

    return RecommendedItems(**recommended_items)
