import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import teamsRoutes from './routes';

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use("/api", teamsRoutes);

export default app;
