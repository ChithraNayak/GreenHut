import { Button, Snackbar, Alert } from "@mui/material";
import React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import config from "../../../../config";
export default function AssignDelivery({ order, state, setState }) {
  const [open, setOpen] = React.useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = React.useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`${config.host}/api/deliveryworkers`);
        setDeliveries(response.data.workers || []); // Default to an empty array if response.data.workers is undefined
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };
    fetchDeliveries();
    if (selectedDelivery != null) {
      setSelectedDelivery(null);
    }
  }, [open]);

  console.log(deliveries);
  const handleChange = (event) => {
    setSelectedDelivery(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(order?._id, { deliveryPersonId: selectedDelivery });
    try {
      const response = await axios.put(
        `${config.host}/api/order/assignDelivery/${order?._id}`,
        { deliveryPersonId: selectedDelivery }
      );
      if (response.data.success) {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "success",
        });
        setState(!state);
        handleClose();
      } else {
        setSnackbar({
          open: true,
          message: response.data.message,
          severity: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickOpen}
        style={{
          marginRight: 8,
          //   backgroundColor: theme.palette.secondary.main,
        }}
      >
        Assign Workers
      </Button>
      <Dialog
        fullWidth
        open={open}
        onClose={handleClose}
        component={"form"}
        onSubmit={handleSubmit}
      >
        <DialogTitle>Assign Delivery person</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Assign the order to a delivery person. Lorem ipsum dolor sit amet.
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="demo-simple-select-label">
              Select Delivery Person
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedDelivery}
              label="Select Delivery Person"
              onChange={handleChange}
              required
            >
              {deliveries?.map((delivery) => (
                <MenuItem key={delivery._id} value={delivery._id}>
                  {delivery?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Assign</Button>
        </DialogActions>
      </Dialog>
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
}
