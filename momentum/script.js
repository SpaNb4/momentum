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

const weatherIcon = document.querySelector('.weather_icon');
const temperature = document.querySelector('.temperature');
const humidity = document.querySelector('.humidity');
const wind_speed = document.querySelector('.wind_speed');
const weatherDescription = document.querySelector('.weather_description');
const city = document.querySelector('.city');

// Show Time
function showTime() {
    let today = new Date();
    let day_week = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];

    let day = day_week[today.getDay()];
    let day_month = today.getDate();
    let month = months[today.getMonth()];
    let hour = today.getHours();
    let min = today.getMinutes();
    let sec = today.getSeconds();
    // Output Date and Time
    date.innerHTML = `${day}, ${day_month} ${month}`;
    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)} `;

    if (min == '0' && sec == '0') {
        setBgGreet();
        getImage();
    }

    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

let current_day_period = 0;
let day_period = '';
const day_periods = ['morning', 'day', 'evening', 'night'];
// Set Background and Greeting
function setBgGreet() {
    let today = new Date();
    let hour = today.getHours();

    if (hour < 12 && hour >= 6) {
        // Morning
        day_period = day_periods[0];
        greeting.textContent = 'Доброе утро,';
    } else if (hour < 18 && hour >= 12) {
        // Arternoon
        day_period = day_periods[1];
        greeting.textContent = 'Добрый день,';
    } else if (hour < 24 && hour >= 18) {
        // Evening
        day_period = day_periods[2];
        greeting.textContent = 'Доброго вечера,';
    } else {
        // Night
        day_period = day_periods[3];
        greeting.textContent = 'Спокойной ночи,';
    }

    current_day_period = day_periods.indexOf(day_period);
    base = `assets/images/${day_period}/`;
}

let str = '';
const setLocalStorage = (input) => (e) => {
    if (e.type === 'keypress') {
        // Make sure enter is pressed
        if (e.code === 'Enter' || e.code === 'NumpadEnter') {
            e.preventDefault();
            if (input.textContent.trim() == '') {
                if (localStorage.getItem(input.className) !== null) {
                    input.textContent = localStorage.getItem(input.className);
                } else {
                    input.textContent = `[Enter ${input.className}]`;
                }
            } else {
                localStorage.setItem(input.className, input.textContent);
            }
            input.blur();
            str = '';
        } else {
            str += e.key;
            if (str[0] != ' ') {
                localStorage.setItem(input.className, str);
            }
        }
    }
    input.onkeydown = function (e) {
        if (e.keyCode == 8 && input.textContent.trim() !== '') {
            if (str.length == 1) {
                str = str.substring(0, str.length - 1);
                localStorage.removeItem(input.className);
            } else {
                str = str.substring(0, str.length - 1);
                localStorage.setItem(input.className, str);
            }
        }
    };
};

function getLocalStorage(input) {
    if (localStorage.getItem(input.className) === null) {
        input.textContent = `[Enter ${input.className}]`;
    } else {
        input.textContent = localStorage.getItem(input.className);
    }
}

function check_valid(input) {
    if (input.textContent.trim() == '') {
        if (localStorage.getItem(input.className) !== null) {
            input.textContent = localStorage.getItem(input.className);
        } else {
            input.textContent = `[Enter ${input.className}]`;
        }
    } else {
        setLocalStorage(input);
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
            i = 0;
        }
    }
};

const day_period_loop = generator(day_periods);
let base = '';
let i = 0;
const images = shuffle(['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg']);

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
    } else {
        if (i < images.length - 1) {
            i++;
        } else {
            i = 0;
        }
    }

    btn_bg_change.disabled = true;
    setTimeout(function () {
        btn_bg_change.disabled = false;
    }, 1000);
}

function getQuote() {
    fetch('https://api.quotable.io/random?maxLength=60')
        .then((response) => response.json())
        .then((data) => {
            blockquote.textContent = data.content;
            figcaption.textContent = data.author;
        });
}

function getWeather() {
    if (localStorage.getItem('city') === null) {
        city.textContent = '[Enter city]';
    } else {
        city.textContent = localStorage.getItem('city');
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city.textContent}&lang=ru&appid=2e4027bfcfa973ef9714090040aba12a&units=metric`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.message == 'city not found') {
                    weatherIcon.className = 'weather_icon owf';
                    temperature.textContent = '';
                    humidity.textContent = '';
                    wind_speed.textContent = '';
                    weatherDescription.style='background-color: #dc143c;';
                    weatherDescription.textContent = 'Ошибка, попробуйте ввести другой город.';
                } else {
                    weatherIcon.className = 'weather_icon owf';
                    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
                    temperature.textContent = `${data.main.temp}°C`;
                    humidity.textContent = `Влажность: ${data.main.humidity}%`;
                    wind_speed.textContent = `Скорость ветра: ${data.wind.speed} м/c`;
                    weatherDescription.style=' background-color: #44aadd;';
                    weatherDescription.textContent = data.weather[0].description;
                }
            });
    }
}

function shuffle(array) {
    let arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function input_listener(input) {
    input.addEventListener('keypress', setLocalStorage(input));
    input.addEventListener('click', () => {
        input.textContent = '';
    });
    input.addEventListener('blur', () => {
        check_valid(input);
        str = '';
        if (input == city) {
            getWeather();
        }
    });
}

let input = [name, focus, city];
input.forEach((el) => {
    input_listener(el);
});

document.addEventListener('DOMContentLoaded', () => {
    getQuote();
    getWeather();
});

btn_bg_change.addEventListener('click', () => {
    let all_img = true;
    getImage(all_img);
});

btn_quote_change.addEventListener('click', getQuote);

// Run
showTime();
setBgGreet();
getLocalStorage(name);
getLocalStorage(focus);
getImage();
