const Discord = require('discord.io');
const auth = require('./auth.json');
const axios = require('axios');
const logger = require('winston');
const API = "https://api.icndb.com/jokes/random";

// Chuck Norris Api client
const chuckClient = axios.create({
    baseURL: API,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Set logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Set Discord Client settings
const bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', () => {
    logger.info("Connected");
    logger.info(`Logged in as ${bot.username}`);
    bot.servers
});

// Handle new messages
bot.on('message', async (user, userId, channelId, message, evt) => {
    // Handle messages that start with chuck
    if(message.substring(0, 6) === '!chuck') {
        bot.sendMessage({
            to: channelId,
            message: await fact()
        });
    }
});

const fact = async () => {
    let fact;
    try {
        const response = (await chuckClient.get('/')).data;
        fact = (response.value.joke).replace(/&quot;/g,'"');
    } catch(error) {
        logger.log("Error retrieving facts. Chuck Norris has brought down the internet!")
        fact = "Error retrieving facts. Chuck Norris has brought down the internet!";
    }
    return fact;   
}