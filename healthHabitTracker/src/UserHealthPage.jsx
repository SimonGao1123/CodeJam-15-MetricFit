import './UserHealthPage.css'
import { useState } from 'react'
import {useEffect} from 'react'


// var currentDay = new Date();
// var dayWeek = currentDay.getDay(); // Sunday - Saturday : 0 - 6
// var dayMonth = currentDay.getDate(); // 1 - 31
// // retrieve last logged date

// console.log(currentDay)
// var currentDay = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
// console.log(currentDay)


// function 
function updateClock() {
    var tempDate = new Date();
    var tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());
    if (currentDay.getMonth() != tempDate.getMonth() || currentDay.getFullYear() != currentDay.getFullYear())
        {
            // updateLeaderboard()
        }
    var startWeek1 = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate() - currentDay.getDay())
    var startWeek2 = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate() - currentDay.getDay)
    if (startWeek1.getTime() === startWeek2.getTime())
        {
            // updateStreak()
        }
    var currentDay = tempDate;
    var dayWeek = currentDay.getDay(); // Sunday - Saturday : 0 - 6
    var dayMonth = currentDay.getDate(); // 1 - 31
}

function UserHealthPage ({userLoggedIn, setUserLoggedIn, setDisplayLogin}) {
    const {weight, sex, age, height} = userLoggedIn;

    // const [aiMessage, setAIMessage] = useState("");
    const [updateHeight, setUpdateHeight] = useState(height);
    const [updateWeight, setUpdateWeight] = useState(weight);
    const [updateSex, setUpdateSex] = useState(sex);
    const [updateAge, setUpdateAge] = useState(age);

    const [menuShown, setMenuShown] = useState(!sex);

    const [pastDate, updatePastDate] = useState(null);

  useEffect(() => {
    async function getPrevTime() {
      try {
        console.log("Calling /getDate...");
        const res = await fetch("http://localhost:5000/getDate", { method: "GET" });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Received:", text);
        updatePastDate(text);   // store it in state
      } catch (err) {
        console.log("Fetch error:", err);
      }
    }

    getPrevTime();
  }, []);  // empty deps -> runs once when component mounts

  useEffect(() => {
    console.log("pastDate updated:", pastDate);
  }, [pastDate]);
    
    

   // function askAI () {
    //     fetch("http://localhost:3000/api/chat", {
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         body: JSON.stringify({message: aiMessage})
    //     }).then(async response => {
    //         const data = await response.json();
    //         console.log(data.reply);
    //     }).catch(error => {
    //         console.log("Error in receiving gemini response: " + error);
    //     })
    // }


    return (
        <>
            <h2>Hello {userLoggedIn.username}</h2>

            <button onClick={() => setMenuShown(!menuShown)}>Menu</button>
            {menuShown ?
            <AttributeForm 
            updateHeight={updateHeight}
            setUpdateHeight={setUpdateHeight}
            updateWeight={updateWeight}
            setUpdateWeight={setUpdateWeight}
            updateSex={updateSex}
            setUpdateSex={setUpdateSex}
            updateAge={updateAge}
            setUpdateAge={setUpdateAge}
            userLoggedIn={userLoggedIn}
            /> : <></>}
            

            <button onClick={() => signOutFunction(setUserLoggedIn, setDisplayLogin)}>Sign out</button>
            
            <p>{pastDate}</p>
            

        </>
    );
    
}
function AttributeForm ({updateHeight, setUpdateHeight, updateWeight, setUpdateWeight, updateSex, setUpdateSex, updateAge, setUpdateAge,userLoggedIn}) {
    function handleUpdateAttributes (e) {
        e.preventDefault();
        fetch("http://localhost:3000/updateUser", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id:userLoggedIn.id, weight:updateWeight, sex:updateSex, height:updateHeight, age:updateAge})
        }).catch(error => {
            console.log("Error in adding user information: " + error);
        })
    }
    return (<form onSubmit={handleUpdateAttributes}>
            <h3>Physical Attributes:</h3>
            
            <label for="updateheight">Height: </label>
            <input type="text" id="updateheight" value={updateHeight} onChange={(e) => {if(!isNaN(e.target.value))setUpdateHeight(Number(e.target.value))}}/>
            
            <label for="updateweight">Weight: </label>
            <input type="text" id="updateweight" value={updateWeight} onChange={(e) => {if(!isNaN(e.target.value))setUpdateWeight(Number(e.target.value))}}/>
            
            <label for="updatesex">Gender: </label>
            <select id="updatesex" value={updateSex} onChange={(e)=>setUpdateSex(e.target.value)}>
                <option selected disabled hidden value="">Select Option:</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            
            <label for="updateage">Age: </label>
            <input type="number" id="updateage" value={updateAge} onChange={(e) => {if(!isNaN(e.target.value) || e.target.value < 0)setUpdateAge(Number(e.target.value))}}/>
            
            <button type="submit">Update</button>
        </form>);
}

function signOutFunction (setUserLoggedIn, setDisplayLogin) {
    setUserLoggedIn({});
    setDisplayLogin(true); // go back to login page
}
export default UserHealthPage;