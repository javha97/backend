const express = require('express')
const db = require('./firebase')
const cors = require('cors')
const app = express()
const port = 8080;
app.use(express.json())
app.use(cors())
///create product  
app.post('/products', async (req, res) => {
    const data = req.query;
    const docRef = await db.collection('products').add(data)
    console.log(data);
    res.send({
        id: docRef.id,
        ...data
    })
})

//get all products
app.get('/', async (req, res) => {
    const data = await db.collection('products').get()
    let arr = []
    data.forEach((doc) => {
        arr.push({id:doc.id, ...doc.data()})
    })
    console.log(arr);
    res.send(arr)
})
///product detail
app.get('/products/:id', async (req, res) => {
    const get = await db.collection('products').get()
    const id = req.params.id
    const myarr = []
    get.docs.filter((doc) => {
        if (doc.id === id) {
            myarr.push(doc.data())
        }
    })
    res.send(myarr)
})
///get products by using categoryId
app.get('/category/:categoryId', async (req, res) => {
    const get = await db.collection('products').get()
    const data = get.docs.map((doc) => doc.data())
    const filter = data.filter((el) => {
        return req.params.categoryId === el.categoryId
    })
    res.send(filter)
})
///edit product
app.patch('/products/:id', async (req, res) => {
    const get = await db.collection('products').get()
    let arr
    get.docs.filter((doc) => {
        if (doc.id === req.params.id) {
            arr = doc.id
        }
    })
    const data = req.query
    db.collection('products').doc(req.params.id).set(data, { merge: true })
    console.log(arr);
    const mydata = await db.collection('products').doc(arr).get()
    res.send(mydata.data())
})
///delete product
app.delete('/products/:id', async (req, res) => {
    const get = await db.collection('products').get()
    let arr
    get.forEach((doc) => {
        if (doc.id === req.params.id) {
            arr = (doc.id)
        }
    });
    console.log(arr);
    db.collection('products').doc(arr).delete()
    res.send('successfully deleted')
})
app.post('/category', async (req, res) => {
    db.collection('category').add(req.query)
    res.send('created')
})
app.listen(port, () => {
    console.log('lmao');
})
