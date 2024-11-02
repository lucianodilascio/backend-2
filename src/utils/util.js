//Bcrypt, libreria de hashing de contraseñas
import bcrypt from "bcrypt";

//creamnos dos funciones
//1: createHash: hashea el password(lo protege)
//2: isValidPassword: compara el password proporcionado por la base de datos.

const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

//hashSync: toma el password y aplica el hasheo, a partir de un salt:
//Salt: string random que se crea para que el proceso se cree de forma impredecible.
//10: generarar un "salt" de 10 caracteres.

//ES UN PROCESO IRREVERSIBLE.

const isValidPassword = (password, user) => bcrypt.compareSync(password, user.password);

//Al comparar los password (compare), retorna TRUE o FALSE segun corresponda.



const totalCalc = (products) => {
    let total = 0;

    products.forEach(item => {
        total += item.product.price * item.quantity;

    });

    return total;
};

const randomCode = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;

    while(counter < length){
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }

    return result;
}

export {createHash, isValidPassword, totalCalc, randomCode};

