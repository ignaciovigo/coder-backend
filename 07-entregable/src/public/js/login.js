const $form = document.getElementById('loginFrom')

$form.addEventListener('submit', async e => {
  e.preventDefault()
  const entries = new FormData(e.currentTarget).entries()
  const data = Object.fromEntries(entries)
  try {
    const result = await fetch('/api/sessions/login', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await result.json()
    console.log(resp)
    if (resp.status === 'success') {
      window.location.replace('/products')
    } else {
      throw {message: resp.message}
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: error.message
    })
    console.error(error, error.message)
  }
})
