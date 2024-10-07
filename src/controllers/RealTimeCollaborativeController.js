const {RealTimeCollaborativeEntity} = require("../entities/RealTimeCollaborativeEntity.js")
const {addMember,exit} = require("../websocket/WsProviderList.js");

//보드 text 가져오기
exports.boardTextInfo = async(req,res,next) => {
  try{
    console.log(req.decoded)
    const existingDocument = await RealTimeCollaborativeEntity.findOne({ id: req.params.id });
    if (!existingDocument) {
      return res.status(404).send('Document not found');
    }
    await addMember(req.decoded.sub,req.params.id);

    res.set('Content-Type', 'application/octet-stream');
    const update = existingDocument.text;
    res.status(200).send(update);
  }catch(e){
    console.log(e);
    res.status(500).send('Document not found');
  }
}

//종료
exports.exitRoom = async(req,res,next) =>{
  try{
    await exit(req.decoded.sub,req.params.id);
    res.status(200).send("success");
  }catch(e){
    console.log(e);
    res.status(500).send('Document not found');
  }
}
