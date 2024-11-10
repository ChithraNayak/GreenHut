import React,{useEffect} from 'react';
import { Routes, Route,useLocation,useNavigate } from 'react-router-dom'
import Navigation from '../component/Nav/Navigation'
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import '../css/Style.css'; // Adjust path as per your file structure
import Deliveries from '../component/Pages/Deliveries'; // Import your delivery components
import Home from '../component/Pages/Home';
import Login from "../component/Pages/Login";

import CssBaseline from '@mui/material/CssBaseline';

export default function DeliveryRoute() {
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const location = useLocation();

  const isLoginPage = location.pathname === '/delivery/login';
  const navigate = useNavigate();

  
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('deliveryToken')) == null) {
        navigate('/delivery/login')

    }

}, [])
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {!isLoginPage && <Navigation />}
       
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, background: "#f0f1f6", height: "100vh" }}
        >
          {!isLoginPage && <DrawerHeader />}
          
          <Routes>
          <Route exact path="/login" element={<Login />} />

            <Route exact path="/" element={<Home />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/deliveries" element={<Deliveries />} />
            
            {/* Add additional routes for other delivery components as needed */}
          </Routes>
        </Box>
      </Box>
    </div>
  );
}
