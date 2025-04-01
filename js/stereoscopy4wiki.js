// After running the UMD builder, StereoConvergence does get used

var Stereoscopy4JS = function (options) { // eslint-disable-line no-unused-vars
  // this.img contains all the images - triggered by load
  // canvas4left, canvas4right, canvas4rotate contain
  //    the images for imageprocessing
  var self = this;
  options = options || {};
  this.options   = options;
  this.container = options.container;
  this.img4dom   = options.img4dom;
  this.images    = options.images;
  this.exportbuttons =  options.exportbuttons || null;
  // required ratio of single eye image
  // raw image on smartphone 16/9 then ratio4stereoscopy= 8/9
  this.ratio4stereoscopy = options.ratio4stereoscopy || 8/9;
  //this.ratio4stereoscopy = 1.5;
  // width4eye/height4eye: = ratio4stereoscopy,
  // ratio4stereoscopy=1.0 is for single eye
  // results in total image ratio  2:1
  this.filename4left  = options.filename4left || null;
  this.filename4right = options.filename4right || null;
  this.button4assign  = options.button4assign || null;
  this.button4cropstereo  = options.button4cropstereo || null;
  /*
  this.slider4cropx = options.slider4cropx || {
    "value":0.5 // between 0 and 1
  };
  this.slider4cropy = options.slider4cropy || {
    "value":0.5  // between 0 and 1
  };
  */
  this.div4stereoscopy  = options.div4stereoscopy || null;
  this.div4anaglyph  = options.div4anaglyph || null;
  this.div4sliders  = options.div4sliders || null;
  this.slider4vert  = options.slider4vert || null;
  this.slider4hor   = options.slider4hor  || null;
  this.dom4slider4vert  = options.dom4slider4vert || null;
  this.dom4slider4hor   = options.dom4slider4hor  || null;
  this.canvas4right = options.canvas4right || null;
  this.canvas4left  = options.canvas4left  || null;
  this.color4left  = options.color4left  || "red";
  this.color4right = options.color4right || "green";
  // selector4output is a select box HTML element to choose the output
  // possible output formats are: // "stereoscopy" "analglyph" "all"
  this.selector4output  = options.selector4output  || {"value":"all"};
  this.anaglyph4left = null;
  this.anaglyph4right = null;
  this.canvas4mask = null;
  this.apply_mask = true;
  this.canvas4rotate = null;
  this.image4rotate = null;
  this.preview4cropstereo = null;
  this.preview4align = null;
  this.canvas4stereoscopy = null;
  this.preview4stereoscopy = null;
  this.canvas4anaglyph = null;
  this.preview4anaglyph = null;
  //this.eye4rotate = "right";
  this.bool4rotate = false;
  this.angle4rotation = 0;

  this.src = {
    width: -1,
    height: -1
  }
  this.img = {
    left: null,
    right: null,
    preview: null,
    mask: null,
    stereoscopy: null
  };
  this.margin = 10; // margin preview canvas
  //this.idlist4img = ["left","right","preview","mask","stereoscopy"];
  this.missing = 0;
  // mask x:  1134 y:8  // 548

  // shift >> preview size
  this.shift = {
    x:0,
    y:0
  };
  // shift4ref >> preview size
  this.shift4ref = {
    x:0,
    y:0
  };
  // for blue stereoscopy rectangle >> preview size
  this.shift4rect = {
    x:0,
    y:0
  };
  // reference for shifting rectangle >> preview size
  this.ref4rect = {
    x:0,
    y:0
  };
  // position of rectangle >> preview size
  this.pos4rect = {
    x:0,
    y:0
  };
  this.rect4overlap = null;
  this.rect4overlap4prev = null;
  // Initialization
  this.init = function (imglist) {
    this.append4canvas();
    this.initImages();
    this.missing = 0;
    if (imglist) {
      for (var id4img in this.img) {
        if (imglist.hasOwnProperty(id4img)) {
          this.img[id4img] = imglist[id4img];
          console.log("loaded image 'img."+id4img+"'");
        } else {
          if (this.img[id4img]) {
            console.log("image 'img."+id4img+"' already loaded!");
          } else {
            this.missing++;
            console.log("image 'img."+id4img+"' is missing!");
          }
        }
      }
      if (this.missing > 0) {
        console.warn(this.missing + " images are missing before stereoscopy generation is possible!");
      } else {
        console.log("all required images exist!");
      }
    }
    this.initEvents();
    window.setTimeout(self.updatePreviewCanvas,1000);
    // COLOR SETTING of selectors
    this.setAnaglyphColor(this.color4left,this.color4right);

  }

  this.copyImages2Canvas = function() {
    self.setImageSize2Canvas();
    self.image2canvas(self.img.left,self.preview4cropstereo);
    self.image2canvas(self.img.left,self.canvas4left);
    self.image2canvas(self.img.right,self.canvas4right);
    self.image2canvas(self.img.right,self.canvas4rotate);
    self.image2canvas(self.img.left,self.anaglyph4left);
    self.image2canvas(self.img.right,self.anaglyph4right);
    self.image2canvas(self.img.right,self.canvas4right);
    self.image2canvas(self.img.mask,self.canvas4mask);
  }

  this.showAllPreview = function () {
    self.show4dom(self.preview4align);
    self.show4dom(self.preview4cropstereo);
    self.show4dom(self.preview4stereoscopy);
    self.show4dom(self.preview4anaglyph);
  };

  this.hideAllPreview = function () {
    self.hide4dom(self.preview4align);
    self.hide4dom(self.preview4cropstereo);
    self.hide4dom(self.preview4stereoscopy);
    self.hide4dom(self.preview4anaglyph);
  };

  this.showAllCanvas = function () {
    self.showAllPreview();
    self.show4dom(self.canvas4left);
    self.show4dom(self.canvas4right);
    self.show4dom(self.canvas4rotate);
    self.show4dom(self.anaglyph4left);
    self.show4dom(self.anaglyph4right);
    self.show4dom(self.canvas4stereoscopy);
    self.show4dom(self.canvas4anaglyph);
    self.show4dom(self.canvas4mask);
  }


  this.hideAllCanvas = function () {
      self.hideAllPreview();
      self.hide4dom(self.canvas4left);
      self.hide4dom(self.canvas4right);
      self.hide4dom(self.canvas4rotate);
      self.hide4dom(self.anaglyph4left);
      self.hide4dom(self.anaglyph4right);
      self.hide4dom(self.canvas4stereoscopy);
      self.hide4dom(self.canvas4anaglyph);
      self.hide4dom(self.canvas4mask);
  }

  this.initImages = function () {
    console.log("CALL: initImages()");
    this.loadImages(this.images);
  };

  this.loadImages = function (pImages) {
    console.log("CALL: loadImages(pImages)");
    //this.id4dom = options.id4dom || '[data-stereo-container]';
    //this.container = options.container || document.querySelector(this.id4dom);
    if (pImages) {
      //console.warn("CALL: loadImages(pImages) typeof(pImages)='"+(typeof pImages)+"' length="+pImages.length);
      if (this.container) {
        this.img = {
          left:  new Image(),
          right: new Image(),
          mask:  new Image()
        };
        for (var i = 0; i < pImages.length; i++) {
          var b64file = pImages[i];
          //console.warn("CALL: loadImages(pImages) typeof(pImages)='"+(typeof pImages)+"' pImages["+i+"].name="+b64file.name);
          if (b64file) {
            var img = this.img[b64file.name];
            img.src = "data:"+b64file.mime_type+";base64,"+b64file.file;
            var i4d = this.img4dom[b64file.name];
            if (i4d) {
              var ratio = i4d.naturalHeight/i4d.naturalWidth;
              //alert("ratio="+ratio);
              var width = i4d.width;
              //var height = i4d.width * ratio;
              var height = i4d.height;
              i4d.src = img.src;
              i4d.width = width;
              i4d.height = height;
              i4d.marginLeft = "auto";
              i4d.marginRight = "auto";
            } else {
              console.error("base64 file '"+b64file.name+"' does not exist!");
            }
          }
        }
        //this.eye = this.img;
        //this.clip = options.clip || this.container.getAttribute('data-stereo-clip') || true
        //this.shouldRefresh = false;
        //window.setTimeout(self.resizeRefresh,2000);
        //this.copyImages2Canvas();
      } else {
        console.error("StereoscopyJS.container is not provided in options.container to Stereoscopy4JS constructor.");
      }
    } else {
      console.error("CALL: loadImages(pImages) pImages are not defined");
    }
  }

  this.cloneSize = function (pImgID,pCanvasID) {
    if (pImgID  && this.img[pImgID]) {
      var img = this.img[pImgID];
      var size = {
        "width":640,
        "height":480
      };
      if (img) {
        if (img.naturalWidth > 0) {
          size.width = img.naturalWidth;
        } else {
          if (img.width > 0) {
            size.width = img.width;
          } else {
            console.warn("Image ['"+pImgID+"'] naturalWidth and width undefined");
          }
        }
        if (img.naturalHeight > 0) {
          size.height = img.naturalHeight;
        } else {
          if (img.height > 0) {
            size.height = img.height;
          } else {
            console.warn("Image ['"+pImgID+"'] naturalHeight and height undefined");
          }
        }
      } else {
        console.error("Image ['"+pImgID+"'] was undefined");
      }
      if (pCanvasID) {
        var cv = this[pCanvasID];
        if (cv) {
          if ((size.width > 0) && (size.height > 0)) {
            this.setCanvasSize(cv,size);
          } else {
            console.warn("cloneSize(pImgID,pCanvasID) - size is undefined")
          }
        } else {
          console.error("cloneSize(pImgID,pCanvasID) - Canvas ["+pCanvasID+"] is undefined!");
        }
      } else {
        console.error("cloneSize(pImgID,pCanvasID) is undefined!");
      }
    } else {
      console.error("cloneSize(pImgID,pCanvasID) - Image img."+pImgID+" does not exist");
    }
  };

  this.setImageSize2Canvas = function () {
      console.log("CALL: setImageSize2Canvas()");
      //this.setAnaglyphColor(this.color4left,this.color4right);
      this.cloneSize("left","canvas4left");
      this.cloneSize("right","canvas4right");
      this.cloneSize("right","canvas4rotate");
      this.cloneSize("left","canvas4left");
      this.cloneSize("left","anaglyph4left");
      this.cloneSize("right","anaglyph4right");
      var width4img  = this.img.left.width  || 640;
      var height4img = this.img.left.height || 480
      var size4canvas = {
        "width":  width4img,
        "height": height4img
      };
      //alert("size4canvas="+strJSON(size4canvas));
      //alert("this.getPreviewWidth()="+strJSON(this.getPreviewWidth()));
      var width4prev = this.getPreviewWidth();
      if (width4prev < 100) {
        width4prev = width4img
        //console.error("width4prev undefined!");
      }
      var size4preview = {
        "width": width4prev,
        "height": Math.floor(height4img * width4prev / width4img)
      };
      this.setCanvasSize(this.preview4anaglyph,size4preview);
      this.setCanvasSize(this.canvas4anaglyph,size4canvas);

      size4preview.height = Math.floor(size4preview.width/2);
      size4canvas.height  = Math.floor(size4canvas.width/2);
      this.setCanvasSize(this.preview4stereoscopy,size4preview);
      var size4img = this.getSize4Image(this.img.left);
      var size4stereo = this.getSize4Stereoscopy(size4img);
      //alert("setImageSize2Canvas() - size4stereo="+strJSON(size4stereo));
      this.setCanvasSize(this.canvas4stereoscopy,size4stereo);
      //this.getSize4StereoscopyPreview();
  };

  this.setImage = function(pLeftRight,pFilename,pBase64) {
    var cv,cva,ctx,ctxp,color;
    var cvp = this.preview4cropstereo;
    var id4dom = "filename4"+pLeftRight;
    if (this[id4dom]) {
      this[id4dom].innerHTML = pFilename;
    } else {
      console.error("Stereoscopy4JS."+id4dom+" does not exist!");
    };
    // ToDos
    // (0) select the canvas to updated
    // (1) set the preview image
    // (2) set the canvas left or right (or mask)
    // (3) set the anaglyph image with the corresponding color
    // (4) set the alignment canvas size and
    // (5) add transparent left and right image
    var load4image = true;
    var left_right = true;
    switch (pLeftRight) {
      case "left":
        cv  = self.canvas4left;
        cva = self.anaglyph4left;
        color = self.color4left;
      break;
      case "right":
        if (self.bool4rotate == true) {
          cv = self.canvas4rotate;
        } else {
          cv  = self.canvas4right;
        }
        cva = self.anaglyph4right;
        color = self.color4right;
      break;
      case "mask":
        cv = this.canvas4mask;
        left_right = false;
      break;
      default:
        load4image = false;
        console.warn("Image '"+pLeftRight+"' is not allowed");
    }
    if (load4image == true) {
      if (cv) {
        ctx  = cv.getContext('2d');
        var img = new Image();
        this.img[pLeftRight] = img;
        img.onload = function() {
          var size = {
            "width":  img.width,
            "height": img.height
          };
          console.log("Stereoscopy4JS.setImage() - img."+pLeftRight+": size=("+img.width+","+img.height+")");
          self.setCanvasSize(cv,size);
          ctx.drawImage(img,0,0);
          if (cva) {
            // left_right = true
            self.setCanvasSize(cva,size);
            ctxa  = cva.getContext('2d');
            ctxa.drawImage(img,0,0);
          };
          self.resetSizes4Canvas();
          self.calcCanvasPreviewSize(img);
          self.updatePreviewCanvas();
          self.resetImageAlignment(pLeftRight);
        };
        img.src = pBase64;
      } else {
        console.error("canvas4left is not defined");
      }
    }
  }

  this.resetImageAlignment = function (pLeftRight) {
    pLeftRight = pLeftRight || "left";
    if ((pLeftRight != "left") && (pLeftRight != "right")) {
      pLeftRight = "left";
    }
    /*
    self.show4dom(self.canvas4left);
    self.show4dom(self.canvas4right);
    self.show4dom(self.canvas4stereoscopy);
    self.show4dom(self.canvas4anaglyph);
    */
    console.log("this.resetImageAlignment('"+pLeftRight+"')");
    var img = this.img[pLeftRight];
    if (!img) {
      img = this.img.left;
    }
    var size4canvas = this.getSize4Image(img);
    var size4stereo = this.getSize4Stereoscopy(size4canvas);
    //alert("resetImageAlignment - size4stereo="+strJSON(size4stereo));
    this.setCanvasSize(this.canvas4stereoscopy,size4stereo);
    //this.setCanvasSize()
  }

  this.calcGreyScale = function(pRed,pGreen,pBlue) {
    //pRed = pRed || 0;
    return (pRed + pGreen + pBlue) / 3;
  };

  this.pixel2greyscale = function(pixel4image,i) {
    var greyscale = (pixel4image.data[i] + pixel4image.data[i + 1] + pixel4image.data[i + 2]) / 3;
    pixel4image.data[i]     = greyscale;
    pixel4image.data[i + 1] = greyscale;
    pixel4image.data[i + 2] = greyscale;
  };

  this.pixel2red = function(pixel4image,i) {
    var greyscale = parseInt((pixel4image.data[i] + pixel4image.data[i + 1] + pixel4image.data[i + 2]) / 3);
    pixel4image.data[i]     = greyscale;
    pixel4image.data[i + 1] = 0;
    pixel4image.data[i + 2] = 0;
  };

  this.pixel2green = function(pixel4image,i) {
    var greyscale = parseInt((pixel4image.data[i] + pixel4image.data[i + 1] + pixel4image.data[i + 2]) / 3);
    pixel4image.data[i]     = 0;
    pixel4image.data[i + 1] = greyscale;
    pixel4image.data[i + 2] = 0;
  };

  this.pixel2cyan = function(pixel4image,i) {
    var greyscale = parseInt((pixel4image.data[i] + pixel4image.data[i + 1] + pixel4image.data[i + 2]) / 3);
    pixel4image.data[i]     = 0;
    pixel4image.data[i + 1] = greyscale;
    pixel4image.data[i + 2] = greyscale;
    //alert(pixel4image.data[i + 3]) - t
  };

  this.pixel2cyan4rmv = function(pixel4image,i) {
    pixel4image.data[i]     = 0;
  };

  this.canvas2greyscale = function (pCanvasIn, pCanvasOut) {
    //alert("convert2greyscale");
    this.canvas2color(pCanvasIn, pCanvasOut,this.pixel2greyscale);
  }

  this.canvas2red = function (pCanvasIn, pCanvasOut) {
    //alert("convert2red");
    this.canvas2color(pCanvasIn, pCanvasOut,this.pixel2red);
  }

  this.canvas2green = function (pCanvasIn, pCanvasOut) {
    //alert("convert2green");
    this.canvas2color(pCanvasIn, pCanvasOut,this.pixel2green);
  }

  this.canvas2cyan = function (pCanvasIn, pCanvasOut) {
    //alert("convert2cyan");
    //this.canvas2color(pCanvasIn, pCanvasOut,this.pixel2cyan);
    this.canvas2color(pCanvasIn, pCanvasOut,this.pixel2cyan4rmv);
  };

  this.X_merge4anaglyph = function (cv) {
    var shift4src = this.getShift4Source();
    var size = this.getSize4Eye("left");
    cv = cv || this.canvas4anaglyph;
    var ctx = cv.getContext('2d');
    var rect = this.calcCanvasRectangle();
    alert("NEW Anaglyph rect.size="+strJSON(rect.size)+"\ncanvas4anglyph.size=("+cv.width+","+cv.height+")")
    this.setCanvasSize(cv,rect.size);
    if (this.anaglyph4left && this.anaglyph4right && this.canvas4anaglyph) {
      var cvL = this.anaglyph4left;
      var cvR = this.anaglyph4right;
      var ctxL = this.anaglyph4left.getContext('2d');
      var ctxR = this.anaglyph4right.getContext('2d');
      var width = rect.size.width;
      var height = rect.size.height;
      cv.reset();
      ctx.globalAlpha = 0.8;
      ctx.drawImage(cvL, 0, 0,rect.width,rect.height,0,0,cv.width,cv.height);
      ctx.globalAlpha = 0.4;
      //ctx.drawImage(self.eye.right, xConverted, yConverted);
      //var swidth =
      if (this.bool4rotate == true) {
        var degree = this.angle4rotation;
        ctx.translate(cvR.width/2,cvR.height/2);

        /* rotates rectangle 40 degrees
        ctx.translate(cv.width/2,cv.height/2);
        ctx.rotate(40 * Math.PI / 180);
        ctx.translate(-cv.width/2,-cv.height/2);
        ctx.fillRect(50, 20, 100, 50);
        */

        // rotate the canvas to the specified degrees
        ctx.rotate(degrees*Math.PI/180);
      }
      ctx.drawImage(cvR, -shift4src.x, -shift4src.y,width,height,0,0,cv.width,cv.height);
    }
  };

  this.merge4anaglyph = function (cv) {
    var shift4src = this.getShift4Source();
    var size = this.getSize4Eye("left");
    cv = cv || this.canvas4anaglyph;
    var rect = this.calcCanvasRectangle();
    //alert("Anaglyph rect.size="+strJSON(rect.size)+"\ncanvas4anglyph.size=("+cv.width+","+cv.height+")\nshift4src="+strJSON(shift4src));
    // set the anaglyph size to source size of the rectangle
    this.setCanvasSize(cv,rect.size);
    // rect is created for preview4cropstereo
    //var rect4prev = this.calcOverlapRectangle4Preview();
    if (this.anaglyph4left && this.anaglyph4right && this.canvas4anaglyph) {
      var ctxL = this.anaglyph4left.getContext('2d');
      var ctxR = this.anaglyph4right.getContext('2d');
      //this.setCanvasSize(cv,rect.size);
      var ctx = cv.getContext('2d');
      ctx.reset();
      var width  = rect.size.width;
      var height = rect.size.height;
      //alert("merge4anaglyph() Source Canvas width="+cv.width+" height="+cv.height);

      var pixel4image;
      var pixel4red;
      var posL = this.getImagePosition("left",shift4src);
      var posR = this.getImagePosition("right",shift4src);
      //alert("merge4anaglyph() - this.shift="+strJSON(this.shift)+"\nrect.pos="+strJSON(rect.pos)+"\ndata size=("+width+","+height+") ");
      //alert("merge4anaglyph() - posL="+strJSON(posL)+"\nposR="+strJSON(posR)+" ");
      if (this.color4left == "red") {
        pixel4red   = ctxL.getImageData(rect.pos.x, rect.pos.y, width, height);
        pixel4image = ctxR.getImageData(rect.pos.x - shift4src.x, rect.pos.y - shift4src.y, width, height);
      } else {
        pixel4image = ctxL.getImageData(rect.pos.x, rect.pos.y, width, height);
        pixel4red   = ctxR.getImageData(rect.pos.x - shift4src.x, rect.pos.y - shift4src.y, width, height);
      }
      //alert("pixel4image.data.length="+pixel4image.data.length);
      for (var y = 0; y < pixel4image.height; y++){
          for (var x = 0; x < pixel4image.width; x++){
            var i = (y * 4) * pixel4image.width + x * 4;
            var greyscale = parseInt((pixel4image.data[i] + pixel4image.data[i + 1] + pixel4image.data[i + 2]) / 3);
            pixel4image.data[i] += pixel4red.data[i];
            //pixel4image.data[i + 3] = 255; //no transparency
          }
      }
      /*
      */
      //globalAlpha
      ctx.globalAlpha = 0.8;
      ctx.putImageData(pixel4red, 0, 0)
      ctx.globalAlpha = 0.4;
      ctx.putImageData(pixel4image, 0, 0)
    } else {
      console.error("At least one Canvas pLeft, pRight or pCanvas is missing!");
    }
  }


  this.canvas2color = function (pCanvasIn,pCanvasOut,pColorFct) {
    if (pCanvasIn && pCanvasOut && pColorFct) {
      var ctx = pCanvasIn.getContext('2d');
      var width  = pCanvasIn.width;
      var height = pCanvasIn.height;
      self.setCanvasSize(pCanvasOut,{
        "width":width,
        "height":height
      });
      //ctx.globalAlpha = 1.0
      //alert("pCanvas width="+pCanvas.width+" height="+pCanvas.height);

      //alert("pixel4image.data.length="+pixel4image.data.length);
      var pixel4image = ctx.getImageData(0, 0, width, height);
      for (var y = 0; y < pixel4image.height; y++){
          for (var x = 0; x < pixel4image.width; x++){
            var i = (y * 4) * pixel4image.width + x * 4;
            pColorFct(pixel4image,i);
          }
      }
      self.clear4canvas(pCanvasOut,"#FFFFFF");
      var ctxout = pCanvasOut.getContext('2d');
      ctxout.putImageData(pixel4image, 0, 0);
    } else {
      console.error("Parameter missing ");
    }
  }

  this.setAnaglyphColor = function (pLeft,pRight) {
    var allowed = ["red","green","cyan"];
    if (pLeft && (allowed.indexOf(pLeft) >= 0)) {
      console.log("set left image to '"+pLeft+"'");
    } else {
      pLeft = "red";
    }
    if (pRight && (allowed.indexOf(pRight) >= 0)) {
      console.log("set left image to '"+pLeft+"'");
    } else {
      pRight = "green";
    }
    if ((pLeft == "red") && (pRight == "red")) {
      if (pLeft == this.color4left) {
        pLeft = "green";
      } else {
        pRight = "green"
      }
    };
    if ((pLeft == "cyan") && (pRight == "cyan")) {
      if (pLeft == this.color4left) {
        pLeft = "red";
      } else {
        pRight = "red"
      }
    };
    if ((pLeft == "green") && (pRight == "green")) {
      if (pLeft == this.color4left) {
        pLeft = "red";
      } else {
        pRight = "red"
      }
    };
    if ((pLeft == "cyan") && (pRight == "green")) {
      if (pLeft == this.color4left) {
        pLeft = "red";
      } else {
        pRight = "red"
      }
    }
    if ((pLeft == "green") && (pRight == "cyan")) {
      if (pLeft == this.color4left) {
        pLeft = "red";
      } else {
        pRight = "red"
      }
    }
    console.log("Anaglyph Colors ('"+pLeft+"','"+pRight+"')");
    this.color4left  = pLeft;
    this.color4right = pRight;
    // pLeft and pRight are colors for the canvas
    this.setAnaglyphColor4Canvas(pLeft,pRight);
    return {
      "left": pLeft,
      "right":pRight
    };
  }

  this.setAnaglyphColor4Canvas = function (pLeftColor,pRightColor) {
    console.log("setAnaglyphColor4Canvas('"+pLeftColor+"','"+pRightColor+"')");
    // convert the canvas into the selected color
    //CALLS e.g. this.canvas2cyan(pCanvasIn,pCanvasOut)
    self["canvas2"+pLeftColor](self.canvas4left,self.anaglyph4left);
    // convert right eye and rotated right eye to color
    if (this.bool4rotate == true) {
      self["canvas2"+pRightColor](self.canvas4rotate,self.anaglyph4right);
    } else {
      self["canvas2"+pRightColor](self.canvas4right,self.anaglyph4right);
    }
  }

  this.convertCanvas2Greyscale = function () {
    //self.canvas2greyscale(self.preview4align,self.preview4align);
    self.canvas2greyscale(self.canvas4left);
    self.canvas2greyscale(self.canvas4right);
    self.canvas2greyscale(self.anaglyph4left);
    self.canvas2greyscale(self.anaglyph4right);
  }

  // Initialization of Events
  this.initEvents = function () {

    self.getDimensions();
    self.bindEvents();
    self.mouseDragMode = true;
    self.shiftPosition(0,0);
    self.mouseDragMode = false;
    self.mouseRectangleMode = true;
    self.shiftCropRectangle(0,0);
    self.mouseRectangleMode = false;
  }

  // getMousePos4Canvas
  this.getMousePos4Canvas = function (canvas, evt) {
    if (canvas) {
      var rect = canvas.getBoundingClientRect();
      return {
        x: Math.floor(evt.clientX - rect.left),
        y: Math.floor(evt.clientY - rect.top)
      };
    } else {
      console.warn("getMousePos4Canvas(canvas, evt)  canvas does not exist!");
    }
  };

  // hide DOM element
  this.hide4dom = function (elem) {
    elem.style.display = 'none'
  }

  // show an element
  this.show4dom = function(elem) {
    elem.style.display = 'block'
  }

  this.show4exportbuttons = function() {
    if (this.exportbuttons) {
      this.show4dom(this.exportbuttons);
    } else {
      console.warn("StereoscopyJS.exportbuttons are not defined");
    }
  }

  this.hide4exportbuttons = function() {
    if (this.exportbuttons) {
      this.hide4dom(this.exportbuttons);
    } else {
      console.warn("StereoscopyJS.exportbuttons are not defined");
    }
  }

  this.setCanvasSize = function (cv,size) {
    if (cv) {
      console.log("Canvas ["+cv.id+"] exists");
      if (size) {
        console.log("Canvas ["+cv.id+"] size="+strJSON(size));
        if (size.width && (size.width > 0)) {
          cv.setAttribute("width",size.width);
        } else {
          console.error("Canvas ["+cv.id+"] size.width attribute is missing - size="+strJSON(size));
        }
        if (size.height && (size.height > 0)) {
          cv.setAttribute("height",size.height);
        } else {
          console.error("Canvas ["+cv.id+"] size.height attribute is missing - size="+strJSON(size));
        }
      } else {
        console.error("setCanvasSize(cv,size) canvas ["+cv.id+"] exists but size parameter 'size' was not defined!");
      }
    } else {
      console.error("setCanvasSize(cv,size) canvas 'cv' was not defined!");
    }
  }

  this.setAlignmentSize = function () {
    this.calcCanvasPreviewSize(this.img.left);
    //this.setCanvasSize(this.preview4cropstereo,this.src);
    var size = this.getPreviewSize();
    this.setCanvasSize(this.preview4cropstereo,size);
    this.setCanvasSize(this.preview4align,size);
  }

    this.clearPreview = function () {
      this.clear4canvas(this.preview4align);
      this.clear4canvas(this.preview4cropstereo);
      this.clear4canvas(this.preview4stereoscopy);
      this.clear4canvas(this.preview4anaglyph);
    };

    this.clearResult = function () {
      this.clearPreview();
      this.clear4canvas(this.canvas4stereoscopy);
      this.clear4canvas(this.canvas4anaglyph);
    };

    this.clear4rectangle = function (canvas) {
      if (canvas) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else {
        console.warn("Rectangles on canvas '"+canvas.id+"' could not be removed. Canvas does not exist!");
      }
    }

    this.clear4canvas = function (canvas,backgroundColor) {
        backgroundColor = backgroundColor || "#FFF";
        if (canvas) {
          var ctx = canvas.getContext("2d");
          ctx.fillStyle = backgroundColor;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
          console.warn("Stereoscopy4JS.clear4canvas(canvas) - canvas not defined!");
        }
    };

  this.getWindowSize = function () {
    var size = {
      "width": window.innerWidth,
      "height": window.innerHeight
    };
    return size;
  }

  this.getImageSize4Preview = function (size4img,margin) {
    margin = margin || self.margin || 10;
    var size = {
      "width": 640,
      "height": 480
    };
    var winsize = this.getWindowSize();
    if (winsize) {
      var scale = 1.0;
      var scale4width  = 1.0;
      var scale4height = 1.0;
      if (size4img) {
        if (size4img.height && winsize.height) {
          scale4height = winsize.height/size4img.height;
          scale = scale4height;
        } else {
          console.warn("getImageSize4Preview(size4img) size4img.height not defined!");
        }
        if (size4img.width && winsize.width) {
          var scale4width = winsize.width/size4img.width
          if (scale4height > scale4width) {
            scale = scale4width;
          };
        } else {
          console.warn("getImageSize4Preview(size4img) size4img.width not defined!");
        }
      } else {
        console.warn("getImageSize4Preview(size4img) size4img not defined!");
      }
      var m = Math.round(scale * size.height);
      size.width  = Math.round(m * 2 * self.ratio4stereoscopy);
      size.height = m;
    } else {
      console.error("Window size 'winsize' does not exist!");
    }
    console.log("this.getImageSize4Preview(size4img) size4img=("+size4img.width+","+size4img.height+") return size=("+size.width+","+size.height+")" );
    //size.width -= 2*margin;
    //alert("this.getImageSize4Preview(size4img) size4img=("+size4img.width+","+size4img.height+") return size=("+size.width+","+size.height+")" );
    return size;
  };

  this.getPreviewSize = function (margin) {
    margin = margin || self.margin;
    var size = this.getImageSize4Preview(this.img.left,margin);
    return size;
  };

  this.getPreviewWidth = function (margin) {
    var width = 640;
    margin = margin || self.margin;
    var parnode = self.container;
    if (self.container) {
      width = self.container.offsetWidth - 4*margin;
      //alert("getPreviewWidth() width="+width);
    } else {
      console.warn("container of Stereoscopy4JS does not exist!");
      if (self.preview4align) {
        parnode = self.preview4align.parentNode;
        if (parnode) {
          width  = parnode.offsetWidth - 2*margin;
        } else {
          console.warn("parent node of preview4align does not exist!");
        }
      } else {
        console.error("parent node of preview4align does not exist!");
      }
    }

    return width;
  }

  this.calcCanvasPreviewSize = function (img,margin) {
    margin = margin || self.margin;
    var size = {
      "width": 640,
      "height": 480
    }
    if (img) {
      size = this.getImageSize4Preview(img);
    } else {
      console.error("calcCanvasPreviewSize(img,margin) img is undefined of missing");
    }
    return size;
  }

  this.calcStereoscopyPreviewSize = function (img,margin) {
    margin = margin || self.margin;
    img = img || this.img.left || {
      "width": 640,
      "height": 480
    };
    var size4stereo = {
      "width": 640,
      "height": Math.floor(640/(2*this.ratio4stereoscopy))
    };
    var ratio4img = img.height/img.width;
    size = this.getImageSize4Preview(img);
    if (size) {
      //var m = Math.min(size.width,size.height)
      if (size.width > 0) {
        size4stereo.width = size.width;
        size4stereo.height = size.width/2;
      } else {
        console.error("calcStereoscopyPreviewSize(img,margin) - m is not defined!");
      }
    } else {
      console.error("calcStereoscopyPreviewSize(img,margin) - size is not defined");
    }

    return size4stereo;
  }

  // Calculates the additional margin after ROTATION
  // this is necessary so that all areas are convert
  // with left and right eye image
  // used in getSize4Eye() method

  this.calcRotationMargin = function (width,height) {
      this.angle4rotation = parseFloat(this.angle4rotation);
      var s = Math.sin(this.angle4rotation * Math.PI/180);
      console.log("sin("+this.angle4rotation+")="+s);
      if (s<0) {
        s = -s;
      }
      var margin = {
        "width":  Math.round(s * width/2),
        "height": Math.round(s * height/2)
      };
      return margin;
  }

  this.getPreviewSize4Image = function (pImage,margin) {
    var imgsize = {
      "width": 640,
      "height":480
    };
    if (pImage && pImage.width && pImage.height) {
      imgsize.width  = pImage.width;
      imgsize.height = pImage.height;
    }
    var new_width = this.getPreviewWidth();
    //var new_width = this.getPreviewHeight();
    var size = {
      "width": new_width,
      "height": Math.floor(imgsize.height * new_width/imgsize.width)
    };
    return size;
  }

  this.hideSlider4Stereoscopy = function () {
    this.hide4dom(this.dom4hor);
    this.hide4dom(this.dom4vert);
  };

  this.showSlider4Stereoscopy = function () {
    this.show4dom(this.dom4hor);
    this.show4dom(this.dom4vert);
  };

  this.hideCrop4Stereoscopy = function () {
    this.hide4dom(this.preview4cropstereo);
    this.hide4dom(this.div4sliders);
    this.showSlider4Stereoscopy();
    this.hide4dom(this.preview4stereoscopy);
  };

  this.showCrop4Stereoscopy = function () {
    this.hide4dom(this.preview4align);
    this.show4dom(this.preview4cropstereo);
    this.show4dom(this.div4sliders);
    this.showSlider4Stereoscopy();
    this.hide4dom(this.preview4stereoscopy);
  };

  this.startPositioningImage = function () {
    this.show4dom(this.preview4align);
    this.hide4dom(this.preview4cropstereo);
    //this.hideShiftSliders();
    //this.hide4exportbuttons();
    //this.hideCrop4Stereoscopy();
    var size = this.getPreviewSize();
    this.setCanvasSize(this.preview4cropstereo,this.img.left);
    this.setCanvasSize(this.preview4align,size);
    this.setCanvasSize(this.canvas4anaglyph,this.img.left);
    this.setCanvasSize(this.preview4anaglyph,size);
    this.updatePreviewCanvas();
    self.shiftPosition({"x":0,"y":0});
  };

  this.startCropingImage = function () {
    this.hide4dom(this.preview4align);
    this.show4dom(this.preview4cropstereo);
    //this.hideShiftSliders();
    //this.hide4exportbuttons();
    //this.hideCrop4Stereoscopy();
    //var size = this.getPreviewSize4Image(this.img.left);
    //this.setCanvasSize(this.preview4cropstereo,this.img.left);
    //this.setCanvasSize(this.preview4align,size);
    //this.setCanvasSize(this.canvas4anaglyph,this.img.left);
    //this.setCanvasSize(this.preview4anaglyph,size);
    //this.updatePreviewCanvas();
    //self.shiftPosition({"x":0,"y":0});
  };

  this.checkCanvasSize = function (pSize) {
    var size = {
      "width": 640,
      "height": 480
    }
    if (pSize && (pSize.width >= 100) && (pSize.height >= 100)) {
      size.width = pSize.width;
      size.height = pSize.height;
    }
    return size;
  };
  // update the preview canvas
  this.updatePreviewCanvas = function () {
    var size = {
      "width": this.getPreviewWidth(),
      "height": Math.floor(this.img.left.height * this.getPreviewWidth()/this.img.left.width)
    };
    size = this.checkCanvasSize(size);
    //alert("updatePreviewCanvas() size="+strJSON(size));
    this.setCanvasSize(this.preview4align,size);
    if (self.preview4align) {
      var ctx = self.preview4align.getContext("2d");
      ctx.globalAlpha = 0.4;
      self.img.left.crossOrigin = "anonymous";
      ctx.drawImage(self.img.left,  0, 0,self.src.width,self.src.height, 0, 0,size.width,size.height);
      if (this.bool4rotate == true) {
        self.canvas4rotate.crossOrigin = "anonymous";
        ctx.drawImage(self.canvas4rotate, 0, 0,self.src.width,self.src.height, 0, 0,size.width,size.height);
      } else {
        self.img.right.crossOrigin = "anonymous";
        ctx.drawImage(self.img.right, 0, 0,self.src.width,self.src.height, 0, 0,size.width,size.height);
      }
    } else {
      console.warn("Canvas: 'preview4align' does not exist in call updatePreviewCanvas() ");
    }
  };

  this.canvas2canvas = function (cv4src,cv) {
      console.log("CALL: Stereoscopy4JS - canvas2canvas('"+cv4src.id+"','"+cv.id+"')");
      if (cv4src && cv) {
        cv.setAttribute("width",cv4src.width);
        cv.setAttribute("height",cv4src.height);

        var ctx = cv.getContext("2d");
        if (ctx && cv4src) {
          /*
          img 	Specifies the image, canvas, or video element to use
          sx 	Optional. The x coordinate where to start clipping
          sy 	Optional. The y coordinate where to start clipping
          swidth 	Optional. The width of the clipped image
          sheight 	Optional. The height of the clipped image
          x 	The x coordinate where to place the image on the canvas
          y 	The y coordinate where to place the image on the canvas
          width 	Optional. The width of the image to use (stretch or reduce the image)
          height 	Optional. The height of the image to use (stretch or reduce the image)
          */
          ctx.drawImage(cv4src,0,0,cv4src.width,cv4src.height,0,0,cv.width,cv.height);
        }
      }

  }

  this.image2canvas = function (pImage,canvas) {
    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
      //var canvas = document.createElement('CANVAS');
      var ctx = canvas.getContext('2d');
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(img, 0, 0);
      //dataURL = canvas.toDataURL("image/png");
      //pCanvas.height = canvas.height;
      //alert("DataURL: "+ dataURL.substr(0,120));
    };
    if (pImage && pImage.src) {
      img.src = pImage.src;
    }
  }

  this.createCanvas = function (pCanvasID,pContainer) {
    pContainer = pContainer || self.container;
    var canvas = document.createElement("canvas");
    canvas.id = pCanvasID;
    pContainer.appendChild(canvas);
    self.hide4dom(canvas);
    this[pCanvasID] = canvas;
  }

  this.createCanvasResult = function(pCanvasID,pContainer) {
    pContainer = pContainer || self.container;
    var div4canvas = this["div4"+pCanvasID];
    if (!div4canvas) {
      div4canvas = document.createElement("div");
      this["div4"+pCanvasID] = div4canvas;
    }
    pContainer.appendChild(div4canvas);
    // Result Canvas: STEREOSCOPY or ANGLYPH
    this.createCanvas("canvas4"+pCanvasID,div4canvas);
    // Preview Canvas: STEREOSCOPY or ANGLYPH
    this.createCanvas("preview4"+pCanvasID,div4canvas);
    //this.createCanvas("preview4stereoscopy");

  }

  this.createSlider = function (pContainer,pMin,pMax,pStep,pValue) {
    pContainer = pContainer || self.container;
    pMin  = pMin || "0";
    pMax  = pMax || "100";
    pStep = pStep || "1";
    pValue = pValue || "0"
    var el = document.createElement("input");
    el.setAttribute("type","range");
    el.setAttribute("min",pMin);
    el.setAttribute("max",pMax);
    el.setAttribute("step",pStep);
    el.setAttribute("value",pValue);
    el.style.width = "100%";
    pContainer.appendChild(el);
    return el;
  }

  this.appendIcon = function (pContainer,pIconName) {
    console.log("Icon '"+pIconName+"' will be created");
    var vIcon = new Image();
    vIcon.style.verticalAlign = "center";
    vIcon.style.width = "20px";
    vIcon.src = "img/icons-svg/"+pIconName+"-black.svg";
    if (pContainer) {
      console.log("Icon '"+pIconName+"' was created!");
      pContainer.appendChild(vIcon);
    } else {
      console.warn("Icon '"+pIconName+"' could not be created!");
    }
    return vIcon;
  }

  this.createSlider4Canvas = function(pContainer,pSliderID,img4low,img4high) {
    pContainer = pContainer || self.container;
    var dom4s = document.createElement("table");
    this["dom4"+pSliderID] = dom4s;
    pContainer.appendChild(dom4s);
    var tr =  document.createElement("tr");
    dom4s.appendChild(tr);
    var td =  document.createElement("td");
    tr.appendChild(td);
    this.appendIcon(td,img4low);
    td =  document.createElement("td");
    tr.appendChild(td);
    var vSlider = self.createSlider(td,0.0,1.0,0.0000001,0.5);
    vSlider.setAttribute("shift",pSliderID);
    //this[pSliderID] = vSlider;
    td =  document.createElement("td");
    tr.appendChild(td);
    this.appendIcon(td,img4high);
    return vSlider;
  }

  this.appendSpace = function (pContainer) {
      var space = document.createElement("span");
      space.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;";
      pContainer.appendChild(space);
  };

  this.createShiftSliders = function(pContainer) {
    pContainer = pContainer || self.container;
    var div4s = self.div4sliders;
    if (!self.div4sliders) {
      div4s = document.createElement("div");
    }
    pContainer.appendChild(div4s);
    self.div4sliders = div4s;
    if (!self.slider4vert) {
      self.slider4vert = self.createSlider4Canvas(div4s,"slider4vert","arrow-d","arrow-u");
    }
    self.slider4vert.addEventListener('change',function(e) {
      //alert("slider4vert="+this.value);
      //self.createStereoScopyImage();
      self.clear4rectangle(self.preview4cropstereo);
      self.canvas2canvas(self.preview4align,self.preview4cropstereo)
      self.sliders2rectangle();
    });
    self.appendSpace(div4s);
    if (!self.slider4hor) {
      //var s4h = document.createElement("td");
      //tr4s.appendChild(s4h);
      self.slider4hor  = self.createSlider4Canvas(div4s,"slider4hor","arrow-l","arrow-r");
    }
    self.slider4hor.addEventListener('change',function(e) {
      //alert("slider4hor="+this.value);
      //self.createStereoScopyImage();
      self.clear4rectangle(self.preview4cropstereo);
      self.canvas2canvas(self.preview4align,self.preview4cropstereo)
      self.sliders2rectangle();
    });
    self.hide4dom(self["dom4slider4hor"]);
    self.hide4dom(self["dom4slider4vert"]);

  }
  // Append Canvas for Merge and Output
  this.append4canvas = function (event) {
    // Canvas: PREVIEW ALIGN
    this.createCanvas("preview4align");
    //self.show4dom(self.preview4align);
    // Canvas: ALIGN IMAGES
    this.createCanvas("preview4cropstereo");
    // Canvas: LEFT
    this.createCanvas("canvas4left");
    //self.show4dom(self.canvasleft);
    //self.hide4dom(self.canvas4left);
    // Canvas: RIGHT
    this.createCanvas("canvas4right");
    //self.shows4dom(self.canvas4right);
    // Canvas: ANAGLYPH LEFT
    this.createCanvas("anaglyph4left");
    //self.show4dom(self.anaglyph4left);
    // Canvas: ANAGLYPH RIGHT
    this.createCanvas("anaglyph4right");
    //self.show4dom(self.anaglyph4right);
    // Canvas: MASK FOR STEREOSCOPY
    this.createCanvas("canvas4mask");
    //self.hide4dom(self.canvas4mask);
    // Canvas: ROTATION SOURCE
    this.createCanvas("canvas4rotate");
    //self.show4dom(self.canvas4rotate);
    //this.createCanvasResult("stereoscopy");
    // Canvas: STEREOSCOPY
    this.createShiftSliders(this.div4stereoscopy);
    this.createCanvas("preview4stereoscopy");
    //self.show4dom(self.preview4stereoscopy);
    this.createCanvas("canvas4stereoscopy");
    //self.show4dom(self.canvas4stereoscopy);
    // Canvas: ANAGLYPH
    this.createCanvas("preview4anaglyph");
    //self.hide4dom(self.preview4anaglyph);
    this.createCanvas("canvas4anaglyph");
    //self.show4dom(self.canvas4anaglyph);
    //this.resetSizes4Canvas();
    console.log("append4canvas() - window.width="+window.innerWidth+" window.height="+window.innerHeight+" ");
    //alert("append4canvas() create Stereoscopy Image - src.width="+self.src.width+" src.height="+self.src.height+" preview4align.width="+self.preview4align.width);
  }

  this.setMinimalSize = function(imgL,imgR) {
    if (imgL && imgR) {
      // loaded images
      self.src.width  = Math.min(imgL.width,imgR.width);
      self.src.height = Math.min(imgL.height,imgR.height);
    } else {
      console.error("imgL or imgR are missing to calculate minimal size");
    }
  }

  this.resetSizes4Canvas = function () {
    if (self.canvas4left) {
      var imgL = self.img.left;
      var imgR = self.img.right;
      var size = {
        "width": 640,
        "height": 480
      };
      if (imgL) {
        size = self.getSize4Image(imgL);
        this.setCanvasSize(self.canvas4left,size);
        //this.setCanvasSize(imgL,self.canvas4left);
      } else {
        console.error("imgL not defined or width/height property does not exist!");
      }
      if (imgR) {
        size = self.getSize4Image(imgR);
        this.setCanvasSize(self.canvas4right,size);
        //this.setCanvasSize(imgL,self.canvas4left);
      } else {
        console.error("imgL not defined or width/height property does not exist!");
      }
      if (imgL && imgR) {
        // loaded images
        this.setMinimalSize(imgL,imgR);
        var size4prev = self.calcCanvasPreviewSize(size);
        //console.log("eye size - left/right ("+self.src.width+","+self.src.height +")");
        //alert("eye size - left/right ("+self.src.width+","+self.src.height +")")
        //this.setCanvasSize(self.preview4align,self.src);
        if (self.preview4align) {
          this.setCanvasSize(self.preview4align,size4prev);
        }
        if (self.preview4cropstereo) {
          this.setCanvasSize(self.preview4cropstereo,size4prev);
        }
        if (self.preview4stereoscopy) {
          var size4stereo = this.calcStereoscopyPreviewSize(imgL);
          this.setCanvasSize(self.preview4stereoscopy,size4stereo);
        }
        if (self.preview4anaglyph) {
          size = self.getSize4Image(imgL);
          this.setCanvasSize(self.preview4anaglyph,size);
        };
        this.updatePreviewCanvas();
        //self.hide4dom(cv);
      } else {
    	   console.error("canvas4right does not exist!");
      }
    } else {
  	   console.warn("canvas4left does not exist!");
    }
  }

  this.getAngle4Rotation = function () {
    if (isNaN(this.angle4rotation)) {
       return parseFloat(this.angle4rotation);
    } else {
      return  this.angle4rotation;
    };
  }

  this.getSin4Rotation = function () {
    this.angle4rotation = this.getAngle4Rotation();
    var s = Math.sin(this.angle4rotation * Math.PI/180);
    console.log("sin("+this.angle4rotation+")="+s);
    if (s<0) {
      s = -s;
    }
    return s;
  }

  this.getCos4Rotation = function () {
    this.angle4rotation = this.getAngle4Rotation();
    var s = Math.cos(this.angle4rotation * Math.PI/180);
    console.log("cos("+this.angle4rotation+")="+s);
    return s;
  }

  //this.rotatedRightEye = function (id4eye,degrees) {
  this.drawRotated = function (id4eye,degrees) {
      // use the rotated image as replacement for source image
      //this.eye[id4eye] = this.canvas4rotate;
      this.bool4rotate = true;
      this.angle4rotation = degrees;
      var cv = self.canvas4rotate;
      if (cv && this.img[id4eye]) {
        var image = this.img[id4eye];
        var size = {
          "width":image.width,
          "height":image.height
        }
        console.log("Rotate size="+strJSON(size));
        this.setCanvasSize(cv,size);
        var ctx = cv.getContext("2d");
        //ctx.clearRect(0,0,size.width,size.height);
        ctx.clearRect(0,0,cv.width,cv.height);

        // save the unrotated context of the canvas so we can restore it later
        // the alternative is to untranslate & unrotate after drawing
        ctx.save();

        // move to the center of the canvas
        ctx.translate(cv.width/2,cv.height/2);

        /* rotates rectangle 40 degrees
        ctx.translate(cv.width/2,cv.height/2);
        ctx.rotate(40 * Math.PI / 180);
        ctx.translate(-cv.width/2,-cv.height/2);
        ctx.fillRect(50, 20, 100, 50);
        */

        // rotate the canvas to the specified degrees
        ctx.rotate(degrees*Math.PI/180);


        //ctx.translate(-(cv.width/2),-(cv.height/2));
        // draw the image
        // since the context is rotated, the image will be rotated also
        image.crossOrigin = "anonymous";
        ctx.drawImage(image,-(cv.width/2),-(cv.height/2),cv.width,cv.height);
        //ctx.drawImage(image,-image.width/2,-image.width/2);
        //ctx.drawImage(image, 0,0 ,image.width, image.width, -self.prevsize.width/2,-self.prevsize.width/2,self.prevsize.width,self.prevsize.height);
        //ctx.drawImage(image, 0,0 ,image.width, image.width, -cv.width/2,-cv.width/2,cv.width,cv.height);
        //ctx.drawImage(image, 0,0 ,image.width, image.width, -cv.width/2,-cv.width/2,cv.width,cv.height);

        // we’re done with the rotating so restore the
        // unrotated  context
        ctx.restore();

      } else {
        console.error("For image '"+id4eye+"' rotation with "+degrees+" degrees could not be performed!");
      }
  };

  // Event Handling
  this.handleClick = function (event) {
    // prevent scrolling for touch
    event.preventDefault()

    var moveEvent = (event.touches ? event.touches[0] : event)

    // use single touch as event
    //self.setPositions(moveEvent)
  }

  // Resize Preview Canvas
  this.resizeRefresh = function () {
    // invalidate cache
    self.shouldRefresh = true;
    self.calcCanvasPreviewSize(self.getSize4Image(self.img.left));
    self.setAlignmentSize();
    //self.setCanvasSize(self.preview4align,self.prevsize);
    self.updatePreviewCanvas();
    console.log("Stereoscopy4JS.resizeRefresh() CALL")
  }

  this.clearRectangles = function (cv) {
    if (cv) {
      var ctx = cv.getContext("2d");
      ctx.clearRect(0, 0, canvas.height, canvas.width);
    }
  }

  // change the drag mode - triggered by click
  this.changeDragMode = function (evt) {
    var canvas = self.preview4align;
    if (canvas) {
      self.copyImages2Canvas();
      var mousePos = self.getMousePos4Canvas(canvas, evt);
      //if (self.mouseDragMode && (self.mouseDragMode === true)) {
      if (self.mouseDragMode === true) {
        //console.log('Mouse position on Canvas: ' + mousePos.x + ',' + mousePos.y);
        self.shift.x = mousePos.x - self.shift4ref.x; //canvas.width/2;
        self.shift.y = mousePos.y - self.shift4ref.y; //canvas.height/2;
        //self.drawPreviewRectangle();
        alert("STEREOSCOPY - Drag Mode shift=("+self.shift.x+","+self.shift.y+") for preview");
        console.log("Current Shift Position is shift.x="+self.shift.x+" shift.y="+self.shift.y);
        self.createStereoscopyImage();
        self.createAnaglyphImage();
        var sel = self.selector4output.value;
        //alert("selector4output.value='"+sel+"'")
        switch (sel) {
          case "stereoscopy":
            self.hide4dom(self.preview4align);
            self.show4dom(self.preview4cropstereo);
            self.show4dom(self.preview4stereoscopy);
            self.hide4dom(self.preview4anaglyph);
          break;
          case "anaglyph":
            self.show4dom(self.preview4align);
            self.hide4dom(self.preview4cropstereo);
            self.hide4dom(self.preview4stereoscopy);
            self.show4dom(self.preview4anaglyph);
            show4id("preview4anaglyph");
          break;
          default: // "all"
            self.hide4dom(self.preview4align);
            self.show4dom(self.preview4cropstereo);
            self.show4dom(self.preview4stereoscopy);
            self.show4dom(self.preview4anaglyph);
          }
        //self.clearRectangles();
        self.drawPreviewRectangle();
      } else {
        // store the shift4ref position - Shifting is done according first click reference
        //self.clear4canvas(canvas,"#FFFFFF");
        //this.image2canvas(self.img.left,self.preview4cropstereo);
        self.shift4ref.x = mousePos.x;
        self.shift4ref.y = mousePos.y
        //alert("START Drag Mode shift4ref.x="+mousePos.x+" shift4ref.y="+mousePos.y);
        console.log("START Drag Mode shift4ref.x="+mousePos.x+" shift4ref.y="+mousePos.y);
      }
    } else {
      console.warn("changeDragMode(evt) preview4align is not defined!");
    }
    self.mouseDragMode = !(self.mouseDragMode);
    console.log("mouseDragMode="+self.mouseDragMode);
  }

  this.changeRectangleMode = function (evt) {
    var canvas = self.preview4cropstereo;
    if (canvas) {
      var mousePos = self.getMousePos4Canvas(canvas, evt);
      if (self.mouseRectangleMode === true) {
        //console.log('Mouse position on Canvas: ' + mousePos.x + ',' + mousePos.y);
        var rect = self.calcOverlapRectangle4Preview();
        self.mouse4ref = mousePos;
        //self.rectangle4canvas(canvas,self.pos4rect.pos,self.pos4rect.size,"blue");
        self.createStereoscopyImage();
        //self.hide();

        console.log("Current Shift Position is pos4rect.x="+self.pos4rect.x+" pos4rect.y="+self.pos4rect.y);
        alert("STEREOSCOPY - Drag rectangle pos4rect=("+self.pos4rect.x+","+self.pos4rect.y+")");
      } else {
        // store the ref4rect position - Shifting is done according first click reference
        // calculate the shift relative to reference position
        self.ref4rect.x = mousePos.x;
        self.ref4rect.y = mousePos.y;
        var rect4stereo = self.calcStereoscopyRectangle4Preview();
        self.setStereoscopySliders(rect4stereo);
        self.rectangle4canvas(canvas,rect4stereo.pos,rect4stereo.size,"blue");
        self.pos4mouse = mousePos;
        //alert("START Drag Mode shift4ref.x="+mousePos.x+" shift4ref.y="+mousePos.y);
        console.log("START Drag Mode mousePos="+strJSON(mousePos));
      }
    } else {
      console.warn("changeDragMode(evt) preview4align is not defined!");
    }
    self.mouseRectangleMode = !(self.mouseRectangleMode);
    console.log("mouseRectangleMode="+self.mouseRectangleMode);
  }

  // shift right image on canvas
  this.handleShiftImage = function(evt) {
    // this.shift are coordinates for preview4align canvas
    var canvas = self.preview4align;
    if (canvas) {
      var mousePos = self.getMousePos4Canvas(canvas, evt);
      //console.log('Mouse position on Canvas: ' + mousePos.x + ',' + mousePos.y);
      self.shift.x = mousePos.x - self.shift4ref.x; //canvas.width/2
      self.shift.y = mousePos.y - self.shift4ref.y; //canvas.height/2
      //console.log('Shift position on Canvas: shift=(' + self.shift.x + ',' + self.shift.y+ ") with ShiftReference=("+self.shift4ref.x+","+self.shift4ref.y+") and mousePos=("+mousePos.x+","+mousePos.y+")");
      if (self.mouseDragMode == true) {
        self.shiftPosition(self.shift);
      }
    } else {
      console.warn("handleShiftImage(evt) preview4align is not defined!");
    }
  }

  this.handleShiftRectangle = function(evt) {
    // shift crop rectangle on canvas@align
    var canvas = self.preview4cropstereo;
    if (canvas) {
      var mousePos = self.getMousePos4Canvas(canvas, evt);
      //console.log('Rectangle Mouse position on Canvas: mousePos=(' + mousePos.x + ',' + mousePos.y+')');
      if (self.ref4rect) {
        var shift = {
          "x": 0,
          "y": 0
        };
        shift.x = Math.floor(mousePos.x - self.ref4rect.x); //canvas.width/2
        shift.y = Math.floor(mousePos.y - self.ref4rect.y); //canvas.height/2
        //console.log('Rectangle Shift on Canvas: shift=(' + shift.x + ',' + shift.y+')');
        if (self.mouseRectangleMode == true) {
          //console.log('Shift position on Canvas: (' + shift.x + ',' + shift.y+ ") with pos4rect=("+self.pos4rect.x+","+self.pos4rect.y+")");
          self.shiftCropRectangle(shift);
        };
        self.ref4rect = mousePos;
      } else {
        console.error("self.pos4rect was not defined!");
        self.pos4rect = {
          "x":0,
          "y":0
        }
      }
    } else {
      console.warn("handleShiftRectangle(evt) preview4align is not defined!");
    }
  }

  this.shiftCropRectangle = function(shift) {
    // this.shift are coordinates for preview4align canvas
    var cv = self.preview4cropstereo;
    if (cv) {
      var pos4x = self.pos4rect.x + shift.x;
      var pos4y = self.pos4rect.y + shift.y;
      var rect = self.calcOverlapRectangle4Preview();
      if (pos4x < rect.pos.x) {
          pos4x = rect.pos.x
      }
      if (pos4y < rect.pos.y) {
          pos4y = rect.pos.y
      }
      var rect4stereo = self.calcStereoscopyRectangle4Preview();
      var size4crop = rect4stereo.size;
      if (pos4x > rect.pos.x + rect.size.width - size4crop.width) {
          pos4x = rect.pos.x + rect.size.width - size4crop.width
      }
      if (pos4y > rect.pos.y + rect.size.height - size4crop.height) {
          pos4y = rect.pos.y + rect.size.height - size4crop.height
      }
      console.log('Old position rectangle: pos4rect=(' + self.pos4rect.x + ',' + self.pos4rect.y+ ") new position of rectangle=("+pos4x+","+pos4y+")");
      self.pos4rect.x = pos4x;
      self.pos4rect.y = pos4y;
      //console.log('Mouse position on Canvas: ' + mousePos.x + ',' + mousePos.y);
      if (self.mouseRectangleMode === true) {
        //console.log('Shift position of Rectangle: (' + self.pos4rect.x + ',' + self.pos4rect.y+ ")");
        self.clear4canvas(cv);
        var cvp = self.preview4align;
        var size4cv = self.getSize4Canvas(cvp);
        self.setCanvasSize(cv,size4cv);
        self.clear4rectangle(cv);
        // the size of preview4cropstereo is determined by
        // the crop size of the rectangle
        self.canvas2canvas(cvp,cv);
        self.setStereoscopySliders(rect4stereo);
        //this.setCanvasSize(cv,size);
        self.drawCropRectangle(cv,rect,rect4stereo);
      }
    } else {
      console.warn("shiftCropRectangle(evt) preview4cropstereo is not defined!");
    }
  }

  // shift right image on canvas
  this.moveImage = function(shift) {
    var canvas = self.preview4align;
    if (canvas) {
      //console.log('Mouse position on Canvas: ' + mousePos.x + ',' + mousePos.y);
      self.shift4ref.x += shift.x; // change shift reference
      self.shift4ref.y += shift.y; // change shift reference
      self.shift.x = self.shift4ref.x; //canvas.width/2
      self.shift.y =  self.shift4ref.y; //canvas.height/2
      self.mouseDragMode = false
      console.log('Move position on Canvas: (' + self.shift.x + ',' + self.shift.y+ ") with ShiftReference=("+self.shift4ref.x+","+self.shift4ref.y+")");
      self.shiftPosition(self.shift);
    } else {
      console.warn("moveImage(shift) preview4align is not defined!");
    }
  }
  // create final stereoscopy image
  this.createAnaglyphImage = function () {
    //self.hide4dom(this.preview4align);
    // rect is created for preview4cropstereo
    var rect4prev = this.calcOverlapRectangle4Preview();
    var rect      = this.calcCanvasRectangle();
    //var size = this.getSize4Anaglyph();
    this.setCanvasSize(this.canvas4anaglyph,rect.size);
    //size = this.getSize4AnaglyphPreview();
    this.setCanvasSize(this.preview4anaglyph,rect4prev.size);
    //alert("Size Stereoscopy Image ("+size.width+","+size.height+")");
    // setAnaglyphColor4Canvas() convierts the colors for left and right canvas
    this.setAnaglyphColor4Canvas(this.color4left,this.color4right);
    var cv = this.canvas4anaglyph;
    if (cv) {
      this.clear4canvas(cv);
      //this.setCanvasSize(cv,rect.size);
      this.merge4anaglyph(cv);//self.hide4dom(cv);
      if (this.preview4anaglyph) {
        self.copy2AnaglyphPreview();
        //this.show4dom(this.preview4anaglyph);
      } else {
        console.error("preview4anaglyph.context does not exist!");
      }
    } else {
      console.error("preview4cropstereo does not exist!");
    }
  }


  this.copy2AnaglyphPreview = function () {
        console.log("CALL: Stereoscopy4JS - copy2AnaglyphPreview()");
        var img = this.canvas4anaglyph;
        var cv = this.preview4anaglyph;
        this.clear4canvas(cv);
        var size = this.getSize4AnaglyphPreview();
        self.setCanvasSize(cv,size);
        //self.show4dom(cv);
        if (cv) {
          var ctx = cv.getContext("2d");
          if (ctx && img) {
            /*
            img 	Specifies the image, canvas, or video element to use
            sx 	Optional. The x coordinate where to start clipping
            sy 	Optional. The y coordinate where to start clipping
            swidth 	Optional. The width of the clipped image
            sheight 	Optional. The height of the clipped image
            x 	The x coordinate where to place the image on the canvas
            y 	The y coordinate where to place the image on the canvas
            width 	Optional. The width of the image to use (stretch or reduce the image)
            height 	Optional. The height of the image to use (stretch or reduce the image)
            */
            img.crossOrigin = "anonymous";
            ctx.drawImage(img,0,0,img.width,img.height,0,0,size.width,size.height);


          }
        }
      }


      this.createStereoscopyImage = function (pShift) {
        var shift4prev = pShift || this.shift;
        //alert("createStereoscopyImage() - shift4prev="+strJSON(shift4prev))
        this.show4exportbuttons();
        var size = this.getSize4Eye("left");
        var cv = this.canvas4stereoscopy;
        this.clear4canvas(cv);
        var rect = this.calcOverlapRectangle();
        var rect4stereo = this.calcStereoscopyRectangle();
        //var size4eye = this.getSize4Stereoscopy(rect.size);
        var size4eye = {
            "width": Math.round(cv.width/2),
            "height": cv.height
        };
        //alert("createStereoscopyImage() - rect="+strJSON(rect)+"\nsize4eye="+strJSON(size4eye)+"\nrect4stereo="+strJSON(rect4stereo));
        console.log("Size Stereoscopy Image ("+size4eye.width+","+size4eye.height+")");
        //var rect4prev = this.calcOverlapRectangle4Preview();
        if (this.canvas4left && this.canvas4right && this.canvas4stereoscopy) {
            //this.show4dom(this.canvas4left);
            //this.show4dom(this.canvas4right);
            var cvL  = this.canvas4left;
            var cvR  = this.canvas4right;
            if (self.bool4rotate == true) {
              cvR  = this.canvas4rotate;
            };
            var ctxL = cvL.getContext('2d');
            var ctxR = cvR.getContext('2d');
            // rect is created for canvas4stereoscopy
            //this.setCanvasSize(cv,rect.size);
            var ctx = cv.getContext('2d');
            ctx.reset();
            //var ctx = this.preview4align.getContext('2d');
            var width  = Math.floor(cv.width/2);
            var height = cv.height;
            //alert("merge4anaglyph() Source Canvas width="+cv.width+" height="+cv.height);
            var shift    = this.convertPosition(shift4prev,this.preview4align,this.canvas4left);
            //alert("merge4anaglyph() Source Canvas width="+cv.width+" height="+cv.height);
            var sliderval = {
              "x": this.slider4hor.value,
              "y": this.slider4vert.value
            };
            var size4src = rect4stereo.size;
            var posL = this.getImagePositionStereo("left",rect,rect4stereo,sliderval,shift);
            var posR = this.getImagePositionStereo("right",rect,rect4stereo,sliderval,shift);
            //alert("posL="+strJSON(posL)+" posR="+strJSON(posR));
            ctx.drawImage(cvL, posL.x, posL.y, size4src.width,size4src.height,0,0,size4eye.width,size4eye.height);
            ctx.drawImage(cvR, posR.x, posR.y, size4src.width,size4src.height,width+1,0,size4eye.width,size4eye.height);
            //var pixel4left  = ctxL.getImageData(rect.pos.x, rect.pos.y, width, height);
            //var pixel4left  = ctxL.getImageData(rect.pos.x, rect.pos.y, width, height);
            //var pixel4right = ctxR.getImageData(rect.pos.x-this.shift.x, rect.pos.y-this.shift.y, width, height);
            //ctx.putImageData(pixel4left, 0, 0,size4eye.width,size4eye.height,0,0,size4eye.width,size4eye.height);
            //ctx.putImageData(pixel4right,0, 0,size4eye.width,size4eye.height,size4eye.width+1, 0,size4eye.width,size4eye.height);
            self.createMask4Stereoscopy();
            self.copy2StereoscopyPreview();
        } else {
            console.error("At least one Canvas pLeft, pRight or pCanvas is missing!");
        }
  }

  this.copy2StereoscopyPreview = function () {
    console.log("CALL: Stereoscopy4JS - copy2StereoscopyPreview()");
    var img = this.canvas4stereoscopy;
    var cv = this.preview4stereoscopy;
    var size = this.getSize4StereoscopyPreview();
    self.setCanvasSize(cv,size);
    //self.show4dom(cv);
    if (cv) {
      var ctx = cv.getContext("2d");
      if (ctx && img) {
        /*
        img 	Specifies the image, canvas, or video element to use
        sx 	Optional. The x coordinate where to start clipping
        sy 	Optional. The y coordinate where to start clipping
        swidth 	Optional. The width of the clipped image
        sheight 	Optional. The height of the clipped image
        x 	The x coordinate where to place the image on the canvas
        y 	The y coordinate where to place the image on the canvas
        width 	Optional. The width of the image to use (stretch or reduce the image)
        height 	Optional. The height of the image to use (stretch or reduce the image)
        */
        img.crossOrigin = "anonymous";
        ctx.drawImage(img,0,0,img.width,img.height,0,0,size.width,size.height);
      }
    }
  }

  this.createOutputImages = function(pImageType) {
    pImageType = pImageType || "anaglyph";
    this.drawPreviewRectangle();
    this.show4exportbuttons();
    switch (pImageType) {
      case "anaglyph":
        //this.createStereoscopyImage();
        this.createAnaglyphImage();
        this.show4dom(this.preview4anaglyph);
        this.hide4dom(this.preview4stereoscopy);
      break;
      case "stereoscopy":
        this.hide4dom(this.preview4anaglyph);
        this.show4dom(this.preview4stereoscopy);
        this.createStereoscopyImage();
        //this.createAnaglyphImage();
      break;
      default:
        this.show4dom(this.preview4stereoscopy);
        this.createStereoscopyImage();
        this.show4dom(this.preview4anaglyph);
        this.createAnaglyphImage();
    }
  }

  // show stereoscopy in fullscreen
  this.fullscreen4stereoscopy = function () {
    self.fullscreen4element(self.canvas4stereoscopy);
  };

  this.fullscreen4anaglyph = function () {
    self.fullscreen4element(self.canvas4anaglyph);
  };

  this.fullscreen4window = function (imagetype) {
      var vDataURL = self.getDataURL4Canvas("canvas4"+imagetype);
      if (vDataURL) {
        //alert("width="+window.screen.width+" height="+window.screen.height);
        window.open(vDataURL,"win4"+imagetype,null, 'height='+window.screen.height+', width='+window.screen.width+', toolbar=0, location=0, status=0, scrollbars=0, resizeable=0');
      } else {
        //alert("vDataURL created by getDataURL4Canvas('"+imagetype+"') does not exist!");
        console.error("vDataURL created by getDataURL4Canvas('"+imagetype+"') does not exist!");
      }
  };

  // show stereoscopy in fullscreen
  this.XXfullscreen4element = function (img4preview) {
    if (img4preview.requestFullscreen) {
      img4preview.requestFullscreen();
    } else if (img4preview.webkitRequestFullscreen) { /* Safari */
      img4preview.webkitRequestFullscreen();
    } else if (img4preview.msRequestFullscreen) { /* IE11 */
      img4preview.msRequestFullscreen();
    }
  }


  // add mask on stereoscopy image
  this.drawMask4Stereoscopy = function (pCanvasID,pMask) {
    pCanvasID = pCanvasID || "canvas4stereoscopy";
    //alert("pCanvasID='"+pCanvasID+"'");
    var cv = this[pCanvasID] || this.canvas4stereoscopy;
    //alert("cv.id='"+cv.id+"' width="+cv.width+" height="+cv.height);
    if (cv) {
      var context = cv.getContext("2d");
      var vMask = pMask || this.img.mask;
      if (vMask) {
        console.log("Draw mask on image");
        vMask.crossOrigin = "anonymous";
        context.drawImage(vMask, 0, 0, vMask.width, vMask.height, 0, 0, cv.width, cv.height);
      } else {
        console.error("drawMaskOnImage(pCanvas) pMask does not exist");
      }
    } else {
      console.error("drawMaskOnImage(pCanvas) pCanvas does not exist");
    }
  }

  // draw mask on final stereoscopy image
  this.createMask4Stereoscopy = function () {
    if (this.canvas4stereoscopy) {
        if (this.img.mask) {
          console.log("create mask on stereoscopy image");
          console.log("this.canvas4stereoscopy width="+this.canvas4stereoscopy.width+" height="+this.canvas4stereoscopy.height);
          this.drawMask4Stereoscopy("canvas4stereoscopy",this.img.mask);
          this.drawMask4Stereoscopy("preview4stereoscopy",this.img.mask);
        } else {
          console.warn("(MASK MISSING) Image with mask for stereoscopy image not found");
        }
    } else {
      console.warn("(STEREOSCOPY IMAGE) Canvas with stereoscopy image not found");
    }
  }

  this.getDataURL4Canvas = function (pCanvasID,pFormat4MIME) {
    if (this[pCanvasID]) {
      var cv = this[pCanvasID];
      if (cv.toDataURL) {
        alert("Canvas ["+pCanvasID+"] size=(" + cv.width + "," + cv.height +")");
        var vDataURL = cv.toDataURL('image/png');//(pFormat4MIME);
        return vDataURL;
      } else {
        console.warn("Canvas ['"+pCanvasID+"'] does not have the method toDataURL()");
      }
    } else {
      console.error("Canvas ['"+pCanvasID+"'] does not exist!");
    }
  };

  this.checkMaxSize4Image = function (pImage,pSize) {
    var size = {
      "width": 300,
      "height":150
    };
    if (pSize && pSize.width && pSize.height) {
        console.log("pSize exists to calculate maximal allow sizes");
        size = pSize;
        if (pImage && pImage.width && pImage.height) {
          size.width  = Math.min(pImage.width,size.width);
          size.height = Math.min(pImage.height,size.height);
        } else {
          console.warn("checkMaxSize4Image(pImage,pSize) pImage is missing with existing pSize");
        }
    } else {
      console.log("pSize does not exist so use image size as max allowed size");
      if (pImage) {
        // pImage and width and height must exist to
        if (pImage.width && pImage.height) {
          size.width  = pImage.width;
          size.height = pImage.height;
        }
      } else {
         console.warn("checkMaxSize4Image(pImage,pSize) pImage and pSize are missing");
       }
    }
    // return maximal allowed size of image
    console.log("checkMaxSize4Image(pImage,pSize)="+strJSON(size));
    return size
  }
  // get size of single eye image
  this.getMaxSize4Image = function (pImage,pSize) {
    var img = pImage || self.img.left;
    var size = this.checkMaxSize4Image(img,pSize);
    //size = this.checkMaxSize4Image(img,pSize);
    var s = this.getSin4Rotation();
    size.width  -= size.width * s;
    size.height -= size.height * s;
    return size;
  }

  this.getSize4Image = function (img) {
    var img = img || self.img.left;
    var size = {
      "width":  640,
      "height": 480
    };
    if (img) {
      //console.log("Size img.size=("+img.naturalWidth+","+img.naturalHeight+")");
      if (img.naturalWidth > 0) {
        size.width = img.naturalWidth;
      } else {
        if (img.width > 0) {
          size.width = img.width;
        } else {
          console.warn("getSize4Image(img) naturalWidth and width undefined");
        }
      }
      if (img.naturalHeight > 0) {
        size.height = img.naturalHeight;
      } else {
        if (img.height > 0) {
          size.height = img.height;
        } else {
          console.warn("getSize4Image(img) naturalHeight and height undefined");
        }
      }
    } else {
      console.error("getSize4Image(img) image 'img' does not exist!");
    }
    return size;
  };

  // get size of single eye image
  this.getSize4Eye = function (pImgID) {
    pImgID = pImgID || "left";
    var img = self.img[pImgID] || self.img.left;
    console.log("getSize4Eye(pImgID) img."+pImgID+" size=("+img.naturalWidth+","+img.naturalHeight+")");
    var size = this.getSize4Image(img);
    return size;
  };

  this.correctRotateSize = function(size) {
    if (size) {
      if (this.bool4rotate == true) {
        var margin = this.calcRotationMargin(size.width,size.height);
        console.log("CALL: calcRotationMargin()="+strJSON(margin));
        // reduce margin
        //this.angle4rotation = 0;
        size.width  -=  margin.width;
        size.height -=  margin.height;
      }
    } else {
      console.error("correctRotateSize() not possible - parameter size was not provided");
    }
    return size;
  }

  this.getCutSize4Eye = function (pImgID) {
    pImgID = pImgID || "left";
    console.log("Cut Size img."+pImgID+" shift=("+self.shift.x+","+self.shift.y+")");
    var img = self.img[pImgID] || self.img.left;
    //var img = self.eye.right;
    var size = this.getSize4Eye(pImgID);
    // now reduce the size according to shift
    if ((size.width > 0) && (size.height > 0)) {
      size.width  -= Math.abs(self.shift.x);
      size.height -= Math.abs(self.shift.y);
      if ((size.width > 0) && (size.height > 0)) {
        // check ratio
        var imgratio = size.width/size.height;
        if (imgratio > 0) {
          console.log("imgratio="+imgratio+ " Required ratio4stereoscopy="+this.ratio4stereoscopy);
          //alert("imgratio="+imgratio+ " Required ratio4stereoscopy="+this.ratio4stereoscopy);
          // defined image ratio, compare with required ratio of single eye image
          if (imgratio > this.ratio4stereoscopy) {
            // width to large
            size.width = Math.floor(this.ratio4stereoscopy * size.height);
          } else if (imgratio < this.ratio4stereoscopy) {
            //height to large
            size.height = Math.floor(size.width / this.ratio4stereoscopy);
          }
          size = this.correctRotateSize(size);
        } else {
          console.error("getCutSize4Eye() - Image ratio not defined");
        }
      } else {
        console.warn("Shifted size of image not usable ("+size.width+","+size.height+")");
      }
    } else {
      console.warn("Source size of image not usable ("+size.width+","+size.height+")");
    }
    console.log("getSize4Eye('"+pImgID+"')="+strJSON(size));
    return size;
  }

  // get size of stereoscopy image
  // i.e. double width of single eye
  this.getRect4Anaglyph = function () {
    var rect = this.checkMaxSize4Image(this.img.left);
    return rect;
  };

  this.getCutSize = function (pImage) {
    var size = {
      "width": 640,
      "height": Math.floor(640/this.ratio4stereoscopy)
    }
    // rectangle for source images is required
    var rect = this.calcOverlapRectangle();
    if (rect) {
      console.log("Check if image is landscape or portrait after shift");
      var m = Math.min(rect.size.width,rect.size.height);
      if (rect.size.width < rect.size.height) {
        console.log("landscape image");
        size.width = m * this.ratio4stereoscopy;
        size.height = m;
      } else {
        console.log("portrait image");
        size.width = m;
        size.height = Math.floor(m / this.ratio4stereoscopy);
      }
    } else {
      console.error("getCutSize() - rect is not defined!");
    }
    //size = rect.size;
    return size;
  }



  this.getCutSizeLeft = function (pImage) {
    // rectangle for source images is required
    var rect = this.calcOverlapRectangle();
    var size = { //* m
          width:  this.src.width - pImage.width,
          height: this.src.height - pImage.height
    };
    size = rect.size;
    return size;
  }

  this.calcSourceWidth = function () {
    var wl = this.img.left.width;
    var hl = this.img.left.height;
    var wr = this.img.right.width;
    var hr = this.img.right.height;
    this.src.width  = Math.min(wl,wr);
    this.src.height = Math.min(hl,hr);
    return {
      "width":  this.src.width,
      "height": this.src.height
    }
  }


  this.calcSourceSize = function () {
    var wl = this.canvas4left.width;
    var hl = this.canvas4left.height;
    var wr = this.canvas4right.width;
    var hr = this.canvas4right.height;
    this.src.width  = Math.min(wl,wr);
    this.src.height = Math.min(hl,hr);
    return {
      "width":  this.src.width,
      "height": this.src.height
    }
  }
  // get size of stereoscopy image
  // i.e. double width of single eye
  this.getSize4Stereoscopy = function (size4src) {
    // calculates the Size for
    if (size4src) {
      console.log("getSize4Stereoscopy(size4src) calculates the size of the preview rectangle showing the stereoscopy image - size4src="+strJSON(size4src));
    } else {
      size4src = this.calcSourceSize();
      console.warn("getSize4Stereoscopy(size4src) size4src is missing!  - size4src="+strJSON(size4src));
    };
    var m = Math.min(size4src.width/this.ratio4stereoscopy,size4src.height);
    // ratio4stereoscopy is the single eye stereoscopy ratio  between eye width and eye height
    var size = {
      "width": Math.floor(2 * m * this.ratio4stereoscopy),
      "height": m
    };
    // this.cutsize = this.getCutSize(this.img.left);
    console.log("getSize4Stereoscopy() - Stereoscopy Size Image ("+size.width+","+size.height+")");
    return size;
  };

  this.getSize4StereoscopyPreview = function () {
    var size4src = this.getSize4Image(this.img.left) || this.calcSourceWidth();
    var width = this.getPreviewWidth();
    var size = {
      "width": width,
      "height": Math.floor(width / (2*this.ratio4stereoscopy))
    }
    console.log("Stereoscopy Preview - Size Image ("+size.width+","+size.height+") Source Size  ("+size4src.width+","+size4src.height+")");
    return size;
  }

  this.getSize4AnaglyphPreview = function () {
    var rect = this.calcOverlapRectangle4Preview();
    var new_width  = Math.floor(this.getPreviewWidth());
    var new_height = Math.floor(rect.size.height * new_width/rect.size.width);
    var size = {
      "width": new_width,
      "height": new_height
    }
    //console.log("Analglyph - Size Image ("+size.width+","+size.height+") Preview Size  ("+this.prevsize.width+","+this.prevsize.height+")");
    return size;
  }

  this.getSize4Anaglyph = function () {
    // rectangle for source images is required
    var rect = this.calcOverlapRectangle();
    console.log("Analglyph - Size Image ("+rect.size.width+","+rect.size.height+") Preview Size  ("+this.prevsize.width+","+this.prevsize.height+")");
    return rect.size;
  }

  this.adapt2cutsize = function (eyeid,img,pos) {
    var cutsize = this.getCutSize(img);
    var rect = this.calcOverlapRectangle();
    if (eyeid == "left") {
      pos.x += Math.floor((rect.size.width-cutsize.width)/4);
      pos.x += Math.floor((rect.size.width-cutsize.width)/4);
    } else {
      pos.x += Math.floor((rect.size.width-cutsize.width)/4);
      pos.x += Math.floor((rect.size.width-cutsize.width)/4);
    }
    console.log("adapt2cutsize(img,pos)="+strJSON(pos));
    return pos;
  };
  this.getImagePosition = function (eyeid,shift4src) {
    var pos = {
      x:0,
      y:0
    };
    if (shift4src) {
      if (eyeid == "left") {
        pos.x = Math.max(pos.x,shift4src.x);
        pos.y = Math.max(pos.y,shift4src.y);
      } else {
        pos.x = Math.max(pos.x,-shift4src.x);
        pos.y = Math.max(pos.y,-shift4src.y);
      };
    } else {
      console.error("getImagePosition('"+eyeid+"',shift4src) shift4src is not defined!");
    }
    return pos;
  };

  this.getImagePositionStereo = function (eyeid,rect,rect4stereo,sliderval,shift4src) {
    var add2width  = 0;
    var add2height = 0;
    // default - copy from top/left  (0,0)
    var pos = this.getImagePosition(eyeid,shift4src);
    var range = {
      x:(rect.size.width - rect4stereo.size.width),
      y:(rect.size.height - rect4stereo.size.height)
    };
    // selected image for eye
    if (eyeid == "left") {
      // LEFT EYE
      pos.x += sliderval.x * range.x;
      //pos.x += add2width;
      pos.y += sliderval.y * range.y;
      //pos.y += add2height;
      //pos = this.adapt2cutsize(eyeid,img,pos);
      //alert("pos['left']=("+pos.x+","+pos.y+")");
      console.log("pos['left']=("+pos.x+","+pos.y+") add2width="+add2width+" add2height="+add2height);
    } else {
      // RIGHT EYE
      pos.x += sliderval.x * range.x;
      //pos.x += add2width;
      pos.y += sliderval.y * range.y;
      //pos.y += add2height;
      //pos = this.adapt2cutsize(eyeid,img,pos);
      //alert("pos['right']=("+pos.x+","+pos.y+")");
      console.log("pos['right']=("+pos.x+","+pos.y+") add2width="+add2width+" add2height="+add2height);
    }

    return pos;
  };


  // Event Binding
  this.bindEvents = function () {
    self.container.addEventListener('mousemove', self.handleClick, false)
    self.container.addEventListener('touchmove', self.handleClick, false)
    //self.preview4align.addEventListener('mousemove', self.handleClick, false)
    //self.preview4align.addEventListener('touchmove', self.handleClick, false)

    window.addEventListener('resize', self.resizeRefresh, false);
    //window.addEventListener('scroll', self.scrollRefresh, false);
    var canvas = self.preview4align;
    if (canvas) {
      canvas.addEventListener("mousedown", self.changeDragMode,false);
      canvas.addEventListener('mousemove', self.handleShiftImage,false);
    } else {
      console.warn("preview4align does not exits for bindEvents()");
    }
    canvas = self.preview4cropstereo;
    if (canvas) {
      canvas.addEventListener("mousedown", self.changeRectangleMode,false);
      canvas.addEventListener('mousemove', self.handleShiftRectangle,false);
    } else {
      console.warn("preview4align does not exits for bindEvents()");
    }
  }

  // Event Unbinding
  this.destroy = function () {
    self.container.removeEventListener('mousemove', self.handleClick);
    self.container.removeEventListener('touchmove', self.handleClick);
    window.removeEventListener('resize', self.resizeRefresh, false);
    //window.removeEventListener('scroll', self.scrollRefresh, false);
    //self.preview4align.removeEventListener('mousemove', self.setPositions);
    //self.preview4align.removeEventListener("mousedown", self.changeDragMode);
    var canvas = self.preview4align;
    if (canvas) {
      canvas.removeEventListener("mousedown", self.changeDragMode,false);
      canvas.removeEventListener('mousemove', self.handleShiftImage,false);
    } else {
      console.warn("preview4align does not exits for destroyEvents()");
    }
  }

  this.blend4image = function (alpha) {
    var alpha = alpha || 0.5;
    if (this.preview4align) {
      var context = self.preview4align.getContext('2d');
      var context4left = self.canvas4left.getContext('2d');
      var context4right = self.canvas4right.getContext('2d');
      // Get the CanvasPixelArray from the given coordinates and dimensions.
      var x = 1;
      var y = 1;
      var width = 300;
      var height = 150;
      self.img.left.crossOrigin = "anonymous";
      self.img.right.crossOrigin = "anonymous";
      context4left.drawImage(self.img.left, 0 , 0);
      context4right.drawImage(self.img.right, 0 , 0);

      //var imgd = context.getImageData(x, y, width, height);
      //var pix = imgd.data;

    } else {
      console.error("preview4align does not exist");
    }

  }


  // Calculate Viewer Size and Position
  this.getDimensions = function () {
    self.containerHeight = self.container.clientHeight;
    self.containerWidth = self.container.clientWidth;
    self.containerBox = self.container.getBoundingClientRect()
    // revalidate the cache
    self.shouldRefresh = false
  }

  // shift image on canvas
  this.shiftPosition = function (shift) {
    if (this.preview4align) {
      var cv = this.preview4align;
      var ctx = cv.getContext("2d");
        if (ctx) {
          ctx.reset();
          ctx.globalAlpha = 0.8;
          var img = self.img.left;
          img.crossOrigin = "anonymous";
          ctx.drawImage(img, 0, 0,img.width,img.height,0,0,cv.width,cv.height);
          ctx.globalAlpha = 0.4;
          //translate center to center of image
          ctx.translate(cv.width/2,cv.height/2);
          // rotate the canvas to the specified degrees
          ctx.rotate(this.angle4rotation*Math.PI/180);
          ctx.translate(-cv.width/2,-cv.height/2);
          ctx.translate(shift.x,shift.y);
          img = self.img.right;
          ctx.drawImage(img, 0, 0,img.width,img.height,0,0,cv.width,cv.height);
          //ctx.drawImage(self.eye.right, xConverted, yConverted);
          /*//var swidth =
          if (this.bool4rotate == true) {
            self.canvas4rotate.crossOrigin = "anonymous";
            ctx.drawImage(self.canvas4rotate, -shift.x, -shift.y,img.width,img.height,0,0,cv.width,cv.height);
          } else {
            self.eye.right.crossOrigin = "anonymous";
            ctx.drawImage(self.eye.right, -shift.x, -shift.y,img.width,img.height,0,0,cv.width,cv.height);
          }
          */
          //this.drawPreviewRectangle();
        } else {
          console.warn("preview4align.context does not exist!");
        }
    } else {
      console.warn("preview4align does not exist!");
    }
  }
  this.calcCanvasRectangle = function () {
    var rect = this.calcOverlapRectangle4Preview();
    // rect was created for preview4cropstereo
    //var cv4src = this.preview4cropstereo;
    var cv4src = this.preview4align;
    var cv4dest = this.getSize4Eye("left");
    var pos  = this.convertPosition(rect.pos,cv4src,cv4dest);
    var size = this.convertSize(rect.size,cv4src,cv4dest);
    if ((pos.x + size.width) > cv4dest.width) {
       //alert("pos.x+width "+ (pos.x+size.width) +" exceeding width of destination canvas "+cv4dest.width);
       size.width = cv4dest.width - pos.x
    }
    if ((pos.y + size.height) > cv4dest.height) {
      //alert("pos.y+height "+ (pos.y+size.height) +" exceeding height of destination canvas "+cv4dest.height);
      size.height = cv4dest.height - pos.y
    }
    var rect4cv = {
      "pos": pos,
      "size": size
    };
    return rect4cv;
  };

  this.calcOverlapRectangle4Shift = function (pShift,pCanvas) {
    // this.shift is the real shift of the image
    var shift = pShift || this.shift;// shift position
    var cv = pCanvas || this.canvas4left;
    // rect will be created for preview4align
    var rect = {
      "pos": {
        "x":0,
        "y":0
      },
      "size": {
        "width":  cv.width,
        "height": cv.height
      }
    };
    if (shift.x > 0) {
      rect.pos.x  = shift.x;
    } else {
      rect.pos.x  = 0;
    }
    // reduce width if shiftx is negative
    rect.size.width -= Math.abs(shift.x);
    if (shift.y > 0) {
      rect.pos.y  = shift.y;
    } else {
      rect.pos.y  = 0;
    }
    // reduce height according to shift
    rect.size.height -= Math.abs(shift.y);
    // calc angle4rotation
    var s = this.getSin4Rotation();
    //alert("rect.pos.x=" + rect.pos.x + " + " + Math.floor(s*rect.size.height)+" sin("+this.angle4rotation+")="+s);
    if (s !== 0.0) {
      rect.pos.x  += Math.floor(s*rect.size.height/2);
      rect.size.width -= Math.floor(s*rect.size.height);
      //alert("rect.pos.y=" + rect.pos.y + " + " + Math.floor(s*rect.size.width)+" sin("+this.angle4rotation+")="+s);
      rect.pos.y  += Math.floor(s*rect.size.width/2);
      rect.size.height -= Math.floor(s*rect.size.width);
    }
    /*
    */
    //alert("this.calcOverlapRectangle4Shift('"+cv.id+"')\nshift="+strJSON(shift)+"\nrect="+strJSON(rect)+"\n"+cv.id+".width="+cv.width+" "+cv.id+".height="+cv.height);
    return rect;
  }

  this.calcOverlapRectangle4Preview = function () {
    // if shift is refering to the preview image
    // if shift is refering to the source image
    //var shift = this.convertPosition(this.shift,this.img.left,this.preview4align);
    //alert("shift4preview="+strJSON(shift)+"\nshift4canvas="+strJSON(this.shift));
    var cv = this.canvas4left;
    var cvp = this.preview4align;
    var shift4prev = this.convertPosition(this.shift,cvp,cv);
    this.rect4overlap4prev = this.calcOverlapRectangle4Shift(this.shift,this.preview4align);
    return this.rect4overlap4prev;
  };

  this.getShift4Source = function (shift) {
    shift = shift || {
      "x":this.shift.x,
      "y":this.shift.y
    };
    var shift4src = this.convertPosition(shift,this.preview4align,this.canvas4left);
    //alert("this.getShift4Source(shift)="+strJSON(shift4src)+"\nwith shift="+strJSON(shift));
    return shift4src;
  }

  this.calcOverlapRectangle = function () {
    // this.shift is the real shift of the image
    // shift position refers
    var cv = this.canvas4left;
    var shift4src = this.getShift4Source();
    this.rect4overlap = this.calcOverlapRectangle4Shift(shift4src,cv);
    return this.rect4overlap;
  };

  this.correctPosition4Rectangle = function(rect) {
      var cv = self.preview4cropstereo;
      var pos4rect = rect.pos;
      if (self.pos4rect) {
        var pos = self.pos4rect;
        if (pos.x < rect.pos.x) {
          pos.x = rect.pos.x
        }
        if (pos.y < rect.pos.y) {
          pos.y = rect.pos.y
        }
        if (pos.x > cv.width - rect.size.width) {
            pos.x = cv.width - rect.size.width
        }
        if (pos.y > cv.height - rect.size.height) {
            pos.y = cv.height - rect.size.height
        }
        pos.x = Math.floor(pos.x);
        pos.y = Math.floor(pos.y);
      } else {
        console.error("self.pos4rect does not exist!");
        pos = rect.pos;
      }
      return pos;
  }

  this.calcStereoscopySliders = function (rect4stereo) {
    var rect = this.calcOverlapRectangle4Preview();
    var size = rect.size;
    //console.log("slider - shift="+strJSON(this.shift)+"rect="+strJSON(rect)+" rect4stereo="+strJSON(rect4stereo));
    var min4x = rect.pos.x;
    var max4x = rect.size.width - rect4stereo.size.width;
    var min4y = rect.pos.y;
    var max4y = rect.size.height - rect4stereo.size.height;
    var val4x = this.pos4rect.x - min4x;
    var val4y = this.pos4rect.y - min4y;
    //console.log("min4x="+min4x+" max4x="+max4x+" val4x="+val4x+ " rect.size.width="+rect.size.width+" rect4stereo.size.width="+rect4stereo.size.width);
    if (min4x == max4x) {
      // means that no shift for y possible
      max4x = val4x + min4x;
    }
    if (min4y == max4y) {
      // means that no shift for y possible
      max4y = val4y + min4y;
    }
    // slider value are between 0 and 1
    var sliderval = {
      "x": val4x/(max4x-min4x),
      "y": val4y/(max4y-min4y)
    }
    return sliderval;
  }
  this.getStereoscopySliders = function() {
    var sliderval = {
      "x": this.slider4hor.value,
      "y": this.slider4vert.value
    }
    return sliderval;
  }

  this.setStereoscopySliders = function (rect4stereo) {
    var sliderval = this.calcStereoscopySliders(rect4stereo);
    console.log("slider values="+strJSON(sliderval));
    this.slider4hor.value = sliderval.x; // between 0 and 1
    this.slider4vert.value = sliderval.y; // between 0 and 1
  }

  this.sliders2rectangle = function () {
      var sliderval = this.getStereoscopySliders();
      var cv = self.preview4cropstereo;
      console.log("CALL: setSliders2Pos4Rect() - slider values="+strJSON(sliderval));
      var rect = this.calcOverlapRectangle4Preview();
      var rect4stereo = self.calcStereoscopyRectangle4Preview();
      var size = rect4stereo.size;
      var range4x = rect.size.width  - size.width;
      var range4y = rect.size.height - size.height;
      this.pos4rect.x = rect.pos.x + Math.floor(sliderval.x * range4x);
      this.pos4rect.y = rect.pos.y + Math.floor(sliderval.y * range4y);
      this.drawCropRectangle(cv,rect,rect4stereo);
      this.createStereoscopyImage();
  }

  this.calcStereoscopyRectangle4Preview = function () {
    var rect = this.calcOverlapRectangle4Preview();
    var size = rect.size;
    var m = Math.min(size.width/this.ratio4stereoscopy,size.height);
    var size4croprect =  {
      "width": Math.floor(this.ratio4stereoscopy * m),
      "height": Math.floor(m)
    };
    self.pos4rect = this.correctPosition4Rectangle(rect);
    var rect = {
      "pos": self.pos4rect,
      "size" : size4croprect
    };
    return rect;
  };


  this.calcPostion4Rectangle = function (pShift) {
    var shift4source = pShift || this.convertPosition(this.shift,this.preview4align,this.canvas4left);
    //var shift4source = this.shift;
    alert("calcPostion4Rectangle() - shift4source="+strJSON(shift4source)+"\nthis.shift="+strJSON(this.shift));
    var pos4rect = {
      "x":Math.max(shift4source.x,0),
      "y":Math.max(shift4source.y,0)
    };
    return pos4rect;
  }

  this.calcStereoscopyRectangle = function () {
    var rect4prev = this.calcOverlapRectangle4Preview();
    //alert("calcStereoscopyRectangle()")
    var rect = this.calcOverlapRectangle();
    var sliderval = {
      "x":this.slider4hor,
      "y":this.slider4vert
    };
    var size = rect.size;
    var m = Math.min(size.width/this.ratio4stereoscopy,size.height);
    var size4croprect =  {
      "width": Math.floor(this.ratio4stereoscopy * m),
      "height": Math.floor(m)
    };
    //self.pos4rect = this.correctPosition4Rectangle(rect4prev);
    var cv4src = this.preview4align;
    var cv4dest = this.getSize4Eye("left");
    var rect = {
      "pos":  rect.pos, //this.calcPostion4Rectangle(),
      "size" : size4croprect
    };
    return rect;
  };


  this.rectangle4canvas = function (cv,pos,size,color,linewidth) {
    color = color || "red";
    linewidth = linewidth || "6";
    if (pos) {
      if (size) {
        //console.log("rectangle4canvas('"+cv.id+"',pos,size,'"+color+"','"+linewidth+"')\npos="+strJSON(pos)+"\nsize="+strJSON(size)+"")
        pos = pos || {
          x:0,
          y:0
        };
        size = size || {
          width:100,
          height:50
        };
        var ctx = cv.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.lineWidth = linewidth;
            ctx.strokeStyle = color;
            ctx.rect(pos.x, pos.y, size.width, size.height);
            ctx.stroke();
            ctx.closePath();
        } else {
          console.error("rectangle4canvas(cv,pos,size,color,linewidth) - no canvas context found");
        }
      } else {
        console.error("rectangle4canvas(cv,pos,size,color,linewidth) size is not defined");
      }
    } else {
      console.error("rectangle4canvas(cv,pos,size,color,linewidth) pos is not defined");
    }

  }
  // Draw Crop Rectangle on canvas_raw cancas4preview
  this.drawPreviewRectangle = function () {
    // this.shift is the real shift of the image
    var shift = this.shift;// shift position
    // this is the preview rectangle for overlap
    // rect was created for preview4cropstereo
    var rect = this.calcOverlapRectangle4Preview("left");
    //size = this.convertSize(rect.size,this.preview4cropstereo,size4eye);
    //alert("Size for Rectangle: "+strJSON(size)+" shift: "+strJSON(shift)+ " preview4align: width="+this.preview4align.width+ "height="+this.preview4align.height);
    //var pos = this.convertPosition(rect.pos,this.preview4cropstereo,this.preview4align);
    var pos = rect.pos;
    var size = rect.size;
    var cvp = this.preview4align;
    //var size4cvp = this.convertSize(size,canvas4left,cvp)
    //size = this.convertSize(size,canvas4left,cvp)
    // preview4cropstereo is the canvas in which the red rectangle is created
    var cv = this.preview4cropstereo;
    var size4cv = this.getSize4Canvas(cvp);
    this.setCanvasSize(cv,size4cv);
    // the size of preview4cropstereo is determined by
    // the crop size of the rectangle
    this.canvas2canvas(cvp,cv);
    //this.setCanvasSize(cv,size);
    //this.show4dom(cv);
    this.rectangle4canvas(cv,rect.pos,rect.size,"red","6");
    this.rectangle4canvas(cvp,rect.size,rect.pos,"red","6");
  }

  this.drawCropRectangle = function (cv,rect,rect4stereo) {
    self.rectangle4canvas(cv,rect.pos,rect.size,"red","6");
    self.rectangle4canvas(cv,self.pos4rect,rect4stereo.size,"blue","6");
  }

  this.getSize4Canvas = function (pCanvas) {
      var size4cv = {
        "width":320,
        "height":240
      };
      if (pCanvas && pCanvas.width && pCanvas.height) {
        size4cv.width  = pCanvas.width;
        size4cv.height = pCanvas.height
      } else {
        console.error("getSize4Canvas(pCanvas) - pCanvas does not provide size information about width and height");
      };
      return size4cv
  }

  // Convert Size between Canvas Sizes
  this.convertSize = function (size,old_size,new_size) {
    var size4cv = {
      width:  size.width,
      height: size.height
    };
    if (old_size && new_size) {
      size4cv.width  = Math.floor(size.width  * new_size.width  / old_size.width);
      size4cv.height = Math.floor(size.height * new_size.height / old_size.height);
    } else {
      console.error("Canvas 'cv4size' or 'cv4convert' are missing!");
    }
    return size4cv;
  }


    // Convert Position between Canvas Sizes
    this.convertPosition = function (pos,cv4size,cv4convert) {
      var pos4cv = {
        "x": pos.x,
        "y": pos.y
      };
      if (cv4size && cv4convert) {
        pos4cv.x = Math.floor(pos.x * cv4convert.width  / cv4size.width);
        pos4cv.y = Math.floor(pos.y * cv4convert.height / cv4size.height);
      } else {
        console.error("Canvas 'cv4size' or 'cv4convert' are missing!");
      }
      return pos4cv;
    }
}
