import React, { useRef, useState } from 'react'
import classes from './chat.module.css'
import Conversation from '../conversation/Conversation'
import Message from '../message/Message'
import Woman from '../../assets/Woman.jpg'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client' 
import SideBar from "../sidebar/sidebar";
import TopicMenu from "../../topicmenu/topicmenu";

const Chat = () => {

  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [message, setMessage] = useState("")
  const [lastConversationClicked, setLastConversationClicked] = useState("")
  const [comingMessage, setComingMessage] = useState("")
  const [otherUser, setOtherUser] = useState("")
  const { user, token } = useSelector((state) => state.auth)

  const topics = ["Trang chủ", "Hồ sơ", "Tin nhắn", "Đăng xuất"];
  const [contentIndex, setContentIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState("0");
  const changeSelectedKey = (event) => {
    const key = event.key;
    setSelectedKey(key);
    setContentIndex(+key);
  };
  const Menu = (
    <TopicMenu
      topics={topics}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );

  const socket = useRef()

  useEffect(() => {
    socket.current = io("ws://localhost:8088")
    socket.current.on('getMessage', data => {
      setComingMessage({
        senderId: data.senderId,
        messageText: data.text,
        createdAt: Date.now()
      })
    })
  },[])

  useEffect(() => {
    comingMessage && 
    lastConversationClicked.members.includes(comingMessage.senderId) &&
    setMessages(prev => [...prev, comingMessage])
  }, [comingMessage, lastConversationClicked])

  useEffect(() => {
    socket.current.emit("addUser", user._id)
  },[user._id])

  useEffect(() => {
    const fetchUserConvos = async () => {
      try {
        const res = await fetch(`http://localhost:4000/v1/conversation/find/${user._id}`, {
          headers: {
            'token': `Bearer ${token}`
          }
        });
        const convos = await res.json()
        setConversations(prev => convos)
      } catch(err) {
        console.error(err);
      }
    }
    fetchUserConvos()
  }, [user._id])

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:4000/v1/message/${lastConversationClicked._id}`, {
          headers: {
            'token': `Bearer ${token}`
          }
        });
        const messages = await res.json()
        setMessages(prev => messages)
      } catch (error) {
        console.error(error);
      }
    }
    lastConversationClicked && fetchMessages()
  }, [lastConversationClicked])

  useEffect(() => {
    const fetchOtherUser = async () => {
      try {
        const otherUserId = lastConversationClicked?.members?.find(member => member !== user._id)
        const res = await fetch(`http://localhost:4000/v1/user/find/${otherUserId}`);
        const data = await res.json();
        setOtherUser(prev => data)
      } catch (error) {
        console.error(error);
      }
    }
    lastConversationClicked && fetchOtherUser()
  }, [lastConversationClicked])

  const handlePostMessage = async () => {
    try {
      const res = await fetch(`http://localhost:4000/v1/message`, {
        headers: {
          'Content-Type': "application/json",
          'token': `Bearer ${token}`
        },
        method: "POST",
        body: JSON.stringify({conversationId: lastConversationClicked._id, messageText: message})
      });
      const data = await res.json();
      setMessages(prev => [...prev, data])
      const otherUserId = lastConversationClicked?.members?.find(member => member !== user._id)
      socket.current.emit('sendMessage', {
        senderId: user._id,
        otherUserId,
        text: message
      })
      setMessage("")
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className={classes.container}>
      <SideBar menu={Menu} />
      <div className={classes.wrapper}>
        <div className={classes.left}>
          <h2 className={classes.title}>{user.name}</h2>
          {conversations?.map(c => (
            <div key={c._id} onClick={() => setLastConversationClicked(prev => c)}>
              <Conversation conversation={c} currentUser={user} />
            </div>
          ))}
        </div>
        <div className={classes.right}>
          { lastConversationClicked ? 
            <>
              <div className={classes.otherUserData}>
                <img src={Woman} className={classes.otherUserImg} />
                <h4 className={classes.personUserName}>{otherUser.name}</h4>
              </div>
              <div className={classes.message}>
                { messages?.length > 0 ? messages?.map(message => (
                  <Message messages={messages} key={message._id} own={message.senderId === user._id} message={message} />
                )) : <h1 style={{textAlign: "center", marginTop: "2rem", color: "#fff"}}>No message yet</h1>}
              </div>
            </>
            : <h1 style={{textAlign: "center", color: "#fff", marginTop: "20px"}}>Click a conversation</h1>
          }
          <div className={classes.inputAndBtn}>
            <input value={message} onChange={e => setMessage(prev => e.target.value)} type="text" placeholder='Type message...' className={classes.input} />
            <button onClick={handlePostMessage} className={classes.submitBtn}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat