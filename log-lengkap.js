$(document).ready(function () {
    let socket = io.connect('http://localhost:3000', { path: '/socket.io' })

    socket.on('crawl', function (result) {
        let code = "";
        let row = [];

        for(let i=0;i<result.length;i++){
            code+=(`
                <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link btn-block text-left collapsed" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}" style="font-size: 18px;padding: 0;color: #16161d;">
                            ${result[i].username}
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
                                    <th scope="col" width="60px"><input type="checkbox" class="chekedAll"
                                            style="margin-left: 10px;"></th>
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
        `);
            let ct = "";
            let number = 1;
            for(let j=0;j<result[i].crawl.length;j++){
                ct += `<tr class="baris-data baris-akun">
                            <th scope="row">${number}</th>
                            <td class="text-center">
                            <input type="checkbox" class="checked id-facebook" value=""
                            </td>
                            <td>${result[i].crawl[j].judul}</td>
                            <td>${result[i].crawl[j].date}</td>
                            <td>${result[i].crawl[j].view}</td>
                        </tr>`
                number+=1;
            }

            row.push(ct);

        }
    
        $('.card').html(code)

        for(let i=0;i<row.length;i++){
            document.querySelectorAll('.unik')[i].innerHTML = row[i]; 
        }

        let chekedAll = document.querySelectorAll('.chekedAll')
        let baris = document.querySelectorAll('.unik')
        
        for(let i=0;i<chekedAll.length;i++){
            chekedAll[i].addEventListener('change',function () {
                let cheked = baris[i].querySelectorAll('.checked');
                if (this.checked) {
                    cheked.forEach((cheked)=>{
                        cheked.setAttribute('checked','checked')
                    })
                } else {
                    cheked.forEach((cheked) => {
                        cheked.removeAttribute('checked', 'checked')
                    })
                }
            })
        }
    


    })
    
})