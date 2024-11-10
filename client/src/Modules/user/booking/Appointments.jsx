import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
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
import Layout from "../layout";

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
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customerName: "John Doe",
      date: "2024-07-10",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      id: 2,
      customerName: "Jane Smith",
      date: "2024-07-12",
      time: "2:30 PM",
      status: "Confirmed",
    },
    {
      id: 3,
      customerName: "Alice Brown",
      date: "2024-07-15",
      time: "11:00 AM",
      status: "Pending",
    },
    {
      id: 4,
      customerName: "Bob Green",
      date: "2024-07-18",
      time: "3:00 PM",
      status: "Pending",
    },
    // Add more appointment data as needed
  ]);

  const handleAccept = (appointment) => {
    setSelectedAppointment(appointment);
    setConfirmDialogOpen(true);
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
  };

  const handleDeclineAppointment = () => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === selectedAppointment.id ? { ...apt, status: "Declined" } : apt
    );
    setAppointments(updatedAppointments);
    setDeclineDialogOpen(false);
    setSelectedAppointment(null);
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
    <Layout>
      <Container maxWidth="lg" sx={{ padding: "5rem 2rem" }}>
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
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <Typography
                        variant="body1"
                        style={{
                          color:
                            appointment.status === "Pending"
                              ? "#004d00"
                              : "inherit",
                        }}
                      >
                        {appointment.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {appointment.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {appointment.time}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1">
                        {appointment.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {appointment.status === "Pending" && (
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
                <DeepGreenText>
                  {selectedAppointment.customerName}
                </DeepGreenText>
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
                <DeepGreenText>
                  {selectedAppointment.customerName}
                </DeepGreenText>
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
      </Container>
    </Layout>
  );
};

export default Appointments;
