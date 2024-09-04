// Importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");

// Clave secreta
const secret = "CLAVE_SECRETA_DEL_PROYECTO_DE_LA_RED_SOCIAL";

// Crear una función para generar tokens
const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image, // corregido de 'imagen' a 'image' para coincidir con el objeto de usuario
        iat: moment().unix(), // Fecha de emisión del token
        exp: moment().add(30, "days").unix() // Fecha de expiración del token, 30 días después
    };

    // Devolver JWT token codificado
    return jwt.encode(payload, secret);
};

module.exports = {
    secret,
    createToken
}
