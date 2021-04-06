$('.id_user').val(sessionStorage.getItem('id_user'));
$('.level').val(sessionStorage.getItem('level'));
let data = {
    akun: null,
    barang: null,
    path: null
};

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
                                        <input type="checkbox" class="checked id-barang" value="${data.id}" >
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

        // jika tombol edit ditekan
        $('.btn-edit').on('click', function () {
            let id = $(this).attr('data-id');
            $.ajax({
                url: 'http://localhost:3000/get/account/detail/' + id,
                success: (data) => {
                    $('.username').val(data[0].username);
                    $('.password').val(data[0].password);
                    $('.id').val(data[0].id);
                },
                error: (err) => {
                    console.log(err);
                }
            })
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
                url: 'http://localhost:3000/delete/account/all/' + id_barang,
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
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];

    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    })
    $('.id_barang').val(id_barang);

    if (id_barang.length == 1) {
        $.ajax({
            url: 'http://localhost:3000/get/account/detail/' + id_barang,
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
    } else if (id_barang.length > 0 && id_barang.length > 1) {
        $('.modal-edit-akun').attr('action', 'http://localhost:3000/update/account');
        $('.btn-save-akun').removeClass('disabled');
        $('.btn-save-akun').removeAttr('disabled', '');
        $('.username').val("");
        $('.password').val("");
    } else {
        $('.modal-edit-akun').attr('action', '');
        $('.btn-save-akun').addClass('disabled');
        $('.btn-save-akun').attr('disabled', '');
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
