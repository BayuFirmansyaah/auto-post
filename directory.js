let id = sessionStorage.getItem('id_user');
let id_selected = [];
$.ajax({
    url: 'http://localhost:3000/get/directory/' + id,
    success: (result) => {
        let code ="";
        result.forEach((data) => {
            code += `<div class="col-2">
                        <div class="folder" data-id=${data.id} data-nama=${data.name} style='background-color:transparent'>
                            <i class="fas fa-folder"></i>
                            <p>${data.name}</p>
                        </div>
                    </div>`;
        })
        code += ` <div class="side-menu-click">
                        <li class="button-side-menu" data-toggle="modal" data-target="#create">
                            Create Folder
                        </li>
                        <li class="button-side-menu" data-toggle="modal" data-target="#rename">
                            Rename Folder
                        </li>
                        <li class="button-side-menu">
                            Delete Folder
                        </li>
                    </div>`
        $('.row-directory').html(code);

        // select folder
        let folder = document.querySelectorAll('.folder')
        folder.forEach((folder)=>{
            folder.addEventListener('click', function () {
                if ($(this).attr('style') == `background-color:transparent`) {
                    $(this).removeAttr('style')
                    $(this).attr('style', 'background-color:blue;color:white')
                    $(this).find('p').attr('style', 'color:white')

                    let selected = document.querySelectorAll('.folder');
                    selected.forEach((e) => {
                        if (e.getAttribute('style') == 'background-color:blue;color:white') {
                            id_selected.push(e.getAttribute('data-id'));
                        }
                    })

                } else {
                    $(this).removeAttr('style')
                    $(this).attr('style', 'background-color:transparent');
                    $(this).find('p').attr('style', 'color:gray')
                }
            })

        })

        for(let i=0;i<folder.length;i++){
            folder[i].addEventListener('dblclick', function () {
                $('.row-directory').html(`<div class="row-image1">
                                        </div>`)
                $('.row-image1').html(`<i class="fas fa-arrow-circle-left"  style="font-size:36px;" onClick="document.location.reload(true)"></i><div class="row-image"></div>`)
                let folder =  $(this).attr('data-nama')
                $.ajax({
                    url : 'http://localhost:3000/get/folder/'+folder,
                    success : (result) =>{
                        let images = ``;
                        result.forEach((img)=>{
                            images+=`  <div class="img">
                                     <img src="/files/${folder}/${img}" alt="${img}">
                                    <p>${img}</p>
                                </div>`
                        })
                        $('.row-image').html(images)
                    },
                    error : (err) =>{
                        console.log(err)
                    }
                })
            })
            }
        
        // open folder
        
    
    },
    error: (err) => {
        console.log(err);
    }
});

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
        doc.style.marginLeft = x + "px"
        doc.style.marginTop = y + "px"
        doc.style.display = "block"
        count += 1;
    } else {
        document.querySelector('.side-menu-click').style.display = "none"
        count -= 1;
    }
    return false;
}, false);

$('.id_user').val(sessionStorage.getItem('id_user'));