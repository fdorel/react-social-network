import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/userContext';
import ErrorNotice from '../errors/ErrorNotice';
import Axios from 'axios';

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    // here we enable the imported 'UserContext'
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();
        try {
        // here we grab the states of this four inputs
        const loginUser = { email, password };
        const loginRes = await Axios.post(
            "https://login-sign.herokuapp.com/users/login", 
            loginUser
            );

        setUserData({
            token: loginRes.data.token,
            user: loginRes.data.user
        });
        localStorage.setItem("auth-token", loginRes.data.token);
        history.push("/");
      } catch (err) {
        err.response.data.msg && setError(err.response.data.msg);
    }
    }  

    return  <div className="page">
    <h1>Login</h1>
    {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}    
    <form className="form" onSubmit={submit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" value="Log in" />
      </form>
    </div>
}
