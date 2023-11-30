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
  name: Events.GuildStickerCreate,
  on: true,
  execute: async (sticker) => {
    sticker.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildStickerCreate,
    }).then(async audit => {

      const { executor } = audit.entries.first()

      const stickerName = sticker.name;
      const stickerID = sticker.id;
      const stickerURL = sticker.url;
      const createdat = sticker.createdTimestamp;

      const guildID = sticker.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = sticker.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return sticker.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const stickerCreateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Sticker Created')
        .setDescription(`Sticker created by ${executor}`)
        .addFields({ name: 'Sticker Name', value: `${stickerName} - <:${stickerName}:${stickerID}>`, inline: false })
        .addFields({ name: 'Sticker URL', value: `${stickerURL}`, inline: false })
        .addFields({ name: 'Creation Time', value: `${new Date(createdat).toUTCString()}`, inline: false })
        .setThumbnail(stickerURL) // Set the sticker URL as the thumbnail image

        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [stickerCreateEmbed] });
    })
  }
};
