import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Axios from 'axios';
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import UserContext from './context/userContext';


export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "https://login-sign.herokuapp.com/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        const userRes = await Axios.get("https://login-sign.herokuapp.com/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };

    checkLoggedIn();
    // , [] <--- this means no dependencies
  }, []);

  return (
    <>
    {/* BrowserRouter component surrounds everything we have access to the routing, so this will be the root component of our website*/}
      <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        {/* Whatever page we are on, the Header will stay always on top */}
        <Header />
        <div className="container">
        {/* Everything we put in here will have access to check our URL*/}
        <Switch>
          {/* path is the Route component property */}
          <Route exact path="/" component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
        </div>
        </UserContext.Provider>  
      </BrowserRouter>
    </>
  );
}

