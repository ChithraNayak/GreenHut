import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Typography,
  Box,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../layout";
import axios from "axios";
import moment from "moment";
import config from "../../../config";

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

const HeaderSection = () => (
  <Box
    sx={{
      position: "relative",
      height: 300,
      backgroundImage: "url('/assets/images/background_image.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
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
      Notifications
    </Typography>
  </Box>
);

const NotificationItem = ({ notification, onDelete }) => (
  <ListItem
    component={Paper}
    sx={{ backgroundColor: "#00640026", borderRadius: "0px" }}
    // secondaryAction={
    //   <IconButton
    //     edge="end"
    //     aria-label="delete"
    //     onClick={() => onDelete(notification.id)}
    //     sx={{ color: theme.palette.error.main }} // Set the color to red
    //   >
    //     <DeleteIcon />
    //   </IconButton>
    // }
  >
    <ListItemText
      primary={
        <Typography gutterBottom sx={{ fontWeight: "600" }}>
          {notification.message}
        </Typography>
      }
      secondary={moment(notification.createdAt).format("DD-MM-YYYY")}
      primaryTypographyProps={{ variant: "body1" }}
      secondaryTypographyProps={{ variant: "body2", color: "textSecondary" }}
    />
  </ListItem>
);

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      let token = JSON.parse(localStorage.getItem("userToken"));
      axios
        .get(`${config.host}/api/users/getAllNotifications`, {
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
      setLoading(false);
    }, 2000); // Simulate 2 seconds loading time
  }, []);

  const handleDelete = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
    setSnackbarMessage("Notification deleted successfully.");
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <HeaderSection />
        <Container maxWidth="lg" sx={{ padding: "5rem 2rem" }}>
          <Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : notifications.length === 0 ? (
              <Typography variant="h6" align="center">
                No notifications available.
              </Typography>
            ) : (
              <List>
                {notifications.map((notification) => (
                  <React.Fragment key={notification.id}>
                    <NotificationItem
                      notification={notification}
                      onDelete={handleDelete}
                    />
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Container>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Layout>
    </ThemeProvider>
  );
};

export default Notifications;
