import { cartService } from "../services/index.js";

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


}
export default CartController;