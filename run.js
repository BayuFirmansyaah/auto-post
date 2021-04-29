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


// ketika tombol save item ditekan 
$('.btn-save').on('click', async function () {
    await Save();
})

// ketika tombol save akun ditekan
$('.btn-saveAkun').on('click', async function(){
    await saveAkun();
})




// jika tombol play ditekan
$('.btn-play').on('click', async function () {
    await Play();
})


//ketika shortcut ditekan
var map = {};
onkeydown = onkeyup = async function (e) {
    e = e || event;
    map[e.keyCode] = e.type == 'keydown';
    if (map[16] && map[70]) {
        showSideBar();
        map = {};
    } else if (map[16] && map[83]) {
        document.querySelectorAll("[aria-label='save']")[0].click()
        map = {};
    } else if (map[16] && map[65]) {
        $('.checked').attr('checked', 'checked');
        map = {};
    } else if (map[16] && map[68]) {
        document.querySelectorAll("[aria-label='hapus']")[0].click()
        map = {};
    }
}


$("select").change(function () {
    let headles
    headles = document.getElementById("namacombobox").value;
});


// ======================================================================================
// ================================= Prototype Functions=================================
// ======================================================================================


// function play account
const Play = async () => {
    // melakukan pengecekan terhadap path
    if ($('.path').val() == null) {
        alert("Path Belum Di Set")
    } else {
        // mendapatkan id akun
        let id = document.querySelectorAll('.id-facebook');
        let id_facebook = [];
        let index = [];

        id.forEach((id) => {
            if (id.checked) {
                id_facebook.push(id.getAttribute('value'));
            }
        })

        for (let i = 0; i < id.length; i++) {
            if (id[i].checked) {
                index.push(i);
            }
        }

        localStorage.setItem('data-akun', JSON.stringify(index));

        // jika data akun lebih dari no
        if (id_facebook.length > 0) {
            // play hidden pause show
            $('.btn-play').addClass('none');
            $('.btn-play').removeClass('show');
            $('.btn-pause').addClass('show');
            $('.btn-pause').removeClass('none');
            $('.btn-edit-all').attr('disabled',"");
            $('.btn-delete-all').attr('disabled',"");
            
            localStorage.setItem("btn", 1);

            let result = await $.ajax({
                url: 'http://localhost:3000/get/account/' + sessionStorage.getItem("id_user"),
                success: async (data) => {
                    return data;
                },
                error: (err) => {
                    console.log(err);
                }
            })

            // melakukan pengurutan akun
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

            // menyimpan data akun di localstorage
            localStorage.setItem('akun', JSON.stringify(temporary));

            // menyimpan data yang akan dikirim ke server
            let data = {
                akun: JSON.parse(localStorage.getItem('akun')),
                barang: JSON.parse(localStorage.getItem('item')),
                path: $('.path').val(),
                headless: JSON.parse(localStorage.getItem('headless'))
            };

                alert('program dijalankan')
                location.reload();

            // mengirimkan perintah run ke server
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
}


//function mendatapatkan value headles
$("select").change(function () {
   let headless = document.getElementById("namacombobox").value;
   localStorage.setItem("headless", headless);
});


// function save data item
const Save = async () => {
    // melakukan pencarian checkbox
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];

    // mendapatkan nilai checkbox
    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    });

 
    localStorage.setItem('data-barang', JSON.stringify(id_barang));

    // melakukan pengecekan nilai yang didapat dari chekbox
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

        // melakukan pengurutan data
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

        // menyimpan data item ke localstorage
        localStorage.setItem('item', JSON.stringify(temporary));

        alert("Data Berhasil disimpan");
        location.reload();
    } else {
        alert("Tidak Ada data item yang dipilih");
    }
}

const saveAkun = async() => {
    let id = document.querySelectorAll('.id-facebook');
    let id_facebook = [];
    let index = [];

    id.forEach((id) => {
        if (id.checked) {
            id_facebook.push(id.getAttribute('value'));
        }
    })

    for (let i = 0; i < id.length; i++) {
        if (id[i].checked) {
            index.push(i);
        }
    }
    alert("Data berhasil disimpan")
    localStorage.setItem('data-akun', JSON.stringify(index));

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
                        alert("Data berhasil disimpan")
                    }
                }
            });

            // menyimpan data akun di localstorage
            localStorage.setItem('akun', JSON.stringify(temporary));
}


// function showSidBar
function showSideBar() {
    // melakukan query element
    let none = document.querySelector('.sidebar-none');
    let block = document.querySelector('.sidebar-block');

    // melakukan pengecekan nilai element
    if (none == null) {
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
            </div>
            <a href="/directory.html">
                <p class="sub-heading "><i class="fas fa-folder-tree"></i></p>
            </a>
            <a href="/schedule.html">
                <p class="sub-heading "><i class="fas fa-calendar-alt"></i></p>
            </a>
            `)


        localStorage.setItem('ls', false);

    } else if (block == null) {
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
            </div>
            <h6 class="text-heading text-primary">DIRECTORY</h6>
                <a href="/directory.html">
                    <p class="sub-heading "><i class="fas fa-folder-tree"></i> File Manager</p>
                </a>
                <h6 class="text-heading text-primary">Task Manager</h6>
        <a href="/schedule.html">
            <p class="sub-heading "><i class="fas fa-calendar-alt"></i> Schedule</p>
        </a>`)


        localStorage.setItem('ls', true);
    }
}


// overflow log selalu dibawah
function updateScroll() {
    var element = document.querySelector(".row-log");
    element.scrollTop = element.scrollHeight;
}

updateScroll();

$(function () {
    $('[data-toggle="tooltip"]').tooltip()
})
