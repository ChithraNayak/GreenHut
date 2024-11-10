import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  CircularProgress,
  TextField,
  MenuItem,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import Layout from "../layout";
import AskQuery from "./AskQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

const getCurrentDate = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // January is 0
  const year = today.getFullYear();

  return `${year}-${month}-${day}`;
};

const getCurrentTime = () => {
  const today = new Date();
  const hours = String(today.getHours()).padStart(2, "0");
  const minutes = String(today.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const timeSlots = [
  { value: "10:00 AM - 12:00 PM", startTime: "10:00" },
  { value: "12:00 PM - 02:00 PM", startTime: "12:00" },
  { value: "02:00 PM - 04:00 PM", startTime: "14:00" },
];

const placeOptions = ["Mangalore", "Udupi"];

const ExpertDetails = () => {
  let navigate = useNavigate();
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [bookForm, setBookForm] = useState({
    slot: null,
    date: null,
    place: "",
    address: "",
  });
  const [availableSlots, setAvailableSlots] = useState(timeSlots);
  const [noSlotsMessage, setNoSlotsMessage] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const { data } = await api.get(`/experts/${id}`);
        setExpert(data);
      } catch (error) {
        console.error("Error fetching expert details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExpert();
  }, [id]);

  useEffect(() => {
    if (date === getCurrentDate()) {
      const currentTime = getCurrentTime();
      const filteredSlots = timeSlots.filter(
        (slot) => slot.startTime > currentTime
      );
      setAvailableSlots(filteredSlots);

      if (filteredSlots.length === 0) {
        setNoSlotsMessage("No available time slots for today.");
      } else {
        setNoSlotsMessage("");
      }
    } else {
      setAvailableSlots(timeSlots);
      setNoSlotsMessage("");
    }
  }, [date]);

  const handleBooking = () => {
    if (availableSlots.length === 0) {
      setNoSlotsMessage("No available time slots to book.");
      return;
    } else {
      if (!bookForm.date) {
        setNoSlotsMessage("Please select a date.");
      } else if (!bookForm.slot) {
        setNoSlotsMessage("Please select a time slot.");
      } else if (!bookForm.place) {
        setNoSlotsMessage("Please select a place.");
      } else if (!bookForm.address) {
        setNoSlotsMessage("Please enter an address.");
      } else {
        setNoSlotsMessage("");
        let token = JSON.parse(localStorage.getItem("userToken"));
        axios
          .post(
            `${config.host}/api/users/bookAnExpert`,
            {
              ...bookForm,
              expertId: id,
            },
            {
              headers: { "auth-token": token },
            }
          )
          .then((res) => {
            if (res.data.success) {
              setSnackbar({
                open: true,
                message: res.data.message,
                severity: "success",
              });
              setTimeout(() => {
                navigate("/my-bookings");
              }, 2000);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Container sx={{ my: 4 }}>
          <Typography variant="h3" gutterBottom>
            {expert.name}
          </Typography>
          <Card sx={{ maxWidth: 500, margin: "auto" }}>
            <CardMedia
              component="img"
              height="300"
              image={`${config.host}/uploads/${expert.image}`}
              alt={expert.name}
              sx={{ objectFit: "contain", height: 300 }}
            />
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {expert.title}
              </Typography>
              <TextField
                label="Date"
                type="date"
                name="date"
                fullWidth
                margin="normal"
                value={bookForm.date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setBookForm({ ...bookForm, [e.target.name]: e.target.value });
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  min: getCurrentDate(),
                }}
              />
              <TextField
                label="Select Timing"
                select
                fullWidth
                margin="normal"
                value={bookForm.slot}
                name="slot"
                onChange={(e) =>
                  setBookForm({ ...bookForm, [e.target.name]: e.target.value })
                }
              >
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot) => (
                    <MenuItem key={slot.value} value={slot.value}>
                      {slot.value}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No time slots available</MenuItem>
                )}
              </TextField>
              <TextField
                label="Place"
                select
                fullWidth
                margin="normal"
                value={bookForm.place}
                name="place"
                onChange={(e) =>
                  setBookForm({ ...bookForm, [e.target.name]: e.target.value })
                }
              >
                {placeOptions.map((place) => (
                  <MenuItem key={place} value={place}>
                    {place}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                value={bookForm.address}
                name="address"
                onChange={(e) =>
                  setBookForm({ ...bookForm, [e.target.name]: e.target.value })
                }
              />
              {noSlotsMessage && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  {noSlotsMessage}
                </Alert>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBooking}
                  disabled={availableSlots.length === 0} // Disable button if no slots available
                >
                  Book Now
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
        <AskQuery />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert
            onClose={handleSnackbarClose}
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

export default ExpertDetails;
