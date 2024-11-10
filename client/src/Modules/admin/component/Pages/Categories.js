import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Modal,
  TextField,
  Grid,
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Delete, Edit } from "@mui/icons-material";
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

// Modal component for creating or editing categories
const CategoryModal = ({
  open,
  onClose,
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  image,
  setImage,
  isEditMode,setImageName,imageName
}) => {

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setImageName(file ? file.name : "");
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-category-modal"
      aria-describedby="create-category-form"
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
        <Typography variant="h6" gutterBottom>
          {isEditMode ? "Edit Category" : "Create New Category"}
        </Typography>
        <form onSubmit={onSubmit}>
          <TextField
            fullWidth
            label="Category Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Category Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            margin="normal"
            required
            multiline
            rows={3}
          />
          <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
            fullWidth
          >
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {imageName && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Selected Image: {imageName}
            </Typography>
          )}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mr: 2 }}
              disabled={!name || !description || !image}
            >
              {isEditMode ? "Update Category" : "Save Category"}
            </Button>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

const Categories = () => {
  const [imageName, setImageName] = useState("");

  const [categories, setCategories] = useState([]);
  const [modals, setModals] = useState({ category: false });
  const [categoryForm, setCategoryForm] = useState({
    id: null,
    name: "",
    description: "",
    image: null,
  });
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [disableAddButton, setDisableAddButton] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data);
        // if (data.length >= 4) {
        //   setDisableAddButton(true);
        // }
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

  const handleOpenModal = (categoryId = null, data = null) => {
    setCategoryForm({
      id: data ? data._id : null,
      name: data ? data.name : "",
      description: data ? data.description : "",
      image: null,
    });
    setIsEditMode(!!data);
    setModals((prev) => ({ ...prev, category: true }));
  };

  const handleCloseModal = () => {
    setModals((prev) => ({ ...prev, category: false }));
  };

  const handleCategorySubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", categoryForm.name);
    formData.append("description", categoryForm.description);
    if (categoryForm.image) {
      formData.append("image", categoryForm.image);
    }
    try {
      if (isEditMode) {
        await api.put(`/categories/${categoryForm.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbar({
          open: true,
          message: "Category updated successfully",
          severity: "success",
        });
      } else {
        await api.post("/categories", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbar({
          open: true,
          message: "Category added successfully",
          severity: "success",
        });
        setImageName('')
        setCategoryForm({
         
          name:  "",
          description:  "",
          image: '',
        });
        
      }
      const { data } = await api.get("/categories");
      setCategories(data);
      handleCloseModal();
    } catch (error) {
      console.error("Error saving category:", error.message);
      setSnackbar({
        open: true,
        message:
          "Failed to save category. Please check the server or the data you are sending.",
        severity: "error",
      });
    }
  };

  const handleCategoryDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setSnackbar({
        open: true,
        message: "Category deleted successfully",
        severity: "success",
      });
      setCategories(categories.filter((category) => category._id !== id));
      if (categories.length >= 4) {
        setDisableAddButton(false);
      }
    } catch (error) {
      console.error("Error deleting category:", error.message);
      setSnackbar({
        open: true,
        message:
          "Failed to delete category. Please check the server or the ID you are trying to delete.",
        severity: "error",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Typography
            variant="h4"
            style={{ fontWeight: "bold" }}
            align="center"
          >
            Manage Categories
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenModal()}
            startIcon={<Add />}
            disabled={disableAddButton}
          >
            Add Category
          </Button>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category._id}>
                <Card>
                  {category.image && (
                    <img
                      src={`${config.host}/uploads/${category.image}`}
                      alt={category.name}
                      style={{
                        width: "100%",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {category.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      onClick={() => handleOpenModal(category._id, category)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleCategoryDelete(category._id)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      <CategoryModal
      setImageName={setImageName}
      imageName={imageName}
        open={modals.category}
        onClose={handleCloseModal}
        onSubmit={handleCategorySubmit}
        name={categoryForm.name}
        setName={(value) => setCategoryForm((prev) => ({ ...prev, name: value }))}
        description={categoryForm.description}
        setDescription={(value) =>
          setCategoryForm((prev) => ({ ...prev, description: value }))
        }
        image={categoryForm.image}
        setImage={(value) =>
          setCategoryForm((prev) => ({ ...prev, image: value }))
        }
        isEditMode={isEditMode}
      />
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
    </ThemeProvider>
  );
};

export default Categories;
