const express = require("express");
const https = require("https");
const ejs = require('ejs');
const sgMail = require("@sendgrid/mail");
const { Http2ServerRequest } = require("http2");
const { response } = require("express");
require("dotenv").config();

const app = express();

//Middleware 
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;

//Method for setting the sendgrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const weatherApiEndpoints = "https://api.openweathermap.org/data/2.5/weather";

let userCityName = "guwahati";
let weatherData = {
    weather: [{
        main: "",
        description: "",
        icon: "",
    }],
    main: {
        temp: "",
        feels_like: "",
    },
    wind: {
        speed: "",
    },
};

app.get('/', (req, res) => {
    res.render('homepage.ejs', { userConfirmation: "" });
});

app.post('/', (req, res) => {
    userCityName = req.body.cityName;
    res.redirect('/forecast');
});

app.get('/weather/:lat/:long', (req, res) => {

    console.log(req.params);
    const latitude = (req.params.lat);
    const longitude = (req.params.long);
    const parameters = `?lat=${latitude}&lon=${longitude}&units=metric&appid=`;
    const url = weatherApiEndpoints + parameters + WEATHER_API_KEY;
    https.get(url, (response) => {
        console.log("Weather route response_code: " + response.statusCode);
        response.on('data', (data) => {
            weatherData = JSON.parse(data);
          //  console.log(weatherData);
            const icon = weatherData.weather[0].icon;
            let imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            res.render('forecast.ejs', {
                userConfirmation: "", weatherIcon: imageUrl, location: weatherData.name,
                temp: weatherData.main.temp, description: weatherData.weather[0].description,
                feelsLike: weatherData.main.feels_like, humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed
            });
        });
    }).on('error', (error) => {
        console.log("Latitude & Longitude route Error: " + error);
        res.render('homepage.ejs', { userConfirmation: "apierror" });
    });
});


app.get('/forecast', (req, res) => {

    const parameters = `?q=${userCityName}&units=metric&appid=`;
    const url = weatherApiEndpoints + parameters + WEATHER_API_KEY;
    https.get(url, (response) => {
        console.log("Forecast route response_code: " + response.statusCode);
        userCityName = "guwahati";
        if (response.statusCode === 404) {
            const icon = weatherData.weather[0].icon;
            const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            res.render('forecast.ejs', {
                userConfirmation: "invalidCityName", weatherIcon: imageUrl, location: weatherData.name,
                temp: weatherData.main.temp, description: weatherData.weather[0].description,
                feelsLike: weatherData.main.feels_like, humidity: weatherData.main.humidity,
                windSpeed: weatherData.wind.speed
            });

        } else {
            response.on('data', (data) => {
                weatherData = JSON.parse(data);
             //   console.log(weatherData);
                const icon = weatherData.weather[0].icon;
                const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                res.render('forecast.ejs', {
                    userConfirmation: "", weatherIcon: imageUrl, location: weatherData.name,
                    temp: weatherData.main.temp, description: weatherData.weather[0].description,
                    feelsLike: weatherData.main.feels_like, humidity: weatherData.main.humidity,
                    windSpeed: weatherData.wind.speed
                });
            });
        }
    }).on("error", (error) => {
        console.log("forecast route error: " + error);
        res.render('homepage.ejs', { userConfirmation: "apierror" });
    });
});


app.get("/subscribe", (req, res) => {
    res.render("subscribe.ejs", { userConfirmation: "" });
});

app.post("/subscribe", (req, res) => {
    const formData = { fName, lName, email } = req.body;
    //console.log(formData.email,formData.fName,formData.lName); 
    let subscribeData = {
        members: [{
            email_address: formData.email,
            status: "subscribed",
            merge_fields: {
                FNAME: formData.fName,
                LNAME: formData.lName,
            },
        }],
        update_existing: true,
    };
    subscribeData = JSON.stringify(subscribeData);

    const option = {
        method: "POST",
        auth: `rose:${process.env.MAILCHIMP_API_kEY}`,
    }

    const url = "https://us1.api.mailchimp.com/3.0/lists/40295ff556";
    const request = https.request(url, option, (response) => {
        response.on("data", (data) => {
            const newData = JSON.parse(data);
            if (newData.error_count >= 1) {
                console.log(JSON.parse(data));
                res.render("subscribe.ejs", { userConfirmation: "wrong" });

            } else {
                console.log("Data send to mailchimp API.");
                res.render('subscribe.ejs', { userConfirmation: "subscribed" });
            }
        });
    });

    request.on('error', (e) => {
        console.error(e);
    });

    request.write(subscribeData);
    request.end();
});


app.get('/contact', (req, res) => {
    res.render('contact.ejs', { userConfirmation: "" });
});

app.post('/contact', (req, res) => {

    const formData = { userName, userEmail, text } = req.body;
    // console.log(formData.userName, formData.userEmail, formData.text);
    const message = {
        to: "roseahmed2019@outlook.com",
        from: "roseahmed2013@gmail.com",
        subject: "SendGrid API",
        text: "This Message is Send through sendGrid API",
        html: `<h1 style='color:blue'>From: ${formData.userName}</h1>
            <h2 style='color: green'>Email: ${formData.userEmail}<h2>
            <h3>Message:<p>${formData.text}</p></h3>`,
    };

    //Method for sending Mail through sendGrid API
    sgMail.send(message, (err) => {
        if (err) {
            console.log(err);
            res.render('contact.ejs', { userConfirmation: "unsuccessfull" });
        } else {
            console.log('send successfull');
            res.render('contact.ejs', { userConfirmation: "successfull" });
        }
    });

});

app.get("/about", (req, res) => {
    res.render('about.ejs');
});

//Invalid route
app.get('*', (req, res) => {
    res.send("404 No Page Found");
});

app.listen(port, function () {
    console.log(`Server started at port:${port}`);
});