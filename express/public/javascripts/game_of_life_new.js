// Constants
var ALIVE = 1;
var DEAD = 0;
var INVERSE = -1;
var BACKGROUND_COLOR = '#f6f6f6';
var GRID_COLOR = '#fff';
var CELL_COLOR = '#555';

var Game_Controller = function() {
    this.running = false;

    this.speed = 50;
    this.max_speed = 100;
    this.min_speed = 0;
    this.base_delay = 2000; // speed at min (100 at max)
    this.speed_step = 10;

    this.view = null;
    this.model = null;

    this.runner = null;

    var controller = this;

    controller.attach_view = function(view) {
        controller.view = view;
    };

    controller.attach_model = function(model) {
        controller.model = model;
    };

    controller.draw = function() {
        controller.view.clear_canvas();
        controller.view.draw(controller.model.grid, controller.model.row, controller.model.col);
    }

    controller.modify = function(row, col, state) {
        controller.model.modify(row, col, state);
    }

    controller.start = function() {
        if (!controller.running) {
            var delay = -(controller.base_delay - 100) / 100 * controller.speed + controller.base_delay;
            controller.view.activate_start();
            controller.running = true;
            controller.runner = setInterval(function() {
                controller.model.evolve();
                controller.draw();
            }, delay);
        }
    }

    controller.stop = function() {
        if (controller.running) {
            controller.view.activate_stop();
            controller.running = false;
            clearInterval(controller.runner);
        }
    }

    controller.clear = function() {
        controller.stop();
        controller.model.kill_all();
        controller.draw();
    }

    controller.speed_up = function() {
        if (controller.speed < controller.max_speed) {
            controller.speed += controller.speed_step;
            if (controller.speed > controller.max_speed) {
                controller.speed = controller.max_speed;
            }

            if (controller.running) {
                controller.stop();
                controller.start();
            }
        }
    }

    controller.speed_down = function() {
        if (controller.speed > controller.min_speed) {
            controller.speed -= controller.speed_step;
            if (controller.speed < controller.min_speed) {
                controller.speed = controller.min_speed;
            }

            if (controller.running) {
                controller.stop();
                controller.start();
            }
        }
    }

    controller.set_speed = function(speed) {
        controller.speed = speed;

        if (controller.running) {
            controller.stop();
            controller.start();
        }
    }

    controller.get_grid_size = function() {
        return [controller.model.row, controller.model.col];
    }
};

