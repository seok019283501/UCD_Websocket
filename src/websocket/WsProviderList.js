const RoomMemberEntity = require('../entities/RoomMember.js');
const { WebsocketProvider } = require('y-websocket');
const WebSocket = require('ws');
const Y = require('yjs');

let wsProviderList = [];
let yDocList = [];

const addWsProvider = (roomNumber) =>{
  const ydoc = new Y.Doc();
  const WebsocketProviderItem = new WebsocketProvider('ws://localhost:1234', roomNumber, ydoc,{WebSocketPolyfill: WebSocket});
  wsProviderList.push(WebsocketProviderItem);
  yDocList.push(ydoc);
}

const checkMember = (userId,roomNumber) => {
  //TODO mongoDB사용
  const roomMemberList = RoomMemberEntity.find({roomNumber:roomNumber});
  console.log(roomMemberList);
}

module.exports = {wsProviderList, yDocList, addWsProvider, checkMember, Y};