import './UserHealthPage.css'
import { useState } from 'react'
import {useEffect} from 'react'

function UserHealthPage ({userLoggedIn, setUserLoggedIn, setDisplayLogin}) {
    const {weight, sex, age, height} = userLoggedIn;

    // const [aiMessage, setAIMessage] = useState("");
    const [updateHeight, setUpdateHeight] = useState(height);
    const [updateWeight, setUpdateWeight] = useState(weight);
    const [updateSex, setUpdateSex] = useState(sex);
    const [updateAge, setUpdateAge] = useState(age);

    const [menuShown, setMenuShown] = useState(!sex);

    console.log("Height: " + updateHeight + ", Weight" + updateWeight + ", Sex" + updateSex + ", Age" + updateAge);
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
            /> : <></>}
            

            <button onClick={() => signOutFunction(setUserLoggedIn, setDisplayLogin)}>Sign out</button>

            

        </>
    );
    
}
function AttributeForm ({updateHeight, setUpdateHeight, updateWeight, setUpdateWeight, updateSex, setUpdateSex, updateAge, setUpdateAge}) {
    return (<form>
            <h3>Physical Attributes:</h3>
            
            <label for="updateheight">Height: </label>
            <input type="text" id="updateheight" value={updateHeight} onChange={(e) => {if(!isNaN(e.target.value))setUpdateHeight(Number(e.target.value))}}/>
            
            <label for="updateweight">Weight: </label>
            <input type="text" id="updateweight" value={updateWeight} onChange={(e) => {if(!isNaN(e.target.value))setUpdateWeight(Number(e.target.value))}}/>
            
            <label for="updatesex">Gender: </label>
            <select id="updatesex" value={updateSex} onChange={(e)=>setUpdateSex(e.target.value)}>
                <option selected disabled hidden value={null}>Select Option:</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
            
            <label for="updateage">Age: </label>
            <input type="number" min={0} id="updateage" value={updateAge} onChange={(e) => {if(!isNaN(e.target.value))setUpdateAge(Number(e.target.value))}}/>
            
            <button type="submit">Update</button>
        </form>);
}

function signOutFunction (setUserLoggedIn, setDisplayLogin) {
    setUserLoggedIn({});
    setDisplayLogin(true); // go back to login page
}
export default UserHealthPage;