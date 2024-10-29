import express from "express";
const router = express.Router();
import CartController from "../controllers/cart.controller.js";
const controller = new CartController();

router.post("/", controller.create);
router.get("/:cid", controller.getCart);
router.post("/:cid/products/:pid", controller.addProductToCart);
router.delete("/:cid/products/:pid", controller.removeProductFromCart);
router.put("/:cid", controller.updateCart); // Actualiza el carrito completo
router.put("/:cid/products/:pid", controller.updateProductQuantity); // Actualiza la cantidad de un producto
router.delete("/:cid", controller.clearCart); // Vacía el carrito

export default router;