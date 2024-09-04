const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("../services/jwt");
const mongoosePaginate = require("mongoose-pagination");


const pruebaUser = (req, res) => {
    return res.status(200).send({
        message: "Mensaje enviado desde: controllers/user.js",
        usuario: req.user
    });
}

async function register(req, res) {
    try {
        let params = req.body;

        if (!params.name || !params.email || !params.password || !params.nick) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar",
            });
        }

        const users = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        });

        if (users.length >= 1) {
            return res.status(409).send({
                status: "error",
                message: "El usuario ya existe"
            });
        }

        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(params.password, saltRounds);

        let user_to_save = new User({
            name: params.name,
            email: params.email.toLowerCase(),
            nick: params.nick.toLowerCase(),
            password: hashedPassword,
        });

        const userStored = await user_to_save.save();

        return res.status(200).json({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userStored
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "error", 
            message: "Error en el proceso de registro", 
            error 
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar",
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe"
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                status: "error",
                message: "Contraseña incorrecta"
            });
        }

        const token = jwt.createToken(user)

        return res.status(200).json({
            status: "success",
            message: "Login exitoso",
            user: user,
            token: token
        });

    } catch (error) {
        return res.status(500).json({ 
            status: "error", 
            message: "Error en el proceso de login", 
            error 
        });
    }
}

const profile = async (req, res) => {
    try {
        const userId = req.params.id;

        const user = await User.findById(userId).select({ password: 0, role: 0 });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            user: user
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al obtener los datos del usuario",
            error: error.message
        });
    }
}

const list = async (req, res) => {
    try {
        // Controlar en qué página estamos
        let page = 1;
        if (req.params.page) {
            page = parseInt(req.params.page);
        }

        // Definir el número de elementos por página
        const itemsPerPage = 5;

        // Obtener usuarios y el total de documentos
        const users = await User.find().sort('_id').skip((page - 1) * itemsPerPage).limit(itemsPerPage).exec();
        const total = await User.countDocuments().exec();

        // Devolver el resultado
        return res.status(200).send({
            status: "success",
            users: users.length > 0 ? users : [], // Devolver un array vacío si no hay usuarios
            page,
            itemsPerPage,
            total,
            pages: Math.ceil(total/itemsPerPage) // Determinar si hay más de una página de resultados
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al obtener los usuarios",
            error
        });
    }
}

const update = async (req, res) => {
    const userId = req.user.id; // Asegúrate de que req.user se llene correctamente en el middleware auth
    const updateData = req.body;

    try {
        // Si el usuario quiere actualizar el password, encriptar el nuevo password
        if (updateData.password) {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(updateData.password, saltRounds);
        }

        // Buscar y actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select({ password: 0 });

        if (!updatedUser) {
            return res.status(404).json({
                status: "error",
                message: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            status: "success",
            message: "Usuario actualizado correctamente",
            user: updatedUser
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el usuario",
            error
        });
    }
}

const upload = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Subida de imagenes",
        user: req.user,
        file: req.file,
        files: req.files
    });
}

module.exports = {
    pruebaUser,
    register,
    login,
    profile,
    list,
    update,
    upload
}
