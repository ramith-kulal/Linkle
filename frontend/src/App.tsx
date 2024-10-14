
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Chat from './pages/Chat'
import Home from './pages/Home'
import React from "react";
function App() {


  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Home/>}/>
    
    <Route path="/chat" element={<Chat/>}/>
    </Routes>
    
    
    </BrowserRouter>
     
    </>
  )
}

export default App
