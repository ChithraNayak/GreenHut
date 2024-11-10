import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import HomePage from '../HomePage';
import CustomerLoginRegister from '../CustomerLoginRegister';
import Products from '../products';
import Experts from '../experts';
import Orders from '../orders/Orders';
import ContactUs from '../ContactUs';
import AboutUs from '../AboutUs';
import MyBookings from '../booking/MyBookings';
import ExpertDetails from '../experts/ExpertDetails';
import Cart from '../cart';
import Checkout from '../cart/checkout';
import Notifications from '../notification/Notifications';
import ProductsTest from '../products/ProductsTest';
import AdminRoute from '../../admin/Route/AdminRoute';
import ExpertRoute from '../../expert/Route/ExpertRoute';
import DeliveryRoute from '../../worker/Route/DeliveryRoute';
import Navbar from '../layout/Header'; // Assuming Navbar is similar to Header
import Footer from '../layout/Footer';

// import BottomNavBar from '../Components/Navigation/BottomNav'; // Bottom Nav component

export default function UserRoute() {
    const location = useLocation();
    const [token, setToken] = useState(false);

    useEffect(() => {
        // Check localStorage for user token
        const userToken = localStorage.getItem('auth-token');
        setToken(!!userToken);
    }, []);

    const currentRoute = location.pathname;

    // Determine whether to display footer based on current route
    const shouldDisplayFooter = !currentRoute.includes('/login') && !currentRoute.includes('/register');
    // Determine whether to display BottomNavBar based on current route
    const shouldDisplayBottomNavBar = !currentRoute.includes('/login') && !currentRoute.includes('/register');

    return (
        <div>
            <CssBaseline />

            {/* Conditionally render Navbar */}
            {!currentRoute.includes('/login') && !currentRoute.includes('/register') && (
                <Navbar token={token} />
            )}

            <Box>
                <Routes>
                    {/* Public routes */}
                    <Route exact path="/" element={<HomePage />} />
                    <Route exact path="/products/:category" element={<Products />} />
                    <Route exact path="/products" element={<ProductsTest />} />
                    <Route exact path="/experts" element={<Experts />} />
                    <Route path="/experts/:id" element={<ExpertDetails />} />
                    <Route exact path="/my-bookings" element={<MyBookings />} />
                    <Route exact path="/my-orders" element={<Orders />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/notifications" element={<Notifications />} />

                    {/* Admin, Expert, and Delivery routes */}
                    <Route exact path="/admin/*" element={<AdminRoute />} />
                    <Route exact path="/expert/*" element={<ExpertRoute />} />
                    <Route exact path="/delivery/*" element={<DeliveryRoute />} />

                    {/* Auth routes */}
                    <Route exact path="/login" element={<CustomerLoginRegister />} />
                </Routes>

                {shouldDisplayFooter && <Footer />}
            </Box>

            {/* {shouldDisplayBottomNavBar && <BottomNavBar />} */}
        </div>
    );
}
