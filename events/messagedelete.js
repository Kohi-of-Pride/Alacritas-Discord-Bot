// const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMember, GuildHubType, AuditLogEvent, MessageContent } = require('discord.js');
// const config = require('../config.json');
// const fs = require('fs');
// const path = require('path');

// // Load existing guild settings from the JSON file
// const guildSettingsFile = path.resolve(__dirname, '..', 'guildSettings.json');
// let guildSettings = {};
// try {
//   const data = fs.readFileSync(guildSettingsFile, 'utf8');
//   guildSettings = JSON.parse(data);
// } catch (err) {
//   console.error('Error reading guild settings file:', err.message);
// }

// module.exports = {
//   name: Events.MessageDelete,
//   on: true,
//   execute: async message => {
//     message.guild.fetchAuditLogs({
//       type: AuditLogEvent.MessageDelete,
//     }).then(async audit => {
//       const { executor } = audit.entries.first();

//       const guildID = message.guild.id;
//       const recChannelID = guildSettings[guildID];

//       if (!recChannelID) return; // No logging channel registered for this guild

//       const recChannel = message.guild.channels.cache.get(recChannelID);
//       if (!recChannel || !recChannel.isTextBased()) {
//         return message.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
//       }

//       const messageDeleteEmbed = new EmbedBuilder()
//         .setColor('#FF0000')
//         .setTitle('Message Deleted')
//         .setDescription(`A message was deleted by ${executor}`)
//         .addFields({ name: 'Author', value: `${message.author.tag}`, inline: false })
//         .addFields({ name: 'Content', value: message.content || 'Message content is not available.', inline: false })

//         .setTimestamp()
//         .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

//       recChannel.send({ embeds: [messageDeleteEmbed] });
//     });
//   }
// }
