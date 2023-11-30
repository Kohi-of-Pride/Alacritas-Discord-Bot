const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMembers, GuildHubType, AuditLogEvent, MessageContent } = require('discord.js');
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
  name: Events.GuildMemberUpdate,
  on: true,
  execute: async (oldMember, newMember) => {
    oldMember.guild.fetchAuditLogs({
      type: AuditLogEvent.GuildMemberUpdate,
    }).then(async audit => {

      const { executor } = audit.entries.first()

      const name = oldMember.user;

      const guildID = oldMember.guild.id;
      const recChannelID = guildSettings[guildID];

      if (!recChannelID) return; // No logging channel registered for this guild

      const recChannel = oldMember.guild.channels.cache.get(recChannelID);
      if (!recChannel || !recChannel.isTextBased()) {
        return oldMember.channel.send('Invalid logging channel. Please provide a valid text channel ID.');
      }

      //ROLE REMOVED
      if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const roleRemoveEmbed = new EmbedBuilder()
          .setColor('#b00b1e')
          .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL()}` })
          .addFields({ name: 'Affected User', value: `${name}`, inline: false })


          .setTimestamp()
          .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

        oldMember.roles.cache.forEach(role => {
          if (!newMember.roles.cache.has(role.id)) {
            roleRemoveEmbed.setTitle('Role Removed')
            roleRemoveEmbed.setDescription(`Role Removed by ${executor}`)
            roleRemoveEmbed.addFields({ name: "Removed Role:", value: `${role}`, inline: false });
          }
        });
        recChannel.send({ embeds: [roleRemoveEmbed] });
        //ROLE ADDED
      } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const roleAddEmbed = new EmbedBuilder()
          .setColor('#b00b1e')
          .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL()}` })
          .addFields({ name: 'Affected User', value: `${name}`, inline: false })


          .setTimestamp()
          .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

        newMember.roles.cache.forEach(role => {
          if (!oldMember.roles.cache.has(role.id)) {
            roleAddEmbed.setTitle('Role Added')
            roleAddEmbed.setDescription(`Role Added by ${executor}`)
            roleAddEmbed.addFields({ name: "Added Role:", value: `${role}`, inline: false });
          }
        });
        recChannel.send({ embeds: [roleAddEmbed] })
      }
           
      // NICKNAME CHANGE
      if (oldMember.user.username !== newMember.user.username) {
        const nicknameEmbed = new EmbedBuilder()
          .setColor('#b00b1e')
          .setAuthor({ name: `${newMember.user.tag}`, iconURL: `${newMember.user.avatarURL()}` })
          .addFields({ name: 'Affected User', value: `${newMember}`, inline: false })
          .addFields({ name: 'Nickname Change', value: `Nickname changed by ${executor}`, inline: false })
          .addFields({ name: 'Old Nickname', value: `${oldMember.user.username || 'None'}`, inline: false })
          .addFields({ name: 'New Nickname', value: `${newMember.user.username || 'None'}`, inline: false })
          .setTimestamp()
          .setFooter({ text: 'Courtesy of Alacritas', iconURL: 'https://file.coffee/u/L8g-XrVmTvbOI_XwAnWt6.png' });

        recChannel.send({ embeds: [nicknameEmbed] });
      }
    })
  }
}