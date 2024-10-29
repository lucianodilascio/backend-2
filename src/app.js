import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import sessionsRouter from "./routes/sessions.router.js"
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./dao/db/product-manager-db.js";
import cookieParser from "cookie-parser";
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





const claveSecreta = "claveprohibida";
app.use(cookieParser(claveSecreta));
app.use(passport.initialize());
initializePassport();




app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);





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

