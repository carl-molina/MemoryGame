"use strict";

const FOUND_MATCH_WAIT_MSECS = 1000;
let COLORS_SINGLE = [];
let COLORS_DOUBLE = [];

const numOfTiles = document.querySelector('#play-start');
document.addEventListener('DOMContentLoaded', function(event) {
  // console.log(`The DOM has loaded!`);
  numOfTiles.addEventListener('submit', function(event) {
    event.preventDefault();
    const gameArea = document.querySelector('div.game-area');
    gameArea.scrollIntoView();
    COLORS_SINGLE = [];
    COLORS_DOUBLE = [];
    const num = document.querySelector('input[name="num-of-tiles"]');
    const numberOfTiles = Number(num.value);
    // console.log(`Submit works!`);
    for (let i = 0; i < numberOfTiles / 2; i++) {
      let newColor = randomColor();
      COLORS_SINGLE.push(newColor);
    }
    // console.log(`This is COLORS_SINGLE: ${COLORS_SINGLE}`);
    COLORS_DOUBLE = [...COLORS_SINGLE, ...COLORS_SINGLE];
    colors = shuffle(COLORS_DOUBLE);
    winCount = colors.length;
    createCards(colors);

    // When player wants to make new game w/ different number of cards.
    const oldCards = document.querySelectorAll('#game div');
    for (let i = 0; i < oldCards.length; i++) {
      oldCards[i].remove();
    }
    cardCount = 0;
    firstCard = null;
    freezePlay = false;
    colors = shuffle(COLORS_DOUBLE);
    winCount = colors.length;
    createCards(colors);
    guessCount = 0;
    const guessCounter = document.getElementById('guess-count-num');
    guessCounter.innerText = null;
  });
});


function randomColor() {
  const letters = '0123456789ABCDEF';
  let hex = '#';
  for (let i = 0; i < 6; i++) {
    hex += letters[Math.floor(Math.random() * 16)];
  }
  return hex;
}

let colors = shuffle(COLORS_DOUBLE);
let winCount = colors.length;
let cardCount = 0;
let firstCard = null;
let freezePlay = false;
let guessCount = 0;
let lowestScore = Infinity;

createCards(colors);

// retrieve from localStorage
const savedRecord = JSON.parse(localStorage.getItem('record')) || [];
for (let obj of savedRecord) {
  if (Number(obj.record) < lowestScore) {
    lowestScore = obj.record;
  }
}
const bestRecord = document.getElementById('best-record-num');
bestRecord.innerText = lowestScore;


function shuffle(items) {

  for (let i = items.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * i);
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

function createCards(colors) {
  const gameBoard = document.getElementById("game");

  for (let color of colors) {
    const newCard = document.createElement('div');
    newCard.classList.add(color);
    newCard.setAttribute('data-color', color);
    newCard.setAttribute('data-state', 'face-down');
    newCard.addEventListener('click', handleCardClick);
    gameBoard.appendChild(newCard);
  }
}

/** Flip a card face-up. */

function flipCard(card) {
  card.setAttribute('data-state', 'face-up');
  const cardColor = card.getAttribute('data-color');
  // console.log(`This is cardColor: ${cardColor}`);
  card.style.backgroundColor = cardColor;
}

/** Flip a card face-down. */

function unflipCard(card) {
  card.setAttribute('data-state', 'face-down');
  card.style.backgroundColor = null;
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick(evt) {
  const cardClicked = evt.target;
  const checkStatus = cardClicked.getAttribute("data-state");
  if (checkStatus === 'face-up' || checkStatus === "matched"
      || cardClicked === firstCard || freezePlay) {
    return;
  } else if (checkStatus === 'face-down' && !firstCard) {
    flipCard(cardClicked);
    firstCard = cardClicked;
    // console.log(`This is the firstCard: ${firstCard}`);
    return;
  } else if (checkStatus === 'face-down' && !!firstCard) {
    // console.log(`This is the second card`);
    flipCard(cardClicked);
    const colorCheck1stCard = firstCard.getAttribute('data-color');
    const colorCheck2ndCard = cardClicked.getAttribute('data-color');

    guessCount++;
    const guessCounter = document.getElementById('guess-count-num');
    guessCounter.innerText = guessCount;

    if (colorCheck1stCard === colorCheck2ndCard) {
      firstCard.setAttribute("data-state", "matched");
      cardClicked.setAttribute("data-state", "matched");
      // console.log(`Two cards matched! Resetting firstCard.`);
      firstCard = null;
      cardCount += 2;

      if (cardCount === winCount) {
        // console.log(`You won the game!`);
        if (guessCount < lowestScore) {
          lowestScore = guessCount;
          const bestRecord = document.getElementById('best-record-num');
          bestRecord.innerText = lowestScore;

          // save to localStorage
          savedRecord.push({record: bestRecord.innerText});
          localStorage.setItem("record", JSON.stringify(savedRecord));
        }
      }
    } else if (colorCheck1stCard !== colorCheck2ndCard) {
      freezePlay = true;
      flipCard(cardClicked);
      // console.log(`The cards did NOT match! Resetting them.`);
      setTimeout(function() {
        unflipCard(firstCard);
        unflipCard(cardClicked);
        firstCard = null;
        freezePlay = false;
        // console.log(`Unflipping firstCard in 1 second.`);
      }, FOUND_MATCH_WAIT_MSECS);
    }
  }
}

const resetGame = document.querySelector('#play-again');

resetGame.addEventListener('click', function(e) {
  e.preventDefault();
  const oldCards = document.querySelectorAll('#game div');
  for (let i = 0; i < oldCards.length; i++) {
    oldCards[i].remove();
  }
  cardCount = 0;
  firstCard = null;
  freezePlay = false;
  colors = shuffle(COLORS_DOUBLE);
  winCount = colors.length;
  createCards(colors);
  guessCount = 0;
  const guessCounter = document.getElementById('guess-count-num');
  guessCounter.innerText = null;
});