import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import UserContext from '../../context/userContext';
import ErrorNotice from '../errors/ErrorNotice';
import Axios from 'axios';

export default function Register() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordCheck, setpasswordCheck] = useState();
    const [displayName, setDisplayName] = useState();
    const [error, setError] = useState();

    // here we enable the imported 'UserContext'
    const { setUserData } = useContext(UserContext);
    const history = useHistory();

    const submit = async (e) => {
        e.preventDefault();

        try { 
            // here we grab the states of this four inputs
            const newUser = { email, password, passwordCheck, displayName };
            await Axios.post(
                "http://localhost:5000/users/register",
                newUser
            );
            const loginRes = await Axios.post(
                "http://localhost:5000/users/login", {
                email,
                password
                });
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

    return <div className="page">
        <h1>Register</h1>
        {error && <ErrorNotice message={error} clearError={() => setError(undefined)} />}
        <form className="form" onSubmit={submit}>
            <label htmlFor="register-email">Email</label>
            <input id="register-email" type="email" onChange={e => setEmail(e.target.value)} />

            <label htmlFor="register-password">Password</label>
            <input id="register-password" type="password" onChange={e => setPassword(e.target.value)} />
            <input type="password" placeholder="Verify password" onChange={e => setpasswordCheck(e.target.value)} />

            <label htmlFor="register-display-name">Display name</label>
            <input id="register-display-name" type="text" onChange={e => setDisplayName(e.target.value)} />

            <input type="submit" value="Register" />
        </form>
        </div>
}