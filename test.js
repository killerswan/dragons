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


var toSVG = function (point0, point1) { 
   return "M" + point0[0] + " " + point0[1] + "L" + point1[0] + point1[1];
}

/*
// given html with a notepad element id
var paper = Raphael("notepad", 320, 200);
// todo: also make growSetN(n, growset) -> growSet^n
var c = paper.path(toSVG( growSet(growSet(growSet(ss))) ));
*/

show([].concat([1,2,3],[4],[5,[6]], 7));

var insertF = function (list, func) {
   // note, this is destructive to argument `list`

   var helper = function (a, b, cs) {
      // note: concat takes arrays and combines them, 
      //       so to combine arrays of arrays we need to box things a bit
      //       hence [a] and [b]
      if (cs.length > 0) {
         //a : k (a,b) : h(b, head cs, tail cs)
         // don't box the recursive call
         return [].concat([a], [func(a,b)], helper( b, cs.shift(), cs));
      
      } else {
         //a : k (a,b) : b
         return [].concat([a], [func(a,b)], [b]);
      }
   }

   if (list.length >= 2) {
      return helper( list.shift(), list.shift(), list );
   } else {
      return [0];
   }
}

var mm = [3, 1];
var nn = [5, 10];
var oo = [7, 15];
tt = [mm, nn, oo];
uu = [mm, nn];

var newstuff = insertF( uu, function (a, c) {
   return [0];
});
var newstuffprime = insertF( tt, function (a, c) {
   return [0];
});


show(newstuff);
show(newstuffprime);

tt = [mm, nn, oo];

var better = insertF( tt, function (a, c) {
   // define and close over side if needed, but oscillate with each call
   var side = side || 0;
   side = !side;
   return M.plus(a, 
                 M.mult( side ? left : right, M.minus(c, a) ));
});

show(better);

var between = function (list, func) {
   // note, this is destructive to argument `list`

   var helper = function (a, b, cs) {
      // note: concat takes arrays and combines them, 
      //       so to combine arrays of arrays we need to box things a bit
      if (cs.length > 0) {
         //a : k (a,b) : h(b, head cs, tail cs)
         // don't box the recursive call
         return [].concat([func(a,b)], helper( b, cs.shift(), cs));
      
      } else {
         //a : k (a,b) : b
         return [].concat([func(a,b)]);
      }
   }

   if (list.length >= 2) {
      return helper( list.shift(), list.shift(), list );
   } else {
      return [7]; // srsly, throw error instead
   }
}


tt = [mm, nn, oo];

show(between(tt, toSVG));

// set of points -> set of paths -> one path
var toPath = function (set) {
   return between(set, toSVG).join();
}

tt = [mm, nn, oo];
show(toPath(tt));

tt = [mm, nn];
show(toPath(tt));



