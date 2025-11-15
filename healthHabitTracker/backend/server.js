import express from 'express';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';
import geminiRoutes from './routes/geminiRoute.js';
import healthPageRoutes from './routes/healthPageRoutes.js'

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", loginRoutes);
app.use("/", geminiRoutes);


app.listen(3000, () => console.log("Server has started"));

app.use("/", healthPageRoutes)

