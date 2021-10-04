import express from "express";
import { Socket, Server } from "socket.io";

const app = express();

const port = 8000;

const server = require("http").Server(app);
const io: Server = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket: Socket): void => {
  socket.on(
    "join-room",
    (roomID: string, userID: string, userName: string): void => {
      // console.log(`room ${roomID}: ${userID} connected`);

      // Someone has joined, so we want to tell everyone in the room that they have joined.
      // console.log(`${socket.id} joining room ${roomID}`);
      socket.join(roomID);

      socket.broadcast.to(roomID).emit("user-connected", userID, userName);

      socket.on("disconnect", () => {
        // console.log(`${userID} disconnected`);

        if (roomID && userID) {
          socket.to(roomID).emit("user-disconnected", userID);
        }
      });
    }
  );
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
