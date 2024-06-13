import React, { useEffect, useState } from 'react'
import Woman from '../../assets/Woman.jpg'
import classes from './conversation.module.css'

const Conversation = ({ conversation, currentUser }) => {

  const [otherUser, setOtherUser] = useState("")

  useEffect(() => {
    const fetchOtherUser = async() => {
      const otherUserId = conversation.members.find(member => member !== currentUser._id)
      const res = await fetch(`http://localhost:4000/v1/user/find/${otherUserId}`);
      const data = await res.json();
      setOtherUser(prev => data)
    }
    conversation && fetchOtherUser()
  }, [conversation])

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <img src={Woman} className={classes.otherUserImg} />
        <div className={classes.metaData}>
          <div className={classes.otherUsername}>{otherUser.name}</div>
          <div className={classes.lastMsgConvo}>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Mollitia deserunt adipisci nulla soluta, libero commodi beatae dolores repellendus ullam nostrum repudiandae, modi esse animi eligendi culpa ex delectus quaerat vero.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Conversation