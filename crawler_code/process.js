const path = require('path');

let processing = async function(_max, symbol, num_of_api_call, num_of_one_file, chart){
    return new Promise(async (resolve, reject) => {
        let set = [];
        let first_date;
        let i = 0;
        for (;;){
            try{
                let current = await requestData(_max, symbol, chart);
                if (i==0){
                    first_date = current[0][2].split(" ")[0];
                    i++;
                }
                for (let i = 0; i < current.length; i++){
                    set.push(current[i])
                }
    
                _max += num_of_api_call;
                
                console.log(`Current Length: ${current.length}`)
                console.log(`Set Length: ${set.length}`)  
                current_date = current[0][2].split(" ")[0];

                if (set.length >= num_of_one_file) {
                    break;
                }
                if (first_date!=current_date){
                    break;
                }
            }
            catch(e){
                //reject(e);
            }
            //first_date = current[0][2].split(" ")[0];
        }
        // 清除重複之Data
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

        first_date = first_date.replaceAll('/', '_');
        let symbol_dir = path.join(__dirname, datasets, symbol);
        // 如果資料夾不存在, 則create
        if (!fs.existsSync(symbol_dir)) {
            // Do something
            fs.mkdirSync(symbol_dir);
        }
        let year_dir = path.join(symbol_dir, YEAR)
        if (year_dir) {
            // 如果資料夾不存在, 則create
            if (!fs.existsSync(year_dir)) {
                // Do something
                fs.mkdirSync(year_dir);
            }
        }
        let dir = path.join(year_dir, first_date)
        if (first_date) {
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