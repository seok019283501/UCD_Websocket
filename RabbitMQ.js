const amqp = require('amqplib');
const {CollaborationMemberEntity} = require('./src/entities/CollaborationMemberEntity');

let channel;

// RabbitMQ 초기화
const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    channel = await connection.createChannel();

    // Fanout 교환기 선언
    await channel.assertExchange('member_notifications', 'direct');
    console.log('RabbitMQ 채널이 성공적으로 초기화되었습니다.');
    return channel;
  } catch (error) {
    console.error('RabbitMQ 초기화 중 오류 발생:', error);
    return null;
  }
};

// 특정 방에 대한 메시지 전송
const notifyMember = async (users, roomNumber) => {
  try {
    const message = { users };
    channel.publish('member_notifications', roomNumber.toString(), Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
};


module.exports = { initRabbitMQ, notifyMember };