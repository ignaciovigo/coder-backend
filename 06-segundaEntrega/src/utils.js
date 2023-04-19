import { fileURLToPath } from 'url'
import { dirname } from 'path'

const fileName = fileURLToPath(import.meta.url)
const __dirname = dirname(fileName)

export default __dirname
