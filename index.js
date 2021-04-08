import express from "express";
import http from "http";

const game = express();
const server = http.createServer(game);

//game.use(express.static("public"));

server.listen(3000, () => {
  console.log(`> Server listening on port: 3000`);
});
