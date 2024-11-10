import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import YardIcon from "@mui/icons-material/Yard";
import Box from "@mui/material/Box";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import axios from "axios";
import config from "../../config";

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
  },
  typography: {
    h3: {
      fontFamily: "Berlin Sans FB",
      color: "#ffffff",
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

const HomePage = () => {
  const host = config.host;
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});
  const token = localStorage.getItem("auth-token");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .get(`${host}/api/users/getuser`, {
          headers: { "auth-token": token },
        })
        .then((res) => {
          setUserDetails(res.data.user); // Ensure you're accessing the user object correctly
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [token, host]);

  const performLogout = () => {
    localStorage.removeItem("auth-token");
    setUserDetails({});
    navigate("/login");
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleClickLogout = () => {
    setOpenDialog(true);
  };

  const handleConfirmLogout = () => {
    performLogout();
    handleCloseDialog();
  };


  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
     
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
      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          color: "white",
          backgroundImage: `url(/assets/images/background_image.jpg)`, // Update with your background image path
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          height: "calc(80vh - 70px)", // Adjust height to fill viewport minus the AppBar height (64px default)
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          padding: 0, // Ensure no paddings
          width: "100%", // Ensure full width
          overflow: "hidden", // Hide overflow
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
          sx={{ color: theme.palette.secondary.main, fontWeight: "bold" }} // White color and bold text
        >
          PLANTS EXIST IN THE WEATHER AND LIGHT RAYS THAT SURROUND THEM
        </Typography>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/contact"
            sx={{
              borderRadius: 20, // Rounded corners for buttons
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
              },
            }}
          >
            CONTACT US
          </Button>
        </Box>
      </Box>
      <Container
        maxWidth="lg"
        sx={{
          mt: 0, // Set to 0 to align with the bottom of the nav bar
          p: 0, // Ensure no padding to align correctly
        }}
      >
        {/* Improved Services Section */}
        <Box
          sx={{
            mt: 8, // Add margin to the top
            p: 4, // Add padding around the section
            backgroundColor: theme.palette.background.default, // Light background color for the section
            borderRadius: 2, // Rounded corners
            boxShadow: 3, // Add shadow for a lifted effect
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              textAlign: "center",
              color: theme.palette.primary.main, // Deep green color for the title
            }}
          >
            Our Services
          </Typography>
          <Typography
            variant="h6"
            component="p"
            sx={{
              mb: 4,
              textAlign: "center",
              color: theme.palette.primary.main, // Deep green color for the subtitle
            }}
          >
            We provide top-notch services to ensure your plants thrive and look
            their best.
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: theme.palette.secondary.main }} // White color
                  >
                    Plants Care
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{ mt: 1, color: theme.palette.secondary.main }} // White color
                  >
                    Expert care for your plants to ensure they thrive in any
                    environment.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: theme.palette.secondary.main }} // White color
                  >
                    Self Watering Service
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{ mt: 1, color: theme.palette.secondary.main }} // White color
                  >
                    Convenient self-watering solutions for your plants.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  p: 2,
                  textAlign: "center",
                  backgroundColor: theme.palette.primary.light,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{ color: theme.palette.secondary.main }} // White color
                  >
                    Safe Delivery
                  </Typography>
                  <Typography
                    variant="body1"
                    component="p"
                    sx={{ mt: 1, color: theme.palette.secondary.main }} // White color
                  >
                    Safe Delivery Services for a Smooth Planting Experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
      {/* Footer Section */}
      <Box
        sx={{
          mt: 8, // Margin top for spacing from the content above
          p: 4, // Padding around the footer
          backgroundColor: theme.palette.primary.main, // Deep green background color
          color: theme.palette.secondary.main, // White text color
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" component="div" gutterBottom>
                GREENHUT
              </Typography>
              <Typography variant="body1">
                Address: Ashwini Nursery, near Karpe Post, Karpe Post and
                Village, Siddakatte Road, Bantwal-574237
              </Typography>
              <Typography variant="body1">Phone: +91 9686225865</Typography>
              <Typography variant="body1">
                Email: greenhutmanglore@gmail.com
              </Typography>
              <Typography variant="body1">
                Open Hours: Mon - Sun: 8 AM to 9 PM
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" component="div" gutterBottom>
                QUICK LINKS
              </Typography>
              <Typography variant="body1">
                <Link
                  to="/about"
                  style={{
                    color: theme.palette.secondary.main,
                    textDecoration: "none",
                  }}
                >
                  About
                </Link>
              </Typography>
              <Typography variant="body1">
                <Link
                  to="/my-orders"
                  style={{
                    color: theme.palette.secondary.main,
                    textDecoration: "none",
                  }}
                >
                  Orders
                </Link>
              </Typography>
              <Typography variant="body1">
                <Link
                  to="/contact"
                  style={{
                    color: theme.palette.secondary.main,
                    textDecoration: "none",
                  }}
                >
                  Contact
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" component="div" gutterBottom>
                FOLLOW US
              </Typography>
              <Typography variant="body1">
                <Link
                  to="#"
                  style={{
                    color: theme.palette.secondary.main,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FacebookIcon style={{ marginRight: 8 }} />
                  Facebook
                </Link>
              </Typography>
              <Typography variant="body1">
                <Link
                  to="#"
                  style={{
                    color: theme.palette.secondary.main,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <InstagramIcon style={{ marginRight: 8 }} />
                  Instagram
                </Link>
              </Typography>
              <Typography variant="body1">
                <Link
                  to="#"
                  style={{
                    color: theme.palette.secondary.main,
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <TwitterIcon style={{ marginRight: 8 }} />
                  Twitter
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default HomePage;
