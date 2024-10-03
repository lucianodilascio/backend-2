import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./dao/db/product-manager-db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import "./database.js";
import passport from "passport";
import initializePassport from "./config/passport.config.js";


const app = express();
const PUERTO = 8080;

const manager = new ProductManager();


app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/static", express.static("./src/public"));
//app.use(cookieParser());


//cambios para usar PASSPORT: 

app.use(session({
  secret: 'claveprohibida', // Puedes mantener tu clave secreta o cambiarla
  resave: false, // No vuelve a guardar la sesión si no hay modificaciones
  saveUninitialized: false, // No guarda sesiones vacías
  store: MongoStore.create({
    mongoUrl: 'mongodb://localhost:27017/tuBaseDeDatos', // Cambia 'tuBaseDeDatos' por el nombre de tu base de datos en MongoDB
    ttl: 14 * 24 * 60 * 60 // Tiempo de vida de la sesión en segundos (14 días)
  })
}));

initializePassport();
app.use(passport.initialize());
app.use(passport.session());



app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);


const claveSecreta = "claveprohibida";
app.use(cookieParser(claveSecreta));


//LOGIN Y REGISTRO

app.use("/api/sessions", sessionsRouter);



const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se comunica conmigo");

  const productos = await manager.getProducts()


  socket.emit("productos", productos.docs);

  ////////////////////


  socket.on("eliminarProducto", async (id) => {

    await manager.deleteProduct(id);

    const productosActualizados = await manager.getProducts();

    io.sockets.emit("productos", productosActualizados.docs);
  });


  socket.on("nuevoProducto", async (producto) => {

    console.log(producto);
    const { title, description, price, code, stock, category } = producto

    await manager.addProduct(producto);

    const productosActualizados = await manager.getProducts();

    io.sockets.emit("productos", productosActualizados.docs);
  });
});


