"use strict";

const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple",
  "red", "blue", "green", "orange", "purple",
];

const colors = shuffle(COLORS);
const winCount = colors.length;

let cardCount = 0;
let firstCard = null;
let freezePlay = false;


createCards(colors);


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
  console.log(`This is cardColor: ${cardColor}`);
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
    console.log(`This is the firstCard: ${firstCard}`);
    return;
  } else if (checkStatus === 'face-down' && !!firstCard) {
    console.log(`This is the second card`);
    flipCard(cardClicked);
    const colorCheck1stCard = firstCard.getAttribute('data-color');
    const colorCheck2ndCard = cardClicked.getAttribute('data-color');
    if (colorCheck1stCard === colorCheck2ndCard) {
      firstCard.setAttribute("data-state", "matched");
      cardClicked.setAttribute("data-state", "matched");
      console.log(`Two cards matched! Resetting firstCard.`);
      firstCard = null;
      cardCount += 2;

      if (cardCount === winCount) {
        console.log(`You won the game!`);
      }
    } else if (colorCheck1stCard !== colorCheck2ndCard) {
      freezePlay = true;
      flipCard(cardClicked);
      console.log(`The cards did NOT match! Restting them.`);
      setTimeout(function() {
        unflipCard(firstCard);
        unflipCard(cardClicked);
        firstCard = null;
        freezePlay = false;
        console.log(`Unflipping firstCard in 1 second.`);
      }, FOUND_MATCH_WAIT_MSECS);
    }
  }
}