var Game_Model = function(controller, row, col) {
    this.controller = controller;

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

    // Grid buffer for storing next generation
    this.grid_buf = [];
    for (var i = 0; i < row; i++) {
        this.grid_buf[i] = [];
        for (var j = 0; j < col; j++) {
            this.grid_buf[i][j] = DEAD;
        }
    }

    this.to_string = function() {
        //the first value is CELL_SIZE
        var string = "C";
        var cell_size = 1;
        string = string.concat(cell_size.toString());
        //second is X
        string = string.concat("X");
        string = string.concat(this.col.toString());
        //third is Y
        string = string.concat("Y");
        string = string.concat(this.row.toString());
        //the remainings are the coordinates of the cells that have state of ALIVE
        string = string.concat("L");
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                if(this.grid[i][j] == ALIVE) {
                    string = string.concat(i + "," + j);
                    string = string.concat("/");
                }
            }
        }
        string = string.concat("E");
        return string;
    };

    this.from_string = function(str) {
        var useless_x = parseInt(str.substring(str.indexOf("X")+1,str.indexOf("Y")));
        var useless_y = parseInt(str.substring(str.indexOf("Y")+1,str.indexOf("L")));

        var coord = str.slice(str.indexOf("L") + 1);

        while (!coord.startsWith("E")) {
            var coords = coord.substring(0, coord.indexOf("/"));
            var loc = coords.split(",");
            this.grid[parseInt(loc[0])][parseInt(loc[1])] = ALIVE;
            coord = coord.slice(coord.indexOf("/")+1);
        }
    };

    this.load_local = function() {
        if (this.local_exist()) {
            this.from_string(localStorage.game_of_life);
            this.clear_local();
        }
    };

    this.save_local = function() {
        localStorage.setItem("game_of_life", this.to_string());
    };

    this.local_exist = function() {
        if (localStorage.game_of_life) {
            return true;
        } else {
            return false;
        }
    }

    this.clear_local = function() {
        localStorage.removeItem("game_of_life");
    }

    this.modify = function(row, col, state) {
        // Clip
        if (row < 0 || row >= this.row || col < 0 || col >= this.col) {
            return;
        }

        if (state == INVERSE) {
            this.grid[row][col] = (this.grid[row][col] == ALIVE) ? DEAD : ALIVE;
        } else {
            this.grid[row][col] = state;
        }
    }

    this.kill_all = function() {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                this.grid[i][j] = DEAD;
            }
        }
    }

    this.evolve = function() {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col; j++) {
                var num_neighbours = this.sum_neighbours(i, j);

                // Rule 1
                if (this.grid[i][j] == ALIVE && num_neighbours < 2) {
                    this.grid_buf[i][j] = DEAD;

                // Rule 2
                } else if (this.grid[i][j] == ALIVE && (
                    num_neighbours == 2 || num_neighbours == 3
                )) {
                    this.grid_buf[i][j] = ALIVE;

                // Rule 3
                } else if (this.grid[i][j] == ALIVE && num_neighbours > 3) {
                    this.grid_buf[i][j] = DEAD;

                // Rule 4
                } else if (this.grid[i][j] == DEAD && num_neighbours == 3) {
                    this.grid_buf[i][j] = ALIVE;

                // Default no change
                } else {
                    this.grid_buf[i][j] = this.grid[i][j];
                }
            }
        }

        this.swap_grids();
    };

    this.sum_neighbours = function(row, col) {
        var total = 0;

        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                // Remove self and clip
                if (
                    (i == 0 && j == 0) ||
                    row+i < 0 || row+i >= this.row ||
                    col+j < 0 || col+j >= this.col
                ) {
                    continue;
                } else {
                    // sum number of live cells
                    total += this.grid[row+i][col+j];
                }
            }
        }

        return total;
    }

    // Swap current grid with grid buffer
    this.swap_grids = function() {
        var temp_grid = this.grid;
        this.grid = this.grid_buf;
        this.grid_buf = temp_grid;
    }
};

