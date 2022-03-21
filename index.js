let x = [ 1, 2 ,3 ]

let y = [ 1, 2 ,3 ]

let set = new Set()

set.add(x)
set.add(y)
let arr = Array.from(set);

function remove_duplicates(arr) {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
        obj[arr[i]] = true;
    }
    for (var key in obj) {
        ret_arr.push(key);
    }
    return ret_arr;
}
arr = [remove_duplicates(arr)]

console.log(arr)