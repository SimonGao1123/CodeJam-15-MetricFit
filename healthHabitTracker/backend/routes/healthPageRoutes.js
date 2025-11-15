import express from 'express';
import fs from 'fs';

const router = express.Router();
const userInfoPath  = "./dataFiles/userInfo.json"

// only call when registering a new user
router.post("/addUser", (req, res) => {
    try {
        const {username, id} = req.body;

        const data = readUserInfo();
        const newData = {username, id, streak: 0, weight: 0, sex: null, age: 0, height: 0, weeklyCalendar: Array.from({ length: 7 }, () => []), weeklyCaloriesBurnt: 0, totalCaloriesBurnt: 0};
        data.push(newData);
        writeUserInfo(data);
    } catch (error) {
        console.error("Error in adding user process " + error)
    }
    

});

// for logging in focus on a user (get a specific id)
router.get("/getUser/:id", (req, res) => {
    try {
        const id = req.params.id;
        const data = readUserInfo();

        const userFind = data.find(user => user.id === id);
        res.send({user: userFind});
        if (!userFind) {
            console.error("could not find user");
            return res.status(404).send({ message: "User not found" });
        }
    } catch(error) {
        console.error("error in obtaining user from userInfo.json " + error);
    }
})

// updates a user with id
router.patch("/updateUser", (req, res) => {
    try {
        const {id, weight, sex, height, age} = req.body;
        const data = readUserInfo();

        const pastUser = data.find(user => user.id === id);
        const indexUser = data.findIndex(user => user.id === id);

        const newUser = {...pastUser, weight: weight, sex:sex, height:height, age:age}; 

        data[indexUser] = newUser;
        writeUserInfo(data);
    } catch(error) {
        console.error("Error in updating user attributes: " + error);
    }
});


function readUserInfo () {
    try {
        const data = fs.readFileSync(userInfoPath, "utf-8");
        if (!data) {
            return []; // if no data then just use empty array
        }
        return JSON.parse(data);

    } catch (error) {
        console.error("Error occurred while reading Login info: " + error);
    }
}
function writeUserInfo (newData) {
    try {
        const processedData = JSON.stringify(newData, null, 2);
        fs.writeFileSync(userInfoPath, processedData, 'utf-8');
    } catch (error) {
        console.error("Error occurred while writing Login info: " + error);
    }
}

export default router;