const { initRabbitMQ } = require('../../RabbitMQ.js');

let channel;

exports.userAttendEvent = async (req, res) => {
  const roomNumber = req.params.roomNumber; // URL에서 협업 공간 ID를 가져옴

  if (!channel) {
    return res.status(500).send('RabbitMQ 채널이 초기화되지 않았습니다.');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  const queueName = `member_notifications_${roomNumber}`;
  
  // 협업 공간 알림 전송
  const sendJoinMessage = (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  };

  // RabbitMQ 구독 설정
  await channel.assertQueue(queueName);
  channel.consume(queueName, (msg) => {
    const newMember = JSON.parse(msg.content.toString());
    sendJoinMessage(newMember);
  }, { noAck: true });

  req.on('close', () => {
    console.log('SSE 연결이 종료되었습니다.');
    res.end();
  });
};

// RabbitMQ 초기화 및 채널 설정
(async () => {
  channel = await initRabbitMQ();
})();