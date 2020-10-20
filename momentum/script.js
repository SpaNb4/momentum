// DOM Elements
const body = document.querySelector('body');
const btn_bg_change = document.querySelector('.btn_bg_change');
const date = document.querySelector('.date');
const time = document.querySelector('.time');
const greeting = document.querySelector('.greeting');
const name = document.querySelector('.name');
const focus = document.querySelector('.focus');

const btn_quote_change = document.querySelector('.btn_quote_change');
const blockquote = document.querySelector('blockquote');
const figcaption = document.querySelector('figcaption');

let day_period = '';
let base = '';
const images = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg'];
const day_periods = ['morning', 'day', 'evening', 'night'];
let current_day_period = 0;
let i = 0;
let n = 1;

// Show Time
function showTime() {
    let today = new Date();
    // today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 107);
    today.setSeconds(today.getSeconds() + 20);
    let day_week = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];

    let day = day_week[today.getDay()];
    let day_month = today.getDate();
    let month = months[today.getMonth()];
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    // Output Date and Time
    date.innerHTML = `${day}, ${day_month} ${month}`;
    time.innerHTML = `${hour} <span>:</span>${addZero(min)} <span>:</span>${addZero(sec)} `;

    if (min == '0' && sec == '0') {
        getImage();
    }

    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setBgGreet() {
    let today = new Date();
    let hour = today.getHours();

    if (hour < 12 && hour >= 6) {
        // Morning
        day_period = day_periods[0];
        greeting.textContent = 'Доброе Утро,';
    }
    else if (hour < 18 && hour >= 12) {
        // Arternoon
        day_period = day_periods[1];
        greeting.textContent = 'Добрый День,';
    }
    else if (hour < 24 && hour >= 18) {
        // Evening
        day_period = day_periods[2];
        greeting.textContent = 'Доброго Вечера,';
    }
    else {
        // Night
        day_period = day_periods[3];
        greeting.textContent = 'Доброй Ночи,';
    }

    current_day_period = day_periods.indexOf(day_period)
    base = `assets/images/${day_period}/`;
}

// Get Name
function getName() {
    if (localStorage.getItem('name') === null || localStorage.getItem('name') == '⁣⁣') {
        name.textContent = '[Enter Name]';
    }
    else {
        name.textContent = localStorage.getItem('name');
    }
}

// Set Name
function setName(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.which == 13 || e.keyCode == 13) {
            localStorage.setItem('name', e.target.innerText);
            name.blur();
        }
    }
    else {
        localStorage.setItem('name', e.target.innerText);
    }
}

// Get Focus
function getFocus() {
    if (localStorage.getItem('focus') === null || localStorage.getItem('focus') == '⁣⁣') {
        focus.textContent = '[Enter Focus]';
    }
    else {
        focus.textContent = localStorage.getItem('focus');
    }
}

// Set Name
function setFocus(e) {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            localStorage.setItem('focus', e.target.innerText);
            focus.blur();
        }
    }
    else {
        localStorage.setItem('focus', e.target.innerText);
    }
}

function viewBgImage(data) {
    const src = data;
    const img = document.createElement('img');
    img.src = src;
    img.onload = () => {
        body.style.backgroundImage = `url(${src})`;
    };
}

const generator = function* (arr) {
    let i = current_day_period + 1;
    let length = arr.length;
    while (true) {
        yield arr[i];
        i++;
        if (i === length) {
            i = 0
        }
    }
}

const day_period_loop = generator(day_periods);

function getImage(all) {
    let imageSrc = base + images[i];
    viewBgImage(imageSrc);

    if (all) {
        i++;
        if (i >= images.length) {
            i = 0;
            base = `assets/images/${day_period_loop.next().value}/`;
            imageSrc = base + images[i];
        }

    }
    else {
        if (i < images.length - 1) {
            i++;
        }
        else {
            i = 0;
        }
    }
}

function getQuote() {
    fetch('https://cors-anywhere.herokuapp.com/http://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            blockquote.textContent = data.content;
            figcaption.textContent = data.author;
        })
}

name.addEventListener('keypress', setName);
name.addEventListener('blur', setName);
name.addEventListener('click', () => {
    name.textContent = '⁣⁣';
});
name.addEventListener('focusout', () => {
    if (name.textContent == '⁣⁣') {
        name.textContent = '[Enter Name]';
    }
});

focus.addEventListener('keypress', setFocus);
focus.addEventListener('blur', setFocus);
focus.addEventListener('click', () => {
    focus.textContent = '⁣⁣';
});
focus.addEventListener('focusout', () => {
    if (focus.textContent == '⁣⁣') {
        focus.textContent = '[Enter Focus]';
    }
});

document.addEventListener('DOMContentLoaded', getQuote);

btn_bg_change.addEventListener('click', () => {
    let all_img = true;
    getImage(all_img);
});

btn_quote_change.addEventListener('click', getQuote);

// Run
showTime();
setBgGreet();
getName();
getFocus();
getImage();