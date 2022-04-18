import {Router} from 'express'
import { isAdmin, tokencleaner, errorhandler, isAuthenticated } from './helperfn.js'
import { db } from './firebase.js'
import crypto from 'crypto'
const router=Router()
////login
router.post('/login', tokencleaner, errorhandler(async (req, res) => {
    const { username, password } = req.headers
    const data = await db.collection('users').doc(username).get()
    if (data.data() === undefined) {
        return res.status(400).send('Wrong password or username!')
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (hash !== data.data().password) {
        return res.status(400).send('Wrong password!')
    }
    const token = crypto.randomUUID()
    db.collection('token').doc(token).set({
        user: data.id,
        expiredate: new Date(Date.now() + 10 * 60 * 1000),
    })
    res.status(200).send([token, hash])
}))
///register
router.post('/register', async (req, res) => {
    const { username, password } = req.headers
    const data = await db.collection('users').doc(username).get()
    if (data.data() !== undefined) {
        return res.send('This username exists')
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    await db.collection('users').doc(username).set({ password: hashedPassword })
    res.send('Created your account')
})
export default router