import React, { useState, useEffect } from "react";
import {
  Container,
  Modal,
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  CardMedia,
  Paper,
  CardActions,
} from "@mui/material";
import Layout from "../layout";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "axios";
import config from "../../../config";
import { Rating } from "@mui/material";
// HeroSection Component
const HeroSection = () => {
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
          backgroundColor: "rgba(0, 0, 0, 0.5)",
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
          color: (theme) => theme.palette.secondary.main,
          fontWeight: "bold",
          fontSize: "4rem",
        }}
      >
        Products
      </Typography>
      <Typography
        variant="h6"
        component="p"
        sx={{
          maxWidth: "80%",
          fontFamily: "Berlin Sans FB",
          fontSize: "2rem",
          fontWeight: 400,
        }}
      >
        Discover the wide selection of products available in this category.
      </Typography>
    </Box>
  );
};

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
      main: "#ffffff",
    },
    background: {
      default: "#f5f5f5",
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

const ProductDetailsModal = ({ open, onClose, product }) => (
  <Modal
    open={open}
    onClose={onClose}
    aria-labelledby="product-details-modal"
    aria-describedby="product-details-description"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100%",
        maxWidth: 800,
        bgcolor: "background.paper",
        boxShadow: 24,
        borderRadius: "10px",
        p: 3,
      }}
    >
      {product && (
        <Grid container spacing={3}>
          {/* Left side: Product Information */}
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: "100%", height: "auto", marginBottom: 10 }}
              />
              <Typography variant="body1" gutterBottom>
                {product.description}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Price: ₹{product.price}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {product.inventory > 0 ? "Available" : "Out of Stock"}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  </Modal>
);

const ProductsTest = () => {
  const [products, setProducts] = useState([]);
  const [modals, setModals] = useState({ product: false, details: false });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]); // Cart state
  console.log(cart, "cart");

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

  const handleCloseModal = () => {
    setModals({ product: false, details: false });
  };

  const handleOpenDetailsModal = (product) => {
    setSelectedProduct(product);
    setModals({ ...modals, details: true });
  };

  const handleAddToCart = async (product) => {
    try {
      const token = JSON.parse(localStorage.getItem("userToken"));

      // Make an API call to add the product to the cart
      const response = await api.post(
        "/cart/add",
        {
          productId: product._id,
        },
        {
          headers: { "auth-token": token },
        }
      );

      // Update the cart state with the response data
      setCart(response.data.cart.products);

      // Show a snackbar or alert
      setSnackbar({
        open: true,
        message: `${product.name} added to cart.`,
        severity: "success",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Error adding to cart.",
        severity: "error",
      });
    }
  };
  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <HeroSection />
        <Container sx={{ py: 8 }}>
          <Box sx={{ mb: 5 }}>
            <Button
              variant={selectedCategory ? "outlined" : "contained"}
              color="primary"
              size="large"
              onClick={() => handleCategoryClick(null)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category._id}
                variant={
                  selectedCategory === category.name ? "contained" : "outlined"
                }
                color="primary"
                size="large"
                sx={{ ml: 1 }}
                onClick={() => handleCategoryClick(category.name)}
              >
                {category.name}
              </Button>
            ))}
          </Box>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
              }}
            >
              <CircularProgress />
            </Box>
          ) : filteredProducts.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "50vh",
                textAlign: "center",
              }}
            >
              <Typography variant="h6">No products available.</Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredProducts.map((product) => {
                const averageRating =
                  product.ratings && product.ratings.length > 0
                    ? product.ratings.reduce(
                        (acc, rating) => acc + parseFloat(rating.rating),
                        0
                      ) / product.ratings.length
                    : 0;
                return (
                  <Grid item xs={12} sm={6} md={4} key={product._id}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        mb: 3,
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "transform 0.3s",
                        "&:hover": {
                          transform: "translateY(-10px)",
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.image}
                        alt={product.name}
                        sx={{
                          objectFit: "cover",
                          borderBottom: "1px solid #ddd",
                        }}
                      />
                      <CardContent sx={{ padding: 2 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: "bold",
                            color: "primary.main",
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ₹{product.price}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Status:{" "}
                          {product.inventory > 0 ? "Available" : "Out of Stock"}
                        </Typography>
                        <Box
                          sx={{ display: "flex", alignItems: "center", mt: 1 }}
                        ></Box>
                      </CardContent>
                      <CardActions>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            // mb: 2,
                          }}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleOpenDetailsModal(product)}
                            sx={{ mr: 1 }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.inventory === 0}
                          >
                            Add to Cart
                          </Button>
                        </Box>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
          <ProductDetailsModal
            open={modals.details}
            onClose={handleCloseModal}
            product={selectedProduct}
          />
          <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Container>
      </Layout>
    </ThemeProvider>
  );
};

export default ProductsTest;
