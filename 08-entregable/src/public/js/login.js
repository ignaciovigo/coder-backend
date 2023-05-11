const $form = document.getElementById('loginFrom')

$form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const entries = new FormData(e.currentTarget).entries()
  const data = Object.fromEntries(entries)
  try {
    const result = await fetch('/api/jwt/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    console.log(result)
    if (result.status === 200) {
      window.location.replace('/products')
    } else {
      const bodyResponse = await result.json()
      throw { message: bodyResponse.message }
    }
  } catch (error) {
    console.error(error, error.message)
    Swal.fire({
      icon: 'error',
      title: error.message
    })
  }
})
