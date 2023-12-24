// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
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
    <div>
      <h2>Login</h2>
      <form>
        <label>Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <br />
        <label>Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={handleLogin}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;