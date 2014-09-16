var conway = (function(){
		var height = 500;
		var width = 500;
		
		var interval = null;

		var arr1,arr2;

	
	function makeArray (width, height, grid_size){
		var x = new Array(grid_size);
		var cell_width = width / grid_size;
		var cell_height = height / grid_size;
	  	for (var i = 0; i < grid_size; i++) {
	    	x[i] = new Array(grid_size);
	    	for (var j = 0; j < grid_size; j++){
	    		x[i][j] = {x: j*cell_width, y : i*cell_height , width : cell_height, height : cell_height};
	    	}
	    }
	    return x;
	}

	function makeGrid (grid, gridData){

		var row = grid.selectAll(".row")
			.data(gridData); // each row will be bound to the array at data[i]
		row.enter().append("g") 
			.attr("class", "row") 

		var cell = row.selectAll(".cell")
			.data(function(d) { return d; }); // then iterate through data[i] for each cell
			cell.enter().append("rect") 
			.attr("class", "cell") 
			.attr("x", function(d, i) { return d.x; })
			.attr("y", function(d, i) { return d.y; })
			.attr("width", function(d, i) { return d.width; })
			.attr("height", function(d, i) { return d.height; });
			cell.attr("class", function(d){ return d.alive ? 'cell alive' : 'cell dead'; });
		return gridData;
	}

	function randomData (x){
		for (var i = 0; i < x.length; i++) {
			for (var j = 0; j < x[i].length; j++){
				var alive = Math.random()>=0.9;
				x[i][j].alive = alive;
			}
		}
		return x;
	}

	function calculate (x, x_update){
		for (var i=0; i< x.length; i++){
			for (var j = 0; j < x.length; j++){
				var neigb = getNeigbors(x,i,j);
				if (neigb===3){
					x_update[i][j].alive = true;
				} else if (neigb === 4){
					x_update[i][j].alive = x[i][j];
				} else {
					x_update[i][j].alive = false;
				}
			}
		}

		return x_update;
	}

	function getNeigbors (x, i, j){
		var neigb = 0;
		
		if (x[i-1]) {
			if (x[i-1][j-1] && x[i-1][j-1].alive) neigb++;
			if (x[i-1][j] && x[i-1][j].alive) neigb++;
			if (x[i-1][j+1] && x[i-1][j+1].alive) neigb++;
		}

		if (x[i][j-1] && x[i][j-1].alive) neigb++;
		if (x[i][j].alive) neigb++;
		if (x[i][j+1] && x[i][j+1].alive) neigb++;

		if (x[i+1]){
			if (x[i+1][j-1] && x[i+1][j-1].alive) neigb++;
			if (x[i+1][j] && x[i+1][j].alive) neigb++;
			if (x[i+1][j+1] && x[i+1][j+1].alive) neigb++;
		}
		
		return neigb

	}

	function step(grid){
		calculate(arr1, arr2);
		var temp = arr1;
		arr1 = arr2;
		arr2 = temp;
		makeGrid(grid, arr1);	
	}

	function setup(grid, grid_size){
		arr1 = makeArray( width, height, grid_size );
		arr2 = makeArray ( width, height, grid_size );
		randomData(arr1);
		makeGrid(grid, arr1);
	}

	return {
		init : function(){

			var grid_size = document.querySelector('#grid_val').value;


			var grid = d3.select('#chart').append("svg")
				.attr("width", width)
				.attr("height", height)
				.attr("class", "chart");

			setup(grid, grid_size);

			d3.select("#start").on("click", function(){
				interval = setInterval(function(){step(grid)}, 200);
			});

			d3.select("#stop").on("click", function(){
				clearInterval(interval);
			});

			d3.select('#grid_val').on('change', function(){
				var grid_size = document.querySelector('#grid_val').value;
				grid.selectAll("*").remove();
				setup(grid, grid_size);
			})
		}
	}
}());