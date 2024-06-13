import './App.css';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Chat from './components/chat/Chat';
import {Routes, Route, Navigate} from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Intro } from './components/intro/Intro';
import { Profile } from './components/profile/Profile';
import { Home } from './components/home/Home';

function App() {
  const {user} = useSelector(state => state.auth)
  return (
    <div>
      <Routes>
        <Route path='/' element={user ? <Home /> : <Navigate to ='/login' />} />
        <Route path='/profile/:id' element={user ? <Profile /> : <Navigate to ='/login' /> }/>
        <Route path='/chat' element={user ? <Chat /> : <Navigate to='/login' />} />
        <Route path='/login' element={!user ? <Login /> : <Navigate to='/' />} />
        <Route path='/register' element={!user ? <Register /> : <Navigate to='/' />} />
      </Routes>
    </div>
  );
}

export default App;
