import React, { useState } from "react";
import PropTypes from "prop-types";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import Layout from "../layout";
import { useEffect } from "react";
import config from "../../../config";
import axios from "axios";
import moment from "moment";
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
    error: {
      main: "#d32f2f", // Red color for error
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
          color: theme.palette.secondary.main,
          fontWeight: "bold",
          fontSize: "4rem", // Fixed text size
        }}
      >
        My Bookings
      </Typography>
    </Box>
  );
};

const StatusText = ({ status }) => {
  const getStatusText = () => {
    switch (status) {
      case "Confirmed":
        return "Booking Confirmed";
      case "Canceled":
        return "Booking Canceled";
      default:
        return status;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "Confirmed":
        return {
          color: theme.palette.primary.main,
          backgroundColor: "#c8e6c9", // Light green background
        };
      case "Pending":
        return {
          color: "#004d00",
          backgroundColor: "#fff9c4", // Light yellow background
        };
      case "Canceled":
        return {
          color: theme.palette.error.main,
          backgroundColor: "#ffcdd2", // Light red background
        };
      default:
        return {
          color: "#004d00",
          backgroundColor: "#f5f5f5",
        };
    }
  };

  const { color, backgroundColor } = getStatusColor();

  return (
    <Typography
      variant="body1"
      style={{
        color,
        backgroundColor,
        padding: "0.2rem 0.5rem",
        borderRadius: "4px",
      }}
    >
      {getStatusText()}
    </Typography>
  );
};

StatusText.propTypes = {
  status: PropTypes.string.isRequired,
};

const BookingRow = ({ booking }) => (
  <TableRow>
    <TableCell>
      <Typography
        variant="body1"
        style={{ color: booking.status === "Pending" ? "#004d00" : "inherit" }}
      >
        {booking?.expertId?.name}
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1">{booking?.expertId?.contact}</Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1">
        {moment(booking?.date).format("DD-MM-YYYY")}
      </Typography>
    </TableCell>
    <TableCell>
      <Typography variant="body1">{booking?.time}</Typography>
    </TableCell>
    <TableCell>
      <StatusText status={booking?.status} />
    </TableCell>
  </TableRow>
);

BookingRow.propTypes = {
  booking: PropTypes.shape({
    expertName: PropTypes.string,
    expertContact: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("userToken"));
    axios
      .get(`${config.host}/api/users/getAllBookings`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        if (res.data.success) {
          setBookings(res.data.bookings);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <HeaderSection />
        <Container maxWidth="lg" sx={{ padding: "5rem 2rem" }}>
          <Box>
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableRow>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        Expert Name
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        Expert Contact
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        Booked Date
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        Booked Time
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#fff",
                          fontWeight: "bold",
                          fontSize: "1.1rem",
                        }}
                      >
                        Status
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings?.length > 0 ? (
                    bookings.map((booking) => (
                      <BookingRow key={booking.id} booking={booking} />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography variant="h6" sx={{ color: "red" }}>
                          No bookings found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default MyBookings;
