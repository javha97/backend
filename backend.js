const express = require('express')
const crypto = require('crypto')
const db = require('./firebase')
const cors = require('cors')
const app = express()
const port = 8080;
const fs = require('fs')
app.use(express.json())
app.use(cors())
const time = (new Date).getTime() / 1000
////token cleaner
const tokencleaner = async (req, res, next) => {
    const docs = await db.collection('token').get()
    docs.forEach((doc) => {
        if (doc.expiredate <= time) {
            db.collection('token').doc(doc).delete()
        }
    })
    next()
}

/////errorhandler
const errorhandler = (fn) => {
    return async (req, res, next) => {
        try {
            return await fn(req, res, next)
        } catch (e) {
            next()
        }
    }
}

////isAuthenticated
const isAuthenticated = async (req, res, next) => {
    const mytoken = req.headers.token
    const docs = await db.collection('token').doc(mytoken).get()
    if (docs === undefined) {
        return res.send([])
    }
    if (docs.data().expiredate.seconds <= time) {
        return res.status(403).send([]);
    }
    next()
}
////login
app.post('/login', tokencleaner, errorhandler(async (req, res) => {
    const { username, password } = req.headers
    const data = await db.collection('users').doc(username).get()
    if (data.data() === undefined) {
        return res.send('Wrong password or username!')
    }
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (hash !== data.data().password) {
        return res.send('Wrong password!')
    }
    const token = crypto.randomUUID()
    db.collection('token').doc(token).set({
        user: data.id,
        expiredate: new Date(Date.now() + 5 * 60 * 1000),
    })
    console.log(token);
    res.status(200).send(token)
}))
///register
app.post('/register', async (req, res) => {
    const { username, password } = req.headers
    const data = await db.collection('users').doc(username).get()
    if (data.data() !== undefined) {
        return res.send('This username exists')
    }
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    await db.collection('users').doc(username).set({ password: hashedPassword })
    res.send('Created your account')
})

///create product  
app.post('/products', isAuthenticated, errorhandler(async (req, res) => {
    const data = req.query;
    console.log(data);
   const a= (data.img).split(' ').join('')
   console.log(a);
    let value = Object.values(data)
    value.forEach((el) => {
        if (!el) {
            return res.send([])
        }
    })
    const docRef = await db.collection('products').add(data)
    res.send({
        id: docRef.id,
        ...data
    })
    res.send('m')
}))
//get all products
app.get('/', async (req, res) => {
    const data = await db.collection('products').get()
    let arr = []
    data.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() })
    })
    res.send(arr)
})
///product detail
app.get('/products/:id', errorhandler(async (req, res) => {
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
///get products by using categoryId
app.get('/category/:categoryId', errorhandler(async (req, res) => {
    console.log(req.params.categoryId);
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
///edit product
app.patch('/products/:id', errorhandler(async (req, res) => {
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
}))
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
app.post('/category', errorhandler(async (req, res) => {
    await db.collection('category').add(req.body.params)
    res.send('created')
}))
app.listen(port, () => {
    console.log('lmao');
})
app.use('*', (req, res) => {
    res.status(404).send('Page not found')
})