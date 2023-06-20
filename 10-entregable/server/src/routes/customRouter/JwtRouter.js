import { loginUser, loginWithGitHub, logoutUser } from '../../controllers/login.controller.js'
import CustomRouter from './CustomRouter.js'
export default class JwtRouter extends CustomRouter {
  init () {
    this.post('/login', { policies: ['PUBLIC'] }, loginUser)

    this.get('/logout', { policies: ['USER', 'ADMIN'], strategy: 'jwt' }, logoutUser)

    this.get('/github', { policies: ['PUBLIC'], strategy: 'github', options: { scope: ['user:email'] } })

    this.get('/githubcallback', { policies: ['PUBLIC', 'USER', 'ADMIN'], strategy: 'github', options: { failureRedirect: '/user/login' } }, loginWithGitHub)
  }
}
