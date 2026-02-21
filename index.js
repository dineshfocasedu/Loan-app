require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./DB/connection");
const authRoutes = require("./routes/authRoutes");
const memberRoutes = require("./routes/memberRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/",(req,res)=>{
  console.log("Server is running")
  res.send("Server is Running")
})

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
