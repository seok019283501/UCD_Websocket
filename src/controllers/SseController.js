const { initRabbitMQ } = require('../../RabbitMQ.js');

let channel;

exports.userAttendEvent = async (req, res) => {
  const roomNumber = req.params.id;
  console.log(`SSE 요청 수신: roomNumber=${roomNumber}`);

  if (!channel) {
    return res.status(500).send('RabbitMQ 채널이 초기화되지 않았습니다.');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 동적 큐 생성 후 교환기 바인딩
  console.log(roomNumber)
  const { queue } = await channel.assertQueue('', { exclusive: true });
  await channel.bindQueue(queue, 'member_notifications', roomNumber);
  console.log(`바인딩된 큐: ${queue}, 방 번호: ${roomNumber}`);

  channel.consume(queue, (msg) => {
    if (msg !== null) {
      const newMember = JSON.parse(msg.content.toString());
      res.write(`data: ${JSON.stringify(newMember)}\n\n`);
    }
  }, { noAck: true });

  req.on('close', () => {
    console.log('SSE 연결 종료');
    res.end();
  });
};

// RabbitMQ 초기화 및 채널 설정
(async () => {
  channel = await initRabbitMQ();
  console.log('RabbitMQ 채널 초기화 완료');
})();