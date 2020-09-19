const amqplib = require('amqplib');
const URL = 'amqp://localhost:5672';

const amqpConnection = amqplib.connect(URL);
const queue = 'sample';
const message = 'Sample send & receive!';
let conn;

amqpConnection
  .then(connection => {
    conn = connection;

    return connection.createChannel();
  })
  .then(channel => {
    let ok = channel.assertQueue(queue, { durable: false });

    return ok.then(() => {
      for (let i = 0; i < 1; i++) {
        channel.sendToQueue(queue, Buffer.from(`${message}: ${i}`));
        console.log("Sent '%s'", message);
      };
      return channel.close();
    });
  })
  .catch(console.warn)
  .finally(function() { conn.close(); });
