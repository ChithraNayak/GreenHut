import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  TextField,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Delete, Edit, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import config from "../../../../config"; // Import the config file

// Set up Axios instance with base URL from config
const api = axios.create({
  baseURL: config.host + "/api",
  timeout: 1000,
});

// Define the theme for Material-UI components
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

// Modal component for creating or editing experts
const ExpertModal = ({
  setImageName,
  open,
  onClose,
  onSubmit,
  name,
  setName,
  contact,
  setContact,
  email,
  setEmail,
  address,
  setAddress,
  image,
  setImage,
  imageName,
  isEditMode,
  errors,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="create-expert-modal"
    aria-describedby="create-expert-form"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        maxWidth: 600,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: "10px",
        p: 4,
      }}
    >
      <form onSubmit={onSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Expert Name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Image
              <input
                type="file"
                hidden
                onChange={(event) => {
                  setImage(event.target.files[0]);
                  setImageName(event.target.files[0].name);
                }}
              />
            </Button>
            {imageName && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Selected file: {imageName}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Contact Number"
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              required
              error={!!errors.contact}
              helperText={errors.contact}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 2 }}
              disabled={!name || !contact || !email || !address}
            >
              {isEditMode ? "Update Expert" : "Save Expert"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  </Modal>
);

const Experts = () => {
  const [experts, setExperts] = useState([]);
  const [modals, setModals] = useState({ expert: false });
  const [expertForm, setExpertForm] = useState({
    id: null,
    name: "",
    contact: "",
    email: "",
    address: "",
    image: null,
  });
  const [imageName, setImageName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [errors, setErrors] = useState({});
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

  const handleOpenModal = (expertId = null, data = null) => {
    setExpertForm({
      id: data ? data._id : null,
      name: data ? data.name : "",
      contact: data ? data.contact : "",
      email: data ? data.email : "",
      address: data ? data.address : "",
      image: null,
    });
    setImageName(data ? data.image : "");
    setIsEditMode(!!data);
    setModals((prev) => ({ ...prev, expert: true }));
  };

  const handleCloseModal = () => {
    setModals((prev) => ({ ...prev, expert: false }));
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!expertForm.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }

    if (!expertForm.contact.trim()) {
      tempErrors.contact = "Contact number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(expertForm.contact)) {
      // Example: Ensure contact number is a 10-digit number
      tempErrors.contact = "Contact number must be 10 digits";
      isValid = false;
    }

    if (!expertForm.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(expertForm.email)) {
      // Basic email validation
      tempErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!expertForm.address.trim()) {
      tempErrors.address = "Address is required";
      isValid = false;
    }

    if (!expertForm.image) {
      tempErrors.image = "Image is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleExpertSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("name", expertForm.name);
    formData.append("contact", expertForm.contact);
    formData.append("email", expertForm.email);
    formData.append("address", expertForm.address);
    if (expertForm.image) {
      formData.append("image", expertForm.image);
    }

    try {
      if (isEditMode) {
        await api.put(`/experts/${expertForm.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 5000,
        });
        setSnackbar({
          open: true,
          message: "Expert updated successfully",
          severity: "success",
        });
      } else {
        await api.post("/experts", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 5000,
        });
        setSnackbar({
          open: true,
          message: "Expert added successfully",
          severity: "success",
        });
      }
      const { data } = await api.get("/experts");
      setExperts(data);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving expert:", error.message);
      setSnackbar({
        open: true,
        message:
          "Failed to save expert. Please check the server or the data you are sending.",
        severity: "error",
      });
    }
  };

  const handleExpertDelete = async (id) => {
    try {
      await api.delete(`/experts/${id}`);
      setSnackbar({
        open: true,
        message: "Expert deleted successfully",
        severity: "success",
      });
      setExperts(experts.filter((expert) => expert._id !== id));
    } catch (error) {
      console.error("Error deleting expert:", error.message);
      setSnackbar({
        open: true,
        message:
          "Failed to delete expert. Please check the server or the ID you are trying to delete.",
        severity: "error",
      });
    }
  };

  const filteredExperts = experts.filter((expert) =>
    expert.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography variant="h4" component="h1">
            Manage Experts
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Create Expert
          </Button>
        </Box>
        <TextField
          label="Search Experts"
          variant="outlined"
          fullWidth
          sx={{ mb: 3 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Image</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredExperts.map((expert) => (
                  <TableRow key={expert._id}>
                    <TableCell>{expert.name}</TableCell>
                    <TableCell>{expert.contact}</TableCell>
                    <TableCell>{expert.email}</TableCell>
                    <TableCell>{expert.address}</TableCell>
                    <TableCell>
                      <img
                        src={`${config.host}/uploads/${expert.image}`}
                        alt={expert.name}
                        width="50"
                        height="50"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleOpenModal(expert._id, expert)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => handleExpertDelete(expert._id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        <ExpertModal
          setImageName={setImageName}
          open={modals.expert}
          onClose={handleCloseModal}
          onSubmit={handleExpertSubmit}
          name={expertForm.name}
          setName={(value) =>
            setExpertForm((prev) => ({ ...prev, name: value }))
          }
          contact={expertForm.contact}
          setContact={(value) =>
            setExpertForm((prev) => ({ ...prev, contact: value }))
          }
          email={expertForm.email}
          setEmail={(value) =>
            setExpertForm((prev) => ({ ...prev, email: value }))
          }
          address={expertForm.address}
          setAddress={(value) =>
            setExpertForm((prev) => ({ ...prev, address: value }))
          }
          image={expertForm.image}
          setImage={(file) =>
            setExpertForm((prev) => ({ ...prev, image: file }))
          }
          imageName={imageName}
          // setImageName={setImageName}
          isEditMode={isEditMode}
          errors={errors}
        />
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
};

export default Experts;
