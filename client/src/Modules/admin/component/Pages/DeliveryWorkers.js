import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Modal,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  createTheme,
  ThemeProvider,
  IconButton,
  Pagination,
  InputAdornment,
} from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete,
  Search as SearchIcon,
} from "@mui/icons-material";
import config from "../../../../config";

// Define the deep green theme
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
    h6: {
      fontWeight: 600,
    },
  },
});

const DeliveryWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentWorkerId, setCurrentWorkerId] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(5); // Set the number of rows per page
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1); // To manage the total number of pages

  const fetchWorkers = useCallback(async () => {
    try {
      const response = await axios.get(
        `${config.host}/api/deliveryworkers?page=${page}&limit=${rowsPerPage}`
      );
      setWorkers(response.data.workers || []); // Default to an empty array if response.data.workers is undefined
      setTotalPages(response.data.totalPages || 1); // Default to 1 if totalPages is undefined
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  }, [page, rowsPerPage]);

  const filterWorkers = useCallback(() => {
    if (workers && workers.length) {
      const filtered = workers.filter((worker) =>
        worker.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers([]);
    }
  }, [searchQuery, workers]);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  useEffect(() => {
    filterWorkers();
  }, [filterWorkers]);

  const clearForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setImage(null);
    setEditMode(false);
    setCurrentWorkerId(null);
  };

  const handleOpen = (worker = null) => {
    if (worker) {
      setName(worker.name);
      setEmail(worker.email);
      setPhone(worker.phone);
      setImage(null); // Clear the file input
      setEditMode(true);
      setCurrentWorkerId(worker._id);
    } else {
      clearForm();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    setPhone(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    if (image) {
      formData.append("image", image); // Append the image file
    }

    try {
      if (editMode) {
        // Update existing worker
        await axios.put(
          `${config.host}/api/deliveryworkers/${currentWorkerId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Add new worker
        await axios.post(`${config.host}/api/deliveryworkers`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }
      fetchWorkers();
      handleClose();
    } catch (error) {
      console.error("Error saving worker:", error);
    }
  };

  const handleEdit = (workerId) => {
    const workerToEdit = workers.find((worker) => worker._id === workerId);
    if (workerToEdit) {
      handleOpen(workerToEdit);
    }
  };

  const handleDelete = async (workerId) => {
    try {
      await axios.delete(`${config.host}/api/deliveryworkers/${workerId}`);
      fetchWorkers();
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          marginBottom={2}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            fontWeight="bold"
          >
            Delivery Workers Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen()}
            startIcon={<AddCircle />}
            sx={{ marginBottom: 2 }}
          >
            Create New Worker
          </Button>
        </Box>
        <TextField
          variant="outlined"
          label="Search Delivery Workers"
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: 2 }}
        />
        <Modal open={open} onClose={handleClose}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" color="primary" gutterBottom>
              {editMode ? "Edit Worker" : "Add Worker"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <TextField
                label="Name"
                value={name}
                onChange={handleNameChange}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Email"
                value={email}
                onChange={handleEmailChange}
                required
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Phone"
                value={phone}
                onChange={handlePhoneChange}
                required
                sx={{ marginBottom: 2 }}
              />
              <Button
                variant="contained"
                component="label"
                sx={{ marginBottom: 2 }}
              >
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </Button>
              <Button type="submit" variant="contained" color="primary">
                {editMode ? "Update Worker" : "Add Worker"}
              </Button>
            </Box>
          </Box>
        </Modal>
        <TableContainer component={Paper}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#006400", // Deep green color for the header
              }}
            >
              <TableRow>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Name
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Email
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Phone
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Image
                </TableCell>
                <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker._id}>
                  <TableCell>{worker.name}</TableCell>
                  <TableCell>{worker.email}</TableCell>
                  <TableCell>{worker.phone}</TableCell>
                  <TableCell>
                    {worker.image && (
                      <img
                        src={`${config.host}/uploads/${worker.image}`}
                        alt={worker.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEdit(worker._id)}
                      color="editIcon"
                      sx={{ marginRight: 1 }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(worker._id)}
                      color="deleteIcon"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ marginTop: 2, display: "flex", justifyContent: "center" }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default DeliveryWorkers;