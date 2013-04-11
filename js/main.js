var ssGameApp = angular.module('ssGameApp', []);

function swapTiles(tiles, x1, y1, x2, y2) {
	var tmp = tiles[y1][x1].c;
	tiles[y1][x1].c = tiles[y2][x2].c;
	tiles[y2][x2].c = tmp;
	tmp = tiles[y1][x1].s;
	tiles[y1][x1].s = tiles[y2][x2].s;
	tiles[y2][x2].s = tmp;
}

function ssBoardCtrl($scope) {
	$scope.startGame = function() {
		var tiles = [];
		for (var i = 0; i < 5; i ++) {
			tiles[i] = [];
			for (var j = 0; j < 5; j++) {
				tiles[i][j] = {x: j, y: i, c: i, s: j};
			}
		}
		$scope.tiles = tiles;
		$scope.selectedIndex = -1;
		$scope.won = 0;
		$scope.colors = ['btn-danger','btn-success','btn-primary','btn-info','btn-warning'];
		$scope.icons = ['icon-glass','icon-heart','icon-plane','icon-cog','icon-book'];
		for (var i = 0; i < 25; i++ ) {
			swapTiles(tiles, Math.floor(i/5), Math.floor(i%5), Math.floor(5*Math.random()), Math.floor(5*Math.random()));
		}
	};
	$scope.tileClick = function(tile) {
		if ($scope.won) { return; }
		if ($scope.selectedIndex == -1) {
			$scope.selected = tile;
			$scope.selectedIndex = tile.y*5+tile.x;
		}
		else {
			if ($scope.selected.x == tile.x && $scope.selected.y == tile.y) {
				// remove selection
				$scope.selected = undefined;
				$scope.selectedIndex = -1;
			}
			else if (Math.abs($scope.selected.x - tile.x) <= 1 && Math.abs($scope.selected.y - tile.y) <= 1
				&& ($scope.selected.c == tile.c || $scope.selected.s == tile.s)
				) {
				// switch tiles
				var tmp = tile.s; tile.s = $scope.selected.s; $scope.selected.s = tmp;
				tmp = tile.c; tile.c = $scope.selected.c; $scope.selected.c = tmp;
				// remove selection
				$scope.selected = undefined;
				$scope.selectedIndex = -1;
				// check game done
				$scope.checkWin();
			}
		}
	};
	$scope.checkWin = function() {
		var nok1 = 0, nok2 = 0;
		for (var i = $scope.tiles.length - 1; i >= 0; i--) {
			for (var j = $scope.tiles[i].length - 1; j > 0; j--) {
				if (!nok1 && $scope.tiles[i][j].c != $scope.tiles[i][j-1].c) { nok1 = 1; break; };
				if (!nok2 && $scope.tiles[i][j].s != $scope.tiles[i][j-1].s) { nok2 = 1; break; };
			};
			if (nok1 && nok2) { return 0; }
			if (i > 0) {
				if (!nok1 && $scope.tiles[i][j].s != $scope.tiles[i-1][j].s) { nok1 = 1; break; }
				if (!nok2 && $scope.tiles[i][j].c != $scope.tiles[i-1][j].c) { nok2 = 1; break; }
			}
		};
		if (nok1 && nok2) { return 0; }
		$scope.won = 1;
	};

}
