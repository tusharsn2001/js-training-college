var rows = 30;
var cols = 60;

var playing = false;


var grid = new Array(rows);
var nextGrid = new Array(rows);

var timer;
var productionTime = 100;

function createGrids(){
    for(let i=0;i<rows;i++)
    {
        grid[i] = new Array(cols);
        nextGrid[i] = new Array(cols);
    }
}
function resetGrids(){
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = 0;
            nextGrid[i][j] = 0;
        }
    }
}

function copyAndResetGrid() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            grid[i][j] = nextGrid[i][j];
            nextGrid[i][j] = 0;
        }
    }
}

//Initialize

function initialize(){
    createTable();
    createGrids();
    resetGrids();
    setupControlButtons();
}

function createTable() {
    var gridContainer = document.getElementById('gridContainer');
    if (!gridContainer) {
        // Throw error
        console.error("Problem: No div for the drid table!");
    }
    var table = document.createElement("table");
    
    for (var i = 0; i < rows; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < cols; j++) {//
            var cell = document.createElement("td");
            cell.setAttribute("id", i + "_" + j);
            cell.setAttribute("class", "dead");
            cell.onclick = cellClickHandler;
            tr.appendChild(cell);
        }
        table.appendChild(tr);
    }
    gridContainer.appendChild(table);
    }


 function cellClickHandler()
 {
    var rowcol = this.id.split("_");
    var row = rowcol[0];
    var col = rowcol[1];

    var classes = this.getAttribute('class');
    if(classes.indexOf('live') > -1){
        this.setAttribute("class","dead");
        grid[row][col]=0;
    }else{
        this.setAttribute("class","live");
        grid[row][col] = 1;
    }
 }   

 function updateView(){
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var cell = document.getElementById(i + "_" + j);
            if (grid[i][j] == 0) {
                cell.setAttribute("class", "dead");
            } else {
                cell.setAttribute("class", "live");
            }
        }
    }
 }

 function setupControlButtons() {
    // button to start
    var startButton = document.getElementById('start');
    startButton.onclick = startButtonHandler;
    
    // button to reset
    var resetButton = document.getElementById('reset');
    resetButton.onclick = resetButtonHandler;
    var randomButton = document.getElementById("random");
    randomButton.onclick = randomButtonHandler;
 }

 function randomButtonHandler() {
    if (playing) return;
    resetButtonHandler();
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var isLive = Math.round(Math.random());
            if (isLive == 1) {
                var cell = document.getElementById(i + "_" + j);
                cell.setAttribute("class", "live");
                grid[i][j] = 1;
            }
        }
    }
}


 function resetButtonHandler(){
    playing = false;
    var startButton = document.getElementById('start');
    startButton.innerHTML = "Start";    
    clearTimeout(timer);
    
    var cellsList = document.getElementsByClassName("live");
    // convert to array first, otherwise, you're working on a live node list
    // and the update doesn't work!
    var cells = [];
    for (var i = 0; i < cellsList.length; i++) {
        cells.push(cellsList[i]);
    }
    
    for (var i = 0; i < cells.length; i++) {
        cells[i].setAttribute("class", "dead");
    }
    resetGrids;
 }

 function startButtonHandler() {
    if (playing) {
        console.log("Pause the game");
        playing = false;
        this.innerHTML = "Continue";
        clearTimeout(timer);
    } else {
        console.log("Continue the game");
        playing = true;
        this.innerHTML = "Pause";
        play();
    }
  }

   function play() {
    computeNextGen();
    
    if (playing) {
        timer = setTimeout(play, productionTime);
    }
  }

function computeNextGen() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            applyRules(i, j);
        }
    }
     // copy NextGrid to grid, and reset nextGrid
     copyAndResetGrid();
     // copy all 1 values to "live" in the table
     updateView();
}

function applyRules(row, col) {
    var numNeighbors = countNeighbors(row, col);
    if (grid[row][col] == 1) {
        if (numNeighbors < 2) {
            nextGrid[row][col] = 0;
        } else if (numNeighbors == 2 || numNeighbors == 3) {
            nextGrid[row][col] = 1;
        } else if (numNeighbors > 3) {
            nextGrid[row][col] = 0;
        }
    } else if (grid[row][col] == 0) {
            if (numNeighbors == 3) {
                nextGrid[row][col] = 1;
            }
        }
    }

    function countNeighbors(row, col) {
        var count = 0;
        if (row-1 >= 0) {
            if (grid[row-1][col] == 1) count++;
        }
        if (row-1 >= 0 && col-1 >= 0) {
            if (grid[row-1][col-1] == 1) count++;
        }
        if (row-1 >= 0 && col+1 < cols) {
            if (grid[row-1][col+1] == 1) count++;
        }
        if (col-1 >= 0) {
            if (grid[row][col-1] == 1) count++;
        }
        if (col+1 < cols) {
            if (grid[row][col+1] == 1) count++;
        }
        if (row+1 < rows) {
            if (grid[row+1][col] == 1) count++;
        }
        if (row+1 < rows && col-1 >= 0) {
            if (grid[row+1][col-1] == 1) count++;
        }
        if (row+1 < rows && col+1 < cols) {
            if (grid[row+1][col+1] == 1) count++;
        }
        return count;
    }
    
    window.onload = initialize;