import React from "react";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import heroImage from "../Images/background_image.jpg"; // Replace with your hero image path

const HeroSection = () => {
  const { category: categoryText } = useParams();
  const displayCategoryText = categoryText
    ? categoryText.charAt(0).toUpperCase() + categoryText.slice(1).toLowerCase()
    : "Collection"; // Default to "Collection" if categoryText is undefined

  return (
    <Box
      sx={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ fontSize: "3rem", fontWeight: "bold" }}
          >
            Welcome to GreenHut
          </Typography>
          <Typography variant="h4" component="div" sx={{ fontSize: "1.5rem" }}>
            Discover the beauty of nature with our exclusive collection of
          </Typography>
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              marginTop: "0.5rem",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: "''",
                position: "absolute",
                left: "50%",
                bottom: "-5px",
                transform: "translateX(-50%)",
                width: "80%",
                height: "2px",
                backgroundColor: "#ffffff",
                animation: "slide-in 1s ease-out",
              },
            }}
          >
            {displayCategoryText}
          </Typography>
        </Container>
      </Box>
      <style>
        {`
          @keyframes slide-in {
            from {
              width: 0%;
            }
            to {
              width: 80%;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default HeroSection;
