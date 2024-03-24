import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useState } from "react";

const AmountInput = ({ isGroupChat, onClose }) => {
  const [amount, setAmount] = useState("");

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        style: {
          position: "absolute",
          bottom: 0,
          width: "100%",
          maxHeight: "70vh",
          borderRadius: "20px 20px 0 0",
          backgroundColor: "#FFD699",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#FF6F00",
          color: "white",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        {!isGroupChat ? "Enter Amount in Rupees" : "Group Chat Payment Warning"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {isGroupChat ? (
          <span className="text-red-500 text-sm mb-4">
            You are in a group chat. Payments might be visible to all
            participants.
          </span>
        ) : (
          <>
            <div className="text-xl mb-4 text-center">
              Enter Amount in Rupees
            </div>
            <div className="mb-8 px-4">
              <TextField
                label="Amount"
                variant="outlined"
                type="number"
                fullWidth
                InputProps={{
                  inputProps: {
                    min: 0,
                    style: {
                      borderRadius: "8px",
                    },
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                }}
                value={amount}
                onChange={handleAmountChange}
              />
            </div>
            <div className="text-lg mb-4 text-center">
              Highlighting some benefits of using this form:
            </div>
            <ul className="list-disc pl-6 mb-8 text-lg">
              <li>Convenient and secure way to make payments</li>
              <li>Supports multiple payment methods</li>
              <li>Real-time transaction updates</li>
            </ul>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
              >
                Proceed to Payment
              </Button>
            </motion.div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AmountInput;
