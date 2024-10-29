import cartDao from "../dao/cart.dao.js";

class CartRepository {

    async createCart() {

        return await cartDao.save({ products: [] });

    }

    async getCartById(id) {

        return cartDao.findById(id);


    }

    async updateCart(id, cartData) {

        return await cartDao.update(id, cartData);

    }

    async deleteCart(id) {

        return await cartDao.delete(id);
    }


}

export default CartRepository;