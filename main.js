// still using node.js

var util = require("util");
_ = require("/code/dragon/underscore.js")._;
var M = require("/code/dragon/matrix.js");

var show = function (o) { 
   U = require("util");
   U.print(U.inspect(o) + "\n\n");
   return o;
}

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
   return mapCatBetween(points, toSVG);
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
      var newPoint = M.plus(a, M.mult( side ? left : right, M.minus(b, a) ));
      return [ a, newPoint ];
   } 

   // new path
   // map it to the pairs of the old path
   var path = mapCatBetween( oldpath, growNewPoint );
   path.push(oldpath[oldpath.length-1]); // append the last point

   return path;
}

var path0 = [ [0,0], [1,1], [2,2], [3,3], [4,4], [5,5] ];
util.print("path0: \n");
show(path0);

var path1 = growPath(path0);
util.print("path1: \n");
show(path1); 

var svg2 = pathToSVG(path1); 
util.print("svg2: \n");
show(svg2);


