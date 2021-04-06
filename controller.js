const importExcel = require('convert-excel-to-json');
const mysql = require('mysql')
const del = require('del');
const { json, response } = require('express');
let fs = require('fs');
const puppeteer = require('puppeteer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { send } = require('process');
const { get } = require('http');
const salt = bcrypt.genSaltSync(10);
let onRun = 0;

var DB_HOST = "localhost";
var DB_USER = "root";
var DB_PASSWORD = "";
var DB_NAME = "autopost";

var db = mysql.createConnection({
    connectionLimit: 10,
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME

});

db.connect(function(err) {
    if (err) console.log(err);
    console.log("link webiste : http://localhost:3000");
})


// merubah fitur pause/play/stop
exports.isRun = function(value) {
    onRun = value;
}

// melakukan convert data akun dari excel ke json
exports.convertAccount = function(req, res) {
    // mendapatkan file
    let file = req.files.filename;
    let filename = file.name;
    file.mv('./excel/' + filename, (err) => {
        if (err) {
            res.send('maaf file tidak bisa diupload ');
        } else {
            let result = importExcel({
                sourceFile: './excel/' + filename
            });

            let dataAccount = result.Sheet1;
            for (let i = 0; i < dataAccount.length; i++) {
                db.query("INSERT INTO facebook (id_user,username,password) values(?,?,?)", [req.body.id, dataAccount[i].A, dataAccount[i].B],
                    function(err, row, field) {
                        if (err) {
                            console.log(err)
                        }
                    })
            }
            del(['excel/' + filename]).then(paths => { console.log('file berhasil dihapus') });
            res.end();
        }
    });
}

// add data akun facebook manual
exports.addAccount = function(req, res) {
    db.query("INSERT INTO facebook (id_user,username,password) VALUES(?,?,?)",[req.body.id,req.body.username,req.body.password],
        function(err,rows){
            if(err){
                console.log(err);
            }else{
                res.redirect('/google.html');
                res.end();
            }
    });
}

// add data akun user
exports.addAccountUser = function (req, res) {
    let email = req.body.username;
    let password = bcrypt.hashSync(req.body.password, salt);
    if(req.body.level == 'admin'){
        db.query("INSERT INTO akun (nama,password,level) VALUES(?,?,?)", [email, password,"level"],
            function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                     res.redirect('/indexing.html');
                    res.end();
                }
        });
    }else{
        res.redirect('/indexing.html');
        res.end();
    }
    
}

// melakukan convert data akun dari excel ke json
exports.convertDataItem = function(req, res) {
    // mendapatkan file
    let file = req.files.filename;
    let filename = file.name;
    file.mv('./excel/' + filename, (err) => {
        if (err) {
            res.send('maaf file tidak bisa diupload ');
        } else {
            let result = importExcel({
                sourceFile: './excel/' + filename
            });

            let dataItem = result.Sheet1;
            console.log(dataItem);
            for (let i = 0; i < dataItem.length; i++) {
                db.query("INSERT INTO item (id_user,account,kode,judul,kategori,deskripsi,gambar) values(?,?,?,?,?,?,?)", [req.body.id, dataItem[i].A, dataItem[i].B, dataItem[i].C, dataItem[i].D, dataItem[i].E, dataItem[i].F],
                    function(err, row, field) {
                        if (err) {
                            console.log(err)

                        }
                        console.log("Data Berhasil ditambahkan ke database");
                    })
            }

            del(['excel/' + filename]).then(paths => { console.log('file berhasil dihapus') });
            res.end();
        }
    });
}


// mendapatkan data account
exports.getDataAccount = function(res, req) {
    db.query("select * from facebook where id_user=?", [req.params.id_user], function(err, rows, fields) {
        if (err) {
            console.log(err);
        }
        let data = {
            Search: rows,
            status: 200
        }
        res.json(data);
        res.end();
    })
}

// mendapatkan data item
exports.getDataItem = function(res, req) {
    db.query("select * from item where id_user=?", [req.params.id_user], function(err, rows, fields) {
        if (err) {
            console.log(err);
        }
        let data = {
            Search: rows,
            status: 200
        }
        res.json(data);
        res.end();
    })
}


// menghapus akun
exports.hapusAkun = function(req, res) {
    db.query("DELETE FROM facebook WHERE id=?", [req.params.id], function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Data Berhasil Di Hapus");
            res.end()
        }
    })
}


// hapus semua akun
exports.hapusSemuaAkun = function(req, res) {
    db.query("DELETE FROM facebook WHERE id_user=?", [req.params.id_user], function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Data Berhasil Di Hapus");
            res.end();
        }
    })
}

