import { studentService } from "../services/repository/services.js";
import { createHash, generateJWToken, isValidPassword } from "../util.js";

export async function loginUser (req, res){
    const {email, password} = req.body;
    try {
        const user = await studentService.findByUsername(email);
        req.logger.info(`Usuario encontrado para login: ${user}`);
        if (!user) {
            req.logger.error("User doesn't exists with username: " + email);
            return res.status(400).send({error: "Not found", message: "Usuario no encontrado con username: " + email});
        }
        if (!isValidPassword(user, password)) {
            req.logger.error("Invalid credentials for user: " + email);
            return res.status(401).send({status:"error",error:"El usuario y la contraseña no coinciden!"});
        }
        const tokenUser= {
            name : `${user.name} ${user.lastName}`,
            email: user.email,
            age: user.age,
            role: user.role
        };
        const access_token = generateJWToken(tokenUser);
        //Con Cookie
        res.cookie('jwtCookieToken', access_token, {
            maxAge: 120000,
            httpOnly: true
        });
        res.send({message: "Login successful!"});
    } catch (error) {
        req.logger.error(error);
        return res.status(500).send({status:"error",error:"Error interno de la applicacion."});
    }
}


export async function registerUser(req, res){
    const { name, lastName, email, age, password} = req.body;
    req.logger.info("Registrando usuario:");
    req.logger.info(req.body);

    const exists = await studentService.findByUsername(email);
    if (exists){
        return res.status(401).send({status: "error", message: "Usuario ya existe."});
    }
    const user = {
        name,
        lastName,
        email,
        age,
        password: createHash(password)
    };
    const result = await studentService.createStudent(user);
    res.status(201).send({status: "success", message: "Usuario creado con extito con ID: " + result.id});
}
