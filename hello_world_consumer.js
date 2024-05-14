//Dependencies
import { AMQPClient } from '@cloudamqp/amqp-client'
import {} from 'dotenv/config'

const LavinMQUrl = process.env.CLOUDAMQP_URL

async function startConsumer() {
    try {
        //setup a connection to the LavinMQ server
        const connection = new AMQPClient(LavinMQUrl);
        await connection.connect();

        const channel = await connection.channel();
        console.log("[✅] Connection over channel established");
        console.log("[❎] Waiting for messages. To exit press CTRL+C ")

        const q = await channel.queue('hello_world', {durable: false});

        let counter = 0;

        await q.subscribe({noAck: true}, async (msg) => {
            try {
                console.log(`[📤] Message received (${++counter})`, msg.bodyToString())
            } catch(error) {
                console.error(error);
            }
        })

        process.on('SIGINT', ()=> {
            channel.close();
            connection.close();
            console.log("[❎] Connection closed")
            process.exit(0);
        });

    } catch(error){
        console.error(error);
    }
}

startConsumer();