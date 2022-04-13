const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');



class Server {
    constructor(){
        // Instancia de servicio Express
        this.app = express();

        // Puerto donde se escucha el servidor
        this.port = process.env.PORT;

        //Path para el endpoint de usuarios
        this.paths = {
            auth: '/api/auth',
            usuarios: '/api/usuarios',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar',
        }

        //Conectar con base de datos
        this.conectarDB();

        //Middlewares de el servidor
        this.middleware();

        // Rutas del servidor
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    // metodo que exoone las rutas al publico del servidor
    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'))
        this.app.use(this.paths.usuarios, require('../routes/usuarios'))
        this.app.use(this.paths.categorias, require('../routes/categorias'))
        this.app.use(this.paths.productos, require('../routes/productos'))
        this.app.use(this.paths.buscar, require('../routes/buscar'))
        
    }

    // middleware para el uso de servicios que mejoran el performance del servidor
    middleware(){

        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio publico
        this.app.use(express.static('public'));
    }

    // metodo que escucha las peticiones al sevidor en el petro asignado por nosotros
    listen(){
        this.app.listen(this.port,() => console.log(`Servidor corriendo en el puerto ${this.port}`));
    }
}

module.exports = Server;