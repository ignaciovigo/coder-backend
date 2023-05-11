const $btnLogout = document.querySelector('[data-btn|=logout]')
$btnLogout.addEventListener('click', async (e) => {
  try {
    const res = await fetch(window.location.origin + '/api/jwt/logout')
    const resp = await res.json()
    if (resp.status === 'success') {
      window.location.replace('/user/login')
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
