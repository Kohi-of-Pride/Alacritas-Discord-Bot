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
  name: Events.GuildUpdate,
  on: true,
  execute: async (oldGuild, newGuild) => {
    newGuild.fetchAuditLogs({
      type: AuditLogEvent.GuildUpdate,
    }).then(async audit => {

      const { executor } = audit.entries.first();

      const guildID = newGuild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = newGuild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return newGuild.systemChannel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const guildUpdateEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('Guild Updated')
        .setDescription(`Guild updated by ${executor}`);

      // Name Update
      if (oldGuild.name !== newGuild.name) {
        guildUpdateEmbed.addFields({ name: 'Old Name', value: `${oldGuild.name}`, inline: false })
          .addFields({ name: 'New Name', value: `${newGuild.name}`, inline: false })
          .setTitle('Guild Name Changed');
      }

      // Icon Update
      if (oldGuild.icon !== newGuild.icon) {
        guildUpdateEmbed.setTitle('Guild Icon Changed')
        const oldIconURL = oldGuild.iconURL();
        const newIconURL = newGuild.iconURL().toString();
        guildUpdateEmbed.setThumbnail(oldIconURL)
          .addFields({ name: 'New Icon:', value: '\u200b', inline: true})
          .setImage(newIconURL);
      }

      guildUpdateEmbed.setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [guildUpdateEmbed] });
    });
  }
};
