import userRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from "../utils/util.js";
import { cartService } from "./index.js";

class UserServices {


    async registerUser(userData) {
        const existingUser = await userRepository.getUserByEmail(userData.email);
        if (existingUser) throw new Error("el usuario ya existe");

        const newCart = await cartService.createCart();

        userData.cart = newCart._id;

        userData.password = createHash(userData.password);
        return await userRepository.createUser(userData);
    }

    async loginUser(email, password) {
        const user = await userRepository.getUserByEmail(email);
        if (!user || !isValidPassword(password, user)) throw new Error("Usuario o contraseña incorrectos");
        return user;

    }

    async getUserById(id) {
        return await userRepository.getUserById(id);
    }


    async updateUser(id, updateData) {
        if (updateData.password) {
            updateData.password = createHash(updateData.password);
        }
        const updatedUser = await userRepository.updateUser(id, updateData);
        if (!updatedUser) throw new Error("Usuario no encontrado");
        return updatedUser;
    }


    async deleteUser(id) {

        const deletedUser = await userRepository.deleteUser(id);
        if (!deletedUser) throw new Error("Usuario no encontrado");
        return deletedUser;

    }

    async getUserByCart(cart) {
        return await userRepository.getUserByCart( cart );

    }


}

export default new UserServices();
