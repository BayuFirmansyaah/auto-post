



$(document).ready(function () {

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

$('.content').mousedown(function (event) {
    switch (event.which) {
        case 1:
            document.querySelector('.side-menu-click').style.display = "none"
            break;
        case 2:
            alert('Middle Mouse button pressed.');
            break;
        case 3:
            let x = event.clientX;
            x -= 260;
            let y = event.clientY;
            y -= 200;
            document.querySelector('.side-menu-click').style.marginLeft = x + "px"
            document.querySelector('.side-menu-click').style.marginTop = y + "px"
            document.querySelector('.side-menu-click').style.display = "block"
            break;
        default:
            alert('You have a strange Mouse!');
    }
});

let content = document.querySelector('.content');
content.addEventListener('contextmenu', function (ev) {
    ev.preventDefault();
    return false;
}, false);