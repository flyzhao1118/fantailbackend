// 先安装依赖
// cnpm install express --save
// cnpm install body-parser --save
// cnpm install cookie-parser --save
// cnpm install multer --save
// cnpm install mysql

var express = require('express');
var app = express();
var fs = require("fs"); //引入文件读写模块
var mysql = require('mysql');
var bodyParser = require('body-parser');

app.use('/image', express.static('image')); //设置图片目录，浏览器可根据图片url获得服务器上的图片

//连接数据库
var connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '123456',
  database: 'fantail'
});

connection.connect();

// 创建 application/x-www-form-urlencoded 编码解析(post方法)
var urlencodedParser = bodyParser.urlencoded({ extended: false })

//解决跨域
app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

//get请求
app.get('/dishList', function (req, res) {
  const addSql = 'SELECT * FROM cookbook';

  connection.query(addSql, function (err, result) {
    if(err) {
      console.log(err.message);
      return;
    }
    const params = {
      code: 200,
      message: "成功",
      data: result
    }    
    res.send(params)
  });
});

//post请求
app.post('/post',urlencodedParser, function (req, res) {
  const amount = req.body.amount;
  const sql = `SELECT * FROM payment WHERE amount >= '${amount}' LIMIT 10`;
  connection.query(sql, function (err, result) {
    if(err) {
      console.log(err.message);
      return;
    }
    let msg = "";
    if (result.length > 0) {
      msg = "查询成功"
    }
    else {
      msg = "无此记录"
    }
    const params = {
      code: 200,
      msg: msg,
      total: result.length,
      data: result
    }
    res.send(params)
  })
})

//读取文件
app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "user.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
})

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;
  console.log('http://', host, port);

})