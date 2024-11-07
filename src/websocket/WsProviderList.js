const {CollaborationMemberEntity} = require('../entities/CollaborationMemberEntity.js');
const { WebsocketProvider } = require('y-websocket');
const WebSocket = require('ws');
const {notifyMemberJoin,notifyMemberExit} = require('../../RabbitMQ.js');
const { RealTimeCollaborativeEntity } = require('../entities/RealTimeCollaborativeEntity');
const Y = require('yjs');

let wsProviderList = [];

const initWebsocket = async() => {
  console.log(wsProviderList)
  wsProviderList.forEach(({ roomNumber, provider, ydoc }) => {
    console.log(roomNumber)
    provider.on('status', async (event) => {
      console.log(`Connection status: ${event.status}`);
      if (event.status === 'connected') {
        provider.ws.on('message', async (message) => {
          const text = Y.encodeStateAsUpdate(ydoc);
          console.log(`roonumber : ${roomNumber}`)
          console.log(text);
          setInterval(() => update(text, Number(roomNumber)), 9000);
        });
      }
    });

    provider.on('sync', (isSynced) => {
      console.log(`Document is synced: ${isSynced}`);
    });
  });
};

// 문서 내용 저장 함수
const update = async (text, id) => {
  try {
    if (isNaN(id)) {
      return;
    }
    const existingDocument = await RealTimeCollaborativeEntity.findOne({ id: id });
    const buffer = Buffer.from(text);
    if (!existingDocument) {
      await RealTimeCollaborativeEntity.create({ id, name: id, text: buffer });
    } else {
      await RealTimeCollaborativeEntity.updateOne({ id }, { text: buffer }, { new: true });
    }
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

//wSProvider 추가
const addWsProvider = async(roomNumber) =>{
  const ydoc = new Y.Doc();
  const number = Number(roomNumber);
  const WebsocketProviderItem = await new WebsocketProvider('ws://localhost:1234', number, ydoc,{WebSocketPolyfill: WebSocket});
  wsProviderList.push({ roomNumber: number, provider: WebsocketProviderItem, ydoc });
  initWebsocket()
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
  await CollaborationMemberEntity.deleteOne({ username: username });
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

module.exports = {initWebsocket,addWsProvider, checkMember, Y, addMember, exit};