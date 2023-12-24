import React, { useState } from 'react';
import axios from 'axios';
import LoginCCss from "../css/LoginC.module.css"

import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();
  const handleRegister = async () => {
    console.log('Register clicked');
    console.log('Email:', email);
    console.log('Password:', password);
    const instance = axios.create({
        baseURL:"https://ws.scutbot.icu/api"
    })
    instance.post("/register", {name:username,email: email, passwd: password})
    .then((response) =>{
        console.log(response);
        if(response.data.code == 200){
            console.log("注册成功", response.data.data);
            localStorage.setItem("uuid", response.data.data.uuid)
            localStorage.setItem("username", response.data.data.username)
            navigate("/home")
        }else{
            console.log("注册失败");
            console.log(response.data);
        }
    })
    .catch((error) =>{
        console.log(error);
    })
  };
  return (
    <div  className={LoginCCss.loginContainer}>
      <form className={LoginCCss.loginForm}>
        <label>username:
          <input
          className={LoginCCss.inputField}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>Email:
          <input
          className={LoginCCss.inputField}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>Password:
          <input
          className={LoginCCss.inputField}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button className={LoginCCss.loginButton} type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;