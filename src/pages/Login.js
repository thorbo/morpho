import { useHistory } from "react-router-dom";
import React, { useRef, useState } from "react";
import { workoutActions } from "../store/index";
import { useDispatch } from "react-redux";

import classes from "./Login.module.css";
import Card from "../UI/Card";

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const history = useHistory();
  const dispatch = useDispatch()

  const submitHandler = (event) => {
    event.preventDefault();
    let url;
    if (isLogin) {
      // log user in
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAMFoZij5NbVwdAiVyp41xqCLEvEo653xI";
    } else {
      // sign user up
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAMFoZij5NbVwdAiVyp41xqCLEvEo653xI";
    }
    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        returnSecureToken: true,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then((data) => {
        //handle login logic
        const expiresIn = new Date().getTime() + +data.expiresIn * 1000; // expiration time in ms
        dispatch(workoutActions.login({
          token: data.idToken,
          expiresIn: expiresIn,
          email: emailRef.current.value,
        }));
        history.replace("/");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const toggleNewUser = () => {
    setIsLogin((state) => !state);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <label>Email:</label>
        <input ref={emailRef} type="email" required autoFocus></input>
        <label>Password:</label>
        <input ref={passwordRef} type="password" required></input>
        <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        <button onClick={toggleNewUser} type="button">
          {isLogin ? "Create New User" : "Existing User"}
        </button>
      </form>
    </Card>
  );
};

export default Login;
