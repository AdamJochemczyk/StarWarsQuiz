import 'regenerator-runtime/runtime' //async/await with Parcel
import {App} from "./app/App";


const ONE_SECOND_MILLIS = 1000;
const SW_API_BASE_URL = process.env.SW_API_BASE_URL || "https://swapi.dev/api";
const QUIZ_MAX_TIME = process.env.QUIZ_MAX_TIME_SECONDS ? process.env.QUIZ_MAX_TIME_SECONDS * ONE_SECOND_MILLIS : 120 * ONE_SECOND_MILLIS;

window.onload = () => App({options: {swApiBaseUrl: SW_API_BASE_URL, quizMaxTime: QUIZ_MAX_TIME}})

var progress = document.querySelector('.lightsaber_progress--done');
var distance = 120*5;

function countDown() {
    var minutes = Math.floor(distance / 60);
    var seconds = Math.floor(distance % 60);
    
    if (minutes<10) minutes = "0"+minutes;
    if (seconds<10) seconds = "0"+seconds;
    
    document.querySelector(".lightsaber__text").innerHTML = "Time Left: " + minutes + "m " + seconds + "s";
    if (distance > 0) {
        setTimeout(countDown,1000);
        progress.style.width = (100 * (distance-seconds)) / distance; 
        console.log((100 * (distance-seconds)) / distance)
        distance--;
    }
    else {
        document.querySelector('.during_game').style.display='none';
        document.querySelector('.swquiz-header').style.display='none';
        document.querySelector('.gameOver').style.display='block';
    }     
}

document.querySelector('.start-game').addEventListener('click', () => {
    document.querySelector('.swquiz-mode').style.display='none';
    document.querySelector('.loader').style.display='block';
    
    setTimeout(() => {
        document.querySelector('.during_game').style.display='block';
        document.querySelector('.loader').style.display='none';
        setTimeout(countDown,1)
    }, 1000);
});    