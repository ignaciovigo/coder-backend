export const createProductErrorInfo = ({ title = null, description = null, price = null, thumbnails = null, code = null, stock = null, status, category = null }) => {
  if (!title) return `title: must be a string, received: "${title}"`
  if (!description) return `description: must be a string, received: "${description}"`
  if (!price) return `price: must be a number, received: "${price}"`
  if (!thumbnails || !Array.isArray(thumbnails)) return `thumbnails: must be an array, received: "${thumbnails}"`
  if (!code) return `code: must be a string, received: "${code}"`
  if (typeof status !== 'boolean') return `status: must be a boolean, received: "${status}"`
  if (!stock) return `stock: must be a number, received: "${stock}"`
  if (!category) return `category: must be a string, received: "${category}"`
}
