const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const app = express();

const { rootRouter, userRouter } = require("./routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());

// Routers
app.use("/api", rootRouter);
app.use("/api/user", userRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    //res.sendFile(path.resolve(__dirname,'..','..','client','build','index.html'));
  });
}

// app.listen(process.env.PORT || 3333);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
const createGame = require("./game.js");

const game = createGame();

io.on("connection", (socket) => {
  const playerId = socket.id;
  console.log(`> Player connected: ${playerId}`);
  console.log(game.state)
  socket.emit("setup", game.state);
});

server.listen(3333, () => {
  console.log(`> Server listening on port: 3333`);
});
