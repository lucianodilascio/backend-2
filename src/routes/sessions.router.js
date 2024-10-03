import { Router } from "express";
const router = Router();
import UserModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";
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
        const token = jwt.sign({user: { first_name: newUser.first_name, last_name: newUser.last_name, age: newUser.age, email: newUser.email }} , "coderhouse", { expiresIn: "2h"});

        //creamos la cookie

        res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

        res.redirect("current");
    } catch (error) {
        res.status(500).send("error fatal")
    }

})


//PROFILE con JWT:


router.get("/current", passport.authenticate("current", {session: false}), (req, res) => {

    res.render("profile", {user: req.user.user});

});






//LOGIN con JWT:


router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await UserModel.findOne({ email });
        if (!usuario) {
            return res.status(401).send("Usuario no identificado");
        }
        if (!isValidPassword(password, usuario)) {
            return res.status(401).send("credenciales invalidas");
        }
        //generamos el token ahora
        const token = jwt.sign({user: { first_name: usuario.first_name, last_name: usuario.last_name, age: usuario.age, email: usuario.email }} , "coderhouse", { expiresIn: "2h"});

        //creamos la cookie

        res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

        res.redirect("current");
    } catch (error) {
        res.status(500).send("error en el logueo")
    }
})




//Ruta para el LOGOUT 


router.post("/logout", (req, res) => {

    res.clearCookie("cookieTokenJc");
    res.redirect("/login");

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