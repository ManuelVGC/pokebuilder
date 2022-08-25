from starlette.responses import Response
from fastapi import FastAPI, File
from typing import Optional
from pydantic import BaseModel
from typing import List

# Load recommendation model at startup
from recsys import ItemHistory, RecommendedItems, load_model, recommend_items

# Load recommender system
load_model()

# LOAD FAST API
app = FastAPI(
    title="Pokemon Recommender System Gen3ou",
    description="""Obtain pokemon recommendations for team building.""",
    version="0.1.0",
)

# ROUTES
@app.post("/v1/recommend")
def recommend(id_list: ItemHistory) -> RecommendedItems:
    """Perform recommendation"""
    return recommend_items(id_list)
