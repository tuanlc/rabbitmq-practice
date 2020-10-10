const amqplib = require('amqplib');
const URL = 'amqp://localhost:5672';

const amqpConnection = amqplib.connect(URL);
const exchange = 'topic_logs';
let conn;

amqpConnection
  .then(connection => {
    conn = connection;

    return connection.createChannel();
  })
  .then(channel => {
    const args = process.argv.slice(2);
    const key = args.length > 0 && args[0] || 'anonymous.info';
    const message = args.slice(1).join() || 'Hello World!';

    channel.assertExchange(exchange, 'topic', { durable: false });

    channel.publish(exchange, key, Buffer.from(message));
    console.log(" [x] Sent %s:'%s'", key, message);
  })
  .catch(console.warn)
  .finally(function() { 
    setTimeout(function() { 
      conn.close(); 
      process.exit(0) 
    }, 500);
   });
