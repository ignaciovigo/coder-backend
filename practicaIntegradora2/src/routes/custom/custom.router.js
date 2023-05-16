import { Router } from "express";
import passport from "passport";

/**
 * Custom Router en caso que se quiera generalizar algunos procesos 
 * para otros Routers.
 */
export default class CustomRouter {
    constructor(){
        this.router = Router();
        this.init();
    };

    getRouter(){
        return this.router;
    };
    init(){}; //Esta inicialilzacion se usa para las clases heredadas.

    get(path, policies,...callbacks){
        console.log("Entrando por GET a custom router con Path: " + path);
        console.log(policies);
        this.router.get(path,
            this.handlePolicies(policies),
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks));
    };

    post(path, policies, ...callbacks){
        this.router.post(path,
            this.handlePolicies(policies),
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks));
    };

    put(path, policies, ...callbacks){
        this.router.put(path,
            this.handlePolicies(policies),
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks));
    };

    delete(path, policies, ...callbacks){
        this.router.delete(path, 
            this.handlePolicies(policies),
            this.generateCustomResponses, 
            this.applyCallbacks(callbacks));
    };

    applyCallbacks(callbacks){
        return callbacks.map((callback) => async(...params) => {
            try {
                await callback.apply(this, params);
            } catch (error) {
                console.error(error);
                params[1].status(500).send(error);
            }
        });
    };

    generateCustomResponses = (req, res, next) => {
        //Custom responses 
        res.sendSuccess = payload => res.status(200).send({status: "Success", payload});
        res.sendInternalServerError = error => res.status(500).send({status: "Error", error});
        res.sendClientError = error => res.status(400).send({status: "error", message:error});
        res.sendUnauthorizedError = error => res.status(401).send({error: "User not authenticated or missing token."});
        res.sendForbiddenError = error => res.status(403).send({error: "Token invalid or user with no access, Unauthorized please check your roles!"});
        next();
    };

    handlePolicies = policies => (req, res, next) => {
        console.log("Politicas a evaluar:");
        console.log(policies);
        //Validar si tiene acceso publico:
        if (policies[0] === "PUBLIC") return next(); //Puede entrar cualquiera 
        //El JWT token se guarda en los headers de autorización.
        passport.autenticate('jwt', {session:false}, async(err, user, info) => {
            if (err) return next(err)
            if (!user) {
              const message = info && typeof info === 'object' ? info.toString() : 'Unauthorized'
              return res.status(401).send({ status: 'error', message })
            }
            if (!policies.includes(user.role)) return res.status(403).send({ status: 'error', message: 'Unauthorized user' })
            req.user = user
            return next()
        })(req, res, next)
    };
};