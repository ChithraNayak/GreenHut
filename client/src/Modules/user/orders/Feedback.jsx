import { Button, Chip, Paper } from "@mui/material";
import React from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Rating from "@mui/material/Rating";
import Box from "@mui/material/Box";
import StarIcon from "@mui/icons-material/Star";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import config from "../../../config";

const labels = {
  0.5: "Useless",
  1: "Useless+",
  1.5: "Poor",
  2: "Poor+",
  2.5: "Ok",
  3: "Ok+",
  3.5: "Good",
  4: "Good+",
  4.5: "Excellent",
  5: "Excellent+",
};

function getLabelText(value) {
  return `${value} Star${value !== 1 ? "s" : ""}, ${labels[value]}`;
}

export default function Feedback({
  order,
  setState,
  state,
  forProduct,
  product,
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(2);
  const [feedback, setFeedback] = React.useState("");
  const [hover, setHover] = React.useState(-1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFeedback("");
  };

  const feedbackForOrder = () => {
    let token = JSON.parse(localStorage.getItem("userToken"));
    axios
      .put(
        `${config.host}/api/order/giveReview/${order?._id}`,
        { rating: value, feedback },
        {
          headers: { "auth-token": token },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "success",
          });
          setState(!state);
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const feedbackForProduct = () => {
    let token = JSON.parse(localStorage.getItem("userToken"));
    axios
      .put(
        `${config.host}/api/products/giveRating/${product}`,
        {
          rating: value,
          feedback,
        },
        {
          headers: { "auth-token": token },
        }
      )
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setSnackbar({
            open: true,
            message: res.data.message,
            severity: "success",
          });
          setState(!state);
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (forProduct) {
      feedbackForProduct();
    } else {
      feedbackForOrder();
    }
  };

  return (
    <div>
      {forProduct ? (
        <Chip
          component={Paper}
          elevation={3}
          label="Ratings"
          size="small"
          color="warning"
          onClick={handleClickOpen}
        />
      ) : (
        <Button
          size="medium"
          onClick={handleClickOpen}
          color="primary"
          variant="outlined"
          sx={{
            backgroundColor: "#1976d2", // Blue background color
            color: "#fff", // White text color
            "&:hover": {
              backgroundColor: "#1565c0", // Darker blue on hover
            },
          }}
        >
          Feedback
        </Button>
      )}
      <Dialog
        fullWidth
        component={"form"}
        onSubmit={handleSubmit}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Feedback</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Submit your valuable feedback about your order.
          </DialogContentText>
          <Box>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                p: 5,
                justifyContent: "center",
              }}
            >
              <Rating
                size="large"
                name="hover-feedback"
                value={value}
                precision={0.5}
                getLabelText={getLabelText}
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
                onChangeActive={(event, newHover) => {
                  setHover(newHover);
                }}
                emptyIcon={
                  <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                }
              />
              {value !== null && (
                <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
              )}
            </Box>
            <Box>
              <TextField
                autoFocus
                required
                margin="dense"
                id="name"
                name="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                label="Feedback"
                placeholder="type your feedback here"
                fullWidth
                variant="standard"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Submit</Button>
        </DialogActions>
      </Dialog>
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
    </div>
  );
}
