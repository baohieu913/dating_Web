import React, { useState } from 'react'
import classes from './login.module.css'
import { useDispatch } from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'
import { login } from '../../redux/authSlice'
import {
  FacebookOutlined,
  GoogleOutlined
} from '@ant-design/icons';

const Login = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:4000/v1/user/login`, {
        headers: {
          'Content-Type': "application/json"
        },
        method: "POST",
        body: JSON.stringify({username, password})
      })
      const data = await res.json()
      dispatch(login(data))
      navigate("/chat")
    } catch (error) {
      setError(prev => true)
      setTimeout(() => {
        setError(prev => false)
      }, 2500)
      console.error(error);
    }
  }

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <h2 className={classes.title}>Login</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor='username'>
            <input onChange={(e) => setUsername(prev => e.target.value)} type="text" id="username" placeholder='Username'/>
          </label>
          <label htmlFor='password'>
            <input onChange={(e) => setPassword(prev => e.target.value)} type="password" id="password" placeholder='Password'/>
          </label>
          <button className={classes.submitBtn}>Login</button>
          <div>----OR----</div>
          <div>
            <FacebookOutlined className={classes.facebook} />
            <GoogleOutlined className={classes.google} />
          </div>
          <Link to='/register'>Don't have account? <p className={classes.register}>Register now</p></Link>
        </form>
        {
          error && 
          <div className={classes.errorMessage}>
            Wrong credentials!! Try different ones.
          </div>
        }
      </div>
    </div>
  )
}

export default Login