import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export const data = new SlashCommandBuilder().setName("server").setDescription("Provides information about the server.")

export async function execute(interaction) {
  const { guild } = interaction

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${guild.name} Server Info`)
    .setThumbnail(guild.iconURL({ dynamic: true }))
    .addFields(
      { name: "Server ID", value: guild.id },
      { name: "Created On", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>` },
      { name: "Owner", value: `<@${guild.ownerId}>` },
      { name: "Members", value: `${guild.memberCount}` },
      { name: "Roles", value: `${guild.roles.cache.size}` },
      { name: "Channels", value: `${guild.channels.cache.size}` },
      { name: "Emojis", value: `${guild.emojis.cache.size}` },
    )
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

