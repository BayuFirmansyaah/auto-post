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



// ketika tombol save ditekan 
$('.btn-save').on('click', async function (){
    let id = document.querySelectorAll('.id-barang');
    let id_barang = [];

    id.forEach((id) => {
        if (id.checked) {
            id_barang.push(id.getAttribute('value'));
        }
    });

    if(id_barang.length>0){
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
        dataServer.barang = temporary;
        console.log(dataServer);
        localStorage.setItem("barang", JSON.stringify(temporary));
        alert("Data Berhasil disimpan");
    }else{
        alert("Tidak Ada data item yang dipilih");
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