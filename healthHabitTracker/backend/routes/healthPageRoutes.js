import express from 'express';
import fs from 'fs';

const router = express.Router();
const userInfoPath  = "./dataFiles/userInfo.json"

router.post("/addUser", (req, res) => {

});

export default router;