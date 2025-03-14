import { Client, GatewayIntentBits, Collection, Events } from "discord.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
})

// Create a collection for commands
client.commands = new Collection()

// Function to recursively read command files from directories
async function loadCommands(dir) {
  const commandFolders = fs.readdirSync(dir)

  for (const folder of commandFolders) {
    const folderPath = path.join(dir, folder)
    const stats = fs.statSync(folderPath)

    if (stats.isDirectory()) {
      // It's a category folder, recursively load commands
      await loadCommands(folderPath)
    } else if (folder.endsWith(".js")) {
      // It's a command file
      const command = await import(`file://${folderPath}`)

      // Set a new item in the Collection with the key as the command name and the value as the exported module
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
        console.log(`Loaded command: ${command.data.name}`)
      } else {
        console.log(`[WARNING] The command at ${folderPath} is missing a required "data" or "execute" property.`)
      }
    }
  }
}

// Load all commands
const commandsPath = path.join(__dirname, "commands")
await loadCommands(commandsPath)
console.log(`Loaded ${client.commands.size} commands!`)

// When the client is ready, run this code (only once)
client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
  client.user.setActivity("with /help")
})

// Handle interactions (slash commands)
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = interaction.client.commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    await command.execute(interaction)
  } catch (error) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "There was an error while executing this command!", ephemeral: true })
    } else {
      await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true })
    }
  }
})

// Login to Discord with your client's token
client.login(process.env.DISCORD_TOKEN)

