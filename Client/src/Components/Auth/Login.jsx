import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box } from "@mui/system";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = () => {
    setLoading(true);

    // Your login submission logic here

    setLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth required>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth required>
        <FormLabel>Password</FormLabel>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={submitHandler}
        disabled={loading}
        style={{ marginTop: "15px" }}
      >
        Login
      </Button>
      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
        style={{ marginTop: "15px" }}
      >
        Get Guest User Credentials
      </Button>
    </Box>
  );
};

export default Login;
