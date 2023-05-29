// temporary cart id
const CART_ID = document.querySelector('[data-btn|=logout]').id

// submit for each form ( button add to cart )
document.addEventListener('submit', (e) => {
  e.preventDefault()
  const id = e.target.id
  const quantity = Number(e.target.quantity.value)
  fetch(`http://localhost:8080/api/carts/${CART_ID}/product/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      quantity
    })
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        Swal.fire({
          icon: 'success',
          title: 'Product added'
        })
      }
    })
    .catch(error => console.error(error))
  e.target.reset()
})
