
import express from "express";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import viewsRouter from "./routes/views.router.js";
import productRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import ProductManager from "./dao/db/product-manager-db.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import FileStore from "session-file-store";
import MongoStore from "connect-mongo";
import "./database.js"; 


//File Storage
const fileStore = FileStore(session);

//MongoDB:



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




app.use("/", viewsRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);


//PRUEBA DE SETEO Y LECTURA Y ELIMINACIÓN DE COOKIES:

//SETEO DE COOKIE:

app.get("/setcookie", (req, res) => {
  //se usa el objeto "res" para setearle una cookie al cliente
  res.cookie("cookiePrueba", "Mi primera cookie", {maxAge: 5000}). send("cookie seteada");
})
//el maxAge determina el tiempo que va a vivir en el navegador la cookie, si no seteamos nada vive eternamente.


//  FIRMAR una cookie: es un factor de "seguridad" que invalida la cookie en caso de que sea modificada, es inevitable que alguien externo la modifique, pero en caso de detectar este movimiento de alteración, se la pasa a la cookie como "alterada" y por lo tanto se INVALIDA.

const claveSecreta = "claveprohibida";
app.use(cookieParser(claveSecreta));

//Midleware de SESSION:
app.use(session({
  secret: "secretCoder",
//valor para firmar las cookies

  resave: true,
  //resave en "true" me permite mantener activa la sesión frente a la inactividad del usuario. si se deja en FALSE, la sesión morira en caso de que exista cierto tiempo de inactividad.

  saveUninitialized: true,
  //saveUnitialized en "true" permite guardar cualquier sesión aun cuando el objeto de la sesión no contenga nada. si se deja en FALSE la sesion no se guarda si el objeto de sesión esta vacio al final de la consulta.


  //2DA opcion, usando FILE STORAGE:


//  store: new fileStore({path: "./src/sessions", ttl: 1000, retries: 1})

//path: se guarda la ruta de los archivos
//ttl (Time to live): tiempo que vivirá la session
//retries: cantidad de veces que el servidor intentará leer el archivo.


//3ra opcion, usar Mongo Storage:

store: MongoStore.create({
  mongoUrl: "mongodb+srv://lucianodilascio14:coderluciano@cluster0.kdcns.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
})


}))

// Levantamos la SESSION en el endpoint contador:

app.get("/contador", (req, res) => {
  if(req.session.counter) {
    req.session.counter++;
    res.send("se visitó el sitio: " + req.session.counter + " veces");
  } else {
    req.session.counter = 1;
    res.send("Bienvenido!")
  }
})


//enviamos una COOKIE FIRMADA: 

app.get("/cookiefirmada", (req, res) => {
  res.cookie("cookieFirmada", "mensaje secreto", { signed: true}).send("cookie firmada enviada");
})

//OBTENEMOS uan cookie firmada

app.get("/recuperamoscookiefirmada", (req, res) =>{
  let valorCookie = req.signedCookies.cookieFirmada;

  if (valorCookie) {
    res.send("cookie recuperada: " + valorCookie)
  }
  else {
res.send("cookie invalida");
  }
})
//LEER UNA COOKIE:

app.get("/leercookie", (req, res) => {
  res.send(req.cookies.cookiePrueba);
})

//ELIMINACION DE COOKIE:

app.get("/borrarcookie", (req, res) => {
  res.clearCookie("cookiePrueba").send("cookie eliminada");
})




//  FIRMAR una cookie: es un factor de "seguridad" que invalida la cookie en caso de que sea modificada, es inevitable que alguien externo la modifique, pero en caso de detectar este movimiento de alteración, se la pasa a la cookie como "alterada" y por lo tanto se INVALIDA.



//FILE STORAGE: permite la persistencia de sesiones aun cuando se reinicia el servidor



const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el http://localhost:${PUERTO}`);
});

const io = new Server(httpServer);

io.on("connection", async (socket) => {
  console.log("Un cliente se comunica conmigo");

    const productos = await manager.getProducts()


  socket.emit("productos", productos.docs);

  ///////////////////


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