// menghapus barang
exports.hapusBarang = function(req, res) {
    db.query("DELETE FROM item WHERE id_barang=?", [req.params.id], function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Data Berhasil Di Hapus");
            res.end()
        }
    })

}


// menghapus semua barang
exports.hapusSemuaBarang = function(req, res) {
    db.query("DELETE FROM item WHERE id_user=?", [req.params.id_user], function(err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Data Berhasil Di Hapus");
            res.end();
        }
    })
}

//melakukan register
exports.register = function(req, res) {
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, salt);
    db.query("INSERT INTO akun (nama,password,level) VALUES(?,?,?)", [email, password, 'user'],
        function(err, rows, fields) {
            if (err) {
                console.log(err)
            } else {
                res.send("akun berhasil didaftarkan")

            }
        })
}

//melakaukan login
exports.login = function(req, res) {
    let email = req.body.email;
    db.query("SELECT * FROM akun WHERE nama=?", [email], function(err, row) {
        if (err) {
            console.log(err)
        } else {
            bcrypt.compare(req.body.password, row[0].password, function(err, isMatch) {
                if (err) {
                    res.send(err)
                } else if (!isMatch) {
                    res.send("Password doesn't match!")
                } else {
                    let id = row[0].id;
                    let nama = row[0].nama;
                    let level = row[0].level;
                    sessionData(id, nama, level);
                }
            })
        }
    })
}

// mengisi data session
let dataSession;
const sessionData = (id, nama, level) => {
    dataSession = {
        id: id,
        nama: nama,
        level: level
    }
}

// mendapatkan data session 
exports.sessionUser = function(req, res) {
    res.send(dataSession)
}

// get data path
exports.getPath = function(req, res) {
    db.query("SELECT * FROM path WHERE id_user=?", [req.params.id_user], function(err, rows) {
        if (err) {
            res.send([{
                id_user: null,
                path: null
            }]);
            res.end();
        } else {
            res.send(rows);
            res.end();
        }
    });
}

// setting path
exports.setPath = function(req, res) {
    db.query("DELETE FROM path WHERE id_user=?", [req.body.id_user], function(err, rows) {
        if (err) {
            console.log(err);
        }
    });

    db.query("INSERT INTO path (id_user,path) VALUES(?,?)", [req.body.id_user, req.body.path], function(err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/google.html');
            res.end()
        }
    })


}

// mendapatkan data spesifik akun
exports.getDetailAkun = function(req,res){
    db.query("SELECT * FROM facebook WHERE id=?",[req.params.id_akun],
    function(err,rows){
        if(err){
            console.log(err);    
        }else{
            res.send(rows);
        }
    })
}

// mengubah data akun
exports.updateAkun = function(req,res){
    db.query("UPDATE facebook SET username=?,password=? WHERE id=?",[req.body.username,req.body.password,req.body.id],
        function(err,rows){
            if(err){
                console.log(err);
            }else{
                res.redirect('/google.html');
                res.end();
            }
    })
}

// mengubah data item
exports.updateAkun = function(req,res){
    db.query("UPDATE item SET account=?,kode=?,judul=?,gambar=? WHERE id=?",[req.body.username,req.body.password,req.body.id],
        function(err,rows){
            if(err){
                console.log(err);
            }else{
                res.redirect('/google.html');
                res.end();
            }
    })
}

// update seluruh email
exports.updateEmailAll = function(req,res){
    let id = req.body.id;
    let email = req.body.email;
    id = id.split(",");

    for(let i=0;i<id.length;i++){
        db.query("UPDATE item SET account=? WHERE id_barang=?", [email, id[i]], function (err, rows) {
            if (err) {
                console.log(err)
            }

        })
    }

    res.redirect('/indexing.html');
    res.end();
}


