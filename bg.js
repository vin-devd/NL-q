const {Client, VoiceChannel, ActivityType} = require('discord.js')
const {channelId, token, intents} = require('./secrets.json')
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const path = require('path')
const fs = require('fs');
const { print } = require('printlogg');
let bot = new Client({
    intents: intents,
})

let curindex = 0;
const audioplayer = new createAudioPlayer()
const files = [
    '001.mp3', '002.mp3', '003.mp3', '004.mp3', '005.mp3', '006.mp3', '007.mp3', '008.mp3'
].map(file => path.join(__dirname, file))
bot.login(token)

function playnext(connection){
    const res = createAudioResource(files[curindex])
    audioplayer.play(res)

    audioplayer.once(AudioPlayerStatus.Idle, () => {
        curindex = (curindex + 1) % files.length;
        playnext(connection)
    })

    connection.subscribe(audioplayer);
}

async function joinplay() {
    const channel = await bot.channels.fetch(channelId)
    if(channel instanceof VoiceChannel){
     const connection = new joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
     })
     playnext(connection)

    }
}

bot.on('ready', async() => {
    joinplay()
    setInterval(async () => {
        const channel = await client.channels.fetch(channelId);
        if (!channel.members.has(bot.user.id)) {
            joinplay()
            }
    }, 180000);
    bot.user.setPresence({activities: [{name: 'NewLife Quran', type: ActivityType.Listening}], status: 'dnd'})
    print('done')
    bot.user.setUsername('NL Quran')
})