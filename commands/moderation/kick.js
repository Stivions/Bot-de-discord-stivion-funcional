import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("kick")
  .setDescription("Kick a user from the server")
  .addUserOption((option) => option.setName("target").setDescription("The user to kick").setRequired(true))
  .addStringOption((option) => option.setName("reason").setDescription("The reason for kicking"))
  .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)

export async function execute(interaction) {
  const target = interaction.options.getUser("target")
  const reason = interaction.options.getString("reason") ?? "No reason provided"

  try {
    await interaction.guild.members.kick(target, reason)
    await interaction.reply({
      content: `Successfully kicked ${target.tag} for reason: ${reason}`,
      ephemeral: true,
    })
  } catch (error) {
    console.error(error)
    await interaction.reply({
      content: `Failed to kick ${target.tag}. Make sure I have the right permissions and the user is kickable.`,
      ephemeral: true,
    })
  }
}

