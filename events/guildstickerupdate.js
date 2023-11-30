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
  name: Events.GuildStickerUpdate,
  on: true,
  execute: async (oldSticker, newSticker) => {
    newSticker.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildStickerUpdate,
    }).then(async audit => {

      const { executor } = audit.entries.first()

      const oldStickerName = oldSticker.name;
      const oldStickerID = oldSticker.id;
      const newStickerName = newSticker.name;
      const newStickerID = newSticker.id;
      const newStickerURL = newSticker.url;

      const guildID = newSticker.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = newSticker.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return newSticker.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const stickerUpdateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Sticker Updated')
        .setDescription(`Sticker updated by ${executor}`)
        .addFields({ name: 'Old Sticker Name', value: `${oldStickerName} - <:${oldStickerName}:${oldStickerID}>`, inline: false })
        .addFields({ name: 'New Sticker Name', value: `${newStickerName} - <:${newStickerName}:${newStickerID}>`, inline: false })
        .addFields({ name: 'Sticker URL', value: `${newStickerURL}`, inline: false })
        .setThumbnail(newStickerURL) // Set the new sticker URL as the thumbnail image

        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [stickerUpdateEmbed] });
    })
  }
};
