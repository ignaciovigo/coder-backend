import {Router} from 'express';
import {coursesService, studentService} from '../services/repository/services.js';
import { passportCall } from "../util.js";


const router = Router();

//Proteger estas vistas
router.get('/', passportCall('jwt'), async(req,res)=>{
    const student = req.user;
    console.log("Estudiante logueado: ");
    console.log(student);
    let students = await studentService.getAll();
    console.log(students);
    res.render('students',{students: students})
});

router.get('/student', passportCall('jwt'), async(req,res)=>{
    const student = req.user;
    console.log("Estudiante logueado: ");
    console.log(student);
    let students = new Array();
    students.push(student);
    res.render('students',{students: students});
});

router.get('/courses', passportCall('jwt'), async(req,res)=>{
    let courses = await coursesService.getAll();
    console.log(courses);
    res.render('courses',{courses})
})


export default router;