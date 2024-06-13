import { Menu, Dropdown } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  MessageOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import classes from "./topicmenu.module.css";

const TopicMenu = ({ topics, selectedKey, changeSelectedKey }) => {
  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={changeSelectedKey}
    >
      {topics.map((topic, index) => (
        <Menu.Item key={index} >
          {index === 0 && <AppstoreOutlined style={{ fontSize: '16px', color: 'rgb(26, 47, 105)',paddingRight:'10px' }} />}
          {index === 1 && <UserOutlined style={{ fontSize: '16px', color: 'rgb(26, 47, 105)',paddingRight:'10px' }} />}
          {index === 2 && <MessageOutlined style={{ fontSize: '16px', color: 'rgb(26, 47, 105)',paddingRight:'10px' }} />}
          {index === 3 && <LogoutOutlined className={classes.logout} style={{ fontSize: '16px', color: 'rgb(26, 47, 105)',paddingRight:'10px' }}/>}
          {topic}
        </Menu.Item>
        
      ))}
      
    </Menu>
  );
};

export default TopicMenu;