var Game_View = function(controller) {
    this.controller = controller;

    this.base_zoom = 5; //px
    this.zoom = 4; // x100%
    this.max_zoom = 11;
    this.min_zoom = 1;
    this.zoom_step = 0.5;

    this.offset_x = 0;
    this.offset_y = 0;

    this.left_mouse_down = false;
    this.right_mouse_down = false;
    this.mouse_moved = false;
    this.left_down_x = 0;
    this.left_down_y = 0;
    this.right_down_x = 0;
    this.right_down_y = 0;

    this.canvas             = document.getElementById('game_canvas');
    this.start_ctrl         = document.getElementById("start");
    this.stop_ctrl          = document.getElementById("stop");
    this.clear_ctrl         = document.getElementById("clearLink");
    this.zoom_ctrl          = document.getElementById("zoom");
    this.zoom_in_ctrl       = document.getElementById("zoomin");
    this.zoom_out_ctrl      = document.getElementById("zoomout");
    this.speed_ctrl         = document.getElementById("speed");
    this.speed_up_ctrl      = document.getElementById("speedup");
    this.speed_down_ctrl    = document.getElementById("speeddown");

    this.canvas_context = this.canvas.getContext('2d');
    this.canvas_width = 1000;
    this.canvas_height = 600;

    var view = this;

    // Sets up cavas to respond to width changes
    view.set_canvas_resize = function() {
        var wrapper = document.getElementsByClassName('on_canvas_controls')[0];
        view.resize_canvas(wrapper.offsetWidth, wrapper.offsetHeight);

        window.addEventListener('resize', function() {
            view.resize_canvas(wrapper.offsetWidth, wrapper.offsetHeight);
            view.controller.draw();
        }, true);

        // Initialise offset to display the center of the grid
        var cell_size = view.get_cell_size();
        var grid_size = view.controller.get_grid_size();
        view.offset_x = -grid_size[1] * cell_size / 2 + view.canvas_width / 2;
        view.offset_y = -grid_size[0] * cell_size / 2 + view.canvas_width / 2;
    }

    // Set canvas sizes
    view.resize_canvas = function(width, height) {
        view.canvas_width = width;
        view.canvas_height = height;

        view.canvas.setAttribute("width", view.canvas_width);
        view.canvas.setAttribute("height", view.canvas_height);
    }

    // Clear canvas
    view.clear_canvas = function() {
        view.canvas_context.clearRect(0, 0, view.canvas_width, view.canvas_height);
        view.canvas_context.fillStyle = BACKGROUND_COLOR;
        view.canvas_context.fillRect(0, 0, view.canvas_width, view.canvas_height);
    }

    // Overlay cells on top of grid
    view.draw = function(grid, row, col) {
        view.draw_grid(row, col);
        view.draw_cells(grid, row, col);
    }

    // Draw grid
    view.draw_grid = function(grid_row, grid_col) {
        var cell_size = view.get_cell_size();

        view.canvas_context.beginPath();

        // Draw vertical lines
        for (var col = 0; col <= grid_col; col++) {
            var x = (col * cell_size) + view.offset_x;
            if (x >= 0 && x < view.canvas_width) {
                view.canvas_context.moveTo(x, 0);
                view.canvas_context.lineTo(x, view.canvas_height);
            }
        }

        // Draw horizontal lines
        for (var row = 0; row <= grid_row; row++) {
            var y = (row * cell_size) + view.offset_y;
            if (y >= 0 && y < view.canvas_height) {
                view.canvas_context.moveTo(0, y);
                view.canvas_context.lineTo(view.canvas_width, y);
            }
        }

        view.canvas_context.strokeStyle = GRID_COLOR;
        view.canvas_context.stroke();
    };

    // Draw alive cells
    view.draw_cells = function(grid, grid_row, grid_col) {
        var cell_size = view.get_cell_size();

        view.canvas_context.fillStyle = CELL_COLOR;

        for (var i = 0; i < grid_row; i++) {
            for (var j = 0; j < grid_col; j++) {
                // Only draw cells that are alive
                if (grid[i][j] == ALIVE) {
                    var y = (i * cell_size) + view.offset_y;
                    var x = (j * cell_size) + view.offset_x;

                    view.canvas_context.fillRect(x, y, cell_size-1, cell_size-1);
                }
            }
        }
    };

    // Conver mouse event into grid coordinates, in [row, col]
    view.cursor_to_grid = function(event) {
        var cell_size = view.get_cell_size();

        if (event.pageX || event.pageY) {
            x = event.pageX;
            y = event.pageY;
        } else {
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
        }

        x -= view.canvas.offsetLeft + view.canvas.offsetParent.offsetLeft;
        y -= view.canvas.offsetTop + view.canvas.offsetParent.offsetTop;

        x = Math.floor((x - view.offset_x) / cell_size);
        y = Math.floor((y - view.offset_y) / cell_size);

        var coords = [y, x];

        return coords;
    };

    // Calculate size of cells based on zoom level
    view.get_cell_size = function() {
        return view.base_zoom * view.zoom;
    }

    // Compare arrays with two elements
    view.coords_equal = function(coords_a, coords_b) {
        return coords_a[0] == coords_b[0] && coords_a[1] == coords_b[1];
    }

    // Activate play icon
    view.activate_start = function() {
        if (view.stop_ctrl.classList.contains("active")) {
            view.stop_ctrl.classList.remove("active");
        }
        if (!view.start_ctrl.classList.contains("active")) {
            view.start_ctrl.classList.add("active");
        }
    }

    // Activate pause icon
    view.activate_stop = function() {
        if (view.start_ctrl.classList.contains("active")) {
            view.start_ctrl.classList.remove("active");
        }
        if (!view.stop_ctrl.classList.contains("active")) {
            view.stop_ctrl.classList.add("active");
        }
    }

    view.update_zoom = function(new_zoom) {
        var scale = new_zoom / view.zoom;

        var center_offset_x = scale * (view.offset_x - view.canvas_width / 2);
        var center_offset_y = scale * (view.offset_y - view.canvas_height / 2);

        view.offset_x = center_offset_x + view.canvas_width / 2;
        view.offset_y = center_offset_y + view.canvas_height / 2;

        view.zoom = new_zoom;
    }


    /*

    Event listeners

    */
    view.canvas.addEventListener("mousedown", function(event) {
        event.preventDefault();

        if (event.button == 0) {
            // Left button
            view.left_mouse_down = true;
            view.left_down_x = event.clientX;
            view.left_down_y = event.clientY;
        }
        if (event.button == 2) {
            // Right button
            view.right_mouse_down = true;
            view.right_down_x = event.clientX;
            view.right_down_y = event.clientY;
        }
    });

    view.canvas.addEventListener("mouseup", function(event) {
        event.preventDefault();

        if (event.button == 0) {
            view.left_mouse_down = false;

            if (!view.mouse_moved) {
                var coords = view.cursor_to_grid(event);
                view.controller.modify(coords[0], coords[1], INVERSE);
                view.controller.draw();
            }

            view.mouse_moved = false;
        }
        if (event.button == 2) {
            view.right_mouse_down = false;
        }
    });

    view.canvas.addEventListener("mousemove", function(event) {
        event.preventDefault();

        if (view.left_mouse_down) {

            if (!view.mouse_moved) {
                var delta_x = Math.abs(view.left_down_x - event.clientX);
                var delta_y = Math.abs(view.left_down_y - event.clientY);

                if (delta_x > 5 || delta_y > 5) {
                    view.mouse_moved = true;
                }
            } else {
                var coords = view.cursor_to_grid(event);
                view.controller.modify(coords[0], coords[1], ALIVE);
                view.controller.draw();
            }
        }
        if (view.right_mouse_down) {
            var delta_x = view.right_down_x - event.clientX;
            var delta_y = view.right_down_y - event.clientY;

            view.offset_x -= delta_x;
            view.offset_y -= delta_y;

            view.right_down_x = event.clientX;
            view.right_down_y = event.clientY;

            view.controller.draw();
        }
    });

    view.canvas.addEventListener("contextmenu", function(event) {
        event.preventDefault();
        return false;
    });

    view.start_ctrl.addEventListener("click", function() {
        view.controller.start();
    });

    view.stop_ctrl.addEventListener("click", function() {
        view.controller.stop();
    });

    view.clear_ctrl.addEventListener("click", function() {
        view.controller.clear();
    });

    view.zoom_in_ctrl.addEventListener("click", function() {
        if (view.zoom < view.max_zoom) {
            view.update_zoom(view.zoom + view.zoom_step);
            if (view.zoom > view.max_zoom) {
                view.update_zoom(view.max_zoom);
            }
            view.zoom_ctrl.value = 10 * view.zoom - 10;

            view.controller.draw();
        }
    });

    view.zoom_out_ctrl.addEventListener("click", function() {
        if (view.zoom > view.min_zoom) {
            view.update_zoom(view.zoom - view.zoom_step);
            if (view.zoom < view.min_zoom) {
                view.update_zoom(view.min_zoom);
            }
            view.zoom_ctrl.value = 10 * view.zoom - 10;

            view.controller.draw();
        }
    });

    view.zoom_ctrl.addEventListener("input", function() {
        view.update_zoom((parseInt(view.zoom_ctrl.value) + 10.0) / 10.0);
        view.controller.draw();
    });

    view.speed_up_ctrl.addEventListener("click", function() {
        view.controller.speed_up();
        view.speed_ctrl.value = view.controller.speed;
    });

    view.speed_down_ctrl.addEventListener("click", function() {
        view.controller.speed_down();
        view.speed_ctrl.value = view.controller.speed;
    });

    view.speed_ctrl.addEventListener("change", function() {
        view.controller.set_speed(parseInt(view.speed_ctrl.value));
    });
};


// Game controller and model
var game_controller     = new Game_Controller();
var game_model          = new Game_Model(game_controller, 300, 300);
game_controller.attach_model(game_model);


// Document ready
document.addEventListener("DOMContentLoaded", function() {
    // Construct game view and attach to controller
    var game_view = new Game_View(game_controller);
    game_controller.attach_view(game_view);

    // Load data from database
    var game_data = document.getElementById('loaded_data').innerHTML;
    if (game_data) {
        game_controller.model.from_string(game_data);
        if (game_controller.model.local_exist()) {
            game_controller.model.clear_local();
        }
    } else {
        // Attemp to load from local storage, may do nothing
        game_controller.model.load_local();
    }


    // Set canvas to resize with window
    game_view.set_canvas_resize();

    // Draw the first time
    game_controller.draw();
});
