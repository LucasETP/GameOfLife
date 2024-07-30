const numRows = 50;
const numCols = 50;
let isPaused = true;
let intervalId = null;
let intervalSpeed = 100; // Default speed

let grid = Array.from({ length: numRows }, () => Array(numCols).fill(0));

function createTable() {
    const container = document.getElementById('game-container');
    const table = document.createElement('table');

    for (let row = 0; row < numRows; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < numCols; col++) {
            const td = document.createElement('td');
            td.addEventListener('mousedown', () => toggleCellState(row, col, true));
            td.addEventListener('mouseover', () => toggleCellState(row, col, false));
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    container.appendChild(table);
}

function toggleCellState(row, col, forceToggle) {
    if (!isPaused && !forceToggle) return;

    if (forceToggle) {
        grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    } else if (mouseDown) {
        grid[row][col] = grid[row][col] === 1 ? 0 : 1;
    }
    updateTable();
}

function updateTable() {
    const table = document.querySelector('table');
    const rows = table.rows;

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const cell = rows[row].cells[col];
            cell.className = grid[row][col] === 1 ? 'alive' : '';
        }
    }
}

function stepSimulation() {
    const newGrid = Array.from({ length: numRows }, () => Array(numCols).fill(0));

    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
            const aliveNeighbors = countAliveNeighbors(row, col);

            if (grid[row][col] === 1) {
                newGrid[row][col] = (aliveNeighbors === 2 || aliveNeighbors === 3) ? 1 : 0;
            } else {
                newGrid[row][col] = (aliveNeighbors === 3) ? 1 : 0;
            }
        }
    }

    grid = newGrid;
    updateTable();
}

function countAliveNeighbors(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];

    let count = 0;

    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;

        if (newRow >= 0 && newRow < numRows && newCol >= 0 && newCol < numCols) {
            count += grid[newRow][newCol];
        }
    }

    return count;
}

function startSimulation() {
    if (intervalId) return;
    isPaused = false;
    intervalId = setInterval(stepSimulation, intervalSpeed);
    document.getElementById('play-pause-btn').src = 'funnyface.png';
}

function pauseSimulation() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    isPaused = true;
    document.getElementById('play-pause-btn').src = 'funnyface.png';
}

function resetSimulation() {
    grid = Array.from({ length: numRows }, () => Array(numCols).fill(0));
    updateTable();
    pauseSimulation();
}

function updateSpeed() {
    const sliderValue = document.getElementById('speed-slider').value;
    intervalSpeed = minSpeed + (maxSpeed - sliderValue);

    if (!isPaused && intervalId) {
        clearInterval(intervalId);
        intervalId = setInterval(stepSimulation, intervalSpeed);
    }
}

let mouseDown = false;
document.addEventListener('mousedown', () => mouseDown = true);
document.addEventListener('mouseup', () => mouseDown = false);

document.getElementById('play-pause-btn').addEventListener('click', () => {
    if (isPaused) {
        startSimulation();
    } else {
        pauseSimulation();
    }
});

document.getElementById('reset-btn').addEventListener('click', resetSimulation);
document.getElementById('speed-slider').addEventListener('input', updateSpeed);

createTable();
