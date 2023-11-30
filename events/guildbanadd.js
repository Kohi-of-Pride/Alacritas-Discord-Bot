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
  name: Events.GuildBanRemove,
  on: true,
  execute: async ban => {
    ban.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildBanAdd,
    }).then(async audit => {

      const { executor } = audit.entries.first()


      const account = ban.user;
      const reason = ban.reason;
      if (!reason) { reason = 'No reason was stated.' }

      const guildID = ban.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = ban.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return ban.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      const banEmbed = new EmbedBuilder()
        .setColor('#b00b1e')
        .setTitle('User banned')
        .setDescription(`User Banned by ${executor}`)
        .addFields({ name: 'User', value: `${account}`, inline: false })
        .addFields({ name: 'Reason:', value: `${reason}`, inline: false })

        .setTimestamp()
        .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

      recChannel.send({ embeds: [banEmbed] });
    })
  }
}

