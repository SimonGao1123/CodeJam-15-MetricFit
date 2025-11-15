import express from 'express';
import fs from 'fs';
import crypto from 'crypto';

const loginInfoPath = "./dataFiles/loginInfo.json"

const router = express.Router();

let id = 0; // tracks user id

router.post("/login", (req, res) => {
    try {
        const {username, password} = req.body;
        const pastData = readLoginInfo();
        const existingUser = checkLoginValid(pastData, username, password);
        if (!existingUser) {
            return res.json({message: 'Your username/password is incorrect, please try again', user: null, valid: false});
        }
        return res.send({message: `Logged in as ${username}`, user: {username: username, id: existingUser.id}, valid: true}); // valid means successful login 

    } catch (error) {
        console.error("Error in login process " + error);
        res.send({message: `failed to login ${username}`, user: null, valid: false});
    }
});
router.post("/register", (req, res) => {
    try {    
        const {username, password} = req.body;
        const pastData = readLoginInfo();
        if (!ifUserValid(pastData, username)) {
            return res.json({message: 'Username already exists, please try again.', id: null, success: false});
        }
        id++;
        
        const newData = pastData ? pastData : [];
        newData.push({username: username, password: encryptPassword(password), id: `${username}-${id}`});

        writeLoginInfo(newData);
        res.send({message: `registered ${username}`, username:username, id: `${username}-${id}`, success: true});
    } catch (error) {
        console.log("Error in registration process " + error);
        res.send({message: `failed to register ${username}`, id: null, success: false});

    }

});

// true if valid user/pass false if otherwise
function checkLoginValid (data, username, password) {
    if (!data) {
        return false;
    }
    const existingUser = data.find(user => user.username === username && comparePassword(password, user.password));
    return existingUser; // will return the exisiting user
}

// true if valid username false if repeat username found
function ifUserValid (data, username) {
    if (!data) {
        return true;
    }

    const repeatUser = data.find(user => user.username === username);
    return repeatUser ? false : true; // if repeat user exists then not valid
}
function readLoginInfo () {
    try {
        const data = fs.readFileSync(loginInfoPath, "utf-8");
        if (!data) {
            return []; // if no data then just use empty array
        }
        return JSON.parse(data);

    } catch (error) {
        console.error("Error occurred while reading Login info: " + error);
    }
}
function writeLoginInfo (newData) {
    try {
        const processedData = JSON.stringify(newData, null, 2);
        fs.writeFileSync(loginInfoPath, processedData, 'utf-8');
    } catch (error) {
        console.error("Error occurred while writing Login info: " + error);
    }
}

// return encrypted password to be added to loginInfo.json
function encryptPassword (password) {
    const salt = crypto.randomBytes(16).toString('hex'); // adds salt
    const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
// true if same password
function comparePassword (password, stored) {
    const [salt, hash] = stored.split(":"); // extract salt and hash
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hashedPassword === hash;
}
export default router;