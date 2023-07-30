const tilesContainer = document.querySelector(".tiles");
const imageUrls = [
  "img/angular.svg",
  "img/aurelia.svg",
  "img/html.svg",
  "img/java.svg",
  "img/js-badge.svg",
  "img/python-icon.svg",
  "img/react.svg",
  "img/vue.svg",
];
const imagesPicklist = [...imageUrls, ...imageUrls];
const tileCount = imagesPicklist.length;

// Game state
let revealedCount = 0;
let activeTile = null;
let awaitingEndOfMove = false;

// Add effect for tile
function addClickEffect(tile) {
  tile.classList.add("clicked");
  setTimeout(() => {
    tile.classList.remove("clicked");
  }, 200);
}

// Build Tile
function buildTile(imageUrl) {
  const element = document.createElement("div");
  const image = document.createElement("img");

  element.classList.add("tile");
  element.setAttribute("data-image", imageUrl);
  element.setAttribute("data-revealed", "false");

  image.src = imageUrl;
  image.classList.add("hidden");

  element.appendChild(image);

  element.addEventListener("click", () => {
    addClickEffect(element);
    const revealed = element.getAttribute("data-revealed");

    if (awaitingEndOfMove || revealed === "true" || element == activeTile) {
      return;
    }

    // Reveal this image
    image.classList.remove("hidden");

    if (!activeTile) {
      activeTile = element;

      return;
    }

    const imageToMatch = activeTile.getAttribute("data-image");

    if (imageToMatch === imageUrl) {
      element.setAttribute("data-revealed", "true");
      activeTile.setAttribute("data-revealed", "true");

      activeTile = null;
      awaitingEndOfMove = false;
      revealedCount += 2;

      // Display text + button to reset when you win
      if (revealedCount === tileCount) {
        const winDiv = document.querySelector('.win');
        winDiv.innerHTML = "<h2>You Win!</h2>Refresh to play again.";
        winDiv.style.opacity = 1;
        const playAgainBtn = document.createElement('button');
        playAgainBtn.textContent = "Play Again";
        playAgainBtn.classList.add("play-again-btn");
        winDiv.appendChild(playAgainBtn);
        playAgainBtn.addEventListener('click', resetGame);
      }

      return;
    }

    awaitingEndOfMove = true;

    setTimeout(() => {
      image.classList.add("hidden");
      activeTile.firstChild.classList.add("hidden");

      awaitingEndOfMove = false;
      activeTile = null;
    }, 500);
  });

  return element;
}

// Reset Game
function resetGame() {
  // Remove existing tiles
  tilesContainer.innerHTML = "";

  // Reset game state
  revealedCount = 0;
  activeTile = null;
  awaitingEndOfMove = false;

  // Rebuild tiles
  imagesPicklist.push(...imageUrls);
  createTiles();

  // Hide the "You win!" message
  const winDiv = document.querySelector('.win');
  winDiv.style.opacity = 0;
}

// Build up tiles
function createTiles() {
  for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * imagesPicklist.length);
    const imageUrl = imagesPicklist[randomIndex];
    const tile = buildTile(imageUrl);

    imagesPicklist.splice(randomIndex, 1);
    tilesContainer.appendChild(tile);
  }
}

createTiles();
