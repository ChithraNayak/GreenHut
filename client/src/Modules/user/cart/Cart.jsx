import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Box,
  Button,
  Card,
  CardContent,Snackbar,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Add, Remove, Delete } from "@mui/icons-material";
import axios from "axios";
import config from "../../../config";


const api = axios.create({
  baseURL: config.host + "/api",
  timeout: 1000,
});

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const response = await api.get('cart/cart', {
        headers: { "auth-token": token }
      });
      setCartItems(response.data.cart.products);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleIncrement = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const response = await api.put('/cart/increment', { productId: id }, {
        headers: { "auth-token": token }
      });
      
      fetchCartItems();
      setCartItems(response.data.cart.products);
    } catch (error) {
      console.error('Error incrementing item:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error adding to cart.',
        severity: 'error'
      });
    }
  };
  

  const handleDecrement = async (id) => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const response = await api.put('/cart/decrement', { productId: id }, {
        headers: { "auth-token": token }
      });
      fetchCartItems();
      setCartItems(response.data.cart.products);
    } catch (error) {
      console.error('Error decrementing item:', error);
    }
  };

  const handleDelete = async (id) => {
    console.log(id,'idid');
    
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const response = await api.delete('/cart/remove', {
        headers: { "auth-token": token },
        data: { productId: id }
      });
      fetchCartItems();
      setCartItems(response.data.cart.products);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const calculateTotal = (price, quantity) => {
    return price * quantity;
  };

  const calculateCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + calculateTotal(item?.productId?.price, item.quantity),
      0
    );
  };

  return (
    <Box sx={{ padding: "3rem 10rem", backgroundColor: "#f5f5f5" }}>
      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#388e3c", color: "#fff" }}>
              <TableCell sx={{ color: "#fff" }}>Product</TableCell>
              <TableCell align="center" sx={{ color: "#fff" }}>
                Quantity
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff" }}>
                Price
              </TableCell>
              <TableCell align="right" sx={{ color: "#fff" }}>
                Total
              </TableCell>
              <TableCell align="center" sx={{ color: "#fff" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell sx={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`${config.host}/uploads/${item?.productId?.image}`}
                    alt={item?.name}
                    style={{ marginRight: 10, width: 150, height: 150 }}
                  />
                  {item.name}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDecrement(item?.productId?._id)}>
                    <Remove />
                  </IconButton>
                  {item.quantity}
                  <IconButton onClick={() => handleIncrement(item?.productId?._id)}>
                    <Add />
                  </IconButton>
                </TableCell>
                <TableCell align="right">₹{item?.productId?.price?.toFixed(2)}</TableCell>
                <TableCell align="right">
                  ₹{calculateTotal(item?.productId?.price, item.quantity)?.toFixed(2)}
                </TableCell>
                <TableCell align="center">
                  <IconButton onClick={() => handleDelete(item?.productId?._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Card
        sx={{
          marginTop: "2rem",
          padding: "1rem",
          boxShadow: 3,
          borderRadius: 2,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="div"
            gutterBottom
            sx={{ color: "#388e3c" }}
          >
            CART TOTAL
          </Typography>
          <Typography
            variant="h6"
            component="div"
            sx={{ marginBottom: "1rem" }}
          >
            ₹{calculateCartTotal().toFixed(2)}
          </Typography>
          <Link to="/checkout">
            <Button
              variant="contained"
              color="primary"
              sx={{ backgroundColor: "#388e3c" }}
            >
              PROCEED TO CHECKOUT
            </Button>
          </Link>
        </CardContent>
      </Card>
      <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
    </Box>
  );
};

export default Cart;
