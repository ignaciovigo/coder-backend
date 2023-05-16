import studentsModel from "../../services/db/models/students.js";
import StudentService from "../../services/db/students.service.js";
import { createHash, generateJWToken, isValidPassword } from "../../util.js";
import CustomRouter from "./custom.router.js";

const studentService = new StudentService();
export default class JwtRouter extends CustomRouter{
    init(){
        this.post("/login",['PUBLIC'] ,async (req, res)=>{
            const {email, password} = req.body;
            try {
                const user = await studentService.findByUsername(email);
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + email);
                    return res.sendClientError("Usuario no encontrado con username: ");
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + email);
                    return res.sendUnauthorizedError("El usuario y la contraseña no coinciden!");
                }
                const tokenUser= {
                    name : `${user.name} ${user.lastName}`,
                    email: user.email,
                    age: user.age,
                    role: user.role
                };
                const access_token = generateJWToken(tokenUser);
                console.log(access_token);
                //Con Cookie
                res.cookie('jwtCookieToken', access_token, {
                    maxAge: 60000,
                    httpOnly: true
                });
                return res.sendSuccess("Login successful!");
            } catch (error) {
                console.error(error);
                return res.sendInternalServerError("Error interno de la applicacion.");
            }
        });
        
        this.post("/register",['PUBLIC'], async (req, res)=> {
            const { name, lastName, email, age, password } = req.body;
            const emailUser = await studentsModel.findOne({email});
            if(!emailUser) {
                const newUser = await studentsModel.create({ name, lastName, email, age, password: createHash(password), role:'USER' })
                return res.sendSuccess("success");
            } else {
                return res.sendClientError('The email is in use')
            }
        });
    }; 
    
};