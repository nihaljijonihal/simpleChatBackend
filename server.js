const express = require("express");
const { createServer } = require("http");
const socket = require("socket.io");

const PORT =  process.env.PORT || 3000;
const app = express();
const server = createServer(app);
const io = socket(server, {
  cors: {
    origin: "*",
  },
});

const userNameArray = [];
const userIdArray = [];

// const io = new server (server)

io.on("connection", (socket) => {
  socket.on("chatJoin", ({ userName, userId }) => {
      
    const newUserId = userId;
    const newUserName = userName;
      
    userNameArray[socket] = newUserName;
    userIdArray[socket] = newUserId;
    console.log(`New User Id ${newUserId} and Name ${newUserName}`);
    io.emit("newUserToast", { newUserName, newUserId });
    
  });

  socket.on("chat", (payload) => {
    io.emit("chat", payload);
    
   
  });

  socket.on("disconnect", () => {
    const leftUserId = userIdArray[socket];
    const leftUserName = userNameArray[socket];
    console.log(`Use Left Id :${leftUserId} Name :${leftUserName}`);
    io.emit("userLeftToast", { leftUserName, leftUserId });
  });
});
server.listen(PORT, () => {
  console.log(`Server is listening at port=> ${PORT}...`);
});
