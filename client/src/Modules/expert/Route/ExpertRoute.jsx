import React,{useEffect} from 'react';
import { Routes, Route,useLocation,useNavigate } from 'react-router-dom'
import Navigation from '../component/Nav/Navigation'
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import '../css/Style.css'; // Adjust path as per your file structure
import Appointments from '../component/Pages/Appointments'; // Import your expert components


import Login from '../component/Pages/Login';
import Queries from '../component/Pages/Queries';
import Home from '../component/Pages/Home';
import CssBaseline from '@mui/material/CssBaseline';

export default function ExpertRoute() {
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

  const location = useLocation();

  const isLoginPage = location.pathname === '/expert/login';
  const navigate = useNavigate();

  
  useEffect(() => {
    if (JSON.parse(localStorage.getItem('expertToken')) == null) {
        navigate('/expert/login')

    }

}, [])
  return (
    <div>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {!isLoginPage && <Navigation />}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, background: "#f0f1f6" }}
        >
           {!isLoginPage && <DrawerHeader />}
          <Routes>
          <Route exact path="/login" element={<Login />} />
            <Route exact path="/" element={<Home />} />
            <Route exact path="/home" element={<Home />} />
            <Route exact path="/appointments" element={<Appointments />} />
            
            <Route exact path="/queries" element={<Queries />} />
            {/* Add additional routes for other expert components as needed */}
          </Routes>
        </Box>
      </Box>
    </div>
  );
}
