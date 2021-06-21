const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser')
const bcrypt = require('bcryptjs')

const path = require('path')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const User = require('./schema/imageSchema');
require('./config/db')
const multer = require('multer');
const publicDir = require('path').join(__dirname, '/public');
const { adduservalidation, slotValidation, serviceValidation, staffValidation, venueValidation } = require("./validation/validationschema")
const router = express.Router();

const getService = require('./controllers/getService')
const bookAppointment = require('./controllers/bookAppointment')
const getNextAvailableSlot = require('./controllers/getNextServiceAvailable')
const addService = require('./controllers/addService')
const addVenue = require('./controllers/addVenue')
const addStaff = require('./controllers/addStaff');
const setContact = require('./controllers/contact');
const addUser = require('./controllers/addUser');
const findUser = require('./controllers/findUser');
const changeImage = require('./controllers/changeImage');
const editProfile = require('./controllers/editProfile');
const setOtp = require('./controllers/setOtp')
const newPassword = require('./controllers/newPassowed')
const confirmPasssword = require('./controllers/confirmPassword')
const isVerified = require('./controllers/isVerified');
const appointment = require('./schema/appointment');


app.use(express.static(publicDir));
app.use(cookieParser());
app.use(express.json())
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', router);

const storage = multer.diskStorage({
    destination: "./public/images/",
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage
}).single('file')

router.post('/getService', slotValidation, getService)

router.post('/book_appointment', adduservalidation, bookAppointment)

router.post('/getNextAvailableSlot', slotValidation, getNextAvailableSlot)

router.post('/service', serviceValidation, addService)

router.post('/venue', venueValidation, addVenue)

router.post('/staff', staffValidation, addStaff)

router.post('/contact', setContact)

router.post('/add', upload, addUser)

router.post('/find', findUser)

router.post('/setOtp', setOtp)

router.post('/newPassword/:email', newPassword)

router.post('/delete/:image', upload, changeImage)

router.post('/confirmPassword/:email', confirmPasssword)

router.post("/edit", upload, authenticateToken, editProfile)

router.post('/verify/get/:email', isVerified)

const JWT_SECRET = process.env.JWT
app.get('/getService', authenticateToken, function (req, res) {
    res.render('service')
})
app.get('/showAppintment', authenticateToken, function (req, res) {
    appointment.findOne(req.user), (err, doc) => {
        console.log(doc)
    }
})

app.get('/signup', (req, res) => {
    res.render('signup');
})
app.get('/contact', authenticateToken, (req, res) => {
    res.render('contact');
})

app.get('/edit', authenticateToken, (req, res) => {
    const email = req.user
    User.findOne({ email }, (err, doc) => {
        res.render('edit', { doc });
    })
})

app.get('/', async (req, res) => {
    res.render('login')
})
app.get('/get', (req, res) => {
    const doc = ''
    res.render('givename', { doc })
})
app.post('/showAppintment', (req, res) => {
    const name = (req.body.name).toLowerCase()
    appointment.find({ name }, (err, doc) => {
        res.render('givename', { doc })
    })
})

app.get('/gallery', authenticateToken, (req, res) => {
    const email = req.user
    User.findOne({ email }, (err, doc) => {
        res.render('gallery', { doc })
    })
})

app.get('/home', authenticateToken, (req, res) => {
    const email = req.user
    User.findOne({ email }, (err, doc) => {
        res.render('home', { doc })
    })
})

app.get('/verify', (req, res) => {
    res.render('verify')
})

app.get('/forgot', (req, res) => {
    res.render('forgot')
})


app.get('/logout', (req, res) => {
    res.clearCookie('name');
    res.render('login')
})

app.get('/profile', authenticateToken, (req, res) => {
    const email = req.user
    User.findOne({ email }, (err, doc) => {
        res.render('profile', { doc })
    })
})
app.get('/delete/:name/:from', (req, res) => {
    const name = req.params.name
    const from = req.params.from
    let email = ''
    User.findOne({ name }, (err, doc) => {
        email = doc.email
    })
    appointment.findOneAndDelete({ name, from }, (err, doc) => {
        const output = `
            <h3>Your Appointment haad been canceled.</h3>
            <h3>Thank you giving us time..</h3>

          `;
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'harshitdixit65@gmail.com',
                pass: '8318090007'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        let mailOptions = {
            from: '"BarberShop " harshitdixit65@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Cancelation Mail', // Subject line
            text: name, // plain text body
            html: output // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

            res.render('service');
        });
    })
})
app.listen(process.env.PORT, (req, res) => {
    console.log(process.env.PORT)
})

function authenticateToken(req, res, next) {
    if (req.headers.cookie == null) {
        res.render('login')
    } else {
        const cookie = req.headers.cookie.split('=')
        console.log("cookie", cookie[2])
        jwt.verify(cookie[2], JWT_SECRET, (err, payload) => {
            if (err) return res.sendStatus(403)
            req.user = payload.email
            next()
        })
    }
}
