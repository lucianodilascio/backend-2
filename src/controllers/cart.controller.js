import { cartService } from "../services/index.js";
import { productService } from "../services/index.js";
import userService from "../services/user.service.js";
import TicketModel from "../dao/models/ticket.model.js";
import {totalCalc, randomCode} from "../utils/util.js";

class CartController {

    async create(req, res) {

        try {
            const newCart = await cartService.createCart();
            res.status(201).send(newCart);
        } catch (error) {
            res.status(500).send("error al crear el carrito", error);

        }
    }

    async getCart(req, res) {
        const { cid } = req.params;
        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("carrito no encontrado");
            res.send(cart);
        } catch (error) {
            res.status(500).send("error al traer el carrito", error);
        }
    }


    async addProductToCart(req, res) {

        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("carrito no encontrado");

            const existingProduct = cart.products.find(item => item.product.toString() === pid);

            if(existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({product: pid, quantity});
            }

            await cartService.updateCart(cid, cart);
            res.send(cart);

        } catch (error) {
            res.status(500).send("error al agregar productos", error);

        }

    }

    async removeProductFromCart(req, res) {
        const { cid, pid } = req.params;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("carrito no encontrado");

            const productIndex = cart.products.findIndex(item => item.product.toString() === pid);
            if (productIndex === -1) return res.status(404).send("producto no encontrado en el carrito");

            cart.products.splice(productIndex, 1);
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("error al eliminar el producto del carrito", error);
        }
    }

    async updateProductQuantity(req, res) {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("carrito no encontrado");

            const existingProduct = cart.products.find(item => item.product.toString() === pid);
            if (!existingProduct) return res.status(404).send("producto no encontrado en el carrito");

            existingProduct.quantity = quantity;
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("error al actualizar la cantidad del producto", error);
        }
    }

    async clearCart(req, res) {
        const { cid } = req.params;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("carrito no encontrado");

            cart.products = []; // Vacía el carrito
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("error al vaciar el carrito", error);
        }
    }

    async updateCart(req, res) {
        const { cid } = req.params;
        const { products } = req.body;

        try {
            const cart = await cartService.getCartById(cid);
            if (!cart) return res.status(404).send("carrito no encontrado");

            cart.products = products; // Reemplaza los productos existentes
            await cartService.updateCart(cid, cart);
            res.send(cart);
        } catch (error) {
            res.status(500).send("error al actualizar el carrito", error);
        }
    }

    async finishPurchase(req, res){
        const cartId = req.params.cid;

        try {

            const cart = await cartService.getCartById(cartId);
            if(!cart) return res.status(404).send("Carrito no encontrado");

            const products = cart.products;

            const notAvailableProducts = [];

            for(const item of products){
                const productId = item.product;
                const product = await productService.getProductById(productId);

            
                if(product.stock >= item.quantity){
                    product.stock -= item.quantity;
                    await product.save();
                } else {
                    notAvailableProducts.push(productId);
                }
            }

            const userWcart = await userService.getUserByCart({ cart: cartId });
            console.log(userWcart);
            
            const ticket = new TicketModel({
                code: randomCode(8),
                purchase_datetime: new Date(),
                amount: totalCalc(cart.products),
                purchaser: userWcart._id
            });

            await ticket.save();

            cart.products = cart.products.filter( item => notAvailableProducts.some(pid => pid.equals(item.product)));

            await cart.save();

            res.json( {user: userWcart.first_name, email: userWcart.email, ticketNumber: ticket._id, date: ticket.purchase_datetime});

            
        } catch (error) {
            console.error("Error al procesar el pedido ", error);
            res.status(500).json({ error: "Error interno del servidor"});
        }
    }


}
export default CartController;