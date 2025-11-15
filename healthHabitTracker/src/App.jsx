import { useState } from 'react'
import './App.css'
import UserLoginDisplay from './UserLoginDisplay.jsx'
import UserHealthPage from './UserHealthPage.jsx';

function App() {
  const [displayLogin, setDisplayLogin] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState({}); // will hold username + id
  console.log(displayLogin);
  return (
  <>
    {displayLogin ? <UserLoginDisplay setDisplayLogin={setDisplayLogin} setUserLoggedIn={setUserLoggedIn}/> : <UserHealthPage/>}
    
  </>
  );
}

export default App
