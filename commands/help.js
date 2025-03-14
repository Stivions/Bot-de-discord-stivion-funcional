import { SlashCommandBuilder, EmbedBuilder } from "discord.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const data = new SlashCommandBuilder()
  .setName("help")
  .setDescription("Shows all available commands")
  .addStringOption((option) =>
    option.setName("category").setDescription("The category of commands to show").setRequired(false),
  )

export async function execute(interaction) {
  const category = interaction.options.getString("category")
  const commands = Array.from(interaction.client.commands.values())

  // Get all categories
  const commandsDir = path.join(__dirname, "..")
  const categories = fs
    .readdirSync(commandsDir)
    .filter((file) => fs.statSync(path.join(commandsDir, file)).isDirectory())

  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setThumbnail(interaction.client.user.displayAvatarURL())
    .setTimestamp()
    .setFooter({ text: "Stivion Bot", iconURL: interaction.client.user.displayAvatarURL() })

  if (category) {
    // Show commands for a specific category
    if (!categories.includes(category)) {
      return interaction.reply({
        content: `Invalid category. Available categories: ${categories.join(", ")}`,
        ephemeral: true,
      })
    }

    const categoryCommands = commands.filter((cmd) => {
      const cmdPath = cmd.data.name === "help" ? __filename : interaction.client.commands.get(cmd.data.name).filePath
      return cmdPath.includes(`/${category}/`)
    })

    embed
      .setTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Commands`)
      .setDescription(`Here are all the commands in the ${category} category:`)

    categoryCommands.forEach((command) => {
      embed.addFields({ name: `/${command.data.name}`, value: command.data.description })
    })
  } else {
    // Show all categories
    embed.setTitle("Stivion Bot Commands").setDescription("Here are all the command categories:")

    categories.forEach((cat) => {
      const categoryCommands = commands.filter((cmd) => {
        const cmdPath = cmd.data.name === "help" ? __filename : interaction.client.commands.get(cmd.data.name).filePath
        return cmdPath.includes(`/${cat}/`)
      })

      if (categoryCommands.length > 0) {
        embed.addFields({
          name: cat.charAt(0).toUpperCase() + cat.slice(1),
          value: `${categoryCommands.length} commands. Use \`/help ${cat}\` to see them.`,
        })
      }
    })

    // Add root commands
    const rootCommands = commands.filter((cmd) => {
      const cmdPath = cmd.data.name === "help" ? __filename : interaction.client.commands.get(cmd.data.name).filePath
      return !categories.some((cat) => cmdPath.includes(`/${cat}/`))
    })

    if (rootCommands.length > 0) {
      embed.addFields({
        name: "General",
        value: rootCommands.map((cmd) => `\`/${cmd.data.name}\``).join(", "),
      })
    }
  }

  await interaction.reply({ embeds: [embed] })
}

