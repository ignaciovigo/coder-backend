const $form = document.getElementById('registerFrom')

$form.addEventListener('submit', async e => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target).entries())
  try {
    const result = await fetch('/api/users/register', {
      method: 'POST',
      headers: {
        'content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const resp = await result.json()
    console.log(resp)
    if (resp.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: resp.message
      })
      setTimeout(() => {
        window.location.replace('/user/login')
      }, 2000)
    }else{
      throw { message: resp.message }
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: error.message
    })
  }
})
