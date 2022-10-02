#!/usr/bin/env node
import minimist from 'minimist';
import moment from 'moment-timezone';
import fetch from 'node-fetch';


//******************************** Create the help text********************************************

const args = minimist(process.argv.slice(2))  // remove first two items, get command line action

if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
                 -h            Show this help message and exit.
                 -n, -s        Latitude: N positive; S negative.
                 -e, -w        Longitude: E positive; W negative.
                 -z            Time zone: uses tz.guess() from moment-timezone by default.
                 -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
                 -j            Echo pretty JSON from open-meteo API and exit.`)
}

//**************************************************************************************************


//*********** Retrieve Latitude, Longitude, Timezone to retrieve weather from user input ***********

var latitude = 0.0
var longitude = 0.0;
var timezone = moment.tz.guess();

if (args.n) {
    latitude = args.n
} else if (args.s) {
    latitude = -args.s
}

if (args.e) {
    longitude = args.e
} else if (args.w) {
    longitude = -args.w
}

if (args.z) {
    timezone = args.z
}

//**************************************************************************************************


//***************************************** URL ****************************************************

let url = 'https://api.open-meteo.com/v1/forecast?' + 'latitude=' + latitude + '&longitude=' + longitude + '&timezone=' + timezone + '&daily=precipitation_hours'

// Make a request
const response = await fetch(url)

// Get the data from the request
const data = await response.json()

//**************************************************************************************************


//******************* Create the response text using conditional statements. ***********************

var days = 1
days = args.d

var precipitation = data.daily.precipitation_hours[days]
var when
var output

if (days == 0) {
    when = 'today.'
} else if (days > 1) {
    when = 'in ' + days + ' days.'
} else {
    when = 'tomorrow.'
}


if (args.j) {
    console.log(data)
} else {

    if (precipitation > 0) {
        output = 'You will need galoshes ' + when
    } else {
        output = 'You will not need galoshes ' + when
    }
    
    console.log(output)
}

//**************************************************************************************************