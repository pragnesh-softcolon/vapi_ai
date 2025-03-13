const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json()); // For JSON payloads
app.use(express.urlencoded({ extended: true })); // For URL-encoded payloads
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dummy database to store booked slots
let bookedSlots = [];

/**
 * Check if a slot is available
 * 
 */
app.get("/check-slot", (req, res) => {


  const { date, time } = req.query;
  const {body} = req.body;
  console.log("body",body);
  

  if (!date || !time) {
    console.log("date",date);
    console.log("time",time);
    
    
    return res
      .status(400)
      .json({ status: false, message: "Date and Time are required." });
  }

  const isBooked = bookedSlots.some(
    (slot) => slot.date === date && slot.time === time
  );

  console.log("isBoked Sloat chek",isBooked);
  

  res.status(200).json({
    status: !isBooked,
    message: isBooked ? "Slot is already booked." : "Slot is available.",
  });
});

/**
 * Book a slot
 */
app.post("/book-slot", (req, res) => {
  const { userId, date, time } = req.query;
  const {body} = req.body;
  console.log(req);
  
  console.log("body",body);
  if (!userId || !date || !time) {
    console.log("User id", userId);
    console.log("date", date);
    console.log("time", time);

    return res
      .status(400)
      .json({
        status: false,
        message: "User ID, Date, and Time are required.",
      });
  }

  const isBooked = bookedSlots.some(
    (slot) => slot.date === date && slot.time === time
  );
  console.log("isBooked while booking", isBooked);

  if (isBooked) {
    return res
      .status(409)
      .json({ status: false, message: "Slot already booked." });
  }

  // Book the slot
  const booking = { userId, date, time };
  bookedSlots.push(booking);
  console.log("Success", bookedSlots);

  res.status(200).json({
    status: true,
    message: "Slot booked successfully",
    booking,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
