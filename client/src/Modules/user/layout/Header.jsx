import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import YardIcon from "@mui/icons-material/Yard";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import axios from "axios";
import config from "../../../config";

const theme = createTheme({
  palette: {
    primary: {
      main: "#006400", // Deep green color
    },
    secondary: {
      main: "#ffffff", // White color
    },
  },
  typography: {
    h3: {
      fontFamily: "Berlin Sans FB",
      color: "#ffffff",
    },
    h4: {
      fontFamily: "Berlin Sans FB",
      color: "#006400",
    },
    h5: {
      fontFamily: "Berlin Sans FB",
      color: "#006400",
    },
  },
});

const Header = () => {
  const host = config.host;
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const [token, setToken] = useState(localStorage.getItem("auth-token"));
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const tokensss = JSON.parse(localStorage.getItem('userToken'));
    if (tokensss) {
      axios.get(`${host}/api/users/getuser`, { headers: { 'auth-token': tokensss } })
        .then((res) => {
          setUser(res.data);
          setToken(tokensss); // Ensure token is set properly
        })
        .catch((err) => {
          console.log("Error: " + err);
          setToken(null); // Clear token if error occurs
        });
    }
  }, [host]);

  const performLogout = () => {
    localStorage.removeItem("userToken");
    setToken(null); // Clear token from state
    navigate("/login");
  };

  const handleClickLogout = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmLogout = () => {
    performLogout();
    handleCloseDialog();
  };

  console.log(token, 'token');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <YardIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            GREENHUT
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/about" color="inherit">
            About
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          <Button component={Link} to="/experts" color="inherit">
            Experts
          </Button>
          {token ? (
            <>
              <Button component={Link} to="/my-orders" color="inherit">
                My Orders
              </Button>
              <Button component={Link} to="/my-bookings" color="inherit">
                My Bookings
              </Button>
              <IconButton color="inherit" component={Link} to="/notifications">
                <NotificationsIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/cart">
                <ShoppingCartIcon />
              </IconButton>
              <Typography sx={{ color: "white", marginRight: 2 }}>
                {`Welcome ${user?.user?.name}`}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  borderRadius: 20, // Rounded corners for buttons
                  "&:hover": {
                    fontWeight: "bold",
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                  },
                }}
                onClick={handleClickLogout}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button component={Link} to="/login" color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* Logout Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to logout?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default Header;
