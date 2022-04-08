const express = require('express')
const db = require('./firebase')
const cors=require('cors')
const app = express()
const port = 8080;
app.use(express.json())
app.use(cors())
///add product  
app.post('/products', async (req, res) => {
    const data = req.query;
    db.collection('products').add(data)
    console.log(data);
    res.send('created')
})

app.get('/', async (req, res) => {
    const data = await db.collection('products').get()
    const products = data.docs.map((doc) => doc.data())
    res.send(products)
})
///product detail
app.get('/products:id', async (req, res) => {
    const get = await db.collection('products').get()
    const id = Object.values(req.params)
    const data = get.docs.map((doc) => doc.data())
    console.log(data);
    const myid = data.filter((el) => {
        return id[0] === el.id
    })

    res.send(myid)
})
///catch products by using categoryId
app.get('/category:categoryId', async (req, res) => {
    const get = await db.collection('products').get()
    const data = get.docs.map((doc) => doc.data())
    const filter = data.filter((el) => {
        return req.params.categoryId === el.categoryId
    })
    res.send(filter)
})
app.patch('/products:id',async(req,res)=>{
    const get=await db.collection('products').get()
    const data=get.docs.map((doc)=>doc.data())
    const filter=data.filter((el)=>{
        return req.params.id===el.id
    })
    console.log(filter);
    res.send('successfully deleted')
})
///delete product
app.delete('/products:id', async (req, res) => {
    const get = await db.collection('products').get()
    let arr = []
    const mydata = get.forEach((el) => {
        return arr.push({ data: el.data(), id: el.id })
    });
    const filtered = arr.filter((el) => {
        return req.params.id === el.data.id
    })
    db.collection('products').doc(filtered[0].id).delete()
    res.send('successfully deleted')
})
app.post('/category',async(req,res)=>{
    db.collection('category').add(req.query)
    res.send('created')
})
app.listen(port, () => {
    console.log('lmao');
})
