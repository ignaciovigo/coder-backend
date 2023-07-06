import { Router } from 'express';
//Service import
import { loginUser, registerUser } from '../controllers/jwt.controller.js';

const router = Router();

router.post("/login", loginUser);

//Agregar metodo de registrar estudiante:
router.post("/register",  registerUser);

export default router;