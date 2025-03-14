import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export const data = new SlashCommandBuilder().setName("user").setDescription("Provides information about the user.")

export async function execute(interaction) {
  const member = interaction.member

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${member.user.username}'s Info`)
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields(
      { name: "User ID", value: member.user.id },
      { name: "Joined Server", value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>` },
      { name: "Account Created", value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>` },
      { name: "Roles", value: member.roles.cache.map((role) => role.toString()).join(", ") },
    )
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

