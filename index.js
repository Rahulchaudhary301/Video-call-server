

const express = require("express")
const http = require("http")
const app = express()
const server = http.createServer(app)
const io = require("socket.io")(server, {
	cors: {
		origin: "https://rahulscreenvideo.netlify.app",
		//origin: "http://localhost:3000",
		methods: [ "GET", "POST" ]
	}
})



io.on("connection", (socket) => {

	socket.broadcast.emit('usrToCall',{id:socket.id})

	socket.emit("me", socket.id)

	socket.on('callStatuss',(data)=>{
		socket.broadcast.emit('callrecstatus',data)
	})


	socket.on('bothEnd',({msg,id})=>{


		io.to(id).emit('cutCallBoth',msg)
	})




	socket.on('misedcall',({msg,id})=>{
		
		io.to(id).emit('missed',{msg,id})
	})


	socket.on('callAgain',(data)=>{
		socket.broadcast.emit('callAgains',data)
	})

	socket.on('muteRing',(data)=>{
		socket.broadcast.emit('muteRingCall',data)
	})


	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")

		socket.broadcast.emit('usserRemove',socket.id);

	  
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

   

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
})

server.listen(5000, () => console.log("server is running on port 5000"))