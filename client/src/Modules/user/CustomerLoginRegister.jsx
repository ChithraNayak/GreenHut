import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  Link,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { green } from "@mui/material/colors";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Lock from "@mui/icons-material/Lock";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const CustomerLoginRegister = () => {

  const api = axios.create({
    baseURL: config.host + "/api",
    timeout: 1000,
  });
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    newPassword: "", // for password reset
    confirmNewPassword: "", // for password reset
  });
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("CustomerLoginRegister component mounted");
    return () => {
      console.log("CustomerLoginRegister component unmounted");
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const endpoint = isLogin ? "Userlogin" : "Userregister";
      const response = await axios.post(
        `${config.host}/api/users/${endpoint}`,
        formData
      );
      if (isLogin) {
        localStorage.setItem("userToken", JSON.stringify(response.data.token));
        navigate("/");
      } else {
        setMessage("Registered successfully! Please login now.");
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
        });
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          (isLogin
            ? "Login failed. Please check your credentials and try again."
            : "Registration failed. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    if (formData.newPassword !== formData.confirmNewPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post(
        `${config.host}/api/users/reset-password`,
        { email: formData.email, newPassword: formData.newPassword }
      );
      setMessage(response.data.message);
      setShowForgotPassword(false);
      setFormData({
        ...formData,
        email: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Password reset failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: "url(/assets/images/Plants-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          maxWidth: 400,
          width: "100%",
          textAlign: "center",
          borderRadius: 2,
          boxShadow: 4,
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: green[700] }}>
          {showForgotPassword
            ? "Reset Password"
            : isLogin
            ? "Customer Login"
            : "Customer Register"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        {showForgotPassword ? (
          <form onSubmit={handlePasswordReset}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
            {loading ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 2,
                  backgroundColor: green[700],
                  "&:hover": {
                    backgroundColor: green[800],
                  },
                }}
              >
                Reset Password
              </Button>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <TextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
            )}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            {!isLogin && (
              <FormControlLabel
                control={<Checkbox required color="primary" />}
                label="Agree to terms and conditions"
                sx={{ alignSelf: "flex-start", mt: 1, mb: 2 }}
              />
            )}
            {loading ? (
              <CircularProgress sx={{ mt: 2 }} />
            ) : (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  marginTop: 2,
                  backgroundColor: green[700],
                  "&:hover": {
                    backgroundColor: green[800],
                  },
                }}
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            )}
            <Link
              href="#"
              variant="body2"
              sx={{ display: "block", mt: 2, cursor: "pointer" }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Register"
                : "Already have an account? Login"}
            </Link>
          </form>
        )}
        {/* <Link
          href="#"
          variant="body2"
          sx={{ display: "block", mt: 2, cursor: "pointer" }}
          onClick={() => setShowForgotPassword(!showForgotPassword)}
        >
          {showForgotPassword
            ? "Back to Login/Register"
            : isLogin
            ? "Forgot Password?"
            : "Forgot Password?"}
        </Link> */}
        {message && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CustomerLoginRegister;
