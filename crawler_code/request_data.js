const request = require('request');
const timestamp = require('../timestamp.js');

let requestData = async function(_max, symbol, chart='y'){

    return new Promise((resolve, reject) => {
        request(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json?filter=top&limit=30&max=${_max}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(response.body);
                let current_data = [];
                for (let i = 0; i < data.messages.length; i++) {
                    if (data.messages[i].entities.sentiment !== null){
                        if (chart != 'y') {
                            if (data.messages[i].entities.chart != undefined){ 
                                continue;
                            }
                        }
                        let _sentiment = data.messages[i].entities.sentiment.basic;
                        let _sentence = data.messages[i].body;
                        let _timestamp = new Date(data.messages[i].created_at).getTime();
                        current_data.push(
                            [_sentence, _timestamp, timestamp.timeConverter(_timestamp), _sentiment]
                        )
                    }
                }
                resolve(current_data);
            }
            else{
                reject();
            }
        })
    })
}

module.exports = requestData;