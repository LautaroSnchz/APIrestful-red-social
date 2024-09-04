//importar dependecias
const connection = require("./database/connection");
const express = require("express");
const cors = require("cors");
//Mensaje de bienvenida
console.log("API NODE PARA RED SOCIAL ARRANCADA !  !  !")
// Conexion a basedatos
connection();
//crear servidor node
const app = express();
const puerto = 3900;

//configurar cors
app.use(cors());

//convertir datos del body o objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//cargar configuracion de rutas
const UserRoutes = require("./routes/user");
const PublicationRoutes = require("./routes/publication");
const FollowRoutes = require("./routes/follow");

app.use("/api/user", UserRoutes);
app.use("/api/publication", PublicationRoutes);
app.use("/api/follow", FollowRoutes);

//Ruta de prueba
app.get("/ruta-prueba",(req, res) => {
    
    return res.status(200).json(
        {
            "id": 1,
            "nombre": "Victor",
            "web": "victorroblesweb.es"
        }
    );
})

//poner servidor a escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor de node corriendo en el puerto: ", puerto)
});