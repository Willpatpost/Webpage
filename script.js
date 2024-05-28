document.addEventListener("DOMContentLoaded", () => {
    const sizeSelector = document.getElementById("sizeSelector");
    const startButton = document.getElementById("startButton");
    const puzzleGrid = document.getElementById("puzzleGrid");
    const moveCounter = document.getElementById("moveCounter");
    const timerLabel = document.getElementById("timer");
    const gameModal = document.getElementById("gameModal");
    const closeButton = document.querySelector(".close");

    let puzzleSize;
    let puzzle;
    let buttons;
    let moveCount;
    let timer;
    let startTime;

    console.log("DOM fully loaded and parsed");

    // Open the puzzle game modal
    document.getElementById("playButton").addEventListener("click", () => {
        gameModal.style.display = "block";
    });

    // Close the puzzle game modal
    closeButton.addEventListener("click", () => {
        gameModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === gameModal) {
            gameModal.style.display = "none";
        }
    });

    startButton.addEventListener("click", startGame);

    function startGame() {
        puzzleSize = parseInt(sizeSelector.value);
        puzzleGrid.style.gridTemplateColumns = `repeat(${puzzleSize}, 1fr)`;
        puzzleGrid.innerHTML = "";

        buttons = [];
        puzzle = Array.from({ length: puzzleSize * puzzleSize - 1 }, (_, i) => i + 1).concat(0);

        do {
            shufflePuzzle();
        } while (!isSolvable());

        moveCount = 0;
        moveCounter.textContent = `Moves: ${moveCount}`;

        if (timer) {
            clearInterval(timer);
        }
        startTime = Date.now();
        timer = setInterval(updateTimer, 1000);

        puzzle.forEach((num, index) => {
            const button = document.createElement("div");
            button.classList.add("puzzle-button");
            button.textContent = num === 0 ? "" : num;
            button.style.backgroundColor = num === 0 ? "#f0f0f0" : "lightgreen"; // Light green color for visualization
            button.addEventListener("click", () => moveTile(index));
            puzzleGrid.appendChild(button);
            buttons.push(button);
        });
    }

    function shufflePuzzle() {
        for (let i = puzzle.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [puzzle[i], puzzle[j]] = [puzzle[j], puzzle[i]];
        }
    }

    function isSolvable() {
        let inversions = 0;
        for (let i = 0; i < puzzle.length - 1; i++) {
            for (let j = i + 1; j < puzzle.length; j++) {
                if (puzzle[i] && puzzle[j] && puzzle[i] > puzzle[j]) {
                    inversions++;
                }
            }
        }

        if (puzzleSize % 2 === 1) {
            return inversions % 2 === 0;
        } else {
            const emptyRow = Math.floor(puzzle.indexOf(0) / puzzleSize) + 1;
            return (inversions + emptyRow) % 2 === 1;
        }
    }

    function moveTile(index) {
        const emptyIndex = puzzle.indexOf(0);
        const [emptyRow, emptyCol] = [Math.floor(emptyIndex / puzzleSize), emptyIndex % puzzleSize];
        const [tileRow, tileCol] = [Math.floor(index / puzzleSize), index % puzzleSize];

        if (Math.abs(emptyRow - tileRow) + Math.abs(emptyCol - tileCol) === 1) {
            [puzzle[emptyIndex], puzzle[index]] = [puzzle[index], puzzle[emptyIndex]];
            buttons[emptyIndex].textContent = buttons[index].textContent;
            buttons[emptyIndex].style.backgroundColor = "lightgreen"; // Light green for moved tile
            buttons[index].textContent = "";
            buttons[index].style.backgroundColor = "#f0f0f0"; // Empty tile color
            moveCount++;
            moveCounter.textContent = `Moves: ${moveCount}`;
            if (isPuzzleSolved()) {
                clearInterval(timer);
                buttons.forEach(button => button.style.backgroundColor = "gold"); // Gold color for solved puzzle
                alert("Congratulations! You solved the puzzle!");
            }
        }
    }

    function updateTimer() {
        const elapsedTime = Date.now() - startTime;
        const minutes = Math.floor(elapsedTime / 60000);
        const seconds = Math.floor((elapsedTime % 60000) / 1000);
        timerLabel.textContent = `Time: ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function isPuzzleSolved() {
        return puzzle.slice(0, -1).every((num, i) => num === i + 1);
    }
});

function toggleSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.toggle('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}

function openPuzzleGame() {
    console.log("Opening puzzle game modal");
    document.getElementById("gameModal").style.display = "block";
}

function closePuzzleGame() {
    console.log("Closing puzzle game modal");
    document.getElementById("gameModal").style.display = "none";
}
