const amqplib = require('amqplib');
const URL = 'amqp://localhost:5672';

const amqpConnection = amqplib.connect(URL);
const exchange = 'topic_logs';

amqpConnection
  .then(connection => connection.createChannel())
  .then(channel => {
    channel.assertExchange(exchange, 'topic', { durable: false });

    let ok = channel.assertQueue('', { exclusive: true });
    const args = process.argv.slice(2);

    if (args.length == 0) {
      console.log("Usage: receive_logs_topic.js <facility>.<severity>");
      process.exit(1);
    }

    ok = ok.then(queue => {
      args.forEach(function(key) {
        channel.bindQueue(queue.queue, exchange, key);
      });

      return channel.consume(queue.queue, message => {
        console.log(" [x] %s:'%s'", message.fields.routingKey, message.content.toString());
      }, { noAck: true });
    });

    return ok.then(() => {
      console.log('Waiting for messages. To exit press CTRL+C');
    });
  })
  .catch(console.warn);
