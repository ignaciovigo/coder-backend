import { coursesService } from '../services/repository/services.js';

export const getAll = async (req, res) => {
    try {
        let courses = await coursesService.getAll();
        res.send(courses);
    } catch (error) {
        req.logger.error(error.message)
        //Remplazar por loggers
        res.status(500).send({error:  error, message: "No se pudo obtener los cursos."});
    }
}

export const save = async (req, res) => {

    try {
        let result = await coursesService.save(req.body);
        res.status(201).send(result);
    } catch (error) {
        req.logger.error(error.message)
        res.status(500).send({error:  error, message: "No se pudo guardar el curso."});
    }
}


