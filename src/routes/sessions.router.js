import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";
import passport from "passport";
import generateToken from "../utils/jsonwebtoken.js";




//REGISTRO CON JWT (json web token)



router.post("/register", async (req, res) => {

    const { first_name, last_name, email, password, age } = req.body;

    try {
        const userExist = await UserModel.findOne({ email });
        //verificamos si el usuario ya existe
        if (userExist) {
            return res.send("el mail ya esta registrado");
        }

        //si no existe creamos uno nuevo
        const newUser = await UserModel.create({
            first_name,
            last_name,
            email,
            password: createHash(password),
            age
        });

        //generamos el token ahora
        const token = generateToken({
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email
        });

        res.status(201).send({ message: "usuario creado", token })
    } catch (error) {
        res.status(500).send("error fatal")
    }

})


//LOGIN con JWT:


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email });
        if (!usuario) {
            return res.send("usuario no encontrado")
        }
        if (!isValidPassword(password, usuario)) {
            return res.send("credenciales invalidas");
        }
        //si la contraseña es correcta, se genera el token
        const token = generateToken({
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            email: usuario.email,
            age: usuario.age
        })

        res.send({ message: "Logueado con éxito!", token });
    } catch (error) {
        res.status(500).send("error en el logueo")
    }
})




//Ruta para el LOGOUT 


router.get("/logout", (req, res) => {
    if (req.session.login) {
        req.session.destroy((err) => {
            if (err) {
                console.error("Error al destruir la sesión:", err);
                return res.status(500).send("Error al cerrar la sesión");
            }
            res.redirect("/login");
        });
    } else {
        res.redirect("/login");
    }
});

//VERSION PARA GITHUB:

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), (req, res) => { })

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
    //la estrategia de GitHub nos retorna el usuario, entonces lo agregamos a nuestro objeto de session:
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
})





export default router;