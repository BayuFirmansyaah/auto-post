let id = sessionStorage.getItem('id_user');

$.ajax({
    url: 'http://localhost:3000/get/directory/13',
    success : (result) =>{
        let code = "";
        result.forEach((data)=>{
            code += `<div class="col-2">
                        <div class="folder" data-id=${data.id} >
                            <i class="fas fa-folder"></i>
                            <p>${data.name}</p>
                        </div>
                    </div>
`;
        $('.row-directory').html(code);

        })
    },
    error : (err) => {
            console.log(err);
    }
})

if (localStorage.getItem('ls') === "true") {
    // document.querySelector('.table').classList.remove('table-full')
    // document.querySelector('.row-table').classList.remove('.row-table-none')
    document.querySelector('.sidebar').classList.remove('sidebar-none')
    document.querySelector('.sidebar').classList.add('sidebar-block')
    document.querySelector('.content').classList.remove('table-none')
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
        </a>`)

} else if (localStorage.getItem('ls') === "false") {
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
<a href="/google.html">
    <p class="sub-heading "><i class="fas fa-folder-tree"></i></p>
        </a>`)


}

let count = 0;
let content = document.querySelector('.content');
content.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    let x = ev.clientX;
    x -= 260;
    let y = ev.clientY;
    y -= 200;
    if (count == 0) {
        let doc = document.querySelector('.side-menu-click')
        doc.attr(marginLeft = x + "px")
        doc.attr(marginTop = y + "px")
        doc.attr(display = "block")
        count += 1;
    } else {
        document.querySelector('.side-menu-click').style.display = "none"
        count -= 1;
    }

    return false;
}, false);

