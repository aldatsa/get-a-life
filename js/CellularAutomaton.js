var CellularAutomaton = function(args) {
    "use strict";

    var cells = [],
        current_array_index = 0,
        previous_array_index,
        rules = {
            born: args.rules.born,
            survive: args.rules.survive
        },
        colors = args.colors,
        cell_size = args.cell_size,
        canvas_height = args.height,
        canvas_width = args.width,
        height = canvas_height / cell_size,
        width = canvas_width / cell_size,
        probability = args.probability,
        generation = 0,
        alive_cells_count = 0,

    // Based on http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/
    deepCopy = function(obj) {
        var out, i, len;
        if (Object.prototype.toString.call(obj) === '[object Array]') {
            out = [];
            i = 0;
            len = obj.length;
            for ( ; i < len; i++ ) {
                out[i] = deepCopy(obj[i]);
            }
            return out;
        }
        if (typeof obj === 'object') {
            out = {};
            for ( i in obj ) {
                out[i] = deepCopy(obj[i]);
            }
            return out;
        }
        return obj;
    },

    createCellArrays = function() {

        cells[0] = [];
        cells[1] = [];

        for (var y = 0; y < height; y++) {

            cells[0][y] = [];
            cells[1][y] = [];

            for (var x = 0; x < width; x++) {

                cells[0][y][x] = false;
                cells[1][y][x] = false;

            }

        }

    },

    initialize = function(ctx, type) {

        createCellArrays();

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
                cells[0][height / 2][width / 2] = true;
                cells[0][height / 2][width / 2 + 1] = true;
                cells[0][height / 2 + 1][width / 2 - 1] = true;
                cells[0][height / 2 + 1][width / 2] = true;
                cells[0][height / 2 + 2][width / 2] = true;

                alive_cells_count = 5;

                break;

            case "I-shaped-blinker":

                //  x
                //  x    <---->  x x x
                //  x
                cells[0][height / 2][width / 2] = true;
                cells[0][height / 2 + 1][width / 2] = true;
                cells[0][height / 2 + 2][width / 2] = true;

                alive_cells_count = 3;

                break;

            case "random":
            default:

                for (var y = 0; y < height; y++) {

                    for (var x = 0; x < width; x++) {

                        if (Math.random() < probability) {

                            cells[0][y][x] = true;

                            alive_cells_count++;

                        } else {

                            cells[0][y][x] = false;

                        }

                    }

                }
                break;

        }

    },

    draw = function(ctx) {

        for (var y = 0; y < height; y++) {

            for (var x = 0; x < width; x++) {

                if (cells[current_array_index][y][x] === true) {

                    ctx.fillStyle = colors[1];

                } else {

                    ctx.fillStyle = colors[0];
                }

                ctx.fillRect(x * cell_size, y * cell_size, cell_size, cell_size);

            }

        }
    },

    isAlive = function(x, y, index) {

        return cells[index][y][x];

    },

    getAliveNeighborCount = function(x, y, index) {

        var alive_cells = 0;

        // Count surrounding alive cells.

        // Top left
        if (x > 0 && y > 0 && cells[index][y - 1][x - 1] === true) {

            alive_cells++;
        }

        // Top
        if (y > 0 && cells[index][y - 1][x] === true) {

            alive_cells++;
        }

        // Top right
        if (x < width - 1 && y > 0 && cells[index][y - 1][x + 1] === true) {

            alive_cells++;
        }

        // Left
        if (x > 0 && cells[index][y][x - 1] === true) {

            alive_cells++;
        }

        // Right
        if (x < width -1 && cells[index][y][x + 1] === true) {

            alive_cells++;
        }

        // Bottom left
        if (x > 0 && y < height -1 && cells[index][y + 1][x - 1] === true) {

            alive_cells++;
        }

        // Bottom
        if (y < height - 1 && cells[index][y + 1][x] === true) {

            alive_cells++;
        }

        // Bottom right
        if (x < width - 1 && y < height - 1 && cells[index][y + 1][x + 1] === true) {

            alive_cells++;
        }

        return alive_cells;

    },

    getGenerationCount = function() {

        return generation;

    },

    getAliveCellCount = function() {

        return alive_cells_count;

    },

    calculateNextGeneration = function(ctx) {

        var alive_cells = 0;

        if (current_array_index === 0) {
            current_array_index = 1;
            previous_array_index = 0;
        } else {
            current_array_index = 0;
            previous_array_index = 1;
        }

        // Copy the previous cell array to the current cell array.
        // Careful! JavaScript copies arrays as reference by default ( array1 = array2; // array1 now points to array2)
        // We can't do that:
        // cells[current_array_index] = cells[previous_array_index].slice(0);
        // We must deep copy: http://james.padolsey.com/javascript/deep-copying-of-objects-and-arrays/
        cells[current_array_index] = deepCopy(cells[previous_array_index]);

        for (var y = 0; y < height; y++) {

            for (var x = 0; x < width; x++) {

                alive_cells = getAliveNeighborCount(x, y, previous_array_index);

                // The current cell is dead. Does it born?
                if (!isAlive(x, y, previous_array_index)) {

                    for (var i = 0; i < rules.born.length; i++) {

                        if (rules.born[i] === true && i === alive_cells) {

                            cells[current_array_index][y][x] = true;

                            alive_cells_count++;

                            break;
                        }

                    }

                // The current cell is alive. Does it survive?
                } else {

                    for (var j = 0; j < rules.survive.length; j++) {

                        if (rules.survive[j] === false && j === alive_cells) {

                            cells[current_array_index][y][x] = false;

                            alive_cells_count--;

                            break;
                        }

                    }
                }
            }
        }

        generation++;

    };

    return {
        calculateNextGeneration: calculateNextGeneration,
        draw: draw,
        getAliveCellCount: getAliveCellCount,
        getGenerationCount: getGenerationCount,
        initialize: initialize
    };
};
