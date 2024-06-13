import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo.jpg";
import classes from "./home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from 'axios';
import SideBar from "../sidebar/sidebar";
import TopicMenu from "../../topicmenu/topicmenu";

export const Home = () => {
  const [users, setUsers] = useState("");
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [noUsersLeft, setNoUsersLeft] = useState(false);
  // const [image, setImage] = useState({ preview: '', raw: '' })
  const [allImages, setAllImages] = useState(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMatchedAlert, setShowMatchedAlert] = useState(false);
  const { user, token } = useSelector((state) => state.auth);

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
    getImage()
  },[])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("http://localhost:4000/v1", {
          headers: {
            'token': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const handleLike = async () => {
    try {
      const res = await fetch("http://localhost:4000/v1/like", {
        headers: {
          "Content-Type": "application/json",
          'token': `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ likeUserId: users[currentUserIndex]._id }),
      });
      const data = await res.json();
      // console.log(data);
      if (data.matched) {
        setShowMatchedAlert(true); 
        setTimeout(() => {
          setShowMatchedAlert(false); 
        }, 3000);
      }
      moveToNextUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await fetch("http://localhost:4000/v1/dislike", {
        headers: {
          "Content-Type": "application/json",
          'token': `Bearer ${token}`,
        },
        method: "POST",
        body: JSON.stringify({ dislikeUserId: users[currentUserIndex]._id }),
      });
      const data = await res.json();
      // console.log(data);
      moveToNextUser();
    } catch (error) {
      console.error(error);
    }
  };

  const moveToNextUser = () => {
    if (currentUserIndex === users.length - 1) {
      setNoUsersLeft(true);
    } else {
      setCurrentUserIndex((prev) => prev + 1);
    }
  };

  const currentUser = users && users[currentUserIndex];

  const getImage = async () => {
    const res = await axios.get("http://localhost:4000/v1/get-image", {
      headers: {
        'token': `Bearer ${token}`
      }
    });
    // console.log(res);
    setAllImages(res.data);
  };
  console.log(allImages);

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, allImages.length - 1));
  };

  return (
    <div className={classes.wrapper}>
      <SideBar menu={Menu} />
      <h1 className={classes.bumble}>
          <img className={classes.logo} src={Logo} alt="" />
      </h1>
      {showMatchedAlert && (
        <div className={classes.matchedAlert}>
          <p>It's a match!</p>
        </div>
      )}
      {!noUsersLeft && currentUser && (
        <div className={classes.BoxBumble}>
          <div className={classes.img}>
            {allImages && allImages.map((data) => {
              if (data._id === currentUser._id) {
                const imagePath = data.image.replace('src', '');
                console.log(imagePath);
                return (
                  <img
                    className={classes.avatar}
                    src={`http://localhost:4000${imagePath}`}
                    alt=""
                  />
                );
              }
            return null;
          })}
          </div>
          <div className={classes.profile}>
            <h1 className={classes.name}>{currentUser.name}, {currentUser.age}</h1>
            <h2 className={classes.address}>{currentUser.address}</h2>  
            <p className={classes.bio}>{currentUser.bio}</p>
            <div className={classes.btn}>
              <button onClick={handleLike} className={classes.BtnHeart}>
                <FontAwesomeIcon className={classes.iconHeart} icon={faHeart} />
              </button>
              <button onClick={handleDislike} className={classes.BtnCancel}>
                <FontAwesomeIcon className={classes.iconX} icon={faXmark} />
              </button>
            </div>
          </div>
        </div>
      )}
      {noUsersLeft && (
        <div className={classes.noUsersLeft}>
          <p>Không còn người nào gần bạn.</p>
        </div>
      )}
    </div>
  );
};
