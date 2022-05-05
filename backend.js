import express from 'express'
import { db } from './firebase.js'
import fs from 'fs'
import bodyParser from 'body-parser'
import cors from 'cors'
import { isAdmin, tokencleaner, errorhandler } from './helperfn.js'
import products from './products.js'
import login from './login.js'
import category from './category.js'
const app = express()
const port = 8080;
app.use(express.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true, parameterLimit: 1000000, limit: "500mb" }))
app.use('/products', products)
app.use("/", login)
app.use("/", category)
app.use(express.static('public'));
///create product  
app.post('/products', tokencleaner, isAdmin, errorhandler(async (req, res) => {
    const data = req.query;
    console.log(data);
    const base64 = req.body.body.img
    const myrandom = Math.random() * 1000
    const myimg = base64.split('base64,').pop('')
    const replace = myimg.replace(/ /g, '+');
    const imgaebuffer = new Buffer.from(replace, 'base64')
    if (!base64) return res.send('no img')
    fs.writeFileSync(`public/${myrandom}.jpeg`, imgaebuffer)
    let value = Object.values(data)
    value.forEach((el) => {
        if (!el) {
            return res.send([])
        }
    })
    const docRef = await db.collection('products').add({
        img: myrandom,
        ...data
    })
    res.send({
        id: docRef.id,
        img: myrandom,
        ...data
    })
}))
//get all products
app.get('/', async (req, res) => {
    const data = await db.collection('products').get()
    let myspecialarr = []
    data.forEach((doc) => {
        myspecialarr.push({
            id: doc.id,
            image: `http://localhost:8080/${doc.data().img}.jpeg`,
            ...doc.data()
        })
    })
    res.send(myspecialarr)
})

app.listen(port, () => {
    console.log('lmao');
})
app.use('*', (req, res) => {
    res.status(404).send('Page not found')
})