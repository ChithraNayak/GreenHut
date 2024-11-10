import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const HeroSection = () => {
  const { category: categoryText } = useParams();
  const displayCategoryText = categoryText
    ? categoryText.charAt(0).toUpperCase() + categoryText.slice(1).toLowerCase()
    : "Collection"; // Default to "Collection" if categoryText is undefined

  return (
    <ThemeProvider theme={theme}>
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
            fontSize: "5rem",
          }}
        >
          Cart
        </Typography>
      </Box>
    </ThemeProvider>
  );
};

export default HeroSection;
