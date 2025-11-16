import './UserHealthPage.css'
import { useState } from 'react'
import {useEffect} from 'react'
import workoutMETValues from './extraData/workoutMETValues.jsx' // data for wrkouts
import WeeklyCalendar from './WeeklyCalendar.jsx';


const defaultWeightTemplate = {
        sets: "",
        reps: "",
        weights: "",
        duration: "",
        workout_title: ""
    };
    const defaultCardioTemplate = {
        duration: "",
        workout_title: ""
    };
// var currentDate = new Date();
// var dayWeek = currentDate.getDay(); // Sunday - Saturday : 0 - 6
// var dayMonth = currentDate.getDate(); // 1 - 31
// // retrieve last logged date

// console.log(currentDate)
// var currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
// console.log(currentDate)


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

    const [menuShown, setMenuShown] = useState(!sex);

    const [workoutCategory, setWorkoutCategory] = useState(null);
    const [workoutIntensity, setWorkoutIntensity] = useState(null);
    const [workoutInputs, setWorkOutInputs] = useState(null); // none chosen yet

    const [displayMessage, setDisplayMessage] = useState(null);

    console.log("Current date: " + currentDate);
    console.log(workoutInputs)

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
            /> : <></>}
            
            <GetWorkoutDetails 
            workoutCategory={workoutCategory}
            setWorkoutCategory={setWorkoutCategory}
            workoutIntensity={workoutIntensity}
            setWorkoutIntensity={setWorkoutIntensity}
            workoutInputs={workoutInputs}
            setWorkOutInputs={setWorkOutInputs}/>

            <WeeklyCalendar currentDay={currentDate} calendar={calendar} setCalendar={setCalendar}/>
            
            <button onClick={() => signOutFunction(setUserLoggedIn, setDisplayLogin)}>Sign out</button>

            <button onClick={() => console.log(caloriesBurnt(workoutInputs, updateWeight, updateHeight, updateAge, updateSex, workoutCategory, workoutIntensity))}>Get Calories Burnt</button>

        </>
    );
    
}

function caloriesBurnt (workoutInputs, weight, height, age, sex, workoutCategory, workoutIntensity) {
    if (!sex) {
        console.log("No valid sex entered");
        return;
    }

    let BMR;

    const {duration} = workoutInputs;
    if (!duration) {
        console.log("No valid duration entered");
        return;
    }
    if (sex === "male") {
        BMR=10*weight+6.25*height-5*age+5;
    } else {
        BMR=10*weight+6.25*height-5*age-161;
    }
    const MET = workoutMETValues[workoutCategory][workoutIntensity];
    return MET * (BMR/24) * (duration/60);
    

}
function GetWorkoutDetails ({workoutCategory, setWorkoutCategory, workoutIntensity, setWorkoutIntensity, workoutInputs, setWorkOutInputs}) {
    useEffect(() => {
        if (!workoutCategory) {
            setWorkOutInputs(null);
            return;
        }
        setWorkOutInputs(
            workoutCategory === "weightAndBodyweight"
            ? defaultWeightTemplate
            : defaultCardioTemplate
        );
    }, [workoutCategory, setWorkOutInputs]);
    
    return (
        <div>
            <label htmlFor='workout-cat-select'>Select Workout Category: </label>
            <select value={workoutCategory} onChange={(e) => setWorkoutCategory(e.target.value)} id="workout-cat-select">
                <option value="" selected disabled hidden>Select Option</option>
                <option value="weightAndBodyweight">Weight/Bodyweight</option>
                <option value="cardio">Cardio</option>
            </select>

            <label htmlFor='workout-intense-select'>Select Workout Intensity: </label>
            <select value={workoutIntensity} onChange={(e) => setWorkoutIntensity(e.target.value)} id="workout-intense-select">
                <option value="" selected disabled hidden>Select Option</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
            </select>

            <AdditionalWorkoutInputs workoutInputs={workoutInputs} setWorkOutInputs={setWorkOutInputs}/>
        </div>
    );
}
// includes set, duration, weights and reps for the exercise and workouttitle (depends on if choose cardio/weights)
function AdditionalWorkoutInputs ({workoutInputs, setWorkOutInputs}) {
    if (!workoutInputs) return null;

  const inputs = [];

  for (let key in workoutInputs) {
    const isText = key === "workout_title";

    inputs.push(
      <div key={`input-${key}`}>
        <label>{nameNormalizer(key)}</label>
        <input
          // we use text + inputMode so we fully control the string
          type="text"
          inputMode={isText ? "text" : "numeric"}
          value={workoutInputs[key] ?? ""}
          onChange={(e) => {
            let value = e.target.value;
            const newInputs = { ...workoutInputs };

            if (!isText) {
              // allow only digits
              value = value.replace(/[^0-9]/g, "");

              // remove leading zeros but keep a single 0 if all zeros
              value = value.replace(/^0+(?=\d)/, "");
            }

            newInputs[key] = isText ? value : Number(value);
            setWorkOutInputs(newInputs);
          }}
        />
      </div>
    );
  }

  return inputs;
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
const nameNormalizer = (name) => {
    return name.split("_").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
}
export default UserHealthPage;