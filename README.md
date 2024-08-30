# Backend 1

## Descripción del Proyecto

Este proyecto es el resultado de los aprendizajes obtenidos durante el curso de Backend 1. Se trata de una aplicación que gestiona productos y carritos de compra, utilizando una arquitectura organizada y diversas herramientas modernas.

## Estructura del Proyecto

El proyecto está organizado dentro de una gran carpeta llamada `src`, que contiene las siguientes subcarpetas y archivos clave:

- **dao/**: Contiene la lógica de acceso a datos.
  - **db/**: Incluye las interacciones con la base de datos.
    - `cart-manager-db.js`: Gestor de carritos utilizando MongoDB.
    - `product-manager-db.js`: Gestor de productos utilizando MongoDB.
  - **fs/**: Incluye la lógica basada en el sistema de archivos.
    - `cart-manager-fs.js`: Gestor de carritos utilizando archivos.
    - `product-manager-fs.js`: Gestor de productos utilizando archivos.

  **Diferencia entre db y fs**: 
  - `db` se refiere a la implementación que utiliza una base de datos (MongoDB) para persistir la información.
  - `fs` se refiere a la implementación que utiliza el sistema de archivos local para almacenar datos.

- **models/**: Contiene los modelos de datos utilizados en la aplicación, diseñados para trabajar con Mongoose.

- **public/**: Carpeta que contiene los recursos estáticos de la aplicación.
  - **css/**: Archivos de estilos.
  - **img/**: Imágenes utilizadas en la aplicación.
  - **js/**: Archivos JavaScript que manejan la lógica en el frontend.

- **routes/**: Define las rutas que maneja la aplicación.
  - `cart.router.js`: Rutas relacionadas con la gestión de carritos.
  - `products.router.js`: Rutas relacionadas con la gestión de productos.
  - `views.router.js`: Rutas para la renderización de vistas.

- **views/**: Contiene las vistas que se renderizan utilizando Handlebars.
  - **layouts/**: Contiene el archivo de layout principal.
    - `main.handlebars`: Layout principal utilizado para todas las vistas.
  - `home.handlebars`: Vista principal de la aplicación.
  - `realtimeproducts.handlebars`: Vista que muestra los productos en tiempo real.

## Archivos Clave

- **app.js**: Punto de entrada de la aplicación. Configura el servidor y define las rutas principales.
- **database.js**: Responsable de la conexión a la base de datos MongoDB utilizando Mongoose.

## Dependencias Utilizadas

Las siguientes dependencias fueron utilizadas y están listadas en `package.json`:

- **express**: Framework de Node.js para la construcción del servidor.
- **express-handlebars**: Motor de plantillas utilizado para renderizar las vistas.
- **moment**: Biblioteca para manejar y formatear fechas.
- **mongoose**: Biblioteca de modelado para MongoDB.
- **mongoose-paginate-v2**: Plugin de Mongoose para manejar la paginación.
- **multer**: Middleware para manejar la subida de archivos.
- **socket.io**: Biblioteca para habilitar la comunicación en tiempo real entre el servidor y el cliente.

## Instalación

1. Clona el repositorio.
2. Ejecuta `npm install` para instalar todas las dependencias.
3. Configura las variables de entorno si es necesario.
4. Ejecuta la aplicación con `npm start`.

## Uso

- Accede a la vista principal en `http://localhost:8080/`.
- Administra productos y carritos utilizando las rutas definidas.

## Conclusión

Este proyecto es un ejemplo práctico de cómo organizar y construir un backend utilizando Node.js, Express y MongoDB, aplicando los conocimientos adquiridos durante el curso.
