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
const clipboardy = require('clipboardy');

// ======================================================================================
// =========================== bagian untuk koneksi database ============================
// ======================================================================================

// data koneksi
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

db.connect(function (err) {
    if (err) console.log(err);
    console.log("link webiste : http://localhost:3000");
})



// ======================================================================================
// ========================= bagian untuk end point add program =========================
// ======================================================================================


// add data akun facebook manual
exports.addAccount = function (req, res) {
    db.query("INSERT INTO facebook (id_user,username,password) VALUES(?,?,?)", [req.body.id, req.body.username, req.body.password],
        function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/google.html');
                res.end();
            }
        });
}

// add data akun user
exports.addAccountUser = function (req, res) {
    let email = req.body.username;
    let password = bcrypt.hashSync(req.body.password, salt);
    if (req.body.level == 'admin') {
        db.query("INSERT INTO akun (nama,password,level) VALUES(?,?,?)", [email, password, "level"],
            function (err, rows) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/indexing.html');
                    res.end();
                }
            });
    } else {
        res.redirect('/indexing.html');
        res.end();
    }

}

// add data item secara manual
exports.addItemManually = function (req, res) {
    let username = req.body.username;
    let kode = req.body.kode;
    let judul = req.body.judul;
    let kategori = req.body.kategori;
    let deskripsi = req.body.deskripsi;
    let gambar = req.body.gambar;
    let id_user = req.body.id;
    db.query("INSERT INTO item (id_user,account,kode,judul,kategori,deskripsi,gambar) VALUES(?,?,?,?,?,?,?)", [id_user, username, kode, judul, kategori, deskripsi, gambar], (err) => {
        if (err) {
            console.log(err);
        }
    })
}


// ======================================================================================
// =========================== bagian untuk end point convert ===========================
// ======================================================================================


