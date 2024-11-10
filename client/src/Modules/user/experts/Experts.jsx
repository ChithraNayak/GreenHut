import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Box,
  Card,
  Button,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import config from "../../../config"; // Import the config file
import Layout from "../layout";
import { Link } from "react-router-dom";

const api = axios.create({
  baseURL: config.host + "/api",
  timeout: 1000,
});

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

const HeaderSection = () => (
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
        fontSize: "4rem",
      }}
    >
      Experts
    </Typography>
  </Box>
);

const ExpertCard = ({ expert }) => (
  <Grid item xs={12} sm={6} md={4} lg={3}>
    <Card
      sx={{
        transition: "transform 0.2s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
        },
      }}
    >
      {expert.image && (
        <CardMedia
          component="img"
          height="200"
          image={`${config.host}/uploads/${expert.image}`}
          alt={expert.name}
          sx={{ objectFit: "cover" }}
        />
      )}
      <CardContent>
          <Button
          component={Link}
          to={`/experts/${expert._id}`}
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            fontSize: "2rem",
            padding: 0,
            textTransform: "none",
          }}
        >
          {expert.name}
        </Button>
      </CardContent>
    </Card>
  </Grid>
);

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/experts");
        setExperts(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setSnackbar({
          open: true,
          message:
            "Failed to fetch data. Please check the server or CORS settings.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <HeaderSection />
        <Container sx={{ my: 4 }}>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "60vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {experts.map((expert) => (
                <ExpertCard key={expert._id} expert={expert} />
              ))}
            </Grid>
          )}
        </Container>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Layout>
    </ThemeProvider>
  );
};

export default Experts;
