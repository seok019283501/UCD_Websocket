const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  try {
    // 원본 시크릿 키를 직접 사용 (Base64 인코딩 없음)
    const secretKey = process.env.JWT_SECRET;

    // Authorization 헤더에서 토큰 추출
    const token = req.headers.authorization.split(' ')[1];
    
    // HS256 알고리즘을 사용해 토큰 검증
    req.decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
 
    return next();
  } catch (error) {
    console.log(error);
    // 토큰 만료 에러 처리
    if (error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다.'
      });
    }
    // 유효하지 않은 토큰 에러 처리
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다.'
    });
  }
};