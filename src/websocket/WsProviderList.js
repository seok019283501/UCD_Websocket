const {CollaborationMemberEntity} = require('../entities/CollaborationMemberEntity.js');
const { WebsocketProvider } = require('y-websocket');
const WebSocket = require('ws');
const {notifyMemberJoin,notifyMemberExit} = require('../../RabbitMQ.js');
const Y = require('yjs');

let wsProviderList = [];

//wSProvider 추가
const addWsProvider = (roomNumber) =>{
  const ydoc = new Y.Doc();
  const WebsocketProviderItem = new WebsocketProvider('ws://localhost:1234', roomNumber, ydoc,{WebSocketPolyfill: WebSocket});
  console.log(WebsocketProviderItem)
  wsProviderList.push({ roomNumber, provider: WebsocketProviderItem, ydoc });
}


//유저 수 확인
const checkMember = async(roomNumber) => {
  let roomMemberList = '';
  try{
    roomMemberList = await CollaborationMemberEntity.find({roomNumber:roomNumber});

  }catch(e){
    console.log(e)
  }

  return roomMemberList;
}



// 회원 추가
const addMember = async (username, roomNumber) => {
  const roomMemberList = await checkMember(roomNumber);
  if (roomMemberList.length === 0) {
    addWsProvider(roomNumber);
  }
  try{
    const user = await CollaborationMemberEntity.findOne({ name: username, roomNumber: roomNumber });
    await CollaborationMemberEntity.create({ username, roomNumber });
    // RabbitMQ에 새 회원 알림 메시지 전송
    await notifyMemberJoin(username, roomNumber);
  }catch(e){
    console.log(e)
  }
};

//종료
const exit = async (username,roomNumber) => {
  await CollaborationMemberEntity.deleteOne({ name: username });
  const roomMemberList = checkMember(roomNumber);
  if (roomMemberList.length === 0){
    const index = wsProviderList.findIndex(item => item.roomNumber === roomNumber);
    if (index !== -1) {
      // 해당 wsProviderList 아이템 제거
      wsProviderList.splice(index, 1);
      console.log(`Room ${roomNumber}의 WebsocketProvider가 제거되었습니다.`);
    }
  }
  await notifyMemberExit(username, roomNumber);
}

module.exports = {wsProviderList, addWsProvider, checkMember, Y, addMember, exit};