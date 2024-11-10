import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import EventIcon from "@mui/icons-material/Event";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import axios from "axios";
import config from "../../../../config";
import { useState } from "react";

const DeepGreenText = styled("span")({
  color: "#004d00", // Deep Green color
  fontWeight: "bold",
});

const Home = () => {
  // Dummy data for appointments, queries, and timings
  const appointments = [
    { id: 1, customerName: "John Doe", date: "2024-07-10", time: "10:00 AM" },
    { id: 2, customerName: "Jane Smith", date: "2024-07-12", time: "2:30 PM" },
    // Add more appointment data as needed
  ];

  const queries = [
    { id: 1, customerName: "Alice Brown", query: "Summer is good for Roses?" },
    {
      id: 2,
      customerName: "Bob Green",
      query: "Which Fertilizer is good for growing Jasmin?",
    },
    // Add more query data as needed
  ];

  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("expertToken"));
    axios
      .get(`${config.host}/api/experts/getAppointmentsCount`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        if (res.data.success) {
          setCounts({ all: res.data.all, pending: res.data.pending });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h2" gutterBottom color="#004d00">
          Hello Expert!
        </Typography>
        <Typography
          variant="body1"
          gutterBottom
          color="textSecondary"
          sx={{ fontSize: "1.2rem" }}
        >
          Welcome to the dashboard. Here you can see an overview of the
          application’s key statistics.
        </Typography>
        <Typography variant="h4" sx={{ mt: 4 }} gutterBottom color="#004d00">
          Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <EventIcon sx={{ mr: 1, color: "#004d00" }} />
                  <Typography variant="h3" component="div" color="textPrimary">
                    <DeepGreenText>{counts?.all}</DeepGreenText>
                  </Typography>
                </Box>
                <Typography variant="body1" color="textPrimary" sx={{ mt: 1 }}>
                  Total Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <QuestionAnswerIcon sx={{ mr: 1, color: "#004d00" }} />
                  <Typography variant="h3" component="div" color="textPrimary">
                    <DeepGreenText>{counts?.pending}</DeepGreenText>
                  </Typography>
                </Box>
                <Typography variant="body1" color="textPrimary" sx={{ mt: 1 }}>
                  Pending Appointments
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Home;
