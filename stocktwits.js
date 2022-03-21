const request = require('request');
const { stringify } = require('csv-stringify')
const timestamp = require('./timestamp.js');
const args = require('minimist')(process.argv.slice(2))
//const path = require('path')
const fs = require('fs');
const { Console } = require('console');
const columns = {
    Sentence: 'Sentence',
    Timestamp: 'Timestamp',
    DateTime: 'DateTime',
    Sentiment: 'Sentiment'
};

String.prototype.replaceAll = function(s1,s2){ 
    return this.replace(new RegExp(s1,"gm"),s2); 
}

const YEAR = args["year"] || "Default"
let requestData = async function(_max, symbol, chart='y'){
    return new Promise((resolve, reject) => {
        //https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json?filter=top&limit=30&max=${_max}
        request(`https://api.stocktwits.com/api/2/streams/symbol/${symbol}.json?filter=top&limit=30&max=${_max}`, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = JSON.parse(response.body);
                let current_data = [];
                for (let i = 0; i < data.messages.length; i++) {
                    if (data.messages[i].entities.sentiment !== null){
                        if (chart != 'y') { //如果不需要有chart的留言
                            //chart如果不等於undefined，直接continue
                            if (data.messages[i].entities.chart != undefined){ 
                                continue;
                            }
                        }
                        let _sentiment = data.messages[i].entities.sentiment.basic;
                        let _sentence = data.messages[i].body;
                        // 瀏覽器為GMT+0
                        // 程式已經加上8小時
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

let processing = async function(_max, symbol, num_of_api_call, num_of_one_file, chart){
    return new Promise(async (resolve, reject) => {
        let set = []
        let fitst_date;
        let i = 0;
        for (;;){
            try{
                let current = await requestData(_max, symbol, chart);
                if (i==0){
                    fitst_date = current[0][2].split(" ")[0];
                    i++;
                }
                for (let i = 0; i < current.length; i++){
                    set.push(current[i])
                }
    
                _max+=num_of_api_call;
                console.log(`Current Length: ${current.length}`)
                console.log(`Set Length: ${set.length}`)  
                current_date = current[0][2].split(" ")[0];
                if (set.length >= num_of_one_file) {
                    break;
                }
                if (fitst_date!=current_date){
                    break;
                }
            }
            catch(e){
                console.log('Rejected')
                //reject(e);
            }
            //fitst_date = current[0][2].split(" ")[0];
        }
        let arr = Array.from(set);
        console.log('正在刪除重複之Data...');
        //刪除sentence重複的arr
        for (let i = arr.length-1; i >= 1; i--){
            for (let j = i-1; j >= 0; j--){
                try{
                    if (arr[i][0] == arr[j][0] && arr[i][1] == arr[j][1]){
                        arr.splice(j, 1)
                        console.log('Remove a deplicated data.')
                    }
                }
                catch(e){
                    //console.log('remove error')
                }
            }
        }
        fitst_date = fitst_date.replaceAll('/', '_');
        let symbol_dir = `./datasets/${symbol}`;
        // 如果資料夾不存在, 則create
        if (!fs.existsSync(symbol_dir)) {
            // Do something
            fs.mkdirSync(symbol_dir);
        }
        let year_dir = symbol_dir +"/"+YEAR
        if (year_dir) {
            // 如果資料夾不存在, 則create
            if (!fs.existsSync(year_dir)) {
                // Do something
                fs.mkdirSync(year_dir);
            }
        }
        let dir = `./datasets/${symbol}/${YEAR}/${fitst_date}`;
        if (fitst_date) {
            // 如果資料夾不存在, 則create
            if (!fs.existsSync(dir)) {
                // Do something
                fs.mkdirSync(dir);
            }
        }
        let FILE_NAME = `${dir}/${new Date().getTime()}.csv`
        stringify(arr, { header: true, columns: columns }, (err, output) => {
            if (err) throw err;
            fs.writeFile(FILE_NAME, output, (err) => {
                if (err) throw err;
                console.log(`${FILE_NAME} saved.`);
                resolve(_max)
            });
        });
    })
};

let main = async () => {
    let max;
    // 20200313: "200133000"
    const CHART = args["chart"] || "y"; //是否要爬取有chart的留言
    const SYMBOL = args['symbol'] || "SPY";
    const SEASON = args["season"] || "summer";
    const NUM_OF_API_CALL = args["num_call"] || 500; // spy 500
    const NUM_OF_ONE_FILE = args["num_per_file"] || 5000; // 200 per file

    // To find the max
    fs.readFile(`${SYMBOL}.txt`, async function(err, data) {
        max = args["max"] || parseInt(data.toString())
        console.log("Current Max:", max);
        for (let i = 0; i < 500000; i++) {
            max = await processing(max, SYMBOL, NUM_OF_API_CALL, NUM_OF_ONE_FILE, CHART) + NUM_OF_API_CALL;
            
            fs.writeFile(`${SYMBOL}.txt`, max+"", (err) => {
                if (err) throw err;
                else console.log('Save Max Record.')
            })
            console.log('Current Max: ' + max);
        }
    })
}
main()