// src/pages/AboutUs.jsx

import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Divider,
  Box,
  Button,
} from "@mui/material";
import Layout from "./layout";

// HeaderSection Component
const HeaderSection = () => {
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
          fontSize: "4rem", // Fixed text size
        }}
      >
        About Us
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
        Learn more about our mission and values
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

const AboutUs = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
      
        <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
          {/* Introduction Section */}
          <Typography
            variant="h6"
            component="p"
            sx={{
              textAlign: "center",
              mb: 4,
              color: (theme) => theme.palette.text.primary,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            GreenHut.com was launched in the monsoons of 2019. We wanted
            urbanites to rediscover nature and use it as a means for healthier
            living – cleaner air, less stress, organic food, and a much more
            fulfilling life. We are doing this by making available a wide range
            of gardening products, know-how, and services at your doorstep.
            Growing plants need not be difficult, and we are always there to
            help you select and nurture your greens.
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              textAlign: "center",
              mb: 4,
              color: (theme) => theme.palette.text.primary,
              lineHeight: 1.6,
              px: 2,
            }}
          >
            As a team, we put great value on integrity, prompt customer service,
            quality, and a shared desire to help people ‘go green’.
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              textAlign: "center",
              mb: 4,
              color: (theme) => theme.palette.primary.main,
              lineHeight: 1.6,
              px: 2,
              fontWeight: 600,
            }}
          >
            Wishing you a greener home!
          </Typography>

          <Typography
            variant="h6"
            component="p"
            sx={{
              textAlign: "center",
              mb: 6,
              color: (theme) => theme.palette.primary.main,
              lineHeight: 1.6,
              px: 2,
              fontWeight: 600,
            }}
          >
            Naturally yours,
            <br />
            Team GreenHut
          </Typography>

          {/* Divider */}
          <Divider
            sx={{
              mb: 6,
              borderColor: (theme) => theme.palette.primary.main,
              width: "50%",
              mx: "auto",
            }}
          />

          {/* Grid for Quality Products and Perfect Service */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: "#ffffff",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 3,
                    textAlign: "center",
                    color: (theme) => theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  Quality Products
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    lineHeight: 1.6,
                    textAlign: "center",
                  }}
                >
                  We pride ourselves on the quality of our products. That's why
                  we carefully hand-deliver every item to every customer. Our
                  each product meets high standards from selection to delivery.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper
                elevation={6}
                sx={{
                  p: 4,
                  backgroundColor: "#ffffff",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{
                    mb: 3,
                    textAlign: "center",
                    color: (theme) => theme.palette.primary.main,
                    fontWeight: 600,
                  }}
                >
                  Perfect Service
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    lineHeight: 1.6,
                    textAlign: "center",
                  }}
                >
                  We will always be here to offer you advice and ensure you have
                  everything you need after purchase to care for your plants. We
                  make sure your products reach you on time.
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Call to Action Button */}
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                borderRadius: 20,
                px: 4,
                py: 1.5,
                boxShadow: 3,
                "&:hover": {
                  backgroundColor: (theme) => theme.palette.primary.dark,
                },
              }}
              href="/contact"
            >
              Get in Touch
            </Button>
          </Box>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default AboutUs;
