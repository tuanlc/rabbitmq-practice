const amqplib = require('amqplib');
const URL = 'amqp://localhost:5672';

const amqpConnection = amqplib.connect(URL);
const queue = 'sample';

amqpConnection
  .then(connection => connection.createChannel())
  .then(channel => {
    let ok = channel.assertQueue(queue, { durable: false });

    ok = ok.then(() => {
      return channel.consume(queue, message => {
        console.log('Received %s', String(message.content));
        channel.ack(message);
      }, { noAck: false });
    });

    return ok.then(() => {
      console.log('Waiting for messages. To exit press CTRL+C');
    });
  })
  .catch(console.warn);
