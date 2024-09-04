// importar modulos
const jwt = require('jsonwebtoken');  // Usa 'jsonwebtoken' para manejar JWT
const moment = require('moment');
const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key"; 


//importar clave secreta
const libjwt = require("../services/jwt");
const secret = libjwt.secret;

//MIDDLEWARE de autenticacion
exports.auth = (req, res, next) => {
//comprobar si me llega la cabecera de autentificacion(auth)
if(!req.headers.authorization){
    return res.status(403).send({
        status: "error",
        message: "La peticion no tiene la cabecera de autenticacion"
    });
}

//limpiar el token
let token = req.headers.authorization.replace(/['"]+/g, '');
//decodificar el token
try{
    let payload = jwt.decode(token, secret);

    console.log(payload)



    //comprobar expiracion del token
    if(payload.exp <= moment().unix()){
        return res.status(401).send({
            status: "error",
            message: "Token expirado",
            error
        });
    }

    //agregar datos de usuario a request
    req.user = payload;

}catch(error){
    return res.status(404).send({
        status: "error",
        message: "Token invalido",
        error
    });
}


//Pasar a ejecucion de accion
next();
}

