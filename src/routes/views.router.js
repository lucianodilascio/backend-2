import express from "express";
import { Router } from "express";
import productRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
//import ProductManager from "../dao/db/product-manager-db.js";
import multer from "multer";
import ProductModel from "../dao/models/product.model.js";
import { onlyAdmin, onlyUser } from "../middleware/auth.js";
import passport from "passport";
import { productService } from "../services/index.js";


const router = Router();

 //const productManager = new ProductManager();


router.use("/api/products", productRouter);
router.use("/api/carts", cartsRouter);


router.use("/static", express.static("./src/public"));


router.get("/realtimeproducts", passport.authenticate("current", { session: false }), onlyAdmin, async (req, res) => {
  try {
    const productos = await productService.paginateProducts({}, {});
    console.log(productos);
    res.render("realtimeproducts", { productos: productos.docs });


  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});


router.get("/products", passport.authenticate("current", { session: false }), onlyUser, async (req, res) => {

  let page = req.query.page || 4;
  let limit = req.query.limit || 3;
  const user = req.user;
  const options = {page, limit};

  //const productosLista = await ProductModel.paginate({}, { limit, page });
  const productosLista = await productService.paginateProducts({}, options);
  const productosListaFinal = productosLista.docs.map(elemento => {
    const { _id, ...rest } = elemento.toObject();
    return rest
  });


  res.render("home", {
    user: user,
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
  res.render("login");

})

router.get("/register", (req, res) => {
  res.render("register");
})


// router.get("/profile", (req, res) => {
// if(!req.session.login) {
//   return res.redirect("/login");
// }
//   res.render("profile", {user: req.session.user});
// })


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
