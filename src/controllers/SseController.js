const {CollaborationMemberEntity} = require("../entities/CollaborationMemberEntity.js");
const {initRabbitMQ} = require('../../RabbitMQ.js');

let channel;

exports.userAttendEvent = async (req, res) => {
  if (!channel) {
    return res.status(500).send('RabbitMQ 채널이 초기화되지 않았습니다.');
  }
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  const sendJoinMessage = (message) => {
    res.write(`data: ${JSON.stringify(message)}\n\n`);
  };

  // RabbitMQ 구독 설정
  channel.consume('member_notifications', (msg) => {
    const newMember = JSON.parse(msg.content.toString());
    sendJoinMessage(newMember);
  }, { noAck: true });

  req.on('close', () => {
    console.log('SSE 연결이 종료되었습니다.');
    res.end();
  });
  
};

(async () => {
  channel = await initRabbitMQ(); // 채널 초기화
})();