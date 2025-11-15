import './UserHealthPage.css'
import { useState } from 'react'
import {useEffect} from 'react'

function UserHealthPage ({userLoggedIn, setUserLoggedIn, setDisplayLogin}) {
    const [aiMessage, setAIMessage] = useState("");
    function askAI () {
        fetch("http://localhost:3000/api/chat", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: aiMessage})
        }).then(async response => {
            const data = await response.json();
            console.log(data.reply);
        }).catch(error => {
            console.log("Error in receiving gemini response: " + error);
        })
    }
    return (
        <>
            <h2>Hello {userLoggedIn.username}</h2>

            
            <input type="text" value={aiMessage} onChange={(e) => setAIMessage(e.target.value)}/>
            <button onClick={() => askAI()}>Ask AI</button>

            <button onClick={() => signOutFunction(setUserLoggedIn, setDisplayLogin)}>Sign out</button>
            
        </>
    );
    
}


function signOutFunction (setUserLoggedIn, setDisplayLogin) {
    setUserLoggedIn({});
    setDisplayLogin(true); // go back to login page
}
export default UserHealthPage;