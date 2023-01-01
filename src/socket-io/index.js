const {createServer} = require("http");
const {Server} = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8000"
  }
});

io.on("connection", (socket) => {
  // 提取参数
  const roomId = socket.handshake.query['roomId'];
  console.log(15, roomId);
  // 加入房间
  socket.join(roomId);
  console.log(6, 'socket', socket);
  // 转发广播消息
  socket.on('msg', msg => {
    socket.to(roomId).emit('msg', msg);

  });

  // 监听用户加入 先发历史记录 再发上线记录
  socket.on('join', m => {
    console.log(47, socket)
    info = m;
    socket.emit('historyRecord', 'historyRecord');
    socket.to(roomId).emit('msg', {
      type: 'join',
      value: {
        info: 'llala',
        time: '234',
        // count: socket.clients().adapter.rooms[roomId].length
      }
    });
  });

  // 广播某某掉线
  socket.on('disconnect', () => {
    socket.to(roomId).emit('msg', {
      type: 'exit',
      value: {
        info: 'llala',
        time: '234',
        // count: socket.clients().adapter.rooms[roomId]?.length || 0
      }
    });
  });


});


httpServer.listen(3000);

