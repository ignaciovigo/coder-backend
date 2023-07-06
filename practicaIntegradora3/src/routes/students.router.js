import { Router } from 'express';
//import del service repository:
import { createStudent, getStudents } from '../controllers/students.controller.js';

const router = Router();


router.get('/',getStudents)

router.post('/',createStudent)

export default router;