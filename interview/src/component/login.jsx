// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import LoginCCss from "../css/LoginC.module.css"
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Login clicked');
    console.log('Email:', email);
    console.log('Password:', password);
    const instance = axios.create({
        baseURL:"https://ws.scutbot.icu/api"
    })
    instance.post("/login", {email: email, passwd: password})
    .then((response) =>{
        console.log(response);
        if(response.data.code == 200){
            console.log("登陆成功",response.data.data);
            localStorage.setItem("uuid", response.data.data.uuid)
            localStorage.setItem("uuid", response.data.data.username)
        }else{
            console.log("登陆失败");
            console.log(response.data);
        }
    })
    .catch((error) =>{
        console.log(error);
    })
  };
  return (
    <div className={LoginCCss.loginContainer}>
      <form className={LoginCCss.loginForm}>
        <label>Email:
          <input
          className={LoginCCss.inputField}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>Password:
          <input
            className={LoginCCss.inputField}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className={LoginCCss.loginButton} type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;