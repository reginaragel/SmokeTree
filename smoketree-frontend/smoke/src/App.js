import './App.css';
import React,{useState} from 'react';
import LoginPage from './components/LoginPage';
import {Routes,Route} from 'react-router-dom';
import { UserContextProvider } from './components/UserContext';
import SignupPage from './components/SignupPage';
import MainPage from './components/MainPage';

function App() {
  const [token,setToken]=useState(null);
  return (
      
        <UserContextProvider value={{token,setToken}}>
          <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/signup' element={<SignupPage/>}/>
          </Routes>

        </UserContextProvider>
    
  );
}

export default App;
