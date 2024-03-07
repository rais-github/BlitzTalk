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
import { CloudUpload } from "@mui/icons-material";
import { Box } from "@mui/system";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [picLoading, setPicLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    postDetails(file);
  };

  const submitHandler = () => {
    setPicLoading(true);

    // Your form submission logic here

    setPicLoading(false);
  };

  const postDetails = (pics) => {
    setPicLoading(true);

    // Your file upload logic here

    setPicLoading(false);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <FormControl fullWidth required>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth required>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl fullWidth required>
        <FormLabel>Password</FormLabel>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl fullWidth required>
        <FormLabel>Confirm Password</FormLabel>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Confirm password"
          onChange={(e) => setConfirmpassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={handleClickShowPassword}>
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton component="label">
                <CloudUpload />
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
        disabled={picLoading}
        style={{ marginTop: "15px" }}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;
