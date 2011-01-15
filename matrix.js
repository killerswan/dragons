/* Kevin Cantu (c) 2011
   simple matrix math */

var _ = require( "/code/3p/underscore/underscore/underscore.js" )._;
var U = require('util');

exports.mult = function ( mat, vec ) {
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

exports.minus = function ( v1, v2 ) {
   // still only for vectors
   return _.map(_.zip(v1, v2), function (tup) { return tup[0]-tup[1]; });
}

exports.plus = function ( v1, v2 ) {
   // still only for vectors
   return _.map(_.zip(v1, v2), function (tup) { return tup[0]+tup[1]; });
}
