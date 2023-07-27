import { Command } from 'commander'

const command = new Command()

command
  .option('-p <port>', 'Server port', 8080)
  .option('-mode <mode>', 'Workspace environment', 'development')
  .option('-persistence <persistence>', 'Type of persistence', 'mongodb')
command.parse()

export default command
