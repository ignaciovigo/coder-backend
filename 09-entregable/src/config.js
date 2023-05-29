import dotenv from 'dotenv'
import { Command } from 'commander'

const command = new Command()

command
  .option('-p <port>', 'Server port', 8080)
  .option('-mode <mode>', 'Workspace environment', 'development')
command.parse()

dotenv.config({
  path: command.opts().Mode === 'production' ? './.env.production' : './.env.development'
})
