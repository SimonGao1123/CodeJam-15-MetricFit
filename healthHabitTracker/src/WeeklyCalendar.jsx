import './WeeklyCalender.css'
import { useState } from 'react'
import {useEffect} from 'react'
import workoutMETValues from './extraData/workoutMETValues.jsx';
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

function WeeklyCalendar ({userLoggedIn, 
    currentDay, 
    calendar, 
    setCalendar, 
    workoutCategory, 
    setWorkoutCategory, 
    workoutIntensity, 
    setWorkoutIntensity, 
    workoutInputs, 
    setWorkOutInputs, 
    displayMessage, 
    setDisplayMessage,
    updateHeight,
    updateAge,
    updateWeight,
    updateSex}) {
    const [selectedDay, setSelectedDay] = useState(null); // determines popup (will be 0 indexed)
    const [burntCalories, setBurntCalories] = useState(null);
    const dayRefs = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDayIndex = new Date(currentDay).getDay();
    console.log(calendar);
    const wholeCalendarDisplay = [];
    for (let i = 0; i < 7; i++) {
        wholeCalendarDisplay.push(<DisplayCalendarSquare selectedDay={selectedDay} workoutCategory={workoutCategory} setSelectedDay={setSelectedDay} ifCurrDay={i === currDayIndex} dayIndex={i} currentDay={currentDay} calendarSquareData={calendar[i]}/>)
    }
    useEffect(() => {
        if (!calendar||burntCalories==null) return; 
        updateCalendarUser(userLoggedIn, calendar, burntCalories);
    }, [calendar, burntCalories]); // will update backend

    function addWorkoutToCalendar() {
    // 1. need a selected day
    if (selectedDay === null) {
        setDisplayMessage("Please select a day in the calendar first.");
        return;
    }

    // 2. need workout inputs
    if (!workoutInputs) {
        setDisplayMessage("Please choose workout category and fill in workout details.");
        return;
    }

    if (!workoutInputs.workout_title) {
        setDisplayMessage("Please enter a workout title.");
        return;
    }

    // 3. compute calories FIRST
    const calories = caloriesBurnt(
        workoutInputs,
        updateWeight,
        updateHeight,
        updateAge,
        updateSex || userLoggedIn.sex,
        workoutCategory,
        workoutIntensity
    );
    console.log("calories burnt ", calories);
    if (calories == null || Number.isNaN(calories)) {
        console.log("caloriesBurnt returned invalid:", calories);
        setDisplayMessage("Could not calculate calories. Check your inputs (duration, sex, etc).");
        return;
    }

    // 4. create the workout object we will store (AFTER calculating calories)
    const baseWorkout = {
        workout_title: workoutInputs.workout_title,
        workoutCategory: workoutCategory,
        calories: Number(calories) // Now calories is defined
    };

    if (workoutCategory === "weightAndBodyweight") {
        baseWorkout.sets = workoutInputs.sets ?? "";
        baseWorkout.reps = workoutInputs.reps ?? "";
        baseWorkout.weights = workoutInputs.weights ?? "";
    }

    // For cardio workouts, store duration
    if (workoutCategory === "cardio" && workoutInputs.duration) {
        baseWorkout.duration = workoutInputs.duration;
    }

    setBurntCalories(calories); // this plus setCalendar will trigger useEffect

    // 5. immutably update calendar
    setCalendar(prevCalendar => {
        const newCalendar = Array.isArray(prevCalendar)
            ? [...prevCalendar]
            : Array(7).fill(null);

        const dayWorkouts = Array.isArray(newCalendar[selectedDay])
            ? [...newCalendar[selectedDay]]
            : [];

        dayWorkouts.push(baseWorkout);

        newCalendar[selectedDay] = dayWorkouts;
        return newCalendar;
    });

    setDisplayMessage(`Added "${workoutInputs.workout_title}" to ${dayRefs[selectedDay]}.`);
}

    return (
        <div className="weekly-calendar">
            <p>{selectedDay !== null ? `Selected ${dayRefs[selectedDay]}` : "No day selected"}</p>
            <GetWorkoutDetails 
            workoutCategory={workoutCategory}
            setWorkoutCategory={setWorkoutCategory}
            workoutIntensity={workoutIntensity}
            setWorkoutIntensity={setWorkoutIntensity}
            workoutInputs={workoutInputs}
            setWorkOutInputs={setWorkOutInputs}/>

            <p>{displayMessage}</p>
            <button onClick={() => addWorkoutToCalendar()}>Add workout</button>
            {wholeCalendarDisplay}
            
        </div>
    );
}
function updateCalendarUser (userLoggedIn, newCalendar, caloriesBurnt) {
    fetch("http://localhost:3000/updateUserCalendar", {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({newCalendar: newCalendar, id: userLoggedIn.id, caloriesBurnt: caloriesBurnt})
        }).then(async response => {
            const data = await response.json();
        })
        .catch(error => {
            console.log("Error in adding user information: " + error);
        })
}
function DisplayCalendarSquare({
  selectedDay,
  workoutCategory, 
  setSelectedDay,
  ifCurrDay,
  dayIndex,
  currentDay,
  calendarSquareData
}) {
  const dayRefs = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayName = dayRefs[dayIndex];

  const workouts = Array.isArray(calendarSquareData) ? calendarSquareData : [];

  const workoutsDisplay = workouts.map((workout, idx) => (
    <div key={`${dayIndex}-${idx}`} className="workout">
      <p>{nameNormalizer(workout.workout_title)}</p>
    
    <p style={{color: 'green', fontWeight: 'bold'}}>
        🔥 {workout.calories || 0} calories
      </p>
      {}
      {workout.workoutCategory === "weightAndBodyweight" && (
        <>
          <p>Sets: {workout.sets}</p>
          <p>Reps: {workout.reps}</p>
          <p>Weights {workout.weights}</p>
        </>
      )}
    </div>
  ));

  return (
    <div className='days'>
        <div
        onClick={() => setSelectedDay(dayIndex)}
        style={{ backgroundColor: dayIndex===selectedDay ? "green" : ifCurrDay ? "yellow" : "white" }}
        className="calendar-square"
        >
        <p>{dayName}</p>
        {workoutsDisplay}
        </div>
    </div>
  );
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
    let addon = "";
    if (key === "weights") {
        addon = "(kg)"
    }
    if (key === "duration") {
        addon = "{mins}"
    }
    const isText = key === "workout_title";

    inputs.push(
      <div key={`input-${key}`}>
        <label>{`${nameNormalizer(key)} ${addon}`}</label>
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

function caloriesBurnt (workoutInputs, weight, height, age, sex, workoutCategory, workoutIntensity) {
    if (!sex) {
        console.log("No valid sex entered, " + sex);
        return;
    }

    let BMR;

    const {duration} = workoutInputs;
    if (duration == null || duration === "") {
        console.log("No valid duration entered");
        return;
    }
    if (sex === "male") {
        BMR=10*weight+6.25*height-5*age+5;
    } else {
        BMR=10*weight+6.25*height-5*age-161;
    }
    const MET = workoutMETValues[workoutCategory][workoutIntensity];
    return Math.round((MET * (BMR/24) * (duration/60)) / 10) * 10;
    

}


const nameNormalizer = (name) => {
    return name.split("_").map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(" ");
}
export default WeeklyCalendar;