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


app.use(session({
  secret: "secretCoder",
  //valor para firmar las cookies
  resave: false,
  //resave en "true" me permite mantener activa la sesión frente a la inactividad del usuario. si se deja en FALSE, la sesión morira en caso de que exista cierto tiempo de inactividad.

  saveUninitialized: false,
  //saveUnitialized en "true" permite guardar cualquier sesión aun cuando el objeto de la sesión no contenga nada. si se deja en FALSE la sesion no se guarda si el objeto de sesión esta vacio al final de la consulta.

  // usar Mongo Storage:
  store: MongoStore.create({
    mongoUrl: "mongodb+srv://lucianodilascio14:coderluciano@cluster0.kdcns.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
  })

}))

//cambios para usar PASSPORT: 

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


