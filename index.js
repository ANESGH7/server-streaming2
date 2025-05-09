const express = require('express');
const { WebSocketServer } = require('ws');
const app = express();

let lastFrame = null;
const fps = 30;  // Frames per second

// Set up WebSocket server
const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('🔄 New WebSocket client connected');
    
    // Send frames to the client as they are captured
    const interval = setInterval(() => {
        if (lastFrame) {
            ws.send(lastFrame);  // Send the latest frame to the client
        }
    }, 1000 / fps);  // Adjust the frame rate

    ws.on('close', () => {
        console.log('❌ WebSocket client disconnected');
        clearInterval(interval);  // Stop sending frames to this client
    });
});

// Handle image uploads (for capturing frames)
app.use(express.raw({ type: 'image/jpeg', limit: '5mb' }));

app.post('/upload', (req, res) => {
    console.log(`📷 Received image of size: ${req.body.length} bytes`);

    if (!req.body || req.body.length === 0) {
        return res.status(400).send('❌ Invalid image data');
    }

    lastFrame = req.body;  // Store the latest frame for streaming
    res.sendStatus(200);
});

// Start the HTTP server
app.listen(3000, () => {
    console.log('✅ Server is running at http://localhost:3000');
});
