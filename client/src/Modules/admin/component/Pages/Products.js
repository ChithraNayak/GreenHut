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
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  MenuItem,
  CardMedia,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add, Delete, Edit, Search as SearchIcon } from "@mui/icons-material";
import axios from "axios";
import config from "../../../../config";

const api = axios.create({
  baseURL: config.host + "/api",
  timeout: 1000,
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

const ProductModal = ({
  open,
  onClose,
  onSubmit,
  name,
  setName,
  description,
  setDescription,
  price,
  setPrice,
  category,
  setCategory,
  image,
  setImage,
  currentImage,
  inventory,
  setInventory,
  isEditMode,
  categories,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="create-product-modal"
    aria-describedby="create-product-form"
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
        {isEditMode ? "Edit Product" : "Create New Product"}
      </Typography>
      <form onSubmit={onSubmit}>
        <TextField
          fullWidth
          label="Product Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Product Description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Product Price"
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Product Inventory"
          type="number"
          value={inventory}
          onChange={(event) => setInventory(event.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth sx={{ my: 1 }}>
          <InputLabel id="product-category-label">Category</InputLabel>
          <Select
            labelId="product-category-label"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            required
            label="Category"
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat.name}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" component="label" sx={{ mt: 2 }} fullWidth>
          Upload Image
          <input
            type="file"
            hidden
            onChange={(event) => setImage(event.target.files[0])}
          />
        </Button>
        {(currentImage || image) && (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
    {currentImage && (
      <Box sx={{ textAlign: 'center', mr: 2 }}>
        <Typography variant="subtitle1">Current Image:</Typography>
        <img
          src={currentImage}
          alt="current product"
          style={{ maxWidth: '100%', maxHeight: '50px' }}
        />
      </Box>
    )}
    {image && (
      <Box sx={{ textAlign: 'center', ml: 2 }}>
        <Typography variant="subtitle1">Selected Image:</Typography>
        <img
          src={URL.createObjectURL(image)}
          alt="selected product"
          style={{ maxWidth: '100%', maxHeight: '50px' }}
        />
      </Box>
    )}
  </Box>
)}

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mr: 2 }}
            disabled={
              !name || !description || !price || !category || inventory === ""
            }
          >
            {isEditMode ? "Update Product" : "Save Product"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </form>
    </Box>
  </Modal>
);

const Products = () => {
  const [products, setProducts] = useState([]);
  const [modals, setModals] = useState({ product: false });
  const [productForm, setProductForm] = useState({
    id: null,
    name: "",
    description: "",
    price: "",
    category: "",
    image: null,
    currentImage: "",
    inventory: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: productData } = await api.get("/products");
        setProducts(productData);
        const { data: categoryData } = await api.get("/categories");
        setCategories(categoryData);
      } catch (error) {
        setSnackbar({
          open: true,
          message: "Failed to fetch products.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleOpenModal = (id, product) => {
    setIsEditMode(!!id);
    setProductForm({
      id,
      name: product ? product.name : "",
      description: product ? product.description : "",
      price: product ? product.price : "",
      category: product ? product.category : "",
      image: null,
      currentImage: product ? product.image : "",
      inventory: product ? product.inventory : "",
    });
    setModals({ product: true });
  };

  const handleCloseModal = () => {
    setModals({ product: false });
    setProductForm({
      id: null,
      name: "",
      description: "",
      price: "",
      category: "",
      image: null,
      currentImage: "",
      inventory: "",
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", productForm.name);
      formData.append("description", productForm.description);
      formData.append("price", productForm.price);
      formData.append("category", productForm.category);
      formData.append("inventory", productForm.inventory);
      if (productForm.image) formData.append("image", productForm.image);

      if (isEditMode) {
        await api.put(`/products/${productForm.id}`, formData);
        setSnackbar({
          open: true,
          message: "Product updated successfully.",
          severity: "success",
        });
      } else {
        await api.post("/products/", formData);
        setSnackbar({
          open: true,
          message: "Product created successfully.",
          severity: "success",
        });
      }

      const { data: updatedProducts } = await api.get("/products/");
      setProducts(updatedProducts);
      handleCloseModal();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to save product.",
        severity: "error",
      });
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      const { data: updatedProducts } = await api.get("/products/");
      setProducts(updatedProducts);
      setSnackbar({
        open: true,
        message: "Product deleted successfully.",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete product.",
        severity: "error",
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Typography variant="h4" gutterBottom>
          Product Management
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => handleOpenModal(null)}
          >
            Create New Product
          </Button>
          <TextField
            label="Search Products"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.description}
                    </Typography>
                    <Typography variant="body1" color="text.primary">
                      Price: ₹{product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Category: {product.category}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Inventory: {product.inventory}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenModal(product._id, product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteProduct(product._id)}
                    >
                      <Delete />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <ProductModal
          open={modals.product}
          onClose={handleCloseModal}
          onSubmit={handleProductSubmit}
          {...productForm}
          setName={(name) => setProductForm((prev) => ({ ...prev, name }))}
          setDescription={(description) =>
            setProductForm((prev) => ({ ...prev, description }))
          }
          setPrice={(price) => setProductForm((prev) => ({ ...prev, price }))}
          setCategory={(category) =>
            setProductForm((prev) => ({ ...prev, category }))
          }
          setImage={(image) => setProductForm((prev) => ({ ...prev, image }))}
          setInventory={(inventory) =>
            setProductForm((prev) => ({ ...prev, inventory }))
          }
          isEditMode={isEditMode}
          categories={categories}
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
      </Container>
    </ThemeProvider>
  );
};

export default Products;
