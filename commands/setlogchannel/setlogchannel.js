const { Client, Events, GatewayIntentBits, Guilds, EmbedBuilder, MessageManager, Embed, Collection, GuildMember, GuildHubType, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');


// Load existing guild settings from the JSON file
const guildSettingsFile = path.resolve(__dirname, '..', '..', 'guildSettings.json');
let guildSettings = {};
try {
  const data = fs.readFileSync(guildSettingsFile, 'utf8');
  guildSettings = JSON.parse(data);
} catch (err) {
  console.error('Error reading guild settings file:', err.message);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlogchannel')
    .setDescription('Assigns a logging channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to echo log into')
        .setRequired(true)),
  execute: async (interaction) => {
    if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.reply("Dear user, I regret to inform you that you are missing the required permission: `ADMINISTRATOR` to use this command. Please try again when you're noteworthy.");
    }

    const guildID = interaction.guild.id;
    const recChannelID = interaction.options.getChannel('channel').id;

    const recChannel = interaction.guild.channels.cache.get(recChannelID);
    if (!recChannel || !recChannel.isTextBased() || recChannel.isVoiceBased()) {
      return interaction.reply("It looks like you've chosen an invalid channel. Don't forget: The logging channel has to be a text channel.");
    }

    // Save the logging channel ID for this guild in the guildSettings object
    guildSettings[guildID] = recChannelID;

    // Save the updated guild settings to the JSON file
    fs.writeFile(guildSettingsFile, JSON.stringify(guildSettings, null, 2), (err) => {
      if (err) {
        console.error('Error writing guild settings file:', err.message);
        return interaction.reply('Regrettably, something wrong happened; Please try again later. If the problem persists, contact my creator, Coffee KQ.');
      }

      return interaction.reply(`Achacha! I got it. I'll log in <#${recChannelID}> for this server.`);
    });
  },
};