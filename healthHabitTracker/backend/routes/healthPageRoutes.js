import express from 'express';
import fs from 'fs';

const router = express.Router();
const userInfoPath  = "./dataFiles/userInfo.json"
const timeInfoPath = "./dataFiles/timeinfo.txt"

// only call when registering a new user
router.post("/addUser", (req, res) => {
    try {
        const {username, id} = req.body;

        const data = readUserInfo();
        const newData = {username, id, streak: 0, weight: 0, sex: null, age: 0, height: 0, weeklyCalendar: Array.from({ length: 7 }, () => []), monthlyCaloriesBurnt: 0, totalCaloriesBurnt: 0};
        data.push(newData);
        writeUserInfo(data);
    } catch (error) {
        console.error("Error in adding user process " + error)
    }
    

});
router.get("/leaderboard/:id", (req, res) => {
  try {
    const id = req.params.id;
    const data = readUserInfo() || [];

    // sort users by monthlyCaloriesBurnt in descending order
    const sorted = [...data].sort((a, b) => {
      const aCals = Number(a.monthlyCaloriesBurnt) || 0;
      const bCals = Number(b.monthlyCaloriesBurnt) || 0;
      return bCals - aCals;
    });

    // top five full user objects
    const topFiveUsers = sorted.slice(0, 5);

    // convert to public data (username + monthly cals)
    const leaderboard = topFiveUsers.map(user => ({
      id: user.id,  // optional – remove if you don't want to expose id
      username: user.username,
      monthlyCaloriesBurnt: Number(user.monthlyCaloriesBurnt) || 0
    }));

    // find the requested user
    const requestedUser = sorted.find(user => user.id === id);

    // if they exist and are NOT already in the top 5, append them
    const isInTopFive = topFiveUsers.some(user => user.id === id);

    if (requestedUser && !isInTopFive) {
      leaderboard.push({
        id: requestedUser.id,  // optional
        username: requestedUser.username,
        monthlyCaloriesBurnt: Number(requestedUser.monthlyCaloriesBurnt) || 0
      });
    }

    res.send(leaderboard);
  } catch (error) {
    console.error("Error while building leaderboard: ", error);
    res.status(500).send({ message: "Server error building leaderboard" });
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
router.patch("/updateUserCalendar", (req, res) => {
  try {
    const { id, newCalendar, caloriesBurnt } = req.body;
    const data = readUserInfo();

    const indexUser = data.findIndex(user => user.id === id);
    if (indexUser === -1) {
      return res.status(404).send({ message: "User not found" });
    }

    const pastUser = data[indexUser];

    const calories = Number(caloriesBurnt) || 0;  // ensure number, default 0

    const newUser = {
      ...pastUser,
      weeklyCalendar: newCalendar,
      monthlyCaloriesBurnt: (pastUser.monthlyCaloriesBurnt || 0) + calories,
      totalCaloriesBurnt: (pastUser.totalCaloriesBurnt || 0) + calories
    };

    data[indexUser] = newUser;
    writeUserInfo(data);

    res.send({ message: "successfully updated calendar" });
  } catch (error) {
    console.error("Error in updating the calendar data of user: ", error);
    res.status(500).send({ message: "Server error updating calendar" });
  }
});
router.delete("/resetWeeklyCalendar/:id", (req, res) => {
    try {
        const id = req.params.id;
    const data = readUserInfo();
    const pastUser = data.find(user => user.id === id);
    const indexUser = data.findIndex(user => user.id === id);

    const newUser = {...pastUser, weeklyCalendar: Array.from({ length: 7 }, () => []), monthlyCaloriesBurnt: 0}
    data[indexUser] = newUser;
    writeUserInfo(data);
    } catch (error) {
        console.error("reset week error, ", error);
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

// updates a user's streak with id
router.patch("/updateStreak", (req, res) => {
    try{
        const {id, streak} = req.body;
        const data = readUserInfo();
        
        const pastUser = data.find(user => user.id === id);
        const indexUser = data.findIndex(user => user.id === id);

        const newUserStreak = {...pastUser, streak:streak};
        data[indexUser] = newUserStreak;
        writeUserInfo(data);
    } catch(error) {
        console.error("Error in updating user streak: " + error);
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


function readTimeInfo () {
    try {
        return fs.readFileSync(timeInfoPath, "utf-8");

    } catch (error) {
        console.error("Error occurred while reading Time info: " + error);
    }
}
function writeTimeInfo (newTime) {
    try {
        fs.writeFileSync(timeInfoPath, newTime, 'utf-8');
    } catch (error) {
        console.error("Error occurred while writing Time info: " + error);
    }
}

router.post("/writeDate", (req, res) => {
    try {
        const {date} = req.body;
        writeTimeInfo(date);

        res.send({message: "successfully added date"});
    } catch(error) {
        console.error("error while writing date: ", error);
    }
    
});
router.get("/getDate", (req, res) => {
    try {
        const timedata = readTimeInfo();
        console.log(timedata);
        res.send(timedata);
        
    } catch(error) {
        console.error("error in obtaining time " + error);
    }
})


export default router;