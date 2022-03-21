let timeString = '2021-12-23 12:10:23' //taiwan時間
/*
const moment = require ('moment');
const tz = require('moment-timezone');
let timeString = '2021-12-23 12:10:23' //taiwan時間
let timezone = "America/New_York";
let new_york_time = moment(timeString,'YYYY-MM-DD hh:mm:ss').tz(timezone).format('YYYY-MM-DD hh:mm:ss'); //美國時間
console.log(new_york_time)
*/
//let timeString = data.messages[i].created_at;
let _timestamp = new Date(timeString).getTime(); // GMT + 0 
console.log(new Date(timeString))
console.log(_timestamp)