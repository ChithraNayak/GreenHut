import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Rating,
  IconButton,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  createTheme,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const theme = createTheme({
  palette: {
    primary: {
      main: "#006400", // Deep green color
    },
    secondary: {
      main: "#f44336", // Red color for secondary actions
    },
    editIcon: {
      main: "#1976d2", // Blue color for edit icon
    },
    deleteIcon: {
      main: "#d32f2f", // Red color for delete icon
    },
  },
  typography: {
    h4: {
      fontWeight: 700,
      marginBottom: "20px",
    },
  },
});

const Feedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openRespondForm, setOpenRespondForm] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [response, setResponse] = useState("");

  // Fetch feedback data from API
  const fetchFeedback = async () => {
    try {
      const response = await fetch("/api/feedback");
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Pagination change handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Dummy feedbacks for demonstration
  useEffect(() => {
    setFeedbackList([
      {
        id: 1,
        productName: "Product A",
        rating: 4,
        comment: "Great product!",
        date: new Date().toISOString(),
      },
      {
        id: 2,
        productName: "Product B",
        rating: 5,
        comment: "Excellent service!",
        date: new Date().toISOString(),
      },
    ]);
  }, []);

  // Handle opening respond form
  const handleOpenRespondForm = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenRespondForm(true);
  };

  // Handle closing respond form
  const handleCloseRespondForm = () => {
    setOpenRespondForm(false);
    setResponse("");
    setSelectedFeedback(null);
  };

  // Handle response change
  const handleResponseChange = (event) => {
    setResponse(event.target.value);
  };

  // Handle submit response
  const handleSubmitResponse = () => {
    // Implement logic to submit response to backend or perform other actions
    console.log(
      `Responding to feedback ${selectedFeedback.id} with: ${response}`
    );
    handleCloseRespondForm();
  };

  // Handle delete feedback
  const handleDeleteFeedback = (feedbackId) => {
    // Implement logic to delete feedback from backend
    console.log(`Deleting feedback with id: ${feedbackId}`);
    // Example: Remove feedback from UI (optimistic update)
    setFeedbackList(feedbackList.filter((item) => item.id !== feedbackId));
  };

  return (
    <Container>
      <Box>
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          Customers Feedback
        </Typography>
        <TableContainer component={Paper}>
          <Table>
          <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Product
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Rating
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Comment
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Date
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Typography
                      variant="subtitle1"
                      sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                    >
                      Actions
                    </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbackList
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <TableRow key={item.id}>
                    <TableCell align="center">{item.productName}</TableCell>
                    <TableCell align="center">
                      <Rating value={item.rating} readOnly size="small" />
                    </TableCell>
                    <TableCell align="center">{item.comment}</TableCell>
                    <TableCell align="center">
                      {new Date(item.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenRespondForm(item)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleDeleteFeedback(item.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={feedbackList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>

      {/* Respond to Feedback Dialog */}
      <Dialog
        open={openRespondForm}
        onClose={handleCloseRespondForm}
        maxWidth="md"
      >
        <DialogTitle>Respond to Feedback</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" gutterBottom>
            Feedback: {selectedFeedback?.comment}
          </Typography>
          <TextField
            label="Your Response"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={response}
            onChange={handleResponseChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRespondForm} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSubmitResponse} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Feedback;