// melakukan convert data akun dari excel ke json
exports.convertAccount = function (req, res) {
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
                    function (err, row, field) {
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

// melakukan convert data akun dari excel ke json
exports.convertDataItem = function (req, res) {
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
                    function (err, row, field) {
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



// ======================================================================================
// ========================= bagian untuk end point  get data ===========================
// ======================================================================================


// mendapatkan data account
exports.getDataAccount = function (res, req) {
    db.query("select * from facebook where id_user=?", [req.params.id_user], function (err, rows, fields) {
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
exports.getDataItem = function (res, req) {
    db.query("select * from item where id_user=?", [req.params.id_user], function (err, rows, fields) {
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
exports.sessionUser = function (req, res) {
    res.send(dataSession)
}

// get data path
exports.getPath = function (req, res) {
    db.query("SELECT * FROM path WHERE id_user=?", [req.params.id_user], function (err, rows) {
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

// mendapatkan data spesifik akun
exports.getDetailAkun = function (req, res) {
    db.query("SELECT * FROM facebook WHERE id=?", [req.params.id_akun],
        function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
                res.end();
            }
        })
}
// mendapatkan data spesifik Item
exports.getDetailItem = function (req, res) {
    db.query("SELECT * FROM item WHERE id_barang=?", [req.params.id_barang],
        function (err, rows) {
            if (err) {
                console.log(err);
            } else {
                res.send(rows);
            }
        })
}

// ======================================================================================
// ======================== bagian untuk end point delete data ==========================
// ======================================================================================


// menghapus akun
exports.hapusAkun = function (req, res) {
    db.query("DELETE FROM facebook WHERE id=?", [req.params.id], function (err) {
        if (err) {
            console.log(err);
        } else {
            res.send("Data Berhasil Di Hapus");
            res.end()
        }
    })
}

// hapus semua akun
exports.hapusSemuaAkun = function (req, res) {
    let id = req.params.id_user;
    id = id.split(",");
    for (let i = 0; i < id.length; i++) {
        db.query("DELETE FROM facebook WHERE id=?", [id[i]], function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
    res.send("Data Berhasil Di Hapus");
    res.end();
}

// menghapus semua barang
exports.hapusSemuaBarang = function (req, res) {
    let id = req.params.id_user;
    id = id.split(",");
    for (let i = 0; i < id.length; i++) {
        db.query("DELETE FROM item WHERE id_barang=?", [id[i]], function (err) {
            if (err) {
                console.log(err);
            }
        })
    }
    res.send("Data Berhasil Di Hapus");
    res.end();
}



// ======================================================================================
// ======================== bagian untuk end point update data ==========================
// ======================================================================================


// setting path
exports.setPath = function (req, res) {
    db.query("DELETE FROM path WHERE id_user=?", [req.body.id_user], function (err, rows) {
        if (err) {
            console.log(err);
        }
    });

    db.query("INSERT INTO path (id_user,path) VALUES(?,?)", [req.body.id_user, req.body.path], function (err, rows) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/google.html');
            res.end()
        }
    })


}

// mengubah data akun
exports.updateAkun = function (req, res) {
    let id = req.body.id;
    id = id.split(",");

    for (let i = 0; i < id.length; i++) {
        db.query("UPDATE facebook SET username=?,password=? WHERE id=?", [req.body.username, req.body.password, id[i]],
            function (err, rows) {
                if (err) {
                    console.log(err);
                }
            })
    }

    res.redirect('/google.html');
    res.end();
}

// update seluruh email
exports.updateEmailAll = function (req, res) {
    let id = req.body.id;
    let email = req.body.email;
    id = id.split(",");

    for (let i = 0; i < id.length; i++) {
        db.query("UPDATE item SET account=? WHERE id_barang=?", [email, id[i]], function (err, rows) {
            if (err) {
                console.log(err)
            }

        })
    }

    res.redirect('/indexing.html');
    res.end();
}

// merubah data item
exports.updateItem = function(req,res){
    let username = req.body.username;
    let kode = req.body.kode;
    let judul = req.body.judul;
    let kategori = req.body.kategori;
    let deskripsi = req.body.deskripsi;
    let gambar = req.body.gambar;
    let id_barang = req.body.id;
    db.query("UPDATE item SET account=?,kode=?,judul=?,kategori=?,deskripsi=?,gambar=? WHERE id_barang=?", [username, kode, judul, kategori, deskripsi, gambar,id_barang], (err) => {
        if (err) {
            console.log(err);
        }
        res.end()
    })
}

// ======================================================================================
// ============================= bagian untuk sistem login ==============================
// ======================================================================================


//melakukan register
exports.register = function (req, res) {
    let email = req.body.email;
    let password = bcrypt.hashSync(req.body.password, salt);
    db.query("INSERT INTO akun (nama,password,level) VALUES(?,?,?)", [email, password, 'user'],
        function (err, rows, fields) {
            if (err) {
                console.log(err)
            } else {
                res.send("akun berhasil didaftarkan")

            }
        })
}

//melakaukan login
exports.login = function (req, res) {
    let email = req.body.email;
    db.query("SELECT * FROM akun WHERE nama=?", [email], function (err, row) {
        if (err) {
            console.log(err)
        } else {
            bcrypt.compare(req.body.password, row[0].password, function (err, isMatch) {
                if (err) {
                    res.send(err);
                    res.end();
                } else if (!isMatch) {
                    res.send("Password doesn't match!");
                    res.end();
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



// ======================================================================================
// ========================= bagian untuk sistem run program ============================
// ======================================================================================


// merubah fitur pause/play/stop
exports.isRun = function (value) {
    onRun = value;
}

//run auto-post
exports.Run = async (data) => {

    //insert code here
    let browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    console.log("browser jalan");
    context.overridePermissions("https://www.facebook.com", []);
    let page = await browser.newPage();
    await page.setDefaultNavigationTimeout(100000);
    await page.setViewport({ width: 1200, height: 800 });
    console.log("link jalan")
    let logs = []; 
    let report_post = [];
    let items = [];
    let item = [];
    
    let lengthBarang = data.barang.length;
    lengthBarang -= 1;

    for (let i = 0; i < data.barang.length; i++) {

        if(data.barang.length <=1){
            item.push(data.barang[i]);
            items.push(item);
            item = [];
        }

        let last = item.length;
        if (last > 0) {
            last -= 1;
            if (item[last].account == data.barang[i].account) {
                item.push(data.barang[i])
                // console.log("berhasi di tambahkan ketika nilai sama")
                if (i == lengthBarang) {
                    items.push(item);
                    item = [];
                }
            } else if (item[last].account !== data.barang[i].account) {
                // console.log("berhasi di tambahkan ketika nilai berbeda");
                items.push(item);
                item = [];
                item.push(data.barang[i])
            }
        } else {
            // console.log("berhasi di tambahkan ketika array kosong")
            item.push(data.barang[i]);
        }
    }



    for (let i = 0; i < data.akun.length; i++) {
        let d = new Date();
        let mulai = d.getTime();
        
        if (onRun == 1) {
            await page.goto("https://www.facebook.com/login", {
                waitUntil: "networkidle2",
            });
            console.log(data.akun[i].username);
            await page.click("#email");
            await page.keyboard.down("Control");
            await page.keyboard.press("KeyA");
            await page.keyboard.up("Control");
            await page.keyboard.press("Backspace");
            await page.type("#email", data.akun[i].username, { delay: 30 });
            await page.type("#pass", data.akun[i].password, { delay: 30 });
            await page.click("#loginbutton");
            await page.waitForNavigation({ waitUntil: "networkidle0" });
            await page.waitFor(1000);
            await page.goto("https://www.facebook.com/marketplace/create/item", {
                waitUntil: "networkidle2",
            });

            let data_barang = items[i];
            let count_post = 0;
            
            for (let j = 0; j < data_barang.length; j++) {
                let log_post;
                // melakukan pengecekan apakah data barang sama dengan data akun yang akan di post
                 if (data_barang[j].account == data.akun[i].username) {
                    // melakukan pengecekan apakah ada data yang kosong
                    
                    if(data_barang[i].judul.length <=1 ||
                        data_barang[i].kategori.length <= 1 ||
                        data_barang[i].deskripsi.length <= 1 ||
                        data_barang[i].gambar.length <= 1){
                        // menuliskan logs report
                        log_post = {
                            akun: data.akun[i].username,
                            id: data_barang[j].id,
                            kode: data_barang[j].kode,
                            status: 'failed'
                        };
                        await page.goto("https://www.facebook.com/marketplace/create/item", {
                            waitUntil: "networkidle2",
                        });
                        count_post += 1;
                        console.log("Post Barang Ke " + count_post + " Gagal");
                    }else{
                        clipboardy.writeSync(data_barang[j].deskripsi);

                        //melakukan repeat pada foto
                        let nameImage = data_barang[j].gambar;
                        nameImage = nameImage.split(" ");

                        for (let k = 0; k < nameImage.length; k++) {
                            const inputUploadHandle = await page.$("input[type=file]");
                            let fileToUpload = data.path + nameImage[k];
                            // Sets the value of the file input to fileToUpload
                            inputUploadHandle.uploadFile(fileToUpload);
                        }

                        let namaBarang = data_barang[j].kode + " " + data_barang[j].judul + "(FREE ONGKIR+COD)";
                        // melakukan pengisian form
                        await page.type(
                            "[aria-label='Judul'] input[type='text']",
                            namaBarang, { delay: 30 }
                        );
                        await page.type("[aria-label='Harga'] input[type='text']", "123", {
                            delay: 30,
                        });
                        await page.click("[aria-label='Kategori']");
                        let keyword = data_barang[j].kategori;
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
                            '', { delay: -100 }
                        );
                        await page.keyboard.down("Control");
                        await page.keyboard.press("KeyV");
                        await page.keyboard.up("Control");


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
                        log_post = {
                            akun: data.akun[i].username,
                            id: data_barang[j].id,
                            kode: data_barang[j].kode,
                            status: 'success'
                        };
                        await page.goto("https://www.facebook.com/marketplace/create/item", {
                            waitUntil: "networkidle2",
                        });
                        count_post += 1;
                        console.log("Post Barang Ke "+count_post+" Berhasil");
                    }
                    report_post.push(log_post);
                }
                

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
            let  log = {
                "jumlah" : count_post,
                "akun"   : data.akun[i].username
            }

            logs.push(log)

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

    let result_report = {
        akun : logs,
        barang : report_post
    }

    fs.writeFileSync('logs.json',JSON.stringify(result_report,null,2));
    //Close Browser
    await browser.close();
}