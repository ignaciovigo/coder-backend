import CourseServiceDao from "../db/dao/courses.dao.js";
import Students from "../db/dao/students.dao.js";
import CoursesRepository from "./courses.repository.js";

import StudentRepository from "./students.repository.js";

const studentDao = new Students();
const courseDao = new CourseServiceDao()

export const coursesService = new CoursesRses:epository(courseDao)
export const studentService = new StudentRepository(studentDao);