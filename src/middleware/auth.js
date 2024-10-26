export function onlyAdmin(req, res, next) {
    if (req.user.role === "admin") {
        next();
    } else {
        res.status(403).send("acceso denegado, acceso solo para admins")
    }
}


export function onlyUser(req, res, next) {
if(req.user.role === "user") {
    next();
} else {
    res.status(403).send("acceso denegado, acceso solo para usuarios")
}
}