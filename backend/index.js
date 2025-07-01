const express = require("express");
const app = express();
const cors = require("cors");
const userRoutes = require("./routes/user_routes")
const groupRoutes = require("./routes/group_routes")
const mongoose = require("mongoose");
const dotenv = require("dotenv");

app.use(express.json())

dotenv.config();

app.use(cors());

app.use("/api/users", userRoutes)
app.use("/api/groups", groupRoutes)

mongoose.connect(process.env.MONGO_URL)
.then(() => {
    console.log('Connected to MongoDB')
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err)
})