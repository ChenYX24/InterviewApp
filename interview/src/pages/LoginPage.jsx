import React, { useState } from 'react';
import Login from "../component/login";
import Register from "../component/register";
import LoginCss from "../css/Login.module.css";

function LoginPage() {
  // 状态来跟踪当前选中的选项
  const [selected, setSelected] = useState('login');

  // 点击事件处理函数
  const handleSelect = (option) => {
    setSelected(option);
  }

  return (
    <div className={LoginCss.bg}>
      <div className={LoginCss.content}>
        <div className={LoginCss.bar}>
          <div className={`${LoginCss.dot} ${selected === 'login' ? LoginCss.selected : ''}`} onClick={() => handleSelect('login')}>
            <span className={`${selected === 'login' ? LoginCss.selected : ''}`}>Login</span>
          </div>
          <div className={`${LoginCss.dot} ${selected === 'register' ? LoginCss.selected : ''}`} onClick={() => handleSelect('register')}>
            <span className={`${selected === 'register' ? LoginCss.selected : ''}`}>Register</span>
          </div>
        </div>
        <div className={LoginCss.lg}>
        {selected === 'login' ? <Login /> : <Register />}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
