import React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#006400", // Deep green color
        color: "#ffffff", // White color
        py: 6, // Padding on the y-axis
        mt: 4, // Margin top
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" gutterBottom>
          GreenHut
        </Typography>
        <Typography variant="body1">
          © {new Date().getFullYear()} GreenHut. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
