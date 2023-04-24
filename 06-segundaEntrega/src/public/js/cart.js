const CART_ID = '64457caa1cc1e536fca1f8c6'
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
          }, 1000)
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
