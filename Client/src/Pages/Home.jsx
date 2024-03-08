import React, { useState } from "react";
import { Box, Container, Tab, Tabs, Typography } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { useNavigate } from "react-router-dom";
import { Login, Signup } from "../Components";

const Home = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingY: 4,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: 3,
          backgroundColor: "primary.main",
          width: "100%",
          marginBottom: 2,
          borderRadius: 4,
        }}
      >
        <Typography variant="h3" fontFamily="Work Sans" color="white">
          BlitzTalk
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "background.paper",
          width: "100%",
          padding: 4,
          borderRadius: 4,
        }}
      >
        <Tabs
          value={value}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="icon tabs example"
        >
          <Tab
            value={0}
            label="Login"
            icon={<LockIcon />}
            aria-label="lock"
          ></Tab>
          <Tab
            value={1}
            label="Signup"
            icon={<PersonAddIcon />}
            aria-label="person-add"
          ></Tab>
        </Tabs>
        {value == 0 && <Login />}
        {value == 1 && <Signup />}
      </Box>
    </Container>
  );
};

export default Home;
