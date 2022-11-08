import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "*" }));
// app.use(cors({
//   origins: [
//     "https://ss-details.herokuapp.com",
//     "http://localhost:4200",
//   ]
// }));

import routes from "./index.js";
app.use("/", routes);

app.listen(port, () => console.log(`Example app listening on port ${port}`));

