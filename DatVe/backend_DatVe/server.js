const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

let seats = {
    showtimeId: 1,
    layout: {
        A: Array(15).fill("standard"),
        B: Array(15).fill("standard"),
        C: Array(15).fill("vip"),
        D: Array(15).fill("vip"),
        E: Array(15).fill("sold"),
        F: Array(15).fill("sold"),
        J: Array(15).fill("standard"),
        K: Array(15).fill("standard"),
        L: Array(8).fill("couple")
    },
    sold: ["E1", "E2", "F1", "F2", "J10"]
};

app.get('/api/seats/:showtimeId', (req, res) => {
    res.json(seats);
});

// API đặt vé
app.post('/api/book', (req, res) => {
    const { showtimeId, selectedSeats } = req.body;

    if (showtimeId != seats.showtimeId) {
        return res.status(400).json({ message: "Suất chiếu không tồn tại" });
    }

    // Kiểm tra ghế đã bán chưa
    for (let s of selectedSeats) {
        if (seats.sold.includes(s)) {
            return res.status(400).json({ message: `Ghế ${s} đã được bán!` });
        }
    }

    // Cập nhật danh sách ghế sold
    seats.sold.push(...selectedSeats);

    // Gửi realtime tới tất cả client khác
    io.emit("seatsUpdated", seats);

    res.json({ message: "Đặt vé thành công", booked: selectedSeats });
});

// Socket.IO kết nối realtime
io.on("connection", (socket) => {
    console.log("⚡ Client connected");

    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
});

server.listen(5000, () => {
    console.log("Server chạy tại http://localhost:5000");
});
