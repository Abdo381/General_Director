const app = require('./app/src/app')
const PORT = process.env.PORT | 3000
// app.listen(PORT, ()=>console.log(`we are on http://localhost:${PORT}`))
// const app = require('./app/src/app')
const httpServer = require('http').createServer(app);
    const io = require('socket.io')(httpServer, {
      cors: {origin : '*'}
    })
const port = process.env.PORT || 3000;
// var controller = require('./app/controller/teachers.controller');
// const teacher =require('./app/controller/teachers.controller')
// teacher.start(io);
// io.on('connection', (socket) => {
//   socket.on('103', (message) => {
//     console.log(message)

//     io.emit('message', [message]);
//   });
//   socket.on('disconnect', () => {
//   });
// })
// io.sockets.on('connection', controller.get() );
// const fs = require("fs");

// Multilevel directory

const a  =[1,2]
a[0] = 10
a[1] = 20
a[2] = 30
console.log(a)
httpServer.listen(port, () => console.log(`we are on http://listening on port ${port}`));
