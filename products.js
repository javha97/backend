import { db } from './firebase.js'
import {Router} from 'express'
import { isAdmin, tokencleaner, errorhandler, isAuthenticated } from './helperfn.js'
const router=Router()
///product detail
router.route('/:id')
.get(errorhandler(async (req, res) => {
    const get = await db.collection('products').get()
    const id = req.params.id
    const myarr = []
    get.docs.filter((doc) => {
        if (doc.id === id) {
            myarr.push(doc.data())
        }
    })
    res.send(myarr)
}))
///edit product
.patch(isAdmin, errorhandler(async (req, res) => {
    const get = await db.collection('products').get()
    let arr
    get.docs.filter((doc) => {
        if (doc.id === req.params.id) {
            arr = doc.id
        }
    })
    const data = req.query
    db.collection('products').doc(req.params.id).set(data, { merge: true })
    const mydata = await db.collection('products').doc(arr).get()
    res.send(mydata.data())
}))
///delete product
.delete(isAdmin, async (req, res) => {
    const get = await db.collection('products').get()
    let arr
    get.forEach((doc) => {
        if (doc.id === req.params.id) {
            arr = (doc.id)
        }
    });
    db.collection('products').doc(arr).delete()
    res.send('successfully deleted')
})
export default router