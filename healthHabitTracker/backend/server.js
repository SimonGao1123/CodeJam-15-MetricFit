import express from 'express';
import cors from 'cors';
import loginRoutes from './routes/loginRoutes.js';
<<<<<<< HEAD
import healthPageRoutes from './routes/healthPageRoutes.js'
=======
import geminiRoutes from './routes/geminiRoute.js';

>>>>>>> fc1c3d6 (troubleshooting for gemini backend)

const app = express();
app.use(express.json());
app.use(cors());
app.use("/", loginRoutes);
<<<<<<< HEAD
app.use("/", healthPageRoutes)
=======
app.use("/", geminiRoutes);

>>>>>>> fc1c3d6 (troubleshooting for gemini backend)

app.listen(3000, () => console.log("Server has started"));


