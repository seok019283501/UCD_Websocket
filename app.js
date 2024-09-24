const express = require('express');
const path = require('path');
const  cors = require('cors');
const websocket = require('./src/websocket/websocket.js');
const db = require('./src/repository/MongoDB.js');
const app = express();
const RealTimeCollaborativeRouter = require('./src/routes/RealTimeCollaborativeRouter.js')
app.use(cors({ 
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization'
}));

// OPTIONS 요청에 대한 프리플라이트 처리
app.options('*', cors({ origin: 'http://localhost:3000' }));

app.use(express.static(path.join(__dirname,'public')));
app.use(express.static(__dirname + '/img'));


app.set('port',process.env.PORT || 8000);

app.use('/realtime',RealTimeCollaborativeRouter);

app.use((req,res,next)=>{
  const err = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  res.status(404).json({
      code:404,
      massage:'Not Found',
  });

  next(err);
});


app.use((err,req,res,next)=>{
  res.locals.message = err.message;
  res.locals.error = process.env.NOSD_ENV !== 'production' ? err:{};
  
})
const server = app.listen(app.get('port'),()=>{
  console.log(app.get('port'),'번 포트에서 대기중');
})
db();

websocket(server);