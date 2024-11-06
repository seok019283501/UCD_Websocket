const amqp = require('amqplib');
const {CollaborationMemberEntity} = require('./src/entities/CollaborationMemberEntity');

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
    const existingDocument = await CollaborationMemberEntity.find({ roomNumber: roomNumber });
    const message = { existingDocument };
    channel.publish('member_notifications', roomNumber, Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
};

// 특정 방에 대한 퇴장 메시지 전송
const notifyMemberExit = async (username, roomNumber) => {
  try {
    const existingDocument = await CollaborationMemberEntity.find({ roomNumber: roomNumber });
    const message = { existingDocument };
    channel.publish('member_notifications', roomNumber, Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
};

module.exports = { initRabbitMQ, notifyMemberJoin, notifyMemberExit };