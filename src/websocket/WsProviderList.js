const {CollaborationMemberEntity} = require('../entities/CollaborationMemberEntity.js');
const { WebsocketProvider } = require('y-websocket');
const WebSocket = require('ws');
const Y = require('yjs');

let wsProviderList = [];

//wSProvider 추가
const addWsProvider = (roomNumber) =>{
  const ydoc = new Y.Doc();
  const WebsocketProviderItem = new WebsocketProvider('ws://localhost:1234', roomNumber, ydoc,{WebSocketPolyfill: WebSocket});
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
const addMember = async (username,roomNumber) => {
  const roomMemberList = checkMember(roomNumber);
  if(roomMemberList.length === 0){
    addWsProvider(roomNumber);
  }
  const user = await CollaborationMemberEntity.findOne({name: username, roomNumber: roomNumber});

  if(user === null){
    console.log(roomNumber)
    await CollaborationMemberEntity.create({ username: username, roomNumber: roomNumber });
  }

}

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
}

module.exports = {wsProviderList, addWsProvider, checkMember, Y, addMember, exit};