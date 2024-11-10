import React, { useState } from "react";
import { Modal, Box, TextField, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
// import QRCode from "react-qr-code";  // Add this if you need QR code generation

const PaymentModal = ({ open, onClose, paymentMethod, handlePaymentDetails }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    handlePaymentDetails(cardNumber, transactionId);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography id="payment-modal-title" variant="h6" component="h2" gutterBottom>
          Payment Detailsss
        </Typography>
        <form onSubmit={handleSubmit}>
          {paymentMethod === "Card" && (
            <>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                sx={{ marginBottom: 2 }}
                required
              />
              <Button variant="contained" color="primary" type="submit">
                Submit Payment
              </Button>
            </>
          )}
          {paymentMethod === "UPI" && (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                {/* <QRCode value="upi://pay?pa=your-upi-id@upi&pn=YourName&mc=1234&tid=0000000000000000&tr=1234567890&tn=Payment%20for%20order&am=10.00&cu=INR&url=" /> */}
                <Typography sx={{ marginTop: 2, marginBottom: 2 }}>Scan the QR Code to Pay</Typography>
                <TextField
                  fullWidth
                  label="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  required
                />
                <Button variant="contained" color="primary" type="submit">
                  Submit Payment
                </Button>
              </Box>
            </>
          )}
          {paymentMethod === "Cash" || paymentMethod === "Delivery" && (
            <Typography variant="body1">
              Payment will be collected {paymentMethod === "Cash" ? "upon delivery." : "during delivery."}
            </Typography>
          )}
        </form>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
