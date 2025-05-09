const WebSocket = require("ws");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
    console.log("📡 Client connected");

    ws.on("message", data => {
        // Broadcast frames to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });
});

server.listen(8080, () => console.log("🚀 WebSocket server running on Render"));
