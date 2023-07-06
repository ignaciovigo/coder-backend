export default class CoursesRepository {
    constructor(dao) {
        this.dao = dao;
    }
    getAll = () =>{
        return this.dao.getAll();
    }
    getById = (params) => {
        return this.dao.getById(params);
    }
    createCourse = (course) =>{
        return this.dao.saveCourse(course);
    }
    update = (id,course) =>{
        return this.dao.updateCourse(id,course);
    }
  };