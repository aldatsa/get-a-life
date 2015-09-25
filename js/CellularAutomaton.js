var CellularAutomaton = function(args) {

    this.cells = [];
    this.cells[0] = [];
    this.cells[1] = [];

    this.currentCells = 0;

    this.rules = {
        born: args.rules.born,
        survive: args.rules.survive
    };

    this.colors = args.colors;

    this.height = args.height;
    this.width = args.width;
    this.probability = args.probability;

};

CellularAutomaton.prototype.initialize = function(ctx, type) {

    switch (type) {

        case "r-pentomino":

            for (var y = 0; y < this.height; y++) {

                this.cells[0][y] = [];

            }

            ctx.fillStyle = this.colors[1];

            //  xx
            // xx
            //  x
            this.cells[0][this.height / 2][this.width / 2] = true;
            this.cells[0][this.height / 2][this.width / 2 + 1] = true;
            this.cells[0][this.height / 2 + 1][this.width / 2 - 1] = true;
            this.cells[0][this.height / 2 + 1][this.width / 2] = true;
            this.cells[0][this.height / 2 + 2][this.width / 2] = true;
            
            break;

    }
};

CellularAutomaton.prototype.draw = function(ctx, index) {

    for (var y = 0; y < this.height; y++) {

        for (var x = 0; x < this.width; x++) {

            if (this.cells[index][y][x] === true) {

                ctx.fillStyle = this.colors[1];

            } else {

                ctx.fillStyle = this.colors[0];
            }

            ctx.fillRect(x, y, 1, 1);

        }

    }
};

CellularAutomaton.prototype.drawRandomValues = function(ctx) {

    for (var y = 0; y < this.height; y++) {

        this.cells[0][y] = [];

        for (var x = 0; x < this.width; x++) {

            if (Math.random() < this.probability) {

                this.cells[0][y][x] = true;

                ctx.fillStyle = this.colors[1];

                ctx.fillRect(x, y, 1, 1);

            } else {

                this.cells[0][y][x] = false;

            }

        }

    }

};

CellularAutomaton.prototype.getAliveCellCount = function(x, y, index) {

    var alive_cells = 0;

    // Count surrounding alive cells.

    // Top left
    if (x > 0 && y > 0 && this.cells[index][y - 1][x - 1] === true) {
        alive_cells++;
    }

    // Top
    if (y > 0 && this.cells[index][y - 1][x] === true) {
        alive_cells++;
    }

    // Top right
    if (x < this.width - 1 && y > 0 && this.cells[index][y - 1][x + 1] === true) {
        alive_cells++;
    }

    // Left
    if (x > 0 && this.cells[index][y][x - 1] === true) {
        alive_cells++;
    }

    // Right
    if (x < this.width -1 && this.cells[index][y][x + 1] === true) {
        alive_cells++;
    }

    // Bottom left
    if (x > 0 && y < this.height -1 && this.cells[index][y + 1][x - 1] === true) {
        alive_cells++;
    }

    // Bottom
    if (y < this.height - 1 && this.cells[index][y + 1][x] === true) {
        alive_cells++;
    }

    // Bottom right
    if (x < this.width - 1 && y < this.height - 1 && this.cells[index][y + 1][x + 1] === true) {
        alive_cells++;
    }

    return alive_cells;

};

CellularAutomaton.prototype.drawNextStep = function(ctx) {

    var alive_cells = 0;

    if (this.currentCells === 0) {
        this.currentCells = 1;
        this.previousCells = 0;
        this.cells[1] = this.cells[0];
    } else {
        this.currentCells = 0;
        this.previousCells = 1;
        this.cells[0] = this.cells[1];
    }

    for (var y = 0; y < this.height; y++) {

        for (var x = 0; x < this.width; x++) {

            alive_cells = this.getAliveCellCount(x, y, this.previousCells);

            for (var i = 0; i < this.rules.born.length; i++) {

                if (this.rules.born[i] === true && i === alive_cells) {

                    this.cells[this.currentCells][y][x] = true;

                    ctx.fillStyle = this.colors[1];

                    ctx.fillRect(x, y, 1, 1);

                }

            }

            for (var j = 0; j < this.rules.survive.length; j++) {

                if (this.rules.survive[j] === false && j === alive_cells) {

                    this.cells[this.currentCells][y][x] = false;

                    ctx.fillStyle = this.colors[0];

                    ctx.fillRect(x, y, 1, 1);

                }

            }
        }
    }
};
