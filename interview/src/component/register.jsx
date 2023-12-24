
import React, { useState } from 'react';
import axios from 'axios';
const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

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
            localStorage.setItem("uuid", response.data.data.username)
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
    <div>
      <h2>Register</h2>
      <form>
        <label>username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
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
        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;