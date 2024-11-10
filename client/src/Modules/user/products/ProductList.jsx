// src/ProductList.jsx
import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import ProductCard from "./ProductCard"; // Import your ProductCard component
import { useSearchParams } from "react-router-dom";
import axios from "axios"; // Import axios

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const [searchParams] = useSearchParams(); // Get query parameters

  // Get the category from the URL search parameters
  const category = searchParams.get("category") || "all"; // Default to "all" if no category is specified

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading to true before the fetch request
        console.log(`Fetching products for category: ${category}`);
        const response = await axios.get(`/api/products`, {
          params: { category },
        }); // Fetch products based on the category using axios
        console.log("Fetched products:", response.data); // Debugging statement
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch products."); // Set error message
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false after the fetch request
      }
    };

    fetchProducts();
  }, [category]); // Dependency on `category` to refetch products when it changes

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Loading products...
      </Typography>
    ); // Display loading message
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 4 }}>
        {error}
      </Typography>
    ); // Display error message
  }

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      sx={{
        paddingLeft: { xs: 2, sm: 4, md: 6 }, // Responsive padding for various screen sizes
        paddingRight: { xs: 2, sm: 4, md: 6 },
        paddingTop: { xs: 2, sm: 4, md: 6 },
        paddingBottom: { xs: 2, sm: 4, md: 6 },
      }}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Grid>
        ))
      ) : (
        <Grid item xs={12}>
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products available for this category.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export default ProductList;
