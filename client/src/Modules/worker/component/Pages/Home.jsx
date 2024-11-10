import React, { useState } from "react";
import { Card, CardContent, Grid, Typography, styled } from "@mui/material";
import PendingIcon from "@mui/icons-material/HourglassEmpty";
import AcceptedIcon from "@mui/icons-material/CheckCircleOutline";
import DeclinedIcon from "@mui/icons-material/Cancel";
import DeliveredIcon from "@mui/icons-material/LocalShipping";
import { useEffect } from "react";
import axios from "axios";
import config from "../../../../config";

const DeepGreen = "#004d00"; // Define the Deep Green color

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: theme.spacing(2),
}));

const Home = () => {
  const [counts, setCounts] = useState(null);
  useEffect(() => {
    let token = JSON.parse(localStorage.getItem("deliveryToken"));
    axios
      .get(`${config.host}/api/deliveryworkers/getAllCounts`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setCounts({
            all: res.data.all,
            pending: res.data.pending,
            delivered: res.data.delivered,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <>
      <Typography variant="h2" gutterBottom style={{ color: DeepGreen }}>
        Hello Delivery!
      </Typography>
      <Typography variant="body1" gutterBottom style={{ color: "black" }}>
        Welcome to the delivery dashboard. Here you can see an overview of the
        application’s key statistics.
      </Typography>
      <Typography variant="h4" gutterBottom style={{ color: DeepGreen }}>
        Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6} sm={4}>
          <StyledCard>
            <PendingIcon
              style={{ fontSize: 60, marginBottom: "16px", color: DeepGreen }}
            />
            <CardContent>
              <Typography variant="h6" style={{ color: DeepGreen }}>
                Pending
              </Typography>
              <Typography variant="h4">{counts?.pending}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        <Grid item xs={6} sm={4}>
          <StyledCard>
            <AcceptedIcon
              style={{ fontSize: 60, marginBottom: "16px", color: DeepGreen }}
            />
            <CardContent>
              <Typography variant="h6" style={{ color: DeepGreen }}>
                Total Orders
              </Typography>
              <Typography variant="h4">{counts?.all}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
        {/* <Grid item xs={6} sm={4}>
          <StyledCard>
            <DeclinedIcon
              style={{ fontSize: 60, marginBottom: "16px", color: DeepGreen }}
            />
            <CardContent>
              <Typography variant="h6" style={{ color: DeepGreen }}>
                Declined
              </Typography>
              <Typography variant="h4">3</Typography>
            </CardContent>
          </StyledCard>
        </Grid> */}
        <Grid item xs={6} sm={4}>
          <StyledCard>
            <DeliveredIcon
              style={{ fontSize: 60, marginBottom: "16px", color: DeepGreen }}
            />
            <CardContent>
              <Typography variant="h6" style={{ color: DeepGreen }}>
                Delivered
              </Typography>
              <Typography variant="h4">{counts?.delivered}</Typography>
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
