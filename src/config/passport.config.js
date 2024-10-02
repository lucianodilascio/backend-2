// PASSPORT: middleware de autenticación, que permite implementar fácilmente diferentes estrategias de autenticación(por ejemplo: autenticacion local, con redes sociales, etc)
import passport from "passport";
import local from "passport-local";

//traemos UserModel y las funciones de Bcrypt:
import UserModel from "../dao/models/user.model.js";
import { createHash, isValidPassword } from "../utils/util.js";

//trabajamos con GITHUB:
import GitHubStrategy from "passport-github2";
///////////////////////////////////////////////////


const LocalStrategy = local.Strategy;

const initializePassport = () => {
    passport.use("register", new LocalStrategy({

        //primero le digo que quiero tener acceso al objeto request
        passReqToCallback: true,
        //le decimos que el campo de usuario (en nuestro caso), es el email
        usernameField: "email",
    }, async (req, username, password, done) => {

        const { first_name, last_name, email, age } = req.body;

        try {
            //verificamos si ya existe un registro con ese email
            let user = await UserModel.findOne({ email });

            if (user) return done(null, false);

            //pero si no existe, creamos un registro de usuario nuevo:
            let newUser = {
                first_name,
                last_name,
                email,
                age,
                password: createHash(password)
            }

            let result = await UserModel.create(newUser);
            // y si todo resulta bien, mandamos el DONE con el usuario generado.
            return done(null, result);
        } catch (error) {
            return done(error);
        }

    }));

    //estrategia para el LOGIN:


    passport.use("login", new LocalStrategy({
        usernameField: "email"
    }, async (email, password, done) => {

        try {
            //primero se verifica si existe usuario con ese email
            const user = await UserModel.findOne({ email });
            if (!user) {
                console.log("el usuario ingresado no existe");
                return done(null, false);
            }
            if (!isValidPassword(password, user)) return done(null, false);
            return done(null, user);


        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    })

    passport.deserializeUser(async (id, done) => {
        let user = await UserModel.findById({ _id: id });
        done(null, user);
    })

    //ESTRATEGIA con GITHUB

    passport.use("github", new GitHubStrategy({
        clientID: "Iv23liYehDScM0DW7sjD",
        clientSecret: "2c7d36533dbc55a8ca9a60906f2b1b3fc6befb59",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
    }, async (accessToken, refreshToken, profile, done) => {
        //se recomienda mostrar el perfil por consola, para saber que datos me estan llegando:
        console.log("Profile", profile);

        try {
            let user = await UserModel.findOne({ email: profile._json.email })

            if (!user) {
                let newUser = {
                    first_name: profile._json.name,
                    last_name: "",
                    age: 37,
                    email: profile._json.email,
                    password: ""
                }

                let result = await UserModel.create(newUser);
                done(null, result);

            } else {
                done(null, user);
            }
        } catch (error) {
            return done(error);
        }


    }))




}

export default initializePassport;