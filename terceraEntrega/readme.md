# Notes
> El frontend fue hecho con react y vite js, para correrlo copiar el package.json y los archivos necesarios para que el entorno de vite funcione ademas de la caperta src. Luego ejecutar el comando npm install.

> Para correr la aplicacion del cliente ubicarse en el directorio client y ejecutar npm run dev.

> Por otro lado para correr el servidor ubicarse en el directorio server y ejectuar npm start.
# Env variables utilizadas en el server
- MONGO_URL = mongodb://localhost:27017/entrega?retryWrites=true&w=majority
- CLIENT_ID_GITHUB = Id para el cliente de github
- CLIENT_SECRET = Id secreto para que requiere github
- CALLBACK_URL = Url callback que quiere github
- PRIVATE_KEY = Key privdada para passport bajo la estrategia jwt
- SECRET_COOKIE = key secreta para las cookies
- PORT = 8080
- URL_REACT_APP =  http://localhost:5173
- NODEMAILER = Clave de google account para la verificacion de dos pasos, asi poder utiilizar nodemailer
- EMAIL = Email que requiere nodemailer para su configuracion


Email para tener una cuenta de administador y poder acceder al panel de agregar o eliminar productos.
-   email: admin@coder.com

