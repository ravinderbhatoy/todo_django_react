import React, { useState } from 'react'
import Header from '../components/Header'
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router';

function Login() {


  const navigater = useNavigate()
  const {user, setUser, login_user} = useContext(AuthContext)

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleUsername = (e) => {
    setUsername(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await login_user(username, password);
    console.log("Login response", response)
    if(response.access){
      setUser(jwtDecode(response.access))
      console.log(user)
      navigater('/')
    }
  }

  return (
    <>
    <Header/>
    <div className='border-box'>
      <h2>Login</h2>
        <form action="" onSubmit={handleSubmit}>
            <input value={username} onChange={handleUsername} type="text" name="username" placeholder="username" />
            <input value={password} onChange={handlePassword} type="password" name="password" placeholder="password"/>
            <br />
            <button className='btn'>Login</button>
        </form>
    </div>
    </>
  )
}

export default Login