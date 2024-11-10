import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  InputAdornment,
  TextField,
  TablePagination,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Layout from "../layout";
import axios from "axios";
import config from "../../../config";
import Feedback from "./Feedback"; // Import the Feedback component

const theme = createTheme({
  palette: {
    primary: {
      main: "#006400", // Deep green color
    },
    secondary: {
      main: "#ffffff", // White color
    },
    background: {
      default: "#f5f5f5", // Light background color
    },
    error: {
      main: "#d32f2f", // Red color for error
    },
  },
  typography: {
    h3: {
      fontFamily: "Berlin Sans FB",
      color: "#006400",
      fontWeight: 700,
    },
    h4: {
      fontFamily: "Berlin Sans FB",
      color: "#006400",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "Berlin Sans FB",
      color: "#006400",
      fontWeight: 500,
    },
  },
});

// HeaderSection Component
const HeaderSection = () => {
  return (
    <Box
      sx={{
        position: "relative",
        height: 300,
        backgroundImage: "url('/assets/images/background_image.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 4,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the alpha value for transparency
          zIndex: 1,
        },
        "& > *": {
          position: "relative",
          zIndex: 2,
        },
      }}
    >
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          color: theme.palette.secondary.main,
          fontWeight: "bold",
          fontSize: "4rem", // Fixed text size
        }}
      >
        View All Orders
      </Typography>
    </Box>
  );
};

const fetchOrders = async () => {
  const token = JSON.parse(localStorage.getItem("userToken"));
  try {
    const response = await axios.get(`${config.host}/api/order/view`, {
      headers: { "auth-token": token },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

const OrderTable = ({ orders, handleViewBill, handleFeedback, theme }) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
        <TableRow>
          {[
            "Product",
            "Quantity",
            "Price",
            "Total",
            "Delivery Option",
            "Status",
            "Actions",
          ].map((text) => (
            <TableCell key={text} align="center">
              <Typography
                variant="subtitle1"
                sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {text}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order._id}>
            <TableCell align="center">
              {order.products.map((product) => (
                <Box
                  key={product._id}
                  display="flex"
                  alignItems="center"
                  mb={1}
                >
                  <img
                    src={`${config.host}/uploads/${product.productId.image}`}
                    alt={`Product ${product.productId?.name}`}
                    style={{ width: 100, height: 100, marginRight: 10 }}
                  />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 2,
                    }}
                  >
                    <Typography variant="body1">
                      {product.productId.name}
                    </Typography>
                    <Typography variant="body1">{product.quantity}</Typography>
                  </Box>
                </Box>
              ))}
            </TableCell>
            <TableCell align="center">
              {order.products.reduce(
                (total, product) => total + product.quantity,
                0
              )}
            </TableCell>
            <TableCell align="center">
              ₹
              {order.products
                .reduce(
                  (total, product) =>
                    total + product.productId.price * product.quantity,
                  0
                )
                .toFixed(2)}
            </TableCell>
            <TableCell align="center">
              ₹{order.totalAmount.toFixed(2)}
            </TableCell>
            <TableCell align="center">{order.deliveryOption}</TableCell>
            <TableCell align="center">{order.status}</TableCell>
            <TableCell align="center">
              <Box display="flex" gap={1} justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleViewBill(order._id)}
                >
                  View Bill
                </Button>
                {order.status === "Delivered" && (
                  <Feedback
                    order={order}
                    handleFeedback={handleFeedback}
                    forProduct={false}
                    color="blue" // Ensure the Feedback component supports color prop
                  />
                )}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [state, setState] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [state]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleViewBill = useCallback(
    (orderId) => {
      const order = orders.find((order) => order._id === orderId);
      if (!order) {
        alert("Order not found");
        return;
      }

      const productsList = order.products
        .map(
          (item) =>
            `${item.productId.name} (${item.quantity} x ₹${item.productId.price})`
        )
        .join(", ");

      alert(`Bill for Order ${orderId}:
Products: ${productsList}
Total Amount: ₹${order.totalAmount}
Delivery Option: ${order.deliveryOption}
Status: ${order.status}`);
    },
    [orders]
  );

  const handleFeedback = useCallback((orderId) => {
    // Implement feedback logic here
    console.log("Provide feedback for order:", orderId);
  }, []);

  const filteredOrders = orders.filter(
    (order) =>
      order.products.some((product) =>
        product.productId?.name.toLowerCase().includes(search.toLowerCase())
      ) || order.deliveryOption?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">Error fetching orders: {error}</Alert>
      </Box>
    );
  }

  return (
    <Layout>
      <HeaderSection />
      <ThemeProvider theme={theme}>
        <Container>
          <Box className="main-content">
            {loading ? (
              <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Box>
                <TextField
                  label="Search Orders"
                  variant="outlined"
                  value={search}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2, mt: 2 }}
                />
                <OrderTable
                  orders={filteredOrders.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )}
                  handleViewBill={handleViewBill}
                  handleFeedback={handleFeedback}
                  theme={theme}
                />
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={filteredOrders.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Box>
            )}
          </Box>
        </Container>
      </ThemeProvider>
    </Layout>
  );
};

export default Orders;
