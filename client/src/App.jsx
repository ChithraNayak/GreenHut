import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./Modules/admin/Route/AdminRoute";
import ExpertRoute from "./Modules/expert/Route/ExpertRoute";
import DeliveryRoute from "./Modules/worker/Route/DeliveryRoute";
import HomePage from "./Modules/user/HomePage";
import CustomerLoginRegister from "./Modules/user/CustomerLoginRegister";
import Products from "./Modules/user/products";
import Experts from "./Modules/user/experts/Experts";
import Orders from "./Modules/user/orders/Orders";
import ContactUs from "./Modules/user/ContactUs";
import AboutUs from "./Modules/user/AboutUs";
import MyBookings from "./Modules/user/booking/MyBookings";
import ExpertDetails from "./Modules/user/experts/ExpertDetails";
import Cart from "./Modules/user/cart";
import Checkout from "./Modules/user/cart/checkout";
import Notifications from "./Modules/user/notification/Notifications";
import ProductsTest from "./Modules/user/products/ProductsTest";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          
          <Route exact path="/*" element={<HomePage />} />
          <Route exact path="/admin/*" element={<AdminRoute />} />
          <Route exact path="/expert/*" element={<ExpertRoute />} />
          <Route exact path="/delivery/*" element={<DeliveryRoute />} />
          <Route exact path="/products/:category" element={<Products />} />
         <Route exact path="/login/*" element={<CustomerLoginRegister />} />
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
