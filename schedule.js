// let id = $('#id').val();
// console.log(id);
let days = `<option selected>Day</option>`;
$('.Month').change(function(){
    let month = $(this).val();
    if(month == 0){
        $('.day').html(`<option selected>Day</option>`);
    }else{
        let day = "";
        let date = new Date();
        let year = date.getFullYear();
        let count_day = getDaysInMonth(month, year)
        for (let i = 0; i <= count_day; i++) {
            day += `<option value=${i}>${i}</option>`;
        }

        days += day;
        $('.day').html(days);
    }
})

$('.day').html(days);

let getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};



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
