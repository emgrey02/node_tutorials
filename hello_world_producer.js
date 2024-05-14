//Dependencies
import { AMQPClient } from '@cloudamqp/amqp-client'
import {} from 'dotenv/config'

const LavinMQUrl = process.env.CLOUDAMQP_URL

async function startProducer() {
    try {
        //setup a connection to the LavinMQ server
        const connection = new AMQPClient(LavinMQUrl);
        await connection.connect();

        const channel = await connection.channel();
        console.log("[✅] Connection over channel established");

       await channel.queue("hello_world", {durable: false});

        //publish a message to the exchange
        async function sendToQueue(routingKey, body) {
            //amqp-client function expects: exchange, routingKey, message, options
            await channel.basicPublish("", routingKey, body);
            console.log("[📥] Message sent to queue", body);
        }

        sendToQueue("hello_world", "Hello World");
        sendToQueue("hello_world", "Hello World");
        sendToQueue("hello_world", "Hello World");

        setTimeout(()=> {
            //close the connection
            connection.close();
            console.log("[❎] Connection closed");
            process.exit(0);
        }, 500);

    } catch(error){
        console.error(error);
        //retry after 3 seconds
        setTimeout(()=> {
            startProducer()
        }, 3000);
    }
}

startProducer();