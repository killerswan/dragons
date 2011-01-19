// Copyright (c) 2011, Kevin Cantu <me@kevincantu.org>
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// The software is provided "as is" and the author disclaims all warranties
// with regard to this software including all implied warranties of
// merchantability and fitness.  In no event shall the author be liable for
// any special, direct, indirect, or consequential damanges or any damages
// whatsoever resulting from loss of use, data, your immortal soul, or 
// profits, whether in an action of contract, negligence, or other 
// tortious action, arising out of or in connection with the use or 
// performance of this software.


// dragon.js: a library to draw dragon curves
// ------------------------------------------
// This script requires underscore.js (which is awesome), and 
// was tested on Chrome 8.0.  Enjoy!
var DRAGON = (function () {


   // MATRIX MATH
   // -----------

   var matrix = {};

   // Multiply a vector and a matrix
   matrix.mult = function ( mat, vec ) {
      // map across the rows of the matrix
      return _.map(mat, function (row) {

         // detect size issue (meh)
         if (row.length !== vec.length && console && console.log) { 
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

   // Subtract vectors
   matrix.minus = function ( v1, v2 ) {
      // still only for vectors
      return _.map(_.zip(v1, v2), function (tup) { return tup[0]-tup[1]; });
   };

   // Add vectors
   matrix.plus = function ( v1, v2 ) {
      // still only for vectors
      return _.map(_.zip(v1, v2), function (tup) { return tup[0]+tup[1]; });
   };


   // SVG STUFF
   // ---------

   // Turn a pair of points into an SVG path like "M1 1L2 2".
   var toSVG = function (a, b) {  // type system fail
      return "M" + a[0] + " " + a[1] + "L" + b[0] + " " + b[1];
   };


   // DRAGON MAKING
   // -------------

   // Make a dragon with a better fractal algorithm
   var fractalMakeDragon = function (svgid, ptA, ptC, state, lr, interval) {

      // make a new <path>
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute( "class",  "dragon"); 
      path.setAttribute( "d", toSVG(ptA, ptC) );

      // append the new path to the existing <svg>
      var svg = document.getElementById(svgid); // call could be eliminated
      svg.appendChild(path);

      // if we have more iterations to go...
      if (state > 1) {

         // make a new point, either to the left or right
         var growNewPoint = function (ptA, ptC, lr) {
            var left  = [[ 1/2,-1/2 ], 
                         [ 1/2, 1/2 ]]; 

            var right = [[ 1/2, 1/2 ],
                         [-1/2, 1/2 ]];

            return matrix.plus(ptA, matrix.mult( lr ? left : right, 
                                                 matrix.minus(ptC, ptA) ));
         }; 

         var ptB = growNewPoint(ptA, ptC, lr, state);

         // then recurse using each new line, one left, one right
         var recurse = function () {
            // when recursing deeper, delete this svg path
            svg.removeChild(path);

            // then invoke again for new pair, decrementing the state
            fractalMakeDragon(svgid, ptB, ptA, state-1, lr, interval);
            fractalMakeDragon(svgid, ptB, ptC, state-1, lr, interval);
         };

         window.setTimeout(recurse, interval);
      }
   };


   // Export these functions
   // ----------------------
   return {
      fractal: fractalMakeDragon

      // ARGUMENTS
      // ---------
      //    svgid    id of <svg> element
      //    ptA      first point [x,y] (from top left)
      //    ptC      second point [x,y]
      //    state    number indicating how many steps to recurse
      //    lr       true/false to make new point on left or right

      // CONFIG
      // ------
      // CSS rules should be made for the following
      //    svg#fractal
      //    svg path.dragon
   };

}());
// On the edge of the world...
