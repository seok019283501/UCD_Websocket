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
  
  // RabbitMQ 구독 설정
  try {
    await channel.assertQueue(queueName);
    await channel.consume(queueName, (msg) => {
      const newMember = JSON.parse(msg.content.toString());
      res.write(`data: ${JSON.stringify(newMember)}\n\n`);
    }, { noAck: true });
  } catch (error) {
    console.error('RabbitMQ 구독 중 오류 발생:', error);
    res.end();  // 오류 발생 시 연결 종료
  }

  req.on('close', () => {
    console.log('SSE 연결이 종료되었습니다.');
    res.end();
  });
};

// RabbitMQ 초기화 및 채널 설정
(async () => {
  channel = await initRabbitMQ();
})();