// menampilkan data ketika halaman selesai di load
$.ajax({
    url: 'http://localhost:3000/get/item/' + sessionStorage.getItem("id_user"),
    success: async (data) => {
        await loadData(data);
    },
    error: (err) => {
        console.log(err);
    }
})

// mendapatkan urlpath image
$.ajax({
    url: 'http://localhost:3000/get/path/' + sessionStorage.getItem("id_user"),
    success: (path) => {
        if (path.length == 0) {
            $('.path').val("Path saat ini Belum disetting");
        } else {
            $('.path').val(path[0].path);
        }
    },
    error: (err) => {
        console.log(err);
    }
})

// jika tombol hapus ditekan
$('.btn-delete-all').on('click', function () {
    Delete();
})

// jika tombol logout ditekan
$('.logout').on('click', function () {
    sessionStorage.setItem('cek', 0);
    sessionStorage.setItem('id_user', null);
    sessionStorage.setItem('level', null);
    sessionStorage.setItem('nama', null);
    window.location.replace("https://fbmp.pastiada.com");
});

// jika tombol update akun ditekan;
$('.btn-edit-all').on('click', function () {
    Edit();
})


//live searching 
$(document).ready(function () {
    $("#posSearch").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#posTable tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});


// ======================================================================================
// ================================= Prototype Functions=================================
// ======================================================================================


// function untuk melakukan load data
function loadData(data) {
    let Item = data.Search;
    Item = sortByProperty(Item, "Item.account");
    let row = "";
    let i = 1;
    let nama;
    Item.forEach(data => {

        // melakukan handdle jika username akun kosong
        if (data.account == undefined) {
            nama = "";
        } else {
            nama = data.account;
        }

        // melakukan perulangan pada image
        let image = "";
        let gambar = data.gambar;
        gambar = gambar.split(" ");
        gambar.forEach((img) => {
            image += `<img src="https://images.tokopedia.net/img/cache/700/VqbcmM/2020/7/18/013c1e4d-0ae7-4521-ae38-36835f974722.jpg" class="thumbnail-produk" >`;
        })

        row += `
            <tr class="baris-data baris-item" value="${data.id_barang}">
                <th scope="row">${i}</th>
                <td class="text-center"> 
                    <input type="checkbox" class="checked id-barang" value="${data.id_barang}" >
                </td>
                <td class="kolom1">${data.judul}</td>
                <td class="kolom2">${nama}</td>
                <td class="text-center kolom3">${data.kode}</td>
                <td>${image}</td>
            </tr>`;
        i += 1;
    });
    $('.table-body').html(row);

    // memberikan event jika baris tabel di click
    $('.baris-data').on('click', function () {
        let cek = $(".id-barang", this)
        if (cek.is(":checked")) {
            $(".id-barang", this).removeAttr('checked');
        } else {
            $(".id-barang", this).attr('checked', 'checked');
        }

        let checkbox = document.querySelectorAll('.checked');
        let count = 0;

        for (let i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked) {
                count += 1;
            }
        }

        $('.btn-jumlah').html('Jumlah ' + count);

    })

    let dataBarangSelect = JSON.parse(localStorage.getItem('data-barang'));
    let checkbox = document.querySelectorAll('.checked');
    let barisAkun = document.querySelectorAll('.baris-item');

    for (let i = 0; i < dataBarangSelect.length; i++) {
        let index = dataBarangSelect[i]
        
        checkbox.forEach((el)=>{
            if(el.getAttribute('value') == index){
                console.log(el.getAttribute('value'),index)
                $(this).attr('checked', 'checked')
            }
        })

        // checkbox[index].setAttribute('checked', 'checked');
        // let count = 0;
        // barisAkun[index].classList.add('disabled-row')

        // for (let j = 0; j < checkbox.length; j++) {
        //     if (checkbox[j].checked) {
        //         count += 1;
        //     }
        // }

        // $('.btn-jumlah').html('Jumlah ' + count);

    }

    // memberikan event jika tombol checkedAll di tekan
    $('.chekedAll').on('change', function () {
        if (this.checked) {
            $('.checkedAll').attr('checked', 'checked');
            $('.checked').attr('checked', 'checked');
        } else {
            $('.checked').removeAttr('checked');
        }

        let checkbox = document.querySelectorAll('.checked');
        let count = 0;

        for (let i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked) {
                count += 1;
                console.log(count)
            }
        }

        $('.btn-jumlah').html('Jumlah ' + count);
    })

    // memberikan event jika tombol checked di tekan
    $('.checked').on('change', function () {
        $(this).attr('checked', 'checked');
        let checkbox = document.querySelectorAll('.checked');
        let count = 0;

        for (let i = 0; i < checkbox.length; i++) {
            if (checkbox[i].checked) {
                count += 1;
                console.log(count)
            }
        }

        $('.btn-jumlah').html('Jumlah ' + count);
    })
}


