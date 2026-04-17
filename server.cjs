import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// servir o build do Vue
app.use(express.static("dist"));

io.on("connection", (socket) => {
    console.log("Usuário conectado");

    socket.on("update", () => {
        socket.broadcast.emit("refresh");
    });
});

server.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});