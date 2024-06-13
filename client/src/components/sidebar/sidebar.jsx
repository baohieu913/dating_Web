import classes from './sidebar.module.css'
import React, { useState } from "react";
import { Layout } from "antd";
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from "react-router-dom";
import {
  AppstoreOutlined,
  UserOutlined,
  MessageOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { logout } from '../../redux/authSlice';

const SideBar = ({ menu }) => {

  const [error, setError] = useState(false)
  const { user, token } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async(e) => {
    try {
      const res = await fetch(`http://localhost:4000/v1/user/logout`, {
        headers: {
          'token': `Bearer ${token}`
        },
        method: "POST"
      });
      const data = await res.json()
      console.log(data);
      // dispatch(logout(data))
      // navigate("/login")
    } catch (error) {
      setError(prev => true)
      setTimeout(() => {
        setError(prev => false)
      }, 2500)
      console.error(error);
    }
  }

  return (
    <Layout.Sider
      className={classes.sidebarContainer}
      breakpoint={"lg"}
      theme="light"
      collapsedWidth={0}
      trigger={null}
    >
      <div className={classes.sidebar}>
        <Link to="/">
          <AppstoreOutlined /> Trang chủ
        </Link>
        <br /> 
        <Link to={`/profile/${user._id}`}>
          <UserOutlined /> Hồ sơ
        </Link>
        <br /> 
        <Link to="/chat">
          <MessageOutlined /> Tin nhắn
        </Link>
        <br /> 
        <Link className={classes.x} to={"/login"}>
          <LogoutOutlined /> Đăng xuất
        </Link>
        <br /> 
      </div>
    </Layout.Sider>
  );
};

export default SideBar;
