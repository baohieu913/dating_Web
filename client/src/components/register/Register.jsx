import React from 'react'
import classes from './register.module.css'
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../redux/authSlice'

const Register = () => {

    const [name, setName] = useState()
    const [email, setEmail] = useState()
    const [phone,setPhone] = useState()
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [confirmPass, setConfirmPass] = useState()
    const [gender, setGender] = useState()
    const [dateOfBirth, setDateOfBirth] = useState({ day: '', month: '', year: '' });
    const [address, setAddress] = useState()
    const [error, setError] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleRegister = async(e) => {
      e.preventDefault();
      if (confirmPass !== password) return;
      try {
        const dateOfBirthString = `${dateOfBirth.year}-${dateOfBirth.month}-${dateOfBirth.day}`;
        const res = await fetch('http://localhost:4000/v1/user/register',{
          headers: {
            'Content-Type': "application/json"
          },
          method: "POST",
          body: JSON.stringify({name,email,phone,username,password,gender,address,dateOfBirth: dateOfBirthString})
        })
      if(res.status === 500){
        throw new Error("Wrong credentials")
      }
      const data = await res.json()
      console.log(data)
      dispatch(register(data))
      navigate("/")
      } catch (error) {
          setError(prev => true)
          setTimeout(() => {
          setError(prev => false)
      },2500)
        console.error(error);
      }
    }

    return (
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <h2 className={classes.title}>Register</h2>
            <form onSubmit={handleRegister}>
              <label htmlFor="username">
                <input onChange={(e) => setUsername(e.target.value)} type="text" id="username" placeholder="Enter username" />
              </label>
              <label htmlFor="name">
                <input onChange={(e) => setName(e.target.value)} type="text" id="name" placeholder="Enter name" />
              </label>
              <label htmlFor="email">
                <input onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder="Enter email" />
              </label>
              <label htmlFor="phone">
                <input onChange={(e) => setPhone(e.target.value)} type="text" id="phone" placeholder="Enter phone" />
              </label>
              <label htmlFor="address">
                <input onChange={(e) => setAddress(e.target.value)} type="text" id="address" placeholder="Enter address" />
              </label>
              <label htmlFor="gender">
                <select onChange={(e) => setGender(e.target.value)} id="gender">
                  <option value="">Gender</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </label>
              <label>
                <select value={dateOfBirth.day} onChange={(e) => setDateOfBirth({ ...dateOfBirth, day: e.target.value })}>
                  <option value="">Day</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <select value={dateOfBirth.month} onChange={(e) => setDateOfBirth({ ...dateOfBirth, month: e.target.value })}>
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
                <select value={dateOfBirth.year} onChange={(e) => setDateOfBirth({ ...dateOfBirth, year: e.target.value })}>
                  <option value="">Year</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </label>
              <label htmlFor="password">
                <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Enter password" />
              </label>
              <label htmlFor="confirmPass">
                <input onChange={(e) => setConfirmPass(e.target.value)} type="password" id="confirmPass" placeholder="Confirm password" />
              </label>
              <button className={classes.submitBtn}>Register</button>
              <Link to='/login'>Already have an account? <p className={classes.login}>Login now</p></Link>
            </form>
        </div>
      </div>
    )
}

export default Register