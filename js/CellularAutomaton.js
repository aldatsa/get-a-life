var CellularAutomaton = function(args) {

    this.cells = [];

    this.rules = {
        born: args.rules.born,
        survive: args.rules.survive
    };

    this.height = args.height;
    this.width = args.width;
    this.probability = args.probability;

};

CellularAutomaton.prototype.drawRandomValues = function(ctx) {

    ctx.fillStyle = "#000000";

    for (var y = 0; y < this.height; y++) {

        this.cells[y] = [];

        for (var x = 0; x < this.width; x++) {

            if (Math.random() < this.probability) {

                this.cells[y][x] = true;

                ctx.fillRect(x, y, 1, 1);

            } else {

                this.cells[y][x] = false;

            }

        }

    }

};

CellularAutomaton.prototype.drawNextStep = function(ctx) {

    var living_cells = 0;

    for (var y = 0; y < this.height; y++) {

        for (var x = 0; x < this.width; x++) {

            living_cells = 0;

            // Count sourrounding livingthis.cells.

            // Top left
            if (x > 0 && y > 0 && this.cells[y - 1][x - 1] === true) {
                living_cells++;
            }

            // Top
            if (y > 0 && this.cells[y - 1][x] === true) {
                living_cells++;
            }

            // Top right
            if (x < this.width - 1 && y > 0 && this.cells[y - 1][x + 1] === true) {
                living_cells++;
            }

            // Left
            if (x > 0 && this.cells[y][x - 1] === true) {
                living_cells++;
            }

            // Right
            if (x < this.width -1 && this.cells[y][x + 1] === true) {
                living_cells++;
            }

            // Bottom left
            if (x > 0 && y < this.height -1 && this.cells[y + 1][x - 1] === true) {
                living_cells++;
            }

            // Bottom
            if (y < this.height - 1 && this.cells[y + 1][x] === true) {
                living_cells++;
            }

            // Bottom right
            if (x < this.width - 1 && y < this.height - 1 && this.cells[y + 1][x + 1] === true) {
                living_cells++;
            }

            for (var i = 0; i < this.rules.born.length; i++) {

                if (this.rules.born[i] === true && i === living_cells) {

                    this.cells[y][x] = true;

                    ctx.fillStyle = "#000000";

                    ctx.fillRect(x, y, 1, 1);

                }

            }

            for (var j = 0; j < this.rules.survive.length; j++) {

                if (this.rules.survive[j] === false && j === living_cells) {

                    this.cells[y][x] = false;

                    ctx.fillStyle = "#ffffff";

                    ctx.fillRect(x, y, 1, 1);

                }

            }
        }
    }
};
