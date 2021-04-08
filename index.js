import express from "express";
import http from "http";

import { createGame } from "./game";

const app = express();
const server = http.createServer(app);

app.use(express.static("public"));

server.listen(3000, () => {
  console.log(`> Server listening on port: 3000`);
});
