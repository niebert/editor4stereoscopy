
      function el(pID) {
        var vNode = document.getElementById(pID);
        if (vNode) {
          return vNode;
        } else {
          console.error("DOM node with ID ["+pID+"] not found");
        }
      }

      function strJSON(pJSON) {
        var vString = "undefined string";
        if (pJSON) {
            vString = JSON.stringify(pJSON,null,4);
        } else {
          console.error("strJSON(pJSON) - pJSON is not defined!");
        }
        return vString;
      }

      var cloneJSON = function (pJSON) {
        var vJSON = {};
        if (pJSON) {
          vJSON = JSON.parse(JSON.stringify(pJSON));
        } else {
        };
        return vJSON
      };


      function applyCamanJS() {
        Caman("#image-id", function () {
          this.brightness(10);
          this.contrast(20);
          this.render(function () {
            alert("Done!");
          });
        });
      }

      function setImage2Editor(pLeftRight,pFilename,pBase64) {
        if (stereoscopy4js && stereoscopy4js.setImage) {
          console.log("setImage2Editor('"+pLeftRight+"','"+pFilename+"',pBase64)");
          stereoscopy4js.setImage(pLeftRight,pFilename,pBase64);
        } else {
          console.error("Missing instance 'stereoscopy4js' - shift operation ("+x+","+y+") not performed!");
        }
      };

      var boolAllCanvas = false;

      function showAllCanvasClick() {
        if (stereoscopy4js) {
          if (boolAllCanvas == false) {
            stereoscopy4js.showAllCanvas();
          } else {
            stereoscopy4js.hideAllCanvas();
          }
        } else {
          console.error("stereoscopy4js is not defined");
        }
        boolAllCanvas = !boolAllCanvas;
      }

      function moveImage(x,y) {
        var shift = {
          "x":x,
          "y":y
        };
        if (stereoscopy4js && stereoscopy4js.moveImage) {
          console.log("moveImage("+x+","+y+")");
          stereoscopy4js.moveImage(shift);
        } else {
          console.error("Missing instance 'stereoscopy4js' - shift operation ("+x+","+y+") not performed!");
        }
      }

      function setSlider4Rotation(id4eye,degrees) {
        var vNode = el('slider4degree');
        if (vNode) {
          vNode.value = degrees;
        };
        var vNode = el('span4degree');
        if (vNode) {
          vNode.innerHTML = degrees;
        };
      }

      function resetRotation(id4eye) {
        var degrees = 0.0;
        rotateImage(id4eye,degrees);
      }

      function rotateImage(id4eye,degrees) {
        //degrees = Math.round(degrees);
        id4eye = id4eye || "right";
        setSlider4Rotation(id4eye,degrees);
        if (stereoscopy4js) {
            console.log("CALL: drawRotated('"+id4eye+"',"+degrees+")");
            stereoscopy4js.drawRotated(id4eye,degrees);
            stereoscopy4js.clearPreview();
            stereoscopy4js.updatePreviewCanvas();
        }
      }

      function rotateImageClick(id4eye,degrees) {
        //degrees = Math.round(degrees);
        var vNode = el('slider4degree');
        if (vNode) {
          console.log("CALL: rotateImageClick('"+id4eye+"',"+degrees+") current angle="+vNode.value);
          var new_angle = parseFloat(vNode.value) + parseFloat(degrees);
          new_angle = new_angle.toFixed(1)
          vNode.value = new_angle;
          console.log("CALL: rotateImage('"+id4eye+"',"+new_angle+")  current angle="+vNode.value);
          rotateImage(id4eye,new_angle);
        }
      }

      function color4button(pColor) {
        var buttonColor = "#FF0000";
        pColor = pColor || "red";
        switch (pColor) {
          case "red":
            buttonColor = "#FF0000";
          break;
          case "green":
            buttonColor = "#04AA6D";
          break;
          case "cyan":
            buttonColor = "#00CED1";
          break;
          default:
            buttonColor = "red";
        }
        return buttonColor;
      };

      function changeAnaglyphColor() {
        var vLeft  = "red";
        var vRight = "green";
        // fetch color setting from HTML form select elements
        var vNode = el("color4left");
        if (vNode) {
          // set to vLeft color for left eye
          vLeft = vNode.value
        } else {
          console.error("Selector: 'color4left' does not exist!");
        }
        vNode = el("color4right");
        if (vNode) {
          // set to vRight color for right eye
          vRight = vNode.value
        } else {
          console.error("Selector: 'color4right' does not exist!");
        }
        // check color setting with stereoscopy4js instance
        if (stereoscopy4js) {
            console.log("CALL: changeAnaglyph('"+vLeft+"',"+vRight+")");
            // return the corrected colorsetting to 'colors'
            // correction is required if both eyes assign the color filter "red"
            var colors = stereoscopy4js.setAnaglyphColor(vLeft,vRight);
            // set corrected color left
            vNode = el("color4left");
            if (vNode) {
              vNode.value = colors.left;
            };
            vNode = el("color4right");
            if (vNode) {
              vNode.value = colors.right;
            };
            vNode = el("bSaveLeft");
            if (vNode) {
              vNode.style.backgroundColor = color4button(colors.left);
            };
            vNode = el("bSaveRight");
            if (vNode) {
              vNode.style.backgroundColor = color4button(colors.right);
            }

        }
      }


      function changeOutputFormat(imagetype) {
        imagetype = imagetype || "anaglyph";
        if (stereoscopy4js) {
          var s4js = stereoscopy4js;
          switch (imagetype) {
          case "anaglyph":
            show4id("button4align");
            show4id("preview4align");
            hide4id("preview4cropstereo");
            show4id("bFullscreenAnaglyph");
            show4id("bSaveAnaglyph");
            hide4id("button4cropstereo");
            hide4id("bFullscreenStereoscopy");
            hide4id("bSaveStereoscopy");
          break;
          case "stereoscopy":
            show4id("button4align");
            show4id("preview4align");
            hide4id("preview4cropstereo");
            hide4id("bFullscreenAnaglyph");
            hide4id("bSaveAnaglyph");
            show4id("button4cropstereo");
            show4id("bFullscreenStereoscopy");
            show4id("bSaveStereoscopy");
          break;
          default:
            show4id("button4align");
            show4id("preview4align");
            hide4id("preview4cropstereo");
            show4id("bFullscreenAnaglyph");
            show4id("bSaveAnaglyph");
            show4id("button4cropstereo");
            show4id("bFullscreenStereoscopy");
            show4id("bSaveStereoscopy");
          }
        }
        hide4id("preview4stereoscopy");
        hide4id("preview4anaglyph");
      }

      function showFullscreen(imagetype) {
        imagetype = imagetype || "stereoscopy";
        alert("Show '"+imagetype+"' Image Fullscreen");
        if (stereoscopy4js && stereoscopy4js.fullscreen4window) {
          stereoscopy4js.fullscreen4window(imagetype)
        }
        /*
        */
    }

      function convertGreyscaleClick() {
        if (stereoscopy4js && stereoscopy4js.convertCanvas2Greyscale) {
          console.log("convertCanvas2Greyscale()-CALL");
          alert("Convert anaglyph left and right canvas to greyscale")
          stereoscopy4js.convertCanvas2Greyscale();
        } else {
          console.error("Missing instance 'stereoscopy4js' - convertCanvas2Greyscale() not performed!");
        }
      }

      function saveImage4Canvas(type3d,pFormat) {
        var canvas;
        var greyscale = false;
        var format4mime = "image/png";
        type3d = type3d || "stereoscopy";
        var extension = "png";
        var filebasename = filebasename || type3d;
        var vFilename = "undefined.png";
        var vNode = document.getElementById("basefilename");
        if (vNode) {
          filebasename = vNode.value + "_" + type3d;
        }
        //alert("saveImage4Canvas('"+type3d+"','"+filebasename+"','"+pFormat+"')")
        switch (pFormat) {
          case "png":
            format4mime = "image/png";
            extension = "png";
          break;
          case "jpg":
            format4mime = "image/jpg";
            extension = "jpg";
          break;
          default:
            format4mime = "image/png";
            extension = "png";
        }
        vFilename = filebasename +"."+extension;
        switch (type3d) {
          case "all":
            // save anaglyph image file
            saveImage4Canvas("anaglyph",pFormat);
            // save stereoscopy image file
            canvas = document.getElementById("canvas4stereoscopy");
            type3d = "stereoscopy";
          break;
          case "anaglyph":
            canvas = document.getElementById("canvas4anaglyph");
          break;
          case "stereoscopy":
            canvas = document.getElementById("canvas4stereoscopy");
          break;
          case "left":
            canvas = document.getElementById("canvas4left");
          break;
          case "right":
            canvas = document.getElementById("canvas4right");
          break;
          case "rotate":
            canvas = document.getElementById("canvas4rotate");
          break;
          case "preview4align":
            canvas = document.getElementById("preview4align");
          break;
          case "preview4cropstereo":
            canvas = document.getElementById("preview4cropstereo");
          break;
          case "anaglyph4left":
            canvas = document.getElementById("anaglyph4left");
          break;
          case "anaglyph4right":
            canvas = document.getElementById("anaglyph4right");
          break;
          case "greyscale4left":
            greyscale = true;
            canvas = document.getElementById("anaglyph4left");
          break;
          case "greyscale4right":
            greyscale = true;
            canvas = document.getElementById("anaglyph4right");
          break;
          default:
            canvas = document.getElementById("canvas4stereoscopy");
        };
        if (greyscale == true) {
          if (stereoscopy4js && stereoscopy4js.canvas2greyscale) {
          }
        }
        if (canvas) {
          canvas.crossOrigin="anonymous";

          var vDataURL = canvas.toDataURL("image/png");
          if (vDataURL) {
            //alert("vDataURL="+vDataURL.substring(0,120)+"...");
            saveImageFile(vFilename,vDataURL);
            alert("Save '"+(type3d.toUpperCase())+"' Image to File '" + vFilename + "'");
          } else {
            alert("ERROR on Save: DataURL of image '"+vFilename+"' does not exist!")
          }
        } else {
          console.error("Canvas 'canvas4"+type3d+"' does not exist");
        }
        if (greyscale == true) {
          if (stereoscopy4js) {
            var cvid = "canvas2"+el(color4left).value;
            stereoscopy[cvid](el("canvas4left"),el("anaglyph4left"))
          }
        }


      }

      function hide4id(pID) {
          if (stereoscopy4js) {
            if (pID) {
              var vNode = el(pID)
              if (vNode) {
                stereoscopy4js.hide4dom(vNode)
              } else {
                console.error("DOM node with '"+pID+"' not defined!");
              }
            } else {
              console.error("hide4dom(pID) - pID not defined!");
            }
          } else {
            console.error("Stereoscopy4JS object does not exist!");
          }
      }

      function show4id(pID) {
          if (stereoscopy4js) {
            if (pID) {
              var vNode = el(pID)
              if (vNode) {
                stereoscopy4js.show4dom(vNode)
              } else {
                console.error("DOM node with '"+pID+"' not defined!");
              }
            } else {
              console.error("hide4dom(pID) - pID not defined!");
            }
          } else {
            console.error("Stereoscopy4JS object does not exist!");
          }
      }

      function getOutputSelector () {
        var vReturn = "all";
        var vNode = el("selector4output");
        if (vNode) {
          vReturn = vNode.value;
        } else {
          console.error("Selector 'outputselector' is not defined!");
        }
      }

      function createImages() {
        var s4o = getOutputSelector();
        show4id("exportButtons");
        if (stereoscopy4js) {
            switch (s4o) {
              case "anaglyph":
                  hide4id("preview4anaglyph");
                  show4id("preview4stereoscopy");
              break;
              case "stereoscopy":
                  hide4id("preview4anaglyph");
                  show4id("preview4stereoscopy");
              break;
              default:
                show4id("preview4anaglyph");
                show4id("preview4stereoscopy");
            }
        }
        if (stereoscopy4js.createOuptutImages) {
          stereoscopy4js.showAllCanvas();
          stereoscopy4js.createOuptutImages();
        } else {
          console.error("Stereoscopy4JS object does not exist!");
        }
      }

      function startPositioningImage() {
        if (stereoscopy4js) {
          stereoscopy4js.show4dom(el("buttons4positioning"));
          if (stereoscopy4js.startPositioningImage) {
            //stereoscopy4js.bindEvents();
            stereoscopy4js.startPositioningImage();
          } else {
            console.error("Stereoscopy4JS.startPositioningImage() object or method was not defined!");
          }
        } else {
          console.error("Stereoscopy4JS object does not exist!");
        }
      }

      function startCropingImage() {
        if (stereoscopy4js) {
          stereoscopy4js.hide4dom(el("buttons4positioning"));
          if (stereoscopy4js.startCropingImage) {
            //stereoscopy4js.bindEvents();
            show4id("preview4cropstereo");
            hide4id("preview4align");
            stereoscopy4js.startCropingImage();
          } else {
            console.error("Stereoscopy4JS.startCropingImage() object or method was not defined!");
          }
        } else {
          console.error("Stereoscopy4JS object does not exist!");
        }
      }

      function saveImageFile(pFilename,pDataURL) {
        if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
          window.open(pDataURL);
        } else {
          var blob = dataURLToBlob(pDataURL);
          var url = window.URL.createObjectURL(blob);

          var a = document.createElement("a");
          a.style = "display: none";
          a.href = url;
          a.download = pFilename;

          document.body.appendChild(a);
          a.click();

          window.URL.revokeObjectURL(url);
        }
      }; // END saveImage()

      function dataURLToBlob(dataURL) {
        // Code taken from https://github.com/ebidel/filer.js
        var parts = dataURL.split(';base64,');
        var contentType = parts[0].split(":")[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;
        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
      }
