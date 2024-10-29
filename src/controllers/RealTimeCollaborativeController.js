const { RealTimeCollaborativeEntity } = require("../entities/RealTimeCollaborativeEntity.js");
const { CollaborationMemberEntity } = require('../entities/CollaborationMemberEntity.js');
const { addMember, exit } = require("../websocket/WsProviderList.js");
const { notifyMemberJoin, notifyMemberExit } = require('../../RabbitMQ.js');

// 보드 text 가져오기
exports.boardTextInfo = async (req, res, next) => {
  try {
    const existingDocument = await RealTimeCollaborativeEntity.findOne({ id: req.params.id });
    await addMember(req.decoded.sub, req.params.id);

    // 참여 알림 전송
    notifyMemberJoin(req.decoded.sub, req.params.id);

    res.set('Content-Type', 'application/octet-stream');
    const update = existingDocument.text;

    res.status(200).send(update);
  } catch (e) {
    console.log(e);
    res.status(500).send('Document not found');
  }
};

// 종료
exports.exitRoom = async (req, res, next) => {
  try {
    await exit(req.decoded.sub, req.params.id);

    // 종료 알림 전송
    notifyMemberExit(req.decoded.sub, req.params.id);

    res.status(200).send("success");
  } catch (e) {
    console.log(e);
    res.status(500).send('Document not found');
  }
};