function timeConverter(UNIX_timestamp){  
    var a = new Date(UNIX_timestamp);
    var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    var year = a.getFullYear(), month = months[a.getMonth()], date = a.getDate(),
    date = a.getDate(), hour = a.getHours(), min = a.getMinutes(), sec = a.getSeconds();
    if (date < 10){
      date = "0" + date;
    }
    if (sec < 10){
      sec = "0" + sec;
    }
    if (hour < 10){
      hour = "0" + hour;
    }
    if (min < 10){
      min = "0" + min;
    }
    return year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
}

module.exports = { 
    timeConverter
};