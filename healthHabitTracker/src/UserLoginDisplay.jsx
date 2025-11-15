import { useState } from 'react'
import {useEffect} from 'react'
import './UserLoginDisplay.css'

function UserLoginDisplay ({setDisplayLogin, setUserLoggedIn}) {
    const [loginUser, setLoginUser] = useState("");
    const [loginPass, setLoginPass] = useState("");
    
    const [regUser, setRegUser] = useState("");
    const [regPass, setRegPass] = useState("");
    const [confRegPass, setConfRegPass] = useState("");
    
    const [ifLoginDisplay, setLoginDisplay] = useState(true);

    const [displayMessage, setDisplayMessage] = useState("");


    useEffect(() => {
        clearAllEntries(setLoginUser, setLoginPass, setRegUser, setRegPass, setConfRegPass);
    }, [ifLoginDisplay]); // if login/register display changes then reset the display message
    return (
        <>
            {ifLoginDisplay 
            ? <LoginDisplay 
            loginUser={loginUser} 
            setLoginUser={setLoginUser} 
            loginPass={loginPass} 
            setLoginPass={setLoginPass} 
            setLoginDisplay={setLoginDisplay}
            setDisplayMessage={setDisplayMessage}
            setRegPass={setRegPass}
            setRegUser={setRegUser}
            setConfRegPass={setConfRegPass}
            setDisplayLogin={setDisplayLogin}
            setUserLoggedIn={setUserLoggedIn}
            /> 

            : <RegisterDisplay 
            regUser={regUser} 
            setRegUser={setRegUser}
            regPass={regPass}
            setRegPass={setRegPass}
            confRegPass={confRegPass}
            setConfRegPass={setConfRegPass}
            setLoginDisplay={setLoginDisplay}
            setDisplayMessage={setDisplayMessage}
            setLoginPass={setLoginPass}
            setLoginUser={setLoginUser}/>
            }

            <p>{displayMessage}</p>
        </>

    );
}
function clearAllEntries (setLoginUser, setLoginPass, setRegUser, setRegPass, setConfRegPass) {
    setLoginUser("");
    setLoginPass("");
    setRegUser("");
    setRegPass("");
    setConfRegPass("");
}
async function getUserInfo(id) {
    try {
        const response = await fetch(`http://localhost:3000/getUser/${id}`, {
        method: "GET",
        headers: {"Content-Type": "application/json"},
    });
        const data = await response.json();
        
        return data.user;
    } catch (error) {
        console.log("error in getting user information " + error);
        return null;
    }
}

function LoginDisplay ({loginUser, setLoginUser, loginPass, setLoginPass, setLoginDisplay, setDisplayMessage, setRegPass, setRegUser, setConfRegPass, setDisplayLogin, setUserLoggedIn}) {
    function handleLoginSubmission (e) {
        e.preventDefault();
        
        fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: loginUser, password: loginPass})
        }).then(async response => {
            const data = await response.json();
            console.log(data); // debugging
            setDisplayMessage(data.message);
            clearAllEntries(setLoginUser, setLoginPass, setRegUser, setRegPass, setConfRegPass);
            if (data.valid) {
                const {user} = data;
                const fullUser = await getUserInfo(user.id);

                setUserLoggedIn(fullUser);
                setDisplayLogin(false); // remove login display and provide the user which is logged in
            }
                // remove login window and pass in user who logged in 
            
        }).catch(error => {
            console.log("Error when receiving response for login " + error);
        });
    } 

    return (
        <>
            <h2>Login</h2>
            <form onSubmit={handleLoginSubmission}>
                <label htmlFor="user-login-input">Enter Username: </label>
                <input id="user-login-input" type="text" value={loginUser} onChange={(e) => {if (!e.target.value.includes(" "))setLoginUser(e.target.value)}}/>
                <label htmlFor="pass-login-input">Enter Password: </label>
                <input id="pass-login-input" type="text" value={loginPass} onChange={(e) => {if (!e.target.value.includes(" "))setLoginPass(e.target.value)}}/>

                <button type="submit">Login</button>
            </form>

            <p>Don't have an account? <button onClick={() => setLoginDisplay(false)}>Register Here</button></p>
        </>
    );
}

function addUserInfo (username, id) {
     fetch("http://localhost:3000/addUser", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, id})
        }).catch(error => {
            console.log("Error in adding user information: " + error);
        })
}
function RegisterDisplay ({regUser, setRegUser, regPass, setRegPass, confRegPass, setConfRegPass, setLoginDisplay, setDisplayMessage, setLoginPass, setLoginUser}) {

    function handleRegisterSubmit (e) {
        e.preventDefault();
        if (regPass !== confRegPass) {
            setDisplayMessage("Passwords don't match! You fucked up!");
            clearAllEntries(setLoginUser, setLoginPass, setRegUser, setRegPass, setConfRegPass);
            return;
        }
        fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: regUser, password: regPass})
        }).then(async response => {
            const data = await response.json();
            setDisplayMessage(data.message);
            if (!data.success) {
                clearAllEntries(setLoginUser, setLoginPass, setRegUser, setRegPass, setConfRegPass);
            } else {
                clearAllEntries(setLoginUser, setLoginPass, setRegUser, setRegPass, setConfRegPass);
                setLoginDisplay(true); // if registered successfully automatically go to login display

                addUserInfo(data.username, data.id); // adds template for user information to userInfo.json
            }
        }).catch(error => {
            console.log("Error when receiving response for registration " + error);
        });
    }
    return (<>
            <h2>Register</h2>
            <form onSubmit={handleRegisterSubmit}>
                <label htmlFor="user-register-input">Enter Username: </label>
                <input id="user-register-input" type="text" value={regUser} onChange={(e) => {if (!e.target.value.includes(" "))setRegUser(e.target.value)}}/>
                <label htmlFor="pass-register-input">Enter Password: </label>
                <input id="pass-register-input" type="text" value={regPass} onChange={(e) => {if (!e.target.value.includes(" "))setRegPass(e.target.value)}}/>
                <label htmlFor="pass-register-input-conf">Confirm Password: </label>
                <input id="pass-register-input-conf" type="text" value={confRegPass} onChange={(e) => {if (!e.target.value.includes(" "))setConfRegPass(e.target.value)}}/>

                <button type="submit">Register</button>
            </form>

            <p>Have an account? <button onClick={() => setLoginDisplay(true)}>Login Here</button></p>

        </>);
}

export default UserLoginDisplay