let getDaysInMonth = function (month, year) {
    return new Date(year, month, 0).getDate();
};

let date = new Date();
let month = date.getMonth();
month += 1;
let year = date.getFullYear();
let count_day = getDaysInMonth(month, year)

let days = `<option selected>Day</option>`;
let day = "";

let hours = `<option selected>Hour</option>`;
let hour = "";

let minutes = `<option selected>Minute</option>`;
let minute = "";

for (let i = 0; i <= count_day; i++) {
    day += `<option value=${i}>${i}</option>`;
}

for (let i = 0; i <= 24; i++) {
    hour += `<option value=${i}>${i}</option>`;
}

for (let i = 0; i <= 60; i++) {
    minute += `<option value=${i}>${i}</option>`;
}

days += day;
minutes += minute;
hours += hour;

$('.day').html(days);
$('.hour').html(hours);
$('.minute').html(minutes);

