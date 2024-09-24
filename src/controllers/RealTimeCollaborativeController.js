const {RealTimeCollaborativeEntity} = require("../entities/RealTimeCollaborativeEntity")

//보드 text 가져오기
exports.boardTextInfo = async(req,res,next) => {
  try{
    const existingDocument = await RealTimeCollaborativeEntity.findOne({ id: req.params.id });
    if (!existingDocument) {
      return res.status(404).send('Document not found');
    }
    res.set('Content-Type', 'application/octet-stream');
    const update = existingDocument.text;
    console.log(existingDocument)
    res.status(200).send(update);
  }catch(e){
    console.log(e);
    res.status(500).send('Document not found');
  }
}