//run auto-post
exports.Run = async(data) => {
    //insert code here
    let browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    console.log("browser jalan");
    context.overridePermissions("https://www.facebook.com", []);
    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);
    await page.setViewport({ width: 1200, height: 800 });
    console.log("link jalan")


    for (let i = 0; i < data.akun.length; i++) {
        console.log(data.akun[i]);
        if (onRun == 1) {
                await page.goto("https://www.facebook.com/login", {
                    waitUntil: "networkidle2",
                });
                await page.click("#email");
                await page.keyboard.down("Control");
                await page.keyboard.press("KeyA");
                await page.keyboard.up("Control");
                await page.keyboard.press("Backspace");
                await page.type("#email", data.akun[i].username, { delay: 30 });
                await page.type("#pass", data.akun[i].password, { delay: 30 });
                await page.click("#loginbutton");
                await page.waitForNavigation({ waitUntil: "networkidle0" });
                await page.waitFor(3000);
                await page.goto("https://www.facebook.com/marketplace/create/item", {
                    waitUntil: "networkidle2",
                });
                for (let j = 0; j < data.barang.length; j++) {
                    if (data.barang[j].account == data.akun[i].username) {
                        //melakukan repeat pada foto
                        let nameImage = data.barang[j].gambar;
                        console.log(nameImage);
                        nameImage = nameImage.split(" ");

                        for (let k = 0; k < nameImage.length; k++) {
                            const inputUploadHandle = await page.$("input[type=file]");
                            let fileToUpload = data.path + nameImage[k];
                            // Sets the value of the file input to fileToUpload
                            inputUploadHandle.uploadFile(fileToUpload);
                        }

						let namaBarang = data.barang[j].kode+" "+data.barang[j].judul+"(FREE ONGKIR + COD)";
                        // melakukan pengisian form
                        await page.type(
                            "[aria-label='Judul'] input[type='text']",
                            namaBarang, { delay: 30 }
                        );
                        await page.type("[aria-label='Harga'] input[type='text']", "123", {
                            delay: 30,
                        });
                        await page.click("[aria-label='Kategori']");
                        let keyword = data.barang[j].kategori;
                        keyword.toLowerCase();

                        //inisialisasi index
                        let index = 0;
                        switch (keyword) {
                            case "peralatan":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[2].click()
                                });
                                break;
                            case "mebel":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[3].click()
                                });
                                break;
                            case "peralatan rumah tangga":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[4].click()
                                });
                                break;
                            case "kebun":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[5].click()
                                });
                                break;
                            case "perkakas":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[6].click()
                                });
                                break;
                            case "video game":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[7].click()
                                });
                                break;
                            case "buku, film, & musik":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[8].click()
                                });
                                break;
                            case "tas & koper":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[9].click()
                                });
                                break;
                            case "sepatu wanita":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[10].click()
                                });
                                break;
                            case "sepatu pria":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[11].click()
                                });
                                break;
                            case "aksesoris":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[12].click()
                                });
                                break;
                            case "kecantikan":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[13].click()
                                });
                                break;
                            case "kebutuhan hewan peliharaan":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[14].click()
                                });
                                break;
                            case "anak-anak":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[15].click()
                                });
                                break;
                            case "mainan":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[16].click()
                                });
                                break;
                            case "elektronik":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[17].click()
                                });
                                break;
                            case "telepon seluler":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[18].click()
                                });
                                break;
                            case "sepeda":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[19].click()
                                });
                                break;
                            case "kerajinan":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[20].click()
                                });
                                break;
                            case "olahraga":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[21].click()
                                });
                                break;
                            case "otomotif":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[22].click()
                                });
                                break;
                            case "alat musik":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[23].click()
                                });
                                break;
                            case "koleksi":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[24].click()
                                });
                                break;
                            case "garage sale":
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[25].click()
                                });
                                break;
                            default:
                                await page.evaluate(() => {
                                    document.querySelectorAll("[data-pagelet='root'] div[data-visualcompletion='ignore-dynamic'] div[role='button']")[26].click()
                                });
                                break;
                        }
                        await page.evaluate(() => {
                            document.querySelector("[aria-label='Kondisi']").click();
                        })
                        await page.waitForSelector(
                            "[data-pagelet='root'] div[role='menu'] div[aria-checked='false']"
                        );
                        await page.evaluate(() =>
                            document.querySelectorAll("[data-pagelet='root'] div[role='menu'] div[aria-checked='false']")[0].click()
                        );
                        await page.type(
                            "[aria-label='Keterangan'] textarea",
                            data.barang[j].deskripsi, { delay: -100 }
                        );


                        await page.evaluate(() => {
                            let selanjutnya = document.querySelector("[aria-label='Selanjutnya']");
                            if (selanjutnya) {
                                selanjutnya.click();
                            } else {
                                selanjutnya = null;
                            }
                        })

                        await page.waitForSelector("[aria-label='Terbitkan']");
                        await page.click("[aria-label='Terbitkan']");

                    }

                    await page.goto("https://www.facebook.com/marketplace/create/item", {
                        waitUntil: "networkidle2",
                    });

                }
                await page.click("[aria-label='Akun']");
                page.evaluate(() => {
                    let btn = document.querySelectorAll('.ow4ym5g4 ')
                    for (let keluar = 0; keluar < btn.length; keluar++) {
                        if (btn[keluar].innerText == "Keluar") {
                            btn[keluar].click();
                        }
                    }
                });
                let url = await page.url();
                await page.waitFor(500)
                await page.goto("https://www.facebook.com/login", {
                    waitUntil: "networkidle2",
                });
                console.log("logout")
        } else if (onRun == 2) {
            i -= 1;
        } else {
            onRun = 0;
            browser.close();
            return false;
        }

    }

    //Close Browser
    await browser.close();
}