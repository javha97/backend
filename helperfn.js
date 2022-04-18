
import { db } from "./firebase.js"
export const time = (new Date).getTime() / 1000
////token cleaner
export const tokencleaner = async (req, res, next) => {
    const docs = await db.collection('token').get()
    docs.forEach((doc) => {
        try {
            if (doc.data().expiredate.seconds <= time) {
                db.collection('token').doc(doc.id).delete()
            }
        }
        catch (e) {
            next()
        }
    })
    next()
}
/////errorhandler
export const errorhandler = (fn) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next)
        } catch (e) {
            next()
        }
    }
}
export const isAdmin = async (req, res, next) => {
    const { uname } = req.headers
    const mydoc = await db.collection('users').doc(uname).get()
    try {
        if (mydoc.data().isAdmin) {
            next()
        } else {
            res.status(403).send('lmao')
        }
    } catch (e) {
        next()
    }
}
////isAuthenticated
export const isAuthenticated = async (req, res, next) => {
    const mytoken = req.headers.token
    const docs = await db.collection('token').doc(mytoken).get()
    if (docs === undefined) {
        return res.send([])
    }
    try {
        if (docs.data().expiredate.seconds <= time) {
            return res.status(403).send([]);
        }
    }
    catch (e) {
        next()
    }
}