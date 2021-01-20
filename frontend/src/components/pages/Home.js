import React, { useEffect, useContext } from 'react';
import userContext from '../../context/userContext';
import { Link } from "react-router-dom";
import { useHistory } from 'react-router-dom';

export default function Home() {

    const {userData} = useContext(userContext);
    const history = useHistory();

    useEffect(() => {
        if( !userData.user ) history.push("/login")
    // here we removed the dependancy array -----> },[]);
    });

    return (
        <div className="page">
        {userData.user ? (
            <>
            <h1 className="welcome">Welcome {userData.user.displayName}</h1>
            </>
        ) : (
          <>
            <h2>You are not logged in</h2>
            <Link to="/login">Log in</Link>
          </>
        )}
      </div>
    );
}