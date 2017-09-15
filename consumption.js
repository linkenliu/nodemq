/**
 * 消费方(接收消息方)
 **/

const http = require('http'),
    url = require('url'),
    express = require('express'),
    app = express(),
    amqp = require('amqp');


/**
 * 连接mq服务   账户／密码／主机／端口
 */
var rabbitMQ = amqp.createConnection({url: 'amqp://guest:guest@localhost:5672'});

rabbitMQ.addListener('ready', function () {
    rabbitMQ.exchange('rabbitExchange1', {'type': 'fanout'});
    var queue = rabbitMQ.queue('', {'exclusive': true}, function (q) {
        //get all messages for the rabbitExchange
        q.bind('rabbitExchange1', '#');
        console.log("Consumption Server Start Success ");
        // Receive messages
        q.subscribe(function (message,headers, deliveryInfo, messageObject) {
            // Print messages to stdout
            console.log("received message2");
            console.log('接收的消息内容为：' + message.data.toString());
            console.log(headers)
            console.log(deliveryInfo)
            console.log(messageObject)
        });
    });
});

rabbitMQ.on('error', function (e) {
    console.log("Error from amqp: ", e);
});

