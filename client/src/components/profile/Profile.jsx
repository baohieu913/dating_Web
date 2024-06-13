import React, { useEffect, useState } from 'react'
import classes from './profile.module.css'
import { useSelector } from "react-redux";
import axios from 'axios';
import SideBar from "../sidebar/sidebar";
import TopicMenu from "../../topicmenu/topicmenu";

export const Profile = () => {

  const [users, setUsers] = useState("");
  const [bio, setBio] = useState('')
  const [allImages, setAllImages] = useState(null)
  const {user, token} = useSelector((state) => state.auth);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:4000/v1/user/find/${user._id}`);
        const data = await res.json();
        // console.log(data);
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [user._id])

//   const handleProfile = async (e) => {
//     e.preventDefault();
//     try {
//         const res = await fetch(`http://localhost:4000/v1/user/${user._id}`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//                 'token': `Bearer ${token}`
//             },
//             method: "PUT",
//         });
//     } catch(err) {
//         console.error(err);
//     }
//   }
    const handleProfile = async (e) => {
        e.preventDefault();
        try {
        const formData = new FormData();
        formData.append('bio', bio);
    
        const response = await axios.put(`http://localhost:4000/v1/user/${user._id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            'token': `Bearer ${token}`
            }
        });
        console.log(response.data);
        } catch (err) {
        console.error(err);
        }
    }

  console.log(users);
  const imagePath = users && users.image && users.image.substring(4);
  // console.log(imagePath);

  return (
    <div className={classes.wrapper}>
        <SideBar menu={Menu} />
        <div className={classes.generalInfo}>
            <div className={classes.avatar}>
              <img 
                className={classes.imgAvatar} 
                src="http://localhost:4000/uploads/1715182331019.jpg"
                alt="" 
                />
            </div>  
                <div>
                    {/* <h1 className={classes.name}> họ tên: <nav className={classes.name}> sadda </nav></h1> */}
                    <div className={classes.personalInfo}><h2>{users.name}, {users.age}</h2></div>
                    <div className={classes.personalInfo}><p>{users.gender}</p></div>
                    <div className={classes.personalInfo}><p>{users.address}</p></div>
                    <div className={classes.personalInfo}><p>{users.email}</p></div>
                    <div className={classes.personalInfo}><p>{users.phone}</p></div>
                </div>
        </div>
        <div className={classes.info}>
            <form onSubmit={handleProfile}>
                    <div className={classes.imgRow}>
                        <div className={classes.imgDetails}>
                            <img className={classes.img} src="http://localhost:4000/uploads/1715182331019.jpg" alt="" />
                            <input className={classes.btnAdd} type="file" name="" id="" />
                        </div>
                        <div className={classes.imgDetails}>
                            <img className={classes.img} src="" alt="" />
                            <input className={classes.btnAdd} type="file" name="" id="" />
                        </div>
                        <div className={classes.imgDetails}>
                            <img className={classes.img} src="" alt="" />
                            <input className={classes.btnAdd} type="file" name="" id="" />
                        </div>
                    </div>
                    <div className={classes.imgRow}>
                        <div className={classes.imgDetails}>
                            <img className={classes.img} src="" alt="" />
                            <input className={classes.btnAdd} type="file" name="" id="" />
                        </div>
                        <div className={classes.imgDetails}>
                            <img className={classes.img} src="" alt="" />
                            <input className={classes.btnAdd} type="file" name="" id="" />
                        </div>
                        <div className={classes.imgDetails}>
                            <img className={classes.img} src="" alt="" />
                            <input className={classes.btnAdd} type="file" name="" id="" />
                        </div>
                    </div>
                    <label htmlFor=''>
                        <input onChange={e => setBio(prev => e.target.value)} className={classes.bio} type="text" placeholder={users.bio}/>
                    </label>
                    <button className={classes.submitBtn}>Lưu</button>
            </form>
        </div>
    </div>
  )
}