import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("avatar")
  .setDescription("Get the avatar URL of the selected user, or your own avatar.")
  .addUserOption((option) => option.setName("target").setDescription("The user's avatar to show"))

export async function execute(interaction) {
  const user = interaction.options.getUser("target") || interaction.user

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(`${user.username}'s Avatar`)
    .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
    .setTimestamp()

  await interaction.reply({ embeds: [embed] })
}

