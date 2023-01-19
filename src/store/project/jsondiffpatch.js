export const jsondiffpatch = require('jsondiffpatch').create({
  // used to match objects when diffing arrays, by default only === operator is used
  objectHash: function (obj, index) {
    // this function is used only to when objects are not equal by ref
    return obj.name || obj.title || obj.code || obj.id || obj._id || '$$index:' + index;
  },
  arrays: {
    // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
    detectMove: true,
    // default false, the value of items moved is not included in deltas
    includeValueOnMove: false
  },
  textDiff: {
    // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
    minLength: 60
  },
  propertyFilter: function (name, context) {
    /*
     this optional function can be specified to ignore object properties (eg. volatile data)
      name: property name, present in either context.left or context.right objects
      context: the diff context (has context.left and context.right objects)
    */
    return name.slice(0, 1) !== '$';
  },
  cloneDiffValues: false /* default false. if true, values in the obtained delta will be cloned
      (using jsondiffpatch.clone by default), to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching the same objects multiple times without serializing deltas.
      instead of true, a function can be specified here to provide a custom clone(value)
      */
});
