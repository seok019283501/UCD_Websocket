const { RealTimeCollaborativeEntity } = require("../entities/RealTimeCollaborativeEntity.js");
const { CollaborationMemberEntity } = require('../entities/CollaborationMemberEntity.js');
const { addMember, initWebsocket } = require("../websocket/WsProviderList.js");
const { notifyMemberJoin, notifyMemberExit } = require('../../RabbitMQ.js');

// 보드 text 가져오기
exports.boardTextInfo = async (req, res, next) => {
  try {

    await addMember(req.decoded.sub, req.params.id);

    const existingDocument = await RealTimeCollaborativeEntity.findOne({ id: req.params.id });

    await initWebsocket();


    // 참여 알림 전송
    // notifyMemberJoin(req.decoded.sub, req.params.id);

    res.set('Content-Type', 'application/octet-stream');
    let update = null;
    if(existingDocument !== null){
      update = existingDocument.text;

    }

    res.status(200).send(update);
  } catch (e) {
    console.log(e);
    res.status(500).send('Document not found');
  }
};
