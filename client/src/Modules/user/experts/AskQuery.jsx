import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  Divider,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const AskQuery = () => {
  const [queries, setQueries] = useState([]);
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", query: "" });
  const [errors, setErrors] = useState({});
  const [queryCount, setQueryCount] = useState(0);
  const host = "http://localhost:5000"; // Adjust URL as needed

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const response = await axios.get(`${host}/api/queries`);
        if (response.data.success) {
          setQueries(response.data.queries);
          setQueryCount(response.data.queries.length);
        } else {
          console.error("Failed to fetch queries");
        }
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };

    fetchQueries();
  }, [host]);

  const handleQueryClick = (query) => {
    setSelectedQuery(query);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Email is invalid";
    if (!form.query) newErrors.query = "Query is required";
    return newErrors;
  };

  const handleFormSubmit = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(`${host}/api/queries/addquery`, form);
      if (response.data.success) {
        toast.success(response.data.message);
        setForm({ name: "", email: "", query: "" });
        setErrors({});
        // Refresh the list of queries
        const fetchQueries = async () => {
          try {
            const response = await axios.get(`${host}/api/queries`);
            if (response.data.success) {
              setQueries(response.data.queries);
              setQueryCount(response.data.queries.length);
            } else {
              console.error("Failed to fetch queries");
            }
          } catch (error) {
            console.error("Error fetching queries:", error);
          }
        };
        fetchQueries();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error submitting query:", error);
      toast.error("Error submitting query");
    }
  };

  return (
    <Box sx={{ mb: 15, mt: 8, paddingX: 5 }}>
      {queries.length === 0 ? (
        <Box sx={{ paddingX: 5, mb: 5 }}>
          <Typography variant="h6" align="center" color="textSecondary">
            No Queries Available
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2} justifyContent="center">
          {queries.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={1}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  transition: "transform 0.3s",
                  "&:hover": {
                    transform: "scale(1.03)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                  },
                  cursor: "pointer",
                  mx: 2,
                  mb: 2,
                }}
                onClick={() => handleQueryClick(item)}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {item.email}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ my: 1, color: "text.primary" }}
                  >
                    {item.query}
                  </Typography>
                  {item.response && (
                    <>
                      <Divider sx={{ mt: 2 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "text.primary", mt: 1 }}
                      >
                        Response: {item.response}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ mt: 5 }} />
      <Box sx={{ my: 2, px: 2, textAlign: "center" }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}
        >
          Your Queries are Important to Us
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          Have any questions? Feel free to ask us through the form below and
          help us address your concerns. Your queries are important in improving
          our services and providing a better experience.
        </Typography>
      </Box>

      <Box
        sx={{
          mt: 4,
          mx: "auto",
          maxWidth: 400,
          padding: 2,
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Query"
              name="query"
              value={form.query}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              error={!!errors.query}
              helperText={errors.query}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleFormSubmit}
            >
              Submit Query
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AskQuery;
