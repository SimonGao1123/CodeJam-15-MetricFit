import './UserHealthPage.css'
import { useState } from 'react'
import {useEffect} from 'react'
import workoutMETValues from './extraData/workoutMETValues.jsx' // data for wrkouts
import WeeklyCalendar from './WeeklyCalendar.jsx';

// function 
function writeDateFile (newDate) {
    fetch("http://localhost:3000/writeDate", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({date: newDate})
    }).then(async response => {
        const data = await response.json();
        console.log(data.message);
    }).catch(error => {
        console.log("error sending data in writeDataFile", error);
    })
}

function UserHealthPage ({userLoggedIn, setUserLoggedIn, setDisplayLogin}) {
    const [currentDate, setCurrentDate] = useState();
    function getPrevTime () {
        fetch("http://localhost:3000/getDate", {
                method: "GET",
        }).then(res => res.text())
        .then(data => setCurrentDate(new Date(data.trim())))
        .catch(error => {
            console.log("Error in adding user information: " + error);
            return null;
        })   
    }
    
    useEffect(() => {
        getPrevTime();
    }, [])

    console.log("weekly calendar: ", userLoggedIn.weeklyCalendar);
    const {streak, weight, sex, age, height, weeklyCalendar} = userLoggedIn;
    
    

    const [calendar, setCalendar] = useState(weeklyCalendar); 

    // const [aiMessage, setAIMessage] = useState("");
    const [updateHeight, setUpdateHeight] = useState(height);
    const [updateWeight, setUpdateWeight] = useState(weight);
    const [updateSex, setUpdateSex] = useState(sex);
    const [updateAge, setUpdateAge] = useState(age);
    
    const [updateStreak, setUpdateStreak] = useState(streak);

    useEffect(() => {
    setUpdateHeight(height ?? 0);
    setUpdateWeight(weight ?? 0);
    setUpdateAge(age ?? 0);
    setUpdateSex(sex ?? "");   // empty string instead of null
    }, [height, weight, age, sex]);

    const [menuShown, setMenuShown] = useState(!sex);

    const [workoutCategory, setWorkoutCategory] = useState(null);
    const [workoutIntensity, setWorkoutIntensity] = useState(null);
    const [workoutInputs, setWorkOutInputs] = useState(null); // none chosen yet

    const [displayMessage, setDisplayMessage] = useState(null);


    function updateClock(streak, weeklyCalendar, userLoggedIn) {
        if (!currentDate) {
            console.log("Current date not loaded yet");
            return;
        }

        let tempDate = new Date();
        tempDate = new Date(tempDate.getFullYear(), tempDate.getMonth(), tempDate.getDate());

        // ⚠️ This line has a bug too:
        // currentDate.getFullYear() != currentDate.getFullYear()
        // should be comparing tempDate
        if (
        currentDate.getMonth() !== tempDate.getMonth() ||
        currentDate.getFullYear() !== tempDate.getFullYear()
        ) {
            // updateLeaderboard()
        }

        const startWeek1 = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay()
        );

        const startWeek2 = new Date(
        tempDate.getFullYear(),
        tempDate.getMonth(),
        tempDate.getDate() - tempDate.getDay()   // you forgot () on getDay before
        );

        if (startWeek1.getTime() !== startWeek2.getTime()) {
            StreakUpdate(streak,weeklyCalendar,userLoggedIn)
        }

        setCurrentDate(tempDate);
        writeDateFile(tempDate);
        
        const dayWeek = currentDate.getDay();
        const dayMonth = currentDate.getDate();
    }

    function StreakUpdate(updateStreak,weeklyCalendar,userLoggedIn) {
        // console.log(weeklyCalendar)
        if (weeklyCalendar.flat().length === 0){
            updateStreak = 0
        } else {
            updateStreak += 1
        }
        fetch("http://localhost:3000/updateStreak", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({id:userLoggedIn.id, streak:updateStreak})
        }).catch(error => {
            console.log("Error in adding user information: " + error);
        })
    }

    return (
        <>
            <button onClick={() => updateClock()}>Update Day</button>
            <h2>Hello {userLoggedIn.username}</h2>

            <button onClick={() => setMenuShown(!menuShown)}>☰</button>
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
            displayMessage={displayMessage}
            setDisplayMessage={setDisplayMessage}
            /> : <></>}
            
            

            <WeeklyCalendar
                userLoggedIn={userLoggedIn}
                currentDay={currentDate}
                calendar={calendar}
                setCalendar={setCalendar}
                workoutCategory={workoutCategory}
                setWorkoutCategory={setWorkoutCategory}
                workoutIntensity={workoutIntensity}
                setWorkoutIntensity={setWorkoutIntensity}
                workoutInputs={workoutInputs}
                setWorkOutInputs={setWorkOutInputs}
                displayMessage={displayMessage}
                setDisplayMessage={setDisplayMessage}
                updateHeight={updateHeight}
                updateAge={updateAge}
                updateWeight={updateWeight}
                updateSex={updateSex}
                />
            
            <button onClick={() => signOutFunction(setUserLoggedIn, setDisplayLogin)}>Sign out</button>

            

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
            
            <label htmlFor="updateheight">Height (cm): </label>
            <input type="text" id="updateheight" value={updateHeight} onChange={(e) => {if(!isNaN(e.target.value))setUpdateHeight(Number(e.target.value))}}/>
            
            <label htmlFor="updateweight">Weight (kg): </label>
            <input type="text" id="updateweight" value={updateWeight} onChange={(e) => {if(!isNaN(e.target.value))setUpdateWeight(Number(e.target.value))}}/>
            
            <label htmlFor="updatesex">Gender: </label>
            <select id="updatesex" value={updateSex} onChange={(e)=>setUpdateSex(e.target.value)}>
                <option selected disabled hidden value="">Select Option:</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            
            <label htmlFor="updateage">Age (years): </label>
            <input type="number" id="updateage" value={updateAge} onChange={(e) => {if(!isNaN(e.target.value) || e.target.value < 0)setUpdateAge(Number(e.target.value))}}/>
            
            <button type="submit">Update</button>
        </form>);
}

function signOutFunction (setUserLoggedIn, setDisplayLogin) {
    setUserLoggedIn({});
    setDisplayLogin(true); // go back to login page
}

export default UserHealthPage;