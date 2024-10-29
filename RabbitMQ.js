const amqp = require('amqplib');

let channel;

// RabbitMQ 초기화
const initRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://admin:admin123@localhost:5672');
    channel = await connection.createChannel();
    await channel.assertQueue('member_notifications');
    console.log('RabbitMQ 채널이 성공적으로 초기화되었습니다.');
    return channel;
  } catch (error) {
    console.error('RabbitMQ 초기화 중 오류 발생:', error);
    return null; // 오류 발생 시 null 반환
  }
};

// RabbitMQ를 통해 메시지 전송
const notifyMemberJoin = async(username, roomNumber) => {
  try{
    const message = { username, roomNumber, message: '새로운 회원이 참여했습니다!' };
    channel.sendToQueue('member_notifications', Buffer.from(JSON.stringify(message)));
  }catch(e){
    console.log(e);
  }

};

// RabbitMQ를 통해 메시지 전송
const notifyMemberExit = async (username, roomNumber) => {
  if (!channel) {
    console.log("RabbitMQ 채널이 초기화되지 않았습니다.");
    return;
  }

  try {
    const message = { username, roomNumber, message: '회원이 나갔습니다.' };
    await channel.sendToQueue('member_notifications', Buffer.from(JSON.stringify(message)));
  } catch (e) {
    console.log(e);
  }
};

module.exports = {initRabbitMQ,notifyMemberJoin,notifyMemberExit}



