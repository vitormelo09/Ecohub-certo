import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

// escuta atualização global
socket.on("refresh", () => {
    location.reload();
});

// função para avisar atualização
export function enviarAtualizacao() {
    socket.emit("update");
}

export default socket;