var util = require("util");
_ = require("/code/3p/underscore/underscore/underscore.js")._;
var M = require("/code/dragon/matrix.js");

var show = function (o) { 
   U = require("util");
   U.print(U.inspect(o) + "\n\n");
}


var left = [ [ 1/2,-1/2 ],
             [ 1/2, 1/2 ] ];

var right = [ [ 1/2, 1/2 ],
              [-1/2, 1/2 ] ];


var myv = M.mult ( [ [1,1],
                     [-1,1] ], [17, -5] );
show(myv);

show(M.minus (myv, [10, 1] ));

var grow = function (a, c, side) {
   var b = M.plus(a, 
                  M.mult( side ? left : right, M.minus(c, a) ));
   return [a, b, c];
}


var mm = [3, 1];
var nn = [5, 10];

show(grow(mm,nn, 1));



var growSet = function (set) {
   //var args = Array.prototype.slice.call(arguments);
   if (set.length < 2) {
      return [];
   }

   var side = 1

   var nextSet = [];

   for (var j=0; j < set.length; j+=1) {
      if ( (j+1) < set.length ) {
         
         var a = set[j];
         var c = set[j+1];
         var b = M.plus(a, M.mult( side ? left : right, M.minus(c, a) ));

         side = !side;

         nextSet.push(a);
         nextSet.push(b);
      } else {
         nextSet.push(set[j]);
      }
   }

   return nextSet;
}

var ss = [mm, nn];

show(growSet(ss))
show(growSet(growSet(ss)))
show(growSet(growSet(growSet(ss))))
