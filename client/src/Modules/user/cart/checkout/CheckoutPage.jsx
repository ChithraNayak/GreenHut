import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Modal,
  Card,
  CardContent,
  Grid,
  Paper,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  InputAdornment,
} from "@mui/material";
// import QRCode from "react-qr-code";  // Make sure to install react-qr-code
import axios from "axios";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";

const api = axios.create({
  baseURL: config.host + "/api",
  timeout: 1000,
});

const CheckoutPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryOption: "",
    address: "",
    street: "",
    pincode: "",
    paymentMethod: "", // Add paymentMethod field
  });

  const [errors, setErrors] = useState({});
  const [order, setOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [transactionID, setTransactionID] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("userToken"));
        const response = await api.get("/cart/cart", {
          headers: { "auth-token": token },
        });
        setOrder(response.data.cart.products);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    let tempErrors = { ...errors };
    switch (name) {
      case "name":
        if (!value) tempErrors.name = "Name is required";
        else delete tempErrors.name;
        break;
      case "email":
        if (!value) tempErrors.email = "Email Address is required";
        else if (!/\S+@\S+\.\S+/.test(value))
          tempErrors.email = "Email Address is invalid";
        else delete tempErrors.email;
        break;
      case "phone":
        if (!value) tempErrors.phone = "Phone number is required";
        else if (!/^\d{10}$/.test(value))
          tempErrors.phone = "Phone number is invalid";
        else delete tempErrors.phone;
        break;
      case "pincode":
        if (!value) tempErrors.pincode = "Pincode is required";
        else if (!/^\d{6}$/.test(value))
          tempErrors.pincode = "Pincode is invalid";
        else delete tempErrors.pincode;
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  };

  const validateForm = () => {
    let tempErrors = {};
    if (!formData.name) tempErrors.name = "Name is required";
    if (!formData.email) {
      tempErrors.email = "Email Address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email Address is invalid";
    }
    if (!formData.phone) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      tempErrors.phone = "Phone number is invalid";
    }
    if (!formData.pincode) {
      tempErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      tempErrors.pincode = "Pincode is invalid";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setOpenModal(true);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handlePayment = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));
      // Create order first
      const orderResponse = await api.post(
        "/order/create",
        {
          ...formData,
          products: order,
        },
        {
          headers: { "auth-token": token },
        }
      );
      // Extract order ID
      const orderId = orderResponse.data.order._id;
      // Process payment
      await api.post(
        "/payment/create",
        {
          orderId,
          products: order,
          paymentMethod: formData.paymentMethod,
          transactionId: transactionID,
          cardDetails:
            formData.paymentMethod === "card"
              ? {
                  cardNumber: "", // Add actual card number
                  cardHolderName: "", // Add actual cardholder name
                  expiryDate: "", // Add actual expiry date
                  cvv: "", // Add actual CVV
                }
              : {},
        },
        {
          headers: { "auth-token": token },
        }
      );
      console.log("Order and payment processed successfully");
      handleModalClose();
      await navigate("/my-orders");
      // Optionally, redirect to a confirmation page or display a success message
    } catch (error) {
      console.error("Error processing payment:", error);
      // Handle the error (e.g., show an error message)
    }
  };

  const years = [2024, 2025, 2026, 2027, 2028, 2029];

  const calculateTotal = () => {
    let total = order.reduce(
      (total, item) => total + item?.productId?.price * item.quantity,
      0
    );
    if (total < 250) {
      total += 50; // Delivery charge
    }
    return total;
  };
  const [cardholderName, setCardholderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiryDate, setExpiryDate] = useState(years[0]);
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    validateForm2(); // Validate form on input changes
  }, [cardholderName, cardNumber, cvv, expiryDate, transactionID, formData.paymentMethod]);

  const validateForm2 = () => {
    if (formData.paymentMethod === "card") {
      const cardValid = cardholderName && cardNumber.length === 16 && cvv.length === 3 && expiryDate;
      setIsValid(cardValid);
    } else if (formData.paymentMethod === "upi") {
      setIsValid(transactionID.length === 16); // Ensure Transaction ID is not empty
    } else if (formData.paymentMethod === "cod") {
      setIsValid(true); // No additional validation for Cash on Delivery
    }
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: "5rem 10rem",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box sx={{ width: "60%", marginRight: "2rem" }}>
        <Paper sx={{ padding: "2rem", boxShadow: 3, borderRadius: 2 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Shipping Details
          </Typography>
          <form onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Delivery Option</InputLabel>
                  <Select
                    name="deliveryOption"
                    value={formData.deliveryOption}
                    onChange={handleChange}
                    label="Delivery Option"
                  error={!!errors.deliveryOption}

                  >
                    <MenuItem value="Mangalore">Mangalore</MenuItem>
                    <MenuItem value="Udupi">Udupi</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Delivery Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Street"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  error={!!errors.pincode}
                  helperText={errors.pincode}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    label="Payment Method"
                  >
                    {/* <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem> */}
                    <MenuItem value="cod">Cash on Delivery</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ marginTop: "1rem", backgroundColor: "#388e3c" }}
              type="submit"
            >
              PLACE ORDER
            </Button>
          </form>
        </Paper>
      </Box>
      <Box sx={{ width: "35%" }}>
        <Card sx={{ boxShadow: 3, borderRadius: 2, padding: "2rem 3rem" }}>
          <CardContent>
            <Typography variant="h5" component="div" gutterBottom>
              YOUR ORDER
            </Typography>
            
            {order.map((item) => (
              <Box
                key={item.productId}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <Typography variant="body1">
                  {item.productId.name} (x{item.quantity})
                </Typography>
                <Typography variant="body1">
                  ₹{(item.productId.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Typography
              variant="h6"
              component="div"
              sx={{ marginTop: "1rem", fontWeight: "bold" }}
            >
              Order Total: ₹{calculateTotal().toFixed(2)}
            </Typography>
            {/* <Typography variant="h6" component="div" gutterBottom>
              (Rs 50 for Delivery Charge)
            </Typography> */}
          </CardContent>
        </Card>
      </Box>

      {/* Payment Modal */}
      <Modal
      open={openModal}
      onClose={handleModalClose}
      sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <Box
        sx={{
          width: 400,
          padding: 3,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Payment Details
        </Typography>
        <Typography variant="body1">
          You are paying: ₹{calculateTotal().toFixed(2)}
        </Typography>
        <Typography variant="body1">
          Reason:{" "}
          {formData.deliveryOption
            ? `Delivery in ${formData.deliveryOption}`
            : "Order"}
        </Typography>
        {formData.paymentMethod === "card" && (
          <>
            <TextField
              fullWidth
              label="Cardholder Name"
              margin="normal"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
            />
            <TextField
              fullWidth
              label="Card Number"
              margin="normal"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              InputProps={{
                inputProps: { maxLength: 16 },
              }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  margin="normal"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  InputProps={{
                    inputProps: { maxLength: 3 },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  select
                  fullWidth
                  label="Expiration Date"
                  margin="normal"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  defaultValue={years[0]} // Set a default value (e.g., 2024)
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </>
        )}
        {formData.paymentMethod === "upi" && (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <img width={200} src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/QR_code_for_mobile_English_Wikipedia.svg/1024px-QR_code_for_mobile_English_Wikipedia.svg.png" />
              {/* <QRCode value="https://dummyqr.com/qr-code" /> */}
            </Box>
            <TextField
              fullWidth
              label="Transaction ID"
              margin="normal"
              value={transactionID}
              onChange={(e) => setTransactionID(e.target.value)}
              InputProps={{
                inputProps: { maxLength: 16 },
              }}
            />
          </>
        )}
        {formData.paymentMethod === "cod" && (
          <Typography variant="body1">
            Cash on Delivery selected. No additional details required.
          </Typography>
        )}
        <Box sx={{ marginTop: 2, textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePayment}
            disabled={!isValid}
          >
            Confirm Payment
          </Button>
        </Box>
      </Box>
    </Modal>
    </Box>
  );
};

export default CheckoutPage;
