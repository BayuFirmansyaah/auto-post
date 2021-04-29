module.exports = function (app) {
    let Controller = require('./controller');


    // ==================================================================================
    // ========================= bagian untuk end point upload ==========================
    // ==================================================================================
    app.route('/upload/images').post((req,res)=>{
        Controller.uploadImage(req,res);
    })


    // ==================================================================================
    // ============================ bagian untuk end point get ==========================
    // ==================================================================================

    // mendapatkan data account
    app.route('/get/account/:id_user').get((req, res) => {
        Controller.getDataAccount(res, req);
    });

    // mendapatkan data item
    app.route('/get/item/:id_user').get((req, res) => {
        Controller.getDataItem(res, req);
    });

    // mendapatkan detail item
    app.route('/get/item/detail/:id_barang').get((req,res)=>{
        Controller.getDetailItem(req,res);
    })

    // mendapatkan data path
    app.route('/get/path/:id_user').get((req, res) => {
        Controller.getPath(req, res);
    })

    // mendapatkan data spesifik akun
    app.route('/get/account/detail/:id_akun').get((req, res) => {
        Controller.getDetailAkun(req, res);
    })

    // mendapatkan data item yang akan di run
    app.route('/get/item/run/:id').get((req, res) => {
        Controller.getItemRun(req, res);
    })

    //mendapatkan log barang
    app.route('/get/log').get((req, res) => {
        Controller.getLog(res, req);
        res.end();
    })

    // mendapatkan log barang dan akun
    app.route('/get/logs').get((req, res) => {
        Controller.getLogs(res, req);
        res.end();
    })

    // get direcroty 
    app.route('/get/directory/:id').get((req,res)=>{
        Controller.getDirectory(req,res)
    })

    // get name folder
    app.route('/get/folder/:name').get((req, res) => {
        Controller.getNameFolder(req, res);
    })


    // ==================================================================================
    // ============================ bagian untuk end point add ==========================
    // ==================================================================================

    // mengubah & menambahkan path image
    app.route('/add/path').post((req, res) => {
        Controller.setPath(req, res);
    })

    // menambahkan data akun facebook secara maual
    app.route('/add/account').post((req, res) => {
        Controller.addAccount(req, res);
    })

    // menambahkan data akun user
    app.route('/add/account/user').post((req, res) => {
        Controller.addAccountUser(req, res);
    })

    // menambahkan data barang secara manual
    app.route('/add/item/manually').post((req, res) => {
        Controller.addItemManually(req, res);
         res.redirect('/indexing.html');
        res.end();
    })

    //menambah folder baru
    app.route('/add/folder').post((req, res) => {
        Controller.createFolder(req, res);
        res.redirect('../../directory.html');
        res.end();
    })


    // ===================================================================================
    // =========================== bagian untuk end point update =========================
    // ===================================================================================

    // mengubah data akun facebook
    app.route('/update/account').post((req, res) => {
        Controller.updateAkun(req, res);
    })

    // mengubah data item facebook
    app.route('/update/item').post((req, res) => {
        Controller.updateItem(req, res);
        res.redirect('../indexing.html');
        res.end()
    })

    // merubah seluru email
    app.route('/update/all/email').post((req, res) => {
        Controller.updateEmailAll(req, res);
    });

    //merubah nama folder
    app.route('/update/folder').post((req, res) => {
        Controller.renameFolder(req, res);
        res.end();
    })


    // ==================================================================================
    // ========================= bagian untuk end point delete ==========================
    // ==================================================================================

    // menghapus akun
    app.route('/delete/account/:id').get((req, res) => {
        Controller.hapusAkun(req, res);
    })

    //menghapus semua akun
    app.route('/delete/account/all/:id_user').get((req, res) => {
        Controller.hapusSemuaAkun(req, res);
    })

    // menghapus item
    app.route('/delete/item/:id').get((req, res) => {
        Controller.hapusBarang(req, res);
    })

    //menghapus semua item
    app.route('/delete/item/all/:id_user').get((req, res) => {
        Controller.hapusSemuaBarang(req, res);
    })

    //menghapus folder baru
    app.route('/delete/folder').post((req, res) => {
        Controller.hapusFolder(req, res);
        res.end();
    })


    // ==================================================================================
    // ====================== bagian untuk end point convert ===========================
    // ==================================================================================

    // melakukan convert dari excel to json untuk file account
    app.route('/convert/account').post((req, res) => {
        Controller.convertAccount(req, res);
        res.redirect('/google.html');
        res.end();
    })

    // melakukan convert dari excel to json untuk file item
    app.route('/convert/item').post((req, res) => {
        Controller.convertDataItem(req, res);
        res.redirect('/indexing.html');
        res.end();
    })


    // ==================================================================================
    // ======================= bagian untuk end point run program =======================
    // ==================================================================================

    // schedule
    app.route('/create/schedule').post((req,res)=>{
        let data = req.body;
        Controller.Schedule(data);
    })

    // root index
    app.route('/').get((req, res) => {
        res.sendFile(__dirname + "/login.html");
    });

    // login
    app.route('/login/account').post((req, res) => {
        Controller.login(req, res);
        res.redirect('/indexing.html');
        res.end();
    })

    // get session
    app.route('/session').get((req, res) => {
        Controller.sessionUser(req, res);
    })

    // register
    app.route('/register/account').post((req, res) => {
        Controller.register(req, res);
    })

    // run program
    app.route('/run').post(async (req, res) => {
        let data = req.body;
        await Controller.isRun(1);
        Controller.Run(Run,data);
        console.log("jalan");
        res.send('Program Mulai Dijalankan');
        // res.end();
    })

    // pause program
    app.route('/pause').get((req, res) => {
        Controller.isRun(2);
        res.send('Program Dihentikan Sementara');
        res.redirect('/google.html');
        res.end();
    })

    // resume program
    app.route('/resume').get((req, res) => {
        Controller.isRun(1);
        res.send('Program Dijalankan kembali');
        res.redirect('/google.html');
        res.end();
    })

    // stop program
    app.route('/stop').get((req, res) => {
        Controller.isRun(3);
        res.send('Program Dihentikan');
        res.redirect('/google.html');
        res.end();
    })



}