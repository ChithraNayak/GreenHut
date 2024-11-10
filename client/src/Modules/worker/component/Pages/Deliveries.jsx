import React, { useState } from "react";
import { Button, Snackbar, Alert } from "@mui/material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  createTheme,
  Typography,
  styled,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import axios from "axios";
import config from "../../../../config";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    backgroundColor: "white",
    color: "black",
  },
}));

const theme = createTheme({
  palette: {
    primary: {
      main: "#006400",
    },
    secondary: {
      main: "#8FBC8F",
    },
  },
});

const getColorByStatus = (status) => {
  switch (status) {
    case "Confirmed":
      return "#ffc107"; // yellow
    case "Delivered":
      return "#28a745"; // green
    case "Dispatched":
      return "#dc3545"; // red
    case "On the Way":
      return "#007bff"; // blue
    default:
      return "#000000"; // black (fallback)
  }
};

const Deliveries = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [editStatus, setEditStatus] = useState({});
  const [allOrders, setAllOrders] = useState([]);
  const [state, setState] = useState(true);
  useEffect(() => {
    if (localStorage.getItem("deliveryToken") != null) {
      let token = JSON.parse(localStorage.getItem("deliveryToken"));
      const fetchOrders = async () => {
        try {
          const response = await axios.get(
            `${config.host}/api/order/getDeliveryPersonOrders`,
            {
              headers: { "auth-token": token },
            }
          );
          if (response.data.success) {
            setAllOrders(response.data.orders);
          } else {
            setAllOrders([]);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchOrders();
    }
  }, [state]);

  const handleStatusChange = (status, orderId) => {
    let token = JSON.parse(localStorage.getItem("deliveryToken"));
    axios
      .put(
        `${config.host}/api/order/updateOrder/${orderId}`,
        { status },
        {
          headers: { "auth-token": token },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setState(!state);
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const isEditDisabled = (status) => {
    return status === "Delivered" || status === "Declined";
  };

  return (
    <div>
      <Typography
        variant="h4"
        align="center"
        style={{ fontWeight: "bold", marginBottom: "20px" }}
      >
        Delivery Management
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
            <TableRow>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  Customer
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  Products
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  Address
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  Street | Pin code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  Amount
                </Typography>
              </TableCell>
              <TableCell>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                >
                  Status
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allOrders?.length > 0 ? (
              allOrders.map((delivery, index) => (
                <TableRow key={index}>
                  {console.log(delivery)}
                  <StyledTableCell>
                    {delivery.name}
                    <br />
                    {delivery.phone}
                  </StyledTableCell>
                  <StyledTableCell>
                    {delivery.products.map((item) => (
                      <div key={item.productId._id}>
                        {item.productId.name} ({item.quantity} x ₹
                        {item.productId.price})
                      </div>
                    ))}
                  </StyledTableCell>
                  <StyledTableCell>
                    <TextField
                      value={delivery.address}
                      fullWidth
                      multiline
                      rows={2}
                      readOnly
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {delivery.street} | {delivery?.pincode}
                  </StyledTableCell>
                  <StyledTableCell>₹{delivery.totalAmount}</StyledTableCell>
                  <StyledTableCell>
                    {delivery?.status != "Delivered" ? (
                      <FormControl fullWidth>
                        <InputLabel style={{ color: "black" }}>
                          Update Status
                        </InputLabel>
                        <Select
                          labelId="status-name-label"
                          value={delivery.status}
                          onChange={(e) =>
                            handleStatusChange(e.target.value, delivery._id)
                          }
                          // disabled={isEditDisabled(delivery.status)}
                          required
                          label="Update Status"
                          style={{ color: getColorByStatus(delivery.status) }}
                        >
                          {[
                            "Confirmed",
                            "Dispatched",
                            "On the Way",
                            "Delivered",
                          ].map((status) => (
                            <MenuItem
                              key={status}
                              value={status}
                              style={{ color: getColorByStatus(status) }}
                            >
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <Typography sx={{ fontWeight: "600", color: "green" }}>
                        Delivered
                      </Typography>
                    )}
                  </StyledTableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ fontWeight: "600", color: "red" }}
                >
                  No orders found!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Deliveries;
