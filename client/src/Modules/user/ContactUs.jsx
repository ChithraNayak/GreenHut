import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box, Typography, Container, Grid, Paper } from "@mui/material";
import Layout from "./layout";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// HeroSection Component
const HeroSection = () => {
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
          color: (theme) => theme.palette.secondary.main,
          fontWeight: "bold",
          fontSize: "4rem", // Responsive text size
        }}
      >
        Contact Us
      </Typography>
      <Typography
        variant="h6"
        component="p"
        sx={{
          maxWidth: "80%",
          fontFamily: "Berlin Sans FB",
          fontSize: "2rem", // Fixed text size
          fontWeight: 400,
        }}
      >
        We are here to assist you. Reach out to us for any queries or feedback.
      </Typography>
    </Box>
  );
};

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

const ContactUs = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <HeroSection />
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
          <Typography
            variant="h6"
            component="p"
            sx={{ textAlign: "center", fontWeight: "bold", mb: 4 }}
          >
            We are improving our services to serve you better.
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={8}>
              <Paper
                sx={{
                  p: 4,
                  backgroundColor: "#f9f9f9",
                  borderRadius: 2,
                  boxShadow: 3,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "scale(1.01)",
                    transition: "transform 0.3s ease-in-out",
                  },
                }}
              >
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ mb: 2, textAlign: "center" }}
                >
                  Contact Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 1,
                    "&:hover": {
                      backgroundColor: "#e8f5e9",
                      borderRadius: 1,
                    },
                  }}
                >
                  <LocationOnIcon
                    sx={{ color: theme.palette.primary.main, mr: 2 }}
                  />
                  <Typography variant="body1">
                    <strong>Address:</strong>
                    <br />
                    Ashwini Nursery, near Karpe Post, Karpe Post and Village,
                    Siddakatte Road, Bantwal-574237
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 1,
                    "&:hover": {
                      backgroundColor: "#e8f5e9",
                      borderRadius: 1,
                    },
                  }}
                >
                  <PhoneIcon
                    sx={{ color: theme.palette.primary.main, mr: 2 }}
                  />
                  <Typography variant="body1">
                    <strong>Phone:</strong>
                    <br />
                    +91 9686225865
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    p: 1,
                    "&:hover": {
                      backgroundColor: "#e8f5e9",
                      borderRadius: 1,
                    },
                  }}
                >
                  <EmailIcon
                    sx={{ color: theme.palette.primary.main, mr: 2 }}
                  />
                  <Typography variant="body1">
                    <strong>Email:</strong>
                    <br />
                    greenhutmanglore@gmail.com
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 1,
                    "&:hover": {
                      backgroundColor: "#e8f5e9",
                      borderRadius: 1,
                    },
                  }}
                >
                  <AccessTimeIcon
                    sx={{ color: theme.palette.primary.main, mr: 2 }}
                  />
                  <Typography variant="body1">
                    <strong>Open Hours:</strong>
                    <br />
                    Mon - Sun: 8 AM to 9 PM
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default ContactUs;
