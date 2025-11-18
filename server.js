const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const courseRoutes = require("./routes/courses");
app.use("/api/courses", courseRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
