import { Router } from 'express';
//import del service para Courses.
//import CourseService from '../services/filesystem/courses.service.js';
import CourseServiceDao from '../services/db/dao/courses.dao.js';
import { getCourses, saveCourse } from '../controllers/courses.controller.js';

const router = Router();
const coursesService = new CourseServiceDao();

router.get('/',getCourses)

router.post('/',saveCourse)

export default router;