import express from 'express';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", loginRoutes);

app.listen(3000, () => console.log("Server has started"));


