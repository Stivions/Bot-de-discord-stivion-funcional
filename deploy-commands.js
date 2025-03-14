import { REST, Routes } from "discord.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"
import dotenv from "dotenv"

// Load environment variables from .env file
dotenv.config()

// Get the directory name
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const token = process.env.DISCORD_TOKEN
const clientId = process.env.CLIENT_ID

const commands = []

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

      if ("data" in command) {
        commands.push(command.data.toJSON())
        console.log(`Added command: ${command.data.name}`)
      } else {
        console.log(`[WARNING] The command at ${folderPath} is missing a required "data" property.`)
      }
    }
  }
}

// Load all commands
const commandsPath = path.join(__dirname, "commands")
await loadCommands(commandsPath)
console.log(`Loaded ${commands.length} commands!`)

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token)

// Deploy commands
;(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`)

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), { body: commands })

    console.log(`Successfully reloaded ${data.length} application (/) commands.`)
  } catch (error) {
    console.error(error)
  }
})()

