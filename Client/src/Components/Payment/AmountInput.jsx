import { TextField, Button } from "@mui/material";

const AmountInput = ({ isGroupChat }) => {
  console.log("AmountInput", isGroupChat);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isGroupChat ? (
        <span className="text-red-500 text-sm mb-4">
          You are in a group chat. Payments might be visible to all
          participants.
        </span>
      ) : (
        <>
          <div className="text-3xl font-bold mb-8 text-center">
            Enter Amount in Rupees
          </div>
          <div className="w-72 mb-8">
            <TextField
              label="Amount"
              variant="outlined"
              type="number"
              InputProps={{
                inputProps: {
                  min: 0,
                },
              }}
              fullWidth
            />
          </div>
          <div className="text-xl mb-4 text-center">
            Highlighting some benefits of using this form:
          </div>
          <ul className="list-disc pl-6 mb-8 text-lg">
            <li>Convenient and secure way to make payments</li>
            <li>Supports multiple payment methods</li>
            <li>Real-time transaction updates</li>
          </ul>
          <Button variant="contained" color="primary" className="w-72">
            Proceed to Payment
          </Button>
        </>
      )}
    </div>
  );
};

export default AmountInput;