// function untuk menghapus data
const Delete = () => {
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];
    let index_id_barang = []
    let count = 0;
    id.forEach((id) => {
        if (id.checked) {
            index_id_barang.push(count);
            id_barang.push(id.getAttribute('value'));
        }
        count++;
    })


    Array.prototype.remove = function () {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };


    if (id_barang.length > 0) {
        let konfirmasi = confirm("apakah anda yakin ingin menghapus data ini ?");
        if (konfirmasi) {
            $.ajax({
                url: 'http://localhost:3000/delete/item/all/' + id_barang,
                success: (data) => {
                    alert(data);
                    location.reload();
                },
                error: (err) => {
                    alert(err);
                }
            })

            let data_id_barang = JSON.parse(localStorage.getItem('data-barang'))

            console.log(data_id_barang);
            index_id_barang.forEach((id) => {
                data_id_barang.remove(parseInt(id));
            })

            localStorage.setItem('data-barang', JSON.stringify(data_id_barang));
            console.log(data_id_barang);

        }
    } else {
        alert('tidak ada item yang dipilih');
    }
}


// function untuk melakukan edit data
const Edit = () => {
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];

    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    })

    if (id_barang.length == 1) {
        $('.modal-edit-data').addClass('modal-lg');
        let detailBarang = $.ajax({
            url: 'http://localhost:3000/get/item/detail/' + id_barang[0],
            success: (data) => {
                console.log(data);
                username = data[0].account;
                kode = data[0].kode;
                judul = data[0].judul;
                kategori = data[0].kategori;
                desc = data[0].deskripsi;
                img = data[0].gambar;
                let contentForm = `
                        <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Username</label>
                                <input type="text" class="form-control" 
                                    aria-describedby="emailHelp" name="username" value=${username}>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputPassword1">Kode</label>
                                <input type="text" class="form-control" name="kode" value=${kode}>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputEmail1">Judul Barang</label>
                                <input type="text" class="form-control" 
                                    aria-describedby="emailHelp" name="judul" value=${judul}>
                            </div>
                        </div>
                        <div class="col">
                            <div class="form-group">
                                <label for="exampleInputPassword1">Kategori</label>
                                <input type="text" class="form-control" name="kategori" value=${kategori}>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="exampleFormControlTextarea1">Deskripsi</label>
                        <textarea class="form-control" rows="3"
                            name="deskripsi">${desc}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="exampleInputPassword1">Gambar</label>
                        <input type="text" class="form-control" name="gambar" value=${img}>
                        <input type="hidden" name="id" value="${id_barang}" class="id_user">
                    </div>`;
                $('.modal-body-update-username').html(contentForm);
                $('.modal-edit-akun').attr('action', 'http://localhost:3000/update/item');
                $('.btn-save-akun').removeClass('disabled');
                $('.btn-save-akun').removeAttr('disabled', '');

            }, error: (err) => {
                console.log(err);
            }
        });

    } else if (id_barang.length > 0 && id_barang.length > 1) {
        $('.modal-edit-data').removeClass('modal-lg');
        let contentForm = `
                <div class="custom-file">
                    <div class="input-group mb-3">
                    <div class="input-group-prepend">
                    <span class="input-group-text" id="basic-addon1">username</span>
                </div>
                    <input type="text" class="form-control" aria-label="password" name="email"
                                        aria-describedby="basic-addon1">
                    <input type="hidden" name="id" value="${id_barang}" class="id_barang">
                </div>
                </div>`;
        $('.modal-body-update-username').html(contentForm);
        $('.modal-edit-akun').attr('action', 'http://localhost:3000/update/all/email');
        $('.btn-save-akun').removeClass('disabled');
        $('.btn-save-akun').removeAttr('disabled', '');
    } else {
        $('.modal-edit-akun').attr('action', '');
        $('.btn-save-akun').addClass('disabled');
        $('.btn-save-akun').attr('disabled', '');
        $('.modal-body-update-username').html("<h3 class='text-center'>Wajib Memilih Salah Satu Data </h3>");
    }
}


