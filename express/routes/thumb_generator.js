// Constants
var ALIVE = 1;
var DEAD = 0;
var BACKGROUND_COLOR = '#f6f6f6';
var GRID_COLOR = '#fff';
var CELL_COLOR = '#555';

var Game_Model = function(row, col) {
    this.view = null;

    this.row = row;
    this.col = col;

    // Current grid data
    this.grid = [];
    for (var i = 0; i < row; i++) {
        this.grid[i] = [];
        for (var j = 0; j < col; j++) {
            this.grid[i][j] = DEAD;
        }
    }

    this.from_string = function(str) {
        this.view.zoom = parseInt(str.substring(str.indexOf("C")+1,str.indexOf("X")));

        this.view.offset_x = parseInt(str.substring(str.indexOf("X")+1,str.indexOf("Y")));
        this.view.offset_y = parseInt(str.substring(str.indexOf("Y")+1,str.indexOf("L")));

        var coord = str.slice(str.indexOf("L") + 1);

        while (!coord.startsWith("E")) {
            var coords = coord.substring(0, coord.indexOf("/"));
            var loc = coords.split(",");
            this.grid[parseInt(loc[0])][parseInt(loc[1])] = ALIVE;
            coord = coord.slice(coord.indexOf("/")+1);
        }
    };
};

var Game_View = function() {
    this.model = null;

    this.canvas_width = 500;
    this.canvas_height = 500;
    this.base_zoom = 5; //px
    this.zoom = 4;
    this.offset_x = 0;
    this.offset_y = 0;
    this.svg = new SVG_Drawer();

    var view = this;

    // Overlay cells on top of grid
    view.draw = function(grid, row, col) {
        var svg = view.svg.begin(view.canvas_width, view.canvas_height);

        svg += view.draw_grid(row, col);
        svg += view.draw_cells(grid, row, col);

        svg += view.svg.end();

        return svg;
    };

    // Draw grid
    view.draw_grid = function(grid_row, grid_col) {
        var result = '';
        var cell_size = view.get_cell_size();

        result += view.svg.rect(0, 0, view.canvas_width, view.canvas_height, BACKGROUND_COLOR);

        // Draw vertical lines
        for (var col = 0; col <= grid_col; col++) {
            var x = (col * cell_size) + view.offset_x;
            if (x >= 0 && x < view.canvas_width) {
                result += view.svg.line(x, 0, x, view.canvas_height, GRID_COLOR);
            }
        }

        // Draw horizontal lines
        for (var row = 0; row <= grid_row; row++) {
            var y = (row * cell_size) + view.offset_y;
            if (y >= 0 && y < view.canvas_height) {
                result += view.svg.line(0, y, view.canvas_width, y, GRID_COLOR);
            }
        }

        return result;
    };

    // Draw alive cells
    view.draw_cells = function(grid, grid_row, grid_col) {
        var result = '';
        var cell_size = view.get_cell_size();

        for (var i = 0; i < grid_row; i++) {
            for (var j = 0; j < grid_col; j++) {
                // Only draw cells that are alive
                if (grid[i][j] == ALIVE) {
                    var y = (i * cell_size) + view.offset_y;
                    var x = (j * cell_size) + view.offset_x;

                    if (x >= -cell_size && x < view.canvas_width && y >= -cell_size && y < view.canvas_height) {
                        result += view.svg.rect(x, y, cell_size-1, cell_size-1, CELL_COLOR);
                    }
                }
            }
        }

        return result;
    };

    view.get_cell_size = function() {
        return view.base_zoom * view.zoom;
    };
};

var SVG_Drawer = function() {
    this.xml_declare_str = '<?xml version="1.0" encoding="utf-8"?>';
    this.svg_begin_str = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{0}" height="{1}">';
    this.svg_end_str = '</svg>';
    this.rect_str = '<rect x="{0}" y="{1}" width="{2}" height="{3}" style="fill:{4}" />';
    this.line_str = '<line x1="{0}" y1="{1}" x2="{2}" y2="{3}" style="stroke:{4}" />';

    this.begin = function(width, height) {
        return (
            this.xml_declare_str +
            this.svg_begin_str.replace("{0}", width).replace("{1}", height)
        );
    };

    this.end = function() {
        return this.svg_end_str;
    };

    this.rect = function(x, y, width, height, color) {
        return this.rect_str.replace(
            "{0}", x
        ).replace(
            "{1}", y
        ).replace(
            "{2}", width
        ).replace(
            "{3}", height
        ).replace(
            "{4}", color
        );
    };

    this.line = function(x1, y1, x2, y2, color) {
        return this.line_str.replace(
            "{0}", x1
        ).replace(
            "{1}", y1
        ).replace(
            "{2}", x2
        ).replace(
            "{3}", y2
        ).replace(
            "{4}", color
        );
    };
}


module.exports = { Game_Model, Game_View };
