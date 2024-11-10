import React, { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import YardIcon from "@mui/icons-material/Yard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping"; // New icon for deliveries
import LogoutIcon from '@mui/icons-material/Logout'; // Icon for Logout
import axios from "axios";
import config from "../../../../config";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const drawerWidth = 240;

const deepGreen = "#004d00";

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: deepGreen,
  color: "white",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: deepGreen,
  color: "white",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  backgroundColor: deepGreen,
  color: "white",
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  backgroundColor: deepGreen,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Navigation = () => {
  const host = config.host;
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const currentRoute = location.pathname;

    if (currentRoute.includes("/worker/home")) {
      setActiveItem("Home");
    } else if (currentRoute.includes("/worker/deliveries")) {
      setActiveItem("Deliveries");
    } else {
      setActiveItem("");
    }
  }, [location.pathname]);

  const sideBarList = [
    {
      title: "Dashboard",
      path: "/delivery/home",
      icon: <DashboardIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Deliveries",
      path: "/delivery/deliveries",
      icon: <LocalShippingIcon sx={{ fontSize: "14px", color: "white" }} />, // Updated icon
    },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // Clear authentication tokens and other logout related tasks
    localStorage.removeItem('auth-token'); // or sessionStorage
    navigate('/login'); // Redirect to login page
  };

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
    localStorage.removeItem("deliveryToken");
    setToken(null); // Clear token from state
    navigate("/delivery/login");
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

  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" open={open} className="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              color: "white",
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ color: "white", fontWeight: "500" }}
          >
            Delivery Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
         
          <IconButton color="inherit" aria-label="logout" onClick={handleClickLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <Box className="sidebar-body">
          <DrawerHeader
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                paddingLeft: "15px",
              }}
            >
              <YardIcon sx={{ fontSize: "29px", color: "white" }} />
              <Typography variant="h6" sx={{ ml: 1, color: "white" }}>
                Green Hut
              </Typography>
            </Box>
            <IconButton onClick={handleDrawerClose} sx={{ color: "white" }}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon  />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <List>
            {sideBarList.map((item) => (
              <ListItem
                key={item.title}
                disablePadding
                sx={{ display: "block" }}
              >
                <Link
                  to={item.path}
                  style={{ textDecoration: "none", color: "white" }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                      backgroundColor:
                        activeItem === item.title
                          ? deepGreen
                          : "transparent",
                      "&:hover": {
                        backgroundColor: "rgba(194, 244, 219, 0.15)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: "white",
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        borderRadius: "5px",
                        padding: 1,
                        "&:hover": {
                          backgroundColor: "rgba(194, 244, 219, 0.15)",
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.title}
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                  </ListItemButton>
                </Link>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
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
    </>
  );
};

export default Navigation;
