if(sessionStorage.getItem('cek') == 2){
    sessionStorage.setItem('cek', 2)
}else{
    sessionStorage.setItem('cek', 0)
}

const session = (data) => {
    // Check browser support
    if (typeof (Storage) !== "undefined") {
        sessionStorage.setItem('id_user', data.id);
        sessionStorage.setItem('level', data.level);
        sessionStorage.setItem('nama', data.nama);
    } else {
        console.log("Sorry, your browser does not support Web Storage...")
    }

}



if(sessionStorage.getItem('cek')<1){
    $.ajax({
        url: 'http://localhost:3000/session',
        success: (data) => {
            session(data);
            sessionStorage.setItem('cek', 2);
        },
        error: (err) => {
            console.log(err);
        }
    })
}









