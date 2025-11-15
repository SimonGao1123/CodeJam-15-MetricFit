import { useState } from 'react'
import UserLoginDisplay from './UserLoginDisplay.jsx'
import UserHealthPage from './UserHealthPage.jsx';

function App() {
  const [displayLogin, setDisplayLogin] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState({}); // will hold username + id
  // id will be used to access data stored for user
  console.log(userLoggedIn);
  return (
  <>
    {displayLogin ? <UserLoginDisplay setDisplayLogin={setDisplayLogin} setUserLoggedIn={setUserLoggedIn}/>
    : <UserHealthPage userLoggedIn={userLoggedIn} setUserLoggedIn={setUserLoggedIn} setDisplayLogin={setDisplayLogin}/>}
    
  </>
  );
}

export default App
