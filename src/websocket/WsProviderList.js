const {CollaborationMemberEntity} = require('../entities/CollaborationMemberEntity.js');
const { WebsocketProvider } = require('y-websocket');
const WebSocket = require('ws');
const {notifyMember} = require('../../RabbitMQ.js');
const { RealTimeCollaborativeTextEntity } = require('../entities/RealTimeCollaborativeTextEntity');
const Y = require('yjs');

let wsProviderList = [];

const initWebsocket = async() => {
  wsProviderList.forEach(({ roomNumber, provider, ydoc }) => {
    console.log(provider.roomname)
    const awareness = provider.awareness;
    provider.on('status', async (event) => {
      console.log(`Connection status: ${event.status}`);
      if (event.status === 'connected') {
        provider.ws.on('message', async (message) => {
          const text = Y.encodeStateAsUpdate(ydoc);
          console.log(text)
          setInterval(() => update(text, roomNumber), 30000);

        });
      }
    }
  );
    awareness.on('change', change => {
      let users = Array.from(awareness.getStates().values())
        .filter(user => Object.keys(user).length > 0) // 빈 객체 제거
        .reduce((uniqueUsers, user) => {
          const username = user.user.username;
          if (!uniqueUsers.has(username)) {
            uniqueUsers.set(username, user);
          }
          return uniqueUsers;
        }, new Map());
        if (users.length === 0) {
          // 해당 wsProviderList 아이템 제거
          wsProviderList.splice(index, 1);
          console.log(`Room ${roomNumber}의 WebsocketProvider가 제거되었습니다.`);
        }
      users = Array.from(users.values()); // Map을 배열로 변환
      notifyMember(users, provider.roomname);
    });
    provider.on('sync', (isSynced) => {
      console.log(`Document is synced: ${isSynced}`);
    });
  });
};

// 문서 내용 저장 함수
const update = async (text, id) => {
  try {
    const existingDocument = await RealTimeCollaborativeTextEntity.findOne({ id: id });
    const buffer = Buffer.from(text);
    if (!existingDocument) {
      await RealTimeCollaborativeTextEntity.create({ id, name: id, text: buffer });
    } else {
      await RealTimeCollaborativeTextEntity.updateOne({ id }, { text: buffer }, { new: true });
    }
  } catch (error) {
    console.error('Error updating document:', error);
  }
};

//wSProvider 추가
const addWsProvider = async(roomNumber) =>{
  
  try{
    const ydoc = new Y.Doc();
    const number = roomNumber;
    const WebsocketProviderItem = await new WebsocketProvider('ws://localhost:1234', number, ydoc,{WebSocketPolyfill: WebSocket});
    wsProviderList.push({ roomNumber: number, provider: WebsocketProviderItem, ydoc });
    initWebsocket()
  }catch(e){
    console.log(e)
  }
  
}



// 웹 소켓 접속 추가
const addMember = async (username, roomNumber) => {
  try{
    if(!wsProviderList.some(item => item.roomNumber === roomNumber)){
      addWsProvider(roomNumber);
    }
  }catch(e){
    console.log(e)
  }
};


module.exports = {initWebsocket,addWsProvider, Y, addMember};