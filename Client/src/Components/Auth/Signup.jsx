import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import { Visibility, VisibilityOff, CloudUpload } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const history = useNavigate();

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

  const submitHandler = async (e) => {
    e.preventDefault();
    setPicLoading(true);

    try {
      if (!name || !email || !password || !confirmpassword) {
        toast.warning("Please Fill all the Fields", {
          position: toast.POSITION
            ? toast.POSITION.BOTTOM_RIGHT
            : "bottom-right",

          autoClose: 4000,
        });
        setPicLoading(false);
        return;
      }
      console.log(name, email, password);
      if (password !== confirmpassword) {
        toast.error("Passwords Do Not Match", {
          position: toast.POSITION
            ? toast.POSITION.BOTTOM_RIGHT
            : "bottom-right",

          autoClose: 5000,
        });
        setPicLoading(false);
        return;
      }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log("data", data);
      toast.success("Registration Successful", {
        position: toast.POSITION ? toast.POSITION.BOTTOM_RIGHT : "bottom-right",

        autoClose: 5000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      history("/chats");
    } catch (error) {
      toast.error(
        `Error Occurred: ${error.response?.data?.message || "Unknown error"}`,
        {
          position: toast.POSITION
            ? toast.POSITION.BOTTOM_RIGHT
            : "bottom-right",

          autoClose: 5000,
        }
      );
      setPicLoading(false);
    }
  };

  const postDetails = async (pics) => {
    setPicLoading(true);

    try {
      if (pics && (pics.type === "image/jpeg" || pics.type === "image/png")) {
        const formData = new FormData();
        formData.append("file", pics);
        formData.append("upload_preset", "ChatApp");
        formData.append("cloud_name", "dgvy8j9np");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dgvy8j9np/image/upload",
          formData
        );

        setPic(response.data.url);
        console.log(response.data.url);
        setPicLoading(false);

        toast.success("File Uploaded Successfully", {
          position: toast.POSITION
            ? toast.POSITION.BOTTOM_RIGHT
            : "bottom-right",

          autoClose: 5000,
        });
      } else {
        throw new Error("Invalid file format");
      }
    } catch (error) {
      console.error("File upload failed:", error);
      setPicLoading(false);

      toast.error(`Error: ${error.message || "Unknown error"}`, {
        position: toast.POSITION ? toast.POSITION.BOTTOM_RIGHT : "bottom-right",

        autoClose: 5000,
      });
    }
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <ToastContainer />
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
        type="submit"
      >
        {picLoading ? (
          <CircularProgress size={24} color="inherit" />
        ) : (
          "Sign Up"
        )}
      </Button>
    </Box>
  );
};

export default Signup;
