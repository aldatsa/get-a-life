var CellularAutomaton = function(args) {

    this.cells = [];
    this.cells[0] = [];
    this.cells[1] = [];

    this.current_array_index = 0;
    this.previous_array_index = undefined;

    this.rules = {
        born: args.rules.born,
        survive: args.rules.survive
    };

    this.colors = args.colors;

    this.height = args.height;
    this.width = args.width;
    this.probability = args.probability;

};

CellularAutomaton.prototype.createCellArrays = function() {

    for (var y = 0; y < this.height; y++) {

        this.cells[0][y] = [];
        this.cells[1][y] = [];

        for (var x = 0; x < this.width; x++) {

            this.cells[0][y][x] = false;
            this.cells[1][y][x] = false;

        }

    }

}

CellularAutomaton.prototype.initialize = function(ctx, type) {

    this.createCellArrays();

    switch (type) {

        /*
         * Draws the F-pentomino (also known as R-pentomino).
         * During this early research, Conway discovered that the F-pentomino
         * (which he called the "R-pentomino") failed to stabilize in a small
         * number of generations.
         * In fact, it takes 1103 generations to stabilize, by which time it has
         * a population of 116 and has fired six escaping gliders
         * (these were the first gliders ever discovered).
         *
         * The initial state is like that:
         *
         *          **
         *         **
         *          *
         *
         * http://www.conwaylife.com/wiki/F-pentomino
         */
        case "f-pentomino":

            //  xx
            // xx
            //  x
            /*this.cells[0][this.height / 2][this.width / 2] = true;
            this.cells[0][this.height / 2][this.width / 2 + 1] = true;
            this.cells[0][this.height / 2 + 1][this.width / 2 - 1] = true;
            this.cells[0][this.height / 2 + 1][this.width / 2] = true;
            this.cells[0][this.height / 2 + 2][this.width / 2] = true;
*/
            this.cells[0][1][2] = true;
            this.cells[0][1][3] = true;
            this.cells[0][2][1] = true;
            this.cells[0][2][2] = true;
            this.cells[0][3][2] = true;

            break;

        case "I-shaped-blinker":

            //  x
            //  x    <---->  x x x
            //  x
            this.cells[0][this.height / 2][this.width / 2] = true;
            this.cells[0][this.height / 2 + 1][this.width / 2] = true;
            this.cells[0][this.height / 2 + 2][this.width / 2] = true;
            break;

        case "random":
        default:

            for (var y = 0; y < this.height; y++) {

                for (var x = 0; x < this.width; x++) {

                    if (Math.random() < this.probability) {

                        this.cells[0][y][x] = true;

                    } else {

                        this.cells[0][y][x] = false;

                    }

                }

            }
            break;

    }

    console.log(this.cells[0][0]);
    console.log(this.cells[0][1]);
    console.log(this.cells[0][2]);
    console.log(this.cells[0][3]);
    console.log(this.cells[0][4]);
    console.log(this.cells[0][5]);
    console.log(this.cells[0][6]);
    console.log(this.cells[0][7]);
    console.log(this.cells[0][8]);
    console.log(this.cells[0][9]);

};

CellularAutomaton.prototype.draw = function(ctx) {

    for (var y = 0; y < this.height; y++) {

        for (var x = 0; x < this.width; x++) {

            if (this.cells[this.current_array_index][y][x] === true) {

                ctx.fillStyle = this.colors[1];

            } else {

                ctx.fillStyle = this.colors[0];
            }

            ctx.fillRect(x, y, 1, 1);

        }

    }
};

CellularAutomaton.prototype.isAlive = function(x, y, index) {

    return this.cells[index][y][x];

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

CellularAutomaton.prototype.calculateNextGeneration = function(ctx) {

    var alive_cells = 0;

    if (this.current_array_index === 0) {
        this.current_array_index = 1;
        this.previous_array_index = 0;
    } else {
        this.current_array_index = 0;
        this.previous_array_index = 1;
    }

    // Copy the previous cell array to the current cell array.
    // Careful! JavaScript copies arrays as reference by default ( array1 = array2; // array1 now points to array2)
    this.cells[this.current_array_index] = this.cells[this.previous_array_index].slice();

    for (var y = 0; y < this.height; y++) {

        for (var x = 0; x < this.width; x++) {

            alive_cells = this.getAliveCellCount(x, y, this.previous_array_index);

            // The current cell is dead. Does it born?
            if (!this.isAlive(x, y, this.previous_array_index)) {

                for (var i = 0; i < this.rules.born.length; i++) {

                    if (this.rules.born[i] === true && i === alive_cells) {
                        console.log(y + " " + x + " borns");
                        this.cells[this.current_array_index][y][x] = true;
                        break;
                    }

                }

            // The current cell is alive. Does it survive?
            } else {

                console.log(y + " " + x + " has " + alive_cells + " alive neighbors");

                for (var j = 0; j < this.rules.survive.length; j++) {

                    if (this.rules.survive[j] === false && j === alive_cells) {
                        console.log(y + " " + x + " dies");
                        this.cells[this.current_array_index][y][x] = false;

                        break;
                    }

                }
            }
        }
    }

    console.log(this.cells[this.current_array_index][0]);
    console.log(this.cells[this.current_array_index][1]);
    console.log(this.cells[this.current_array_index][2]);
    console.log(this.cells[this.current_array_index][3]);
    console.log(this.cells[this.current_array_index][4]);
    console.log(this.cells[this.current_array_index][5]);
    console.log(this.cells[this.current_array_index][6]);
    console.log(this.cells[this.current_array_index][7]);
    console.log(this.cells[this.current_array_index][8]);
    console.log(this.cells[this.current_array_index][9]);

};
