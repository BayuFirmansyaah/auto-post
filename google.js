$('.id_user').val(sessionStorage.getItem('id_user'));
$('.level').val(sessionStorage.getItem('level'));
// menyimpan data yang akan dikirim ke server
let data = {
    akun: null,
    barang: null,
    path: null
};

// mendapatkan data akun facebook
$.ajax({
    url: 'http://localhost:3000/get/account/' + sessionStorage.getItem('id_user'),
    success: (Account) => {
        let akun = Account.Search;
        data.akun = akun;
        let row = "";
        let i = 1;
        akun.forEach(data => {
            row += `
                    <tr>
                        <th scope="row">${i}</th>
                        <td class="text-center">
                            <input type="checkbox" class="checked id-facebook" value="${data.id}" 
                        </td>
                        <td>${data.username}</td>
                        <td>${data.password}</td>
                        </tr>
                    `;
            i += 1;
        });

        // mengisi data kedalam tabel
        $('.table-body').html(row);

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


// mendapatkan data item barang
$.ajax({
    url: 'http://localhost:3000/get/item/' + sessionStorage.getItem("id_user"),
    success: (Item) => {
        let barang = Item.Search;
        data.barang = barang;
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
            data.path = null;
        } else {
            data.path = path[0].path;
            $('.path').val(path[0].path);
        }
    },
    error: (err) => {
        console.log(err);
    }
})

// jika tombol play ditekan
$('.btn-play').on('click', function () {
    $('.btn-play').addClass('none');
    $('.btn-play').removeClass('show');
    $('.btn-pause').addClass('show');
    $('.btn-pause').removeClass('none');
    if (data.path == null) {
        alert("Path Belum Di Set")
    } else {
        $.ajax({
            url: 'http://localhost:3000/run',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            success: (data) => {
                alert(data);
            }
        })
    }
})

// jika tombol hapus ditekan
$('.btn-delete-all').on('click', function () {
    // mendapatkan id facebook
    let id = document.querySelectorAll('.id-facebook');
    let id_facebook = [];
    id.forEach((id) => {
        if (id.checked) {
            id_facebook.push(id.getAttribute('value'));
        }
    })

    // jika data yang didapatkan lebih dari 0
    if (id_facebook.length > 0) {
        let konfirmasi = confirm("apakah anda yakin ingin menghapus data ini ?");
        if (konfirmasi) {
            $.ajax({
                url: 'http://localhost:3000/delete/account/all/' + id_facebook,
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


// //jika tombol pause ditekan
$('.btn-pause').on('click', function () {
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-resume').addClass('show');
    $('.btn-resume').removeClass('none');
    $.ajax({
        url: 'http://localhost:3000/pause',
        success: (data) => {
            alert(data);
        },
        error: (err) => {
            alert(err);
        }
    })
})

//jika tombol resume ditekan
$('.btn-resume').on('click', function () {
    $('.btn-resume').addClass('none');
    $('.btn-resume').removeClass('show');
    $('.btn-pause').addClass('show');
    $('.btn-pause').removeClass('none');
    $.ajax({
        url: 'http://localhost:3000/resume',
        success: (data) => {
            alert(data);
        },
        error: (err) => {
            alert(err);
        }
    })
})

//jika tompol stop ditekan
$('.btn-stop').on('click', function () {
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-play').addClass('show');
    $('.btn-play').removeClass('none');
    $('.btn-resume').addClass('none');
    $('.btn-resume').removeClass('show');
    $.ajax({
        url: 'http://localhost:3000/stop',
        success: (data) => {
            alert(data);
        },
        error: (err) => {
            alert(err);
        }
    })
})

// jika tombol update akun ditekan;
$('.btn-edit-all').on('click', function () {
    // mendapatkan id akun
    let id = document.querySelectorAll('.id-facebook');
    let id_facebook = [];

    id.forEach((id) => {
        if (id.checked) {
            id_facebook.push(id.getAttribute('value'));
        }
    })

    if (id_facebook.length == 1) {
        let data = `
                        <div class="custom-file">
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">username</span>
                                </div>
                                <input type="text" class="form-control username" aria-label="Username" name="username"
                                    aria-describedby="basic-addon1" value="">
                            </div>
                            <div class="input-group mb-3">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">password</span>
                                </div>
                                <input type="text" class="form-control password" aria-label="password" name="password"
                                    aria-describedby="basic-addon1">
                                <input type="hidden" name="id" value="${id_facebook}" class="id_facebook">
                            </div>
                        </div>`;
        $('.modal-data').html(data);
        $.ajax({
            url: 'http://localhost:3000/get/account/detail/' + id_facebook,
            success: (data) => {
                $('.username').val(data[0].username);
                $('.password').val(data[0].password);
            },
            error: (err) => {
                console.log(err)
            }
        })
        $('.modal-edit-akun').attr('action', 'http://localhost:3000/update/account');
        $('.btn-save-akun').removeClass('disabled');
        $('.btn-save-akun').removeAttr('disabled', '');
    } else if (id_facebook.length > 0 && id_facebook.length > 1) {
        $('.btn-save-akun').addClass('disabled');
        $('.btn-save-akun').attr('disabled', '');
        $('.modal-data').html("<h3 class='text-center h3'>Hanya Bisa Memilih Satu Data </h3>");
    } else {
        $('.btn-save-akun').addClass('disabled');
        $('.btn-save-akun').attr('disabled', '');
        $('.modal-data').html("<h3 class='text-center'>Wajib Memilih Salah Satu Data </h3>");
    }
})

// jika tombol logout ditekan
$('.logout').on('click', function () {
    sessionStorage.setItem('cek', 0);
    sessionStorage.setItem('id_user', null);
    sessionStorage.setItem('level', null);
    sessionStorage.setItem('nama', null);
    window.location.replace("http://localhost:3000");
});
