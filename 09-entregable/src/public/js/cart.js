const CART_ID = document.querySelector('[data-btn|=logout]').id
document.addEventListener('click', (e) => {
  if (e.target.matches('[data-btn|="remove"]')) {
    const idProduct = e.target.id
    fetch(`http://localhost:8080/api/carts/${CART_ID}/product/${idProduct}`,
      { method: 'DELETE' })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Product removed'
          })
          setTimeout(function () {
            location.reload()
          }, 0)
        }
      })
      .catch(error => {
        console.error(error)
        Swal.fire({
          icon: 'error',
          title: 'Could not be removed'
        })
      })
  }
}
)
