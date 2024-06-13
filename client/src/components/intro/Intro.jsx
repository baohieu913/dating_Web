import React from 'react'
import datingAppPoster1 from '../../assets/datingapp_poster.jpg'
import Logo from '../../assets/Logo.jpg'
import Logo3 from '../../assets/Logo_3.jpg'
import classes from './intro.module.css'

export const Intro = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <header className={classes.header}>
          <a className={classes.logo} href='/'>
            <img className={classes.img} src={Logo} alt="" />
          </a>
        </header>
      </div>    
    </div>
  )
}
