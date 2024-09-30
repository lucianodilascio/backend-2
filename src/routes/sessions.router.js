import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/user.model.js";


//Ruta POST para REGISTRAR un nuevo usuario

router.post("/register", async (req, res) => {

    let { first_name, last_name, email, password, age } = req.body;

    try {
        //verificamos si el email ya está registrado
        const userExist = await UserModel.findOne({ email: email });
        if (userExist) {
            return res.send("el correo ya esta registrado")
        }

        // Si no está registrado, creamos nuevo usuario:

        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password,
            age,
        })

        //una vez creado, almacenamos al usuario en la session:
        req.session.user = {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
        }

        req.session.login = true;

        res.status(201).send("usuario creado exitosamente");

    } catch (error) {
        res.status(500).send("error interno del servidor", error);

    }

})

//Ruta para el LOGIN:

router.post("/login", async (req, res) => {
    let { email, password } = req.body;

    try {
       const userSearched = await UserModel.findOne({ email: email });
        if (userSearched) {
            if (userSearched.password === password) {
                req.session.user = {
                    first_name: userSearched.first_name,
                    last_name: userSearched.last_name,
                    email: userSearched.email,
                }

                req.session.login = true;

                res.redirect("/profile");
            } else {
                res.status(401).send("contraseña incorrecta");
            }
        } else {
            res.status(404).send("usuario no encontrado");
        }
    } catch (error) {
        res.status(500).send("error interno del servidor", error)
    }

})





export default router;