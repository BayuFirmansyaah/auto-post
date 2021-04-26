$('.id_user').val(sessionStorage.getItem('id_user'));
$('.level').val(sessionStorage.getItem('level'));
 let cekbtn = localStorage.getItem("btn");
 if(cekbtn == 0){
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-play').addClass('show');
    $('.btn-play').removeClass('none');
    $('.btn-resume').addClass('none');
    $('.btn-resume').removeClass('show');
    $('.btn-edit-all').removeAttr('disabled');
    $('.btn-delete-all').removeAttr('disabled');
 }else if(cekbtn==1){
    $('.btn-play').addClass('none');
    $('.btn-play').removeClass('show');
    $('.btn-pause').addClass('show');
    $('.btn-pause').removeClass('none');
    $('.btn-edit-all').attr('disabled',"");
    $('.btn-delete-all').attr('disabled',"");
 }else if(cekbtn == 2){
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-resume').addClass('show');
    $('.btn-resume').removeClass('none');
    $('.btn-edit-all').attr('disabled',"");
    $('.btn-delete-all').attr('disabled',"");
 }else if(cekbtn == 3){
    $('.btn-pause').addClass('show');
    $('.btn-pause').removeClass('none');
    $('.btn-resume').addClass('none');
    $('.btn-resume').removeClass('show');
    $('.btn-edit-all').attr('disabled',"");
    $('.btn-delete-all').attr('disabled',"");
 }else{
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-play').addClass('show');
    $('.btn-play').removeClass('none');
    $('.btn-resume').addClass('none');
    $('.btn-resume').removeClass('show');
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

// mendapatkan data akun facebook
$.ajax({
    url: 'http://localhost:3000/get/account/' + sessionStorage.getItem('id_user'),
    success: (Account) => {
        let akun = Account.Search;
        akun = sortByProperty(akun, "akun.username");
        let row = "";
        let i = 1;
        akun.forEach(data => {
            row += `
                    <tr class="baris-data baris-akun">
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



        $('.baris-data').on('click', function () {
            let cek = $(".id-facebook", this)
            if (cek.is(":checked")) {
                $(".id-facebook", this).removeAttr('checked');
            } else {
                $(".id-facebook", this).attr('checked', 'checked');
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

        let dataAkun = JSON.parse(localStorage.getItem('data-akun'));
        let checkbox = document.querySelectorAll('.checked');
        let barisAkun = document.querySelectorAll('.baris-akun');

        for (let i = 0; i < dataAkun.length; i++) {
            let index = dataAkun[i]
            checkbox[index].setAttribute('checked', 'checked');
             barisAkun[index].classList.add('disabled-row')
        }
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
    // pause hidden resume show
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-resume').addClass('show');
    $('.btn-resume').removeClass('none');
    localStorage.setItem("btn", 2);
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
    localStorage.setItem("btn", 3);
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

//jika tombol stop ditekan
$('.btn-stop').on('click', function () {
    $('.btn-pause').addClass('none');
    $('.btn-pause').removeClass('show');
    $('.btn-play').addClass('show');
    $('.btn-play').removeClass('none');
    $('.btn-resume').addClass('none');
    $('.btn-resume').removeClass('show');
    $('.btn-edit-all').removeAttr('disabled');
    $('.btn-delete-all').removeAttr('disabled');
    localStorage.setItem("btn", 0);
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
                <input type="text" class="form-control username" aria-label="Username" name="username"aria-describedby="basic-addon1" value="">
                </div>
                <div class="input-group mb-3">
                <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">password</span>
                </div>
                <input type="text" class="form-control password" aria-label="password" name="password" aria-describedby="basic-addon1">
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

