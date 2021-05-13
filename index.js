const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");

const createGameInstance = require("./game.js");

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
const sockets = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const gameInstance = createGameInstance();

gameInstance.subscribe((command) => {
  console.log(`> Emitting ${command.type}`);
  sockets.emit(command.type, command);
});

sockets.on("connect", (socket) => {
  const playerId = socket.id;

  //get user info from local storage
  const { name, admin, imageURL } = socket.handshake.query; // include in future query directly to Mongo

  if (gameInstance.isGameRunning()) {
    // the game is alredy in 'curso'
    socket.emit("setup", { error: "The game has already begun" });
  } else {
    gameInstance.addPlayerToWaitList({ playerId, name, imageURL, admin });

    socket.emit("setup", {
      screen: "wait",
      waitList: gameInstance.server.waitList,
    });
  }

  socket.on("disconnect", () => {
    if (!gameInstance.isGameRunning()) {
      gameInstance.removePlayerInWaitList({ playerId });
    }
  });
});

server.listen(3333, () => {
  console.log(`> Server listening on port: 3333`);
});
