import express from "express";
import { Router } from "express";
import productRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import ProductManager from "../dao/db/product-manager-db.js";
import multer from "multer";
import ProductModel from "../dao/models/product.model.js";
import { onlyAdmin, onlyUser } from "../middleware/auth.js";

const router = Router();

const productManager = new ProductManager();



router.use((req, res, next) => {
  req.manager = productManager;
  next();
});


router.use("/api/products", productRouter);
router.use("/api/carts", cartsRouter);


router.use("/static", express.static("./src/public"));


router.get("/realtimeproducts", onlyAdmin , async (req, res) => {
  try {
    const productos = await req.manager.getProducts();
    res.render("realtimeproducts", { productos: productos.docs });


  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/products", onlyUser, async (req, res) => {

  let page = req.query.page || 1;
  let limit = req.query.limit || 3;

  const productosLista = await ProductModel.paginate({}, { limit, page });
  const productosListaFinal = productosLista.docs.map(elemento => {
    const { _id, ...rest } = elemento.toObject();
    return rest
  })

  res.render("home", {
    productos: productosListaFinal,
    hasPrevPage: productosLista.hasPrevPage,
    hasNextPage: productosLista.hasNextPage,
    prevPage: productosLista.prevPage,
    nextPage: productosLista.nextPage,
    currentPage: productosLista.page,
    totalPages: productosLista.totalPages
  })
}
)

router.get("/login", (req, res) => {
  if(req.session.login) {
    return res.redirect("/profile");
  }
  res.render("login");
})

router.get("/register", (req, res) => {
  if(req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
})

router.get("/profile", (req, res) => {
if(!req.session.login) {
  return res.redirect("/login");
}
  res.render("profile", {user: req.session.user});
})


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./src/public/img");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post("/imagenes", upload.single("imagen"), (req, res) => {
  res.send("Imagen cargada");
});

export default router;
