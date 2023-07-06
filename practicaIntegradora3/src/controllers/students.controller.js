import { studentService } from "../services/repository/services.js";

export async function getStudents(req,res){
    try {
        let students = await studentService.getAll();
        res.send(students);
    } catch (error) {
        req.logger.error(error);
        res.status(500).send({error:  error, message: "No se pudo obtener los estudiantes."});
    }
    
}

export async function createStudent(req,res){
    try {
        let result = await studentService.createStudent(req.body);
        res.status(201).send(result);
    } catch (error) {
        console.error(error);
        res.status(500).send({error:  error, message: "No se pudo guardar el estudiante."});
    }
}