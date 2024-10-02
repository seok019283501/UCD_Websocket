const {RealTimeCollaborativeEntity} = require('../entities/RealTimeCollaborativeEntity')
const {wsProviderList,yDocList,Y} = require('./WsProviderList.js')
// const realTimeCollaborative = require('./db/schemas/realTimeCollaborative.js')
module.exports = (server) => {
  wsProviderList.forEach((wsProvider,index)=>{
    // 연결 상태 로그
  wsProvider.on('status', async(event) => {
    console.log(`Connection status: ${event.status}`);
    if(event.status==='connected'){
      wsProvider.ws.on('message', async(message) => {
        const text = Y.encodeStateAsUpdate(yDocList[index]);
        const id = Number(wsProvider.url.split('/').pop());
        setInterval(()=>update(text,id),9000)
      });
    }
  });
  // Yjs 문서가 동기화될 때 발생하는 이벤트
    wsProvider.on('sync', (isSynced) => {
      console.log(`Document is synced: ${isSynced}`);
    });
  })

};



//문서 내용 저장
const update = async(text,id) =>{

  try {
    if (isNaN(id)) {
      return
    }
    const existingDocument = await RealTimeCollaborativeEntity.findOne({ id: id });
    const buffer = Buffer.from(text);
    if (!existingDocument) {
      console.log('Creating new document');
      await RealTimeCollaborativeEntity.create({ id: id, name: id, text: buffer });
    } else {
      // console.log('Updating existing document');
      const result = await RealTimeCollaborativeEntity.updateOne({id:id},{text:buffer},{ new: true })
      // console.log(result)
    }
  } catch (error) {
    console.error('Error updating document:', error);
  }
  
}