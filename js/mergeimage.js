
// Defaults
var defaultOptions = {
  format: 'image/png',
  quality: 0.92,
  width: undefined,
  height: undefined,
  Canvas: undefined
};
/*
<img id="scream" width="220" height="277"
src="pic_the_scream.jpg" alt="The Scream">

<p>Canvas:</p>

<canvas id="myCanvas" width="240" height="297"
style="border:1px solid #d3d3d3;">
Your browser does not support the HTML5 canvas tag.
</canvas>

<script>
window.onload = function() {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var img = document.getElementById("scream");
   ctx.drawImage(img, 10, 10);
};
</script>
*/

// Return Promise
function el(id) {
  var vNode = document.getElementById(id);
  if (vNode) {
    return vNode;
  } else {
    console.error("DOM node with ID ["+id+"] is not defined");
  }
}

function get_size(images) {
  console.log("mergeimage.js:42 get_size(images)");
  var size = {
    "width":0,
    "height":0
  }
  for (var i = 0; i < images.length; i++) {
    // naturalWidth naturalHeight are read-only properties
    // of an loaded image 'myImg'
    // var realWidth = myImg.naturalWidth;
    // var realHeight = myImg.naturalHeight;
    var image = images[i];
    if (size.width < image.naturalWidth) {
      size.width = image.naturalWidth
    };
    if (size.height < image.naturalHeight) {
      size.height = image.naturalHeight
    }
  }
  console.log("Max Image Size: "+JSON.stringify(size,null,4));
  return size;
}

function insert_images2canvas(canvas,images,options) {
  // Set canvas dimensions
  var max_size = get_size(images);
  canvas.width = max_size.width;
  canvas.height = max_size.height;

  // Draw images to canvas
  var ctx = canvas.getContext("2d");
  for (var i = 0; i < images.length; i++) {
    var image = images[i];
    ctx.globalAlpha = image.opacity ? image.opacity : 0.4;
    //ctx.drawImage(image, 10, 10);
    ctx.drawImage(image, 0, 0);
  }

}

function merge_images4id(source_ids, options) {
  //if (!sources) sources = [];
  if (!options) options = {};
  var canvas = null;

  if (options.outputid) {
    canvas = el(options.outputid);
  } else {
    console.log("Output ID 'options.outputid' of the canvas not defined in options");
    if (options.Canvas) {
      canvas = options.Canvas;
    } else {
      console.log("Canvas 'options.Canvas' not defined in options - create a canvas");
      canvas = window.document.createElement('canvas');
      document.body.appendChild(canvas);
    }
  }
  var images = [];
  if (source_ids) {
    for (var i = 0; i < source_ids.length; i++) {
      var img_node = el(source_ids[i]);
      images.push(img_node);
    }
    insert_images2canvas(canvas,images,options);
  } else {
    console.error("Source IDs 'source_ids' not defined");
  }

}
