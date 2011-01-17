/* Kevin Cantu (c) 2011 
   [http://kevincantu.org]
   library to draw dragon curves in SVG

   requires: underscore.js [http://documentcloud.github.com/underscore/]
*/


/////////////////////////////////////////
// Node.JS
/*
var util = require("util");
var _ = require("/code/dragon/underscore.js")._;

var show = function (o) { 
   U = require("util");
   U.print(U.inspect(o) + "\n\n");
   return o;
}
*/


/////////////////////////////////////////
// MATRIX MATH

Matrix = {};

Matrix.mult = function ( mat, vec ) {
   // map across the rows of the matrix
   return _.map(mat, function (row) {

      // detect size issue (meh)
      if (row.length != vec.length) { 
         console.log("matrix and vector size mismatch");
      }

      // fold across the columns to make a vector
      return _.foldl(_.zip(row, vec), 
                     function (sum, pair) {
                        return sum + pair[0] * pair[1];
                     }, 
                     0
      );
   });
};

Matrix.minus = function ( v1, v2 ) {
   // still only for vectors
   return _.map(_.zip(v1, v2), function (tup) { return tup[0]-tup[1]; });
}

Matrix.plus = function ( v1, v2 ) {
   // still only for vectors
   return _.map(_.zip(v1, v2), function (tup) { return tup[0]+tup[1]; });
}


/////////////////////////////////////////
// DRAGON CURVE MAKING

var mapBetween = function (xs, k) {
   // xs is an array
   // k is a function

   var pairs = function (list) {
      var ys = list.slice(1 /*, list.length */);
      var zs = _.zip(list, ys);

      // the last argument is solitary, not a pair
      zs.pop();

      return zs;
   }

   return _.map(pairs(xs), k);
}

var mapCatBetween = function (xs, k) {
   // should be able to fold, though...
   var combined = [];
   _.each( mapBetween(xs, k), 
      function (x) {
         combined = combined.concat(x);
      }
   )
   return combined;
}

var toSVG = function (points) { 
   var a = points[0];
   var b = points[1];
   return "M" + a[0] + " " + a[1] + "L" + b[0] + " " + b[1];
}

var pathToSVG = function (points) {
   return mapCatBetween(points, toSVG).join('');
}

var growPath = function (oldpath) {
   // depending on which side we want to grow a new point...
   var side = false;

   var left = [ [ 1/2,-1/2 ],
                [ 1/2, 1/2 ] ];

   var right = [ [ 1/2, 1/2 ],
                 [-1/2, 1/2 ] ];

   // one new point
   // this takes two points [a,b], returns [a, new]
   // next call will take [b,c], return [b,new], 
   var growNewPoint = function (pair) {
      var a = pair[0];
      var b = pair[1];
      side = !side; 
      var newPoint = Matrix.plus(a, Matrix.mult( side ? left : right, 
                                                 Matrix.minus(b, a) ));
      return [ a, newPoint ];
   } 

   // new path
   // map it to the pairs of the old path
   var path = mapCatBetween( oldpath, growNewPoint );
   path.push(oldpath[oldpath.length-1]); // append the last point

   return path;
}

var fullSVG = function (path) {
   var header = '<svg' +
                ' xmlns=\'http://www.w3.org/2000/svg\'' +
                ' style=\'height: 500px; width: 800px\'>'

   var polygon = '<path' + 
                 ' d=\'' + pathToSVG(path) + '\'' +
                 ' style=\'stroke:#000;stroke-width:2\'' + 
                 ' />';
   var footer = '</svg>'

   return header + polygon + footer;
}

var growPathN = function (path, n) {
   var currentPath = path;
   for ( n; n > 0; n-=1 ) {
      currentPath = growPath(currentPath);
   } 
   return currentPath;
}

var dragon = function (id, start, end, orderN) {
   var drawing = document.getElementById( id );
   drawing.innerHTML = fullSVG( growPathN( [start, end], 
                                           orderN ));
}

var stepDragon = function (id, start, end, orderN) {
   var drawing = document.getElementById( id );

   var currentPath = [start, end];

   var n = orderN;

   var loop = function () {
      drawing.innerHTML = fullSVG(currentPath);
      currentPath = growPath(currentPath);

      if (n > 0) {
         n -= 1;
         window.setTimeout(loop, 900);
      }
   }

   //window.setTimeout(loop, 10);
   loop();
}


