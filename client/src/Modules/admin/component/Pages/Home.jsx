import React from "react";
import { Box, Grid, Paper, Typography, Divider } from "@mui/material";
import {
  Category as CategoryIcon,
  LocalMall as LocalMallIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  DeliveryDining as DeliveryDiningIcon,
  Receipt as ReceiptIcon,
  Feedback as FeedbackIcon,
} from "@mui/icons-material";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
const deepGreen = "#004d00"; // Deep green color for consistency

const statsData = {
  categories: 12,
  products: 35,
  experts: 8,
  customers: 123,
  deliveryWorkers: 5,
  orders: 45,
  feedbacks: 32,
  totalRevenue: 5000, // Example data for Total Revenue
};

const OverviewCard = ({ icon, title, value }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      display: "flex",
      alignItems: "center",
      backgroundColor: "#f4f4f4", // Light background for better contrast
      borderRadius: "8px",
    }}
  >
    {icon}
    <Box sx={{ ml: 2 }}>
      <Typography variant="h5" sx={{ color: deepGreen }}>
        {value}
      </Typography>
      <Typography variant="subtitle1">{title}</Typography>
    </Box>
  </Paper>
);

export default function Home() {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("adminToken"));
    axios
      .get(`${config.host}/api/admin/getAllCounts`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setCounts({
            categories: res.data.categories,
            products: res.data.products,
            experts: res.data.experts,
            customers: res.data.customers,
            orders: res.data.orders,
            bookings: res.data.bookings,
            deliveryPersons: res.data.deliveryPersons,
            amount: res.data.amount,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Box className="container mt-4" sx={{ p: 3 }}>
      <Typography variant="h2" gutterBottom sx={{ color: deepGreen }}>
        Hello Admin!
      </Typography>
      <Typography variant="body1" paragraph>
        Welcome to the admin dashboard. Here you can see an overview of the
        application’s key statistics.
      </Typography>

      {/* Overview Section */}
      <Typography variant="h4" gutterBottom sx={{ color: deepGreen }}>
        Overview
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={<CategoryIcon fontSize="large" sx={{ color: deepGreen }} />}
            title="Categories"
            value={counts?.categories}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={<LocalMallIcon fontSize="large" sx={{ color: deepGreen }} />}
            title="Products"
            value={counts?.products}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={<PersonIcon fontSize="large" sx={{ color: deepGreen }} />}
            title="Experts"
            value={counts?.experts}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={<PeopleIcon fontSize="large" sx={{ color: deepGreen }} />}
            title="Customers"
            value={counts?.customers}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={
              <DeliveryDiningIcon fontSize="large" sx={{ color: deepGreen }} />
            }
            title="Delivery Workers"
            value={counts?.deliveryPersons}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={<ReceiptIcon fontSize="large" sx={{ color: deepGreen }} />}
            title="Orders"
            value={counts?.orders}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <OverviewCard
            icon={
              <CurrencyRupeeIcon fontSize="large" sx={{ color: deepGreen }} />
            }
            title="Income"
            value={counts?.amount}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
