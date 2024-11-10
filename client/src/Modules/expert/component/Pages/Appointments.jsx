import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Box, Snackbar, Alert } from "@mui/material";
import Container from "@mui/material/Container";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import { createTheme } from "@mui/material";
import { useEffect } from "react";
import config from "../../../../config";
import axios from "axios";
import moment from "moment";
const DeepGreenText = styled("span")({
  color: "#004d00", // Deep Green color
});
const theme = createTheme({
  palette: {
    primary: {
      main: "#006400",
    },
    secondary: {
      main: "#8FBC8F",
    },
  },
});

const Appointments = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [state, setState] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("expertToken"));
    axios
      .get(`${config.host}/api/experts/viewAllBookings`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        if (res.data.success) {
          setAppointments(res.data.bookings);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [state]);
  const handleAccept = (appointment) => {
    setSelectedAppointment(appointment);
    setConfirmDialogOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const handleReject = (appointment) => {
    setSelectedAppointment(appointment);
    setDeclineDialogOpen(true);
  };

  const handleConfirmAppointment = () => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === selectedAppointment.id ? { ...apt, status: "Confirmed" } : apt
    );
    setAppointments(updatedAppointments);
    setConfirmDialogOpen(false);
    setSelectedAppointment(null);
    let token = JSON.parse(localStorage.getItem("expertToken"));
    axios
      .put(
        `${config.host}/api/experts/updateStatus/${selectedAppointment?._id}`,
        { status: "Confirmed" },
        {
          headers: { "auth-token": token },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setState(!state);
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeclineAppointment = () => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === selectedAppointment.id ? { ...apt, status: "Declined" } : apt
    );
    setAppointments(updatedAppointments);
    setDeclineDialogOpen(false);
    setSelectedAppointment(null);
    let token = JSON.parse(localStorage.getItem("expertToken"));
    axios
      .put(
        `${config.host}/api/experts/updateStatus/${selectedAppointment?._id}`,
        { status: "Declined" },
        {
          headers: { "auth-token": token },
        }
      )
      .then((res) => {
        if (res.data.success) {
          setState(!state);
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "success",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleCloseDeclineDialog = () => {
    setDeclineDialogOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <Container maxWidth="lg">
      <Box>
        <Typography
          variant="h4"
          gutterBottom
          align="center"
          sx={{ fontWeight: "bold", color: "black" }}
        >
          Appointments
        </Typography>
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
                    Customer Name
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
                    Date
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
                    Time
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
                <TableCell>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Action
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments?.map((appointment, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography
                      variant="body1"
                      style={{
                        color:
                          appointment?.status === "Pending"
                            ? "#004d00"
                            : "inherit",
                      }}
                    >
                      {appointment?.userId?.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {moment(appointment?.date).format("DD-MM-YYYY")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">{appointment?.time}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1">
                      {appointment?.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {appointment?.status === "Pending" && (
                      <>
                        <IconButton
                          color="primary"
                          onClick={() => handleAccept(appointment)}
                        >
                          <CheckCircleIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleReject(appointment)}
                        >
                          <CancelIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCloseConfirmDialog}>
        <DialogTitle>Confirm Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to confirm the appointment with{" "}
            {selectedAppointment && (
              <DeepGreenText>{selectedAppointment?.userId?.name}</DeepGreenText>
            )}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="error">
            Cancel
          </Button>
          <Button onClick={handleConfirmAppointment} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Decline Dialog */}
      <Dialog open={declineDialogOpen} onClose={handleCloseDeclineDialog}>
        <DialogTitle>Decline Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to decline the appointment with{" "}
            {selectedAppointment && (
              <DeepGreenText>{selectedAppointment?.userId?.name}</DeepGreenText>
            )}
            ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeclineDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeclineAppointment} color="error">
            Decline
          </Button>
        </DialogActions>
      </Dialog>
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
    </Container>
  );
};

export default Appointments;
