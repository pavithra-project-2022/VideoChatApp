const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");
// const mongodb = require('mongodb');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const mongoClient = mongodb.MongoClient;
// const URL = 'mongodb+srv://pavi:pavi@cluster0.ydkuj.mongodb.net/VideoChatApp?retryWrites=true&w=majority';

const io = require("socket.io")(server, {
	cors: {
		origin: "*",
		methods: [ "GET", "POST" ]
	}
});

app.use(cors());

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
	res.send('Running');
});

io.on("connection", (socket) => {
	socket.emit("me", socket.id);

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	});

	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	});
});



  
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
