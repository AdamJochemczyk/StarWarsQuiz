export const App = ({ options }) => {
  let { swApiBaseUrl, quizMaxTime } = options;
  let isInGame = false;
  const distance_value = 100;
  localStorage.setItem('quizType', '/people'); //quizTypes people, vehicles, starships

  const hallOfFame = [];
  const progress = document.querySelector('.lightsaber_progress--done');
  const loader = document.querySelector('.loader');
  let distance = distance_value;
  const lightSaber = document.querySelector('.lightsaber-wrapper');
  const lighsaberTxt = document.querySelector('.lightsaber__text');
  const quizGameOverPanel = document.querySelector('.gameOver');
  const startPanel = document.querySelector('.swquiz-mode');
  const menuContent1 = document.querySelector('.menu__content_v1');
  const menuContent2 = document.querySelector('.menu__content_v2');
  let rulesTitle = document.querySelector('.menu__title > p');
  let rulesContent = document.querySelector('.menu__content_v1 > p');
   
  //BUTTONS
  const peopleBtn = document.querySelector('#people');
  const vehiclesBtn = document.querySelector('#vehicles');
  const starshipsBtn = document.querySelector('#starships');
  const menuBtns = document.querySelector('.menu__buttons');
  const hallOfFameBtn = document.querySelector('#hallOfFame');
  const playTheGameBtn = document.querySelector('#start-game');
  const submitToHallBtn = document.querySelector('.forceBtn');

  //ANSWER BUTTONS
  const answerButtons = Array.from(document.querySelectorAll('.menu__answer'));

  //input
  const inputUsername = document.querySelector('#username');

  //answers
  let playerAnswers = [];
  let computerAnswers = [];
  let finalAnswers = [];
  let pictureIndex=[];

  //possible numbers of question
  const peopleQuestion = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83];
  const starshipsQuestion = [5,9,10,11,12,13,15,21,22,23,27,28,29,31,39,40,41,43,47,48];
  const vehiclesQuestion = [4,6,7,8,14,16,18,19,20,24,25,26,30,33,34,35,36,37,38,42];
  let quizQuestion = peopleQuestion;

  const setQuizQuestion = (val) => {
    quizQuestion = val;
  };

  const handlePeopleBtnClick=()=>{
    if (!isInGame) {
      localStorage.setItem('quizType', '/people');
      setQuizQuestion(peopleQuestion);
      peopleBtn.classList.add('main-menu__option--selected');
      vehiclesBtn.classList.remove('main-menu__option--selected');
      starshipsBtn.classList.remove('main-menu__option--selected');
      rulesTitle.textContent = `
      Who is this character?
      `;
      rulesContent.textContent = `
      You have one minute (1m) to answer as many questions as possible. During the game on each question you need to select who from Star Wars is showed on the left (Jar Jar Binks right now) from available options.
      `;
      setImage(localStorage.getItem('quizType'), quizQuestion[getRandomInt(quizQuestion.length)]);
    }
  }

  const handleVehiclesBtnClick=()=>{
    if (!isInGame) {
      localStorage.setItem('quizType', '/vehicles');
      setQuizQuestion(vehiclesQuestion);
      peopleBtn.classList.remove('main-menu__option--selected');
      vehiclesBtn.classList.add('main-menu__option--selected');
      starshipsBtn.classList.remove('main-menu__option--selected');
      rulesTitle.textContent = `
      Do you recognize this vehicle?
      `;
      rulesContent.textContent = `
      You have one minute (1m) to answer as many questions as possible. During the game on each question you need to select which vehicle from Star Wars is showed on the left.
      `;
      setImage(localStorage.getItem('quizType'), quizQuestion[getRandomInt(quizQuestion.length)]);
    }
  }

  const handleStarshipsBtnClick=()=>{
    if (!isInGame) {
      localStorage.setItem('quizType', '/starships');
      setQuizQuestion(starshipsQuestion);
      peopleBtn.classList.remove('main-menu__option--selected');
      vehiclesBtn.classList.remove('main-menu__option--selected');
      starshipsBtn.classList.add('main-menu__option--selected');
      rulesTitle.textContent = `
      Do you recognize this starship?
      `;
      rulesContent.textContent = `
      You have one minute (1m) to answer as many questions as possible. During the game on each question you need to select which starship from Star Wars is showed on the left.
      `;
      setImage(localStorage.getItem('quizType'), quizQuestion[getRandomInt(quizQuestion.length)]);
    }
  }
  //choose quiz type
  peopleBtn.addEventListener('click', ()=>handlePeopleBtnClick());

  vehiclesBtn.addEventListener('click', () => handleVehiclesBtnClick());

  starshipsBtn.addEventListener('click', () => handleStarshipsBtnClick());

  const addPlayerAnswer = e => {
    playerAnswers.push(e.target.textContent);
  };

  const getRandomInt = (max)=> {
    return Math.floor(Math.random() * max);
  }

  const generateComputerAnswer = () => {
    computerAnswers.push(answerButtons[getRandomInt(answerButtons.length)].textContent);
  };

  const setImage = (type, val) => {
    let image = document.querySelector('#questionImage'); 
    let newImage = new Image();
    newImage.id = 'questionImage';
    let timestamp=new Date().getTime();
    newImage.alt = timestamp;
    newImage.src =
      `./static/assets/img/modes` +
      type +
      `/` +
      val +
      `.jpg`;
    image.parentNode.insertBefore(newImage, image);
    image.parentNode.removeChild(image);
  };

  const removePossibleAnswerIndex=(index,possible)=>{
    return possible.filter((item) => item !== index)
  }

  const setPossibleAnswers=goodAnswer=>{
    let possible=[0,1,2,3]
    let tmp=getRandomInt(possible.length);
    answerButtons[tmp].textContent=goodAnswer;
    possible = removePossibleAnswerIndex(tmp,possible);
    possible.map(async (el)=>{
      let answer = await getItemName(quizQuestion[getRandomInt(quizQuestion.length)]); 
      answerButtons[el].textContent=answer;
    })
  }

  const getItemName = async (random) => {
    const response = await fetch(
      swApiBaseUrl + localStorage.getItem('quizType') + '/' + random)
    const data = await response.json();
    return data.name;
  };
  
  const getQuestion = async () => {
    let random = getRandomInt(quizQuestion.length);
    let answer = await getItemName(quizQuestion[random]);
    setPossibleAnswers(answer);
    finalAnswers.push(answer);
    setImage(localStorage.getItem('quizType'), quizQuestion[random]);
    pictureIndex.push((quizQuestion[random]))
  };

  const canClickOnChangeQuizType=(can)=>{
    const cursorProperty = can ? 'pointer' : 'inherit';
    peopleBtn.style.cursor = cursorProperty;
    vehiclesBtn.style.cursor = cursorProperty;
    starshipsBtn.style.cursor = cursorProperty;
  }

  const resetAnswers=()=>{
    while (playerAnswers.length > 0) {
      playerAnswers.pop();
    }
    while (computerAnswers.length > 0) {
      computerAnswers.pop();
    }
    while (finalAnswers.length > 0) {
      finalAnswers.pop();
    }
    while (pictureIndex.length > 0) {
      pictureIndex.pop();
    }
  }
  //play game fetching data
  const playGame = () => {
    isInGame = true;
    resetAnswers();
    canClickOnChangeQuizType(false);
    //countDown();
    //startPanel.style.display = 'none';
    //duringGame.style.display = 'block';

    answerButtons.map((aBtn) => {
      aBtn.addEventListener('click', (e) => {
        addPlayerAnswer(e);
        generateComputerAnswer();
        getQuestion();
      });
    });
    getQuestion();
  };

  playTheGameBtn.addEventListener('click', () => playGame());

  const clearUsernameInput = () => {
    inputUsername.value = '';
  };

  const generateLeaderboard=()=>{
    if (hallOfFame.length === 0) {
      menuContent1.innerHTML = "Leaderboard is empty...";

    } else {

      let HTML_hallOfFame = `
      <table style="width:100%">
        <tr>
          <th>Place</th>
          <th>Name</th>
          <th>Score</th>
        </tr> `

      hallOfFame.forEach(function(obj) { 
        HTML_hallOfFame += `
        <tr>
          <td>${hallOfFame.indexOf(obj)+1}</td>
          <td>${obj.username}</td>
          <td>${obj.goodAnswers}</td>
        </tr>
        `
      });

      HTML_hallOfFame +=  `</table>`
      menuContent1.innerHTML = HTML_hallOfFame
    }
  };

  submitToHallBtn.addEventListener('click', e => {
    e.preventDefault();
    let username = inputUsername.value;
    if(username===''){
      alert("Cannot set empty username to hall of fame")
    }else{
    localStorage.setItem('name', username);
    clearUsernameInput();
    hallOfFame.push({
      username: localStorage.getItem("name"),
      goodAnswers: localStorage.getItem("result"),
    });

    hallOfFame.sort((a,b)=>b.goodAnswers - a.goodAnswers);

    if (hallOfFame.length > 3) { 
      hallOfFame.pop(); //remove last item
    };

    quizGameOverPanel.style.display = 'none';
    startPanel.style.display = 'block';
    distance = distance_value; //reset distance value
    menuBtns.style.display = 'flex';
    menuContent1.style.display = 'block';
    menuContent2.style.display = 'none';
    lightSaber.style.display = 'none';
    startPanel.style.display = 'block';
    generateLeaderboard();
    }
  });

  hallOfFameBtn.addEventListener('click', () => {
   generateLeaderboard();
  });

  const validateAnswer=(playerAnswer,goodAnswer)=>{
    if (playerAnswer === goodAnswer) {
      return 'answers--good';
    }
    return "answers--bad"
  }
  const generateSummaryAnswersHTML=()=>{
    let HTML='';
    for(let i=0;i<finalAnswers.length-1;i++){
      HTML += `<div class="answers_col1">
    <img src="./static/assets/img/modes${localStorage.getItem('quizType')}/${
        pictureIndex[i]
      }.jpg" class="answers__img"/>
    </div>
    <p class="answers_col2 ${validateAnswer(
      playerAnswers[i],
      finalAnswers[i],
    )}">${playerAnswers[i]}</p>
    <p class="answers_col3 ${validateAnswer(
      computerAnswers[i],
      finalAnswers[i],
    )}">${computerAnswers[i]}</p>
    <p class="answers_col4">${finalAnswers[i]}</p>
    `;
    }
    return HTML;
  }

  const getPlayerPoints=(answers)=>{
    let points=0;
    for(let i=0;i<answers.length;i++){
      if(finalAnswers[i]===answers[i]) points++
    }
    return points;
  }

  const generateGameOverSummary =()=>{
    let playerScore = getPlayerPoints(playerAnswers);
    localStorage.setItem('result', playerScore);
    const summaryDescription = document.querySelector('p.gameOver__summary');
    const answerTable = document.querySelector('.answers__container');
    const questionsCount=finalAnswers.length-1;
    summaryDescription.textContent = `
    The force is strong in you young Padawan! During 1 minute you have
		answered ${playerScore} / ${questionsCount} questions. And Computer quessed ${getPlayerPoints(computerAnswers)} / ${questionsCount}.
    `;
    answerTable.innerHTML= '';
    const HTML = `
    <p class="answers_col2">You</p>
							<p class="answers_col3">Computer</p>
							<p class="answers_col4">Answer</p>
    ${generateSummaryAnswersHTML()}`;
    answerTable.innerHTML+=HTML
  }

  // start counting down
  function countDown() {
    let minutes = Math.floor(distance / 60);
    let seconds = Math.floor(distance % 60);

    if (minutes < 10) minutes = '0' + minutes;
    if (seconds < 10) seconds = '0' + seconds;

    lighsaberTxt.innerHTML = 'Time Left: ' + minutes + 'm ' + seconds + 's';
    if (distance > 0) {
      setTimeout(countDown, 1000);
      progress.style.height = "100%";
      progress.style.width = ((100 * distance) / distance_value) + "%";
      distance--;
    } else {
      isInGame = false;
      startPanel.style.display = 'none';
      generateGameOverSummary();
      quizGameOverPanel.style.display = 'block';
      canClickOnChangeQuizType(true);
    }
  }

  // spinner 
  playTheGameBtn.addEventListener('click', () => {
    startPanel.style.display = 'none';
    loader.style.display = 'block';
    menuBtns.style.display = 'none';
    menuContent1.style.display = 'none';
    menuContent2.style.display = 'grid';
    lightSaber.style.display = 'block';
  

    setTimeout(() => {
      loader.style.display = 'none';
      startPanel.style.display = 'block';
      setTimeout(countDown, 0);
    }, 1000);
  });

};
