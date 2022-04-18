import { Router } from 'express'
import { isAdmin, errorhandler} from './helperfn.js'
import { db } from './firebase.js'
const router = Router()
///get products by using categoryId
router.get('/category/:categoryId', errorhandler(async (req, res) => {
    let myarr = []
    const get = await db.collection('products').get()
    get.docs.map((doc) => {
        myarr.push({ id: doc.id, ...doc.data() })
    })
    let arr = []
    for (let el of myarr) {
        if (el.categoryId.includes(req.params.categoryId)) {
            arr.push(el)
        }
    }
    res.send(arr)
}))

router.post('/category', isAdmin, errorhandler(async (req, res) => {
    await db.collection('category').add(req.body.params)
    res.send('created')
}))
export default router