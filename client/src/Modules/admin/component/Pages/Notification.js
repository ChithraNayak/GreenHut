import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { Send, Delete, Cancel } from "@mui/icons-material";
import axios from "axios";
import config from "../../../../config";
const deepGreen = "#006400"; // Custom deep green color

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);
  const [formValues, setFormValues] = useState({
    type: "announcement", // Default type set to "announcement"
    message: "",
    // link: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("adminToken"));
    axios
      .get(`${config.host}/api/admin/getAllNotifications`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        if (res.data.success) {
          setNotifications(res.data.notifications);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormValues({ type: "announcement", message: "", link: "" }); // Reset type to "announcement" when closing
  };

  const handleSend = () => {
    if (formValues.message.trim()) {
      let message = formValues.message;
      if (formValues.type === "productAvailability") {
        message += " A new product is available!";
      }
      let token = JSON.parse(localStorage.getItem("adminToken"));
      axios
        .post(`${config.host}/api/admin/sendNotification`, formValues, {
          headers: { "auth-token": token },
        })
        .then((res) => {
          if (res.data.success) {
            setState(!state);
            setSnackbar({
              open: true,
              message: res.data.message,
              severity: "success",
            });
            handleClose();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleDelete = (id) => {
    console.log(id);
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
    let token = JSON.parse(localStorage.getItem("adminToken"));
    axios
      .delete(`${config.host}/api/admin/deleteNotification/${id}`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        if (res.data.success) {
          setState(!state);
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Box>
      <Typography
        gutterBottom
        align="center"
        variant="h4"
        sx={{ mb: 3, fontWeight: "bold", color: "black" }}
      >
        Notifications to Customers
      </Typography>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Send />}
        onClick={handleOpen}
        sx={{
          mb: 2,
          bgcolor: deepGreen,
          "&:hover": { bgcolor: "#004d00" }, // Darker shade on hover
        }}
      >
        New Notification
      </Button>
      <List>
        {notifications.map((notification) => (
          <Paper key={notification.id} sx={{ mb: 2 }}>
            <ListItem>
              <ListItemText
                primary={notification.message}
                secondary={
                  <>
                    <Typography variant="body2" color="textSecondary">
                      Type:{" "}
                      {notification.type === "announcement"
                        ? "Announcement"
                        : "Update"}
                    </Typography>
                    {notification.link && (
                      <Typography variant="body2" color="textSecondary">
                        Link:{" "}
                        <a href={notification.link}>{notification.link}</a>
                      </Typography>
                    )}
                  </>
                }
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  color="secondary"
                  onClick={() => handleDelete(notification._id)}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
            <Divider />
          </Paper>
        ))}
      </List>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Notification</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the details of the notification you want to send to the
            Customers.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            name="message"
            label="Notification Message"
            type="text"
            fullWidth
            variant="outlined"
            value={formValues.message}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
          {/* <TextField
            margin="dense"
            name="link"
            label="Optional Link"
            type="url"
            fullWidth
            variant="outlined"
            value={formValues.link}
            onChange={handleChange}
            sx={{ mt: 2 }}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
            startIcon={<Cancel />}
          >
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary" startIcon={<Send />}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Notifications;
