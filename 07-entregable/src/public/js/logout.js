const $btnLogout = document.querySelector('[data-btn|=logout]')
$btnLogout.addEventListener('click', async (e) => {
  try {
    const res = await fetch(window.location.origin + '/api/sessions/logout')
    const resp = await res.json()
    if (resp.status === 'success') {
      Swal.fire({
        icon: 'success',
        title: resp.message
      })
      setTimeout(() => {
        window.location.replace('/user/login')
      }, 3000)
    } else {
      throw { message: resp.message }
    }
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: error.message
    })
  }
})
