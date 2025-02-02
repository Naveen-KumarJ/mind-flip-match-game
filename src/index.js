const gameGridContainer = document.querySelector(".game-container");
const emojiList = [
    { name: "smile", emoji: "😀" }, 
    { name: "laugh", emoji: "😂" }, 
    { name: "cool", emoji: "😎" }, 
    { name: "rocket", emoji: "🚀" }, 
    { name: "fire", emoji: "🔥" }, 
    { name: "party", emoji: "🎉" }, 
    { name: "pizza", emoji: "🍕" }, 
    { name: "dog", emoji: "🐶" }
];
const finalShuffledList = [...emojiList, ...emojiList];
finalShuffledList.sort(() => Math.random() - 0.5);

finalShuffledList.forEach((eachEmojiObj) => {
    gameGridContainer.innerHTML += `
        <div class="card-wrapper shadow-md w-[44px] md:w-[64px] 2xl:w-[84px] aspect-square relative cursor-pointer">
           <div class="card bg-white shadow-md w-full h-full absolute transition-transform duration-600 ease-in-out transform rotateY-0 text-4xl">
             <div class="context hidden" data-emoji-name='${eachEmojiObj.name}'>${eachEmojiObj.emoji}</div>
           </div>
        </div>
    `;
});

function checkPair(pairArr) {
    return pairArr[0].target.children[0].dataset.emojiName === pairArr[1].target.children[0].dataset.emojiName;
}

let pairArr = [];
let flipBackTimeout;
let attempts = 0;
let attemptsSpan = document.getElementById('attempts-span');
let timerSpan = document.getElementById('timer-span');
let pairedCounts = 0;
let title = document.getElementById('title');
let startBtn = document.getElementById('start-btn');

function startTimer(){
    let hour = 0;
    let min = 0;
    let sec = 0;
    timer = setInterval(()=>{
        sec++;
        if(sec>59){
            sec=0;
            min++;
            if(min>59){
                min=0;
                hour++;
            }
        }
        let result = `${hour>9?hour:'0'+hour}:${min>9?min:'0'+min}:${sec>9?sec:'0'+sec}`;
        timerSpan.innerText = result;
    },1000);
}

startBtn.addEventListener('click',(e)=>{
    if(startBtn.innerText.toLowerCase()=="restart") location.reload();
    startTimer();
    startBtn.innerText = "Restart";
    gameGridContainer.style.display='grid';
    gameGridContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('card')) {
            e.target.classList.toggle('flipped');
    
            if (e.target.classList.contains('card', 'flipped')) {
                pairArr.push(e);
    
                if (pairArr.length === 2) {
                    attempts++;
                    attemptsSpan.innerText = attempts>9?attempts:'0'+attempts;
                    if (!checkPair(pairArr)) {
                        flipBackTimeout = setTimeout(() => {
                            pairArr.forEach(cardEvent => {
                                cardEvent.target.classList.remove('flipped');
                            });
                            pairArr = [];
                        }, 1000);
                    } else {
                        pairedCounts++;
                        pairArr = [];
                        if(pairedCounts==8){
                            title.innerText = "You Won !"
                            clearInterval(timer);
                            gameGridContainer.style.display="";
                            let resultContainer = document.querySelector('.result-container');
                            resultContainer.style.display="flex";
                            // startBtn.innerText="Start";
                            document.getElementById('attempt-result').innerText = attempts;
                            document.getElementById('time-result').innerText = timerSpan.innerText;
                        } 
                    }
                } else if (pairArr.length > 2) {
                    clearTimeout(flipBackTimeout);
                    const firstCard = pairArr.shift();
                    const secondCard = pairArr.shift();
                    firstCard.target.classList.remove('flipped');
                    secondCard.target.classList.remove('flipped');
                }
            }
        }
    });
});
