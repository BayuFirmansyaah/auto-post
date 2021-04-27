const fs = require('fs')
const folderPath = 'files/coba3'

let data = fs.readdirSync(folderPath)
for(let i=1;i<=data.length;i++){
    d=i-1;
    console.log(data[d]);
}


