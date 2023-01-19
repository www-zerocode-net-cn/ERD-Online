const {createServer} = require("node:http");
const {Server} = require("socket.io");

const httpServer = createServer();
const server = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8000"
  }
});

server.on("connection", (socket) => {
  // 提取参数
  const roomId = socket.handshake.query['roomId'];
  // 加入房间
  socket.join(roomId);
  console.log(9, roomId);
  server.to(roomId).emit('historyRecord', 'historyRecord:1234');
  console.log(11, roomId);

  // 转发广播消息
  socket.on('msg', msg => {
    console.log('转发msg', msg)
    server.to(roomId).emit('msg', msg);

  });

  // 监听用户加入 先发历史记录 再发上线记录
  socket.on('join', m => {
    console.log(47, m,)
    let info = m;
    // socket.emit('historyRecord', 'server:historyRecord:123');
    server.to(roomId).emit('msg', {
      username: m,
      msg: `${m}加入`
    });
  });
  // 离开
  socket.on('leave',  username=> {
    // 离开房间
    socket.leave(roomId);
    server.to(roomId).emit('msg', {
      username: username,
      msg: `${username}离开`
    });
  });
  // 同步
  socket.on('sync',  payload=> {
    console.log('sync', payload);
    server.to(roomId).emit('sync', payload);
  });


});

httpServer.listen(3000);
