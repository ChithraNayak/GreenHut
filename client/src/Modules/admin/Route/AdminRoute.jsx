import React,{useEffect} from 'react'
import { Routes, Route,useLocation,useNavigate } from 'react-router-dom'
import Navigation from '../component/Nav/Navigation'
import Box from '@mui/material/Box';
import Home from '../component/Pages/Home';
import { styled, useTheme } from '@mui/material/styles';
import '../css/Style.css'
import Login from "../component/Pages/Login";
import Categories from '../component/Pages/Categories';
import Products from "../component/Pages/Products";
import Experts from "../component/Pages/Experts";
import Customers from "../component/Pages/Customers";
import DeliveryWorkers from "../component/Pages/DeliveryWorkers";
import Orders from "../component/Pages/Orders";
import Notification from "../component/Pages/Notification";
import Feedbacks from "../component/Pages/Feedbacks";
import CssBaseline from '@mui/material/CssBaseline';


export default function AdminRoute() {

    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
      }));
      const location = useLocation();
    

      const isLoginPage = location.pathname === '/admin/login';
      const navigate = useNavigate();
    
      
      useEffect(() => {
        if (JSON.parse(localStorage.getItem('adminToken')) == null) {
            navigate('/admin/login')
    
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
              <Route exact path="/" element={<Home />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/categories" element={<Categories />} />
              <Route exact path="/products" element={<Products />} />
              <Route exact path="/experts" element={<Experts />} />
              <Route exact path="/customers" element={<Customers />} />
              <Route
                exact
                path="/delivery-workers"
                element={<DeliveryWorkers />}
              />
              <Route exact path="/orders" element={<Orders />} />
              <Route exact path="/notification" element={<Notification />} />
              <Route exact path="/feedback" element={<Feedbacks />} />
            </Routes>
          </Box>
        </Box>
      </div>
    );
}
