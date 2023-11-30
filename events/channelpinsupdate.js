// const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMember, GuildHubType, AuditLogEvent, Util } = require('discord.js');
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
//   name: Events.ChannelPinsUpdate,
//   on: true,
//   execute: async (channel, time) => {
//     const pinAuditLog = await channel.guild.fetchAuditLogs({
//       type: AuditLogEvent.MessagePin,
//       limit: 1,
//     }).catch(console.error);

//     const unpinAuditLog = await channel.guild.fetchAuditLogs({
//       type: AuditLogEvent.MessageUnpin,
//       limit: 1,
//     }).catch(console.error);

//     const pinEntry = pinAuditLog.entries.first();
//     const unpinEntry = unpinAuditLog.entries.first();

//     let pinAction, executor;
//     if (pinEntry && (!unpinEntry || pinEntry.createdAt > unpinEntry.createdAt)) {
//       pinAction = 'Pinned';
//       executor = pinEntry.executor;
//     } else if (unpinEntry && (!pinEntry || unpinEntry.createdAt > pinEntry.createdAt)) {
//       pinAction = 'Unpinned';
//       executor = unpinEntry.executor;
//     } else {
//       // No relevant pin/unpin entry found
//       return;
//     }

//     const actionColor = pinAction === 'Pinned' ? '#00FF00' : '#FF0000';

//     const guildID = channel.guild.id;
//     const recChannelID = guildSettings[guildID];

//     if (!recChannelID) return; // No logging channel registered for this guild

//     const recChannel = channel.guild.channels.cache.get(recChannelID);
//     if (!recChannel || !recChannel.isTextBased()) {
//       return channel.send('Invalid logging channel. Please provide a valid text channel ID.');
//     }

//     const pinnedMessages = await channel.messages.fetchPinned().catch(console.error);
//     const lastMessage = pinnedMessages.first();
//     if (!lastMessage) return;

//     const pinsUpdateEmbed = new EmbedBuilder()
//       .setColor(actionColor)
//       .setTitle(`Message ${pinAction}`)
//       .setDescription(`A message was ${pinAction.toLowerCase()} by ${executor}`)
//       .addFields({ name: 'Channel', value: `${channel.name} - <#${channel.id}>`, inline: false })
//       .addFields({ name: 'Time', value: new Date(time).toLocaleString(), inline: false })

//     const audit = await channel.guild.fetchAuditLogs({
//         type: pinAction === 'Pinned' ? AuditLogEvent.MessagePin : AuditLogEvent.MessageUnpin,
//         limit: 1,
//       });
      
//       // Get the relevant audit log entry
//       const auditEntry = audit.entries.first();
      
//       if (auditEntry && auditEntry.targetType === 'MESSAGE') {
//         const pinnedMessageID = auditEntry.targetId;
      
//         // Construct the link to the pinned/unpinned message
//         const messageLink = `https://discord.com/channels/${channel.guild.id}/${channel.id}/${pinnedMessageID}`;
      
//         pinsUpdateEmbed.addFields({ name: 'View Pinned Message', value: `[Jump to Message](${messageLink})`, inline: false });
//       }

//       pinsUpdateEmbed.setTimestamp()
//         .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });
      
//       recChannel.send({ embeds: [pinsUpdateEmbed] });
//   }
// }
