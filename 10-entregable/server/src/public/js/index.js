const socket = io()
const d = document
const $productList = d.getElementById('ls-products')
const $templateCard = d.getElementById('template').content
const $fragmentProducts = d.createDocumentFragment()
const $formAddProducts = d.getElementById('formAddProduct')
const $btnAdd = d.getElementById('btn-Add')
const $btnDel = d.getElementById('btn-Delete')
const $msg = d.createElement('p')
const $formDeleteProduct = d.getElementById('formDeleteProduct')

function refreshForm ({ form, textElement, resp, btn }) {
  textElement.textContent = resp.message
  if (resp.status === 'error') {
    textElement.classList.add('text-red-500')
  } else {
    textElement.classList.add('text-green-500')
    socket.emit('getProducts')
    form.reset()
  }
  form.appendChild(textElement)
  setTimeout(() => {
    form.removeChild(textElement)
    textElement.className = ''
    textElement.textContent = ''
    btn.disabled = false
  }, 5000)
}

socket.emit('getProducts')
// request products and show them
socket.on('getProducts', (data) => {
  $productList.innerHTML = ''
  if (data.status === 'success' && data.products.length > 0) {
    data.products.forEach((e) => {
      $templateCard.getElementById('title').textContent = e.title
      $templateCard.getElementById('id').textContent = `ID: ${e.id}`
      $templateCard.getElementById('description').textContent = e.description
      $templateCard.getElementById('img').setAttribute('src', e.thumbnails[0])
      $templateCard.getElementById('img').setAttribute('alt', `image of ${e.title}`)
      $templateCard.getElementById('code').textContent = e.code
      $templateCard.getElementById('price').textContent = e.price
      $templateCard.getElementById('stock').textContent = e.stock
      $templateCard.getElementById('category').textContent = e.category

      const $cloneTemplate = $templateCard.cloneNode(true)
      $fragmentProducts.appendChild($cloneTemplate)
    })
    $productList.appendChild($fragmentProducts)
  } else {
    $productList.innerHTML = `<li><h3 class="text-3xl text-blue-300">${data.message}</h3></li>`
  }
})

// submit of the form to add products
$formAddProducts.addEventListener('submit', (e) => {
  e.preventDefault()
  $btnAdd.disabled = true
  const fieldsProduct = Object.fromEntries(new FormData(e.target))
  fieldsProduct.description = e.target.description.value
  fieldsProduct.status = fieldsProduct.status === 'true'
  fieldsProduct.price = Number(fieldsProduct.price)
  fieldsProduct.stock = parseInt(fieldsProduct.stock)
  fieldsProduct.thumbnails = [fieldsProduct.thumbnails]
  socket.emit('addProduct', fieldsProduct)
})

socket.on('addProductMessage', resp => {
  refreshForm({ form: $formAddProducts, textElement: $msg, resp, btn: $btnAdd })
})

// submit delete product form
$formDeleteProduct.addEventListener('submit', (e) => {
  e.preventDefault()
  $btnDel.disabled = true
  socket.emit('deleteProductById', Number(e.target.productId.value))
})

socket.on('message', resp => {
  refreshForm({ form: $formDeleteProduct, textElement: $msg, resp, btn: $btnDel })
})
