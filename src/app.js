const path = require('path');
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const public_directory_path = path.join(__dirname, '../public')
const views_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', views_path)
hbs.registerPartials(partials_path)

// Setup static directory to serve
app.use(express.static(public_directory_path))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Raz Lapid'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Raz Lapid'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        help_text: 'Help!!!',
        title: 'Help',
        name: 'Raz Lapid'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => {
        if (error) {
            return res.send({
                error
            })
        } 
        forecast(latitude, longtitude, (error, forecast_data) => {
            if (error) {
                return res.send({
                    error
                })
            }
            res.send({
                forecast: forecast_data,
                location,
                address: req.query.address
            })
        })
    })

})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    
    console.log(req.query.search)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Raz Lapid',
        error_message: 'Help article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404',{
        title: '404',
        name: 'Raz Lapid',
        error_message: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})