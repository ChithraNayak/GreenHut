import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';


const theme = createTheme({
  palette: {
    primary: {
      main: '#006400', // Deep green color
    },
    secondary: {
      main: '#008000', // Another shade of green for secondary elements
    },
  },
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('admin'); // Set initial state to 'expert'
  const [passwordError, setPasswordError] = useState(false);
  const host = "http://127.0.0.1:5000";

  const [data, setData] = useState({});
  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();
  const [open2, setOpen2] = useState(false);

  const handleSubmit = () => {
    if (!data.email) {
        setEmailError('Please enter email address.');
    } else if (!data.password) {
        setPasswordError('Please enter password.');
    } else {
        Axios.post(`${host}/api/admin/expert-login`, data)
            .then((response) => {
                console.log("Insert Response : " + response.data.cname);
                if (response.data.success === true) {
                    localStorage.setItem("expertToken", JSON.stringify(response.data.token));
                    setOpen2(true);
                    setTimeout(async()=>{
                        await navigate("/expert");
                         
                    },1000)
                } else {
                    console.log("Some error occurred");
                }
            })
            .catch((err) => {
                console.log("Error : " + err);
            });
    }
};


const handleChange = (e) => {
  setEmailError(false);
  setPasswordError(false);
  setData({ ...data, [e.target.name]: e.target.value });
}
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          backgroundImage: 'url(https://rootbridges.com/cdn/shop/articles/What_Are_The_Basic_Needs_Of_The_Indoor_Plants_To_Survive.jpg?v=1641212409)', // Update the path as needed
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'cover',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              bgcolor: 'rgba(255, 255, 255, 0.8)', // Optional: background for form
              padding: 4,
              borderRadius: 2,
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            Expert
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                type='email'
                onChange={handleChange}
              />
                            {emailError && <p style={{ color: 'red', fontWeight: '100', fontSize: '12px' }}> *{emailError}</p>}

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
                            {passwordError && <p style={{ color: 'red', fontWeight: '100', fontSize: '12px' }}> *{passwordError}</p>}

              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              /> */}
           
              <Button
               onClick={handleSubmit}
              
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid> */}
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Login;
