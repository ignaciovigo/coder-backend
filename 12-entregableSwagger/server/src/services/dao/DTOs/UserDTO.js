export default class UserDTO {
  constructor ({ user = null, sensitive = null }) {
    this.firstName = user.firstName
    this.id = user.id
    this.lastName = user.lastName
    this.fullName = user.fullName
    this.email = user.email
    this.age = user.age || null
    if (sensitive) {
      this.password = user.password
    }
    this.role = user.role
    this.githubId = user.githubId || null
    this.cartId = user.cartId.toString()
  }
}
