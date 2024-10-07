const jwt = require('jsonwebtoken');
exports.verifyToken = (req, res, next) => {
  // 인증 완료
  try {
    const base64Key = Buffer.from(process.env.JWT_SECRET, 'base64'); 
    req.decoded = jwt.verify(req.headers.authorization.split(' ')[1], base64Key,{ algorithms: ['HS256'] })
 
    return next();
  }
  
  // 인증 실패 
  catch(error) {
    console.log(error)
    if (error.name === 'TokenExpireError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });
    }
   return res.status(401).json({
     code: 401,
     message: '유효하지 않은 토큰입니다.'
   });
  }
}