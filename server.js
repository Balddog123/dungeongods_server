import express from "express";
import cors from "cors";
import dungeons from "./routes/dungeon.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/dungeon", dungeons);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});