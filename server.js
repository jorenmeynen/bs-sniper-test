//Install express server
import express from "express";
import path from "path";
import cors from "cors";

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const app_name = "ss-details";





// const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));
// app.use(cors({ origin: "*" }));
// app.use(cors({
//   origins: [
//     "https://ss-details.herokuapp.com",
//     "http://localhost:4200",
//   ]
// }));
app.get("/favicon.ico", (req, res) => "your favicon");
// const routes = require("./api/index.js");
import routes from "./api/index.js";
app.use("/api", routes);














// Serve only the static files form the dist directory
app.use(express.static(`${__dirname}/dist/${app_name}`));

app.get("/*", function (req, res) {
  res.sendFile(path.join(`${__dirname}/dist/${app_name}/index.html`));
});

// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Example app listening on port ${port}`));


