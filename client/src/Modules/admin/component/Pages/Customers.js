import React, { useState, useEffect } from "react";
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
  TablePagination,
  InputAdornment,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search"; // Import Search icon
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
  },
  typography: {
    h4: {
      fontWeight: 700,
      marginBottom: "20px",
    },
  },
});

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentCustomerId, setCurrentCustomerId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Fetch customer data from API
    axios
      .get(`${config.host}/api/users/getusers`)
      .then((response) => {
        setCustomers(response.data?.user);
        setFilteredCustomers(response.data?.user);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleOpen = (customer = null) => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone);
      setEditMode(true);
      setCurrentCustomerId(customer._id);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setEditMode(false);
      setCurrentCustomerId(null);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    const newCustomer = {
      _id: editMode ? currentCustomerId : new Date().toISOString(),
      name,
      email,
      phone,
    };

    if (editMode) {
      // Update existing customer
      const updatedCustomers = customers.map((customer) =>
        customer._id === currentCustomerId ? newCustomer : customer
      );
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
    } else {
      // Add new customer
      const updatedCustomers = [...customers, newCustomer];
      setCustomers(updatedCustomers);
      setFilteredCustomers(updatedCustomers);
    }

    handleClose();
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    const filteredCustomers = customers.filter((customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCustomers(filteredCustomers);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" gutterBottom align="center">
          Customer Management
        </Typography>
        <TextField
          label="Search Customers"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Modal open={open} onClose={handleClose}>
          <Box
            component="form"
            onSubmit={handleSubmit}
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
            <Typography variant="h6" gutterBottom>
              {editMode ? "Edit Customer" : "Add Customer"}
            </Typography>
            <TextField
              label="Customer Name"
              value={name}
              onChange={handleNameChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Customer Email"
              value={email}
              onChange={handleEmailChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <TextField
              label="Customer Phone"
              value={phone}
              onChange={handlePhoneChange}
              fullWidth
              margin="normal"
              variant="outlined"
              required
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              sx={{ mt: 2 }}
            >
              {editMode ? "Save Changes" : "Save Customer"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClose}
              fullWidth
              sx={{ mt: 1 }}
            >
              Cancel
            </Button>
          </Box>
        </Modal>
        <TableContainer component={Paper} sx={{ marginTop: "20px" }}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.primary.main }}>
              <TableRow>
                <TableCell align="center">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Name
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                    }}
                  >
                    Email
                  </Typography>
                </TableCell>
                {/* <TableCell align="center">
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.1rem" }}
                  >
                    Phone
                  </Typography>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCustomers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell align="center">{customer.name}</TableCell>
                    <TableCell align="center">{customer.email}</TableCell>
                    {/* <TableCell align="center">{customer.phone}</TableCell> */}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCustomers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Container>
    </ThemeProvider>
  );
};

export default Customers;