// function untuk mengurutkan data dari json
function sortByProperty(objArray, prop, direction) {
    if (arguments.length < 2) throw new Error("ARRAY, AND OBJECT PROPERTY MINIMUM ARGUMENTS, OPTIONAL DIRECTION");
    if (!Array.isArray(objArray)) throw new Error("FIRST ARGUMENT NOT AN ARRAY");
    const clone = objArray.slice(0);
    const direct = arguments.length > 2 ? arguments[2] : 1; //Default to ascending
    const propPath = (prop.constructor === Array) ? prop : prop.split(".");
    clone.sort(function (a, b) {
        for (let p in propPath) {
            if (a[propPath[p]] && b[propPath[p]]) {
                a = a[propPath[p]];
                b = b[propPath[p]];
            }
        }
        // convert numeric strings to integers
        a = a.match(/^\d+$/) ? +a : a;
        b = b.match(/^\d+$/) ? +b : b;
        return ((a < b) ? -1 * direct : ((a > b) ? 1 * direct : 0));
    });
    return clone;
}


//mengecek sidebar 
if (localStorage.getItem('ls') === "true") {
    document.querySelector('.sidebar').classList.remove('sidebar-none')
    document.querySelector('.sidebar').classList.add('sidebar-block')
    document.querySelector('.content').classList.remove('table-none')
    document.querySelector('.table').classList.remove('table-full')
    document.querySelector('.row-table').classList.remove('.row-table-none')
    $('.sidebar').html(`
    <h6 class="text-heading text-primary">DATA ACCOUNTS</h6>
    <a href="/google.html">
        <p class="sub-heading "><i class="fab fa-facebook"></i> Facebook Accounts</p>
    </a>
    <h6 class="text-heading text-primary">INVENTORY</h6>
    <a href="/indexing.html">
        <p class="sub-heading "><i class="fas fa-server"></i> Item</p>
    </a>
    <div data-toggle="modal" data-target="#path">
        <p class="sub-heading "><i class="fas fa-map-marker-alt"></i> Path Image</p>
    </div>
    <h6 class="text-heading text-primary">DIRECTORY</h6>
        <a href="/directory.html">
            <p class="sub-heading "><i class="fas fa-folder-tree"></i> File Manager</p>
        </a>`)

} else if (localStorage.getItem('ls') === "false") {
    document.querySelector('.sidebar').classList.add('sidebar-none')
    document.querySelector('.sidebar').classList.remove('sidebar-block')
    document.querySelector('.content').classList.add('table-none')
    document.querySelector('table').classList.add('table-full')
    document.querySelector('.row-table').classList.add('.row-table-none')
    $('.sidebar').html(`
    <a href="/google.html">
        <p class="sub-heading "><i class="fab fa-facebook"></i></p>
    </a>
    <a href="/indexing.html">
        <p class="sub-heading "><i class="fas fa-server"></i></p>
    </a>
    <div data-toggle="modal" data-target="#path">
        <p class="sub-heading "><i class="fas fa-map-marker-alt"></i></p>
    </div>
    <a href="/directory.html">
        <p class="sub-heading "><i class="fas fa-folder-tree"></i></p>
    </a>`)
}


// mengisi value element dari data di localstorage
$('.id_user').val(sessionStorage.getItem('id_user'));
$('.level').val(sessionStorage.getItem('level'));


// melakukan pengecekan fitur untuk admin
if ($('.level').val(sessionStorage.getItem('level')) != "admin") {
    $('.add').addClass('none');
}


