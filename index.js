if ($('.level').val(sessionStorage.getItem('level')) != "admin") {
    $('.add').addClass('none');
}

$('.id_user').val(sessionStorage.getItem('id_user'));
$('.level').val(sessionStorage.getItem('level'));

$.ajax({
    url: 'http://localhost:3000/get/item/' + sessionStorage.getItem("id_user"),
    success: (data) => {
        let Item = data.Search;
        let row = "";
        let i = 1;
        let nama;
        Item.forEach(data => {
            if (data.account == undefined) {
                nama = "";
            } else {
                nama = data.account;
            }
            row += `
                                <tr>
                                    <th scope="row">${i}</th>
                                     <td class="text-center"> 
                                        <input type="checkbox" class="checked id-barang" value="${data.id_barang}" >
                                    </td>
                                    <td>${data.judul}</td>
                                    <td>${nama}</td>
                                    <td>${data.kode}</td>
                                    <td>${data.gambar}</td>
                                 </tr>
                            `;
            i += 1;
        });
        $('.table-body').html(row);


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
    $('.id_barang').val(id_barang);

    if (id_barang.length > 0) {
        $('.modal-edit-akun').attr('action', 'http://localhost:3000/update/all/email');
        $('.btn-save-akun').removeClass('disabled');
        $('.btn-save-akun').removeAttr('disabled', '');
    } else {
        $('.modal-edit-akun').attr('action', '');
        $('.btn-save-akun').addClass('disabled');
        $('.btn-save-akun').attr('disabled', '');
    }
})
