// import { Router } from 'express'
// import userModel from '../models/users.model.js'
// import { createHash } from '../utils.js'

// const router = Router()
// // api/users/register
// router.post('/register', async (req, res) => {
//   const { firstName, lastName, email, age, password } = req.body
//   if (!firstName || !lastName || !email || !age || !password) {
//     return res.status(401).send({ status: 'error', message: 'The fields provided are incompleted' })
//   }
//   try {
//     const user = await userModel.findOne({ email })
//     if (user) {
//       return res.status(401).send({ status: 'error', message: 'The email is already in use' })
//     } else {
//       const newUser = {
//         firstName,
//         lastName,
//         email,
//         age,
//         password: createHash(password),
//         role: (email === 'fran@example.com') ? 'ADMIN' : 'USER'
//       }
//       const result = await userModel.create(newUser)
//       if (!result) throw Error('Error during registering user to the database')
//       return res.status(200).send({ status: 'success', message: 'User created successfully!' })
//     }
//   } catch (error) {
//     return res.status(500)('Error al registrar el usuario: ', error)
//   }
// })

// export default router
