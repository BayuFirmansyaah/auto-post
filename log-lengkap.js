$(document).ready(function () {
    let socket = io.connect('http://localhost:3000', { path: '/socket.io' })

    socket.on('crawl', function (result) {
        let code = "";
        let ct = "";
        let i = 1;

        result.forEach((data)=>{
            code +=  `
            <div class="card-header" id="heading${i}">
                        <h2 class="mb-0">
                          <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}" style="font-size: 18px;padding: 0;color: #16161d;">
                            ${data.username}
                            <i class="fas fa-chevron-down float-right" style="margin:6px auto;"></i>
                          </button>
                        </h2>
                      </div>
                      <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                        <div class="card-body">
                          <table class="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th scope="col" width="30px">no</th>
                            <th scope="col">Judul</th>
                            <th scope="col">tanggal post</th>
                            <th scope="col">total views</th>
                        </tr>
                    </thead>
                    <tbody class="unik">
                        
                    </tbody>
                </table>
                        </div>
                      </div>
        `;
               let j = 1;    
            for(let i=0;i<data.crawl.length;i++){
                ct+=`<tr class="baris-data baris-akun">
                            <th scope="row">${j}</th>
                            <td>${data.crawl[i].judul}</td>
                            <td>${data.crawl[i].date}</td>
                            <td>${data.crawl[i].view}</td>
                            </tr>`
                            j++;
                        }
                        i++;
                        
        })
        
        
        $('.card').html(code);
        $('.unik').html(ct);
    
    })
    
})