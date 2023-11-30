const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMember, GuildHubType, AuditLogEvent } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');

// Load existing guild settings from the JSON file
const guildSettingsFile = path.resolve(__dirname, '..', 'guildSettings.json');
let guildSettings = {};
try {
  const data = fs.readFileSync(guildSettingsFile, 'utf8');
  guildSettings = JSON.parse(data);
} catch (err) {
  console.error('Error reading guild settings file:', err.message);
}

module.exports = {
  name: Events.GuildEmojiUpdate,
  on: true,
  execute: async (oldEmoji, newEmoji) => {
    oldEmoji.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildEmojiUpdate,
    }).then(async audit => {

      const { executor } = audit.entries.first()

      const guildID = oldEmoji.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = oldEmoji.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return oldEmoji.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const oldEmojiName = oldEmoji.name;
      const newEmojiName = newEmoji.name;
      const emojiID = newEmoji.id;
      const emojiURL = newEmoji.url;
      const emojiAnimated = newEmoji.animated;
      const emojiCreatedAt = newEmoji.createdAt;

      const emojiUpdateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Emoji Updated')
        .setDescription(`Emoji updated by ${executor}`)
        .setThumbnail(emojiURL)
        .addFields({ name: 'Old Emoji Name', value: `${oldEmojiName} - <:${oldEmojiName}:${emojiID}>`, inline: false })
        .addFields({ name: 'New Emoji Name', value: `${newEmojiName} - <:${newEmojiName}:${emojiID}>`, inline: false })
        .addFields({ name: 'Emoji URL', value: `${emojiURL}`, inline: false })
        .addFields({ name: 'Animated:', value: `${emojiAnimated}`, inline: false })
        .addFields({ name: 'Creation Time', value: `${emojiCreatedAt}`, inline: false })
        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [emojiUpdateEmbed] });
    });
  }
};
