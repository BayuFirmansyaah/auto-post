$('.id_user').val(sessionStorage.getItem('id_user'));
$('.level').val(sessionStorage.getItem('level'));

if ($('.level').val(sessionStorage.getItem('level')) != "admin") {
    $('.add').addClass('none');
}

// function sort json
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

$.ajax({
    url: 'http://localhost:3000/get/item/' + sessionStorage.getItem("id_user"),
    success: (data) => {
        let Item = data.Search;
        Item = sortByProperty(Item,"Item.account");
        let row = "";
        let i = 1;
        let nama;
        Item.forEach(data => {
            if (data.account == undefined) {
                nama = "";
            } else {
                nama = data.account;
            }
            // melakukan perulangan pada image
            let image = "";
            let gambar = data.gambar;
                gambar = gambar.split(" ");
            gambar.forEach((img)=>{
                image += `<img src="https://images.tokopedia.net/img/cache/700/VqbcmM/2020/7/18/013c1e4d-0ae7-4521-ae38-36835f974722.jpg" class="thumbnail-produk" >`;
            })
            row += `
                                <tr class="baris-data">
                                    <th scope="row">${i}</th>
                                     <td class="text-center"> 
                                        <input type="checkbox" class="checked id-barang" value="${data.id_barang}" >
                                    </td>
                                    <td class="kolom1">${data.judul}</td>
                                    <td class="kolom2">${nama}</td>
                                    <td class="text-center kolom3">${data.kode}</td>
                                    <td>${image}</td>
                                 </tr>
                            `;
            i += 1;
        });
        $('.table-body').html(row);

        $('.baris-data').on('click',function() {
            let cek = $(".id-barang", this)
            if (cek.is(":checked")){
                $(".id-barang", this).removeAttr('checked');
            }else{
                $(".id-barang", this).attr('checked', 'checked');
            }
            
        })

        let baris = document.querySelectorAll('.baris-data');

        
        $('.btn-delete').on('click', function () {
            let id = $(this).attr('data-id');
            let konfirmasi = confirm("apakah anda yakin ingin menghapus data ini ?");
            if (konfirmasi) {
                $.ajax({
                    url: 'http://localhost:3000/delete/item/' + id,
                    success: (data) => {
                        alert(data);
                    },
                    error: (err) => {
                        alert(err);
                    }
                })
            }
        })

        // jika tombol checked di tekan
        $('.chekedAll').on('change', function () {
            if (this.checked) {
                $('.checked').attr('checked', 'checked');
            } else {
                $('.checked').removeAttr('checked');
            }
        })
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
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];
    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    })

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
        }
    } else {
        alert('tidak ada item yang dipilih');
    }

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
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];

    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    })

    if (id_barang.length > 0) {
        let contentForm = `
            <div class="custom-file">
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">username</span>
            </div>
                <input type="text" class="form-control" aria-label="password" name="email"
                                    aria-describedby="basic-addon1">
                <input type="hidden" name="id" value="" class="id_barang">
            </div>
        </div>`;
        $('.modal-body-update-username').html(contentForm);
        $('.id_barang').val(id_barang);
        $('.modal-edit-akun').attr('action', 'http://localhost:3000/update/all/email');
        $('.btn-save-akun').removeClass('disabled');
        $('.btn-save-akun').removeAttr('disabled', '');
    } else {
        $('.modal-edit-akun').attr('action', '');
        $('.btn-save-akun').addClass('disabled');
        $('.btn-save-akun').attr('disabled', '');
        $('.modal-body-update-username').html("<h3 class='text-center'>Wajib Memilih Salah Satu Data </h3>");
    }
})

