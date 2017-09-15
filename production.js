/**
 * 生产方(发送消息方)
 **/
const http = require('http'),
    url = require('url'),
    fs = require('fs'),
    express = require('express'),
    app = express(),
    amqp = require('amqp');


var exchange;


/**
 * 创建服务
 */
const server = http.createServer(app);


/**
 * 渲染到消息页面
 */
app.get('/', function (req, res) {
    res.render('index.ejs')
});


/**
 * 发送消息
 */
app.get('/sendMessage', function (req, res) {
    let messgae = req.query.messgae;
    sendMsg(messgae);
});


/**
 * 发送消息
 * @param msg
 */
function sendMsg(msg) {
    console.log('发送消息内容为：' + msg);
    if (exchange) {
        if (msg) {
            exchange.publish('key.a', msg)
        } else {
            let message = fs.readFileSync('msg.txt').toString('utf-8');
            for(let i=0;i<10;i++){
                exchange.publish('key.a', i+"");
            }
        }
    }
    else {
        console.log("exchange not around now...")
    }
}

/**
 * 连接mq服务   账户／密码／主机／端口
 */
var rabbitMQ = amqp.createConnection({url: 'amqp://guest:guest@localhost:5672'});

rabbitMQ.addListener('ready', function () {
    //创建交换机   type为fanout模式
    exchange = rabbitMQ.exchange('rabbitExchange1', {'type': 'fanout'})
});

server.listen(8081);

console.log("Production Server Start Success \n At : http://localhost:" + server.address().port);
