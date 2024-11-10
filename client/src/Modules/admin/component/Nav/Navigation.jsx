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
import CategoryIcon from "@mui/icons-material/Category";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ReceiptIcon from "@mui/icons-material/Receipt";
import FeedbackIcon from "@mui/icons-material/Feedback";
import YardIcon from "@mui/icons-material/Yard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Link, useLocation } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import LogoutIcon from "@mui/icons-material/Logout"; // Icon for Logout
import axios from "axios";
import config from "../../../../config";
import { useNavigate } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const drawerWidth = 240;

const deepgreen = "#004d00"; // Define deepgreen color for consistency

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: deepgreen, // Apply deepgreen color
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
  backgroundColor: deepgreen, // Apply deepgreen color
  color: "white",
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  backgroundColor: deepgreen, // Apply deepgreen color
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
  backgroundColor: deepgreen, // Apply deepgreen color to the AppBar
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
  const theme = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("");

  useEffect(() => {
    const currentRoute = location.pathname;

    if (currentRoute.includes("/admin/categories")) {
      setActiveItem("Categories");
    } else if (currentRoute.includes("/admin/products")) {
      setActiveItem("Products");
    } else if (currentRoute.includes("/admin/experts")) {
      setActiveItem("Experts");
    } else if (currentRoute.includes("/admin/customers")) {
      setActiveItem("Customers");
    } else if (currentRoute.includes("/admin/delivery-workers")) {
      setActiveItem("Delivery Workers");
    } else if (currentRoute.includes("/admin/orders")) {
      setActiveItem("Orders");
    } else if (currentRoute.includes("/admin/feedback")) {
      setActiveItem("Feedback");
    } else if (currentRoute.includes("/admin/notification")) {
      setActiveItem("Notification");
    } else if (currentRoute.includes("/admin/")) {
      setActiveItem("Dashboard");
    } else {
      setActiveItem("");
    }
  }, [location.pathname]);

  const sideBarList = [
    {
      title: "Dashboard",
      path: "/admin/",
      icon: <DashboardIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Categories",
      path: "/admin/categories",
      icon: <CategoryIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Products",
      path: "/admin/products",
      icon: <LocalMallIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Experts",
      path: "/admin/experts",
      icon: <PersonIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Customers",
      path: "/admin/customers",
      icon: <PeopleIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Delivery Workers",
      path: "/admin/delivery-workers",
      icon: <DeliveryDiningIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    {
      title: "Orders",
      path: "/admin/orders",
      icon: <ReceiptIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
    // {
    //   title: "Feedback",
    //   path: "/admin/feedback",
    //   icon: <FeedbackIcon sx={{ fontSize: "14px", color: "white" }} />,
    // },
    {
      title: "Notification",
      path: "/admin/notification",
      icon: <NotificationsIcon sx={{ fontSize: "14px", color: "white" }} />,
    },
  ];

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const host = config.host;
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("auth-token"));
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const tokensss = JSON.parse(localStorage.getItem("userToken"));
    if (tokensss) {
      axios
        .get(`${host}/api/users/getuser`, {
          headers: { "auth-token": tokensss },
        })
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
    localStorage.removeItem("adminToken");
    setToken(null); // Clear token from state
    navigate("/admin/login");
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
            Admin Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton
            color="inherit"
            aria-label="logout"
            onClick={handleClickLogout}
          >
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
                <ChevronRightIcon />
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
                          ? deepgreen // Set deepgreen for the active item
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
