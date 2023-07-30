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
const game = {
  revealedCount: 0,
  activeTile: null,
  awaitingEndOfMove: false,
  isComparing: false,
};

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

  element.addEventListener("click", handleTileClick);

  return element;
}

// Handle tile click
function handleTileClick(event) {
  const element = event.target.closest(".tile");

  if (!element || game.awaitingEndOfMove || game.isComparing || element.getAttribute("data-revealed") === "true" || element == game.activeTile) {
    return;
  }
  addClickEffect(element);
  const image = element.querySelector("img");
  image.classList.remove("hidden");

  if (!game.activeTile) {
    game.activeTile = element;
  } else {
    const imageToMatch = game.activeTile.getAttribute("data-image");
    const imageUrl = element.getAttribute("data-image");

    if (imageToMatch === imageUrl) {
      element.setAttribute("data-revealed", "true");
      game.activeTile.setAttribute("data-revealed", "true");

      game.activeTile = null;
      game.revealedCount += 2;

      if (game.revealedCount === tileCount) {
        handleGameWin();
      }
    } else {
      game.awaitingEndOfMove = true;
      game.isComparing = true;

      setTimeout(() => {
        image.classList.add("hidden");
        game.activeTile.querySelector("img").classList.add("hidden");

        game.awaitingEndOfMove = false;
        game.isComparing = false;
        game.activeTile = null;
      }, 500);
    }
  }
}

// Handle game win
function handleGameWin() {
  const winDiv = document.querySelector(".win");
  winDiv.innerHTML = "<h2>You Win!</h2>Refresh to play again.";
  winDiv.style.opacity = 1;
  const playAgainBtn = document.createElement("button");
  playAgainBtn.textContent = "Play Again";
  playAgainBtn.classList.add("play-again-btn");
  winDiv.appendChild(playAgainBtn);
  playAgainBtn.addEventListener("click", resetGame);
}

// Reset Game
function resetGame() {
  // Remove existing tiles
  tilesContainer.innerHTML = "";

  // Reset game state
  game.revealedCount = 0;
  game.activeTile = null;
  game.awaitingEndOfMove = false;
  game.isComparing = false;

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
