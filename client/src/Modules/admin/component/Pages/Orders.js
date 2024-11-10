import React, { useState, useEffect } from "react";
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
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  TextField,
  TablePagination,
  createTheme,
  ThemeProvider,
  Chip,
  Rating,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import config from "../../../../config";
import AssignDelivery from "../Order/AssignDelivery";

const theme = createTheme({
  palette: {
    primary: {
      main: "#006400",
    },
    error: {
      main: "#8b0000",
    },
    secondary: {
      main: "#1976d2",
    },
  },
});

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchOrders = async () => {
    const token = JSON.parse(localStorage.getItem("userToken"));
    try {
      const response = await axios.get(`${config.host}/api/order/viewall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  };

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

  const handleConfirmOrder = async (orderId) => {
    try {
      const assign = window.confirm("Do you want to confirm this order?"); // Prompt user for assignment

      const response = await axios.post(
        `${config.host}/api/order/confirm/${orderId}`,
        { assign }
      );

      alert(response.data.message);
      // Optionally refresh or update the orders list
      fetchOrders().then((data) => setOrders(data));
    } catch (error) {
      alert(`Error confirming order: ${error.message}`);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const unassign = window.confirm("Do you want to unassign this order?"); // Prompt user for unassignment

      const response = await axios.post(
        `${config.host}/api/order/cancel/${orderId}`,
        { unassign }
      );

      alert(response.data.message);
      // Optionally refresh or update the orders list
      fetchOrders().then((data) => setOrders(data));
    } catch (error) {
      alert(`Error canceling order: ${error.message}`);
    }
  };

  const handleViewBill = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    const productsList = order.products
      .map(
        (item) =>
          `${item.productId.name} (${item.quantity} x ₹${item.productId.price})`
      )
      .join(", ");

    alert(`Bill for Order ${orderId}:
Customer: ${order.userId?.name}
Products: ${productsList}
Total Amount: ₹${order.totalAmount}
Delivery Option: ${order.deliveryOption}
Status: ${order.status}`);
  };

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

  const filteredOrders = orders.filter((order) =>
    order.products.some((product) =>
      product.productId.name.toLowerCase().includes(search.toLowerCase())
    )
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Alert severity="error">Error fetching orders: {error}</Alert>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box>
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            View All Orders
          </Typography>

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
            sx={{ mb: 2 }} // Add margin bottom of 2 units
          />
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                <TableRow>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      User ID
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Products
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Total Amount
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Delivery Option
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Status
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      Action
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order._id}>
                      <TableCell align="center">{order.userId?.name}</TableCell>
                      <TableCell align="center">
                        {order.products.map((item) => (
                          <div key={item.productId._id}>
                            {item.productId.name} ({item.quantity} x ₹
                            {item.productId.price})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="center">₹{order.totalAmount}</TableCell>
                      <TableCell align="center">
                        {order.deliveryOption}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip arrow placement="top" title={order?.feedback}>
                          <Typography
                            color={
                              order.status == "Delivered" ? "green" : "black"
                            }
                            sx={{ fontWeight: "600" }}
                          >
                            {order.status}
                          </Typography>
                          {order?.rating && (
                            <Rating
                              value={parseFloat(order?.rating)}
                              precision={0.5}
                              readOnly
                              size="small"
                            />
                          )}
                        </Tooltip>
                        <br />
                        {!order?.deliveryPersonId ? (
                          <Chip label="Delivery not Assigned" />
                        ) : (
                          <Chip
                            color={
                              order.status == "Delivered"
                                ? "success"
                                : "warning"
                            }
                            label={`${order?.deliveryPersonId?.name} | ${order?.deliveryPersonId?.phone}`}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        {/* {order?.deliveryPersonId?.name} */}
                        <Box sx={{ display: "flex" }}>
                          {order?.deliveryPersonId == "" ||
                            (order?.deliveryPersonId == null &&
                              order?.status == "Confirmed" && (
                                <AssignDelivery
                                  setState={setState}
                                  state={state}
                                  order={order}
                                />
                              ))}
                          {order?.status == "Pending" && (
                            <>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleConfirmOrder(order._id)}
                                style={{
                                  marginRight: 8,
                                  backgroundColor: theme.palette.primary.main,
                                }}
                              >
                                Confirm Order
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleCancelOrder(order._id)}
                                style={{
                                  marginRight: 8,
                                  backgroundColor: theme.palette.error.main,
                                }}
                              >
                                Cancel Order
                              </Button>
                            </>
                          )}
                          {order.status === "Canceled" ? (
                            <Typography color="error">
                              Order Canceled
                            </Typography>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleViewBill(order._id)}
                              style={{
                                backgroundColor: theme.palette.primary.main,
                              }}
                            >
                              View Bill
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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
      </Container>
    </ThemeProvider>
  );
};

export default Orders;
