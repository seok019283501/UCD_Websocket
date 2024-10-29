const amqp = require('amqplib');

let channel;

// RabbitMQ 초기화
const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
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
const notifyMemberJoin = async (username, roomNumber) => {
  try {
    const message = { username, roomNumber, message: '새로운 회원이 참여했습니다!' };
    channel.publish('member_notifications', roomNumber, Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
};

// 특정 방에 대한 퇴장 메시지 전송
const notifyMemberExit = async (username, roomNumber) => {
  try {
    const message = { username, roomNumber, message: '회원이 나갔습니다.' };
    channel.publish('member_notifications', roomNumber, Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
};

module.exports = { initRabbitMQ, notifyMemberJoin, notifyMemberExit };