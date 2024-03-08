import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Add this import
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const navigate = useNavigate(); // Change variable name from 'history' to 'navigate'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast.warning("Please Fill all the Fields", {
        autoClose: 5000,
        position: toast.POSITION ? toast.POSITION.BOTTOM_RIGHT : "bottom-right",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const response = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );

      if (response && response.data) {
        toast.success("Login Successful", {
          autoClose: 5000,
          position: toast.POSITION
            ? toast.POSITION.BOTTOM_RIGHT
            : "bottom-right",
        });
        // setUser(response.data);
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        setLoading(false);
        setTimeout(() => navigate("/chats"), 1000);
      } else {
        toast.error("Invalid response format", {
          autoClose: 5000,
          position: toast.POSITION
            ? toast.POSITION.BOTTOM_RIGHT
            : "bottom-right",
        });
        setLoading(false);
      }
    } catch (error) {
      toast.error(`Error Occurred: ${error.response?.data?.message}`, {
        autoClose: 5000,
        position: toast.POSITION ? toast.POSITION.BOTTOM_RIGHT : "bottom-right",
      });
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={4} p={4}>
      <ToastContainer />
      <FormControl fullWidth required>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded"
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
          className="border p-2 rounded"
        />
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={submitHandler}
        disabled={loading}
        className="bg-blue-500 text-white p-2 rounded mt-4"
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
        className="bg-red-500 text-white p-2 rounded mt-4"
      >
        Get Guest User Credentials
      </Button>
    </Box>
  );
};

export default Login;
