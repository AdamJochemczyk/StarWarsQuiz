export const App = ({options}) => {
  let { swApiBaseUrl, quizMaxTime } = options;
  let quizTime = quizMaxTime;
  let isInGame = false;

  localStorage.setItem('quizType', '/people'); //quizTypes people, vehicles, starships

  const hallOfFame = [];

  const progress = document.querySelector('.lightsaber_progress--done');
  const distance = quizTime;
  //BUTTONS
  const peopleBtn = document.querySelector('#people');
  const vehiclesBtn = document.querySelector('#vehicles');
  const starshipsBtn = document.querySelector('#starships');
  const settingsBtn = document.querySelector('#settings');
  const hallOfFameBtn = document.querySelector('#hallOfFame');
  const playTheGameBtn = document.querySelector('#start-game');
  const submitToHallBtn = document.querySelector('.forceBtn');

  //ANSWER BUTTONS
  const answerButtons=Array.from(document.querySelectorAll('.menu__answer'));

  //input
  const inputUsername = document.querySelector('#username');

  //answers
  const playerAnswers = [];
  const computerAnswers = [];
  const finalAnswers = [];

  //choose quiz type
  peopleBtn.addEventListener('click', () => {
    if (!isInGame) {
      localStorage.setItem('quizType', '/people');
      peopleBtn.classList.add('main-menu__option--selected');
      vehiclesBtn.classList.remove('main-menu__option--selected');
      starshipsBtn.classList.remove('main-menu__option--selected');
    }
  });

  vehiclesBtn.addEventListener('click', () => {
    if (!isInGame) {
      localStorage.setItem('quizType', '/vehicles');
      peopleBtn.classList.remove('main-menu__option--selected');
      vehiclesBtn.classList.add('main-menu__option--selected');
      starshipsBtn.classList.remove('main-menu__option--selected');
    }
  });

  starshipsBtn.addEventListener('click', () => {
    if (!isInGame) {
      localStorage.setItem('quizType', '/starships');
      peopleBtn.classList.remove('main-menu__option--selected');
      vehiclesBtn.classList.remove('main-menu__option--selected');
      starshipsBtn.classList.add('main-menu__option--selected');
    }
  });

  const setQuizTime = (val) => {
    quizTime = val;
  };

  const addPlayerAnswer = (e) => {
    playerAnswers.push(e.target.value);
  };

  const generateComputerAnswer = () => {
    //TO DO
    computerAnswers.push();
  };

  //play game fetching data
  const playGame = () => {
    console.log('playGame');
    isInGame = true;
    //change view to playing

    let playingQuiz = true;
    setTimeout(() => {
      playingQuiz = false;
    }, quizTime);

    answerButtons.map((aBtn) => {
      aBtn.addEventListener('click', (e) => {
        addPlayerAnswer(e);
        generateComputerAnswer();
      });
    });

    //must be right number
    fetch(swApiBaseUrl + localStorage.getItem('quizType') + '/9')
      .then((response) => response.json())
      .then((response) => {
        finalAnswers.push(response.name);
      });

    /*do {
      //fetch question
      //set question
      //set answer
    } while (playingQuiz);//after timeout stop game
    */
    //show final view, generate and validate answers

    isInGame = false;
  };

  playTheGameBtn.addEventListener('click', () => {
    playGame();
  });

  const clearUsernameInput = () => {
    inputUsername.value = '';
  };

  submitToHallBtn.addEventListener('click', () => {
    let username = inputUsername.value;
    clearUsernameInput();
    hallOfFame.push({
      username: username,
      goodAnswers: goodPlayerAnswers,
      questionCount: questionsCount,
    });
    hallOfFame.sort((a, b) => (a.goodAnswers < b.goodAnswers ? 1 : -1)); //sort desc
    if (hallOfFame.length > 3) {
      hallOfFame.pop(); //remove last item
    }
    //remove view
  });

  hallOfFameBtn.addEventListener("click",()=>{
    //generate view
    if(hallOfFame.length===0){
      //textContent hallOfFame is empty
    }else{
      //create div from hallOfFame array data something
    }
  })

  function countDown() {
    var minutes = Math.floor(distance / 60);
    var seconds = Math.floor(distance % 60);

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    document.querySelector('.lightsaber__text').innerHTML =
      'Time Left: ' + minutes + 'm ' + seconds + 's';
    if (distance > 0) {
      setTimeout(countDown, 1000);
      progress.style.width = (100 * (distance - seconds)) / distance;
      console.log((100 * (distance - seconds)) / distance);
      distance--;
    } else {
      document.querySelector('.during_game').style.display = 'none';
      document.querySelector('.swquiz-header').style.display = 'none';
      document.querySelector('.gameOver').style.display = 'block';
    }
  }

  playTheGameBtn.addEventListener('click', () => {
    document.querySelector('.swquiz-mode').style.display = 'none';
    document.querySelector('.loader').style.display = 'block';

    setTimeout(() => {
      document.querySelector('.during_game').style.display = 'block';
      document.querySelector('.loader').style.display = 'none';
      setTimeout(countDown, 1);
    }, 1000);
  });
}