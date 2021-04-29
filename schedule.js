let cron_month =null;
let cron_day =null;
let cron_hour =null;
let cron_minute =null;

let getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};

let date = new Date();

let months = ['January', 'February', 'March', 'April', 'May','June',
    'July', 'August', 'September', 'October', 'November','December'];

let month = date.getMonth();

let value_months = `<option value="0" selected>Month</option>`;

for(let i=month;i<months.length;i++){
    let value = i+1;
    value_months += `<option value="${value}">${months[i]}</option>`;
}
$('.Month').html(value_months);
$('.day').html(`<option selected>Day</option>`);

let days = `<option selected>Day</option>`;
$('.Month').change(function(){
    let month = $(this).val();
        cron_month = month;
    if(month == 0){
        $('.day').html(`<option selected>Day</option>`);
    }else{
        let day = "";
        let year = date.getFullYear();
        let count_day = getDaysInMonth(month, year)
        for (let i = 1; i <= count_day; i++) {
            day += `<option value=${i}>${i}</option>`;
        }

        days += day;
        $('.day').html(days);
    }
})

$('.day').change(function () {
    cron_day = $(this).val();
})  

$('.hour').change(function () {
    cron_hour = $(this).val();
})

$('.minute').change(function () {
    cron_minute = $(this).val();
})

let hours = `<option selected>Hour</option>`;
let hour = "";

let minutes = `<option selected>Minute</option>`;
let minute = "";

for (let i = 0; i <= 24; i++) {
    hour += `<option value=${i}>${i}</option>`;
}

for (let i = 0; i <= 60; i++) {
    minute += `<option value=${i}>${i}</option>`;
}


minutes += minute;
hours += hour;


$('.hour').html(hours);
$('.minute').html(minutes);

$('.btn-schedule').on('click',function(){
    let cron_time = { time: `* ${cron_minute} ${cron_hour} ${cron_day} ${cron_month} *`};

    let data = {
        time : cron_time,
        barang: {
            akun: JSON.parse(localStorage.getItem('akun')),
            barang: JSON.parse(localStorage.getItem('item')),
            path: $('.path').val(),
            headless: false
        }
    }

    $.ajax({
        url: 'http://localhost:3000/create/schedule',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: (data) => {
            alert(data);
        }
    })
})