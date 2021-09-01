const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const RoomController = require("./controllers/RoomController");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.get("/init", (req, res) => {
  RoomController.get()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// DB connection
mongoose
  .connect("mongodb://mongo:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    RoomController.init();
    console.log("db Open");
  })
  .catch((error) => {
    console.error("connection error:", error);
  });

const port = 3000;
const server = app.listen(port, () =>
  console.log(`Server running on http://localhost:3000`)
);

// Web sockets
const io = require("socket.io")(server);
io.sockets.on("connection", (socket) => {
  console.log("Client connected: " + socket.id);
  socket.on("mouse", (data) => socket.broadcast.emit("mouse", data));
  socket.on("saveCanvas", (canvasUrl) => RoomController.update(canvasUrl));

  socket.on("disconnect", () => console.log("Client has disconnected"));
});
