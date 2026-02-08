const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent
  ]
});

// Bot setup
const prefix = "!"; 
const token = "YOUR_BOT_TOKEN_HERE"; // <--- Yahan apna Discord Token daalein

const distube = new DisTube(client, {
  emitNewSongOnly: true,
  plugins: [new YtDlpPlugin()]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  // Play Command
  if (command === "play") {
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.channel.send("Pehle voice channel join karo bhai!");
    
    const query = args.join(" ");
    if (!query) return message.channel.send("Song ka naam ya link toh do!");

    distube.play(voiceChannel, query, {
      message,
      textChannel: message.channel,
      member: message.member
    });
  }

  // Stop Command
  if (command === "stop") {
    distube.stop(message);
    message.channel.send("Music stopped!");
  }

  // Skip Command
  if (command === "skip") {
    distube.skip(message);
    message.channel.send("Skipped!");
  }
});

// Status messages
distube.on("playSong", (queue, song) => {
  queue.textChannel.send(`Playing: **${song.name}** - Requested by ${song.user}`);
});

client.login(token);
