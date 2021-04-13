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

let dataServer = {
    akun: null,
    barang: null,
    path: null
};



// ketika tombol save item ditekan 
$('.btn-save').on('click', async function () {
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];

    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    });

    if (id_barang.length > 0) {
        let result = await $.ajax({
            url: 'http://localhost:3000/get/item/' + sessionStorage.getItem("id_user"),
            success: async (data) => {
                return data;
            },
            error: (err) => {
                console.log(err);
            }
        })

        let temporary = [];
        let Item = result.Search;
        Item = sortByProperty(Item, "Item.account");
        await Item.forEach((item) => {
            for (let i = 0; i < id_barang.length; i++) {
                if (id_barang[i] == item.id_barang) {
                    temporary.push(item);
                }
            }
        })
        localStorage.setItem('item', JSON.stringify(temporary));
        alert("Data Berhasil disimpan");
        location.reload();
    } else {
        alert("Tidak Ada data item yang dipilih");
    }

})

 
let items = localStorage.getItem('daftar_nama');

// jika tombol play ditekan
$('.btn-play').on('click', async function () {
    $('.btn-play').addClass('none');
    $('.btn-play').removeClass('show');
    $('.btn-pause').addClass('show');
    $('.btn-pause').removeClass('none');
    if ($('.path').val() == null) {
        alert("Path Belum Di Set")
    } else {
        // mendapatkan id akun
        let id = document.querySelectorAll('.id-facebook');
        let id_facebook = [];

        id.forEach((id) => {
            if (id.checked) {
                id_facebook.push(id.getAttribute('value'));
            }
        })

        // jika data akun lebih dari no
        if (id_facebook.length > 0) {
            let result = await $.ajax({
                url: 'http://localhost:3000/get/account/' + sessionStorage.getItem("id_user"),
                success: async (data) => {
                    return data;
                },
                error: (err) => {
                    console.log(err);
                }
            })

            let temporary = [];
            let Akun = result.Search;
            Akun = sortByProperty(Akun, "Akun.username");
            await Akun.forEach((Akun) => {
                for (let i = 0; i < id_facebook.length; i++) {
                    if (id_facebook[i] == Akun.id) {
                        temporary.push(Akun);
                    }
                }
            });
            localStorage.setItem('akun', JSON.stringify(temporary));

            // menyimpan data yang akan dikirim ke server
            let data = {
                akun: JSON.parse(localStorage.getItem('akun')),
                barang: JSON.parse(localStorage.getItem('item')),
                path: $('.path').val()
            };

            console.table(data);

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
        } else {
            alert("Tidak ada data akun yang dipilih");
        }

    }
})




var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
e = e || event; // to deal with IE
map[e.keyCode] = e.type == 'keydown';
/* insert conditional here */
if(map[16] && map[70]){ // CTRL+SHIFT+A
let none = document.querySelector('.sidebar-none');
let block = document.querySelector('.sidebar-block');

if(none == null){
    document.querySelector('.sidebar').classList.add('sidebar-none')
    document.querySelector('.sidebar').classList.remove('sidebar-block')
    document.querySelector('.content').classList.add('table-none')
    document.querySelector('table').classList.add('table-full')
    document.querySelector('.row-table').classList.add('.row-table-none')
    $('.sidebar').html(`  <a href="/google.html">
    <p class="sub-heading "><i class="fab fa-facebook"></i></p>
</a>
<a href="/indexing.html">
    <p class="sub-heading "><i class="fas fa-server"></i></p>
</a>
<div data-toggle="modal" data-target="#path">
    <p class="sub-heading "><i class="fas fa-map-marker-alt"></i></p>
</div>`)
localStorage.setItem('ls',false);
    
}else if(block == null){
    document.querySelector('.sidebar').classList.remove('sidebar-none')
    document.querySelector('.sidebar').classList.add('sidebar-block')
    document.querySelector('.content').classList.remove('table-none')
    document.querySelector('.table').classList.remove('table-full')
    document.querySelector('.row-table').classList.remove('.row-table-none')
    $('.sidebar').html(` <h6 class="text-heading text-primary">DATA ACCOUNTS</h6>
    <a href="/google.html">
        <p class="sub-heading "><i class="fab fa-facebook"></i> Facebook Accounts</p>
    </a>
    <h6 class="text-heading text-primary">INVENTORY</h6>
    <a href="/indexing.html">
        <p class="sub-heading "><i class="fas fa-server"></i> Item</p>
    </a>
    <div data-toggle="modal" data-target="#path">
        <p class="sub-heading "><i class="fas fa-map-marker-alt"></i> Path Image</p>
    </div>`)
    localStorage.setItem('ls',true);
}
map = {};
}
}
        
