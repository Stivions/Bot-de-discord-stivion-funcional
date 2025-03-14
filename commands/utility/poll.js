import { SlashCommandBuilder, EmbedBuilder } from "discord.js"

export const data = new SlashCommandBuilder()
  .setName("poll")
  .setDescription("Create a simple poll")
  .addStringOption((option) => option.setName("question").setDescription("The poll question").setRequired(true))
  .addStringOption((option) =>
    option.setName("options").setDescription("Poll options separated by commas (e.g. yes,no,maybe)").setRequired(true),
  )

export async function execute(interaction) {
  const question = interaction.options.getString("question")
  const optionsString = interaction.options.getString("options")
  const options = optionsString.split(",").map((option) => option.trim())

  if (options.length < 2) {
    return interaction.reply({
      content: "Please provide at least 2 options separated by commas.",
      ephemeral: true,
    })
  }

  if (options.length > 10) {
    return interaction.reply({
      content: "You can only have up to 10 options in a poll.",
      ephemeral: true,
    })
  }

  const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"]

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("📊 " + question)
    .setDescription(options.map((option, index) => `${emojis[index]} ${option}`).join("\n\n"))
    .setFooter({ text: `Poll created by ${interaction.user.tag}` })
    .setTimestamp()

  const message = await interaction.reply({
    embeds: [embed],
    fetchReply: true,
  })

  // Add reactions for voting
  for (let i = 0; i < options.length; i++) {
    await message.react(emojis[i])
  }
}

