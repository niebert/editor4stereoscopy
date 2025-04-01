
// ---------------------------------------
// --- JSONEditor ------------------------
// ---------------------------------------
// --- Version:   2.0.39
// --- Date/Time: 2024/07/08 12:33:07
// ---------------------------------------
/*! json-editor-fs
 * Based on JSON Editor by Jeremy Dorn - https://github.com/jdorn/json-editor/
 * Released under the MIT license
 *
 * Created: 2016/12/28
 * Build:   2024/07/08 12:33:07
 * Repository of current build: https://github.com/niebert/json-editor-fs
 *
 * This repository is used for educational purpose for the Wikiversity Learning resource
 * https://en.wikiversity.org/wiki/AppLSAC
 */

// Configuration Code:
// the configuration code will be used to create some constants

(function() {

var Class;
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){window.postMessage("xyz");}) ? /\b_super\b/ : /.*/;

  Class = function(){};

  Class.extend = function extend(prop) {
    var _super = this.prototype;

    initializing = true;
    var prototype = new this();
    initializing = false;

    for (var name in prop) {
      
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            this._super = _super[name];

            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    function Class() {
      
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }

    Class.prototype = prototype;

    Class.prototype.constructor = Class;

    Class.extend = extend;

    return Class;
  };

  return Class;
})();

(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] ||
                                      window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

(function() {
	if(!Array.isArray) {
	  Array.isArray = function(arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	  };
	}
}());
function $isElement4DOM(pElement){
  return (
    typeof Node === "object" ? pElement instanceof Node :
    pElement && typeof pElement === "object" && typeof pElement.nodeType === "number" && typeof pElement.nodeName==="string"
  );
}

 function $find_closing_bracket(expression,closebracket,startsearch_at){
     var openbracket = "-";
     var vResult = {
       "start_search": (startsearch_at || 0),
       "openbracket_at": -1,
       "closebracket_at": -1
     };
     switch (closebracket) {
       case "]":
           openbracket = "[";
       break;
       case "}":
           openbracket = "{";
       break;
       case ")":
           openbracket = "(";
       break;
       case ">":
           openbracket = "<";
       break;
       default:
           
           openbracket = "-";
     }
     if (openbracket != "-") {
       var index = startsearch_at;

       while ((index < expression.length) && (expression.charAt(index)!=openbracket)) {
         index++;
       }
       if (index < expression.length) {
         vResult.openbracket_at = index;
         
         var bracket_stack = [];

         while (index < expression.length){

             if (expression.charAt(index) == openbracket) {

               bracket_stack.push(expression.charAt(index));
             } else {

               if (expression.charAt(index) == closebracket) {
                 bracket_stack.pop();
                 if (bracket_stack.length == 0) {
                   
                   vResult.closebracket_at = index;
                   index = expression.length;
                 }
               }
             }
             index++;
         }

       } else {
         console.error("Opening Bracket not found in expression");
       }
     }
     return vResult;
 }

 function $find_parameter_of_function(expression,fct,fctpos) {
   return $find_parameter_of_brackets(expression,fct,fctpos,"(",")");
 }

 function $find_parameter_of_brackets(expression,fct,fctpos,openbracket,closebracket) {
   var vReturn = {
     "start_search": 0,
     "openbracket_at": -1,
     "closebracket_at": -1
   };
   var params4fct = "-"; 
   if (expression) {
     var pos = fctpos || expression.indexOf(fct+openbracket);
     if (pos >= 0) {
       
       params4fct = fct;
       vReturn = $find_closing_bracket(expression,closebracket,pos);
       if (vReturn.openbracket_at >= 0) {
         if (vReturn.closebracket_at >= 0) {
           params4fct = expression.substring(vReturn.openbracket_at+1,vReturn.closebracket_at);
         }
       }
     }
   }
   
   if (params4fct == "-") {
     console.error("CALL: $find_parameter_of_brackets('"+expression+"','"+openbracket+"','"+closebracket+"') - function name '"+fct+"' not found");
   }
   return params4fct;
 }

 function $isArray(pJSON) {
   return (pJSON && Array.isArray(pJSON));
 }

 function $isObject(pJSON) {

   return (typeof pJSON == 'object' && !(Array.isArray(pJSON)))
 }

 function $isSingleValue(pJSON) {
   return (!(typeof pJSON === 'object'));
 }

 function $canvas2json(canvas) {
   var vJSON = $canvas2tilesize(canvas);
   if ((vJSON.widthcount === 1) && (vJSON.heightcount === 1)) {
     vJSON = canvas.toDataURL()
   } else {
     var wc = vJSON.widthcount;
     var hc = vJSON.heightcount;
     var ws = vJSON.tilewidth;
     var hs = vJSON.tileheight;
     vJSON.tiles = $get_canvas_tiles(canvas,wc,ws,hc,hs);
   }
   return vJSON;
 }

 function $copy2canvas4size(canvsrc,canvdest,width,height) {
   var ctxsrc  = canvsrc.getContext("2d");
   var ctxdest = canvdest.getContext("2d");

   ctxdest.drawImage(canvsrc,0,0,canvsrc.width,canvsrc.height,0,0,width,height);
 }

 function $json2canvas(pJSON,canvas,editor,data) {
   var vJSON = pJSON || {};
   if (canvas) {
     if (vJSON.width && vJSON.height && vJSON.tiles) {
       
         if (vJSON.tiles && vJSON.tiles.length > 0) {
           var wc = vJSON.widthcount;
           var hc = vJSON.heightcount;
           var ws = vJSON.tilewidth;
           var hs = vJSON.tileheight;
           var tiles = vJSON.tiles || [];
           var x = 0;
           var y = 0;
           var tile_index = 0;
           if (editor.setBackgroundImage) {
             editor.setBackgroundImage(pJSON);
           } else {
             console.error("ImagePad-Editor has no method 'setBackgroundImage()'");
           }
           $set_tiles2canvas(tiles,tile_index,x,y,canvas,wc,ws,hc,hs,editor,data);
         } else {
           console.error("$json2canvas(pJSON,canvas) - no tiles in pJSON not defined");
         }
     } else {
       if (typeof vJSON === "string") {
         $data_url2canvas(vJSON, canvas)
       } else {
         
         editor.signaturePad.fromDrawingData(data);
         editor.signaturePad.strokeEnd();
       }
     }
   } else {
     console.error("$json2canvas(pJSON,canvas) - parameter not defined.");
   }
 }

 function $get_tile_count(size,tile_size) {
   var tile_count = 0;
   if (size && tile_size) {
     tile_count = Math.floor(size/tile_size);
     if (tile_count*tile_size < size) {
       tile_count++;
     }
   } else {
   }
   return tile_count;
 }

 function $get_tile_size(size,tile_count) {
   var tile_size = size;
   if (size && tile_count) {
     tile_size = Math.floor(size/tile_count);
     if (tile_count*tile_size < size) {
       tile_size++;
     }
   } else {
   }
   return tile_size;
 }

function $get_canvas_tiles(canvas,wc,ws,hc,hs) {
    var tiles = [];
    var tile_image_data;
    var tile_canvas_list = [];
    var canvas_ctx = canvas.getContext('2d');
    
    for(var x = 0; x < wc; ++x) {
      
        for(var y = 0; y < hc; ++y) {
          var tile_canvas = document.createElement('canvas');

          tile_canvas_list.push(tile_canvas);
          var tile_canvas_ctx = tile_canvas.getContext('2d');
          tile_canvas.width = ws;
          tile_canvas.height = hs;
          
          tile_image_data = canvas_ctx.getImageData( x * ws, y * hs, ws, hs);

          tile_canvas_ctx.putImageData(tile_image_data, 0, 0);

          tiles.push(tile_canvas.toDataURL());
        }
    }
    return tiles;
}
function $set_tiles2canvas(tiles,tile_index,x,y,canvas,wc,ws,hc,hs,editor,data) {
  
  var ctx = canvas.getContext('2d');
  var tile_img = new Image();

  var tile_canvas = document.createElement("canvas");
  
  var tile_ctx = tile_canvas.getContext('2d');
  tile_img.onload = function() {

    tile_canvas.width = tile_img.width;
    tile_canvas.height = tile_img.height;
    
    tile_ctx.drawImage(tile_img, 0, 0,ws,hs);
    
    ctx.drawImage(tile_canvas,x * ws, y * hs,ws,hs);
    tile_index++
    y++;
    if (y >= hc) {
      y=0;
      x++;
    }
    if ((x < wc) && (tile_index < tiles.length)) {
      $set_tiles2canvas(tiles,tile_index,x,y,canvas,wc,ws,hc,hs,editor,data);
    } else {
      
      editor.signaturePad.fromDrawingData(data);
      editor.signaturePad.strokeEnd();
   }
  };
  tile_img.src = tiles[tile_index];

}

 function $canvas2tilesize(canvas) {
   var vJSON = {
      "width": 1200,
      "height": 500,
      "tilewidth": 400,
      "tileheight": 250,
      "widthcount": 3,  
      "heightcount":2,   
      "tiles":null
   };
   if (canvas) {
     var width_max  = 450;
     var height_max = 250;
     vJSON.width  = canvas.width  || width_max;
     vJSON.height = canvas.height || height_max;
     var wc = $get_tile_count(vJSON.width,width_max);
     var hc = $get_tile_count(vJSON.height,height_max);
     var ws = $get_tile_size(vJSON.width,wc);
     var hs = $get_tile_size(vJSON.height,hc);
     vJSON.widthcount = wc;
     vJSON.heightcount = hc;
     vJSON.tilewidth = ws;
     vJSON.tileheight = hs;
   } else {
   }
   return vJSON;
 }

 function $data_url2canvas(strDataURI, canvas) {
   
     var img = new window.Image();
     img.addEventListener("load", function () {
         canvas.getContext("2d").drawImage(img, 0, 0);
     });
     img.setAttribute("src", strDataURI);
 }

 function $mimetyp4data_url(strDataURI,pDefaultMimeType) {
   
   var mimetype = pDefaultMimeType || "mimetype-undefined";
   var parts = strDataURI.split(';base64,');
   if (parts && parts.length && parts.length > 0) {
     mimetype = parts[0].split(":")[1];
   }
   return mimetype;
 }

 function $setContent(pNode,pContent,pOptions) {
   var ot = "text";
   if (pOptions && pOptions.outtype) {
     ot = pOptions.outtype;
  }
  if (pNode) {
    switch (ot) {
      case "html":
        $setContentHTML(pNode,pContent,pOptions);
        break;
       case "val":
          $setContentValue(pNode,pContent,pOptions);
          break;
       case "text":
          pNode.textContent = pContent;
          break;
       default:
          pNode.textContent = pContent;
    };
  } else {
  }
 };

 function $dom2json(element) {
     var out = {};
     if (element) {
       var el = element;
       if (el.tagName) {
         out.tagName = el.tagName;
         var i = 0;
         for (i ; i < el.attributes.length; i++) {
             out[el.attributes[i].name] = el.attributes[i].value;
         }
         
         var children = el.childNodes;
         if (children.length) {
           out.children = [];
           i = 0;
           for (i ; i < children.length; i++) {
             child = children[i];
             out.children[i] = $dom2json(child, out.children) ;
           }
         } 
       } 
     } else {
       alert("dom2json(element) element does not exist")
     }

     return out;
 }
 function $getDate4JSON() {
 	var vNow = new Date();
 	var vMonth = vNow.getMonth()+1;
 	return {
    "day":vNow.getDate(),
    "month":vMonth,
    "year":vNow.getFullYear()
  }
 }

 function $getDate() {
  var vNow = new Date();
  var vMonth = vNow.getMonth()+1;
  return vNow.getFullYear() + "-" + vMonth + "-" + vNow.getDate();
}

 function $alert4json(pJSON) {
   if (pJSON) {
     alert(JSON.stringify(pJSON,null,4))
   }
 }

 function $alert4dom(element) {
   if (element) {
     $alert4json($dom2json(element))
   }
 }

 function $addAttributes(elem,atts) {
   if (elem) {
     if (atts) {
       for (var variable in atts) {
         if (atts.hasOwnProperty(variable)) {
           elem.setAttribute(variable,atts.value);
         }
       }
     }
   } else {
     
   }
   return elem;
 };

 function $addStyles(elem,atts) {
   if (elem) {
     if (atts) {
       for (var variable in atts) {
         if (atts.hasOwnProperty(variable)) {
           elem.style[variable] = atts.value;
         }
       }
     }
   } else {
     
   }
   return elem;
 };

 function $setContentHTML(pNode,pContent,pOptions) {
   
   if (pNode) {
     pNode.innerHTML = pContent;
     
   } else {
   }
 };

 function $setContentValue(pNode,pContent,pOptions) {
   if (pNode) {
     if (pNode.value) {
       pNode.value = pContent;   
     } else {
     }
   } else {
   }
 };

 function $getBase64MimeType(base64file) {

   var mimeType = "undefined_mime_type";
   var base64array = base64file.split(";");
   var prefix = base64array[0];
   typearr = prefix.split(";");
   if (typearr.length > 1) {
     mimeType = typearr[1];
   }
   return mimeType;
 };

 function $getValueDOM(pID) {
   var vNode = $el(pID);
   var vReturn = "";
   if (!vNode) {
     console.warn("DOM Node ["+pID+"] does not exist! - getValueDOM()-Call");
   } else {
     switch (vNode.tagName) {
       case "input":
         switch (vNode.getAttribute("type")) {
             case "checkbox":
               vReturn = vNode.checked;
             break;
             default:
               vReturn = vNode.value;
         }; 
       break;
       
       default:
         vReturn = vNode.value;
     };
     if (!vReturn) {
       vReturn = "";
       
     };
   }
   return vReturn;
 };

 function $getInnerHTML(pID) {
   var vNode = $el(pID);
   var vReturn = "";
   if (!vNode) {
     console.log("DOM Node ["+pID+"] does not exist! - getInnerHTML()-Call");
   } else {
     vReturn = vNode.innerHTML;
     if (!vReturn) {
       vReturn = "";
       
     } else {
       
     };
   }
   return vReturn;
 };

 function $write2innerHTML(pID,pContent) {
   var vNode =$el(pID);
   if (vNode){
     if (window.jQuery) {
       
       $( "#"+pID ).html(pContent);
     } else {
       
       vNode.innerHTML=pContent;
     }
   } else {
     console.log("Write DOM-Node 'innerHTML' with ID=["+pID+"] was undefined")
   }
 }

 function $write2value(pID,pContent) {
   var vNode =$el(pID)
   if (vNode){
     
     node2value(vNode,pContent,pID)
   } else {
     console.log("Write DOM-Node 'value' with ID=["+pID+"] was undefined")
   }
 }

 function $node2value(pNode,pContent,pID) {
   var vID = pID || "";
   if (pNode){
     if (pNode.getAttribute("type") == "checkbox") {
        if (window.jQuery) {
          
          $("#"+pID).prop( "checked", pContent );
        } else {
          
          pNode.checked=pContent;
        }
      } else {
        if (window.jQuery) {
          
          $("#"+pID).val(pContent);
        } else {
          
          pNode.checked=pContent;
        }
     }
   } else {
     console.warn("node2value(pNode,pContent,'"+vID+"') - pNode undefined")
   }
 }

 function $write4name2value(pID,pContent) {
   var vNodeArr =document.getElementsByName(pID);
   if (vNodeArr){
     for (var i=0;i<vNodeArr.length; i++) {
       
       node2value(vNodeArr[i],pContent,"name:'"+pID+"'")
     }
   } else {
     console.warn("Write DOM-Node 'value' with Name=["+pID+"] was undefined")
   }
 }

 function $append2innerHTML(pID,pContent) {
   var vNode =$el(pID);
   if (vNode){
     if (window.jQuery) {
       
       $( "#"+pID ).append( pContent );
    } else {
       
       vNode.innerHTML += pContent;
     }
   } else {
     console.warn("Append DOM-Node 'innerHTML' with ID=["+pID+"] was undefined")
   }
 }

 function $append2value(pID,pContent) {
   var vNode =$el(pID);
   if (vNode){
     vNode.value+=pContent;
   } else {
     console.log("DOM-Node 'value' with ID=["+pID+"] was undefined")
   }
 }

 function $setAttribute2Value(pWriteID,pAttribute,pValue) {
   var vNode = $el(pWriteID);
   if (vNode) {
     console.log("setAttribute2Value(): DOM-Element "+pWriteID+" exists - set Attribute '"+pAttribute+"' to value '"+pValue+"'");
     vNode.setAttribute(pAttribute,pValue);
   };
 };

 function $setFormVariable2LocalVar(pWriteID,pReadID,pFormID) {
   var vFormID = pFormID || "formvariable";
 	
 	document[vFormID].elements[pWriteID].value = loadLocalVar(pReadID);
 	console.log(pWriteID+"="+loadLocalVar(pReadID)+" - setFormVariable2LocalVar()");
 };

 function $setFormVariable2Value(pWriteID,pValue,pFormID) {
   var vFormID = pFormID || "formvariable";
   
 	document[vFormID].elements[pWriteID].value = pValue;
 	console.log(pWriteID+"="+loadLocalVar(pReadID)+" - setFormVariable2Value()");
 };

var $el = function (pID) {
    var vNode = document.getElementById(pID);
    if (vNode) {
      return vNode;
    } else {
      console.error("DOM Node ["+pID+"] is not defined");
      return null;
    }
}

var $value2value4dom = function (pWriteID,pReadID) {
   var vReadNode =  $el(pReadID);
   if (vReadNode) {
     var vWriteNode =  $el(pWriteID);
     if (vWriteNode) {
       vWriteNode.value = vReadNode.value;
     }
   }
 }

var $isplainobject = function( obj ) {

  if (typeof obj !== "object" || obj.nodeType || (obj !== null && obj === obj.window)) {
    return false;
  }

  if (obj.constructor && !Object.prototype.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
    return false;
  }

  return true;
};

function $display_options(options) {
  var vOut = "Options={";
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      vOut += "\n"+key+"='"+options[key]+"'";
    }
  }
  vOut +="\n}";
  alert(vOut);
}

function $get_boolean_attributes(options) {
  var vHash = {};
  for (var key in options) {
    if (options.hasOwnProperty(key)) {
      if (typeof variable === "boolean"){
        
        vHash[key] =  options[key]
      } else {
        if (typeof variable === "string"){
          
          vHash[key] =  options[key]
        }
      }
    }
  }
  return vHash;
}

var $check_options = function (options,id4option,default_value) {

    var vRet = null; 
    
    if (options) {
      for (var variable in options) {
        
        if (variable == id4option) {
          
          vRet = options[id4option];
        }
      }
      
      if (!vRet) {

        vRet = default_value;
      }
    } else {
    }
    
    return vRet;
};

var $cloneJSON = function (pJSON) {
  var vJSON = {};
  if (pJSON) {
    vJSON = JSON.parse(JSON.stringify(pJSON));
  } else {
  };
  return vJSON
};
var $extend4options = function(destination) {

  destination = destination || {};
  var source;
  
  for (var i=1; i<arguments.length; i++) {

    source = arguments[i];
    for (var property in source) {
      
      if (source.hasOwnProperty(property)) {

        if (destination.hasOwnProperty(property)) {

          if ($isObject(destination[property])) {

            if ($isObject(source[property])) {

              $extend4options(destination[property], source[property]);
            }
          }
        } else {

          destination[property] = $cloneJSON(source[property]);
        }
      }
    }
  }
  return destination;
};

var $extend = function(destination) {

  destination = destination || {};
  var source, i,property;
  
  for(i=1; i<arguments.length; i++) {

    source = arguments[i];
    for (property in source) {
      
      if(!source.hasOwnProperty(property)) continue;
      
      if(source[property] && $isplainobject(source[property])) {
        
        if(!destination.hasOwnProperty(property))  {

          destination[property] = {};
        };

        $extend(destination[property], source[property]);
      } else {
        
        destination[property] = source[property];
      }
    }
  }
  return destination;
};

var $expand_object = function(source,destination) {
  destination = destination || {};
  for (var variable in source) {
    if (source.hasOwnProperty(variable)) {

      destination[variable] = $cloneJSON(source[variable]);
    }
  }
  return destination;
};

var $union_array = function (x, y) {
  var obj = {};
  for (var i = x.length-1; i >= 0; -- i) {
    obj[x[i]] = x[i];
  }
  for (var i = y.length-1; i >= 0; -- i) {
    obj[y[i]] = y[i];
  };
  var res = [];
  for (var k in obj) {
      if (obj.hasOwnProperty(k))  {
        res.push(obj[k]);
      }
  }
  return res;
};

var $each = function(obj,callback) {

  if(!obj || typeof obj !== "object") return;
  var i;
  if(Array.isArray(obj) || (typeof obj.length === 'number' && obj.length > 0 && (obj.length - 1) in obj)) {
    
    for(i=0; i<obj.length; i++) {
      if(callback(i,obj[i])===false) return;
    }
  } else {
    
    if (Object.keys) {
      
      var keys = Object.keys(obj);
      for(i=0; i<keys.length; i++) {
        if(callback(keys[i],obj[keys[i]])===false) return;
      }
    } else {
      for(i in obj) {
        if(!obj.hasOwnProperty(i)) continue;
        if(callback(i,obj[i])===false) return;
      }
    }
  }
};

var $trigger = function(el,event) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(event, true, true);
  el.dispatchEvent(e);
};
var $triggerc = function(el,event) {
  var e = new CustomEvent(event,{
    bubbles: true,
    cancelable: true
  });

  el.dispatchEvent(e);
};
var JSONEditor = function(editor_holder,options) {
  if (!(editor_holder instanceof Element)) {
    throw new Error('Parameter "editor_holder" should be an instance of Element');
  }
  options = $extend({},JSONEditor.defaults.options,options||{});
  this.editor_holder = editor_holder;
  this.options = options;
  this.init();
};

JSONEditor.prototype = {

  constructor: JSONEditor,
  init: function() {
    var self = this;

    this.ready = false;

    var theme_class = JSONEditor.defaults.themes[this.options.theme || JSONEditor.defaults.theme];
    if(!theme_class) throw "Unknown theme " + (this.options.theme || JSONEditor.defaults.theme);

    this.schema = this.options.schema;
    this.refschema = this.options.refschema || [];
    this.theme = new theme_class();
    this.template = this.options.template;
    this.refs = this.options.refs || {};
    this.uuid = 0;
    this.__data = {};

    var icon_class = JSONEditor.defaults.iconlibs[this.options.iconlib || JSONEditor.defaults.iconlib];
    if(icon_class) this.iconlib = new icon_class();

    this.root_container = this.theme.getContainer();
    this.editor_holder.appendChild(this.root_container);

    this.root_container_preview = null;
    if (this.options && this.options.container_preview) {
      this.root_container_preview = this.options.container_preview;
      
      this.editor_holder.appendChild(this.root_container_preview);
    }

    this.translate = this.options.translate || JSONEditor.defaults.translate;

    this._loadExternalRefs(this.schema, function() {
      self._getDefinitions(self.schema);

      var validator_options = {};
      if(self.options.custom_validators) {
        validator_options.custom_validators = self.options.custom_validators;
      }
      self.validator = new JSONEditor.Validator(self,null,validator_options);

      var editor_class = self.getEditorClass(self.schema);
      var opt_editor = {
        jsoneditor: self,
        schema: self.schema,
        required: true,
        container: self.root_container,
      };
      if (self.root_container) {
        opt_editor.container_preview = self.root_container_preview
      };
      self.root = self.createEditor(editor_class,opt_editor);

      self.root.preBuild();
      self.root.build();
      self.root.postBuild();
      self.editor_holder = this.root_container;

      if(self.options.startval) self.root.setValue(self.options.startval);

      self.validation_results = self.validator.validate(self.root.getValue());
      self.root.showValidationErrors(self.validation_results);
      self.ready = true;

      window.requestAnimationFrame(function() {
        if(!self.ready) return;
        self.validation_results = self.validator.validate(self.root.getValue());
        self.root.showValidationErrors(self.validation_results);
        self.trigger('ready');
        self.trigger('change');
      });
    });
  },
  loadJSON: function () {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling 'loadJSON()'";
    this.root.loadJSON();
  },
  saveJSON: function (pFilename) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling 'saveJSON()'";
    this.root.saveJSON(pFilename);
  },
  getValue: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before getting the value";

    return this.root.getValue();
  },
  getValue4Checkbox: function(options4checked) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before getting the value for checkbox";

    return this.root.getValue4Checkbox(options4checked);
  },
  getValue4CheckboxValue: function(options4checked) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before getting the value for checkbox";

    return this.root.getValue4CheckboxValue(options4checked);
  },
  setValue4Checkbox: function(value,checked) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before setting the value";

    return this.root.setValue4Checkbox(value,checked);
  },
  getValue4Template: function(pTplID) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before getting the value";

    return this.root.getValue4Template(pTplID);
  },
  setValue: function(value) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before setting the value";

    this.root.setValue(value);
    return this;
  },
  getTitle: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before getting the value";

    return this.root.getTitle();
  },
  setTitle: function(title) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before setting the value";

    this.root.setTitle(title);
  },
  getSelectedValue: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before getting the value";
    
    return this.root.getSelectedValue();
  },
  setSelectedValue: function(value) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before setting the value";
    
    this.root.setSelectedValue(value);
    return this;
  },
  show: function(pDisplayID) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling show";
    if (pDisplayID) {
      switch (expression) {
        case 'preview':

          break;
        case 'editor':
          break;
        case 'description':

          break;
        case 'preview':

          break;
        default:

      }
    } else {
      this.root.show();
    }
  },
  show_preview: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling show";
    
    this.root.show_preview();
  },
  show_editor: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before showing editor node";
    
    this.root.show_editor();
  },
  hide: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling hide";
    this.root.hide();
  },
  hide_preview: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling hide";
    
    this.root.hide_preview();
  },
  hide_editor: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before hiding editor node";
    this.root.hide_editor();
  },
  toggle: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling toggle";
    this.root.toggle();
  },
  toggle_preview: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling toggle preview";
    
    this.root.toggle_preview();
  },
  toggle_editor: function() {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before toggle editor node";
    this.root.toogle_editor();
  },
  validate: function(value) {
    if(!this.ready) throw "JSON Editor not ready yet.  Listen for 'ready' event before calling validating";

    if(arguments.length === 1) {
      return this.validator.validate(value);
    } else {
      
        return this.validation_results;
    }
  },
  destroy: function() {
    if(this.destroyed) return;
    if(!this.ready) return;

    this.schema = null;
    this.options = null;
    this.root.destroy();
    this.root = null;
    this.root_container = null;
    this.validator = null;
    this.validation_results = null;
    this.theme = null;
    this.iconlib = null;
    this.template = null;
    this.__data = null;
    this.ready = false;
    this.editor_holder.innerHTML = '';

    this.destroyed = true;
  },
  on: function(event, callback) {
    this.callbacks = this.callbacks || {};
    this.callbacks[event] = this.callbacks[event] || [];
    this.callbacks[event].push(callback);

    return this;
  },
  off: function(event, callback) {
    
    if(event && callback) {
      this.callbacks = this.callbacks || {};
      this.callbacks[event] = this.callbacks[event] || [];
      var newcallbacks = [];
      for(var i=0; i<this.callbacks[event].length; i++) {
        if(this.callbacks[event][i]===callback) continue;
        newcallbacks.push(this.callbacks[event][i]);
      }
      this.callbacks[event] = newcallbacks;
    }
    
    else if(event) {
      this.callbacks = this.callbacks || {};
      this.callbacks[event] = [];
    }
    
    else {
      this.callbacks = {};
    }

    return this;
  },
  trigger: function(event) {
    if(this.callbacks && this.callbacks[event] && this.callbacks[event].length) {
      for(var i=0; i<this.callbacks[event].length; i++) {
        this.callbacks[event][i]();
      }
    }

    return this;
  },
  setOption: function(option, value) {
    if(option === "show_errors") {
      this.options.show_errors = value;
      this.onChange();
    }
    
    else {
      throw "Option '"+option+"' must be set during instantiation and cannot be changed later";
    }

    return this;
  },
  getEditorClass: function(schema) {
    var classname;

    schema = this.expandSchema(schema);

    $each(JSONEditor.defaults.resolvers,function(i,resolver) {
      var tmp = resolver(schema);
      if(tmp) {
        if(JSONEditor.defaults.editors[tmp]) {
          classname = tmp;
          return false;
        }
      }
    });

    if(!classname) throw "Unknown editor for schema "+JSON.stringify(schema);
    if(!JSONEditor.defaults.editors[classname]) throw "Unknown editor "+classname;

    return JSONEditor.defaults.editors[classname];
  },
  createEditor: function(editor_class, options) {
    options = $extend({},editor_class.options||{},options);
    return new editor_class(options);
  },
  onChange: function() {
    if(!this.ready) return;

    if(this.firing_change) return;
    this.firing_change = true;

    var self = this;

    window.requestAnimationFrame(function() {
      self.firing_change = false;
      if(!self.ready) return;

      self.validation_results = self.validator.validate(self.root.getValue());

      if(self.options.show_errors !== "never") {
        self.root.showValidationErrors(self.validation_results);
      }
      else {
        self.root.showValidationErrors([]);
      }

      self.trigger('change');
    });

    return this;
  },
  tplfunclist: {},
  compileTemplate: function(template, name, tplid) {
    name = name || JSONEditor.defaults.template;

    var engine;

    if(typeof name === 'string') {
      if(!JSONEditor.defaults.templates[name]) throw "Unknown template engine "+name;
      engine = JSONEditor.defaults.templates[name]();

      if(!engine) throw "Template engine "+name+" missing required library.";
    }
    
    else {
      engine = name;
    }

    if(!engine) throw "No template engine set";
    if(!engine.compile) throw "Invalid template engine set - no compile method found";

    return engine.compile(template,tplid,this.tplfunclist);
  },
  _data: function(el,key,value) {
    
    if(arguments.length === 3) {
      var uuid;
      if(el.hasAttribute('data-jsoneditor-'+key)) {
        uuid = el.getAttribute('data-jsoneditor-'+key);
      }
      else {
        uuid = this.uuid++;
        el.setAttribute('data-jsoneditor-'+key,uuid);
      }

      this.__data[uuid] = value;
    }
    
    else {
      
      if(!el.hasAttribute('data-jsoneditor-'+key)) return null;

      return this.__data[el.getAttribute('data-jsoneditor-'+key)];
    }
  },
  registerEditor: function(editor) {
    this.editors = this.editors || {};
    this.editors[editor.path] = editor;
    return this;
  },
  unregisterTemplates: function(editor) {
    if (editor) {
      var path = editor.path;
      var vTplID = ["header4array","header","question","content","description"];
      
      if (this.root) {

        for (var i = 0; i < vTplID.length; i++) {
          var tpl_list = this.root["root_"+vTplID[i]+"_templates"];
          if (tpl_list) {
            for (var k =  tpl_list.length - 1; k>=0; k--) {
              if (tpl_list[k].path == path) {

                tpl_list.splice(k, 1);
              }
            }
          }
        }
      }
    }
  },
  unregisterEditor: function(editor) {
    this.unregisterTemplates(editor);
    this.editors = this.editors || {};
    this.editors[editor.path] = null;
    return this;
  },
  getEditor: function(path) {
    if(!this.editors) return;
    return this.editors[path];
  },
  watch: function(path,callback) {
    this.watchlist = this.watchlist || {};
    this.watchlist[path] = this.watchlist[path] || [];
    this.watchlist[path].push(callback);

    return this;
  },
  unwatch: function(path,callback) {
    if(!this.watchlist || !this.watchlist[path]) return this;
    
    if(!callback) {
      this.watchlist[path] = null;
      return this;
    }

    var newlist = [];
    for(var i=0; i<this.watchlist[path].length; i++) {
      if(this.watchlist[path][i] === callback) continue;
      else newlist.push(this.watchlist[path][i]);
    }
    this.watchlist[path] = newlist.length? newlist : null;
    return this;
  },
  notifyWatchers: function(path) {
    if(!this.watchlist || !this.watchlist[path]) return this;
    for(var i=0; i<this.watchlist[path].length; i++) {
      this.watchlist[path][i]();
    }
  },
  isEnabled: function() {
    return !this.root || this.root.isEnabled();
  },
  enable: function() {
    this.root.enable();
  },
  disable: function() {
    this.root.disable();
  },
  _getDefinitions: function(schema,path) {
    path = path || '#/definitions/';
    if(schema.definitions) {
      for(var i in schema.definitions) {
        if(!schema.definitions.hasOwnProperty(i)) continue;
        this.refs[path+i] = schema.definitions[i];
        if(schema.definitions[i].definitions) {
          this._getDefinitions(schema.definitions[i],path+i+'/definitions/');
        }
      }
    }
  },
  _getExternalRefs: function(schema) {
    var refs = {};
    var merge_refs = function(newrefs) {
      for(var i in newrefs) {
        if(newrefs.hasOwnProperty(i)) {
          refs[i] = true;
        }
      }
    };

    if(schema.$ref && typeof schema.$ref !== "object" && schema.$ref.substr(0,1) !== "#" && !this.refs[schema.$ref]) {
      refs[schema.$ref] = true;
    }

    for(var i in schema) {
      if(!schema.hasOwnProperty(i)) continue;
      if(schema[i] && typeof schema[i] === "object" && Array.isArray(schema[i])) {
        for(var j=0; j<schema[i].length; j++) {
          if(typeof schema[i][j]==="object") {
            merge_refs(this._getExternalRefs(schema[i][j]));
          }
        }
      }
      else if(schema[i] && typeof schema[i] === "object") {
        merge_refs(this._getExternalRefs(schema[i]));
      }
    }

    return refs;
  },
  _loadExternalRefs: function(schema, callback) {
    var self = this;
    var refs = this._getExternalRefs(schema);

    var done = 0, waiting = 0, callback_fired = false;

    $each(refs,function(url) {
      if(self.refs[url]) return;
      if(!self.options.ajax) throw "Must set ajax option to true to load external ref "+url;
      self.refs[url] = 'loading';
      waiting++;

      var r = new XMLHttpRequest();
      r.open("GET", url, true);
      r.onreadystatechange = function () {
        if (r.readyState != 4) return;
        
        if(r.status === 200) {
          var response;
          try {
            response = JSON.parse(r.responseText);
          }
          catch(e) {
            window.console.log(e);
            throw "Failed to parse external ref "+url;
          }
          if(!response || typeof response !== "object") throw "External ref does not contain a valid schema - "+url;

          self.refs[url] = response;
          self._loadExternalRefs(response,function() {
            done++;
            if(done >= waiting && !callback_fired) {
              callback_fired = true;
              callback();
            }
          });
        }
        
        else {
          window.console.log(r);
          throw "Failed to fetch ref via ajax- "+url;
        }
      };
      r.send();
    });

    if(!waiting) {
      callback();
    }
  },
  expandRefs: function(schema) {
    schema = $extend({},schema);

    while (schema.$ref) {
      var ref = schema.$ref;
      var saved_title;
      if (schema.title) {
        saved_title = schema.title;
      }
      delete schema.$ref;

      if(!this.refs[ref]) ref = decodeURIComponent(ref);

      schema = this.extendSchemas(schema,this.refs[ref]);
      if (saved_title) {
        schema.title = saved_title;
      }
    }
    return schema;
  },
  expandSchema: function(schema) {
    var self = this;
    var extended = $extend({},schema);
    var i;

    if(typeof schema.type === 'object') {
      
      if(Array.isArray(schema.type)) {
        $each(schema.type, function(key,value) {
          
          if(typeof value === 'object') {
            schema.type[key] = self.expandSchema(value);
          }
        });
      }
      
      else {
        schema.type = self.expandSchema(schema.type);
      }
    }
    
    if(typeof schema.disallow === 'object') {
      
      if(Array.isArray(schema.disallow)) {
        $each(schema.disallow, function(key,value) {
          
          if(typeof value === 'object') {
            schema.disallow[key] = self.expandSchema(value);
          }
        });
      }
      
      else {
        schema.disallow = self.expandSchema(schema.disallow);
      }
    }
    
    if(schema.anyOf) {
      $each(schema.anyOf, function(key,value) {
        schema.anyOf[key] = self.expandSchema(value);
      });
    }
    
    if(schema.dependencies) {
      $each(schema.dependencies,function(key,value) {
        if(typeof value === "object" && !(Array.isArray(value))) {
          schema.dependencies[key] = self.expandSchema(value);
        }
      });
    }
    
    if(schema.not) {
      schema.not = this.expandSchema(schema.not);
    }

    if(schema.allOf) {
      for(i=0; i<schema.allOf.length; i++) {
        extended = this.extendSchemas(extended,this.expandSchema(schema.allOf[i]));
      }
      delete extended.allOf;
    }
    
    if(schema["extends"]) {
      
      if(!(Array.isArray(schema["extends"]))) {
        extended = this.extendSchemas(extended,this.expandSchema(schema["extends"]));
      }
      
      else {
        for(i=0; i<schema["extends"].length; i++) {
          extended = this.extendSchemas(extended,this.expandSchema(schema["extends"][i]));
        }
      }
      delete extended["extends"];
    }
    
    if(schema.oneOf) {
      var tmp = $extend({},extended);
      delete tmp.oneOf;
      for(i=0; i<schema.oneOf.length; i++) {
        extended.oneOf[i] = this.extendSchemas(this.expandSchema(schema.oneOf[i]),tmp);
      }
    }

    return this.expandRefs(extended);
  },
  extendSchemas: function(obj1, obj2) {
    obj1 = $extend({},obj1);
    obj2 = $extend({},obj2);

    var self = this;
    var extended = {};
    $each(obj1, function(prop,val) {
      
      if(typeof obj2[prop] !== "undefined") {
        
        if((prop === 'required'||prop === 'defaultProperties') && typeof val === "object" && Array.isArray(val)) {
          
          extended[prop] = val.concat(obj2[prop]).reduce(function(p, c) {
            if (p.indexOf(c) < 0) p.push(c);
            return p;
          }, []);
        }
        
        else if(prop === 'type' && (typeof val === "string" || Array.isArray(val))) {
          
          if(typeof val === "string") val = [val];
          if(typeof obj2.type === "string") obj2.type = [obj2.type];

          if(!obj2.type || !obj2.type.length) {
            extended.type = val;
          }
          
          else {
            extended.type = val.filter(function(n) {
              return obj2.type.indexOf(n) !== -1;
            });
          }

          if(extended.type.length === 1 && typeof extended.type[0] === "string") {
            extended.type = extended.type[0];
          }
          
          else if(extended.type.length === 0) {
            delete extended.type;
          }
        }
        
        else if(typeof val === "object" && Array.isArray(val)){
          extended[prop] = val.filter(function(n) {
            return obj2[prop].indexOf(n) !== -1;
          });
        }
        
        else if(typeof val === "object" && val !== null) {
          extended[prop] = self.extendSchemas(val,obj2[prop]);
        }
        
        else {
          extended[prop] = val;
        }
      }
      
      else {
        extended[prop] = val;
      }
    });
    
    $each(obj2, function(prop,val) {
      if(typeof obj1[prop] === "undefined") {
        extended[prop] = val;
      }
    });

    return extended;
  }
};

JSONEditor.defaults = {
  themes: {},
  templates: {},
  iconlibs: {},
  editors: {},
  languages: {},
  resolvers: [],
  custom_validators: []
};
JSONEditor.processor = {};
JSONEditor.Thread4JS = function () {

  var self = this;
  
  this.procid = "tid";
  this.processor = null;
  this.call4do   = null; 
  this.call4done = null;  
  this.arr4input   = null;
  this.arr4output  = null;
  this.timer_delay = 0;
  this.el4value = null;
  this.el4html = null;
  this.i_start = 0;
  this.time_start = 0;
  this.time_stop = 0;
  this.step_start = 0;
  this.step_stop = 0;
  this.i_loops = 0;
  this.i_step = 1;
  this.i_stop = 1000;
  this.run_flag = false;
  this.info_flag = true;

  this.init = function (pProcessor,pDoCall,pDoneCall,pArr4Data,options) {
    
    this.processor = pProcessor;
    this.init_options(options);
    this.init_call(pDoCall,pDoneCall,pArr4Data);
    this.init_info();
  };
  this.init_options = function (options) {
    if (options) {
      var arr4key = ["el4html","el4value","timer_delay","procid","i_step"];
      for (var i = 0; i < arr4key.length; i++) {
        if (options[arr4key[i]]) {
          this[arr4key[i]] = options[arr4key[i]];
        }
      }
    }
  };
  this.initCall = function (pDoCall,pDoneCall,pArr4Data) {
    this.call4do = pDoCall;
    this.call4done = pDoneCall;
    this.arr4input = pArr4Data;
    this.reset();
  }
  
    this.start = function () {
      this.time_start = Date.now();
      
      if (this.i_loops >= this.i_stop) {
        this.i_loops = this.i_start;
      } else {

      }
      this.run_flag = true;
      
      this.i_stop = this.arr4input.length;
      
      this.loop();
    };

    this.reset = function (pPrefix) {
      pPrefix = pPrefix || "";
      this.arr4output = [];
      this.i_loops = this.i_start;
      this.run_flag = false;
      this.info("Reset Thread4JS "+pPrefix);
    };

    this.stop = function(pPrefix) {
      this.info("Thread4JS stopped "+pPrefix);

      this.run_flag = false;
      this.on_stop();
    };

    this.on_stop = function () {
      this.time_stop = Date.now();
      
      if (this.i_loops >= this.i_stop) {
        this.info("Thread4JS finalized");
        this.done();
      } else {
        this.info("Timer started at " + this.time_start + "\nTimer stopped at " + this.time_stop);
      }
    };

    this.run_condition = function () {
      var vReturn = ((this.i_loops < this.i_stop) && (this.run_flag == true));
      
      return vReturn;
    };

    this.loop = function (pPrefix) {
      if (this.i_loops < 0) {
        this.i_loops = 0;
      }
      this.step_start = Date.now();
      this.info("Start Step " (this.i_loops+1));
      this.do();
      this.step_stop = Date.now();
      this.info("Stop Step " (this.i_loops+1));

      if (this.run_condition() == true) {
        setTimeout(function () { self.loop(pPrefix); }, this.timer_delay);
      } else {
        this.on_stop();
      }
    };

    this.do = function() {
      this.info("do("+this.i_loops+")");
      if ((this.i_loops >= 0) && (this.i_loops < this.arr4input.length)) {
        
        var out = this.processor[this.call4do](this.arr4input[this.i_loops]);
        this.arr4output.push(out);
      }
      this.i_loops += this.i_step;
    };
    
    this.done = function() {
      
      this.info("done("+this.i_loops+") i_stop="+this.i_stop);
      this.processor[this.call4done](this.arr4output);
    };
    
    this.get_info = function (pMessage,pCall) {
      pCall = pCall || this.call4do;
      return pMessage+"Thread4JS.processor."+pCall+"("+(this.i_loops+1),") at time "+ Date.now();
    };
    this.info2console = function (pMessage) {
      console.log(this.get_info(pMessage));
    };
    this.info2html = function (pMessage) {
      if (this.el4html) {
        this.el4html.innerHTML = this.get_info(pMessage);
      };
    };
    this.info2value = function (pMessage) {
      if (this.info2value) {
        this.el4html.value = this.get_info(pMessage);
      }
    };
    this.info2silent = function (pMessage) {
      
    };
    this.info = this.info2console;
    this.init_info = function () {
      if (this.info_flag == true) {
        if (this.el4value) {
          this.info = this.info2value;
        } else if (this.el4html) {
          this.info = this.info2html;
        }
      } else {
        this.info = this.info2silent;
      }
    }

    return this;

};
JSONEditor.Validator = Class.extend({
  init: function(jsoneditor,schema,options) {
    this.jsoneditor = jsoneditor;
    this.schema = schema || this.jsoneditor.schema;
    this.options = options || {};
    this.translate = this.jsoneditor.translate || JSONEditor.defaults.translate;
  },
  validate: function(value) {
    var vRet = this._validateSchema(this.schema, value);
    return vRet;
  },
  _validateSchema: function(schema,value,path) {
    var self = this;
    var errors = [];
    var valid, i, j;
    var stringified = JSON.stringify(value);

    path = path || 'root';

    var key = path.split(".").pop();

    schema = $extend({},this.jsoneditor.expandRefs(schema));

     if (schema.type == "largearray") {
       var validate_value = {};
       if (value.data) {
         if (value.current && (value.current >=0)) {
           validate_value = value.data[value.current];
         } else {
           if(value.data.length > 0) {
             validate_value = value.data[0];
           }
         }
       }
       value = validate_value;
    }

    if (schema.type && schema.required && schema.required === true) {
      if(typeof value === "undefined") {
        errors.push({
          path: path,
          property: 'required',
          message: this.translate("error_notset",[" - Path: '"+path+"'"])
        });

        return errors;
      }
    }
    
    else if(schema.type && (typeof value === "undefined")) {
      
      if(this.jsoneditor.options.required_by_default) {
        errors.push({
          path: path,
          property: 'required',
          message: this.translate("error_notset",[" - Path: '"+path+"'"])
        });
      }
      
      else {
        return errors;
      }
    }

    if(schema["enum"]) {
      valid = false;
      for(i=0; i<schema["enum"].length; i++) {
        if(stringified === JSON.stringify(schema["enum"][i])) valid = true;
      }
      if(!valid) {
        errors.push({
          path: path,
          property: 'enum',
          message: this.translate("error_enum")
        });
      }
    }

    if(schema["extends"]) {
      for(i=0; i<schema["extends"].length; i++) {
        errors = errors.concat(this._validateSchema(schema["extends"][i],value,path));
      }
    }

    if(schema.allOf) {
      for(i=0; i<schema.allOf.length; i++) {
        errors = errors.concat(this._validateSchema(schema.allOf[i],value,path));
      }
    }

    if(schema.anyOf) {
      valid = false;
      for(i=0; i<schema.anyOf.length; i++) {
        if(!this._validateSchema(schema.anyOf[i],value,path).length) {
          valid = true;
          break;
        }
      }
      if(!valid) {
        errors.push({
          path: path,
          property: 'anyOf',
          message: this.translate('error_anyOf')
        });
      }
    }

    if(schema.oneOf) {
      valid = 0;
      var oneof_errors = [];
      for(i=0; i<schema.oneOf.length; i++) {
        
        var tmp = this._validateSchema(schema.oneOf[i],value,path);
        if(!tmp.length) {
          valid++;
        }

        for(j=0; j<tmp.length; j++) {
          tmp[j].path = path+'.oneOf['+i+']'+tmp[j].path.substr(path.length);
        }
        oneof_errors = oneof_errors.concat(tmp);

      }
      if(valid !== 1) {
        errors.push({
          path: path,
          property: 'oneOf',
          message: this.translate('error_oneOf', [valid])
        });
        errors = errors.concat(oneof_errors);
      }
    }

    if(schema.not) {
      if(!this._validateSchema(schema.not,value,path).length) {
        errors.push({
          path: path,
          property: 'not',
          message: this.translate('error_not')
        });
      }
    }

    if(schema.type) {
      
      if(Array.isArray(schema.type)) {
        valid = false;
        for(i=0;i<schema.type.length;i++) {
          if(this._checkType(schema.type[i], value)) {
            valid = true;
            break;
          }
        }
        if(!valid) {
          errors.push({
            path: path,
            property: 'type',
            message: this.translate('error_type_union')
          });
        }
      }
      
      else {
        if(!this._checkType(schema.type, value)) {
          errors.push({
            path: path,
            property: 'type',
            message: this.translate('error_type', [schema.type])
          });
        }
      }
    }

    if(schema.disallow) {
      
      if(Array.isArray(schema.disallow)) {
        valid = true;
        for(i=0;i<schema.disallow.length;i++) {
          if(this._checkType(schema.disallow[i], value)) {
            valid = false;
            break;
          }
        }
        if(!valid) {
          errors.push({
            path: path,
            property: 'disallow',
            message: this.translate('error_disallow_union')
          });
        }
      }
      
      else {
        if(this._checkType(schema.disallow, value)) {
          errors.push({
            path: path,
            property: 'disallow',
            message: this.translate('error_disallow', [schema.disallow])
          });
        }
      }
    }

    if(typeof value === "number") {
      
      if(schema.multipleOf || schema.divisibleBy) {
        var divisor = schema.multipleOf || schema.divisibleBy;
        
        valid = (value/divisor === Math.floor(value/divisor));

        if(window.math) {
          valid = window.math.mod(window.math.bignumber(value), window.math.bignumber(divisor)).equals(0);
        }
        
        else if(window.Decimal) {
          valid = (new window.Decimal(value)).mod(new window.Decimal(divisor)).equals(0);
        }

        if(!valid) {
          errors.push({
            path: path,
            property: schema.multipleOf? 'multipleOf' : 'divisibleBy',
            message: this.translate('error_multipleOf', [divisor])
          });
        }
      }

      if(schema.hasOwnProperty('maximum')) {
        
        valid = schema.exclusiveMaximum? (value < schema.maximum) : (value <= schema.maximum);

        if(window.math) {
          valid = window.math[schema.exclusiveMaximum?'smaller':'smallerEq'](
            window.math.bignumber(value),
            window.math.bignumber(schema.maximum)
          );
        }
        
        else if(window.Decimal) {
          valid = (new window.Decimal(value))[schema.exclusiveMaximum?'lt':'lte'](new window.Decimal(schema.maximum));
        }

        if(!valid) {
          errors.push({
            path: path,
            property: 'maximum',
            message: this.translate(
              (schema.exclusiveMaximum?'error_maximum_excl':'error_maximum_incl'),
              [schema.maximum]
            )
          });
        }
      }

      if(schema.hasOwnProperty('minimum')) {
        
        valid = schema.exclusiveMinimum? (value > schema.minimum) : (value >= schema.minimum);

        if(window.math) {
          valid = window.math[schema.exclusiveMinimum?'larger':'largerEq'](
            window.math.bignumber(value),
            window.math.bignumber(schema.minimum)
          );
        }
        
        else if(window.Decimal) {
          valid = (new window.Decimal(value))[schema.exclusiveMinimum?'gt':'gte'](new window.Decimal(schema.minimum));
        }

        if(!valid) {
          errors.push({
            path: path,
            property: 'minimum',
            message: this.translate(
              (schema.exclusiveMinimum?'error_minimum_excl':'error_minimum_incl'),
              [schema.minimum]
            )
          });
        }
      }
    }
    
    else if(typeof value === "string") {
      
      if(schema.maxLength) {
        if((value+"").length > schema.maxLength) {
          errors.push({
            path: path,
            property: 'maxLength',
            message: this.translate('error_maxLength', [schema.maxLength])
          });
        }
      }

      if(schema.minLength) {
        if((value+"").length < schema.minLength) {
          errors.push({
            path: path,
            property: 'minLength',
            message: this.translate((schema.minLength===1?'error_notempty':'error_minLength'), [schema.minLength])
          });
        }
      }

      if(schema.pattern) {
        if(!(new RegExp(schema.pattern)).test(value)) {
          errors.push({
            path: path,
            property: 'pattern',
            message: this.translate('error_pattern', [schema.pattern])
          });
        }
      }
    }
    
    else if(typeof value === "object" && value !== null && Array.isArray(value)) {
      
      if(schema.items) {
        
        if(Array.isArray(schema.items)) {
          for(i=0; i<value.length; i++) {

            if(schema.items[i]) {
              errors = errors.concat(this._validateSchema(schema.items[i],value[i],path+'.'+i));
            }
            
            else if(schema.additionalItems === true) {
              break;
            }

            else if(schema.additionalItems) {
              errors = errors.concat(this._validateSchema(schema.additionalItems,value[i],path+'.'+i));
            }
            
            else if(schema.additionalItems === false) {
              errors.push({
                path: path,
                property: 'additionalItems',
                message: this.translate('error_additionalItems')
              });
              break;
            }
            
            else {
              break;
            }
          }
        }
        
        else {
          
          for(i=0; i<value.length; i++) {
            errors = errors.concat(this._validateSchema(schema.items,value[i],path+'.'+i));
          }
        }
      }

      if(schema.maxItems) {
        if(value.length > schema.maxItems) {
          errors.push({
            path: path,
            property: 'maxItems',
            message: this.translate('error_maxItems', [schema.maxItems])
          });
        }
      }

      if(schema.minItems) {
        if(value.length < schema.minItems) {
          errors.push({
            path: path,
            property: 'minItems',
            message: this.translate('error_minItems', [schema.minItems])
          });
        }
      }

      if(schema.uniqueItems) {
        var seen = {};
        for(i=0; i<value.length; i++) {
          valid = JSON.stringify(value[i]);
          if(seen[valid]) {
            errors.push({
              path: path,
              property: 'uniqueItems',
              message: this.translate('error_uniqueItems')
            });
            break;
          }
          seen[valid] = true;
        }
      }
    }
    
    else if(typeof value === "object" && value !== null) {
      
      if(schema.maxProperties) {
        valid = 0;
        for(i in value) {
          if(!value.hasOwnProperty(i)) continue;
          valid++;
        }
        if(valid > schema.maxProperties) {
          errors.push({
            path: path,
            property: 'maxProperties',
            message: this.translate('error_maxProperties', [schema.maxProperties])
          });
        }
      }

      if(schema.minProperties) {
        valid = 0;
        for(i in value) {
          if(!value.hasOwnProperty(i)) continue;
          valid++;
        }
        if(valid < schema.minProperties) {
          errors.push({
            path: path,
            property: 'minProperties',
            message: this.translate('error_minProperties', [schema.minProperties])
          });
        }
      }

      if(schema.required && Array.isArray(schema.required)) {
        for(i=0; i<schema.required.length; i++) {
          if(typeof value[schema.required[i]] === "undefined") {
            errors.push({
              path: path,
              property: 'required',
              message: this.translate('error_required', [schema.required[i]])
            });
          }
        }
      }

      var validated_properties = {};
      if(schema.properties) {
        for(i in schema.properties) {
          if(!schema.properties.hasOwnProperty(i)) continue;
          validated_properties[i] = true;
          errors = errors.concat(this._validateSchema(schema.properties[i],value[i],path+'.'+i));
        }
      }

      if(schema.patternProperties) {
        for(i in schema.patternProperties) {
          if(!schema.patternProperties.hasOwnProperty(i)) continue;

          var regex = new RegExp(i);

          for(j in value) {
            if(!value.hasOwnProperty(j)) continue;
            if(regex.test(j)) {
              validated_properties[j] = true;
              errors = errors.concat(this._validateSchema(schema.patternProperties[i],value[j],path+'.'+j));
            }
          }
        }
      }

      if(typeof schema.additionalProperties === "undefined" && this.jsoneditor.options.no_additional_properties && !schema.oneOf && !schema.anyOf) {
        schema.additionalProperties = false;
      }
      
      if (typeof schema.additionalProperties !== "undefined") {
        if (schema.type == "signature") {
          var attribs = ["data","penColor","backgroundColor","canvas_width","canvas_height"];
          for (var i = 0; i < attribs.length; i++) {
            if (!value[attribs[i]]) {
              errors.push({
                path: path,
                property: 'property required',
                message: this.translate('error_required', [attribs[i]])
              });
            }
          }
        } else {
          for(i in value) {
            if(!value.hasOwnProperty(i)) continue;
            if(!validated_properties[i]) {
              
              if(!schema.additionalProperties) {
                errors.push({
                  path: path,
                  property: 'additionalProperties',
                  message: this.translate('error_additional_properties', [i])
                });
                break;
              }
              
              else if(schema.additionalProperties === true) {
                break;
              }

              else {
                errors = errors.concat(this._validateSchema(schema.additionalProperties,value[i],path+'.'+i));
              }
            }
          }
        }
      }

      if(schema.dependencies) {
        for(i in schema.dependencies) {
          if(!schema.dependencies.hasOwnProperty(i)) continue;

          if(typeof value[i] === "undefined") continue;

          if(Array.isArray(schema.dependencies[i])) {
            for(j=0; j<schema.dependencies[i].length; j++) {
              if(typeof value[schema.dependencies[i][j]] === "undefined") {
                errors.push({
                  path: path,
                  property: 'dependencies',
                  message: this.translate('error_dependency', [schema.dependencies[i][j]])
                });
              }
            }
          }
          
          else {
            errors = errors.concat(this._validateSchema(schema.dependencies[i],value,path));
          }
        }
      }
    }

    $each(JSONEditor.defaults.custom_validators,function(i,validator) {
      errors = errors.concat(validator.call(self,schema,value,path));
    });
    
    if(this.options.custom_validators) {
      $each(this.options.custom_validators,function(i,validator) {
        errors = errors.concat(validator.call(self,schema,value,path));
      });
    }

    return errors;
  },
  _checkType: function(type, value) {
    
    if(typeof type === "string") {
      if(type==="string") return typeof value === "string";
      else if(type==="number") return typeof value === "number";
      else if(type==="integer") return typeof value === "number" && value === Math.floor(value);
      else if(type==="boolean") return typeof value === "boolean";
      else if(type==="array") return Array.isArray(value);
      else if(type === "object") return value !== null && !(Array.isArray(value)) && typeof value === "object";
      else if(type === "null") return value === null;
      else return true;
    }
    
    else {
      return !this._validateSchema(type,value).length;
    }
  }
});

JSONEditor.AbstractEditor = Class.extend({
  editor_count: 0,
  editor_id: null,
  main_holder: null,
  preview_holder: null, 
  preview_id: null,
  editor_holder: null, 
  input_element_id:"", 
  input: null, 
  container:null,
  container_header:null, 
  container_editor:null, 
  container_preview:null, 
  is_visible: true,
  editor_is_visible: true,
  preview_is_visible: false,
  search_is_visible:  false,
  enable_include_checkbox: true,
  include_checkbox: false,
  value4backup: null,
  checkbox4include: {
    "checked": true,
    "visible": false,
  }, 
  default4include: {
    "checked": true,
    "visible": false,
  }, 
  root_watched: {},
  root_header_templates: [],
  root_header4array_templates: [],
  root_question_templates: [],
  root_content_templates: [],
  root_description_templates: [],
  root_title_selector: [],
  output_templates: {}, 
  search_button_controls: null,
  search_keyword_controls: null,
  search_settings_controls: null,
  search_close_controls: null,
  trigger_template_on_postbuild: true,

  node4dom: function (pID) {
    var vNode = null;
    if (pID) {
      vNode = document.getElementById(pID);
    }
    return vNode;
  },
  get_editor_id: function () {
    var vID = null;
    if (this.editor_id) {
      vID = this.editor_id
    } else {
      if (this.container && this.container.id) {
        vID = this.container.id
      } else {
        if (this.editor_holder && this.editor_holder.id) {
          vID = this.editor_holder.id
        } else {
          alert("Editor ID undefined");
        }
      }
    }
    return vID;
  },
  create_unique_id: function() {
    var vID = this.get_unique_id();
    
    return vID;
  },
  get_unique_id: function() {
    if(this.parent) {
        return this.parent.get_unique_id();
    } else {
        var timeInMs = Date.now();
        this.editor_count++;
        var vID = "T"+ timeInMs + "C" + this.editor_count;
        
        return vID;
    }
  },
  get_unique_number: function() {
    if(this.parent) {
        return this.parent.get_unique_number();
    } else {
        var timeInMs = Date.now();
        this.editor_count++;
        var vID = "" + this.editor_count + timeInMs + this.editor_count;
        
        return vID;
    }
  },
  is_object: function  ( obj ) {
    
    return obj && (typeof obj  === "object");
  },
  is_hash: function  ( obj ) {
    
    return  this.is_object(obj) && (!(obj instanceof Array));
  },
  is_array: function ( obj ) {
    
    return this.is_object(obj) && (obj instanceof Array);
  },
  union_array: function (x, y) {
    return $union_array(x,y);
  },
  log4container_id: function (msg) {
    msg = (msg+" - ") || "";
    if (this.editor_holder) {
    } else {
    }
    if (this.container) {
    } else {
    }
    if (this.preview_input) {
    } else {
    }
    
  },
  check4container: function (method,msg) {
    if (msg) {
      msg = "- "+msg+" -"
    } else {
      msg = "";
    }
    if (this.container) {
      if (!this.container.id) {
        this.container.id = this.get_unique_id();
      }
    } else {
      if (this.row_container) {
      } else {
        if (this.container_object) {
        } else {
        }
      }
    }
  },
init: function(options) {
  this.jsoneditor = options.jsoneditor;

  this.theme = this.jsoneditor.theme;
  this.template_engine = this.jsoneditor.template;
  this.iconlib = this.jsoneditor.iconlib;

  this.translate = this.jsoneditor.translate || JSONEditor.defaults.translate;

  this.schema = this.jsoneditor.expandSchema(options.schema);

  this.options = $extend({}, (this.options || {}), (options.schema.options || {}), options);

  if(!options.path && !this.schema.id) this.schema.id = 'root';
  this.path = options.path || 'root';
  this.formname = options.formname || this.path.replace(/\.([^.]+)/g,'[$1]');
  if(this.jsoneditor.options.form_name_root) this.formname = this.formname.replace(/^root\[/,this.jsoneditor.options.form_name_root+'[');
  this.key = this.path.split('.').pop();
  this.parent = options.parent;

  this.checkbox4include = $cloneJSON(this.default4include);

  this.link_watchers = [];

  if (options.container) {
    this.setContainer(options.container);
  };
  if (options.container_preview) {
    this.setContainerPreview(options.container_preview);
  };
  if (options.container_editor) {
    this.setContainerEditor(options.container_editor);
  };
  if (options.main_holder) {
    this.setMainHolder(options.main_holder);
  }
  if (options.preview_holder) {
    this.setPreviewHolder(options.preview_holder);
  }
},
extend_with_schema_defaults: function (pDefault) {
  var vDefault = pDefault || {};
  if (this.schema && this.schema.options && this.schema.options.startval) {
      vDefault = this.schema.options.startval;
  } else if (this.options && this.options.startval) {
    vDefault = this.options.startval;
  } else if (this.schema && this.schema.default) {
    for (var variable in vDefault) {
      if (this.schema.default.hasOwnProperty(variable)) {
        vDefault[variable] = this.schema.default[variable];
      }
    }
  }
  return vDefault;
},
extend_from_schema:function(source_schema) {
  var self = this;
  if (self.schema) {
    for (var variable in source_schema) {
        if (source_schema.hasOwnProperty(variable)) {
          self.schema[variable] = source_schema[variable];
        }
    }
  }
  return self.schema;
},
setMainHolder: function (node4editor) {
  if (node4editor) {
    this.main_holder = node4editor;
    if (node4editor.id) {
    } else {
      node4editor.id = this.create_unique_id();
    }
  }
},
setPreviewHolder: function (node4editor) {
  if (this.main_holder) {
    if (node4editor) {
      var parent = this.main_holder.parentNode;
      parent.appendChild(node4editor);
      this.preview_holder = node4editor;
      if (node4editor.id) {
      } else {
        node4editor.id = this.create_unique_id();
      }
    } else {
      console.error("ERROR - setPreviewHolder('"+this.path+"'): "+this.editortype+".main_holder exists but node4editor is missing.");
    }
  } else {
    console.error("ERROR setPreviewHolder('"+this.path+"'): "+this.editortype+".main_holder does not exist.");
  }
},
setContainer: function(container) {
  this.container = container;
  this.container.setAttribute('id',this.create_unique_id());
  if(this.schema.id) this.container.setAttribute('data-schemaid',this.schema.id);
  if(this.schema.type && typeof this.schema.type === "string") this.container.setAttribute('data-schematype',this.schema.type);
  this.container.setAttribute('data-schemapath',this.path);
},
setContainerPreview: function(container) {
  this.container_preview = container;
  this.container_preview.setAttribute('id',this.create_unique_id());
  if(this.schema.id) this.container_preview.setAttribute('preview-schemaid',this.schema.id);
  if(this.schema.type && typeof this.schema.type === "string") this.container_preview.setAttribute('preview-schematype',this.schema.type);
  this.container_preview.setAttribute('preview-schemapath',this.path);
},
apply4children: function(pFctName,opt4cb,pParam1,pParam2) {
  this.apply4level(pFctName,opt4cb,pParam1,pParam2);
},

apply4level: function(pFctName,opt4cb,pParam1,pParam2) {
  
  opt4cb = this.getOptionsCheckbox4Include(opt4cb);
  if (opt4cb) {
      if (opt4cb.key) {
        if (opt4cb.key === this.key) {
          this.apply4editor(pFctName,pParam1,pParam2);
        } else {
          if (opt4cb.key === "*") {
            this.apply4editor(pFctName,pParam1,pParam2);
          } else {
          }
        }
      } else {
        this.apply4editor(pFctName,pParam1,pParam2);
      }
  } else {
    this.apply4editor(pFctName,pParam1,pParam2);
  }
},
apply4editor: function (pFctName,pParam1,pParam2) {
  if (this[pFctName] && (typeof this[pFctName] === "function")) {
      this[pFctName](pParam1,pParam2);
  } else {
  }

},
setValue: function(value) {
  this.value = value;
},
insertValue: function(value) {
  this.setValue(value);
},
getValue: function() {
  var val = this.value;
  if (this.schema.contentTemplate) {
    
    val = this.content_text || "undefined content template";
  }
  return val;
},
getDataURL: function() {
  return this.getValue();
},
setDataURL: function(value,filename) {
  if (filename) {
    this.options["filename"] = filename;
  }
  this.setValue(value);
},
setLevel4Checkbox: function(opt4cb,level) {
  opt4cb = this.extendOptions4Checked(opt4cb);
  opt4cb.level = (level || 0);
  opt4cb = this.evalBoolean4Checkbox(opt4cb);
  return opt4cb;
},
setStartStopLevel4Checkbox: function(opt4cb,start,stop) {
  
  opt4cb = this.extendOptions4Checked(opt4cb);
  opt4cb.start = (start || 0);
  opt4cb.stop = (stop || 1000);
  opt4cb = this.evalBoolean4Checkbox(opt4cb);
  return opt4cb;
},
setNegationLevel4Checkbox: function(opt4cb,level) {
  
  opt4cb = this.extendOptions4Checked(opt4cb);
  opt4cb.levels4negattion = (level || 0);
  opt4cb = this.evalBoolean4Checkbox(opt4cb);
  return opt4cb;
},
nextCheckboxLevel: function(opt4cb) {
  
  opt4cb = this.extendOptions4Checked(opt4cb);
  opt4cb.level++;
  if (opt4cb.level >= opt4cb.start) {
    
    opt4cb.levels4negation--;
  }
  opt4cb = this.evalBoolean4Checkbox(opt4cb);
  return opt4cb;
},
evalBoolean4Checkbox: function (opt4cb) {
  
  if ((opt4cb.level >= opt4cb.start) && (opt4cb.level <= opt4cb.stop)) {
    opt4cb.apply4level = true;
  } else {
    opt4cb.apply4level = false;
  };

  opt4cb.negation = (opt4cb.levels4negation > 0);

  if (opt4cb.key && (opt4cb.key !== "")) {
    if ((opt4cb.key !== this.key) && (opt4cb.key !== '*')) {
      opt4cb.apply4level = false;
      opt4cb.negation    = false;
    }
  }
  opt4cb.apply4children = (opt4cb.level <= opt4cb.stop);
  return opt4cb;
},
getOptionsCheckbox4Include: function (opt4cb) {

  opt4cb = this.extendOptions4Checked(opt4cb);
  opt4cb = this.evalBoolean4Checkbox(opt4cb);
  return opt4cb;
},
extendOptions4Checked: function (opt4cb) {
  var max = 1000;
  var opt4return = {
    
    "level":0, 
    "levels4negation": 0, 
    "negation":false, 
    "start":1,  
    "stop":max, 
    "apply4level":false, 
    "apply4children": true
    
  }
  for (var key in opt4cb) {
    
    if (opt4cb.hasOwnProperty(key)) {
      opt4return[key] = opt4cb[key];
    }
  }
  return opt4return;
},
setCheckbox4Include: function(checked) {
  if (this.parent && this.parent["reportCheckbox4Include"]) {
    var msg = this.parent.reportCheckbox4Include();
  }
  this.checkbox4include.checked = !!checked;
},
getCheckbox4Include: function(opt4cb) {
  opt4cb = this.getOptionsCheckbox4Include(opt4cb);
  var boolean4include;
  
  if (opt4cb.negation == true) {
    boolean4include =  !(this.checkbox4include.checked);
  } else {
    boolean4include =  this.checkbox4include.checked;
  }
  return boolean4include
},
getValue4Checkbox: function(opt4cb) {
  opt4cb = this.getOptionsCheckbox4Include(opt4cb);
  if (this.getCheckbox4Include() == true) {
      return this.getValue(opt4cb);
  } else {
      return ;
  }
},
getHeader4Editor: function (options) {
  switch (this.editortype) {
    case "array":

    break;
    case "table":

    break;
    default:

  }
},
getValue4Template: function(pTplID,pTpl) {
  
  pTplID = pTplID || "default";
  
  var val = "Template:"+pTplID+" Path: "+this.path + " Value =" + JSON.stringify(this.value,null,4);
  
  if (pTpl) {
    this.output_templates[pTplID] = this.jsoneditor.compileTemplate(pTpl, this.template_engine);
    if (!this.schema.outputTemplates) {
      this.schema.outputTemplates = {};
    }
    this.schema.outputTemplates[pTplID] = pTpl;
  }
  
  if (this.schema.outputTemplates && this.schema.outputTemplates[pTplID]) {
      var vars = this.getTemplateFieldValues();
      var tpl_text = this.output_templates[pTplID](vars);
      
      val = this.output_templates[pTplID](vars);
  } else {
      console.warn("Editor "+this.editortype+".getValue4Template('"+this.path+"') this.schema.outputTemplates['"+pTplID+"'] does not exist");
      
  }
  if (this.checkbox4include && this.checkbox4include.checked == false) {
    val = "";
  }
  return val;
},
getSelectedValue: function() {
  
  return this.getValue();
},
setSelectedValue: function(value) {
  
  return this.setValue(value);
},
getTitle: function() {
  return this.schema.title || this.key;
},
setTitle: function(title) {
  
  if (this.header4title) {
    this.header4title.textContent = title;

  } else {
    console.warn(this.editortype+".setTitle('"+title+"') does not work because this.header4title does not exist at editor ["+this.path+"].");
  }
},
getHeader4Editor: function (options) {
  this.header = document.createElement('span');
  this.header.textContent = this.getTitle();
  if ($check_options(this.options,"small_header",false) === true) {
    
    this.header4title = this.theme.getHeader(this.header,'h4');
  } else {
    
    this.header4title = this.theme.getHeader(this.header,'h3');
  }
},
getDefault: function() {
  if(this.schema["default"]) return this.schema["default"];
  if(this.schema["enum"]) return this.schema["enum"][0];

  var type = this.schema.type || this.schema.oneOf;
  if(type && Array.isArray(type)) type = type[0];
  if(type && typeof type === "object") type = type.type;
  if(type && Array.isArray(type)) type = type[0];

  if(typeof type === "string") {
    if(type === "number") return 0.0;
    if(type === "boolean") return false;
    if(type === "integer") return 0;
    if(type === "string") return "";
    if(type === "object") return {};
    if(type === "array") return [];
    if(type === "largearray") return {
      "current":0,
      "data": [{}]
    };
    if(type === "date") return Date.now();
  }

  return null;
},
refreshValue: function() {
},
getChildEditors: function() {
  return false;
},

getNumColumns: function() {
  return 12;
},

getIconList: function(iconlist) {
    var icon4dom = null;
    if(!this.iconlib) {
      icon4dom = null;
    } else {
      if (iconlist && iconlist.indexOf(" ") > 0) {
        iconlist = iconlist.replace(/[ ]+/," ");

        iconlist = iconlist.trim();
        icon_id = iconlist.split(" ");
        icon4dom = document.createElement("span");
        for (var i = 0; i < icon_id.length; i++) {
          icon4dom.appendChild( this.iconlib.getIcon(icon_id[i]));
        }
      } else {
        
        icon4dom = this.iconlib.getIcon(iconlist);
      }
    }
    return icon4dom;
},

get_div: function (pAnnotation) {
  var container = document.createElement("div"); 
  container.id = this.create_unique_id();
  if (pAnnotation) {
    var vNote = pAnnotation.replace(/[^A-Za-z\.\-_0-9 ]/g,"");
    container.setAttribute("data-note",vNote);
  }
  return container;
},
setDescription: function (pContent) {
  $setContent(this.description,pContent);
  this.schema.description = pContent;
},
getDescription: function () {
  var vDescription = "";
  if (this.schema.descriptionTemplate) {
    
    vDescription = this.schema.descriptionTemplate || "undefined description template";
  } else {
    if (this.schema.description) {
      vDescription = this.schema.description;
    }
  }
  return vDescription;
},
setQuestion: function (pContent) {

  $setContent(this.question,pContent);
  this.schema.question = pContent;
},
getQuestion: function () {
  var vQuestion = "";
  if (this.schema.questionTemplate) {
    vQuestion = this.schema.questionTemplate || "undefined question template";
  } else {
    if (this.schema.question) {
      vQuestion = this.schema.question;
    }

  }
  return vQuestion;
},
get_editor: function (path) {
  var root_editor = this.get_root_editor();
  var patharr = path.split('.');
  var ret_editor = root_editor
  var sub_editor_path = "root";
  if (path == "root") {
    return root_editor;
  } else {
    var vFoundKey = null;
    var vFoundArray = []
    if (patharr[0] == "root") {
      vFoundKey = "root";
      vFoundArray.push(vFoundKey);
      for (var i = 1; i < patharr.length; i++) {
        
        if (ret_editor && (ret_editor.editortype == "object" || ret_editor.editortype == "largearray")) {

          vFoundKey = null
          $each(ret_editor.editors, function(key,editor) {

            if (key == patharr[i]) {
              vFoundKey = key;
              ret_editor =  editor;
            }
          });
          if (vFoundKey) {
            vFoundArray.push(vFoundKey);
          }
        }
        if (vFoundArray.length == patharr.length) {
        } else {
          console.error("get_editor('"+path+"') - Path mismatch path='path' found '"+vFoundArray.join(".")+"'");
        }
      }
    } else {
      console.error("get_editor('"+path+"') - JSON editor path must start with 'root'");
    }
  };
  return ret_editor; 
},
get_template4id: function (preview_options) {
  var tpl = "";
  if (preview_options && preview_options.tpl_id) {
    var tpl_id = preview_options.tpl_id;
    if (tpl_id && (tpl_id != "-")) {
      if (options && options.templates && options.templates[tpl_id]) {
        tpl = options.templates[tpl_id];
      } else {
      }
    } else {
    }
  } else {
  }
  return tpl;
},
get_editor_value: function (path) {
  console.log(this.editortype + ".get_editor_value('"+path+"') called from path='"+this.path+"'");
  var vRet = null;
  var root_editor = this.get_root_editor();
  var patharr = path.split('.');
  var ret_editor = root_editor
  var sub_editor_path = "root";
  if (path == "root") {
    console.log("FOUND [root]: "+this.editortype + ".get_editor('"+path+"') called from path='"+this.path+"'");
    return root_editor;
  } else {
    var vFoundKey = null;
    var vFoundArray = []
    if (patharr[0] == "root") {
      vFoundKey = "root";
      vFoundArray.push(vFoundKey);
      console.log("SEARCH: "+this.editortype + ".get_editor('"+path+"') OK path starts with root");
      for (var i = 1; i < patharr.length; i++) {
        console.log("SEARCH["+patharr[i]+"]: "+this.editortype + ".get_editor('"+path+"') determine sub editor with the key=patharr[" + i + "]='" + patharr[i] + "'");
        
        if (ret_editor && (ret_editor.editortype == "object" || ret_editor.editortype == "largearray")) {
          console.log("OBJECT SEARCH["+patharr[i]+"]: "+this.editortype + ".get_editor('"+path+"')  ret_editor["+sub_editor_path+"] is of type='"+ret_editor.editortype+"'");

          vFoundKey = null
          $each(ret_editor.editors, function(key,editor) {
            console.log("COMPARE '"+key+"' for SEARCH["+patharr[i]+"]: "+this.editortype + ".get_editor('"+path+"')  ret_editor["+sub_editor_path+"] is of type='"+ret_editor.editortype+"'");

            if (key == patharr[i]) {
              vFoundKey = key;
              ret_editor =  editor;
              vRet = ret_editor.getValue();
            }
          });
          if (vFoundKey) {
            console.log("FOUND["+patharr[i]+"]: "+this.editortype + ".get_editor('"+path+"')  ret_editor["+sub_editor_path+"] is of type='"+ret_editor.editortype+"'");
            vFoundArray.push(vFoundKey);
          }
        }
        if (vFoundArray.length == patharr.length) {
          console.log("get_editor('"+path+"') - JSON editor witht ID '"+path+"' found");
          
        } else {
          console.error("get_editor('"+path+"') - Path mismatch path='path' found '"+vFoundArray.join(".")+"'");
        }
      }
    } else {
      console.error("get_editor('"+path+"') - JSON editor path must start with 'root'");
    }
  };
  return vRet; 
},
get_root_editor: function () {
  var self = this;
  if (this.parent) {
    if  (typeof this.parent.get_root_editor === 'function') {
      return this.parent.get_root_editor();
    } else {
      console.error("CALL: " + this.editortype + ".get_root_editor(" + this.path + ") - Parent " + this.parent.editortype + "-editor with path '" + this.parent.path + "' of current editor '" + this.path + "' does not have the method '"+this.editortype+".get_root_editor()'");
      return null;
    }
  } else {
    return self;
  }
},
getDisplayText: function(arr) {
  var disp = [];
  var used = {};

  $each(arr,function(i,el) {
    if(el && el.title) {
      used[el.title] = used[el.title] || 0;
      used[el.title]++;
    }
    if(el && el.question) {
      used[el.question] = used[el.question] || 0;
      used[el.question]++;
    }
    if(el && el.description) {
      used[el.description] = used[el.description] || 0;
      used[el.description]++;
    }
    if(el && el.format) {
      used[el.format] = used[el.format] || 0;
      used[el.format]++;
    }
    if(el && el.type) {
      used[el.type] = used[el.type] || 0;
      used[el.type]++;
    }
  });

  $each(arr,function(i,el)  {
    var name = "type";
    if (el) {
      
      if(typeof el === "string") name = el;
      
      else if(el.title && used[el.title]<=1) name = el.title;
      else if(el.format && used[el.format]<=1) name = el.format;
      else if(el.type && used[el.type]<=1) name = el.type;
      else if(el.question && used[el.question]<=1) name = el.question;
      else if(el.description && used[el.description]<=1) name = el.description;
      else if(el.title) name = el.title;
      else if(el.format) name = el.format;
      else if(el.type) name = el.type;
      else if(el.question) name = el.question;
      else if(el.description) name = el.description;
      else if(JSON.stringify(el).length < 50) name = JSON.stringify(el);
      else name = "type";
    }

    disp.push(name);
  });

  var inc = {};
  $each(disp,function(i,name) {
    inc[name] = inc[name] || 0;
    inc[name]++;

    if(used[name] > 1) disp[i] = name + " " + inc[name];
  });

  return disp;
},
 keyword_array: [],
 search_result: [],
 display_search_result : function() {
  
  if (this.search_result && this.search_result.result) {
    var msg = "";
    if (this.search_result.result.length == 0) {
        msg = this.translate('error_no_search_results');
    } else {
        msg = this.translate('message_result');
        
    }
    console.log("MESSAGE: "+msg);
    this.search_result_holder.innerHTML = msg;
  }
  this.show_search_control();
},
get_keyword_array: function(pKeywords) {
  var vKeywordArray = [];
  
  if (this.is_array(pKeywords)) {

    vKeywordArray = pKeywords;
  } else {
    if (this.is_hash(pKeywords)) {

      for (var variable in pKeywords) {
        if (pKeywords.hasOwnProperty(variable)) {
          if (pKeywords[variable]) {
            
            vKeywordArray.push(pKeywords[variable]);
          }
        }
      }
    } else {

      if (pKeywords && (pKeywords.indexOf(" ") > 0)) {
        var ka = pKeywords.split(/[ ]+/);
        for (var i = 0; i < ka.length; i++) {
          if (ka[i]) {
            vKeywordArray.push(ka[i]+"");
          }
        }
      } else {
        
        if (pKeywords) {
          vKeywordArray = [pKeywords+""];
        } else {
          console.warn(this.translate("error_no_search_keywords"));
        }
      }
    }
  }
  return vKeywordArray
},
search: function(pKeywords) {
  
  var vKeywordArray = this.get_keyword_array(pKeywords);
  
  this.keyword_array = vKeywordArray;
  if (vKeywordArray && vKeywordArray.length > 0) {
    this.search_result = this.search4array(vKeywordArray);
    this.display_search_result();
  } else {
    alert(this.translate("error_no_search_keywords"));
  }

},
search4array: function (pKeywordArray) {
  var vResult = [];

  var vString = "";
  this.show_search_control();
  var vJSON = this.getValue();
  if (this.is_array(vJSON)) {
    console.log("Search for [" + pKeywordArray.join(",")+ "] in Array '" + this.path + "' as stringified JSON");
    vString = JSON.stringify(vJSON);
  } else {
    if (this.is_hash(vJSON)) {
      console.log("Search for [" + pKeywordArray.join(",")+ "]  in Object '" + this.path + "' as stringified JSON");
      vString = JSON.stringify(vJSON);
    } else {
      console.log("Search for [" + pKeywordArray.join(",")+ "]  in Value '" + this.path + "' as string");
      vString = vJSON + "";
    }
  }
  if (vString) {
    
    if (pKeywordArray && (pKeywordArray.length > 0)) {
      
      for (var i = 0; i < pKeywordArray.length; i++) {
        if (vString.indexOf(pKeywordArray[i]) >= 0) {
          vResult.push(pKeywordArray[i])
        } else {
          
        }
      }
    } else {
      console.warn("Search Call: No Keywords for search defined or keyword array is empty!");
    }
  } else {
    console.warn("Search Call: vString is empty to search in - no search");
  }
  
  return  {
    "path" : this.path,
    "id": this.get_editor_id(),
    "result" :vResult
  };
},
show_search: function() {
  var vDisplay = "inline-block";
  this.search_is_visible === true;

  this.show4dom(this.search_button,"button4search",vDisplay)
  this.show4dom(this.search_button_controls,"search_button",vDisplay);
  this.show4dom(this.search_keyword_controls,"search_keywords",vDisplay);
  this.show4dom(this.search_settings_controls,"search_settings",vDisplay);
  this.show4dom(this.search_close_controls,"search_close",vDisplay);
  
},
hide_search: function() {
  var vDisplay = "none";
  this.search_is_visible == false;
  this.hide4dom(this.search_button,"button4search",vDisplay)
  this.hide4dom(this.search_button_controls,"search_button",vDisplay);
  this.hide4dom(this.search_keyword_controls,"search_keywords",vDisplay);
  this.hide4dom(this.search_settings_controls,"search_settings",vDisplay);
  this.hide4dom(this.search_close_controls,"search_close",vDisplay);
},
toggle_search: function () {
  if (this.search_is_visible == false) {
    this.show_search();
  } else {
    this.hide_search();
  }
},
show_search_control: function(pKeywordArray) {
  var vDisplay = "none";
  this.show_search();
  if (this.search_close_controls) {
    console.log("show_search_control() - search_close_controls with editortype='" + this.editortype +"' ");
    if (pKeywordArray && this.is_array(pKeywordArray)) {
      this.search_box_keywords.value = pKeywordArray.join(" ") || "";
      console.log("show search_close_control");
    }
    if (this.search_box_keywords.value != "") {
      this.show4dom(this.search_close_controls,"search_keywords","inline-block");
    }  else {
      this.hide4dom(this.search_close_controls,"search_close",vDisplay);
    }
  } else {
    
  }

},
hide_search_control: function() {
  console.log("hide_search_control() at editor [" + this.path + "]");
  this.hide_search()
},
close_search_control: function() {
  var vDisplay = "none";
  console.log("close_search_control() for [" + this.path + "]");
  var self = this;
  this.hide4dom(this.search_close_controls,"search_keywords",vDisplay);
  if (this.search_result_holder) {
    this.search_result_holder.innerHTML = "";
  } else {
    
  }
  if (this.rows) {
    for(var i=0; i<this.rows.length; i++) {
      this.rows[i].hide_search_control();
      this.rows[i].close_search_control();
    }
  }
  if (this.editors) {
    $each(this.editors, function(key,editor) {
      self.editors[key].hide_search_control();
      self.editors[key].close_search_control();
    });
  }
  this.show();
},
getSearchControl: function(pControlID) {

  var self = this;
  
  this.search_button_controls = this.theme.getHeaderButtonHolder();
  this.search_keyword_controls = this.theme.getHeaderButtonHolder();
  this.search_settings_controls = this.theme.getHeaderButtonHolder();
  this.search_close_controls = this.theme.getHeaderButtonHolder();

  this.search_button = this.getButton('','search',this.translate('button_search'));
  this.search_box_keywords = this.theme.getFormInputField("text");
  this.search_box_keywords.setAttribute('size',(this.options.search_box_size || 20));
  this.search_box_keywords.addEventListener('keyup', function (e) {
    if (e.keyCode === 13) {
       console.log("Enter key pressed in search box with keywords: '"+ vKeywords + "'");
       self.show();
       e.preventDefault();
       e.stopPropagation();
       if (self.search_result_holder) {
         var vKeywords = self.search_box_keywords.value;
         self.search_close_button.style.display="block";
         self.search(vKeywords);
       } else {
         console.error("Search result holder is missing");
       }
    }
 });
  
  this.search_settings = this.getButton('','settings',this.translate('button_settings'));
  this.search_settings.addEventListener('click',function(e) {
    console.log("Display Modal select object key/value pairs for search.")
    e.preventDefault();
    e.stopPropagation();
    self.toggleSearchSettings();
  });
  this.search_close_button = this.getButton('','cancel',this.translate('button_search_close'));
  
  this.search_settings_holder = this.theme.getModal();
  this.search_settings_close = this.getButton('Close','cancel','Close');
  this.search_settings_close.addEventListener('click',function(e) {
    e.preventDefault();
    e.stopPropagation();
    self.hideSearchSettings();
  });
  if (this.editortype == "object") {
    console.log("Add search checkboxes for editor ["+ this.path+ "] and editortype='" + this.editortype + "'");
    var key_array = [];
    $each(this.editors, function(key,editor) {
      key_array.push(key);
    });
    key_array.sort();
    for (var i = 0; i < key_array.length; i++) {
      var checkbox_control = this.getSearchSelectCheckbox(key_array[i]);
      this.search_settings_holder.appendChild(checkbox_control);
    }
  }
  this.search_settings_holder.appendChild(this.search_settings_close);

  this.search_button_controls.appendChild(this.search_button);
  this.search_keyword_controls.appendChild(this.search_box_keywords);
  this.search_settings_controls.appendChild(this.search_settings);
  this.search_settings_controls.appendChild(this.search_settings_holder);
  this.search_close_controls.appendChild(this.search_close_button);
  
  this[pControlID].appendChild(this.search_button_controls);
  this[pControlID].appendChild(this.search_keyword_controls);
  this[pControlID].appendChild(this.search_settings_controls);
  this[pControlID].appendChild(this.search_close_controls);

  this.search_button.addEventListener('click',function(e) {
    self.show();
    e.preventDefault();
    e.stopPropagation();
    if (self.search_result_holder) {
      var vKeywords = self.search_box_keywords.value;
      console.log("Search result holder exists with keywords: '"+ vKeywords + "'");
      self.search_close_button.style.display="block";
      self.search(vKeywords);
    } else {
      console.error("Search result holder is missing");
    }
  });

  this.search_close_button.addEventListener('click',function(e) {
    console.log("Search closed");
    self.close_search_control();
    e.preventDefault();
    e.stopPropagation();
  });

  this.hide_search_control();
  if (this.check_options_schema("enable_search",false) === true) {
    console.log("Search control enabled in schema options");
    this.show_search_control()
  } else if (this.check_options_global("enable_search",false) === true) {
    console.log("Search control enabled globally in jsoneditor options");
    this.show_search_control()
  } else {
    console.log("Search control was not enabled in options (in schema or global)");
  }
  
},

  show4dom: function (pNode,pID,pDisplay) {
    pDisplay = pDisplay || "";
    pID = pID || "unknown ID";
    if (pNode) {
      pNode.style.display = pDisplay;
    } else {
      
      console.warn(this.editortype+".show4dom('"+pID+"') DOM node with id=["+pID+"] does not exist for editor ["+this.path+"]!");
    }
  },
  hide4dom: function (pNode,pID,pDisplay) {
    pDisplay = pDisplay || "none";
    pID = pID || "unknown ID";
    if (pNode) {
      pNode.style.display = pDisplay;
    } else {
      
      console.warn(this.editortype+".hide4dom('"+pID+"') DOM node with id=["+pID+"] does not exist for editor ["+this.path+"]!");
    }
  },
  show_element: function (pElementName) {
    if (pElementName) {
        var vNode;
        switch (pElementName) {
          case "question","description":
            vNode = this[pElementName];
            this.show4dom(vNode,pElementName,"");
          break;
          case "preview_element":
            if (this[pElementName]) {
              this.show4dom(vNode,pElementName,"");
            }
          break;
          case "preview_input":
            if (this[pElementName]) {
              this.show4dom(vNode,pElementName,"");
            }
          break;
          default:
            if (this[pElementName]) {
              vNode = this[pElementName];
              this.show4dom(vNode,pElementName,"");
            }
        }
    } else {
    }

  },
  show4id: function (pID,pDisplay) {
    var vDisplay = pDisplay || "";
    if (pID) {
      if (window.jQuery) {
        
        if (!$( "#"+pID).length) {
          console.warn(this.editortype+".show4id('"+pID+"') DOM node with id=["+pID+"] does not exist for editor ["+this.path+"]!");            
        } else {

          $("#"+pID).show();
          this.show4dom(document.getElementById(pID),pID,"block");
          document.getElementById(pID).style.display = "block"
          
        }
      } else {
        var vNode = document.getElementById(pID);
        if (vNode) {
          this.show4dom(vNode,pID,vDisplay);
        } else {
          console.warn(this.editortype+".show4id('"+pID+"') DOM node with id=["+pID+"] does not exist for editor ["+this.path+"]!");
        }
      }
    } else {
      console.warn(this.editortype+".show4id(pID) pID undefined at editor ["+this.path+"]!");
    }
  },
  hide4id: function (pID,pDisplay) {
    var vDisplay = pDisplay || "none";
    if (pID) {
      if (window.jQuery) {
        
        if (!$( "#"+pID).length) {
          console.warn(this.editortype+".hide4id('"+pID+"') DOM node with id=["+pID+"] does not exist for editor ["+this.path+"]!");            
        } else {
          
          $("#"+pID).hide();
          this.hide4dom(document.getElementById(pID),pID,vDisplay);
          document.getElementById(pID).style.display = vDisplay;
          
        }
      } else {
        var vNode = document.getElementById(pID);
        if (vNode) {
          this.hide4dom(vNode,pID,vDisplay);
        } else {
          console.warn(this.editortype+".hide4id('"+pID+"') DOM node with id=["+pID+"] does not exist!");
        }
      };
    } else {
      console.error(this.editortype+".hide4id(pID) pID undefined at editor ["+this.path+"]!");
    }
  },
  show: function (force) {
    if (this.check_options_schema("hidden",false) === true) {
      if (force && force === true) {
        this.show4id(this.get_editor_id());
        this.is_visible = true;
      } else {
        this.hide4id(this.get_editor_id());
        this.is_visible = false;
      }
    } else {
      this.show4id(this.get_editor_id());
      this.is_visible = true;
    }
  },
  hide: function () {
    this.hide4id(this.get_editor_id());
    this.is_visible = false;
  },
  show_checkbox4include: function () {
    this.show4dom(this.checkbox4include,"checkbox4include");
    this.checkbox4include.setAttribute("value4visibility","visible");
  },
  hide_checkbox4include: function () {
    this.hide4dom(this.checkbox4include,"checkbox4include");
    this.checkbox4include.setAttribute("value4visibility","hidden");
  },
  toggle_checkbox4include: function () {
    var vVisible = this.checkbox4include.getAttribute("value4visibility");
    if (vVisible == "hidden") {
      this.show_checkbox4include();
    } else {
      this.hide_checkbox4include();
    }
  },
  show_editor: function () {
    var self = this;
    if (this.check_options_schema("hidden",false) === true) {
      
      if (this.input) {
        
        this.input.style.display = "none";
      } else {
        if (this.editor_holder) {
          this.editor_holder.style.display = "none";
          
        } else {
          if (this.row_holder) {
            this.row_holder.style.display = "none";
            
          }
        }
      }
      this.editor_is_visible = false;
    } else {
      
      if (this.input) {
        
        this.input.style.display = "";
      } else {
        if (this.editor_holder) {
          this.editor_holder.style.display = "";
          
        } else {
          if (this.row_holder) {
            this.row_holder.style.display = "";
            
          }
        }
      }
      this.editor_is_visible = true;
    }
  },
  hide_editor: function () {
    
    if (this.input) {
      
      this.input.style.display = "none";
    } else {
      if (this.editor_holder) {
        this.editor_holder.style.display = "none";
        
      } else {
        if (this.row_holder) {
          this.row_holder.style.display = "none";
          
        }
      }
    }
    this.editor_is_visible = false;
  },
  toggle_editor: function () {
    if (this.editor_is_visible == false) {
      this.show_editor();
      this.editor_is_visible = true
    } else {
      this.hide_editor();
      this.editor_is_visible = false
    }
  },
  toggle_editor_preview: function () {
    if (this.editor_is_visible == false) {
      this.show_editor();
      this.editor_is_visible = true;
      this.hide_preview();
      this.preview_is_visible = false;
    } else {
      this.hide_editor();
      this.editor_is_visible = false
      this.show_preview();
      this.preview_is_visible = true;
    }
  },
  isEditorHidden: function () {
    
    return this.editor_is_visible;
  },
  isPreviewHidden: function () {
    
    return this.preview_is_visible;
  },
  isHidden: function () {
    return this.is_visible;
  },
  toggle: function () {
    if (this.is_visible == false) {
      this.show();
      this.is_visible = true;
    } else {
      this.hide();
      this.is_visible = false;
    }
  },
  show_preview:function () {
    
    var self = this;
    if (self.check_options_schema("hidden",false) == false) {
      if (this.container_preview) {
        
        this.container_preview.style.display = "";
        this.preview_is_visible = true;
      } else {
        
      }
      if (this.preview_input) {

        this.update_preview();
        this.preview_input.style.display = "";
        this.preview_is_visible = true;
      } else {
        
      }
    } else {

      this.hide_preview();
      
    }
  },
  hide_preview:function () {
    var self = this;
    if (this.container_preview) {
      this.preview_is_visible = false;
      
      this.container_preview.style.display = "none";
    } else {
    }
    if (this.preview_input) {
      
      this.preview_input.style.display = "none";
      
      this.preview_is_visible = false;
    } else {
      
    }
  },
  toggle_preview: function () {
    var self = this;
    if (self.preview_is_visible == false) {
      self.show_preview();
      self.preview_is_visible = true;
    } else {
      self.hide_preview();
      self.preview_is_visible = false;
    }
  },
  show_editor_element:function (pID) {
    var self = this;
    
      if (this[pID]) {
        this[pID].style.display="";
        self[pID+"_is_visible"] = true;
      } else {
      }
    
  },
  hide_editor_element:function (pID) {
    var self = this;
    if (this[pID]) {
        this[pID].style.display="none";
        self[pID+"_is_visible"] = false;
    } else {
    }
  },
  toggle_editor_element: function (pID) {
    var self = this;
    if (self[pID+"_is_visible"] == false) {
      self["show_"+pID]();
      self[pID+"_is_visible"] = true;
    } else {
      self["hide_"+pID]();
      self[pID+"_is_visible"] = false;
    }
  },
  show_description:function () {
    this.show_editor_element("description");
  },
  hide_description:function () {
    this.hide_editor_element("description");
  },
  toggle_description:function () {
    this.toggle_editor_element("description");
  },
  show_question:function () {
    this.show_editor_element("question");
  },
  hide_question:function () {
    this.hide_editor_element("question");
  },
  toggle_question:function () {
    this.toggle_editor_element("question");
  },
  show_title:function () {
    this.show_editor_element("title");
  },
  hide_title:function () {
    this.hide_editor_element("title");
  },
  toggle_title:function () {
    this.toggle_editor_element("title");
  },
  enable: function() {
    this.disabled = false;
  },
  disable: function() {
    this.disabled = true;
  },
  isEnabled: function() {
    return !this.disabled;
  },
  isRequired: function() {
    if(typeof this.schema.required === "boolean") return this.schema.required;
    else if(this.parent && this.parent.schema && Array.isArray(this.parent.schema.required)) return this.parent.schema.required.indexOf(this.key) > -1;
    else if(this.jsoneditor.options.required_by_default) return true;
    else return false;
  },
loadJSON: function() {
  if (this["input_json_button"]) {
    
    this.input_json_button.click();
  } else {
    alert("Load JSON is not a defined function");
  }
},
saveJSON: function(pFilename) {
  var vFilename = self.getFilename4SaveJSON();
  if (pFilename) {
    vFilename = pFilename;
  } else {
    vFilename = prompt("Save Filename in Download Folder with Filename:",vFilename);
  }
  var vContent = JSON.stringify(self.getValue(),null,4);
  
  self.download_text(vFilename,vContent);
  console.log("JSON file '" + vFilename + "' saved");

},
get_filename4save: function (pFilePrefix,pExtension) {
  pFilePrefix = pFilePrefix || "data";
  pFilePrefix = this.get_options_schema("prefix4file",pFilePrefix);
  pExtension = pExtension || "json";
  pExtension = this.get_options_schema("extension4file", pExtension);
  var arr = this.path.split(".");
  arr[0] = pFilePrefix;
  var vFilename = arr.join("_");
  vFilename += "."+pExtension;
  if (this.options["filename"]) {
    vFilename = this.options.filename;
  }
  return vFilename;
},
save2file: function (pFilename) {
  var vFilename = this.get_filename4save();
  if (pFilename) {
    vFilename = pFilename;
  }
  var json = this.getValue();
  var content = null;
  if (typeof json == "string") {
    content = json;
  } else {
    content = JSON.stringify(json,null,4);
  };
  if (window.LoadSave4File) {
    console.log("LoadSave4File exists.");
    var s2f = new LoadSave4File("text");
    s2f.save(vFilename,content);
  } else {
    
    this.download_text(vFilename,content);
    console.log("File: '"+vFilename+"'\n"+content);
  }
},
download_blob: function (pFilename,pDataURL) {
  if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
    window.open(pDataURL);
  } else {
    var blob = this.dataURLToBlob(pDataURL);
    var url = window.URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = url;
    a.download = pFilename;

    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);
  }
},
dataURLToBlob: function (dataURL) {
  
  var parts = dataURL.split(';base64,');
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;
  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: contentType });
},
download_text_filesaver: function (pFilename,pContent) {
  var file = new File([pContent], {type: "text/plain;charset=utf-8"});
  window.saveAs(file,pFilename);
},
download_text: function (pFilename,pData) {
  if (navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") === -1) {
    window.open(pData);
  } else {
    if (window.saveAs) {
      
      this.download_text_filesaver(pFilename,pData);
    } else {
      var a = document.createElement("a");
      a.download = pFilename;
      a.style = "display: none";
      var t = new Blob([pData], {
          type: "text/plain"
        });
      a.href = window.URL.createObjectURL(t);
      
      a.click();
    }
  }
},
onChildEditorChange: function(editor) {
  
  this.onChange(true);
},
notify: function() {
  this.jsoneditor.notifyWatchers(this.path);
},
change: function() {
  
  if (this.parent) {

    this.parent.onChildEditorChange(this);
  } else {

    this.onChange4HeaderTemplates();
    this.onChange4ContentTemplates();
    this.onChange4QuestionTemplates();
    this.onChange4DescriptionTemplates();
    this.onChange4TitleSelector();
    this.jsoneditor.onChange();
  }
},
onChange: function(bubble) {
  
  this.notify();
  if (this.watch_listener) this.watch_listener();
  if (bubble && (bubble === true)) {
    
    this.change();
  }
},
isEditor4Template: function (pEditor,pTemplateType) {
  var vRet = false;
  if (pEditor && pEditor.editortype && pEditor.path) {
    vRet = true
  } else {
    
  };
  return vRet;
},
registerHeaderTemplate: function(pEditor) {
  if (this.parent) {

    this.parent.registerHeaderTemplate(pEditor);
  } else {

    if (this.isEditor4Template(pEditor,"Header") === true) {
      this.root_header_templates.push(pEditor);
    };
  }
},
registerHeader4ArrayTemplate: function(pEditor) {
  if (this.parent) {

    this.parent.registerHeader4ArrayTemplate(pEditor);
  } else {

    if (this.isEditor4Template(pEditor,"Header4Array") === true) {
      this.root_header4array_templates.push(pEditor);
    }
  }
},
registerContentTemplate: function(pEditor) {
  if (this.parent) {

    this.parent.registerContentTemplate(pEditor);
  } else {

    if (this.isEditor4Template(pEditor,"Content") === true) {
      this.root_content_templates.push(pEditor);
    }
  }
},
registerQuestionTemplate: function(pEditor) {
  if (this.parent) {

    this.parent.registerQuestionTemplate(pEditor);
  } else {

    if (this.isEditor4Template(pEditor,"Question") === true) {
      this.root_question_templates.push(pEditor);
    }
  }
},
registerTitleSelector: function(pEditor) {
  if (this.parent) {

    this.parent.registerTitleSelector(pEditor);
  } else {

    if (this.isEditor4Template(pEditor,"TitleSelector") === true) {
      this.root_title_selector.push(pEditor);
    }
  }
},
registerDescriptionTemplate: function(pEditor) {
  if (this.parent) {

    this.parent.registerDescriptionTemplate(pEditor);
  } else {

    if (this.isEditor4Template(pEditor,"Description") === true) {
      this.root_description_templates.push(pEditor);
    };
  }
},
onChange4Templates: function (pID) {
  
  pID = pID || "Content";
  var vid = pID.toLowerCase();
  var vEdit4Tpl = this["root_"+vid+"_templates"];
  if (vEdit4Tpl && vEdit4Tpl.length > 0) {
    for (var i = 0; i < vEdit4Tpl.length; i++) {
      var vEditor = vEdit4Tpl[i];
      if (vEditor) {
        if (typeof vEditor.onWatchedFieldChange === 'function') {
            vEditor.onWatchedFieldChange();
          } else {
            var type4editor = vEditor.editortype || "unknown_editortype";
            var path4editor = vEditor.path || "unkown_editor_path";
            console.error("root_"+vid+"_templates["+i+"]: "+type4editor+".onChange4Templates('"+pID+"','"+path4editor+"') does not exist!");
          }
      } else {
        console.error("Editor "+this.editortype +".root_"+vid+"_templates["+i+"] does not exist!");
      }
    }
  }
},

onChange4QuestionTemplates: function () {
  this.onChange4Templates("Question");
},
onChange4DescriptionTemplates: function () {
  this.onChange4Templates("Description");
},
onChange4ContentTemplates: function () {
  
  if (this.root_content_templates && this.root_content_templates.length > 0) {
    for (var i = 0; i < this.root_content_templates.length; i++) {
      var vEditor = this.root_content_templates[i];
      if (vEditor) {
        if (typeof vEditor.onWatchedFieldChange === 'function') {
            vEditor.onWatchedFieldChange();
          } else {
            console.error(vEditor.editortype+".onChange4ContentTemplates('"+vEditor.path+"') does not exist!");
          }
      } else {
        console.error("Editor "+this.editortype +".root_content_templates["+i+"] does not exist!");
      }
    }
  }
},
onChange4HeaderTemplates: function () {
  
  if (this.root_header_templates && this.root_header_templates.length > 0) {
    for (var i = 0; i < this.root_header_templates.length; i++) {
      var vEditor = this.root_header_templates[i];
      if (vEditor) {
        if (typeof vEditor.onWatchedFieldChange === 'function') {
            vEditor.onWatchedFieldChange();
          } else {
            console.error(vEditor.editortype+".onChange4HeaderTemplates('"+vEditor.path+"') does not exist!");
          }
      } else {
        console.error("Editor "+this.editortype +".root_header_templates["+i+"] does not exist!");
      }
    }
  }
},
onChange4TitleSelector: function () {
  
  if (this.root_title_selector && this.root_title_selector.length > 0) {
    for (var i = 0; i < this.root_title_selector.length; i++) {
      var vEditor = this.root_title_selector[i];
      if (vEditor) {
        if (typeof vEditor.syncEditor4Select === 'function') {
            vEditor.syncEditor4Select();
            
        } else {
            console.error(vEditor.editortype+".onChange4HeaderTemplates('"+vEditor.path+"') does not exist!");
        }
      } else {
        console.error("Editor "+this.editortype +".root_header_templates["+i+"] does not exist!");
      }
    }
  }
},
register: function() {
  this.jsoneditor.registerEditor(this);
  this.onChange();
},
unregister: function() {
  if(!this.jsoneditor) return;
  this.jsoneditor.unregisterEditor(this);
},
showValidationErrors: function(errors) {

},
update_preview: function(options) {
  var content = "" + this.getValue() +"";
  var div = this.get_div("preview-input");
  div.style.marginLeft = "10px";
  $setContent(div,content);
  this.preview_input.innerHTML = "";
  this.preview_input.appendChild(div);
},
update_preview_do: function(options) {
  
  var cp = this.container_preview;
  if (options && options.container_preview) {
    cp = options.container_preview;
  }
  if (this.preview_is_visible === true) {
    this.container_preview.innerHTML = "";
    this.build_preview({
      "container_preview": cp,
      "enable_preview": this.options.enable_preview,
      "hidden": this.options.hidden
    });
  } else {
  };
  if (this.path == "root") {
    this.update_editor_elements();
  }
},
update_editor_elements: function() {
  if (this.path == "root") {
    this.exec4watcher();
  } else {
    if (this.parent) {
      
      if (this.parent.update_editor_elements) {
        this.parent.update_editor_elements();
      } else {
      }
    }
  }
},
watch4root: function (pSrcPath,pDestPath,callbackname) {
  if (pSrcPath && pDestPath) {
    callbackname = callbackname || "update_editor_do";
    this.root_watched[pSrcPath] = {
      "srcpath": pSrcPath,
      "destpath": pDestPath,
      "callbackname":callbackname
    }
  } else {
    console.log(this.editortype+".watch4root(pSrcPath,pDestDath,callbackname) - Parameter undefined");
  }
},
exec4watcher: function() {
  var self = this;
  if (this.root_watched) {
    for (var key in this.root_watched) {
      if (this.root_watched.hasOwnProperty(key)) {
        var vWatcher = this.root_watched[key];
        var vSrcEditor = self.jsoneditor.getEditor(vWatcher.srcpath);
        if (vSrcEditor) {
          var val = vSrcEditor.getValue();
          var vDestEditor = self.jsoneditor.getEditor(vWatcher.destpath);
          if (vDestEditor) {
            vDestEditor[vWatcher.callbackname](val);
          } else {
          }
        } else {
        }
      }
    }
  } else {
  }
},
setupWatchListeners: function() {
  var self = this;

  this.watched = {};
  if(this.schema.vars) {
    this.schema.watch = this.schema.vars;
  }
  this.watched_values = {};
  this.watch_listener = function() {
    if(self.refreshWatchedFieldValues()) {
      self.onWatchedFieldChange();
    }
  };

  this.register();
  if(this.schema.hasOwnProperty('watch')) {
    var path,path_parts,first,root,adjusted_path;

    for(var name in this.schema.watch) {
      if(!this.schema.watch.hasOwnProperty(name)) continue;
      path = this.schema.watch[name];

      if(Array.isArray(path)) {
        if(path.length<2) continue;
        path_parts = [path[0]].concat(path[1].split('.'));
      }
      else {
        path_parts = path.split('.');
        if(!self.theme.closest(self.container,'[data-schemaid="'+path_parts[0]+'"]')) path_parts.unshift('#');
      }
      first = path_parts.shift();

      if(first === '#') first = self.jsoneditor.schema.id || 'root';

      root = self.theme.closest(self.container,'[data-schemaid="'+first+'"]');
      if(!root) throw "Could not find ancestor node with id "+first;

      adjusted_path = root.getAttribute('data-schemapath') + '.' + path_parts.join('.');

      self.jsoneditor.watch(adjusted_path,self.watch_listener);

      self.watched[name] = adjusted_path;
    }
  }
  
  if(this.schema.previewTemplates) {
    this.preview_templates = {};
    for (var prev_tpl in this.schema.previewTemplates) {
      if (this.schema.previewTemplates.hasOwnProperty(prev_tpl)) {
        this.preview_templates[prev_tpl] = this.jsoneditor.compileTemplate(this.schema.previewTemplates[prev_tpl], this.template_engine);
      }
    }
  }
  
  if(this.schema.contentTemplate) {
    this.content_template = this.jsoneditor.compileTemplate(this.schema.contentTemplate, this.template_engine);
  }
  
  if(this.schema.headerTemplate) {
    this.header_template = this.jsoneditor.compileTemplate(this.schema.headerTemplate, this.template_engine);
  }
},

refreshWatchedFieldValues: function() {
  
  if(!this.watched_values) return; 

  var watched_refresh = {};
  var changed = false;
  var self = this;
  
  if(this.watched) {

    var val,editor;
    for(var path in this.watched) {

      if(!this.watched.hasOwnProperty(path)) continue;
      
      editor = self.jsoneditor.getEditor(this.watched[path]);
      
      val = editor? editor.getValue() : null;

      if(self.watched_values[path] !== val) changed = true;
      watched_refresh[path] = val;
    }
  }

  watched_refresh.self = this.getValue();
  if(this.watched_values.self !== watched_refresh.self) changed = true;
  
  this.watched_values = watched_refresh;

  return changed;
},
getWatchedFieldValues: function() {
  return this.watched_values;
},
updateHeaderText: function() {
  
  this.setTitle(this.getHeaderText());
},
X_updateHeaderText: function() {
  if(this.header) {
    
    if(this.header.children.length) {
      for(var i=0; i<this.header.childNodes.length; i++) {
        if(this.header.childNodes[i].nodeType===3) {
          this.header.childNodes[i].nodeValue = this.getHeaderText();
          break;
        }
      }
    }
    
    else {
      
      $setContent(this.header,this.getHeaderText());

    }
  }
},
updateContentText: function(content_text) {
  content_text = content_text || this.content_text || "undefined content_template";
  if((this.editortype == "string") || (this.editortype == "math4string")) {

    if (this.setValue4noChangeEvent) {
      this.setValue4noChangeEvent(content_text);
      this.refreshValue();
    } else {
      this.value = content_text + "";
      this.input.value = content_text + "";
      this.serialized = content_text + "";
      this.refreshValue();
    }
  }
},
getHeaderText: function(title_only) {
  if(this.header_text) return this.header_text;
  else if(title_only) return this.schema.title;
  else return this.getTitle();
},
onWatchedFieldChange: function() {
  var vars = {};
  var json_string = "";
  if (this.header_template ||
      this.content_template ||
      this.question_template ||
      this.description_template) {
        vars = this.getTemplateFieldValues();
        json_string = JSON.stringify(vars,null,4);
      }
  if(this.header_template) {

    var header_text = this.header_template(vars);

    if (header_text !== this.header_text) {
      this.header_text = header_text;
      this.updateHeaderText();
      this.notify();
      
    }
  }
  if (this.content_template) {
    
    var content_text = this.content_template(vars);
    if (content_text !== this.input.value ) {
      this.input.value = content_text;
    }
    if (content_text !== this.content_text) {
      this.content_text = content_text;
      
      this.updateContentText(content_text);
      
      this.notify();
      
    }
  }
  if (this.question_template) {
    
    var question_text = this.question_template(vars);
    if (question_text != this.schema.question) {
      this.schema.question = question_text;
      this.setQuestion(question_text);
    }
  }
  if (this.description_template) {
    
    var description_text = this.description_template(vars);
    if (description_text !== this.schema.description ) {
      this.schema.description = description_text;
      this.setDescription(description_text);
    }
  }
  if(this.link_watchers.length) {
    vars = this.getWatchedFieldValues();
    for(var i=0; i<this.link_watchers.length; i++) {
      this.link_watchers[i](vars);
    }
  }
},
get_options_schema: function(id4option,default_value) {
  return this.check_options_schema(id4option,default_value);
},
check_options_schema: function(id4option,default_value) {
  var vRet = default_value;
  if (this.schema) {
    if (this.schema.options) {
      if (this.schema.options.hasOwnProperty(id4option)) {
        vRet = this.schema.options[id4option];
      } else {
        vRet = default_value;
      }
      
    } else {
    }
  }
  return vRet;
},
check_options_global: function(id4option,default_value) {
  var vRet = $check_options(this.jsoneditor.options,id4option,default_value);
  return vRet;
},
check_options: function(id4option,default_value) {
  if (this.schema && this.schema.options) {
    
    if (this.schema.options.hasOwnProperty(id4option)) {
      
      return this.schema.options[id4option];
    } else {
      
      return this.check_options_global(id4option,default_value)
    };
  } else {
    
      return this.check_options_global(id4option,default_value)
  }
},
check_preview_visible: function(preview_options) {
  var is_visible = true;
  
  if (this.check_options_schema("hidden",false) === true) {
    is_visible = false;
  }
  
  if ($check_options(preview_options,"enable_preview",false) === true) {
    is_visible = true;
  }
  return is_visible;
},
container4dom:null,
preBuild: function() {

  if (this.schema.id4container) {
    var vNode = document.getElementById(this.schema.id4container);
    if (vNode) {
      this.container4dom = vNode;
    } else {
      console.warn("External editor container ['"+this.schema.id4container+"'] for '"+this.path+"' does not exist for editor '"+this.editortype+"'");
    }
  }
  var vTriggerTemplate = false;
  if (this.schema.headerTemplate) {
    vTriggerTemplate = true;
  }
  if (this.schema.contentTemplate) {
    vTriggerTemplate = true;
  }
  if (this.schema.questionTemplate) {
    vTriggerTemplate = true;
    if (this.schema.question) {
      this.schema.question += " - template";
    } else {
      this.schema.question = this.schema.questionTemplate;
    }
  }
  if (this.schema.descriptionTemplate) {
    vTriggerTemplate = true;
    if (this.schema.description) {
      this.schema.description += " - template";
    } else {
      this.schema.description = this.schema.descriptionTemplate;
    }
  }
  this.trigger_template_on_postbuild = true;
  
},
build: function() {

},
postBuild: function() {
  var self = this;
  if (this.check_options("disable_title",false) === true) {
    this.hide_title();
  } else {
    
  }
  var self = this;
  if (this.check_options_schema("enable_edit",true) === false) {
    
    this.hide_editor();
    this.editor_is_visible = false;
  } else {
    this.show_editor();
    this.editor_is_visible = true;
    
  }
  if (this.container_preview) {
  } else {
    if (this.container) {
      
    } else {
    }
  }
  
  this.check4container("postBuild");
  
  if (this.container_preview) {
    
  }
  if (this.preview_input) {
    
  }
  if (this.check_options_schema("hidden_question",false) === true) {
    this.hide_question();
  }
  if (this.check_options_schema("hidden_description",false) === true) {
    this.hide_description();
  }
  this.setupWatchListeners();
  this.addLinks();
  this.setValue(this.getDefault(), true);
  this.updateHeaderText();
  
  if (this.schema.headerTemplate) {
    this.header_template = this.jsoneditor.compileTemplate(this.schema.headerTemplate, this.template_engine);

    this.registerHeaderTemplate(self);
  }
  if (this.schema.questionTemplate) {
    this.question_template = this.jsoneditor.compileTemplate(this.schema.questionTemplate, this.template_engine);

    this.registerQuestionTemplate(self);
  }
  if (this.schema.descriptionTemplate) {
    this.description_template = this.jsoneditor.compileTemplate(this.schema.descriptionTemplate, this.template_engine);

    this.registerDescriptionTemplate(self);
  }

  this.register();
  if (this.schema.contentTemplate) {
    this.disable();
  }

  this.onWatchedFieldChange();

},
init_preview_options: function(preview_options) {
  
  preview_options = preview_options || {};
  var init_options = {
    "container_preview": this.preview_input,
    "enable_preview": true,
    "hidden": this.check_options("hidden",false),
    "hidden_preview": this.check_options("hidden_preview",false),
    "tpl_id": "default",
    "template":""
  };
  preview_options = $extend(init_options,preview_options);
  preview_options.template = "template for editor "+this.editortype+".init_preview_options("+this.path+")";
  return preview_options;
},
build_preview: function(preview_options,new_title) {

  var preview_holder = null;
  preview_options = preview_options || {};
  if (preview_options.container_preview) {
    preview_holder = preview_options.container_preview;
    if (!(preview_holder instanceof Element)) {
      
      console.warn('Preview node "preview_holder" should be a DOM instance of Element');
    }
  } else {
    if (this.container_preview) {
      preview_holder = this.container_preview;
    } else {
      if (this.preview_input) {
        preview_holder = this.preview_input;
      } else {
      }
      
    }
    if ((preview_holder instanceof Element)) {
      
    }
    preview_options.container_preview = preview_holder;
  }
  if (preview_holder) {
    var vOptions  = $cloneJSON(preview_options);
    vOptions.container_preview = preview_holder.id || "undefined-id";
    console.log(this.editortype + ".build_preview('"+this.path+"') options="+JSON.stringify(vOptions,null,4));
    
    var preview_title = this.get_preview_title(new_title,preview_options);
    preview_holder.appendChild(preview_title);
  }
  
},
create_container4preview: function(container) {
  container = container || this.container;
  var container_preview = null;
  if (container) {
    if (container.parentNode) {
      var parent = container.parentNode;
      var con_pre = this.get_div("create_container4preview");
      
      con_pre.innerHTML = "This is an array preview container test set in src/editor8_build_preview.js:829";
      parent.appendChild(con_pre);
      container_preview = con_pre;

    } else {
    }
  }
  return container_preview;
},
set_preview_container: function (preview_options) {
  preview_options = preview_options || {};
  var preview_container = null;
  if (!this.container_preview) {
    console.warn(this.editortype + ".set_preview_container('"+this.path+"') this.container_preview is missing");
    this.container_preview = document.createElement("div");
    this.container_preview.id = this.create_unique_id();
    if (this.container) {
      this.editor_holder.appendChild(preview_container);
    } else {
    }
  } else {
    var container = this.container_preview;
    if (preview_options && preview_options["container_preview"]) {
      console.log(this.editortype + ".build_preview('"+this.path+"') called set_preview_container('" + this.path +"') and options.container_preview exists.");
      container = preview_options["container_preview"];
      container.style.position = 'relative';
      if (!container.id) {
        container.id = this.get_unique_id();
      }
    } else {
      console.log(this.editortype + ".build_preview() called set_preview_container('" + this.path +"') use default preview container of editor 'this.container_preview'.");
      
      if (!this.container_preview.id) {
        this.container_preview.id = this.get_unique_id();
        this.container_preview.id = this.container_preview.id;
        console.log("this.container_preview.id is missing create a new DOM node id");
      }
      
      container = this.container_preview;
      if (this.check_preview_visible(preview_options) === true) {
        container.style.display = "";
      } else {
        container.style.display = "none";
      }
    }
    
  };
  preview_options["container_preview"] = preview_container;
  return preview_options;
},
build_value_preview: function (preview_options,new_title) {

  preview_options = preview_options || {};
  
  var container = null;
  if (preview_options && preview_options.container_preview) {
    container = preview_options.container_preview;
  } else {
    if (this.container_preview) {
      container = this.container_preview;
    } else {
      console.error("ERROR["+this.path+"]: "+this.editortype+".container_preview is undefined ");
    }
  }

  console.log(this.editortype + ".build_value_preview('"+this.path+"') called for value ");
  var preview_value = this.get_preview_value(new_title,preview_options);
  if (container) {
    container.appendChild(preview_value);
  } else {
    this.preview_value = preview_value;
  }
},
get_preview_value: function(title,pOptions) {
  var pOptions = pOptions || {};
  var self = this;

  var value_preview = this.theme.getTable();
  value_preview.style.width="100%";
  var value_row   = this.theme.getTableRow();
  var button_cell = this.theme.getTableCell();
  var name_cell   = this.theme.getTableCell();
  var value_cell = this.theme.getTableCell();

  if ($check_options(pOptions,"enable_preview_edit_button",false) === true) {
    button_cell.style.display = "";
  } else {
    button_cell.style.display = "none";
  }

  this.preview_edit_holder = button_cell;
  value_row.appendChild(button_cell);
  value_row.appendChild(name_cell);
  value_row.appendChild(value_cell);

  button_cell.style.width="6%";

  if (pOptions && pOptions.click_preview_edit) {
    if (typeof pOptions.click_preview_edit === 'function') {
      this.preview_edit_button = this.getButton('','edit',"Edit");
      this.preview_edit_button.addEventListener('click',function(e) {
        self.show();
        self.hide_preview();
        e.preventDefault();
        e.stopPropagation();
      });
      button_cell.appendChild(this.preview_edit_button);
    } else {
    }
  }

  name_cell.style.width="16%";
  var name = document.createElement("b");
  $setContent(name,this.getTitle()+": ");
  name_cell.appendChild(name);

  $setContent(value_cell,this.getValue());

  value_preview.appendChild(value_row);
  
  return value_preview;

},
get_preview_title: function(title, pOptions) {
  var self = this;
  var pOptions = pOptions || {};
  console.log(this.editortype +".get_preview_title("+this.path+")");
  this.preview_edit_button = this.getButton('','edit',"Edit");
  this.preview_edit_button.addEventListener('click',function(e) {
    self.show4dom(self.container,"show editor with id='"+self.container.id+"'");
    self.hide_preview();
    e.preventDefault();
    e.stopPropagation();
  });
  var header_span    = document.createElement('span');
  var header_preview = document.createElement('span');
  $setContent(header_preview," "+(title || this.getTitle()));
  header_span.appendChild(header_preview);

  var button_holder = this.theme.getHeaderButtonHolder();
  
  header_span.appendChild(button_holder);
  var title_preview = this.theme.getHeader(header_span);
  return title_preview;
},
add_collapse_button: function (ids) {
  var self = this;

  if (ids) {
    this.collapsed = false;
    this[ids.button_id] = this.getButton('','collapse',this.translate('button_collapse'));
    this[ids.controls_id].appendChild(  this[ids.button_id]);
    this[ids.button_id].addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      if(self.collapsed) {
        self[ids.holder_id].style.display = '';
        self.collapsed = false;
        self.setButtonText(self[ids.button_id],'','collapse',self.translate('button_collapse'));
      } else {
        self[ids.holder_id].style.display = 'none';
        self.collapsed = true;
        self.setButtonText(self[ids.button_id],'','expand',self.translate('button_expand'));
      }
    });

    if(this.options.collapsed) {
        $trigger(this[ids.button_id],'click');
    }

    if (this.check_options("disable_collapse",false) === true) {
        
        this[ids.button_id].style.display = 'none';
    };
  } else {
  }
},
createCheckbox4Include: function() {
  this.checkbox4include = this.theme.getCheckbox();

  this.checkbox4include.checked = this.check_options_schema("checkbox4include",this.default4include.checked);
  
  return this.checkbox4include;
},
getButton: function(text, iconlist, title) {

    var icon_id = "";
    if (iconlist) {
      icon_id = iconlist.replace(" ","-");
    };
    var btnClass = 'json-editor-btn-'+icon_id;
    var icon4dom =this.getIconList(iconlist);
    if(!icon4dom && title) {
      text = title;
      title = null;
    }

    var btn = this.theme.getButton(text, icon4dom, title);
    btn.className += ' ' + btnClass + ' ';
    return btn;
  },
  setButtonText: function(button, text, iconlist, title) {
    
    var icon4dom =this.getIconList(iconlist);

    if(!icon4dom && title) {
      text = title;
      title = null;
    }

    return this.theme.setButtonText(button, text, icon4dom, title);
  },
  getButtons4Title: function (opt4cb,editor4key) {
    var self = this;
    var preview_is_visible = this.preview_is_visible;
    var key4property = "";
    editor4key = editor4key || this;
    if (opt4cb) {
      key4property = opt4cb.key;
      preview_is_visible =  opt4cb.preview_is_visible;
    } else {
      opt4cb = {}
    };

    var b0l,b0s,b1p,b2pe,b3e,b4x,b5q,b6d,b7l,b8s;
    var btns = [];

    if (this.check_options_schema("enable_load_file_button",false) === true) {
      this.input_file_button = this.theme.getInputFileButton("BINARY File Load");
      this.input_file_button.addEventListener('change', function (e) {
        console.log("Event 'onchange' - Input JSON File");
        
        const binary_file = self.input_file_button.files[0];
        const reader4binary = new FileReader();

        reader4binary.addEventListener("load", function () {

          var mimetype = "mime-undefined";
          var raw = null;
          if (reader4binary.result) {
            self.setDataURL(reader4binary.result,binary_file.name);
            console.log("Load file '"+binary_file.name+"' with header load button");
          } else {
            console.warn("No file loaded - load operation failed");
          };
          console.log("Load and store Base64 encoded JSON in Editor '"+self.path+"' ");

        }, false);

        if (binary_file) {
          reader4binary.readAsDataURL(binary_file);
        }
      });
      
      b0l = this.getButton('','load',this.translate('button_load'));
      btns.push(b0l);
      b0l.addEventListener('click', function (e) {
        console.log("Load binary file into editor - path: '" + self.path + "'");
        self.input_file_button.click();
      });
    }
    
    if (this.check_options_schema("enable_save_file_button",false) === true) {
      
      b0s = this.getButton('','save',this.translate('button_save'));
      btns.push(b0s);
      b0s.addEventListener('click',function(e) {
        self.save2file();
        
        e.preventDefault();
        e.stopPropagation();
      });
    }
    
    if (this.check_options_schema("enable_preview_button",false) === true) {
      
      b1p = this.getButton('','eye',this.translate('button_preview'));
      b1p.setAttribute("key4property",opt4cb.key);
      btns.push(b1p);
      
      b1p.addEventListener('click',function(e) {
        console.log(self.editortype+".preview_button('"+self.path+"') click PREVIEW");
        if (editor4key.preview_is_visible === true) {
          
          console.log(self.editortype+".preview_button('"+self.path+"') PREVIEW VISIBLE > HIDE");
          if (key4property) {
            opt4cb.key = e.target.getAttribute("key4property");
            editor4key.apply4children("hide_preview",opt4cb);
          } else {
            self.hide_preview();
          }

        } else {
          
          console.log(self.editortype+".preview_button('"+self.path+"') PREVIEW HIDDEN > SHOW");
          if (key4property) {
            opt4cb.key = e.target.getAttribute("key4property");
            editor4key.apply4children("show_preview",opt4cb);
            editor4key.apply4children("update_preview",opt4cb);
          } else {
            self.show_preview();
            self.update_preview();
          }
          
        };
        e.preventDefault();
        e.stopPropagation();
      });
    
  }
    if (this.check_options_schema("enable_preview_edit_button",false) === true) {

      b2pe = null;
      if (editor4key.check_options_schema("enable_edit",true) === true) {
        
        b2pe = editor4key.getButton('','edit',this.translate('button_edit'));
      } else {
        
        b2pe = editor4key.getButton('','eye',this.translate('button_preview'));
      }

      b2pe.setAttribute("key4property",opt4cb.key);
      btns.push(b2pe);
      
      b2pe.addEventListener('click',function(e) {
        
        if (editor4key.preview_is_visible === true) {
          if (key4property) {
            opt4cb.key = e.target.getAttribute("key4property");
            editor4key.apply4children("hide_preview",opt4cb);
            editor4key.preview_is_visible = false;
            editor4key.apply4children("show_editor",opt4cb);
            editor4key.editor_is_visible = true;
          } else {
            self.hide_preview();
            self.preview_is_visible = false;
            self.show_editor();
            self.editor_is_visible = true;
          }

          editor4key.setButtonText(b2pe,'','eye',self.translate('button_preview'));
        } else {
          
          console.log(self.editortype+".preview_edit_button('"+self.path+"') PREVIEW ON - EDIT OFF");
          if (key4property) {
            opt4cb.key = e.target.getAttribute("key4property");
            editor4key.apply4children("show_preview",opt4cb);
            editor4key.apply4children("update_preview",opt4cb);
            editor4key.preview_is_visible = true;
            editor4key.apply4children("hide_editor",opt4cb);
            editor4key.editor_is_visible = false;
          } else {
            self.show_preview();
            self.update_preview();
            self.preview_is_visible = true;
            self.hide_editor();
            self.editor_is_visible = false;
          }

          self.setButtonText(b2pe,'','edit',self.translate('button_edit'));
        };
        e.preventDefault();
        e.stopPropagation();
      });
      
    };

    if (this.check_options_schema("enable_edit_button",false) === true) {

      b3e = this.getButton('','edit',this.translate('button_edit'));
      b3e.setAttribute("key4property",opt4cb.key);
      btns.push(b3e);
      
      b3e.addEventListener('click',function(e) {
        console.log(self.editortype+".edit_button('"+self.path+"') click EDIT");
        if (editor4key.editor_is_visible == true) {
          console.log(self.editortype+".edit_button('"+self.path+"') HIDE EDIT");
          if (key4property) {
            opt4cb.key = e.target.getAttribute("key4property");
            editor4key.apply4children("hide_editor",opt4cb);
            editor4key.editor_is_visible = false;
          } else {
            self.hide_editor();
            self.editor_is_visible = false;
          }
        } else {
          console.log(self.editortype+".edit_button('"+self.path+"') SHOW EDIT");
          if (key4property) {
            opt4cb.key = e.target.getAttribute("key4property");
            editor4key.apply4children("show_editor",opt4cb);
            editor4key.editor_is_visible = true;
          } else {
            self.show_editor();
            self.editor_is_visible = true;
          }
        };
        e.preventDefault();
        e.stopPropagation();
      });
      
    };

    if (this.check_options_schema("enable_execute_button",false) === true) {

        var execEditor = null;
        if (typeof this["execute"] === "function") {
          execEditor = this;
        } else {
          if (this.parent && (typeof this.parent["execute"] === "function")) {
            execEditor = this.parent;
          }
        }
        if (execEditor) {
          var vLabel = this.translate('button_execute');
          b4x  = this.getButton('','forward',vLabel);
          btns.push(b4x);
          b4x.addEventListener('click',function(e) {
            
            execEditor.execute();
            e.preventDefault();
            e.stopPropagation();
          });
        } else {
          
          console.warn("Editor '"+this.editortype+"' ["+this.path+"]: execute button enabled, but the editor and parent editor has no function 'execute()'");
        }
    };

    var vShowQuestionButton = this.check_options_schema("enable_question_button",true);
    
    if (vShowQuestionButton === true) {
        
        var vQuestion = this.getQuestion();
        if (vQuestion && (vQuestion!= "")) {
          var vQuestionLabel = this.translate('label_question');
          b5q  = this.getButton('?','',' ? ');
          b5q.setAttribute("key4property",opt4cb.key);
          btns.push(b5q);
          b5q.addEventListener('click',function(e) {
            
            if (key4property) {
              opt4cb.key = e.target.getAttribute("key4property");
              editor4key.apply4children("toggle_question",opt4cb);
            } else {
              self.toggle_question();
            }
            e.preventDefault();
            e.stopPropagation();
          });
        } else {
        }
    };

    if (this.check_options_schema("enable_description_button",true) === true) {
        
        var vDescription = this.getDescription();
        if (vDescription && (vDescription!= "")) {
          var vDescriptionLabel = this.translate('label_desrcription');
          b6d  = this.getButton('','info',vDescriptionLabel);
          b6d.setAttribute("key4property",opt4cb.key);
          btns.push(b6d);
          b6d.addEventListener('click',function(e) {
            
            if (key4property) {
              opt4cb.key = e.target.getAttribute("key4property");
              editor4key.apply4children("toggle_description",opt4cb);
            } else {
              self.toggle_description();
            }
            e.preventDefault();
            e.stopPropagation();
          });
        } else {
        }
    };

    var cb4i = this.createCheckbox4Include();
    cb4i.setAttribute("key4property",opt4cb.key);
    
    cb4i.checked = this.check_options("checkbox4include",this.default4include.checked);
    cb4i.addEventListener('change',function(e) {
      var checkbox = event.target;
      if (key4property) {
        opt4cb.key = e.target.getAttribute("key4property");
        editor4key.apply4children("setCheckbox4Include",opt4cb,checkbox.checked);
      };
      if (checkbox.checked) {
        
      } else {
        
      }
    });
    btns.push(cb4i);
    editor4key.checkbox4include = cb4i;
    if (editor4key.check_options_schema("enable_checkbox4include",this.default4include.visible) === true) {
      editor4key.show_checkbox4include();
    } else {
      editor4key.hide_checkbox4include();
    };
    return btns;
  },
  initValue4Backup: function () {
    if (this.checkbox4include && (!this.checkbox4include.checked == true)) {
      
      var init_value = "";
      this.setValue(init_value);
    }
  },
  getFilename4SaveJSON: function () {
    var self = this;
    var vFilename = "undefined_filename"; 
    if (self.options && self.options.json_filename ) {
        vFilename = self.options.json_filename;
    } else {
        vFilename = '';
        vFilename = self.path + ""; 

        vFilename = vFilename.replace(/[^a-zA-Z0-9]/g,"_");
        vFilename = vFilename.replace(/root/,"data");
        vFilename += ".json";
    };
    return vFilename;
  },
  addButtons4LoadSave:function(pControls) {
    var self = this;
    var vControls = pControls || self.controls

    this.input_json_button = this.theme.getInputFileButton("JSON File Load");
    this.input_json_button.addEventListener('change', function (e) {
      console.log("Event 'onchange' - Input JSON File");
      
      const json_file = self.input_json_button.files[0];
      const reader4json = new FileReader();

      reader4json.addEventListener("load", function () {

        var mimetype = "json-undefined";
        var raw = null;
        if (reader4json.result) {
          
          var parts = reader4json.result.split(';base64,');
          mimetype = parts[0].split(":")[1];
          raw = window.atob(parts[1]);

          console.log("Load file '"+json_file.name+"' with MIME-type: '"+mimetype+"'");
        };
        console.log("Load and store Base64 encoded JSON in Editor '"+self.path+"' MIME-Type='"+mimetype+"'");
        if ( (mimetype.indexOf("application/json") >= 0) ||
             (mimetype.indexOf("text/") >=0) ) {
            if (raw) {
              var vJSON = null;
              try{
                vJSON = JSON.parse(raw);

              } catch(e) {
                alert("JSON Parsing Error: " + e.message)
              }
              if (vJSON) {
                if (self.editortype == "signature") {
                  self.setValue4JSON(vJSON);
                } else {
                  self.setValue(vJSON);
                }
              }

            }
          } else {
            console.error("Ignored file format for MIME type '"+mimetype+"'");
          }
      }, false);

      if (json_file) {
        reader4json.readAsDataURL(json_file);
      }
    });
    
    this.load_json_button = this.getButton('','load',"Load JSON");
    
    this.load_json_button.addEventListener('click', function (e) {
      console.log("Load JSON into JSON Editor - path: '" + self.path + "'");
      self.input_json_button.click();
    });
    if (this.check_options_schema("enable_load_button",false) === true) {
      this.load_json_button.style.display = ""
    } else {
      this.load_json_button.style.display = "none"
    }
    vControls.appendChild(this.input_json_button);
    vControls.appendChild(this.load_json_button);
    
    this.save_json_button = this.getButton('','save','Save JSON');
    this.save_json_button.addEventListener('click', function (e) {
      var dataURL = "undefined JSON at '" + this.path + "'";
      var vFilename = self.getFilename4SaveJSON();
      var vContent = JSON.stringify(self.getValue(),null,4);
      
      self.download_text(vFilename,vContent);
      console.log("JSON file '" + vFilename + "' saved");
    });
    if (this.check_options_schema("enable_save_button",false) === true) {
      this.save_json_button.style.display = ""
    } else {
      this.save_json_button.style.display = "none"
    }
    vControls.appendChild(this.save_json_button);

  },
  loadJSON: function() {
    this.input_json_button.click()
  },
  saveJSON: function() {
    this.save_json_button.click()
  },
addLinks: function() {
  
  if(!this.no_link_holder) {
    this.link_holder = this.theme.getLinksHolder();
    this.container.appendChild(this.link_holder);
    if(this.schema.links) {
      for(var i=0; i<this.schema.links.length; i++) {
        this.addLink(this.getLink(this.schema.links[i]));
      }
    }
  }
},
addLink: function(link) {
  if(this.link_holder) this.link_holder.appendChild(link);
},
getLink: function(data) {
  var holder, link;

  var mime = data.mediaType || 'application/javascript';
  var type = mime.split('/')[0];

  var href = this.jsoneditor.compileTemplate(data.href,this.template_engine);

  var download = null;
  if(data.download) download = data.download;

  if(download && download !== true) {
    download = this.jsoneditor.compileTemplate(download, this.template_engine);
  }

  if(type === 'image') {
    holder = this.theme.getBlockLinkHolder();
    link = document.createElement('a');
    link.setAttribute('target','_blank');
    var image = document.createElement('img');

    this.theme.createImageLink(holder,link,image);

    this.link_watchers.push(function(vars) {
      var url = href(vars);
      link.setAttribute('href',url);
      link.setAttribute('title',data.rel || url);
      image.setAttribute('src',url);
    });
  }
  
  else if(['audio','video'].indexOf(type) >=0) {
    holder = this.theme.getBlockLinkHolder();

    link = this.theme.getBlockLink();
    link.setAttribute('target','_blank');

    var media = document.createElement(type);
    media.setAttribute('controls','controls');

    this.theme.createMediaLink(holder,link,media);

    this.link_watchers.push(function(vars) {
      var url = href(vars);
      link.setAttribute('href',url);
      link.textContent = data.rel || url;
      media.setAttribute('src',url);
    });
  }
  
  else {
    link = holder = this.theme.getBlockLink();
    holder.setAttribute('target','_blank');
    holder.textContent = data.rel;

    this.link_watchers.push(function(vars) {
      var url = href(vars);
      holder.setAttribute('href',url);
      holder.textContent = data.rel || url;
    });
  }

  if(download && link) {
    if(download === true) {
      link.setAttribute('download','');
    }
    else {
      this.link_watchers.push(function(vars) {
        link.setAttribute('download',download(vars));
      });
    }
  }

  if(data.class) link.className = link.className + ' ' + data.class;

  return holder;
},

isEditor4SingleValue: function () {
  var isSingleValue = true;
  switch (this.editortype) {
    case "object":
      isSingleValue = false;
    break;
    case "array":
      isSingleValue = false;
    break;
    case "largearray":
      isSingleValue = false;
    break;
    case "multiselect":
      isSingleValue = false;
    break;
    case "cas":
      isSingleValue = false;
    break;
    case "cascommand":
      isSingleValue = false;
    break;
    case "geolocation":
      isSingleValue = false;
    break;
    case "langselect":
      isSingleValue = false;
    break;
    default:
      var val = this.getValue();
      if (typeof val == "object") {
        isSingleValue = false;
      };
  }
  
  return isSingleValue;
},
isObject4Values: function () {
  var isObjectValue = false;
  switch (this.editortype) {
    case "object":
      isObjectValue = true;
    break;
    case "cas":
      isObjectValue = true;
    break;
    case "cascommand":
      isObjectValue = true;
    break;
    case "geolocation":
      isObjectValue = true;
    break;
    default:
      isObjectValue = false;
  }
  
  return isObjectValue;
},
getSelfVars4Editor: function() {
  var vars;
  if (this.isObject4Values() === true) {
    vars = {};
    var editor_list = this.editors;
    $each(editor_list, function(key,editor) {
      if (editor.isEditor4SingleValue() === true) {

        vars.self[key] = editor.getValue();
      }
    });
  }
  return vars;
},
getTemplateVars4Editor: function() {
  var self = this;
  var vars = {
    "editortype":  this.editortype,
    "path": this.path,
    "key": this.key,
    "question":  this.getQuestion(),
    "description":  this.getDescription(),

    "title": this.getTitle()
  };
  
  vars.i = this.key;
  vars.i0 = (this.key*1);
  vars.L1 = 0;
  vars.S1 = 0;

  if (this.editortype == "largearray") {
      vars.i = this.getValue().current;
      vars.i0 = ((vars.i)*1);
  }
  vars.i1 = vars.i0 + 1;
  vars.s1 = vars.i1;
  if (this.isEditor4SingleValue() === true) {
      vars.self = this.getValue();
  } else {
      if (this.isObject4Values(this.editortype) === true) {
        vars.self = {};
        var editor_list = this.editors;
        $each(editor_list, function(key,editor) {
          if (editor.isEditor4SingleValue() === true) {

            vars.self[key] = editor.getValue();
          }
        });
      }
  }
  
  return vars;
},
registerTemplates: function () {
  
  var vSchema = this.schema;
  var keyarray = ["Header","Question","Description"];
  if (this.parent && this.parent.editortype && this.parent.editortype === "array") {
    
    keyarray = ["Question","Description"];
  }
  if (vSchema.outputTemplates) {
    for (var tplid in vSchema.outputTemplates) {
      if (vSchema.outputTemplates.hasOwnProperty(tplid)) {
        
        this.output_templates[tplid] = this.jsoneditor.compileTemplate(vSchema.outputTemplates[tplid], this.template_engine);
      }
    }
  }
  if (vSchema.hasOwnProperty("editorid4select")) {
    if (vSchema.editortype == "select4template") {
      var self = this;
      this.registerTitleSelector(self);
    } else {
      console.error("A selector for the template ID 'editorid4select' is only valid for editors of type 'select4template'");
    }
  }
  
  for (var i = 0; i < keyarray.length; i++) {
    var vTplID = keyarray[i];
    vTplID = vTplID.toLowerCase();
    
    var key4tpl = vTplID+"Template";
    if (vSchema.hasOwnProperty(key4tpl)) {
      
      this[vTplID+"_template"] = this.jsoneditor.compileTemplate(this.schema[key4tpl], this.template_engine);
      
      var self = this;
      this["register"+keyarray[i]+"Template"](self);
    } else {
    }
  }

},
getParentFieldValues: function() {
  var vThis = this;
  var vars = {};
  if (vThis.parent) {
    
    if (this.parent.getTemplateVars4Editor) {
      vars = this.parent.getTemplateVars4Editor();
    };
    if (this.parent.getWatchedFieldValues) {
      
      var parent_vars = (vThis.parent.getWatchedFieldValues() || {});
      parent_vars.title = vThis.parent.getTitle();
      if (parent_vars) {
        for (var variable in parent_vars.self) {
          if (parent_vars.self.hasOwnProperty(variable)) {
            vars[variable] = parent_vars.self[variable];
          }
        }
      } else {
        alert("Editor."+this.editortype+"['"+this.path+"'] has no parent_vars  ");
      }
    } else {
      alert("Editor."+this.editortype+"['"+this.path+"'] has no parent ");
    }
    if (vThis.parent.parent) {
      vars.parent = vThis.parent.getParentFieldValues();
    }
  }
  return vars;
},
getTemplateFieldValues: function() {
  var self = this;
  var vars_init = self.getTemplateVars4Editor();
  var vars = $extend(self.getWatchedFieldValues(),vars_init);
  var vars_chain = [vars];
  var vCurrentEditor = self;
  var vCurrentVars = vars;
  while (vCurrentEditor.parent) {

    if (vCurrentEditor.parent.getTemplateVars4Editor) {
      
      vCurrentVars.up = vCurrentEditor.parent.getTemplateVars4Editor();

      vCurrentVars = vCurrentVars.up;
      vars_chain.push(vCurrentVars);
    }
    
    var vCurrentS1 = "";
    var vDot = "";
    
    var chain_length = vars_chain.length;
    
    var vS1 = 0;
    for (var i = chain_length-1; i >= 0; i--) {
      if (vars_chain[i].i1) {

        vCurrentS1 += vDot + vars_chain[i].i1;
        vDot = "."
      }
      if (vars_chain[i].editortype == "array") {
        vS1++; 
      }
      vars_chain[i].S1 = vS1; 
      vars_chain[i].s1 = vCurrentS1;
      vars_chain[i].L1 = chain_length - i; 
    }
    vCurrentEditor = vCurrentEditor.parent;
  }
  
  return vars;
},
get_template4id: function(pTplID) {
  var template = null;
  if (pTplID) {
    if (this.schema && this.schema.outputTemplates && this.schema.outputTemplates[pTplID]) {
      template = this.schema.outputTemplates[pTplID];
    } else {
      template = "Default Template for path={{path}} with title {{title}} for Editor "+this.editortype+"";
      console.log("Template with ID=["+pTplID+"] does not exist! Use default generated default template");
    }
  } else {
  }
  return template;
},
replace_string: function (pString,pSearch,pReplace) {
      	var vString = pString || "";
      	var vSearch = pSearch || "";
      	var vReturnString = '';
      	if (typeof(pString) != "string") {
      		pString = "";
      	} else if (vSearch == "") {
      	} else if (vString != '') {
      		pString = vString;
      		var vHelpString = '';
          var vN = vString.indexOf(pSearch);
      		while (vN >= 0) {
      			if (vN > 0)
      				vReturnString += pString.substring(0, vN);
      				vReturnString += pReplace;
              if (vN + pSearch.length < pString.length) {
      					pString = pString.substring(vN+pSearch.length, pString.length);
      				} else {
      					pString = ''
      				};
      				vN = pString.indexOf(pSearch);
      		};
      	};
      	return vReturnString + pString;
},
  destroy4element: function (pNodeID) {
    var self = this;
    if (self[pNodeID] && self[pNodeID].parentNode) {
      self[pNodeID].parentNode.removeChild(self[pNodeID]);
    }
  },
  destroy: function() {
    var self = this;
    this.unregister(this);
    $each(this.watched,function(name,adjusted_path) {
      self.jsoneditor.unwatch(adjusted_path,self.watch_listener);
    });
    this.watched = null;
    this.watched_values = null;
    this.watch_listener = null;
    this.header_text = null;
    this.header_template = null;
    this.value = null;
    this.destroy4element("preview_edit_button");
    this.destroy4element("container_preview");
    this.destroy4element("preview_input");
    this.destroy4element("search_button_controls");
    this.destroy4element("search_keyword_controls");
    this.destroy4element("search_settings_controls");
    this.destroy4element("search_close_controls");
    this.destroy4element("editor_load_button");
    this.destroy4element("editor_input_file");
    this.destroy4element("editor_save_button");
    this.destroy4element("checkbox4include");
    this.destroy4element("header");
    this.destroy4element("header4title");
    this.destroy4element("");
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.main_holder = null;
    this.preview_holder = null;
    this.container = null;
    this.container_preview = null;
    this.jsoneditor = null;
    this.schema = null;
    this.path = null;
    this.key = null;
    this.parent = null;
  }

});
JSONEditor.defaults.editors["null"] = JSONEditor.AbstractEditor.extend({
  editortype: "null",
  getValue: function() {
    return null;
  },
  setValue: function() {
    this.onChange();
  },
  getNumColumns: function() {
    return 2;
  }
});
JSONEditor.defaults.editors.string = JSONEditor.AbstractEditor.extend({
  editortype: "string",
  editor4js: "-",
  editorselect:[
    "ace",
    "epiceditor",
    "sceditor",
    "textarea"
  ],
  scedfmt:[
    'html',
    'xhtml',
    'mediawiki',
    'bbcode'
  ],
  acefmt:[
      'actionscript',
      'batchfile',
      'bbcode',
      'c',
      'c++',
      'cpp',
      'c_cpp',
      'coffee',
      'csharp',
      'css',
      'dart',
      'django',
      'ejs',
      'erlang',
      'golang',
      'groovy',
      'handlebars',
      'haskell',
      'haxe',
      'html',
      'ini',
      'jade',
      'java',
      'javascript',
      'json',
      'latex',
      'less',
      'lisp',
      'lua',
      'makefile',
      'markdown',
      'matlab',
      'mediawiki',
      'mysql',
      'objectivec',
      'pascal',
      'perl',
      'pgsql',
      'php',
      'python',
      'r',
      'ruby',
      'sass',
      'scala',
      'scss',
      'smarty',
      'sql',
      'stylus',
      'svg',
      'twig',
      'vbscript',
      'xml',
      'yaml'
  ],
  ext4fmt:{
      'actionscript':'as',
      'batchfile':'bat',
      'bbcode':'bbc',
      'c++':'cpp',
      'cpp':'cpp',
      'c_cpp':'cpp',
      'coffee':'coffee.js',
      'csharp':'c',
      'dart':'dart',
      'django':'dj',
      'ejs':'ejs',
      'erlang':'erlang',
      'golang':'go',
      'groovy':'grov',
      'handlebars':'handlebars.tpl',
      'haskell':'hask',
      'haxe':'haxe',
      'html':'html',
      'ini':'ini',
      'jade':'jade',
      'java':'java',
      'javascript':'js',
      'json':'json',
      'latex':'tex',
      'less':'less',
      'lisp':'lisp',
      'lua':'lua',
      'makefile':'make',
      'markdown':'md',
      'matlab':'mlab',
      'mediawiki':'wiki',
      'mysql':'sql',
      'objectivec':'obc',
      'pascal':'pas',
      'perl':'pl',
      'pgsql':'qgsql',
      'php':'php',
      'python':'py',
      'r':'r',
      'ruby':'ruby',
      'sass':'sass',
      'scala':'scala',
      'scss':'scss',
      'smarty':'smrt',
      'sql':'sql',
      'stylus':'sty',
      'svg':'svg',
      'twig':'twig',
      'vbscript':'vbs',
      'xml':'xml',
      'yaml':'yaml'
  },
  get_extension4fmt: function (fmt) {
    var ext = "json";
    if (this.ext4fmt[fmt]) {
      ext = this.ext4fmt[fmt];
    };
    return ext;
  },
  register: function() {
    this._super();
    if(!this.input) return;
    
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    
  },
  build_preview: function(options,new_title) {
    this.build_value_preview(options,new_title);
  },
  show_preview:function () {

    var self = this;
    if (self.check_options_schema("hidden",false) == false) {
      this.preview_is_visible = true;
      
      this.show4id(this.preview_id,"");
      this.update_preview();
    }
  },
  hide_preview:function () {

    var self = this;
    if (this.preview_input) {
      
      if (!self.preview_id) {
        self.preview_id = self.preview_input.id;
      }
      self.hide4id(self.preview_id,"none");

      this.preview_is_visible = false;
    } else {
      
      console.warn("CALL: hide_preview() - editor["+self.path+"].preview_input does not exist. src/editors/string.js:77");
    }
  },
  show_editor:function () {
    var self = this;
    
    if (this.input_element_id) {
      this.show4id(this.input_element_id,this.editortype+".show_editor(id='"+self.input_element_id+"','"+this.path+"')");
    } else {
      if (self.input) {
        this.show4dom(self.input,"src/editors/string.js:188 - undefined editor input ID");
      }
    }
    this.editor_is_visible = true;
    if (this.source_code == true) {
      this.show4dom(this.editor_load_button,"editor_load_button","");
      this.show4dom(this.editor_save_button,"editor_save_button","");
      this.show4dom(this.edit_filename4save,"edit_filename4save","");
    }
    if (this.input_type === 'textarea') {
      this.show4dom(this.input,"show_editor('textarea')","");
    }

  },
  hide_editor:function () {
    var self = this;
    if (this.input_element_id) {
      this.hide4id(this.input_element_id,this.editortype+".hide_editor(id='"+this.input_element_id+"','"+this.path+"')");
    } else {
      if (this.input) {
        this.hide4dom(this.input);
      } else {
      }
    }
    this.editor_is_visible = false;
    if (this.source_code == true) {
      this.show4dom(this.editor_load_button,"editor_load_button","none");
      this.show4dom(this.editor_save_button,"editor_save_button","none");
      this.show4dom(this.edit_filename4save,"edit_filename4save","none");
    };
    if (this.input_type === 'textarea') {
      this.hide4dom(this.input,"hide_editor('textarea')","none");
    }
  },
  toggle_editor:function () {

    if (this.editor_is_visible == true) {
      this.hide_editor();
      this.editor_is_visible = false;
    } else {
      this.show_editor();
      this.editor_is_visible = true;
    };
  },

  setValue: function(value,initial,from_template) {
    var changed = this.setValue4noChangeEvent(value,initial,from_template);
    this.onChange(changed);
  },
  setValue4noChangeEvent: function(value,initial,from_template) {
    var self = this;

    if(this.template && !from_template) {
      return;
    }

    if(value === null || typeof value === 'undefined') value = "";
    else if(typeof value === "object") value = JSON.stringify(value);
    else if(typeof value !== "string") value = ""+value;

    if(value === this.serialized) return;

    var sanitized = this.sanitize(value);
    if (this.input) {
      if (this.input.value === sanitized) {
        return ;
      };
    } else {
      console.warn("DOM input element in 'string' editor not defined path='"+(this.path || "undef4path")+"'");
      return ;
    };
    this.input.value = sanitized;

    if (this.editor4js === "sceditor") {
      var instance = sceditor.instance(this.sceditor_textarea);
      if (instance) {
        var content = " "+instance.getValue();
        
        instance.setValue(sanitized);
      } else {
        console.log("sceditor.js:155 - "+this.editortype+".setValue4noChangeEvent('"+this.path+"') SCEditor is missing")
      }

    } else if (this.editor4js === "epiceditor") {
      this.epiceditor.importFile(null,sanitized);
    } else if (this.editor4js === "ace") {
      this.ace_editor.setValue(sanitized);
    }

    var changed = from_template || this.getValue() !== value;

    this.refreshValue();

    if(initial) this.is_dirty = false;
    else if(this.jsoneditor.options.show_errors === "change") this.is_dirty = true;

    if(this.adjust_height) this.adjust_height(this.input);

    return changed;
  },
  getNumColumns: function() {
    
    var min = Math.ceil(Math.max(this.getTitle().length,this.schema.maxLength||0,this.schema.minLength||0)/5);
    var num;

    if(this.input_type === 'textarea') {
      num = 12;
    } else if (this.editor4js === "sceditor") {
      num = 12;
      
    } else if (this.editor4js === "ace") {
      num = 12;
    } else if (['text','email'].indexOf(this.input_type) >= 0)
    {
      num = 4;
    } else {
      num = 2;
    }

    return Math.min(12,Math.max(min,num));
  },
  render_preview: function(options) {
    
  },
  preBuild: function() {
    this._super();
    if (!this.schema.options) {
      this.schema['options'] = {};
    };
    if (this.schema.format) {
      var fmt = this.schema.format;
      if (this.ext4fmt[fmt]) {
        if(!this.schema.options['extension4file']) {
          this.schema.options['extension4file'] = this.ext4fmt[fmt];
        } else if (this.ext4fmt[fmt] !== this.schema.options['extension4file']){
          console.log("Extension at "+this.editortype+"-editor at path '"+this.path+"' uses extension '."+this.schema.options['extension4file']+"' but extension '"+this.ext4fmt[fmt]+"' is recommended.");
        }
      }
    }
    if (this.schema.options.wysiwyg)  {
      if (window.ace  && (this.schema.options.wysiwyg == "ace")) {
        var self = this;
        console.warn("WYSIWYG - use ACE editor as editor instead.");
        delete this.schema.options.wysiwyg;
      } else if (window.sceditor  && (this.schema.options.wysiwyg == "sceditor")) {
        console.warn("WYSIWYG - use SCEditor as editor for format '"+(this.schema.format || "-")+"'.");
      }
    }
  },
  build: function() {
    var self = this;
    var i;
    this._super();

    this.input_element_id = "FORMCONTROL4"+this.get_unique_id();

    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    if(this.schema.question || this.schema.questionTemplate) {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    
    this.preview_id = "INPRE"+this.get_unique_id();
    this.preview_input = this.theme.getPreviewInput(this.preview_id);
    if (self.check_options_schema("enable_preview",false) == false) {
      this.preview_input.style.display = "none";
    }
    if(this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    this.format = this.schema.format;
    if(!this.format && this.schema.media && this.schema.media.type) {
      this.format = this.schema.media.type.replace(/(^(application|text)\/(x-)?(script\.)?)|(-source$)/g,'');
    }
    if(!this.format && this.options.default_format) {
      this.format = this.options.default_format;
    }
    if(this.options.format) {
      this.format = this.options.format;
    }

    if(this.format) {
      
      if(this.format === 'textarea') {
        this.input_type = 'textarea';
        this.editor4js = 'textarea';
        this.input = this.theme.getTextareaInput(this.options);
        this.input.id = "TEXTAREA"+this.get_unique_id();
        
        if (self.check_options_schema("enable_edit",true) == false) {
          this.input.style.display = "none";
        }
      } else if(this.format === 'range') {
        
        this.input_type = 'range';
        this.editor4js = 'range';
        var min = this.schema.minimum || 0;
        var max = this.schema.maximum || Math.max(100,min+1);
        var step = 1;
        if(this.schema.multipleOf) {
          if(min%this.schema.multipleOf) min = Math.ceil(min/this.schema.multipleOf)*this.schema.multipleOf;
          if(max%this.schema.multipleOf) max = Math.floor(max/this.schema.multipleOf)*this.schema.multipleOf;
          step = this.schema.multipleOf;
        }
        this.input = this.theme.getRangeInput(min,max,step);
        this.input.id = "RANGE"+this.get_unique_id();
        if (self.check_options_schema("enable_edit",true) == false) {
          this.input.style.display = "none";
        }
      } else {
        
        if (this.acefmt.indexOf(this.format) >= 0) {
          this.input_type = this.format;
          this.source_code = true;

          this.input = this.theme.getTextareaInput(this.options);
          this.input.id = "CODE"+this.get_unique_id();
          
        } else {
          
          this.input_type = this.format;
          this.input = this.theme.getFormInputField(this.input_type);
          this.input.id = "HTML5"+this.get_unique_id();
          
        }
      }
      
    } else {
      
      this.input_type = 'text';
      this.input = this.theme.getFormInputField(this.input_type);
      this.input.id = "TEXT4"+this.get_unique_id();
      
    }

    if(typeof this.schema.maxLength !== "undefined") this.input.setAttribute('maxlength',this.schema.maxLength);
    if(typeof this.schema.pattern !== "undefined") this.input.setAttribute('pattern',this.schema.pattern);
    else if(typeof this.schema.minLength !== "undefined") this.input.setAttribute('pattern','.{'+this.schema.minLength+',}');

    if(this.options.compact) {
      this.container.className += ' compact';
    } else {
      if(this.options.input_width) this.input.style.width = this.options.input_width;
    }

    if(this.schema.readOnly || this.schema.readonly || this.schema.template) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.addEventListener('change',function(e) {
        e.preventDefault();
        e.stopPropagation();

        if(self.schema.template) {
          this.value = self.value;
          return;
        }

        var val = this.value;

        var sanitized = self.sanitize(val);
        if(self.options && self.options.case) {
          if (self.options.case === 'uppercase') {
            sanitized = sanitized.toUpperCase();
          } else if(self.options.case === 'lowercase') {
            sanitized = sanitized.toLowerCase();
          }
        }
        if(val !== sanitized) {

          this.value = sanitized;
        }

        self.is_dirty = true;

        self.refreshValue();
        self.onChange(true);
      });

    if(this.options.input_height) this.input.style.height = this.options.input_height;
    if(this.options.expand_height) {
      this.adjust_height = function(el) {
        if(!el) return;
        var i, ch=el.offsetHeight;
        
        if(el.offsetHeight < el.scrollHeight) {
          i=0;
          while(el.offsetHeight < el.scrollHeight+3) {
            if(i>100) break;
            i++;
            ch++;
            el.style.height = ch+'px';
          }
        } else {
          i=0;
          while(el.offsetHeight >= el.scrollHeight+3) {
            if(i>100) break;
            i++;
            ch--;
            el.style.height = ch+'px';
          }
          el.style.height = (ch+1)+'px';
        }
      };

      this.input.addEventListener('keyup',function(e) {
        self.adjust_height(this);
      });
      this.input.addEventListener('change',function(e) {
        self.adjust_height(this);
      });
      this.adjust_height();
    }

    if(this.format) this.input.setAttribute('data-schemaformat',this.format);
    
    if (this.source_code == true) {

    }

    this.control = this.theme.appendFormControl(
        this.container,
        this.label, this.input,
        this.description, this.question,
        null,null,
        
        this.preview_input,this.buttons4title,
        
        this.input_element_id
    );
    if (this.source_code == true)  {
      
      this.edit_buttons = this.theme.getButtonHolder();
      this.editor_input_file = this.theme.getInputFileButton("Text File");
      this.editor_input_file.addEventListener('change', function (e) {
        
        const text_file = self.editor_input_file.files[0];
        const reader4text = new FileReader();

        reader4text.addEventListener("load", function () {

          var mimetype = "text-undefined";
          var text = null;
          if (reader4text.result) {
            
            var parts = reader4text.result.split(';base64,');
            mimetype = parts[0].split(":")[1];
            text = window.atob(parts[1]);

            console.log("Load file '"+text_file.name+"' with MIME-type: '"+mimetype+"'");
          };
          console.log("Load and store Base64 encoded JSON in Editor '"+self.path+"' MIME-Type='"+mimetype+"'");
          if ( mimetype.indexOf("application/json") >= 0) {
            console.log("Load JSON file as text into editor");
          } else {
            console.log("Load text file format for MIME type '"+mimetype+"'");
          };
          if (text) {
            self.setValue(text);
          }

        }, false);

        if (text_file) {
          reader4text.readAsDataURL(text_file);
        }
      });

      this.edit_buttons.appendChild(this.editor_input_file);
      this.editor_load_button = this.getButton('Load','load','Load Text');
      this.editor_load_button.addEventListener('click', function (e) {
        console.log("Load JSON into JSON Editor - path: '" + self.path + "'");
        self.editor_input_file.click();
      });
      this.edit_buttons.appendChild(this.editor_load_button);
      this.editor_save_button = this.getButton('Save','save','Save Text');
      this.editor_save_button.addEventListener('click',function(e) {
        console.log("Display Modal select object key/value pairs for search.")
        e.preventDefault();
        e.stopPropagation();
        if (self.edit_filename4save) {
          self.save2file(self.edit_filename4save.value);
        } else if (self.options.filename) {
          self.save2file(self.options.filename);
        } else {
          self.save2file();
        }
      });
      this.edit_buttons.appendChild(this.editor_save_button);
      this.input.parentNode.insertBefore(this.edit_buttons,this.input);
      
      this.edit_filename4save = this.theme.getFormInputField("text");
      this.edit_filename4save.id = "FILENAME4SAVE"+this.get_unique_id();
      this.edit_filename4save.value = this.get_filename4save();
      this.edit_buttons.appendChild(this.edit_filename4save);

    } else {
      
    };

    if (this.schema.contentTemplate) {
      
      this.content_template = this.jsoneditor.compileTemplate(this.schema.contentTemplate, this.template_engine);

      this.registerContentTemplate(self);
    } else {
      if (this.schema.template) {
        
        this.template = this.jsoneditor.compileTemplate(this.schema.template, this.template_engine);
        
        this.refreshValue();
      } else {
        
        this.refreshValue();
      }
    }
    this.registerTemplates();
    
    window.requestAnimationFrame(function() {

      if(self.input.parentNode) self.afterInputReady();
      if(self.adjust_height) self.adjust_height(self.input);
    });
    
  },
  postBuild: function() {

    this._super();
    if (this.check_options_schema("enable_edit",true) === false) {
      
      this.hide_editor();
      this.editor_is_visible = false;
    } else {
      this.show_editor();
      this.editor_is_visible = true;

    };
    if(this.options.wysiwyg && (this.options.wysiwyg == "sceditor") && window.sceditor) {
      this.editor4js = this.options.wysiwyg;
      var vDisplay = "none";
      this.hide4dom(this.editor_load_button,"editor_load_button",vDisplay);
      this.hide4dom(this.editor_save_button,"editor_save_button",vDisplay);
      this.hide4dom(this.edit_filename4save,"edit_filename4save",vDisplay);

    };

  },
  enable: function() {
    if(!this.always_disabled) {
      this.input.disabled = false;
      
    }
    this._super();
  },
  disable: function() {
    this.input.disabled = true;
    
    this._super();
  },
  afterInputReady: function() {
    var self = this;
    var options;

    if(this.source_code) {
      
      if(this.options.wysiwyg && (this.options.wysiwyg == "sceditor") && window.sceditor) {
        this.editor4js = 'sceditor';
        var found = ['html','bbcode','mediawiki'].indexOf(this.format);
        if (found >= 0) {
        } else {
          this.format = "html";
        };
        if (['monocons','material'].indexOf(this.icons4editor) >= 0) {
        } else {
          this.icons4editor = "monocons";
        };
        
        this.sceditor_container = document.createElement('div');
        this.sceditor_container.id = "SCEDITOR"+this.get_unique_id();
        this.input.parentNode.insertBefore(this.sceditor_container,this.input);
        this.input.style.display = 'none';

        this.input_element_id = this.sceditor_container.id;
        this.sceditor_container.style.width = "100%";
        this.sceditor_container.style.position = 'relative';

        var textarea4sce = this.theme.getTextareaInput(this.options);
        textarea4sce.id = "TEXTAREA"+this.get_unique_id();
        textarea4sce.style.width = this.get_options_schema("width","100%");
        
        this.sceditor_textarea = textarea4sce;
        this.sceditor_container.appendChild(self.sceditor_textarea);
        
        if (this.check_options_schema("enable_edit",true) == false) {
          this.sceditor_container.style.display = "none";
        }

        options = $extend({},{
          plugins: self.input_type==='html'? 'xhtml' : 'bbcode',
          emoticonsEnabled: false,

        },JSONEditor.plugins.sceditor,self.options.sceditor_options||{});

        window.sceditor.create(this.sceditor_textarea,{
  				format: this.format,
  				icons: this.icons4editor,
          loadhandler: null,
          savehandler: null,
          height:this.get_options_schema("height","500"),
  				style: 'sceditor/themes/content/default.css'
  			});
        var instance = window.sceditor.instance(textarea4sce);
        this.sceditor_instance = instance;
        this.sceditor_instance.filename4save = this.get_filename4save(null,this.get_extension4fmt());
        
        this.sceditor_instance.keyUp(function(e) {
          
          var val = self.sceditor_instance.getValue();

          console.warn('Key down event fired. val="'+val+'"');
          
          self.input.value = val;
          self.value = self.input.value;
          self.is_dirty = true;
          self.onChange(true);
        });
        this.sceditor_instance.setValue(this.getValue());
        
      } else if (this.input_type === 'markdown' && window.EpicEditor) {
        
        this.editor4js = 'epiceditor';
        this.epiceditor_container = document.createElement('div');
        this.epiceditor_container.id = "EPICEDITOR"+this.get_unique_id();
        
        this.input_element_id = this.epiceditor_container.id;

        this.input.parentNode.insertBefore(this.epiceditor_container,this.input);
        this.input.style.display = 'none';
        if (self.check_options_schema("enable_edit",true) == false) {
          this.epiceditor_container.style.display = "none";
        }

        options = $extend({},JSONEditor.plugins.epiceditor,{
          container: this.epiceditor_container,
          clientSideStorage: false
        });

        this.epiceditor = new window.EpicEditor(options).load();

        this.epiceditor.importFile(null,this.getValue());

        this.epiceditor.on('update',function() {
          var val = self.epiceditor.exportFile();
          self.input.value = val;
          self.value = val;
          self.is_dirty = true;
          self.onChange(true);
        });
      }
      
      else if (window.ace) {
        
        this.editor4js = 'ace';
        var mode = this.input_type;
        
        if(mode === 'cpp' || mode === 'c++' || mode === 'c') {
          mode = 'c_cpp';
        }

        var vWidth = '100%';
        var vHeight = '200px';
        if (this.options  && this.options.editor) {
            var edopt = this.options.editor;
            edopt.width = edopt.width || vWidth;
            edopt.height = edopt.height || vHeight;
        } else {
          if (!this.options) this.options = {};
          this.options.editor = {
            "width": vWidth,
            "height": vHeight
          }
        }
        this.ace_container = document.createElement('pre');
        this.ace_container.id = "ACEDITOR"+this.get_unique_id();
        
        this.input_element_id = this.ace_container.id;

        this.ace_container.style.width = this.options.editor.width;
        this.ace_container.style.position = 'relative';
        this.ace_container.style.height = this.options.editor.height;
        if (self.check_options_schema("enable_edit",true) == false) {
          this.ace_container.style.display = "none";
        }
        this.input.parentNode.insertBefore(this.ace_container,this.input);
        this.input.style.display = 'none';
        this.ace_editor = window.ace.edit(this.ace_container);

        this.ace_editor.setValue(this.getValue());

        if(JSONEditor.plugins.ace.theme) this.ace_editor.setTheme('ace/theme/'+JSONEditor.plugins.ace.theme);

        if(this.acefmt.indexOf(this.format) >= 0) {
          console.log("Mode ACE Editor: '"+mode+"'");
          this.ace_editor.session.setMode('ace/mode/'+mode);
        };
        
        this.ace_editor.on('change',function() {
          var val = self.ace_editor.getValue();
          self.input.value = val;
          
          self.refreshValue();
          self.is_dirty = true;
          self.onChange(true);
        });
      }
    }

    self.theme.afterInputReady(self.input);
  },
  refreshValue: function() {

    this.value = this.input.value;
    if(typeof this.value !== "string") this.value = '';
    this.serialized = this.value;
  },
  refreshTemplateValue: function() {

  },
  destroy: function() {
    
    if(this.sceditor_instance) {
      this.sceditor_instance.destroy();
    } else if(this.epiceditor) {
      this.epiceditor.unload();
    } else if(this.ace_editor) {
      this.ace_editor.destroy();
    }
    
    var ids4del = ["sceditor_textarea","editor_load_button","editor_save_button","edit_filename4save"];
    for (var i = 0; i < ids4del.length; i++) {
      if (this[ids4del[i]] && this[ids4del[i]].parentNode) {
        this[ids4del[i]].parentNode.removeChild(this[ids4del[i]]);
      }
    }
    if(this.editor_input_file && this.editor_input_file.parentNode) this.editor_input_file.parentNode.removeChild(this.editor_input_file);

    this.template = null;
    this.outTemplates = null;
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.pre_input && this.pre_input.parentNode) this.pre_input.parentNode.removeChild(this.pre_input);
    if(this.post_input && this.post_input.parentNode) this.post_input.parentNode.removeChild(this.post_input);
    if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if(this.question    && this.question.parentNode)    this.question.parentNode.removeChild(this.question);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);

    this._super();
  },
  
  sanitize: function(value) {
    return value;
  },
  
  onWatchedFieldChange: function() {
    var self = this, vars, j;

    if(this.template) {
      vars = this.getWatchedFieldValues();
      this.setValue(this.template(vars),false,true);
    }

    this._super();
  },
  showValidationErrors: function(errors) {
    var self = this;

    if(this.jsoneditor.options.show_errors === "always") {}
    else if(!this.is_dirty && this.previous_error_setting===this.jsoneditor.options.show_errors) return;

    this.previous_error_setting = this.jsoneditor.options.show_errors;

    var messages = [];
    $each(errors,function(i,error) {
      if(error.path === self.path) {
        messages.push(error.message);
      }
    });

    if(messages.length) {
      this.theme.addInputError(this.input, messages.join('. ')+'.');
    }
    else {
      this.theme.removeInputError(this.input);
    }
  },
  update_preview: function(options) {
    var value = (this.getValue() || " ");
    if ($isElement4DOM(this.preview_input) == true) {
      $setContent(this.preview_input,value);
    } else {
    }
  },

});
JSONEditor.defaults.editors.string4boolean = JSONEditor.defaults.editors.string.extend({
  editortype: "string4boolean",
  
  sanitize: function(value) {
    
    return value;
  },
  getNumColumns: function() {
    return 2;
  },
  XXgetValue: function() {
    if (this.check4boolean && this.check4boolean.checked == false) {
      return "";
    } else {
      return this._super();
    }
  }
});
JSONEditor.defaults.editors.audio = JSONEditor.AbstractEditor.extend({
  editortype: "audio",
  getNumColumns: function() {
    return 3;
  },
  getValue: function() {
    return this.value;
  },
  build: function () {

  }
});

JSONEditor.defaults.editors.hidden = JSONEditor.AbstractEditor.extend({
  editortype: "hidden",
  register: function () {
    this._super();
    if (!this.input) return;
    this.input.setAttribute('name', this.formname);
  },
  build_preview: function(options,new_title) {

  },
  unregister: function () {
    this._super();
    if (!this.input) return;
    this.input.removeAttribute('name');
  },
  setValue: function (value, initial, from_template) {
    var self = this;

    if(this.template && !from_template) {
      return;
    }

    if(value === null || typeof value === 'undefined') value = "";
    else if(typeof value === "object") value = JSON.stringify(value);
    else if(typeof value !== "string") value = ""+value;

    if(value === this.serialized) return;

    var sanitized = this.sanitize(value);

    if(this.input.value === sanitized) {
      return;
    }

    this.input.value = sanitized;

    var changed = from_template || this.getValue() !== value;

    this.refreshValue();

    if(initial) this.is_dirty = false;
    else if(this.jsoneditor.options.show_errors === "change") this.is_dirty = true;

    if(this.adjust_height) this.adjust_height(this.input);

    this.onChange(changed);
  },
  getNumColumns: function () {
    return 2;
  },
  enable: function () {
    this._super();
  },
  disable: function () {
    this._super();
  },
  refreshValue: function () {
    this.value = this.input.value;
    if (typeof this.value !== "string") this.value = '';
    this.serialized = this.value;
  },
  destroy: function () {
    this.template = null;
    if (this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if (this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if (this.question && this.question.parentNode) this.question.parentNode.removeChild(this.question);
    if (this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);

    this._super();
  },
  
  sanitize: function (value) {
    return value;
  },
  
  onWatchedFieldChange: function () {
    var self = this, vars, j;

    if (this.template) {
      vars = this.getWatchedFieldValues();
      this.setValue(this.template(vars), false, true);
    }

    this._super();
  },
  render_preview: function(options) {

  },
  build: function () {
    var self = this;

    this.format = this.schema.format;
    if (!this.format && this.options.default_format) {
      this.format = this.options.default_format;
    }
    if (this.options.format) {
      this.format = this.options.format;
    }

    this.input_type = 'hidden';
    this.input = this.theme.getFormInputField(this.input_type);

    if (this.format) this.input.setAttribute('data-schemaformat', this.format);

    this.container.appendChild(this.input);

    if (this.schema.template) {
      this.template = this.jsoneditor.compileTemplate(this.schema.template, this.template_engine);
      this.refreshValue();
    }
    else {
      this.refreshValue();
    }
  }
});
JSONEditor.defaults.editors.number = JSONEditor.defaults.editors.string.extend({
  editortype: "number",
  sanitize: function(value) {
    return (value+"").replace(/[^0-9\.\-eE]/g,'');
  },
  getNumColumns: function() {
    return 2;
  },
  getValue: function() {
    return this.value*1;
  }
});
JSONEditor.defaults.editors.integer = JSONEditor.defaults.editors.number.extend({
  editortype: "integer",
  sanitize: function(value) {
    value = value + "";
    return value.replace(/[^0-9\-]/g,'');
  },
  getNumColumns: function() {
    return 2;
  },
  build: function() {
    this._super();
    
  }
});
JSONEditor.defaults.editors.object = JSONEditor.AbstractEditor.extend({
  
  editortype: "object",
  search_keys: {}, 
  search_key_checkboxes: {}, 
  property_order: [], 
  getDefault: function() {
    return $extend({},this.schema["default"] || {});
  },
  getChildEditors: function() {
    return this.editors;
  },
  register: function() {
    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].register();
      }
    }
  },
  unregister: function() {
    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].unregister();
      }
    }
  },
  build_preview: function(preview_options,new_title) {

    var self = this;
    if ($check_options(preview_options,"enable_preview",false) === true) {
      if (preview_options.hasOwnProperty("container_preview")) {
            var cp = preview_options.container_preview;
            
            if (cp && ($isElement4DOM(cp) == true)) {
              if (new_title) {
                this._super(preview_options,new_title);
                
                if (this.schema.question) {
                    var question = this.theme.getQuestion(this.schema.question);
                    cp.appendChild(question);
                }
              };
              
              var subeditor_holder = this.theme.getIndentedPanel();
              cp.appendChild(subeditor_holder);
              
              if (new_title && this.schema.description) {
                  var description = this.theme.getDescription(this.schema.description);
                  cp.appendChild(description);
              }
              
              var editor_list = this.editors;
              var sub_options = $cloneJSON(preview_options);
              sub_options.enable_preview_edit_button = false;
              
              $each(editor_list, function(key,editor) {
                
                var holder = self.theme.getGridColumn();
                holder.id = self.create_unique_id();
                
                subeditor_holder.appendChild(holder);
                
                sub_options.container_preview = holder;
                sub_options = self.init_preview_options(sub_options);
                editor.build_preview(sub_options,editor.getTitle());
              });
            } else {
              console.warn("scr/editors/object.js:58 - preview_options.container_preview does not exist or is not a DOM element (DOM Check="+$isElement4DOM(cp)+")");
            }
      } else {
      }
    } else {
      
      console.warn("CALL: "+this.editortype+".build_preview("+this.path+") this.options.enable_preview = false.");
    }
  },
  display_search_result : function() {
   
   if (this.search_result && this.search_result.result) {
     var msg = "";
     if (this.search_result.result.length == 0) {
         msg = this.translate('error_no_search_results');
     } else {
         msg = this.translate('message_result');
         
     }
     console.log("MESSAGE: "+msg);
     this.search_result_holder.innerHTML = msg;
   }
   this.show_search_control();
 },
  search4array: function (pKeywordArray) {
    
    var self = this;
    var checkboxes = this.search_key_checkboxes;
    if (checkboxes) {
      console.log("Search Checkboxes for Object are defined");
      for (var key in checkboxes) {
        console.log("checkbox '"+key +"' found with boolean="+checkboxes[key].checked);
        if (checkboxes.hasOwnProperty(key)) {

        }
      }
    }
    var vResult = [];
    
    $each(this.property_order, function(j,key) {
      var editor = self.editors[key];
      var vEditorID = editor.get_editor_id();
      if (checkboxes && checkboxes.hasOwnProperty(key) && !(checkboxes[key].checked)) {
        console.log("Do not search in subeditor '" + key + "' because of checkbox was not checked");
        self.hide4id(vEditorID)
      } else {
        console.log("Search in object subeditor '" + key +"'");
        var vEditorResult = [];
        if (editor.editortype == "largearray") {
          vEditorResult = $cloneJSON(editor.search4largearray(pKeywordArray));
        } else {
          vEditorResult = editor.search4array(pKeywordArray);
        };
        var editor_search_result = {
          "path" : editor.path,
          "id": editor.get_editor_id(),
          "result" : vEditorResult
        };
        if (self.is_array(vEditorResult) && (vEditorResult.length > 0)) {
          vResult.push(editor_search_result);
        } else {
          if (vEditorResult && (vEditorResult.result) && (vEditorResult.result.length > 0)) {
            editor_search_result.result = vEditorResult.result;
            vResult.push(editor_search_result);
          } else {
            self.hide4id(editor.get_editor_id())
          }
        }
      };
    });
    return {
      "path" : this.path,
      "id": this.get_editor_id(),
      "result" :vResult
    };
  },
  show: function () {
    
    if ($check_options(this.options,"hidden",false) === true) {
      this.hide4id(this.get_editor_id());
      
    } else {
      this.show4id(this.get_editor_id());
      
    };
    
    if(this.editors) {
      for(var i in this.editors) {
        this.editors[i].show();
      }
    }
  },
  hide: function () {
    
    this.hide4id(this.get_editor_id());

    if(this.editors) {
      for(var i in this.editors) {
        this.editors[i].hide();
      }
    }
  },

  getNumColumns: function() {
    return Math.max(Math.min(12,this.maxwidth),3);
  },
  enable: function() {
    if(this.editjson_button) this.editjson_button.disabled = false;
    if(this.addproperty_button) this.addproperty_button.disabled = false;

    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].enable();
      }
    }
  },
  disable: function() {
    if(this.editjson_button) this.editjson_button.disabled = true;
    if(this.addproperty_button) this.addproperty_button.disabled = true;
    this.hideEditJSON();

    this._super();
    if(this.editors) {
      for(var i in this.editors) {
        if(!this.editors.hasOwnProperty(i)) continue;
        this.editors[i].disable();
      }
    }
  },
  getPropertyOrder: function() {
    var self = this;
    var property_order = Object.keys(this.editors);
    property_order = property_order.sort(function(a,b) {
      var ordera = self.editors[a].schema.propertyOrder;
      var orderb = self.editors[b].schema.propertyOrder;
      if(typeof ordera !== "number") ordera = 1000;
      if(typeof orderb !== "number") orderb = 1000;

      return ordera - orderb;
    });
    return property_order;
  },
  addGridRow: function(rows,found) {

    if((rows.length == 0) || (found < 0)) {
      rows.push({
        width: 0,
        minh: 999999,
        maxh: 0,
        editors: []
      });
      found = rows.length-1;
    }
    return found;
  },
  addGridCell: function (rows,found,key,width,height) {
    if (rows && rows[found]) {
      rows[found].editors.push({
        key: key,
        
        width: width,
        height: height
      });
      rows[found].width += width;
      rows[found].minh = Math.min(rows[found].minh,height);
      rows[found].maxh = Math.max(rows[found].maxh,height);
    }
  },
  stretch2FullWidth: function(rows) {

    for(i=0; i<rows.length; i++) {
      if(rows[i].width < 12) {
        var biggest = false;
        var new_width = 0;
        for(j=0; j<rows[i].editors.length; j++) {
          if(biggest === false) biggest = j;
          else if(rows[i].editors[j].width > rows[i].editors[biggest].width) biggest = j;
          rows[i].editors[j].width *= 12/rows[i].width;
          rows[i].editors[j].width = Math.floor(rows[i].editors[j].width);
          new_width += rows[i].editors[j].width;
        }
        if(new_width < 12) rows[i].editors[biggest].width += 12-new_width;
        rows[i].width = 12;
      }
    }
  },
  appendGrid2Form: function (rows) {
    var container = document.createElement('div');
    for(i=0; i<rows.length; i++) {
      var row = this.theme.getGridRow();
      container.appendChild(row);
      for(j=0; j<rows[i].editors.length; j++) {
        var key = rows[i].editors[j].key;
        editor = this.editors[key];

        if(editor.options.hidden) editor.container.style.display = 'none';
        else this.theme.setGridColumnSize(editor.container,rows[i].editors[j].width,rows[i].width);
        row.appendChild(editor.container);
      }
    }
    return container;
  },
  getEditorGridWidth: function (editor) {
    var vGridWisth = editor.options.hidden? 0 : (editor.options.grid_columns || editor.getNumColumns());
    
    return vGridWisth
  },
  getEditorGridHeight: function (editor) {
    return editor.options.hidden? 0 : editor.container.offsetHeight;
  },

  layoutEditors: function() {
    var self = this, i, j;
    var key, k;
    
    if(!this.row_container) return;

    this.property_order = this.getPropertyOrder();

    var rows = [];

    var container, editor;
    
    if (this.format === 'grid') {
      
      var po = this.property_order;

      for (k = 0; k < po.length; k++) {
      
        key = po[k];
        editor = self.editors[key];
        if (editor.property_removed) {
        } else {
          var found = -1;
          var width  = this.getEditorGridWidth(editor);
          var height = this.getEditorGridHeight(editor);
          
          for(var i=0; i<rows.length; i++) {
            
            if (rows[i].width + width <= 12) {

                found = i;
              
            }
          }
          found = this.addGridRow(rows,found);
          this.addGridCell(rows,found,key,width,height);
        };
      }
      this.stretch2FullWidth(rows);

      if (this.layout === JSON.stringify(rows)) return false;
      this.layout = JSON.stringify(rows);

      container = this.appendGrid2Form(rows);
    } else {
      
      if (this.format === 'grid2order') {

        rows = [];

        var po = this.property_order;
        for (k = 0; k < po.length; k++) {
        
          key = po[k];
          editor = self.editors[key];
          if (editor.property_removed) {
          } else {
            var found = -1;
            var width  = this.getEditorGridWidth(editor);
            var height = this.getEditorGridHeight(editor);
            if (height==0) {
              height = 1;
            }
              
            i = rows.length - 1;
            if (i>=0) {
              
              if (rows[i].width + width <= 12.0001) {

                  found = i;
                
              }
            }
            found = this.addGridRow(rows,found);
            this.addGridCell(rows,found,key,width,height);
          };
        }

        this.stretch2FullWidth(rows);

        if(this.layout === JSON.stringify(rows)) return false;
        this.layout = JSON.stringify(rows);

        container = this.appendGrid2Form(rows);
      } else {

        container = document.createElement('div');
        $each(this.property_order, function(i,key) {
          var editor = self.editors[key];
          if(editor.property_removed) return;
          var row = self.theme.getGridRow();
          container.appendChild(row);

          if(editor.options.hidden) editor.container.style.display = 'none';
          else self.theme.setGridColumnSize(editor.container,12);
          row.appendChild(editor.container);
        });
      }
    }
    
    this.row_container.innerHTML = '';
    this.row_container.appendChild(container);
  },
  getPropertySchema: function(key) {
    
    var schema = this.schema.properties[key] || {};
    schema = $extend({},schema);
    var matched = this.schema.properties[key]? true : false;

    if(this.schema.patternProperties) {
      for(var i in this.schema.patternProperties) {
        if(!this.schema.patternProperties.hasOwnProperty(i)) continue;
        var regex = new RegExp(i);
        if(regex.test(key)) {
          schema.allOf = schema.allOf || [];
          schema.allOf.push(this.schema.patternProperties[i]);
          matched = true;
        }
      }
    }

    if(!matched && this.schema.additionalProperties && typeof this.schema.additionalProperties === "object") {
      schema = $extend({},this.schema.additionalProperties);
    }

    return schema;
  },
  postBuild: function (options) {
    options = options || {};
    this._super();

    if (this.container_preview) {
      
      this.container_preview.innerHTML += "postBuild - src/editors/object.js:459 - "+this.editortype+".postBuild("+this.path+") - fill content on postBuild ";
      this.container_preview.style.display = "";
      this.container.appendChild(this.container_preview);
    } else {
    }
    if (this.container_preview) {
      this.container_preview.innerHTML += "postBuild('"+this.path+"') - src/editors/object.js:456 - "+this.editortype+".postBuild("+this.path+") - fill content on postBuild ";
    } else {
    };
    this.registerTemplates();
    if (this.check_options("collapsed",false) === true) {
      
      this.editor_holder.style.display = 'none';
      this.collapsed = true;
      this.setButtonText(self.toggle_button,'','expand',this.translate('button_expand'));
    }
    
    if (options.postbuild4children == true) {
      $each(this.editors, function(key,editor) {
        editor.postBuild();
      });
    }
  },
  preBuild: function() {
    this._super();

    this.editors = {};
    this.cached_editors = {};
    var self = this;

    this.format = this.options.layout || this.options.object_layout || this.schema.format || this.jsoneditor.options.object_layout || 'normal';

    this.schema.properties = this.schema.properties || {};

    this.minwidth = 0;
    this.maxwidth = 0;

    if(this.options.table_row) {
      $each(this.schema.properties, function(key,schema) {
        var editor = self.jsoneditor.getEditorClass(schema);
        self.editors[key] = self.jsoneditor.createEditor(editor,{
          jsoneditor: self.jsoneditor,
          schema: schema,
          path: self.path+'.'+key,
          parent: self,
          compact: true,
          required: true
        });
        self.editors[key].preBuild();

        var width = self.editors[key].options.hidden? 0 : (self.editors[key].options.grid_columns || self.editors[key].getNumColumns());

        self.minwidth += width;
        self.maxwidth += width;
      });
      this.no_link_holder = true;
    }
    
    else if(this.options.table) {
      
      throw "Not supported yet";
    }
    
    else {
      if(!this.schema.defaultProperties) {
        if(this.jsoneditor.options.display_required_only || this.options.display_required_only) {
          this.schema.defaultProperties = [];
          $each(this.schema.properties, function(k,s) {
            if(self.isRequired({key: k, schema: s})) {
              self.schema.defaultProperties.push(k);
            }
          });
        }
        else {
          self.schema.defaultProperties = Object.keys(self.schema.properties);
        }
      }

      self.maxwidth += 1;

      $each(this.schema.defaultProperties, function(i,key) {
        self.addObjectProperty(key, true);

        if(self.editors[key]) {
          self.minwidth = Math.max(self.minwidth,(self.editors[key].options.grid_columns || self.editors[key].getNumColumns()));
          self.maxwidth += (self.editors[key].options.grid_columns || self.editors[key].getNumColumns());
        }
      });
    }

    this.property_order = Object.keys(this.editors);
    this.property_order = this.property_order.sort(function(a,b) {
      var ordera = self.editors[a].schema.propertyOrder;
      var orderb = self.editors[b].schema.propertyOrder;
      if(typeof ordera !== "number") ordera = 1000;
      if(typeof orderb !== "number") orderb = 1000;

      return ordera - orderb;
    });
  },
  getPropertiesModal: function(holder_id,pre_doms) {

    this[holder_id] = this.theme.getModal();
    if (pre_doms && Array.isArray(pre_doms)) {
      for (var i = 0; i < pre_doms.length; i++) {
        addproperty_holder.appendChild(pre_doms[i])
      }
    }
    var property_list = document.createElement('div');
    property_list.style.width = '295px';
    property_list.style.maxHeight = '160px';
    property_list.style.padding = '5px 0';
    property_list.style.overflowY = 'auto';
    property_list.style.overflowX = 'hidden';
    property_list.style.paddingLeft = '5px';
    property_list.setAttribute('class', 'property-selector');
    
    this[holder_id].appendChild(property_list);
    return property_list;
  },
  show_description: function() {
    var self = this;
    $each(this.editors, function(key,editor) {
      if(editor) {
        editor.show_description();
      }
    });
    this._super();
  },
  hide_description: function() {
    var self = this;
    $each(this.editors, function(key,editor) {
      if(editor) {
        editor.hide_description();
      }
    });
    this._super();
  },
  toggle_description: function() {
    var self = this;
    $each(this.editors, function(key,editor) {
      if(editor) {
        editor.toggle_description();
      }
    });
    this._super();
  },
  show_question: function() {
    var self = this;
    $each(this.editors, function(key,editor) {
      if(editor) {
        editor.show_question();
      }
    });
    this._super();
  },
  hide_question: function() {
    var self = this;
    $each(this.editors, function(key,editor) {
      if(editor) {
        editor.hide_question();
      }
    });
    this._super();
  },
  toggle_question: function() {
    var self = this;
    $each(this.editors, function(key,editor) {
      if(editor) {
        editor.toggle_question();
      }
    });
    this._super();
  },
  getHeader4Editor: function (options) {

  },
  get_editor4apply: function (pKey) {
    var editor = null;
    if (pKey) {
      if (this.editors[pKey]) {
        editor = this.editors[pKey];
      } else {
        console.warn(this.editortype+".get_editor4apply('"+pKey+"') subeditor with property '"+pKey+"' not found!");
      }
    }
    return editor;
  },
  apply4children: function (pFctName,opt4cb,pParam1,pParam2) {
    
    opt4cb = this.getOptionsCheckbox4Include(opt4cb);
    var self = this;
    
    if (opt4cb.apply4level) {
      
      this.apply4level(pFctName,pParam1,pParam2);
    }
    var child_opt4cb = this.nextCheckboxLevel(opt4cb);
    if (opt4cb.apply4children == true) {
      
      $each(this.editors, function(key,editor) {
          editor.apply4children(pFctName,child_opt4cb,pParam1,pParam2);
      });
    } else {
        
    };
    this.reportCheckbox4Include();
  },
  show_preview:function () {
    
    var self = this;
    if (self.check_options_schema("hidden",false) == false) {
      if (this.container_preview) {
        this.container_preview.style.display = "";
        this.preview_is_visible = true;
      } else {
      }
      if (this.preview_input) {
        
        this.update_preview();
        this.preview_input.style.display = "";
        this.preview_is_visible = true;
      } else {
      }
    } else {
      this.hide_preview();
    }
  },
  hide_preview:function () {
    var self = this;
    if (this.container_preview) {
      this.preview_is_visible = false;
      
      this.container_preview.style.display = "none";
    } else {
    }
    if (this.preview_input) {
      
      this.preview_input.style.display = "none";
      
      this.preview_is_visible = false;
    } else {
      
    }
  },
  build: function() {

    var self = this;

    if(this.options.table_row) {
      
      this.editor_holder = this.container;
      
      $each(this.editors, function(key,editor) {
        
        var holder = self.theme.getTableCell();
        
        editor.setContainer(holder);
        
        editor.build();

        if(self.editors[key].check_options_schema("hidden",false) === true) {
          holder.style.display = 'none';
        }
        if(self.editors[key].options.input_width) {
          holder.style.width = self.editors[key].options.input_width;
        }
      });
    } else if(this.options.table) {

      throw "Not supported yet";
    } else {

      this.header = document.createElement('span');
      this.header.textContent = this.getTitle();

      this.header4title = this.header

      if ($check_options(this.options,"small_header",false) === true) {
        
        this.title = this.theme.getHeader(this.header4title,'h4');
      } else {
        
        this.title = this.theme.getHeader(this.header4title,'h3');
      }
      
      this.title_controls = this.theme.getHeaderButtonHolder();
      this.title.appendChild(this.title_controls);
      this.container.appendChild(this.title);
      this.container.style.position = 'relative';

      this.navigation = this.theme.getNavigationContainer('none');
      this.container.appendChild(this.navigation);

      this.editjson_holder = this.theme.getModal();
      this.editjson_textarea = this.theme.getTextareaInput();
      this.editjson_textarea.style.height = '170px';
      this.editjson_textarea.style.width = '300px';
      this.editjson_textarea.style.display = 'block';
      this.editjson_save = this.getButton('Update','transfer','Update');
      this.editjson_save.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.updateJSON();
      });
      this.editjson_cancel = this.getButton('Cancel','cancel','Cancel');
      this.editjson_cancel.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.hideEditJSON();
      });
      this.editjson_holder.appendChild(this.editjson_textarea);
      this.editjson_holder.appendChild(this.editjson_save);
      this.editjson_holder.appendChild(this.editjson_cancel);

      this.addproperty_holder = null;
      
      this.addproperty_list = this.getPropertiesModal("addproperty_holder");
      this.addproperty_add = this.getButton('add','add','add');
      this.addproperty_input = this.theme.getFormInputField('text');
      this.addproperty_input.setAttribute('placeholder','Property name...');
      this.addproperty_input.style.width = '220px';
      this.addproperty_input.style.marginBottom = '0';
      this.addproperty_input.style.display = 'inline-block';
      this.addproperty_add.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(self.addproperty_input.value) {
          if(self.editors[self.addproperty_input.value]) {
            window.alert('there is already a property with that name');
            return;
          }

          self.addObjectProperty(self.addproperty_input.value);
          if(self.editors[self.addproperty_input.value]) {
            self.editors[self.addproperty_input.value].disable();
          }
          self.onChange(true);
        }
      });
      this.addproperty_holder.appendChild(this.addproperty_list);
      this.addproperty_holder.appendChild(this.addproperty_input);
      this.addproperty_holder.appendChild(this.addproperty_add);
      var spacer = document.createElement('div');
      spacer.style.clear = 'both';
      this.addproperty_holder.appendChild(spacer);

      if (this.schema.question) {
        this.question = this.theme.getQuestion(this.schema.question);
        this.container.appendChild(this.question);
      }

      this.error_holder = document.createElement('div');
      this.error_holder.setAttribute("divtype","error-holder");
      this.container.appendChild(this.error_holder);

      this.search_result_holder = document.createElement('div');
      this.container.appendChild(this.search_result_holder);

      this.preview_input = document.createElement('div');
      this.preview_input.setAttribute("id","OBJECTPREVIEW"+this.get_unique_id());
      this.preview_input.setAttribute("divtype","preview-holder");
      
      this.container.appendChild(this.preview_input);

      this.editor_holder = this.theme.getIndentedPanel();
      this.editor_holder.id = this.get_unique_id();
      this.container.appendChild(this.editor_holder);

      if(this.schema.description) {
        this.description = this.theme.getDescription(this.schema.description);
        this.container.appendChild(this.description);
      }

      this.row_container = this.theme.getGridContainer();
      this.editor_holder.appendChild(this.row_container);

      $each(this.editors, function(key,editor) {
        var holder = self.theme.getGridColumn();
        holder.id = self.create_unique_id();

        self.row_container.appendChild(holder);

        editor.setContainer(holder);
        
        editor.build();
        editor.postBuild();
        
      });

      var vID_Array = ["title","editjson","addproperty","fastbackward","backward","count","forward","fastforward","delete_record","add_record"];
      for (var i = 0; i < vID_Array.length; i++) {
        this[vID_Array[i]+"_controls"] = this.theme.getHeaderButtonHolder();
        if (i > 2) {
          
          this[vID_Array[i]+"_controls"].style.display = "none";
        }
        
        this.title.appendChild(this[vID_Array[i]+"_controls"]);
      }
      
      this.getSearchControl("title");
      
      this.collapsed = false;
      this.toggle_button = this.getButton('','collapse',this.translate('button_collapse'));
      this.title_controls.appendChild(this.toggle_button);
      this.toggle_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        if(self.collapsed) {
          self.editor_holder.style.display = '';
          
          self.collapsed = false;
          self.setButtonText(self.toggle_button,'','collapse',self.translate('button_collapse'));
        } else {
          self.editor_holder.style.display = 'none';
          
          self.collapsed = true;
          self.setButtonText(self.toggle_button,'','expand',self.translate('button_expand'));
        }
      });

      if (this.check_options("disable_collapse",false) === true) {
        
        this.toggle_button.style.display = 'none';
      };
      
      this.addButtons4LoadSave(this.title_controls);
      
      this.execute_button = this.getButton('','forward',this.translate('button_execute'));
      this.title_controls.appendChild(this.execute_button);
      if (this.check_options_schema("enable_execute_button",init_bool) === true) {
        this.execute_button.style.display = "";
      } else {
        this.execute_button.style.display = "none";
      }
      var execEditor = null;
      if (typeof this["execute"] === "function") {
        execEditor = this;
      } else {
        if (this.parent && (typeof this.parent["execute"] === "function")) {
          execEditor = this.parent;
        }
      }
      this.execute_button.addEventListener('click',function(e) {
        
        if (execEditor) {
          execEditor.execute();
        } else {
          alert("Editor '"+self.editortype+"' ["+self.path+"]: execute button enabled, but the editor and parent editor has no function 'execute()'")
        }
        e.preventDefault();
        e.stopPropagation();
      });

      this.preview_edit_button = this.getButton('','eye',this.translate('button_preview'));
      this.title_controls.appendChild(this.preview_edit_button);
      var init_bool = this.check_options_schema("enable_preview",false);
      if (this.check_options_schema("enable_preview_edit_button",init_bool) === true) {
        this.preview_edit_button.style.display = "";
      } else {
        this.preview_edit_button.style.display = "none";
      }
      this.preview_edit_button.addEventListener('click',function(e) {
        console.log(self.editortype+".preview_edit_button('"+self.path+"') click PREVIEW");
        if (self.preview_is_visible === true) {
          console.log(self.editortype+".preview_edit_button('"+self.path+"') HIDE PREVIEW");
          self.hide_preview();
          self.show_editor();
          self.setButtonText(self.preview_edit_button,'','eye',self.translate('button_preview'));
        } else {
          console.log(self.editortype+".preview_edit_button('"+self.path+"') SHOW PREVIEW");
          self.show_preview();
          self.hide_editor();
          self.setButtonText(self.preview_edit_button,'','edit',self.translate('button_preview'));
        }
      });

      this.editjson_button = this.getButton('JSON','edit','Edit JSON');
      this.editjson_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggleEditJSON();
      });
      this.editjson_controls.appendChild(this.editjson_button);
      this.editjson_controls.appendChild(this.editjson_holder);

      if(this.schema.options && typeof this.schema.options.disable_edit_json !== "undefined") {
        if(this.schema.options.disable_edit_json) this.editjson_button.style.display = 'none';
      }
      else if(this.jsoneditor.options.disable_edit_json) {
        this.editjson_button.style.display = 'none';
      }

      this.addproperty_button = this.getButton('Properties','edit','Object Properties');
      this.addproperty_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.toggleAddProperty();
      });
      this.addproperty_controls.appendChild(this.addproperty_button);
      this.addproperty_controls.appendChild(this.addproperty_holder);
      this.refreshAddProperties();
    }

    var cb4i = this.createCheckbox4Include();
    
    cb4i.checked = this.check_options("checkbox4include",this.default4include.checked);
    cb4i.addEventListener('change',function(e) {
      var checkbox = event.target;
      if (checkbox.checked) {
        
      } else {
        
      }
    });
    this.checkbox4include = cb4i;
    if (this.title) {
      this.title.appendChild(this.checkbox4include);
    }
    if (this.check_options_schema("enable_checkbox4include",this.default4include.visible) === true) {
      this.show_checkbox4include();
    } else {
      this.hide_checkbox4include();
    };

    if(this.options.table_row) {
      this.editor_holder = this.container;
      
      $each(this.property_order,function(i,key) {
        self.editor_holder.appendChild(self.editors[key].container);
        
      });
    } else { 
      
      this.layoutEditors();
      
      this.layoutEditors();
    }
  },
  showSearchSettings: function() {
    console.log("Show Search Settings");
    if(!this.search_settings_holder) {
      return;
    } else {
      
      if (this.search_settings) {
        this.search_settings_holder.style.left = this.search_settings.offsetLeft+"px";
        this.search_settings_holder.style.top = this.search_settings.offsetTop + this.editjson_button.offsetHeight+"px";
      }
      
      this.disable();

      this.search_settings_holder.style.display = '';
      
      this.search_settings.disabled = false;
      this.edit_search_settings = true;
      }
  },
  hideSearchSettings: function() {
    console.log("hide Search Settings");
    if(!this.search_settings_holder) return;

    this.search_settings_holder.style.display = 'none';
    this.enable();
    this.edit_search_settings = false;
  },
  toggleSearchSettings: function() {
    if(this.edit_search_settings) this.hideSearchSettings();
    else this.showSearchSettings();
  },
  showEditJSON: function() {
    if(!this.editjson_holder) return;
    this.hideAddProperty();

    this.editjson_holder.style.left = this.editjson_button.offsetLeft+"px";
    this.editjson_holder.style.top = this.editjson_button.offsetTop + this.editjson_button.offsetHeight+"px";

    this.editjson_textarea.value = JSON.stringify(this.getValue(),null,2);

    this.disable();

    this.editjson_holder.style.display = '';
    this.editjson_button.disabled = false;
    this.editing_json = true;
  },
  hideEditJSON: function() {
    if(!this.editjson_holder) return;
    if(!this.editing_json) return;

    this.editjson_holder.style.display = 'none';
    this.enable();
    this.editing_json = false;
  },
  updateJSON: function() {
    
    if(!this.editjson_holder) return;

    try {
      var json = JSON.parse(this.editjson_textarea.value);
      this.setValue(json);
      this.hideEditJSON();
    }
    catch(e) {
      window.alert('invalid JSON');
      throw e;
    }
  },
  toggleEditJSON: function() {
    if(this.editing_json) this.hideEditJSON();
    else this.showEditJSON();
  },
  insertPropertyControlUsingPropertyOrder: function (property, control, container) {

    var propertyOrder;
    if (this.schema.properties[property])
      propertyOrder = this.schema.properties[property].propertyOrder;
    if (typeof propertyOrder !== "number") propertyOrder = 1000;
    control.propertyOrder = propertyOrder;

    for (var i = 0; i < container.childNodes.length; i++) {
      var child = container.childNodes[i];
      if (control.propertyOrder < child.propertyOrder) {
        this.addproperty_list.insertBefore(control, child);
        control = null;
        break;
      }
    }
    if (control) {
      this.addproperty_list.appendChild(control);
    }
  },
  getSearchSelectCheckbox: function(key) {
    var self = this;
    
    var checkbox, label, labelText, control;

    checkbox = self.theme.getCheckbox();
    this.search_key_checkboxes[key] = checkbox;
    checkbox.style.width = 'auto';

    if (this.schema.properties[key] && this.schema.properties[key].title) {
      labelText = this.schema.properties[key].title;
    } else {
      labelText = key;
    }
    console.log("Search Label Text='"+labelText+"'");
    label = self.theme.getCheckboxLabel(labelText);

    control = self.theme.getFormControl(label,checkbox);
    control.style.paddingBottom = control.style.marginBottom = control.style.paddingTop = control.style.marginTop = 0;
    control.style.height = 'auto';

    var exclude_keys = {};
    if (this.schema.options && this.schema.options.hasOwnProperty("search_exclude_keys")) {
      exclude_keys = this.schema.options.search_exclude_keys;
      console.log("search_exclude_keys defined in options of editor [" + this.path +"]");
    } else {
      console.log("search_exclude_keys undefined in options of editor [" + this.path +"] - search in all subeditors of src/editors/object.js");
    }
    checkbox.checked = true;
    if (exclude_keys) {
      if (exclude_keys.hasOwnProperty(key)) {

        checkbox.checked = !(exclude_keys[key]);
      } else {
        console.log("exclude_keys."+key+" was undefined");
      }
    } else {
    }
    checkbox.addEventListener('change',function() {
      if(checkbox.checked) {
        self.search_keys[key] = true;
      }
      else {
        self.search_keys[key] = false;
      }
      
    });
    self.search_key_checkboxes[key] = checkbox;

    return control;
  },
  addPropertyCheckbox: function(key) {
    var self = this;
    var checkbox, label, labelText, control;

    checkbox = self.theme.getCheckbox();
    checkbox.style.width = 'auto';

    if (this.schema.properties[key] && this.schema.properties[key].title)
      labelText = this.schema.properties[key].title;
    else
      labelText = key;

    label = self.theme.getCheckboxLabel(labelText);

    control = self.theme.getFormControl(label,checkbox);
    control.style.paddingBottom = control.style.marginBottom = control.style.paddingTop = control.style.marginTop = 0;
    control.style.height = 'auto';

    this.insertPropertyControlUsingPropertyOrder(key, control, this.addproperty_list);

    checkbox.checked = key in this.editors;
    checkbox.addEventListener('change',function() {
      if(checkbox.checked) {
        self.addObjectProperty(key);
      }
      else {
        self.removeObjectProperty(key);
      }
      self.onChange(true);
    });
    self.addproperty_checkboxes[key] = checkbox;

    return checkbox;
  },
  showAddProperty: function() {
    if(!this.addproperty_holder) return;
    this.hideEditJSON();

    this.addproperty_holder.style.left = this.addproperty_button.offsetLeft+"px";
    this.addproperty_holder.style.top = this.addproperty_button.offsetTop + this.addproperty_button.offsetHeight+"px";

    this.disable();

    this.adding_property = true;
    this.addproperty_button.disabled = false;
    this.addproperty_holder.style.display = '';
    this.refreshAddProperties();
  },
  hideAddProperty: function() {
    if(!this.addproperty_holder) return;
    if(!this.adding_property) return;

    this.addproperty_holder.style.display = 'none';
    this.enable();

    this.adding_property = false;
  },
  toggleAddProperty: function() {
    if(this.adding_property) this.hideAddProperty();
    else this.showAddProperty();
  },
  removeObjectProperty: function(property) {
    if(this.editors[property]) {
      this.editors[property].unregister();
      delete this.editors[property];

      this.refreshValue();
      this.layoutEditors();
    }
  },
  addObjectProperty: function(name, prebuild_only) {
    var self = this;

    if(this.editors[name]) return;

    if(this.cached_editors[name]) {
      this.editors[name] = this.cached_editors[name];
      if(prebuild_only) return;
      this.editors[name].register();
    }
    
    else {
      if(!this.canHaveAdditionalProperties() && (!this.schema.properties || !this.schema.properties[name])) {
        return;
      }

      var schema = self.getPropertySchema(name);

      var editor = self.jsoneditor.getEditorClass(schema);

      self.editors[name] = self.jsoneditor.createEditor(editor,{
        jsoneditor: self.jsoneditor,
        schema: schema,
        path: self.path+'.'+name,
        parent: self
      });
      self.editors[name].preBuild();

      if(!prebuild_only) {
        var holder = self.theme.getChildEditorHolder();
        holder.id = self.create_unique_id();
        var holder_preview = self.theme.getChildEditorHolder();
        holder_preview.id = self.create_unique_id();
        self.editor_holder.appendChild(holder);
        
        self.editors[name].setContainer(holder);
        self.editors[name].setContainerPreview(holder_preview);
        self.editors[name].build();

      } else {
      }

      self.cached_editors[name] = self.editors[name];
    }

    if(!prebuild_only) {
      self.refreshValue();
      self.layoutEditors();
    }
  },
  onChildEditorChange: function(editor) {
    this.refreshValue();
    this._super(editor);
  },
  canHaveAdditionalProperties: function() {
    if (typeof this.schema.additionalProperties === "boolean") {
      return this.schema.additionalProperties;
    }
    return !this.jsoneditor.options.no_additional_properties;
  },
  destroy: function() {
    
    $each(this.cached_editors, function(i,el) {
      el.destroy();
    });
    
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.error_holder && this.error_holder.parentNode) this.error_holder.parentNode.removeChild(this.error_holder);
    this.destroy4element("container_preview");
    this.destroy4element("preview_input");
    this.destroy4element("preview_edit_button");
    this.destroy4element("search_button_controls");
    this.destroy4element("search_keyword_controls");
    this.destroy4element("search_settings_controls");
    this.destroy4element("search_close_controls");
    if(this.editor_holder) this.editor_holder.innerHTML = '';

    this.editors = null;
    this.cached_editors = null;
    if (this.editor_holder && this.editor_holder.parentNode) this.editor_holder.parentNode.removeChild(this.editor_holder);
    this.editor_holder = null;

    this._super();
  },
  getValue4Object: function() {
    var result = this.value;
    if (this.schema.contentTemplate) {
      
      result = this.content_text || "undefined content template";
    }
    if ((this.check_options("remove_empty_properties",false) === true) ||
        ($check_options(this.jsoneditor.options,"remove_empty_properties",true) === true)) {
          
          for(var i in result) {
            if(result.hasOwnProperty(i)) {
              if(!result[i]) delete result[i];
            }
          }
    }
    return result;
  },
  getValue: function () {
    
    var value =  this.getValue4Object();
    return value;
  },
  reportCheckbox4Include: function () {
    var self = this;
    var opt4cb = {};
    var c4i = {};
    for(var key in this.editors) {
      var editor = this.editors[key];
      c4i[key] = editor.getCheckbox4Include(opt4cb);
    };
    var msg = JSON.stringify(c4i,null,4);
    return msg;
  },
  getValue4Checkbox: function(options4checked) {
    var self = this;
    var value = {};
    var opt4cb = this.getOptionsCheckbox4Include(options4checked);
    this.reportCheckbox4Include();

    if (this.getCheckbox4Include(opt4cb) == true) {
      var rawvalue = this.getValue();

      if (opt4cb.apply4children == true) {
        var child_opt4cb = this.nextCheckboxLevel(opt4cb);
        for(var key in this.editors) {
          
          var editor = self.editors[key];
          child_opt4cb = editor.getOptionsCheckbox4Include(child_opt4cb);

          if (editor.getCheckbox4Include(child_opt4cb) == true) {
            value[key] = editor.getValue4Checkbox(child_opt4cb);
          }
        };
      } else {
      }
    }
    return value;
  },
  getValue4Template: function (pTplID) {

    val = "UNDEFINED TEMPLATE with ID='"+pTplID+"': Editor: "+this.editorype + "[" +this.path + "]  create one in  schema.outputTemplates."+pTplID+" ";
    if (this.schema.outputTemplates  && this.schema.outputTemplates[pTplID]) {
      
      val = "";
      var vars = this.getTemplateFieldValues();
      for(var key in this.editors) {
        
        if(this.editors.hasOwnProperty(key)) {
          var vEditor = this.editors[key];
          
          if ((vEditor.editortype == "array") || (vEditor.editortype == "largearray")) {

            vars.self[key] = vEditor.getValue4Template(pTplID);
            
          }
        }
      }
      
      this.output_templates[pTplID] = this.jsoneditor.compileTemplate(this.schema.outputTemplates[pTplID], this.template_engine);
      var tpl_text = this.output_templates[pTplID](vars);
      
      val = tpl_text;
    } else {
      console.warn("Editor "+this.editortype+".getValue4Template('"+this.path+"') this.schema.outputTemplates['"+pTplID+"'] does not exist");
    }
    
    return val;
  },

  refreshValue: function() {
    this.value = {};
    var self = this;

    for(var i in this.editors) {
      if(!this.editors.hasOwnProperty(i)) continue;
      this.value[i] = this.editors[i].getValue();
    }

    if(this.adding_property) this.refreshAddProperties();
  },
  refreshAddProperties: function() {
    if(this.check_options("disable_properties",false) === true) {
      this.addproperty_controls.style.display = 'none';
      return;
    }

    var can_add = false, can_remove = false, num_props = 0, i, show_modal = false;

    for(i in this.editors) {
      if(!this.editors.hasOwnProperty(i)) continue;
      num_props++;
    }

    can_add = this.canHaveAdditionalProperties() && !(typeof this.schema.maxProperties !== "undefined" && num_props >= this.schema.maxProperties);

    if(this.addproperty_checkboxes) {
      this.addproperty_list.innerHTML = '';
    }
    this.addproperty_checkboxes = {};

    for(i in this.cached_editors) {
      if(!this.cached_editors.hasOwnProperty(i)) continue;

      this.addPropertyCheckbox(i);

      if(this.isRequired(this.cached_editors[i]) && i in this.editors) {
        this.addproperty_checkboxes[i].disabled = true;
      }

      if(typeof this.schema.minProperties !== "undefined" && num_props <= this.schema.minProperties) {
        this.addproperty_checkboxes[i].disabled = this.addproperty_checkboxes[i].checked;
        if(!this.addproperty_checkboxes[i].checked) show_modal = true;
      }
      else if(!(i in this.editors)) {
        if(!can_add  && !this.schema.properties.hasOwnProperty(i)) {
          this.addproperty_checkboxes[i].disabled = true;
        }
        else {
          this.addproperty_checkboxes[i].disabled = false;
          show_modal = true;
        }
      }
      else {
        show_modal = true;
        can_remove = true;
      }
    }

    if(this.canHaveAdditionalProperties()) {
      show_modal = true;
    }

    for(i in this.schema.properties) {
      if(!this.schema.properties.hasOwnProperty(i)) continue;
      if(this.cached_editors[i]) continue;
      show_modal = true;
      this.addPropertyCheckbox(i);
      
    }

    if(!show_modal) {
      this.hideAddProperty();
      this.addproperty_controls.style.display = 'none';
    }
    
    else if(!this.canHaveAdditionalProperties()) {
      this.addproperty_add.style.display = 'none';
      this.addproperty_input.style.display = 'none';
    }
    
    else if(!can_add) {
      this.addproperty_add.disabled = true;
    }
    
    else {
      this.addproperty_add.disabled = false;
    }
  },
  isRequired: function(editor) {
    if(typeof editor.schema.required === "boolean") return editor.schema.required;
    else if(Array.isArray(this.schema.required)) return this.schema.required.indexOf(editor.key) > -1;
    else if(this.jsoneditor.options.required_by_default) return true;
    else return false;
  },
  setValue: function(value, initial) {
    var self = this;
    value = value || {};

    if(typeof value !== "object" || Array.isArray(value)) value = {};

    $each(this.cached_editors, function(i,editor) {
      if(typeof value[i] !== "undefined") {
        
        self.addObjectProperty(i);
        editor.setValue(value[i],initial);
      } else if(!initial && !self.isRequired(editor)) {

        self.removeObjectProperty(i);
      } else {

        editor.setValue(editor.getDefault(),initial);
      }
    });

    $each(value, function(i,val) {
      if(!self.cached_editors[i]) {
        self.addObjectProperty(i);
        if(self.editors[i]) self.editors[i].setValue(val,initial);
      }
    });

    this.refreshValue();
    this.layoutEditors();
    this.onChange();
  },
  showValidationErrors: function(errors) {
    var self = this;

    var my_errors = [];
    var other_errors = [];
    $each(errors, function(i,error) {
      if(error.path === self.path) {
        my_errors.push(error);
      }
      else {
        other_errors.push(error);
      }
    });

    if(this.error_holder) {
      if(my_errors.length) {
        var message = [];
        this.error_holder.innerHTML = '';
        this.error_holder.style.display = '';
        $each(my_errors, function(i,error) {
          self.error_holder.appendChild(self.theme.getErrorMessage(error.message));
        });
      }
      
      else {
        this.error_holder.style.display = 'none';
      }
    }

    if(this.options.table_row) {
      if(my_errors.length) {
        this.theme.addTableRowError(this.container);
      }
      else {
        this.theme.removeTableRowError(this.container);
      }
    }

    $each(this.editors, function(i,editor) {
      editor.showValidationErrors(other_errors);
    });
  },
  update_preview: function(options) {
    var options = this.init_preview_options(options);
    if (!options.hasOwnProperty("container_preview")) {
      options.container_preview = this.preview_input;
      options.container_preview.innerHTML = "";
    };
    this.build_preview(options);
  }

});
JSONEditor.defaults.editors.objectselector = JSONEditor.defaults.editors.object.extend({
  editortype: "objectselector",

  id4selector: "selector",
  matching_props: "",
  enum4schema: [],
  create_enum: function () {
    
    var self = this;
    var vEnum = [];
    if (this.schema.properties) {
      $each(this.property_order,function(i,key) {
        vEnum.push({
          "value4enum": key,
          "title4enum": self.schema.properties[key].getTitle()
        }); 
      });  
    } else {
      console.error("Schema properties do not exist in call "+this.editortype+".create_enum("+this.path+")");
    }
    alert("scr/editors/objectselector.js:46 - schema.selector="+JSON.stringify(vEnum,null,4));
    return vEnum;
  },
  check_id4selector: function () {
    if (this.schema && this.schema.options && this.schema.options.id4selector) {
      return this.schema.options.id4selector
    } else {
      return this.id4selector
    }
  },
  get_allowed_props4value: function () {
    this.id4selector = this.check_options_schema("id4selector","selector");
    var vKeyArray = Object.keys(this.getValue());
    if (this.id4selector) {
      var vFound = vKeyArray.indexOf(this.id4selector)
      if (vFound  >= 0) {
        
        vKeyArray.slice(vFound,1);
      }
    }
    vKeyArray.sort();
    return vKeyArray;
  },
  get_allowed_props: function () {
    
    this.id4selector = this.check_options_schema("id4selector","selector");
    var vKeyArray = [];
    var prop4schema = this.schema.properties;
    $each(prop4schema,function(key,schema4prop) {
      if (this.id4selector !== key) {
        vKeyArray.push(key);
      }
    });
    vKeyArray.sort();
    return vKeyArray;
  },
  get_props4value: function (value) {
    value = value || {};
    
    var all_props = this.get_allowed_props();
    
    var vKeyArray = [];
    
    if (value && $isObject(value)) {
      
      for (var i = 0; i < all_props.length; i++) {
        if (value.hasOwnProperty(all_props[i])) {
          vKeyArray.push(all_props[i]);
        }
      }
    }
    
    return vKeyArray;
  },
  get_matching_props: function (value) {

    var allowed_props = this.get_allowed_props();
    var props4value = this.get_props4value(value)
    var vKeyArray = [];
    for (var i = 0; i < props4value.length; i++) {
      if (allowed_props.indexOf(props4value[i]) >= 0) {
        vKeyArray.push(props4value[i]);
      }
    };
    return vKeyArray;
  },
  get_matching_value: function (value) {
    
    var props4value = this.get_matching_props(value)
    var vObject = {};
    for (var i = 0; i < props4value.length; i++) {
      if (allowed_props.indexOf(props4value[i]) >= 0) {
        vObject[props4value[i]] = value[props4value[i]];
      }
    };
    return vObject;
  },
  sort_keys4enum: function (pSelector) {
    
    var s4e = pSelector || this.schema.selector;
    for (var i = 0; i < s4e.length; i++) {
      var arr = s4e[i].value4enum.split(',');
      for (var k = 0; k < arr.length; k++) {
        arr[k] = arr[k].trim();
      }
      s4e[i].value4enum = arr.sort().join(',');
    }
    return s4e;
  },
  append_none_all: function (pSelector) {
    var s4e = pSelector || this.schema.selector;
    s4e.splice(0, 0, {
      "value4enum":"-",
      "title4enum":" "
    });
    var all_props = this.get_allowed_props().join(",");
    s4e.push({
      "value4enum":all_props,
      "title4enum":"(*)"
    });
    return s4e;
  },
  create_selector4schema: function () {
    if (this.schema) {
      
      if (!this.schema.selector) {
        
        this.schema["selector"] = this.create_enum();
      };
      
      this.schema.selector = this.sort_keys4enum();
      this.schema.selector = this.append_none_all();
      
      this.id4selector = this.check_id4selector();
      
      this.schema.properties[this.id4selector] = {
        "title": "Selector for " + (this.schema.title || this.key),
        "type":"enum",
        "enum": this.schema.selector,
        "options":{
          "hidden":false
        },
        "propertyOrder": 1
      };
    } else {
      console.error("Schema does not exist in call "+this.editortype+".create_selector4schema("+this.path+")");
    }
  },
  preBuild: function() {
    
    this.create_selector4schema();
    this.id4selector = this.check_options_schema("id4selector","selector");
    
    this._super();
  },
  callback4switcher: function () {
  },
  setVisibleProperties: function (pKeyArray) {
    var self = this;
    var vKeyArray = pKeyArray || this.get_allowed_props();
    
    $each(vKeyArray,function(i,key) {
        var editor = self.editors[key];
        if (vKeyArray.indexOf(key) >= 0) {
          
          editor.show();
          editor.setCheckbox4Include(true);
        } else {
          editor.hide();
          editor.setCheckbox4Include(false);
        }
    });
  },
  assign_switcher: function () {
    var objsel = this.get_objectselector();
    var self = this;
    var switcher = objsel.switcher;

    switcher.addEventListener('change',function(e) {
      
      var value4switcher = this.value;

      self.selected = self.arr4value.indexOf(value4switcher);
      if (self.selected < 0) {
        self.selected = self.arr4title.indexOf(value4switcher);
      }
      if (self.schema.default) {
        var vProps = Object.keys(self.schema.default);
        var default4switcher = (vProps.sort()).join(",");
        if (self.selected < 0)  {
          self.selected = self.arr4value.indexOf(default4switcher);
        }
      }
      if (self.schema.selected < 0) {
        self.selected = self.schema.selected
      }
      
      var v4e = "";
      var val = self.getValue();
      var vKeyArray = [];
      if (val) {
        vKeyArray = Object.keys(val)
      }
      if (self.selected >= 0) {
        self.value = self["enum"][self.selected];
        if (self.value && self.value.value4enum) {
          v4e = self.value.value4enum;
        };
      }
      if (v4e) {
        vKeyArray = v4e.split(",");
      };
      self.setVisibleProperties(vKeyArray);

      e.preventDefault();
      e.stopPropagation();
      self.onChange(true);
    });

  },
  build: function () {
    this._super();
    this.assign_switcher();

  },
  
  postBuild: function () {
    this._super();
    this.show_objectselector();
  },
  get_objectselector: function () {
    
    if (this.editors) {
      return this.editors[this.id4selector];
    } else {
      return ;
    }
  },
  apply4objectselector: function (pFctName,param1,param2) {
    var editor = this.get_objectselector();
    if (editor) {
      editor[pFctName](param1,param2);
    } else {
      console.error("apply4objectselector('"+pFctName+"',param1,param2) , Subeditor ["+this.id4selector+"] does not exist!");
    }
  },
  show_objectselector: function() {
    this.apply4objectselector("show");
  },
  hide_objectselector: function() {
    this.apply4objectselector("hide");
  },
  checktype4enum: function (type4value) {
    var id4schema = "";
    for (var i = 0; i < this.schema4enum.length; i++) {
      var s4e = this.schema4enum[i];
      if (s4e.schema4enum.type == type4value) {
        
        id4schema = s4e.value4enum
      }
    }
    return id4schema;
  },
  select4enum: function (value) {
    var allowed_props   = this.get_allowed_props();
    var props4value     = this.get_props4value(value)
    this.matching_props = this.get_matching_props(value);
    this.matching_props = this.matching_props.sort();
    var sel4enum = this.matching_props.join(",");
    var vFound = false;
    for (var i = 0; i < this.schema.selector.length; i++) {
      if (sel4enum == this.schema.selector[i].value4num) {
        vFound = true;
      };
    };
    if (!vFound) {

      var editor4enum = this.get_objectselector();
    }
  },
  typecast4enum: function (value) {
    var type4value = typeof value;
    var id4schema = "";
    switch (type4value) {
      case "boolean":
          id4schema = checktype4enum(type4value)
      break;
      case "string":
          id4schema = checktype4enum(type4value)
      break;
      case "integer":
          id4schema = checktype4enum(type4value)
      break;
      default:
        if (Array.isArray(value)) {
          this.checkarray4enum(value);
        } else {
          if (type4value == "object") {
            this.checkobject4enum(value);
          }
        }
    }

  },
  getValue: function() {
    var self = this;
    var vRet = {};
    var value = this._super();
    $each(this.property_order,function(i,key) {
      var editor = self.editors[key];
      if (value && value.hasOwnProperty(key)) {
        vRet[key] = value[key];
      }
    });
    
    return value;
  },
  setValue: function(value, initial) {
    var self = this;
    this._super(value, initial);
  },
  XsetValue: function(value, initial) {
    var self = this;
    var selected = this.select4enum(value);
    if ($isObject(value) == true) {

      $each(this.editors, function(key,editor) {
        if(value.hasOwnProperty(key)) {
          editor.setCheckbox4Include(false);
          editor.show();
          
        } else {
          editor.setCheckbox4Include(true);
          editor.hide();
        }
      });
    } 
    this._super(value, initial);
  },
  XXsetValue: function(value, initial) {
    var self = this;
    var selected = this.select4enum(value);
    if ($isObject(value) == true) {

      $each(this.cached_editors, function(key,editor) {

        if (typeof value[key] !== "undefined") {
          
          self.addObjectProperty(key);
          editor.setValue(value[key],initial);
          editor.setCheckbox4Include(true);
          editor.show();
        } else if(!initial && !self.isRequired(editor)) {

          editor.setCheckbox4Include(false);
          editor.hide();
          self.removeObjectProperty(key);
        } else {

          editor.setValue(editor.getDefault(),initial);
        }
      });
    } 
  }

});

JSONEditor.defaults.editors.array = JSONEditor.AbstractEditor.extend({
  editortype: "array",
  tabs_array: [],
  tab_format: "",
  bgcolor_active: "white",
  bgcolor_inactive: "",
  opacity_inactive: 0.5,

  getDefault: function() {
    return this.schema["default"] || [];
  },
  register: function() {
    this._super();
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].register();
      }
    }
  },
  unregister: function() {
    this._super();
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].unregister();
      }
    }
  },
  show_description: function() {
    var self = this;
    $each(this.rows,function(i,editor) {
      if(editor) {
        editor.show_description();
      }
    });
    this._super();
  },
  hide_description: function() {
    var self = this;
    $each(this.rows,function(i,editor) {
      if(editor) {
        editor.hide_description();
      }
    });
    this._super();
  },
  toggle_description: function() {
    var self = this;
    $each(this.rows,function(i,editor) {
      if(editor) {
        editor.toggle_description();
      }
    });
    this._super();
  },
  show_question: function() {
    var self = this;
    $each(this.rows,function(i,editor) {
      if(editor) {
        editor.show_question();
      }
    });
    this._super();
  },
  hide_question: function() {
    var self = this;
    $each(this.rows,function(i,editor) {
      if(editor) {
        editor.hide_question();
      }
    });
    this._super();
  },
  toggle_question: function() {
    var self = this;
    $each(this.rows,function(i,editor) {
      if(editor) {
        editor.toggle_question();
      }
    });
    this._super();
  },
  display_search_result : function() {
   
   if (this.search_result && this.search_result.result) {
     var msg = "";
     if (this.search_result.result.length == 0) {
         msg = this.translate('error_no_search_results');
     } else {
         msg = this.translate('message_result');
         
     }
     console.log("MESSAGE: "+msg);
     this.search_result_holder.innerHTML = msg;
   }
   this.show_search_control();
 },

  search4array: function (pKeywordArray) {
    
    var vResultArr = [];
    this.show_search_control(pKeywordArray);
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        
        var vEditorResult = this.rows[i].search4array(pKeywordArray);
        var vEditorID = vEditorResult.container_id;

        console.log("CHECK FOUND: '" + this.path + "' vEditorResult.result.length=" + (vEditorResult.result.length));
        if (vEditorResult.result.length > 0) {
          console.log("FOUND: Search in Array '" + this.path + "' with keyword [" + pKeywordArray.join(",") + "] vEditorResult.length="+vEditorResult.result.length);
          vResultArr.push(vEditorResult);
          this.rows[i].show();
          this.rows[i].show_search_control(pKeywordArray);
          this.inactiveTabItems();
        } else {
          console.log("NOT FOUND: Search in Array '" + this.path + "' with keyword [" + pKeywordArray.join(",") + "] vEditorResult="+JSON.stringify(vEditorResult,null,4));

          this.rows[i].hide();
          this.rows[i].hide_search_control();
        };
        console.log("In Search Array '" + this.path + "' vResultArr in Item found.\n"+JSON.stringify(vResultArr,null,4));

      }
    };
    return {
      "path" : this.path,
      "id": this.container_id,
      "result" :vResultArr
    };
  },
  getValue4Checkbox: function(options4checked) {
    var self = this;
    var value = [];
    
    var opt4cb = this.getOptionsCheckbox4Include(options4checked);
    if (this.getCheckbox4Include(opt4cb) == true) {
      var rawvalue = this.getValue();

      if (opt4cb.apply4children == true) {
        var child_opt4cb = this.nextCheckboxLevel(opt4cb);
        $each(this.rows, function(i,editor) {
          child_opt4cb = editor.getOptionsCheckbox4Include(child_opt4cb);

          if (editor.getCheckbox4Include(child_opt4cb) == true) {
            
            value.push(editor.getValue4Checkbox(child_opt4cb));
          }
        });
      } else {
      }
    };
    return value;
  },
  getValue4Template: function (pTplID) {
    
    val = "UNDEFINED TEMPLATE with ID='"+pTplID+"': Editor: "+this.editorype + "[" +this.path + "]  create one in  schema.outputTemplates."+pTplID+" ";
    if (this.schema.outputTemplates  && this.schema.outputTemplates[pTplID]) {
      var self4array = "";
      if(this.rows) {
        for(var i=0; i<this.rows.length; i++) {
          self4array += this.rows[i].getValue4Template(pTplID);
        }
      }
      var vars = this.getTemplateFieldValues();
      vars["self4array"] = self4array;
      
      this.output_templates[pTplID] = this.jsoneditor.compileTemplate(this.schema.outputTemplates[pTplID], this.template_engine);
      var tpl_text = this.output_templates[pTplID](vars);
      
      val = tpl_text;
    } else {
      console.warn("Editor "+this.editortype+".getValue4Template('"+this.path+"') this.schema.outputTemplates['"+pTplID+"'] does not exist");
    }
    
    return val;
  },
  show_editor: function () {
    
    this._super();
    var self = this;
    if (this.tabs_holder) {
      if (this.check_options_schema("hidden",false) === true) {
        this.tabs_holder.style.display = "none";
        
      } else {
        
        this.tabs_holder.style.display = "";
      }
    }
  },
  hide_editor: function () {
    this._super();
    
    if (this.tabs_holder) {
      this.tabs_holder.style.display = "none";
    }
  },
  show_children: function () {
    
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].show();
      }
    }
  },
  hide_children: function () {
    
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].hide();
      }
    }
  },
  toggle_tab_selector: function () {
    if (this.tabs_holder) {
      var tmh = this.tab_selector;
      if (tmh.style.display == "none") {
        this.show_tab_selector();
      } else {
        this.hide_tab_selector();
      }
    } else {
      console.log("Toggle Tabs Holder: Array.tab_selector does not exist");
    }
  },
  hide_tab_selector: function () {
    if (this.tab_selector) {

      this.tab_selector.style.display = "none";
    } else {
      console.log("Hide Tabs Selector: Array.tab_selector does not exist");
    }
  },
  show_tab_selector: function () {
    if (this.tab_selector) {
      this.tab_selector.style.display = "";
    } else {
      console.log("Show Tabs Selector: Array.tab_selector does not exist");
    }
  },
  getNumColumns: function() {
    var info = this.getItemInfo(0);
    
    if (this.tabs_holder) {
      return Math.max(Math.min(12,info.width+2),4);
    }
    else {
      return info.width;
    }
  },
  enable: function() {
    if(this.add_row_button) this.add_row_button.disabled = false;
    if(this.remove_all_rows_button) this.remove_all_rows_button.disabled = false;
    if(this.delete_last_row_button) this.delete_last_row_button.disabled = false;

    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].enable();

        if(this.rows[i].moveup_button) this.rows[i].moveup_button.disabled = false;
        if(this.rows[i].movedown_button) this.rows[i].movedown_button.disabled = false;
        if(this.rows[i].delete_button) this.rows[i].delete_button.disabled = false;
      }
    }
    this._super();
  },
  disable: function() {
    if(this.add_row_button) this.add_row_button.disabled = true;
    if(this.remove_all_rows_button) this.remove_all_rows_button.disabled = true;
    if(this.delete_last_row_button) this.delete_last_row_button.disabled = true;

    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].disable();

        if(this.rows[i].moveup_button) this.rows[i].moveup_button.disabled = true;
        if(this.rows[i].movedown_button) this.rows[i].movedown_button.disabled = true;
        if(this.rows[i].delete_button) this.rows[i].delete_button.disabled = true;
      }
    }
    this._super();
  },
  preBuild: function() {
    this._super();
    if (this.schema) {
      if (this.schema.format === 'tabselect') {
        this.tab_format = this.schema.format;
        this.schema.format = "tabs";
      } else {
      }
    } else {
    }
    this.bgcolor_active = this.options.bgcolor_active || this.jsoneditor.options.bgcolor_active || "white";
    this.bgcolor_inactive = this.options.bgcolor_inactive || this.jsoneditor.options.bgcolor_inactive ||  "";
    this.opacity_inactive = this.options.opacity_inactive || this.jsoneditor.options.opacity_inactive ||  0.5;

    this.rows = [];
    this.row_cache = [];

    this.hide_delete_buttons = this.options.disable_array_delete || this.jsoneditor.options.disable_array_delete;
    this.hide_delete_all_rows_buttons = this.hide_delete_buttons || this.options.disable_array_delete_all_rows || this.jsoneditor.options.disable_array_delete_all_rows;
    this.hide_delete_last_row_buttons = this.hide_delete_buttons || this.options.disable_array_delete_last_row || this.jsoneditor.options.disable_array_delete_last_row;
    this.hide_move_buttons = this.options.disable_array_reorder || this.jsoneditor.options.disable_array_reorder;
    this.hide_add_button = this.options.disable_array_add || this.jsoneditor.options.disable_array_add;
  },
  postBuild: function(options) {
    options = options || {};
    
    var self = this;
    this._super();
    if (this.tab_format === 'tabselect') {
      this.show_tab_selector();
    } else {
      this.hide_tab_selector();
    };
    if (this.schema) {

      this.registerTemplates();
      if (this.schema.items && this.schema.items.headerTemplate) {
        this.registerHeader4ArrayTemplate(self);
      }
    } else {
      console.error(this.editortype +"postBuild('"+this.path+"') this.schema is not defined");
    };
    if (options.apply4children == true) {
      $each(this.rows,function(i,editor) {
        editor.postBuild();
      });
    }
  },
  get_editor4apply: function (pKey,pEditor) {
    if (pKey && (pKey !== "*")) {
      if (pEditor.editors[pKey]) {
        pEditor = pEditor.editors[pKey];
      } else {
        console.warn(this.editortype+".get_editor4apply(pEditor,'"+pKey+"') subeditor with property '"+pKey+"' not found!");
      }
    }
    return pEditor;
  },
  apply4children: function (pFctName,opt4cb,pParam1,pParam2) {
    
    opt4cb = this.getOptionsCheckbox4Include(opt4cb);
    var self = this;
    
    if (opt4cb.apply4level) {
      
      this.apply4level(pFctName,pParam1,pParam2);
    }
    var child_opt4cb = this.nextCheckboxLevel(opt4cb);
    if (opt4cb.apply4children == true) {
      $each(this.rows,function(i,editor) {
        editor.apply4children(pFctName,child_opt4cb,pParam1,pParam2);
      });
    } else {
      
    }
  },
  build_preview: function(preview_options,new_title) {

    var self = this;
    if ($check_options(preview_options,"enable_preview",false) === true) {
      if (preview_options.hasOwnProperty("container_preview")) {
          var cp = preview_options.container_preview;

          if (new_title) {
            this._super(preview_options,new_title);
            
            if (this.schema.question) {
                var question = this.theme.getQuestion(this.schema.question);
                cp.appendChild(question);
            }
          }
          
          var subeditor_holder = this.theme.getIndentedPanel();
          cp.appendChild(subeditor_holder);
          
          if (new_title && this.schema.description) {
              var description = this.theme.getDescription(this.schema.description);
              cp.appendChild(description);
          }
          var arr = this.getValue();

          var new_subtitle = this.getTitle();
          var sub_options = $cloneJSON(preview_options);
          sub_options.enable_preview_edit_button = false;
          $each(this.rows,function(i,row_editor) {
          
            console.log("build_preview() editor.path='"+self.path+"."+i+"'"+" i='"+i+"'");
            
            var holder = self.theme.getGridColumn();
            holder.id = self.create_unique_id();
            
            subeditor_holder.appendChild(holder);
            
            sub_options.container_preview = holder;
            sub_options = self.init_preview_options(sub_options);
            row_editor.build_preview(sub_options,new_subtitle + " " + (i+1));
          });
      } else {
          
          console.warn("CALL: "+this.editortype+".build_preview("+this.path+") this.container_preview undefined.");
      }
    } else {
    }
  },
  build: function() {
    
    var self = this;
    this._super();

    this.header = document.createElement('span');
    this.header.textContent = this.getTitle();

    this.header4title = this.header;

    if ($check_options(this.options,"small_header",false) === true) {
      
      this.title = this.theme.getHeader(this.header4title,'h4');
    } else {
      
      this.title = this.theme.getHeader(this.header4title,'h3');
    }
    
    this.title_controls = this.theme.getHeaderButtonHolder();
    this.title.appendChild(this.title_controls);
    this.container.appendChild(this.title);
    this.container.style.position = 'relative';

    this.navigation = document.createElement('div');
    this.navigation.style.display = 'none';
    this.container.appendChild(this.navigation);

    if(!this.options.compact) {
      
      if (this.schema.question || this.schema.questionTemplate) {
        
        this.question = this.theme.getQuestion(this.schema.question);
        this.container.appendChild(this.question);
      }
      
      var preview_node = document.createElement('div');
      preview_node.id = "PREVIEW4ARRAY"+this.get_unique_id();
      
      this.preview_input = preview_node;
      this.container.appendChild(preview_node);

      if (this.schema.description || this.schema.descriptionTemplate) {
        
        this.description = this.theme.getDescription(this.schema.description);
        this.container.appendChild(this.description);
      }
      
      this.search_result_holder = document.createElement('div');
      this.search_result_holder.setAttribute("type4theme","search_result_holder")
      this.container.appendChild(this.search_result_holder);

      this.error_holder = document.createElement('div');
      this.container.appendChild(this.error_holder);

      if (this.schema.format === 'tabs') {
        
        this.controls = this.theme.getHeaderButtonHolder();

        this.title.appendChild(this.controls);
        if (this.tab_format == "tabselect") {
            
            this.tabs_holder = this.theme.getTabSelectHolder();
        } else {
          
          this.tabs_holder = this.theme.getTabHolder();
        };
        this.container.appendChild(this.tabs_holder);
        this.row_holder = this.theme.getTabContentHolder(this.tabs_holder);

        this.active_tab = null;
      } else {

          this.panel = this.theme.getIndentedPanel();
          this.container.appendChild(this.panel);
          this.row_holder = document.createElement('div');
          this.panel.appendChild(this.row_holder);
          this.controls = this.theme.getButtonHolder();
          this.panel.appendChild(this.controls);
      }
    } else {
        
        this.panel = this.theme.getIndentedPanel();
        this.container.appendChild(this.panel);
        this.controls = this.theme.getButtonHolder();
        this.panel.appendChild(this.controls);
        this.row_holder = document.createElement('div');
        this.panel.appendChild(this.row_holder);
    }

    this.addControls();

  },
  render_preview: function(options) {
    this._super(options);
  },
  onChildEditorChange: function(editor) {
    this.refreshValue();
    this.refreshTabs(true);
    this._super(editor);
  },
  getItemTitle: function() {
    if(!this.item_title) {
      if(this.schema.items && !Array.isArray(this.schema.items)) {
        var tmp = this.jsoneditor.expandRefs(this.schema.items);
        this.item_title = tmp.title || this.schema.items.title4item || this.schema.items.title || 'item';
      } else {
        this.item_title = this.schema.items.title4item || this.schema.items.title || 'item';
      }
    }
    return this.item_title;
  },
  getItemSchema: function(i) {
    if(Array.isArray(this.schema.items)) {
      if(i >= this.schema.items.length) {
        if(this.schema.additionalItems===true) {
          return {};
        }
        else if(this.schema.additionalItems) {
          return $extend({},this.schema.additionalItems);
        }
      }
      else {
        return $extend({},this.schema.items[i]);
      }
    }
    else if(this.schema.items) {
      return $extend({},this.schema.items);
    }
    else {
      return {};
    }
  },
  getItemInfo: function(i) {
    var schema = this.getItemSchema(i);

    this.item_info = this.item_info || {};
    var stringified = JSON.stringify(schema);
    if(typeof this.item_info[stringified] !== "undefined") return this.item_info[stringified];

    schema = this.jsoneditor.expandRefs(schema);

    this.item_info[stringified] = {
      title: schema.title || "item",
      'default': schema["default"],
      width: 12,
      child_editors: schema.properties || schema.items
    };

    return this.item_info[stringified];
  },
  getElementEditor: function(i) {
    var item_info = this.getItemInfo(i);
    var schema = this.getItemSchema(i);
    schema = this.jsoneditor.expandRefs(schema);
    schema.title = item_info.title+' '+(i+1);

    var editor = this.jsoneditor.getEditorClass(schema);

    var holder;
    if (this.tabs_holder) {
      holder = this.theme.getTabContent();
    } else if(item_info.child_editors) {
      holder = this.theme.getChildEditorHolder();
    } else {
      holder = this.theme.getIndentedPanel();
    }

    this.row_holder.appendChild(holder);

    var ret = this.jsoneditor.createEditor(editor,{
      jsoneditor: this.jsoneditor,
      schema: schema,
      container: holder,
      path: this.path+'.'+i,
      parent: this,
      required: true
    });
    ret.preBuild();
    ret.build();
    ret.postBuild();

    if(!ret.title_controls) {
      ret.array_controls = this.theme.getButtonHolder();
      holder.appendChild(ret.array_controls);
    }

    return ret;
  },
  destroy: function() {
    this.empty(true);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.row_holder && this.row_holder.parentNode) this.row_holder.parentNode.removeChild(this.row_holder);
    if(this.controls && this.controls.parentNode) this.controls.parentNode.removeChild(this.controls);
    if(this.panel && this.panel.parentNode) this.panel.parentNode.removeChild(this.panel);

    this.rows = this.row_cache = this.title = this.description = this.row_holder = this.panel = this.controls = null;

    this._super();
  },
  empty: function(hard) {
    if(!this.rows) return;
    var self = this;
    $each(this.rows,function(i,row) {
      if(hard) {
        if(row.tab && row.tab.parentNode) row.tab.parentNode.removeChild(row.tab);
        self.destroyRow(row,true);
        self.row_cache[i] = null;
      }
      self.rows[i] = null;
    });
    self.rows = [];
    if(hard) self.row_cache = [];
  },
  destroyRow: function(row,hard) {
    var holder = row.container;
    if(hard) {
      row.destroy();
      if(holder.parentNode) holder.parentNode.removeChild(holder);
      if(row.tab && row.tab.parentNode) row.tab.parentNode.removeChild(row.tab);
    }
    else {
      if(row.tab) row.tab.style.display = 'none';
      holder.style.display = 'none';
      row.unregister();
    }
  },
  getMax: function() {
    if((Array.isArray(this.schema.items)) && this.schema.additionalItems === false) {
      return Math.min(this.schema.items.length,this.schema.maxItems || Infinity);
    }
    else {
      return this.schema.maxItems || Infinity;
    }
  },
  inactiveTabItems: function(refresh_headers) {
    var self = this;
    
    $each(this.rows, function(i,row) {
      if(!row.tab) return;
      
      if(refresh_headers) {
        row.tab_text.textContent = row.getHeaderText();
      } else {
        self.theme.markTabInactive(row.tab,self.bgcolor_inactive,self.opacity_inactive);
      }
    });
  },
  gotoTab: function(selected_i) {
    var self = this;
    
    $each(this.rows, function(i,row) {
      if (i === selected_i) {
        self.active_tab = row.tab;
        self.theme.markTabActive(row.tab,self.bgcolor_active);
        self.show4dom(row.container,self.editortype+".row.container ["+self.path+"]","");
      } else {
        self.theme.markTabInactive(row.tab,self.bgcolor_inactive,self.opacity_inactive);
        self.hide4dom(row.container,self.editortype+".row.container ["+self.path+"]");
      }
    });
  },
  refreshTabs: function(refresh_headers) {
    var self = this;
    
    var selected_i = 0;
    $each(this.rows, function(i,row) {
      if(!row.tab) return;

      if (refresh_headers) {
        row.tab_text.textContent = row.getHeaderText();
      } else {
        if (row.tab === self.active_tab) {
          self.theme.markTabActive(row.tab,self.bgcolor_active);
          selected_i = i;
          
          self.show4dom(row.container,self.editortype+".row.container ["+self.path+"]","");
        } else {
          self.theme.markTabInactive(row.tab,self.bgcolor_inactive,self.opacity_inactive);
          
          self.hide4dom(row.container,self.editortype+".row.container ["+self.path+"]");
        }
      }
    });
    self.refreshTabSelect(selected_i,"val"+selected_i);
  },
  refreshTabSelect: function(selected_i,selected_value) {
    var self = this;
    if (this.tab_format === 'tabselect') {
      this.show_tab_selector();
      selected_i = selected_i || 0;
      var options_arr = [];
      if (this.tab_selector_switcher) {
        this.tab_selector_switcher.options.length = 0;

        $each(this.rows, function(i,row) {
          if(!row.tab) return;
          var value4opt = i+1;
          var title4opt = self.rows[i].tab_text.textContent;
          options_arr.push({
             "value4enum":value4opt,
             "title4enum":title4opt
             
          });
        });
        
        this.setSelectTabOptions("tab_selector_switcher",options_arr);
        this.tab_selector_switcher.value = (selected_i+1);
      } else {
        this.hide_tab_selector();
        console.error(this.editortype+".refreshTabSelect("+selected_i+",'"+selected_value+"') this.tab_selector does not exist");
      }

    }
  },
  setValue: function(value, initial) {
    
    var self = this;
    value = value || [];

    if(!(Array.isArray(value))) value = [value];

    var serialized = JSON.stringify(value);
    if(serialized === this.serialized) return;

    if(this.schema.minItems) {
      while(value.length < this.schema.minItems) {
        value.push(this.getItemInfo(value.length)["default"]);
      }
    }
    if(this.getMax() && value.length > this.getMax()) {
      value = value.slice(0,this.getMax());
    }

    $each(value,function(i,val) {
      if(self.rows[i]) {
        
        var old_val = self.rows[i].getValue();
        
          self.rows[i].setValue(val,initial);
        
      } else if(self.row_cache[i]) {
        self.rows[i] = self.row_cache[i];
        self.rows[i].setValue(val,initial);
        self.rows[i].container.style.display = '';
        if(self.rows[i].tab) self.rows[i].tab.style.display = '';
        self.rows[i].register();
      } else {
        self.addRow(val,initial);
      }
    });

    for(var j=value.length; j<self.rows.length; j++) {
      self.destroyRow(self.rows[j]);
      self.rows[j] = null;
    }
    self.rows = self.rows.slice(0,value.length);

    var new_active_tab = null;
    $each(self.rows, function(i,row) {
      if(row.tab === self.active_tab) {
        new_active_tab = row.tab;
        return false;
      }
    });
    if(!new_active_tab && self.rows.length) new_active_tab = self.rows[0].tab;

    self.active_tab = new_active_tab;

    self.refreshValue(initial);
    self.refreshTabs(true);
    self.refreshTabs();

    self.onChange();

  },
  insertValue: function(value4array) {

    var array = this.getValue();
    if(!this.active_tab) {
      console.log("JSON Editor has no active_tab. array editor is not in 'tabs' mode for selecting");
      array.push(value4array);
    } else {
    array.splice(this.active_tab, 0, value4array);
    }
    this.setValue(array)
  },
  getSelectedValue: function() {
    var selected_value = null;
    if(!this.active_tab) throw "JSON Editor has no active_tab. array editor is not in 'tabs' mode for selecting";
    
    if ((this.active_tab >= 0) && (this.active_tab < this.value.length)) {
      selected_value = this.value[this.active_tab];
    } else {
      console.error("ERROR: active_tab="+this.active_tab+" is not in the range of 0 and "+(this.value.length-1)+".");
    }
    return selected_value;
  },
  setSelectedValue: function(value) {
    if(!this.active_tab) throw "JSON Editor has no active_tab. array editor is not in 'tabs' mode for selecting";
    
    var vArray = this.getValue();
    if ((this.active_tab >= 0) && (this.active_tab < vArray.length)) {
      vArray[this.active_tab] = value;
    } else {
      console.error("ERROR: active_tab="+this.active_tab+" is not in the range of 0 and "+(this.value.length-1)+".");
    }
  },
  change: function() {
    
    this._super();
  },

  refreshValue: function(force) {
    var self = this;
    var oldi = this.value? this.value.length : 0;
    this.value = [];

    $each(this.rows,function(i,editor) {
      
      self.value[i] = editor.getValue();
    });

    if(oldi !== this.value.length || force) {
      
      var minItems = this.schema.minItems && this.schema.minItems >= this.rows.length;

      $each(this.rows,function(i,editor) {
        
        if(editor.movedown_button) {
          if(i === self.rows.length - 1) {
            editor.movedown_button.style.display = 'none';
          }
          else {
            editor.movedown_button.style.display = '';
          }
        }

        if(editor.delete_button) {
          if(minItems) {
            editor.delete_button.style.display = 'none';
          }
          else {
            editor.delete_button.style.display = '';
          }
        }

        self.value[i] = editor.getValue();
      });

      var controls_needed = false;
      if (!this.value.length) {
        this.delete_last_row_button.style.display = 'none';
        this.remove_all_rows_button.style.display = 'none';
      } else if(this.value.length === 1) {
        this.remove_all_rows_button.style.display = 'none';

        if (minItems || this.hide_delete_last_row_buttons) {
          this.delete_last_row_button.style.display = 'none';
        } else {
          this.delete_last_row_button.style.display = '';
          controls_needed = true;
        }
      } else {
        if (minItems || this.hide_delete_last_row_buttons) {
          this.delete_last_row_button.style.display = 'none';
        } else {
          this.delete_last_row_button.style.display = '';
          controls_needed = true;
        }

        if (minItems || this.hide_delete_all_rows_buttons) {
          this.remove_all_rows_button.style.display = 'none';
        } else {
          this.remove_all_rows_button.style.display = '';
          controls_needed = true;
        }
      }

      if((this.getMax() && this.getMax() <= this.rows.length) || this.hide_add_button){
        this.add_row_button.style.display = 'none';
      }
      else {
        this.add_row_button.style.display = '';
        controls_needed = true;
      }

      if(!this.collapsed && controls_needed) {
        this.controls.style.display = 'inline-block';
      }
      else {
        this.controls.style.display = 'none';
      }
    }
  },
  update_tabs_array: function() {
    this.tabs_array = [];
  },
  addRow: function(value, initial) {
    var self = this;
    var i = this.rows.length;

    self.rows[i] = this.getElementEditor(i);
    self.row_cache[i] = self.rows[i];

    if (self.tabs_holder) {
      self.rows[i].tab_text = document.createElement('span');
      self.rows[i].tab_text.textContent = self.rows[i].getHeaderText();
      self.rows[i].tab = self.theme.getTab(self.rows[i].tab_text);
      self.rows[i].tab.addEventListener('click', function(e) {
        self.active_tab = self.rows[i].tab;
        self.refreshTabs();
        self.show_editor();
        e.preventDefault();
        e.stopPropagation();
      });

      self.theme.addTab(self.tabs_holder, self.rows[i].tab);
      self.update_tabs_array();
    }

    var controls_holder = self.rows[i].title_controls || self.rows[i].array_controls;

    if(!self.hide_delete_buttons) {
      self.rows[i].delete_button = this.getButton(self.getItemTitle(),'delete',this.translate('button_delete_row_title',[self.getItemTitle()]));
      self.rows[i].delete_button.className += ' delete';
      self.rows[i].delete_button.setAttribute('data-i',i);
      self.rows[i].delete_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        var i = this.getAttribute('data-i')*1;

        var value = self.getValue();

        var newval = [];
        var new_active_tab = null;
        $each(value,function(j,row) {
          if(j===i) {
            
            if(self.rows[j].tab === self.active_tab) {

              if(self.rows[j+1]) new_active_tab = self.rows[j].tab;
              
              else if(j) new_active_tab = self.rows[j-1].tab;
            }

            return; 
          }
          newval.push(row);
        });
        self.setValue(newval);
        if(new_active_tab) {
          
          self.active_tab = new_active_tab;
          self.refreshTabs();
        }

        self.onChange(true);
      });

      if(controls_holder) {
        controls_holder.appendChild(self.rows[i].delete_button);
      }
    }

    if(i && !self.hide_move_buttons) {
      self.rows[i].moveup_button = this.getButton('','moveup',this.translate('button_move_up_title'));
      self.rows[i].moveup_button.className += ' moveup';
      self.rows[i].moveup_button.setAttribute('data-i',i);
      self.rows[i].moveup_button.addEventListener('click',function(e) {
        self.show();
        e.preventDefault();
        e.stopPropagation();
        var i = this.getAttribute('data-i')*1;

        if(i<=0) return;
        var rows = self.getValue();
        var tmp = rows[i-1];
        rows[i-1] = rows[i];
        rows[i] = tmp;

        self.setValue(rows);
        self.active_tab = self.rows[i-1].tab;
        self.refreshTabs();

        self.onChange(true);
      });

      if (controls_holder) {
        controls_holder.appendChild(self.rows[i].moveup_button);
      }
    }

    if (!self.hide_move_buttons) {
      self.rows[i].movedown_button = this.getButton('','movedown',this.translate('button_move_down_title'));
      self.rows[i].movedown_button.className += ' movedown';
      self.rows[i].movedown_button.setAttribute('data-i',i);
      self.rows[i].movedown_button.addEventListener('click',function(e) {
        self.show();
        e.preventDefault();
        e.stopPropagation();
        var i = this.getAttribute('data-i')*1;

        var rows = self.getValue();
        if(i>=rows.length-1) return;
        var tmp = rows[i+1];
        rows[i+1] = rows[i];
        rows[i] = tmp;

        self.setValue(rows);
        self.active_tab = self.rows[i+1].tab;
        self.refreshTabs();
        self.onChange(true);
      });

      if(controls_holder) {
        controls_holder.appendChild(self.rows[i].movedown_button);
      }
    }

    if(value) self.rows[i].setValue(value, initial);
    self.refreshTabs();
  },
  setSelectTabOptions: function(selector_id,pTabArray) {
    var self = this;
    if (this.is_array(pTabArray)) {

      var value_arr = [];
      var title_arr = [];
      for (var i = 0; i < pTabArray.length; i++) {
        if (typeof pTabArray[i] === "string") {
          
          value_arr.push(pTabArray[i]);
          title_arr.push(pTabArray[i]);
        } else {
          
          if (pTabArray[i].value4enum) {
            value_arr.push(pTabArray[i].value4enum);
            if (pTabArray[i].title4enum) {
              title_arr.push(pTabArray[i].title4enum);
            } else {
              title_arr.push(pTabArray[i].value4enum);
            }
          } else {
            
            value_arr.push("value"+i);
            title_arr.push("Default Title "+i);
          }
        }
      } 

      self.theme.setSelectOptions(self[selector_id], value_arr, title_arr);
    } else {
      console.error("ERROR: setSelectTabOptions(pTabArray) - 'pTabArray' is not an array");
    }

  },
  addControls: function(options) {

    var self = this;

    this.collapsed = false;
    this.toggle_button = this.getButton('','collapse',this.translate('button_collapse'));
    
    this.title_controls.appendChild(this.toggle_button);
    
    var row_holder_display = self.row_holder.style.display;
    var controls_display = self.controls.style.display;
    this.toggle_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      if(self.collapsed) {
        self.collapsed = false;
        if(self.panel) self.panel.style.display = '';
        self.row_holder.style.display = row_holder_display;
        if(self.tabs_holder) self.tabs_holder.style.display = '';
        self.controls.style.display = controls_display;
        self.setButtonText(this,'','collapse',self.translate('button_collapse'));
      } else {
        self.collapsed = true;
        self.row_holder.style.display = 'none';
        if(self.tabs_holder) self.tabs_holder.style.display = 'none';
        self.controls.style.display = 'none';
        if(self.panel) self.panel.style.display = 'none';
        self.setButtonText(this,'','expand',self.translate('button_expand'));
      }
    });
    
    if (this.check_options_schema("collapsed",false) === true) {

      $trigger(this.toggle_button,'click');
    }
    
    if (this.check_options_schema("disable_collapse",false) === true) {
      this.toggle_button.style.display = 'none';
    } else if (this.check_options_global("disable_collapse",false) === true) {
      this.toggle_button.style.display = 'none';
    }
    
    this.execute_button = this.getButton('','forward',this.translate('button_execute'));
    this.title_controls.appendChild(this.execute_button);
    if (this.check_options_schema("enable_execute_button",init_bool) === true) {
      this.execute_button.style.display = "";
    } else {
      this.execute_button.style.display = "none";
    }
    var execEditor = null;
    if (typeof this["execute"] === "function") {
      
      execEditor = this;
    } else {
      if (this.parent && (typeof this.parent["execute"] === "function")) {
        
          execEditor = this.parent;
      }
    }
    this.execute_button.addEventListener('click',function(e) {
      
      if (execEditor) {
        execEditor.execute();
      } else {
        alert("Editor '"+self.editortype+"' ["+self.path+"]: execute button enabled, but the editor and parent editor have no method 'execute()'")
      }
      e.preventDefault();
      e.stopPropagation();
    });
    
    this.preview_edit_button = this.getButton('','eye',this.translate('button_preview'));
    this.title_controls.appendChild(this.preview_edit_button);
    var init_bool = this.check_options_schema("enable_preview",false);
    if (this.check_options_schema("enable_preview_edit_button",init_bool) === true) {
      this.preview_edit_button.style.display = "";
    } else {
      this.preview_edit_button.style.display = "none";
    }
    this.preview_edit_button.addEventListener('click',function(e) {
      console.log(self.editortype+".preview_edit_button('"+self.path+"') click PREVIEW");
      if (self.preview_is_visible === true) {
        console.log(self.editortype+".preview_edit_button('"+self.path+"') HIDE PREVIEW");
        self.hide_preview();
        self.show_editor();
        self.setButtonText(self.preview_edit_button,'','eye',self.translate('button_preview'));
      } else {
        console.log(self.editortype+".preview_edit_button('"+self.path+"') SHOW PREVIEW");
        self.show_preview();
        self.hide_editor();
        self.setButtonText(self.preview_edit_button,'','edit',self.translate('button_preview'));
      }
    });

    this.show_preview_button = this.getButton('','eye',this.translate('button_preview'));
    
    this.show_preview_button.addEventListener('click',function(e) {
      self.toggle_preview();
      
    });
    if (this.check_options_schema("enable_preview_button",false) === true) {
      this.show_preview_button.style.display = ""
    } else {
      this.show_preview_button.style.display = "none"
    }

    this.addButtons4LoadSave();

    var cb4i = this.createCheckbox4Include();
    
    cb4i.checked = this.check_options("checkbox4include",this.default4include.checked);
    cb4i.addEventListener('change',function(e) {
      var checkbox = event.target;
      if (checkbox.checked) {
        
      } else {
        
      }
    });
    this.title_controls.appendChild(cb4i);
    this.checkbox4include = cb4i;
    if (this.check_options_schema("enable_checkbox4include",this.default4include.visible) === true) {
      this.show_checkbox4include();
    } else {
      this.hide_checkbox4include();
    };

    this.tab_selector = this.theme.getButtonHolder();
    this.tab_selector_label = document.createElement("b");
    var ts_label = this.translate('label_selector');
    if (this.schema && this.schema.label4select) {
      ts_label = this.schema.label4select;
    };
    this.tab_selector_label.innerHTML = ts_label;
    this.tab_selector.appendChild(this.tab_selector_label);
    this.tab_selector_switcher = this.theme.getSwitcher([]);
    this.tab_selector.appendChild(self.tab_selector_switcher);
    if (this.tab_format == "tabselect") {
      this.tab_selector.style.display = "";
    } else {
      this.tab_selector.style.display = "none";
    }
    this.setSelectTabOptions("tab_selector_switcher",self.tabs_array);
    this.tab_selector_switcher.addEventListener('change', function(e) {
      
      var selected_i = this.value*1-1;
      $each(self.rows, function(i,row) {
        if (i == selected_i) {
          self.active_tab = self.rows[i].tab;
          self.refreshTabs();
          e.preventDefault();
          e.stopPropagation();
        }
      });
    });
    this.navigation.appendChild(this.tab_selector);
    if (this.tab_format == "tabselect") {
      this.navigation.style.display = "";
    }

    this.add_row_button = this.getButton(this.getItemTitle(),'add',this.translate('button_add_row_title',[this.getItemTitle()]));
    
    this.add_row_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var i = self.rows.length;
      if(self.row_cache[i]) {
        self.rows[i] = self.row_cache[i];
        self.rows[i].setValue(self.rows[i].getDefault(), true);
        self.rows[i].container.style.display = '';
        if(self.rows[i].tab) self.rows[i].tab.style.display = '';
        self.rows[i].register();
      } else {
        self.addRow();
      }
      self.active_tab = self.rows[i].tab;
      self.refreshTabs();
      self.refreshValue();
      self.onChange(true);
    });
    self.controls.appendChild(this.add_row_button);

    this.delete_last_row_button = this.getButton(this.translate('button_delete_last',[this.getItemTitle()]),'delete',this.translate('button_delete_last_title',[this.getItemTitle()]));
    this.delete_last_row_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      var rows = self.getValue();

      var new_active_tab = null;
      if(self.rows.length > 1 && self.rows[self.rows.length-1].tab === self.active_tab) new_active_tab = self.rows[self.rows.length-2].tab;

      rows.pop();
      self.setValue(rows);
      if(new_active_tab) {
        self.active_tab = new_active_tab;
        self.refreshTabs();
      }
      self.onChange(true);
    });
    self.controls.appendChild(this.delete_last_row_button);

    this.remove_all_rows_button = this.getButton(this.translate('button_delete_all'),'delete',this.translate('button_delete_all_title'));
    this.remove_all_rows_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.setValue([]);
      self.onChange(true);
    });
    this.controls.appendChild(this.remove_all_rows_button);

    this.getSearchControl("title");
    
    if(this.tabs) {
      this.add_row_button.style.width = '100%';
      this.add_row_button.style.textAlign = 'left';
      this.add_row_button.style.marginBottom = '3px';

      this.delete_last_row_button.style.width = '100%';
      this.delete_last_row_button.style.textAlign = 'left';
      this.delete_last_row_button.style.marginBottom = '3px';

      this.remove_all_rows_button.style.width = '100%';
      this.remove_all_rows_button.style.textAlign = 'left';
      this.remove_all_rows_button.style.marginBottom = '3px';
    }
  },
  showValidationErrors: function(errors) {
    var self = this;

    var my_errors = [];
    var other_errors = [];
    $each(errors, function(i,error) {
      if(error.path === self.path) {
        my_errors.push(error);
      }
      else {
        other_errors.push(error);
      }
    });

    if(this.error_holder) {
      if(my_errors.length) {
        var message = [];
        this.error_holder.innerHTML = '';
        this.error_holder.style.display = '';
        $each(my_errors, function(i,error) {
          self.error_holder.appendChild(self.theme.getErrorMessage(error.message));
        });
      }
      
      else {
        this.error_holder.style.display = 'none';
      }
    }

    $each(this.rows, function(i,row) {
      row.showValidationErrors(other_errors);
    });
  },
  update_preview: function(options) {
    var options = this.init_preview_options(options);
    options.container_preview.innerHTML = "";
    this.build_preview(options);
  }
});
JSONEditor.defaults.editors.table = JSONEditor.defaults.editors.array.extend({
  editortype: "table",
  register: function() {
    this._super();
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].register();
      }
    }
  },
  unregister: function() {
    this._super();
    if(this.rows) {
      for(var i=0; i<this.rows.length; i++) {
        this.rows[i].unregister();
      }
    }
  },
  getNumColumns: function() {
    return Math.max(Math.min(12,this.width),3);
  },
  preBuild: function() {
    
    var item_schema = this.jsoneditor.expandRefs(this.schema.items || {});

    this.item_title = item_schema.title || 'row';
    this.item_default = item_schema["default"] || null;
    this.item_has_child_editors = item_schema.properties || item_schema.items;
    this.width = 12;
    this._super();
  },
  build: function() {
    
    var self = this;
    
    this.table = this.theme.getTable();
    this.table.style.width = "100%";
    
    this.container.appendChild(this.table);
    
    this.thead = this.theme.getTableHead();
    
    this.table.appendChild(this.thead);
    
    this.header_row = this.theme.getTableRow();
    
    this.thead.appendChild(this.header_row);
    
    this.row_holder = this.theme.getTableBody();
    
    this.table.appendChild(this.row_holder);

    var tmp = this.getElementEditor(0,true);
    this.item_default = tmp.getDefault();
    this.width = tmp.getNumColumns() + 2;

    if(!this.options.compact) {
      this.title = this.theme.getHeader(this.getTitle());
      
      this.container.appendChild(this.title);

      this.navigation = document.createElement('div');
      this.navigation.style.display = 'none';
      this.container.appendChild(this.navigation);

      this.title_controls = this.theme.getHeaderButtonHolder();
      this.title.appendChild(this.title_controls);
      if(this.schema.question || this.schema.questionTemplate) {
        this.question = this.theme.getDescription(this.schema.question);
        this.container.appendChild(this.question);
      }
      
      var preview_node = document.createElement('div');
      preview_node.id = "PREVIEW4TABLEARRAY"+this.get_unique_id();
      preview_node.innerHTML = "src/editors/table.js:76 - Preview Table Array Path '"+this.path+"' with ID='"+preview_node.id+"' created in src/editors/table.js:69 - ";
      this.preview_input = preview_node;
      this.container.appendChild(preview_node);

      if(this.schema.description || this.schema.descriptionTemplate) {
        this.description = this.theme.getDescription(this.schema.description);
        this.container.appendChild(this.description);
      }
      
      this.search_result_holder = document.createElement('div');
      this.container.appendChild(this.search_result_holder);

      this.panel = this.theme.getIndentedPanel();
      this.container.appendChild(this.panel);
      this.error_holder = document.createElement('div');
      this.panel.appendChild(this.error_holder);
    } else {
      this.panel = document.createElement('div');
      this.container.appendChild(this.panel);
    }

    this.panel.appendChild(this.table);
    this.controls = this.theme.getButtonHolder();
    this.panel.appendChild(this.controls);
    var options4buttons = {
      "path4caller":this.path,
      "type4caller": this.editortype
    };
    var opt4cb = this.getOptionsCheckbox4Include(options4buttons);

    if(this.item_has_child_editors) {

      var ce = tmp.getChildEditors();
      var order = tmp.property_order || Object.keys(ce);
      for(var i=0; i<order.length; i++) {

        opt4cb = this.getOptionsCheckbox4Include(options4buttons);
        var edit4prop = ce[order[i]];
        opt4cb.key = edit4prop.key;
        opt4cb.start = 2;
        opt4cb.end = 30;
        opt4cb.preview_is_visible = edit4prop.preview_is_visible;
        var th = self.theme.getTableHeaderCell(edit4prop.getTitle(),self.getButtons4Title(opt4cb,self));
        if(edit4prop.options.hidden) th.style.display = 'none';
        self.header_row.appendChild(th);
      }

    } else {
      self.header_row.appendChild(self.theme.getTableHeaderCell(this.item_title),this.getButtons4Title(opt4cb));
    }

    tmp.destroy();
    this.row_holder.innerHTML = '';

    this.controls_header_cell = self.theme.getTableHeaderCell(" ");
    self.header_row.appendChild(this.controls_header_cell);

    self.addControls();
  },
  onChildEditorChange: function(editor) {
    this.refreshValue();
    this._super();
  },
  getItemDefault: function() {
    return $extend({},{"default":this.item_default})["default"];
  },
  getItemTitle: function() {
    return this.item_title;
  },
  getElementEditor: function(i,ignore) {
    var schema_copy = $extend({},this.schema.items);
    var editor = this.jsoneditor.getEditorClass(schema_copy, this.jsoneditor);
    var row = this.row_holder.appendChild(this.theme.getTableRow());
    var holder = row;

    if(!this.item_has_child_editors) {
      holder = this.theme.getTableCell();
      row.appendChild(holder);
    }

    var ret = this.jsoneditor.createEditor(editor,{
      jsoneditor: this.jsoneditor,
      schema: schema_copy,
      container: holder,
      
      path: this.path+'.'+i,
      parent: this,
      compact: true,
      table_row: true
    });

    ret.preBuild();
    if(!ignore) {
      ret.build();
      ret.postBuild();

      ret.controls_cell = row.appendChild(this.theme.getTableCell());
      ret.row = row;
      ret.table_controls = this.theme.getButtonHolder();
      ret.controls_cell.appendChild(ret.table_controls);
      ret.table_controls.style.margin = 0;
      ret.table_controls.style.padding = 0;
    }

    return ret;
  },
  destroy: function() {
    this.innerHTML = '';
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.question && this.question.parentNode) this.question.parentNode.removeChild(this.question);
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.row_holder && this.row_holder.parentNode) this.row_holder.parentNode.removeChild(this.row_holder);
    
    if(this.table && this.table.parentNode) this.table.parentNode.removeChild(this.table);
    
    if(this.panel && this.panel.parentNode) this.panel.parentNode.removeChild(this.panel);

    this.rows = this.title = this.question = this.description = this.row_holder = this.table = this.panel = null;

    this._super();
  },
  getValue: function() {
    return this._super();
  },
  setValue: function(value, initial) {
    
    value = value || [];

    if(this.schema.minItems) {
      while(value.length < this.schema.minItems) {
        value.push(this.getItemDefault());
      }
    }
    if(this.schema.maxItems && value.length > this.schema.maxItems) {
      value = value.slice(0,this.schema.maxItems);
    }

    var serialized = JSON.stringify(value);
    if(serialized === this.serialized) return;

    var numrows_changed = false;

    var self = this;
    $each(value,function(i,val) {
      if(self.rows[i]) {
        
        self.rows[i].setValue(val);
      }
      else {
        self.addRow(val);
        numrows_changed = true;
      }
    });

    for(var j=value.length; j<self.rows.length; j++) {
      var holder = self.rows[j].container;
      if(!self.item_has_child_editors) {
        self.rows[j].row.parentNode.removeChild(self.rows[j].row);
      }
      self.rows[j].destroy();
      if(holder.parentNode) holder.parentNode.removeChild(holder);
      self.rows[j] = null;
      numrows_changed = true;
    }
    self.rows = self.rows.slice(0,value.length);

    self.refreshValue();
    if(numrows_changed || initial) self.refreshRowButtons();

    self.onChange();

  },
  refreshRowButtons: function() {
    var self = this;

    var minItems = this.schema.minItems && this.schema.minItems >= this.rows.length;

    var need_row_buttons = false;
    $each(this.rows,function(i,editor) {
      
      if(editor.movedown_button) {
        if(i === self.rows.length - 1) {
          editor.movedown_button.style.display = 'none';
        }
        else {
          need_row_buttons = true;
          editor.movedown_button.style.display = '';
        }
      }

      if(editor.delete_button) {
        if(minItems) {
          editor.delete_button.style.display = 'none';
        }
        else {
          need_row_buttons = true;
          editor.delete_button.style.display = '';
        }
      }

      if(editor.moveup_button) {
        need_row_buttons = true;
      }
    });

    $each(this.rows,function(i,editor) {
      if(need_row_buttons) {
        editor.controls_cell.style.display = '';
      }
      else {
        editor.controls_cell.style.display = 'none';
      }
    });
    if(need_row_buttons) {
      this.controls_header_cell.style.display = '';
    }
    else {
      this.controls_header_cell.style.display = 'none';
    }

    var controls_needed = false;

    if(!this.value.length) {
      this.delete_last_row_button.style.display = 'none';
      this.remove_all_rows_button.style.display = 'none';
      this.table.style.display = 'none';
    }
    else if(this.value.length === 1) {
      this.table.style.display = '';
      this.remove_all_rows_button.style.display = 'none';

      if(minItems || this.hide_delete_last_row_buttons) {
        this.delete_last_row_button.style.display = 'none';
      }
      else {
        this.delete_last_row_button.style.display = '';
        controls_needed = true;
      }
    }
    else {
      this.table.style.display = '';

      if(minItems || this.hide_delete_last_row_buttons) {
        this.delete_last_row_button.style.display = 'none';
      }
      else {
        this.delete_last_row_button.style.display = '';
        controls_needed = true;
      }

      if(minItems || this.hide_delete_all_rows_buttons) {
        this.remove_all_rows_button.style.display = 'none';
      }
      else {
        this.remove_all_rows_button.style.display = '';
        controls_needed = true;
      }
    }

    if((this.schema.maxItems && this.schema.maxItems <= this.rows.length) || this.hide_add_button) {
      this.add_row_button.style.display = 'none';
    }
    else {
      this.add_row_button.style.display = '';
      controls_needed = true;
    }

    if(!controls_needed) {
      this.controls.style.display = 'none';
    }
    else {
      this.controls.style.display = '';
    }
  },
  refreshValue: function() {
    var self = this;
    this.value = [];

    $each(this.rows,function(i,editor) {
      
      self.value[i] = editor.getValue();
    });
    this.serialized = JSON.stringify(this.value);
  },
  addRow: function(value) {
    var self = this;
    var i = this.rows.length;

    self.rows[i] = this.getElementEditor(i);

    var controls_holder = self.rows[i].table_controls;

    if(!this.hide_delete_buttons) {
      self.rows[i].delete_button = this.getButton('','delete',this.translate('button_delete_row_title_short'));
      self.rows[i].delete_button.className += ' delete';
      self.rows[i].delete_button.setAttribute('data-i',i);
      self.rows[i].delete_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        var i = this.getAttribute('data-i')*1;

        var value = self.getValue();

        var newval = [];
        $each(value,function(j,row) {
          if(j===i) return; 
          newval.push(row);
        });
        self.setValue(newval);
        self.onChange(true);
      });
      controls_holder.appendChild(self.rows[i].delete_button);
    }

    if(i && !this.hide_move_buttons) {
      self.rows[i].moveup_button = this.getButton('','moveup',this.translate('button_move_up_title'));
      self.rows[i].moveup_button.className += ' moveup';
      self.rows[i].moveup_button.setAttribute('data-i',i);
      self.rows[i].moveup_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        var i = this.getAttribute('data-i')*1;

        if(i<=0) return;
        var rows = self.getValue();
        var tmp = rows[i-1];
        rows[i-1] = rows[i];
        rows[i] = tmp;

        self.setValue(rows);
        self.onChange(true);
      });
      controls_holder.appendChild(self.rows[i].moveup_button);
    }

    if(!this.hide_move_buttons) {
      self.rows[i].movedown_button = this.getButton('','movedown',this.translate('button_move_down_title'));
      self.rows[i].movedown_button.className += ' movedown';
      self.rows[i].movedown_button.setAttribute('data-i',i);
      self.rows[i].movedown_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        var i = this.getAttribute('data-i')*1;
        var rows = self.getValue();
        if(i>=rows.length-1) return;
        var tmp = rows[i+1];
        rows[i+1] = rows[i];
        rows[i] = tmp;

        self.setValue(rows);
        self.onChange(true);
      });
      controls_holder.appendChild(self.rows[i].movedown_button);
    }

    if(value) self.rows[i].setValue(value);
    self.refreshRowButtons()
  },
  X_addControls: function() {
    var self = this;

    this.collapsed = false;
    this.toggle_button = this.getButton('','collapse',this.translate('button_collapse'));
    if(this.title_controls) {
      this.title_controls.appendChild(this.toggle_button);
      this.toggle_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();

        if(self.collapsed) {
          self.collapsed = false;
          self.panel.style.display = '';
          self.setButtonText(this,'','collapse',self.translate('button_collapse'));
        }
        else {
          self.collapsed = true;
          self.panel.style.display = 'none';
          self.setButtonText(this,'','expand',self.translate('button_expand'));
        }
      });

      if(this.options.collapsed) {
        $trigger(this.toggle_button,'click');
      }

      if(this.schema.options && typeof this.schema.options.disable_collapse !== "undefined") {
        if(this.schema.options.disable_collapse) this.toggle_button.style.display = 'none';
      }
      else if(this.jsoneditor.options.disable_collapse) {
        this.toggle_button.style.display = 'none';
      }
    }

    this.add_row_button = this.getButton(this.getItemTitle(),'add',this.translate('button_add_row_title',[this.getItemTitle()]));
    this.add_row_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.addRow();
      self.refreshValue();
      self.refreshRowButtons();
      self.onChange(true);
    });
    self.controls.appendChild(this.add_row_button);

    this.delete_last_row_button = this.getButton(this.translate('button_delete_last',[this.getItemTitle()]),'delete',this.translate('button_delete_last_title',[this.getItemTitle()]));
    this.delete_last_row_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();

      var rows = self.getValue();
      rows.pop();
      self.setValue(rows);
      self.onChange(true);
    });
    self.controls.appendChild(this.delete_last_row_button);

    this.remove_all_rows_button = this.getButton(this.translate('button_delete_all'),'delete',this.translate('button_delete_all_title'));
    this.remove_all_rows_button.addEventListener('click',function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.setValue([]);
      self.onChange(true);
    });
    self.controls.appendChild(this.remove_all_rows_button);
  }
});

JSONEditor.defaults.editors.multiple = JSONEditor.AbstractEditor.extend({
  editortype: "multiple",
  register: function() {
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].unregister();
      }
      if(this.editors[this.type]) this.editors[this.type].register();
    }
    this._super();
  },
  unregister: function() {
    this._super();
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].unregister();
      }
    }
  },
  getNumColumns: function() {
    if(!this.editors[this.type]) return 4;
    return Math.max(this.editors[this.type].getNumColumns(),4);
  },
  enable: function() {
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].enable();
      }
    }
    this.switcher.disabled = false;
    this._super();
  },
  disable: function() {
    if(this.editors) {
      for(var i=0; i<this.editors.length; i++) {
        if(!this.editors[i]) continue;
        this.editors[i].disable();
      }
    }
    this.switcher.disabled = true;
    this._super();
  },
  switchEditor: function(i) {
    var self = this;

    if(!this.editors[i]) {
      this.buildChildEditor(i);
    }

    var current_value = self.getValue();

    self.type = i;

    self.register();

    $each(self.editors,function(type,editor) {
      if(!editor) return;
      if(self.type === type) {
        if(self.keep_values) editor.setValue(current_value,true);
        editor.container.style.display = '';
      }
      else editor.container.style.display = 'none';
    });
    self.refreshValue();
    self.refreshHeaderText();
  },
  buildChildEditor: function(i) {
    var self = this;
    var type = this.types[i];
    var holder = self.theme.getChildEditorHolder();
    self.editor_holder.appendChild(holder);

    var schema;

    if(typeof type === "string") {
      schema = $extend({},self.schema);
      schema.type = type;
    }
    else {
      schema = $extend({},self.schema,type);
      schema = self.jsoneditor.expandRefs(schema);

      if(type.required && Array.isArray(type.required) && self.schema.required && Array.isArray(self.schema.required)) {
        schema.required = self.schema.required.concat(type.required);
      }
    }

    var editor = self.jsoneditor.getEditorClass(schema);

    self.editors[i] = self.jsoneditor.createEditor(editor,{
      jsoneditor: self.jsoneditor,
      schema: schema,
      container: holder,
      path: self.path,
      parent: self,
      required: true
    });
    self.editors[i].preBuild();
    self.editors[i].build();
    self.editors[i].postBuild();

    if(self.editors[i].header) self.editors[i].header.style.display = 'none';

    self.editors[i].option = self.switcher_options[i];

    holder.addEventListener('change_header_text',function() {
      self.refreshHeaderText();
    });

    if(i !== self.type) holder.style.display = 'none';
  },
  preBuild: function() {
    var self = this;

    this.types = [];
    this.type = 0;
    this.editors = [];
    this.validators = [];

    this.keep_values = true;
    if(typeof this.jsoneditor.options.keep_oneof_values !== "undefined") this.keep_values = this.jsoneditor.options.keep_oneof_values;
    if(typeof this.options.keep_oneof_values !== "undefined") this.keep_values = this.options.keep_oneof_values;

    if(this.schema.oneOf) {
      this.oneOf = true;
      this.types = this.schema.oneOf;
      delete this.schema.oneOf;
    }
    else if(this.schema.anyOf) {
      this.anyOf = true;
      this.types = this.schema.anyOf;
      delete this.schema.anyOf;
    }
    else {
      if(!this.schema.type || this.schema.type === "any") {
        this.types = ['string','number','integer','boolean','object','array','null'];

        if(this.schema.disallow) {
          var disallow = this.schema.disallow;
          if(typeof disallow !== 'object' || !(Array.isArray(disallow))) {
            disallow = [disallow];
          }
          var allowed_types = [];
          $each(this.types,function(i,type) {
            if(disallow.indexOf(type) === -1) allowed_types.push(type);
          });
          this.types = allowed_types;
        }
      }
      else if(Array.isArray(this.schema.type)) {
        this.types = this.schema.type;
      }
      else {
        this.types = [this.schema.type];
      }
      delete this.schema.type;
    }

    this.display_text = this.getDisplayText(this.types);
  },
  build: function() {
    var self = this;
    var container = this.container ;

    this.header4title = this.theme.getHeader4Title(this.getTitle());
    
    this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
    
    if (container) {
      container.appendChild(this.header);
    } else {
    }

    this.switcher = this.theme.getSwitcher(this.display_text);
    container.appendChild(this.switcher);
    this.switcher.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();

      self.switchEditor(self.display_text.indexOf(this.value));
      self.onChange(true);
    });

    this.editor_holder = document.createElement('div');
    container.appendChild(this.editor_holder);

    var validator_options = {};
    if(self.jsoneditor.options.custom_validators) {
      validator_options.custom_validators = self.jsoneditor.options.custom_validators;
    }

    this.switcher_options = this.theme.getSwitcherOptions(this.switcher);
    $each(this.types,function(i,type) {
      self.editors[i] = false;

      var schema;

      if(typeof type === "string") {
        schema = $extend({},self.schema);
        schema.type = type;
      }
      else {
        schema = $extend({},self.schema,type);

        if(type.required && Array.isArray(type.required) && self.schema.required && Array.isArray(self.schema.required)) {
          schema.required = self.schema.required.concat(type.required);
        }
      }

      self.validators[i] = new JSONEditor.Validator(self.jsoneditor,schema,validator_options);
    });

    this.switchEditor(0);
  },
  onChildEditorChange: function(editor) {
    if(this.editors[this.type]) {
      this.refreshValue();
      this.refreshHeaderText();
    }

    this._super();
  },
  refreshHeaderText: function() {
    var display_text = this.getDisplayText(this.types);
    $each(this.switcher_options, function(i,option) {
      option.textContent = display_text[i];
    });
  },
  refreshValue: function() {
    this.value = this.editors[this.type].getValue();
  },
  setValue: function(val,initial) {
    
    var self = this;
    $each(this.validators, function(i,validator) {
      if(!validator.validate(val).length) {
        self.type = i;
        self.switcher.value = self.display_text[i];
        return false;
      }
    });

    this.switchEditor(this.type);

    this.editors[this.type].setValue(val,initial);

    this.refreshValue();
    self.onChange();
  },
  destroy: function() {
    $each(this.editors, function(type,editor) {
      if(editor) editor.destroy();
    });
    if(this.editor_holder && this.editor_holder.parentNode) this.editor_holder.parentNode.removeChild(this.editor_holder);
    if(this.switcher && this.switcher.parentNode) this.switcher.parentNode.removeChild(this.switcher);
    this._super();
  },
  showValidationErrors: function(errors) {
    var self = this;

    if(this.oneOf || this.anyOf) {
      var check_part = this.oneOf? 'oneOf' : 'anyOf';
      $each(this.editors,function(i,editor) {
        if(!editor) return;
        var check = self.path+'.'+check_part+'['+i+']';
        var new_errors = [];
        $each(errors, function(j,error) {
          if(error.path.substr(0,check.length)===check) {
            var new_error = $extend({},error);
            new_error.path = self.path+new_error.path.substr(check.length);
            new_errors.push(new_error);
          }
        });

        editor.showValidationErrors(new_errors);
      });
    }
    else {
      $each(this.editors,function(type,editor) {
        if(!editor) return;
        editor.showValidationErrors(errors);
      });
    }
  }
});

JSONEditor.defaults.editors["enum"] = JSONEditor.AbstractEditor.extend({
  
  editortype: "enum",
  select_container: null,
  switcher: null,
  arr4value: [],
  arr4title: [],
  getNumColumns: function() {
    return 4;
  },
  getTitle4Value: function(pValue) {
    var vTitle = "undefined title for value '"+pValue+"' ["+this.arr4value.join(",")+"]";
    if (pValue) {
      for (var i = 0; i < this.enum.length; i++) {
        if (this.enum[i].value4enum == pValue) {
          vTitle = this.enum[i].title4enum
        }
      }
    } else {
      console.warn(this.editortype+".getTitle4Value('"+this.path+"') call - pValue undefined");
    }
    return vTitle;
  },

  update4selector: function() {

    var self = this;
    var enum_source = null;
    var changed = false;

    if (self.options && self.options.enum_source) {
      var old_val = self.getValue();
      var ens = self.options.enum_source;
      var path4enum = ""; 
      var value4enum = ""; 
      var title4enum = ""; 
      
      if (ens.hasOwnProperty('path4enum')) {
        
        path4enum = ens.path4enum;
        if (ens.hasOwnProperty('value4enum')) {

          value4enum = ens.value4enum;
          if (ens.hasOwnProperty('title4enum')) {
            
            title4enum = ens.title4enum;
          } else {
            
            title4enum = value4enum;
          }
        }
        
        var enum_src_editor = self.jsoneditor.getEditor(path4enum);
        if (enum_src_editor) {
          
          var arr =  enum_src_editor.getValue();
          if (self.is_array(arr) == true) {
            this.arr4value = [];
            this.arr4title = [];

            for (var i = 0; i < arr.length; i++) {
              var rec = arr[i];
              this.arr4value.push(rec[value4enum]);
              this.arr4title.push(rec[title4enum]);
            }
            var old_index = this.arr4value.indexOf(old_val);

            changed = this.setSelectOptions(this.arr4value, this.arr4title,old_val);
            
          } else {
            console.error("ERROR: JSON editor '" + path4enum+ "' does not contain an array for the enum source");
          }
        } else {
        }

      } else {
        console.error("Updating enum_source failed becaue 'options.enum_source.path4enum' is not defined!");
      };
    } else {
    }

    if (old_val) {
      
    }
    return changed;
  },
  convert2ValueRecord: function(pValue) {
    var vRet = {
        "value4enum": "",
        "title4enum": ""
      };
    if (pValue) {
      if (typeof pValue === "string") {

            vRet.value4enum = pValue;
            vRet.title4enum = pValue
          };
      } else {
        if (pValue.value4enum) {
          {
              vRet.value4enum = pValue.value4enum;
              vRet.title4enum = (pValue.title4enum || pValue.value4enum)
          }
        }
    }
    return vRet;
  },
  parseEnumList: function (pEnumList) {
    var v4e =  [];
    var t4e =  [];
    var enumlist = pEnumList || [];
    for (var i = 0; i < enumlist.length; i++) {
      if (enumlist[i].hasOwnProperty('value4enum')) {
        v4e.push(enumlist[i].value4enum)
        if (enumlist[i].hasOwnProperty('title4enum')) {
          t4e.push(enumlist[i].title4enum);
        } else {
          t4e.push(enumlist[i].value4enum);
        }
      }
    }
    return {
      "arr4value": v4e,
      "arr4title": t4e
    }
  },
  preBuild: function() {
    var self = this;
    
    if (this.schema.enumlist) {
      var enl = this.parseEnumList(this.schema.enumlist);
      this.schema.enum         = enl.arr4value;
      this.options.enum_titles = enl.arr4title;

    }
    this._super();
  },
  build: function() {
    if ((!this.value) && (this.schema.default)) {
      
    }
    var self = this;
    var container = this.container;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if (!this.options.compact) this.title = this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    if (this.options.enumTitles) {
      
      this.options.enum_titles = this.options.enumTitles;
    }
    if (this.options.hasOwnProperty("enum_titles")) {
      console.log("Enum Titles not defined at editor [" + this.path + "] with options.enum_titles='[" + this.options.enum_titles.join(",") + "]' defined");
    } else {
      this.options.enum_titles = [];
    }

    this["enum"] = [this.convert2ValueRecord("-")];
    if (this.schema["default"]) {
      this["enum"] = [this.convert2ValueRecord(this.schema["default"])];
    };
    if (this.value) {
        this["enum"] = [this.convert2ValueRecord(this.value)]
    };
    if (this.schema["enum"]) {
      this["enum"] = this.schema["enum"]
    };
    this.selected = 0;
    this.arr4title = [];
    this.arr4values = [];

    for(var i=0; i<this["enum"].length; i++) {
      var enum_rec = this["enum"][i];
      if (typeof(enum_rec) === "string") {
        this.arr4title.push(this.options.enum_titles[i] || enum_rec);
        this.arr4values.push(enum_rec); 
      } else {
        var etitle = "Undefined Title"+i;
        if (enum_rec.title4enum) {
          etitle = enum_rec.title4enum;
        } else {
          etitle = this.options.enum_titles[i] || enum_rec.title4enum || enum_rec.value4enum || ("enum"+i);
        };
        this.arr4title.push(etitle);
        var evalue = "Undefined Value"+i;
        if (enum_rec.value4enum) {
          evalue = enum_rec.value4enum; 
        } else {
          evalue = "enum"+i;
        }
        this.arr4values.push(evalue);
      }
    }

    if (this.schema.question || this.schema.questionTemplate) {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    
    this.switcher = this.theme.getSwitcher(this.arr4values,this.arr4title);
    
    this.input = this.switcher;

    this.preview_input = this.theme.getPreviewInput("INPRE"+this.get_unique_id()+" Editor: '"+this.editortype+"' path=["+this.path+"]");

    this.input_element_id = "FORMCONTROL4"+this.get_unique_id();

    this.control = this.theme.appendFormControl(
        this.container,
        this.label, this.input,
        this.description, this.question,
        null,null,
        
        this.preview_input,this.buttons4title,
        this.input_element_id
      );

    this.switcher.addEventListener('change',function(e) {
      
      var value4switcher = this.value;
      e.preventDefault();
      e.stopPropagation();

      self.selected = self.getIndex4Value(value4switcher);
      if (self.selected < 0) {
        self.selected = self.arr4title.indexOf(value4switcher);

        if (self.selected < 0) {
          self.selected = self.arr4title.indexOf(value4switcher);

          if (self.schema.default) {
            self.selected = self.arr4title.indexOf(self.schema.default);
            if (self.selected >= 0) {
            }
          }
          
        } else {
        }
        
      } else {
      }

      self.value = self["enum"][self.selected];

      self.onChange(true);
    });
    this.switcher.addEventListener('focus',function () {
      self.update4selector();
    });

    this.value = this["enum"][0];
    this.selected = 0;
    
    if(this["enum"].length === 1) this.switcher.style.display = 'none';
  },
  postBuild: function() {
    var self = this;
    this._super();
    this.update4selector();

    if (!this.value) {
      if (this.schema.default) {
        this.selected = self.getIndex4Value(this.schema.default);
        if (self.selected >= 0) {
          this.value = this.schema.default;
          
          this.switcher.selectedIndex = self.selected;
          self.onChange(true);
        }
      }
    }
  },
  getIndex4Value: function (value) {
    var index4val = -1;
    if (this.enum.length > 0) {
        if (typeof this.enum[0] === "string") {
          for(var i=0; i<this.enum.length; i++) {
            if (this.enum[i] == value) {
              index4val = i;
            }
          }
        } else {
          for(var j=0; j<this.enum.length; j++) {
            if (this.enum[j].value4enum && (this.enum[j].value4enum == value)) {
              index4val = j;
            }
          }
        }

    }
    return index4val;
  },
  setSelectOptions: function(values, titles, seloption) {
    var changed = false;
    this.selected = -1;
    titles = titles || [];
    this.enum = [];
    this.switcher.innerHTML = '';
    var vCurrentValue = seloption || this.getValue();
    if (typeof vCurrentValue === "undefined") {
      changed = true;
    }
    for(var i=0; i<values.length; i++) {
      var option = document.createElement('option');
      var title = titles[i] || values[i];
      option.setAttribute('value',values[i]);
      option.textContent = title;
      
      this.enum.push({
        "value4enum": values[i],
        "title4enum": title
      });
      if ((typeof vCurrentValue !== "undefined") && (values[i] === vCurrentValue)) {
        this.selected = i;
        option.setAttribute('selected','selected');
        this.value = vCurrentValue;
      }
      this.switcher.appendChild(option);
    };

    return changed;
  },
  refreshValue: function() {

    var self = this;
    self.selected = -1;
    var stringified = JSON.stringify(this.value);
    $each(this["enum"], function(i, el) {
      var enumval = el.value4enum || el
      if(stringified === JSON.stringify(enumval)) {
        self.selected = i;
        return false;
      }
    });

    if(self.selected<0) {
      var en = self["enum"][0];
      var enumval = en.value4enum || en;
      this.switcher.value = enumval;
      
    } else {
      this.switcher.value = this.arr4values[this.selected];
    }
    
    this.value = (this.switcher.value) || "";
    if(typeof this.value !== "string") this.value = '';
    this.serialized = this.value;

  },
  enable: function() {
    if(!this.always_disabled) this.switcher.disabled = false;
    this._super();
  },
  disable: function() {
    this.switcher.disabled = true;
    this._super();
  },
  getHTML: function(el) {
    var self = this;

    if(el === null) {
      return '<em>null</em>';
    }
    
    else if(typeof el === "object") {
      
      var ret = '';

      $each(el,function(i,child) {
        var html = self.getHTML(child);

        if(!(Array.isArray(el))) {
          
          html = '<div><em>'+i+'</em>: '+html+'</div>';
        }

        ret += '<li>'+html+'</li>';
      });

      if(Array.isArray(el)) ret = '<ol>'+ret+'</ol>';
      else ret = "<ul style='margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;'>"+ret+'</ul>';

      return ret;
    }
    
    else if(typeof el === "boolean") {
      return el? 'true' : 'false';
    }
    
    else if(typeof el === "string") {
      return el.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    }
    
    else {
      return el;
    }
  },
  register: function() {
    this._super();
    if(!this.input) return;
    this.input.setAttribute('name',this.formname);
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    this.input.removeAttribute('name');
  },
  getAttribute4Enum: function(pID) {
    var val = "undef-"+pID;

    if (this.selected < 0) {
      if (this.enum.length > 0) {
        this.selected = 0;
      }
    };
    if ((this.enum) && (this.selected >= 0) && (this.enum.length > this.selected)) {
      if (this.enum[this.selected][pID]) {
        val = this.enum[this.selected][pID];
      };
    };
    return val;
  },
  getTitle4Enum: function(pValue) {
    return this.getAttribute4Enum('title4enum');
  },
  getSelectedValue: function() {
    return this.getValue();
  },
  getValue: function() {

    return this.value;
  },
  setValue: function(val) {
    if(this.value !== val) {
      this.value = val;
      this.refreshValue();
      this.onChange(true);
    }
  },
  destroy: function() {
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.switcher && this.switcher.parentNode) this.switcher.parentNode.removeChild(this.switcher);

    this._super();
  }
});
JSONEditor.defaults.editors.select = JSONEditor.AbstractEditor.extend({
  editortype: "select",
  input_type:'select',
  enum_options: [],
  enum_values: [],
  enum_display: [],
  setValue: function(value,initial) {
    value = this.typecast(value||'');

    var sanitized = value;
    if(this.enum_values.indexOf(sanitized) < 0) {
      sanitized = this.enum_values[0];
    }

    if(this.value === sanitized) {
      return;
    }

    this.input.value = this.enum_options[this.enum_values.indexOf(sanitized)];
    if(this.select2) this.select2.select2('val',this.input.value);
    this.value = sanitized;
    this.onChange();
  },
  register: function() {
    this._super();
    if(!this.input) return;
    this.input.setAttribute('name',this.formname);
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    this.input.removeAttribute('name');
  },
  getNumColumns: function() {
    if(!this.enum_options) return 3;
    var longest_text = this.getTitle().length;
    for(var i=0; i<this.enum_options.length; i++) {
      longest_text = Math.max(longest_text,this.enum_options[i].length+4);
    }
    return Math.min(12,Math.max(longest_text/7,2));
  },
  typecast: function(value) {
    if(this.schema.type === "boolean") {
      
      return !!value;
    } else if(this.schema.type === "number") {
      
      return 1*value;
    } else if(this.schema.type === "integer") {

      return Math.floor(value*1);
    } else {
      
      return ""+value;
    }
  },
  getValue: function() {
    return this.value;
  },
  getTitle4Value: function(pValue) {
    var vTitle = "undefined title for value '"+pValue+"'";
    if (pValue) {
      var val = this.typecast(pValue);
      var i = this.enum_values.indexOf(val);
      if (i >= 0) {
        vTitle = this.enum_display[i];
      }
    } else {
      console.warn("getTitle4Value() call - pValue undefined");
    }
    return vTitle;
  },
  preBuild: function() {
    var self = this;
    var i;

    if(this.schema["enum"]) {
      var display = this.schema.options && this.schema.options.enum_titles || [];

      $each(this.schema["enum"],function(i,option) {
        
        if (typeof(option) == "object") {
          self.enum_options[i] = ""+option.value4enum || ("val"+i);
          self.enum_display[i] = ""+(option.title4enum || display[i] || option);
          self.enum_values[i] = self.typecast(option.value4enum);
        } else {
          self.enum_options[i] = ""+option;
          self.enum_display[i] = ""+(display[i] || option);
          self.enum_values[i] = self.typecast(option);
        }
      });

      if(!this.isRequired()){
        self.enum_display.unshift(' ');
        self.enum_options.unshift('undefined');
        self.enum_values.unshift(undefined);
      }

    } else if (this.schema.type === "boolean") {
      
      self.enum_display = this.schema.options && this.schema.options.enum_titles || ['true','false'];
      self.enum_options = ['1',''];
      self.enum_values = [true,false];

      if(!this.isRequired()){
        self.enum_display.unshift(' ');
        self.enum_options.unshift('undefined');
        self.enum_values.unshift(undefined);
      }

    } else if (this.schema.enumSource) {
      
      this.enumSource = [];
      this.enum_display = [];
      this.enum_options = [];
      this.enum_values = [];

      if(!(Array.isArray(this.schema.enumSource))) {
        if(this.schema.enumValue) {
          this.enumSource = [
            {
              source: this.schema.enumSource,
              value: this.schema.enumValue
            }
          ];
        } else {
          this.enumSource = [
            {
              source: this.schema.enumSource
            }
          ];
        }
      } else {
        for(i=0; i<this.schema.enumSource.length; i++) {
          
          if(typeof this.schema.enumSource[i] === "string") {
            this.enumSource[i] = {
              source: this.schema.enumSource[i]
            };
          } else if(!(Array.isArray(this.schema.enumSource[i]))) {
            
            this.enumSource[i] = $extend({},this.schema.enumSource[i]);
          } else {
            this.enumSource[i] = this.schema.enumSource[i];
          }
        }
      }

      for(i=0; i<this.enumSource.length; i++) {
        if(this.enumSource[i].value) {
          this.enumSource[i].value = this.jsoneditor.compileTemplate(this.enumSource[i].value, this.template_engine);
        }
        if(this.enumSource[i].title) {
          this.enumSource[i].title = this.jsoneditor.compileTemplate(this.enumSource[i].title, this.template_engine);
        }
        if(this.enumSource[i].filter) {
          this.enumSource[i].filter = this.jsoneditor.compileTemplate(this.enumSource[i].filter, this.template_engine);
        }
      }
    } else {
      
      throw "'select' editor requires the enum property to be set.";
    }
  },
  build_preview: function(options,new_title) {
    this.build_value_preview(options,new_title);
  },
  build: function() {
    
    var self = this;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
    
    if (this.schema.question || this.schema.questionTemplate) {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }  
    var pre_id = "INPRE"+this.get_unique_id();
    this.preview_input = this.theme.getPreviewInput(pre_id," Editor: '"+this.editortype+"' path=["+this.path+"] with DOM-ID='"+pre_id+"'");

    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    if(this.options.compact) this.container.className += ' compact';

    this.input = this.theme.getSelectInput(this.enum_options);
    this.theme.setSelectOptions(this.input,this.enum_options,this.enum_display);

    if(this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.update_preview();
      self.onInputChange();
    });

    this.control = this.theme.appendFormControl(
        this.container,
        this.label, this.input,
        this.description, this.question,
        null,null,
        
        this.preview_input,this.buttons4title,
        this.input_element_id
    );

    this.value = this.enum_values[0];
  },
  getSelectInputValue: function () {
    var val = this.input.value;

    var new_val;
    
    if(this.enum_options.indexOf(val) === -1) {
      new_val = this.enum_values[0];
    } else {
      new_val = this.enum_values[this.enum_options.indexOf(val)];
    }
    return new_val;
  },
  onInputChange: function() {
    var new_val = this.getSelectInputValue();
    
    if(new_val === this.value) return;

    this.value = new_val;
    this.onChange(true);
  },
  setupSelect2: function() {
    
    if(window.jQuery && window.jQuery.fn && window.jQuery.fn.select2 && (this.enum_options.length > 2 || (this.enum_options.length && this.enumSource))) {
      var options = $extend({},JSONEditor.plugins.select2);
      if(this.schema.options && this.schema.options.select2_options) options = $extend(options,this.schema.options.select2_options);
      this.select2 = window.jQuery(this.input).select2(options);
      var self = this;
      this.select2.on('select2-blur',function() {
        self.input.value = self.select2.select2('val');
        self.onInputChange();
      });
      this.select2.on('change',function() {
        self.input.value = self.select2.select2('val');
        self.onInputChange();
        self.update_preview();
      });
    }
    else {
      this.select2 = null;
    }
  },
  postBuild: function() {
    this._super();
    this.theme.afterInputReady(this.input);
    this.setupSelect2();
  },
  onWatchedFieldChange: function() {
    var self = this, vars, j;

    if(this.enumSource) {
      vars = this.getWatchedFieldValues();
      var select_options = [];
      var select_titles = [];

      for(var i=0; i<this.enumSource.length; i++) {
        
        if(Array.isArray(this.enumSource[i])) {
          select_options = select_options.concat(this.enumSource[i]);
          select_titles = select_titles.concat(this.enumSource[i]);
        }
        else {
          var items = [];
          
          if(Array.isArray(this.enumSource[i].source)) {
            items = this.enumSource[i].source;
          
          } else {
            items = vars[this.enumSource[i].source];
          }

          if(items) {
            
            if(this.enumSource[i].slice) {
              items = Array.prototype.slice.apply(items,this.enumSource[i].slice);
            }
            
            if(this.enumSource[i].filter) {
              var new_items = [];
              for(j=0; j<items.length; j++) {
                if(this.enumSource[i].filter({i:j,item:items[j],watched:vars})) new_items.push(items[j]);
              }
              items = new_items;
            }

            var item_titles = [];
            var item_values = [];
            for(j=0; j<items.length; j++) {
              var item = items[j];

              if(this.enumSource[i].value) {
                item_values[j] = this.enumSource[i].value({
                  i: j,
                  item: item
                });
              }
              
              else {
                item_values[j] = items[j];
              }

              if(this.enumSource[i].title) {
                item_titles[j] = this.enumSource[i].title({
                  i: j,
                  item: item
                });
              }
              
              else {
                item_titles[j] = item_values[j];
              }
            }

            select_options = select_options.concat(item_values);
            select_titles = select_titles.concat(item_titles);
          }
        }
      }

      var prev_value = this.value;

      this.theme.setSelectOptions(this.input, select_options, select_titles);
      this.enum_options = select_options;
      this.enum_display = select_titles;
      this.enum_values = select_options;

      if(this.select2) {
        this.select2.select2('destroy');
      }

      if(select_options.indexOf(prev_value) !== -1) {
        this.input.value = prev_value;
        this.value = prev_value;
      }
      
      else {
        this.input.value = select_options[0];
        this.value = select_options[0] || "";
        if(this.parent) this.parent.onChildEditorChange(this);
        else this.jsoneditor.onChange();
        this.jsoneditor.notifyWatchers(this.path);
      }

      this.setupSelect2();
    }

    this._super();
  },
  enable: function() {
    if(!this.always_disabled) {
      this.input.disabled = false;
      if(this.select2) this.select2.select2("enable",true);
    }
    this._super();
  },
  disable: function() {
    this.input.disabled = true;
    if(this.select2) this.select2.select2("enable",false);
    this._super();
  },
  destroy: function() {
    if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if(this.question    && this.question.parentNode)    this.question.parentNode.removeChild(this.question);
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.select2) {
      this.select2.select2('destroy');
      this.select2 = null;
    }

    this._super();
  }
});
JSONEditor.defaults.editors.selectize = JSONEditor.AbstractEditor.extend({
  editortype: "selectize",
  setValue: function(value,initial) {
    value = this.typecast(value||'');

    var sanitized = value;
    if(this.enum_values.indexOf(sanitized) < 0) {
      sanitized = this.enum_values[0];
    }

    if(this.value === sanitized) {
      return;
    }

    this.input.value = this.enum_options[this.enum_values.indexOf(sanitized)];

    if(this.selectize) {
      this.selectize[0].selectize.addItem(sanitized);
    }

    this.value = sanitized;
    this.onChange();
  },
  register: function() {
    this._super();
    if(!this.input) return;
    this.input.setAttribute('name',this.formname);
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    this.input.removeAttribute('name');
  },
  getNumColumns: function() {
    if(!this.enum_options) return 3;
    var longest_text = this.getTitle().length;
    for(var i=0; i<this.enum_options.length; i++) {
      longest_text = Math.max(longest_text,this.enum_options[i].length+4);
    }
    return Math.min(12,Math.max(longest_text/7,2));
  },
  typecast: function(value) {
    if(this.schema.type === "boolean") {
      return !!value;
    }
    else if(this.schema.type === "number") {
      return 1*value;
    }
    else if(this.schema.type === "integer") {
      return Math.floor(value*1);
    }
    else {
      return ""+value;
    }
  },
  getValue: function() {
    return this.value;
  },
  preBuild: function() {
    var self = this;
    this.input_type = 'select';
    this.enum_options = [];
    this.enum_values = [];
    this.enum_display = [];
    var i;

    if (this.schema.enum) {
      var display = this.schema.options && this.schema.options.enum_titles || [];

      $each(this.schema.enum,function(i,option) {
        self.enum_options[i] = ""+option;
        self.enum_display[i] = ""+(display[i] || option);
        self.enum_values[i] = self.typecast(option);
      });
    } else if(this.schema.type === "boolean") {
      
      self.enum_display = this.schema.options && this.schema.options.enum_titles || ['true','false'];
      self.enum_options = ['1','0'];
      self.enum_values = [true,false];
    } else if(this.schema.enumSource) {
      
      this.enumSource = [];
      this.enum_display = [];
      this.enum_options = [];
      this.enum_values = [];

      if(!(Array.isArray(this.schema.enumSource))) {

        if(this.schema.enumValue) {

          this.enumSource = [
            {
              source: this.schema.enumSource,
              value: this.schema.enumValue
            }
          ];
        } else {
          
          this.enumSource = [
            {
              source: this.schema.enumSource
            }
          ];
        }
      } else {
        for(i=0; i<this.schema.enumSource.length; i++) {
          
          if(typeof this.schema.enumSource[i] === "string") {
            
            this.enumSource[i] = {
              source: this.schema.enumSource[i]
            };
          } else if(!(Array.isArray(this.schema.enumSource[i]))) {
            
            this.enumSource[i] = $extend({},this.schema.enumSource[i]);
          }
          else {
            this.enumSource[i] = this.schema.enumSource[i];
          }
        }
      }

      for(i=0; i<this.enumSource.length; i++) {
        if(this.enumSource[i].value) {
          this.enumSource[i].value = this.jsoneditor.compileTemplate(this.enumSource[i].value, this.template_engine);
        }
        if(this.enumSource[i].title) {
          this.enumSource[i].title = this.jsoneditor.compileTemplate(this.enumSource[i].title, this.template_engine);
        }
        if(this.enumSource[i].filter) {
          this.enumSource[i].filter = this.jsoneditor.compileTemplate(this.enumSource[i].filter, this.template_engine);
        }
      }
    } else {
      
      throw "'select' editor requires the enum property in the schema to be set.";
    }
  },
  build: function() {
    var self = this;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
    if (this.schema.question || this.schema.questionTemplate) {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }  
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    if(this.options.compact) this.container.className += ' compact';

    this.input = this.theme.getSelectInput(this.enum_options);
    this.theme.setSelectOptions(this.input,this.enum_options,this.enum_display);

    if(this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.onInputChange();
    });

    this.control = this.theme.getFormControl(this.label, this.input, this.description, this.question);
    this.container.appendChild(this.control);

    this.value = this.enum_values[0];
  },
  onInputChange: function() {
    var val = this.input.value;

    var sanitized = val;
    if(this.enum_options.indexOf(val) === -1) {
      sanitized = this.enum_options[0];
    }

    this.value = this.enum_values[this.enum_options.indexOf(val)];
    this.onChange(true);
  },
  setupSelectize: function() {
    
    var self = this;
    if(window.jQuery && window.jQuery.fn && window.jQuery.fn.selectize && (this.enum_options.length >= 2 || (this.enum_options.length && this.enumSource))) {
      var options = $extend({},JSONEditor.plugins.selectize);
      if(this.schema.options && this.schema.options.selectize_options) options = $extend(options,this.schema.options.selectize_options);
      this.selectize = window.jQuery(this.input).selectize($extend(options,
      {
        create: true,
        onChange : function() {
          self.onInputChange();
        }
      }));
    }
    else {
      this.selectize = null;
    }
  },
  postBuild: function() {
    this._super();
    this.theme.afterInputReady(this.input);
    this.setupSelectize();
  },
  onWatchedFieldChange: function() {
    var self = this, vars, j;

    if(this.enumSource) {
      vars = this.getWatchedFieldValues();
      var select_options = [];
      var select_titles = [];

      for(var i=0; i<this.enumSource.length; i++) {
        
        if(Array.isArray(this.enumSource[i])) {
          select_options = select_options.concat(this.enumSource[i]);
          select_titles = select_titles.concat(this.enumSource[i]);
        }
        
        else if(vars[this.enumSource[i].source]) {
          var items = vars[this.enumSource[i].source];

          if(this.enumSource[i].slice) {
            items = Array.prototype.slice.apply(items,this.enumSource[i].slice);
          }
          
          if(this.enumSource[i].filter) {
            var new_items = [];
            for(j=0; j<items.length; j++) {
              if(this.enumSource[i].filter({i:j,item:items[j]})) new_items.push(items[j]);
            }
            items = new_items;
          }

          var item_titles = [];
          var item_values = [];
          for(j=0; j<items.length; j++) {
            var item = items[j];

            if(this.enumSource[i].value) {
              item_values[j] = this.enumSource[i].value({
                i: j,
                item: item
              });
            }
            
            else {
              item_values[j] = items[j];
            }

            if(this.enumSource[i].title) {
              item_titles[j] = this.enumSource[i].title({
                i: j,
                item: item
              });
            }
            
            else {
              item_titles[j] = item_values[j];
            }
          }

          select_options = select_options.concat(item_values);
          select_titles = select_titles.concat(item_titles);
        }
      }

      var prev_value = this.value;

      this.theme.setSelectOptions(this.input, select_options, select_titles);
      this.enum_options = select_options;
      this.enum_display = select_titles;
      this.enum_values = select_options;

      if(select_options.indexOf(prev_value) !== -1) {
        this.input.value = prev_value;
        this.value = prev_value;
      }

      else {
        this.input.value = select_options[0];
        this.value = select_options[0] || "";
        if(this.parent) this.parent.onChildEditorChange(this);
        else this.jsoneditor.onChange();
        this.jsoneditor.notifyWatchers(this.path);
      }

      if(this.selectize) {
        
        this.updateSelectizeOptions(select_options);
      }
      else {
        this.setupSelectize();
      }

      this._super();
    }
  },
  updateSelectizeOptions: function(select_options) {
    var selectized = this.selectize[0].selectize,
        self = this;

    selectized.off();
    selectized.clearOptions();
    for(var n in select_options) {
      selectized.addOption({value:select_options[n],text:select_options[n]});
    }
    selectized.addItem(this.value);
    selectized.on('change',function() {
      self.onInputChange();
    });
  },
  enable: function() {
    if(!this.always_disabled) {
      this.input.disabled = false;
      if(this.selectize) {
        this.selectize[0].selectize.unlock();
      }
    }
    this._super();
  },
  disable: function() {
    this.input.disabled = true;
    if(this.selectize) {
      this.selectize[0].selectize.lock();
    }
    this._super();
  },
  destroy: function() {
    if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if(this.question    && this.question.parentNode)    this.question.parentNode.removeChild(this.question);
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.selectize) {
      this.selectize[0].selectize.destroy();
      this.selectize = null;
    }
    this._super();
  }
});
JSONEditor.defaults.editors.multiselect = JSONEditor.AbstractEditor.extend({
  editortype: "multiselect",
  preBuild: function() {
    this._super();
    var i;

    this.select_options = {};
    this.select_values = {};

    var items_schema = this.jsoneditor.expandRefs(this.schema.items || {});

    var e = items_schema["enum"] || [];
    var t = items_schema.options? items_schema.options.enum_titles || [] : [];
    this.option_keys = [];
    this.option_titles = [];
    for(i=0; i<e.length; i++) {
      
      if(this.sanitize(e[i]) !== e[i]) continue;

      this.option_keys.push(e[i]+"");
      this.option_titles.push((t[i]||e[i])+"");
      this.select_values[e[i]+""] = e[i];
    }
  },
  build_multi_checkbox: function () {
    this.inputs = {};
    this.controls = {};
    for(i=0; i<this.option_keys.length; i++) {
      this.inputs[this.option_keys[i]] = this.theme.getCheckbox();
      this.select_options[this.option_keys[i]] = this.inputs[this.option_keys[i]];
      var label = this.theme.getCheckboxLabel(this.option_titles[i]);
      var description = null;
      
      this.controls[this.option_keys[i]] = this.theme.getFormControl(label, this.inputs[this.option_keys[i]]); 
    }

    this.control = this.theme.getMultiCheckboxHolder(this.controls,this.label,this.description,this.question);
  },
  build_multi_select: function() {
    this.input = this.theme.getSelectInput(this.option_keys);
    this.theme.setSelectOptions(this.input,this.option_keys,this.option_titles);
    this.input.multiple = true;
    this.input.size = Math.min(10,this.option_keys.length);

    for(i=0; i<this.option_keys.length; i++) {
      this.select_options[this.option_keys[i]] = this.input.children[i];
    }

    if(this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.control = this.theme.getFormControl(this.label, this.input, this.description,this.question);
  },
  assign_input_onchange: function() {
    var self = this, i;
    
    this.control.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();

      var new_value = [];
      for(i = 0; i<self.option_keys.length; i++) {
        if(self.select_options[self.option_keys[i]].selected || self.select_options[self.option_keys[i]].checked) {
          new_value.push(self.select_values[self.option_keys[i]]);
        }
      }

      self.updateValue(new_value);
      self.onChange(true);
    });
  },
  build: function() {
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if (!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
    
    if (this.schema.question || this.schema.questionTemplate)    {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    if((!this.schema.format && this.option_keys.length < 8) || this.schema.format === "checkbox") {
      this.input_type = 'checkboxes';
      this.build_multi_checkbox();
    } else {
      this.input_type = 'select';
      this.build_multi_select();
    }

    this.container.appendChild(this.control);
    this.assign_input_onchange();
  },
  change: function() {
    
    this.update_multiselect();
    this._super();
  },
  setMultiSelectOptions: function(arr4value, arr4title) {
    var val = this.getValue();
    this.option_keys = arr4value;
    
    this.option_titles = arr4title || arr4value;
    this.control.outerHTML = "";
    this.select_values = {};
    for (var i = 0; i < arr4value.length; i++) {
      this.select_values[arr4value[i]+""] = arr4value[i];
    }

    var old_control = this.control;
    if ((!this.schema.format && this.option_keys.length < 8) || this.schema.format === "checkbox") {
      
      this.build_multi_checkbox();
    } else {
      
      this.build_multi_select();
    }
    
    this.container.appendChild(this.control);
    this.assign_input_onchange();
    this.setValue(val);
  },
  update_multiselect: function () {
    var self = this;
    var enum_source = null;
    
    if (self.options && self.options.enum_source) {
      console.log("Update enum_source from array '" + self.options.schema.enum_source + "' and the hash attributes '" + +"'");
      var path4enum = "";
      var value4enum = "";
      var title4enum = "";
      if (self.options.enum_source.hasOwnProperty('path4enum')) {
        
        path4enum = self.options.enum_source.path4enum;
        if (self.options.enum_source.hasOwnProperty('value4enum')) {
          
          value4enum = self.options.enum_source.value4enum;
          if (self.options.enum_source.hasOwnProperty('title4enum')) {
            title4enum = self.options.enum_source.title4enum;
          } else {
            title4enum = value4enum;
          }
        }
        
        var enum_src_editor = self.jsoneditor.getEditor(path4enum);
        if (enum_src_editor) {
          
          var arr =  enum_src_editor.getValue();
          if (self.is_array(arr) == true) {
            var arr4value = [];
            var arr4title = [];
            for (var i = 0; i < arr.length; i++) {
              var rec = arr[i];
              arr4value.push(rec[value4enum]);
              arr4title.push(rec[title4enum]);
            }
            self.setMultiSelectOptions(arr4value, arr4title);
            
          } else {
            console.error("ERROR: JSON editor '" + path4enum+ "' does not contain an array for the enum source");
          }
        } else {
          console.error("ERROR: JSON editor '" + path4enum+ "' for the enum source does not exist");
        }

      } else {
        console.error("Updating enum_source failed becaue 'options.enum_source.path4enum' is not defined!");
      };
    } else {
    }

  },
  setValue: function(value, initial) {
    var i;
    value = value || [];
    if(typeof value !== "object") value = [value];
    else if(!(Array.isArray(value))) value = [];

    for(i=0; i<value.length; i++) {
      if(typeof value[i] !== "string") value[i] += "";
    }

    var selvar = "checked";
    if (this.input_type === "select") {
      selvar = "selected";
    }
    for(i in this.select_options) {
      if(!this.select_options.hasOwnProperty(i)) continue;
      this.select_options[i][selvar] = (value.indexOf(i) !== -1);
    }

    this.updateValue(value);
    this.onChange();
  },
  setupSelect2: function() {
    if(window.jQuery && window.jQuery.fn && window.jQuery.fn.select2) {
        var options = window.jQuery.extend({},JSONEditor.plugins.select2);
        if(this.schema.options && this.schema.options.select2_options) options = $extend(options,this.schema.options.select2_options);
        this.select2 = window.jQuery(this.input).select2(options);
        var self = this;
        this.select2.on('select2-blur',function() {
            var val =self.select2.select2('val');
            self.value = val;
            self.onChange(true);
        });
    }
    else {
        this.select2 = null;
    }
  },
  onInputChange: function() {
      this.value = this.input.value;
      this.onChange(true);
  },
  postBuild: function() {
      this.update_multiselect();
      this.setupSelect2();
      this._super();
  },
  register: function() {
    this._super();
    if(!this.input) return;
    this.input.setAttribute('name',this.formname);
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    this.input.removeAttribute('name');
  },
  getNumColumns: function() {
    var longest_text = this.getTitle().length;
    for(var i in this.select_values) {
      if(!this.select_values.hasOwnProperty(i)) continue;
      longest_text = Math.max(longest_text,(this.select_values[i]+"").length+4);
    }

    return Math.min(12,Math.max(longest_text/7,2));
  },
  updateValue: function(value) {
    var changed = false;
    var new_value = [];
    for(var i=0; i<value.length; i++) {
      if(!this.select_options[value[i]+""]) {
        changed = true;
        continue;
      }
      var sanitized = this.sanitize(this.select_values[value[i]]);
      new_value.push(sanitized);
      if(sanitized !== value[i]) changed = true;
    }
    this.value = new_value;
    if(this.select2) this.select2.select2('val',this.value);
    return changed;
  },
  sanitize: function(value) {
    if(this.schema.items.type === "number") {
      return 1*value;
    }
    else if(this.schema.items.type === "integer") {
      return Math.floor(value*1);
    }
    else {
      return ""+value;
    }
  },
  enable: function() {
    if(!this.always_disabled) {
      if(this.input) {
        this.input.disabled = false;
      }
      else if(this.inputs) {
        for(var i in this.inputs) {
          if(!this.inputs.hasOwnProperty(i)) continue;
          this.inputs[i].disabled = false;
        }
      }
      if(this.select2) this.select2.select2("enable",true);
    }
    this._super();
  },
  disable: function() {
    if(this.input) {
      this.input.disabled = true;
    }
    else if(this.inputs) {
      for(var i in this.inputs) {
        if(!this.inputs.hasOwnProperty(i)) continue;
        this.inputs[i].disabled = true;
      }
    }
    if(this.select2) this.select2.select2("enable",false);
    this._super();
  },
  destroy: function() {
    if(this.select2) {
        this.select2.select2('destroy');
        this.select2 = null;
    }
    this._super();
  }
});
JSONEditor.defaults.editors.select4template = JSONEditor.defaults.editors.enum.extend({
  editortype: "select4template",

  editor4selector:null,
  preview4selector:null,
  
  editorid4boolean:null,

  editor4input:null,

  editor4output:null,

  preBuild: function() {
    if (this.options["enable_execute_button"]) {
    } else {
      this.options["enable_execute_button"] = true;
    }
    this._super();
  },
  execute: function () {
    this.askSync4Select();
    
  },
  askSync4Select: function () {
    var vEditor4Output = this.getEditor4Output();
    var vEditor4Boolean = this.getEditor4Boolean();
    var vSync = true;
    if (vEditor4Boolean) {
        vSync = vEditor4Boolean.getValue();
    }
    if (vEditor4Output) {
      var vOK = true;
      if (this.check_options_schema("ask_overwrite",false) === true) {
        vOK = confirm(this.translate("warn_overwrite") + "\nEditor: '" + vEditor4Output.getTitle()+ "'");
      };
      if (vOK == true) {
        this.sync4Select();
        if (vSync == true) {
          this.onInputChange();
        } else {
          vEditor4Output.setValue(" ");
        }
      } else {
        console.log("Template generation for editor["+vEditor4Output.path+"] cancelled")
      }
    } else {
      console.error("Editor for template output does not exist");
    }
  },
  sync4Select: function () {
    console.log(this.editortype+".sync4Select('"+this.path+"')");

    var vEditor4Select = this.getEditor4Select();
    if (vEditor4Select) {
      var new_tplid,new_tpltitle;
      var selrec = vEditor4Select.getValue();
      if (typeof selrec === "string") {
        new_tplid = selrec;
        if (typeof vEditor4Select.getTitle4Value  === 'function') {
          
          new_tpltitle = vEditor4Select.getTitle4Value(new_tplid);
        } else {
          console.warn("vEditor4Select['"+vEditor4Select.path+"'].getTitle4Value('"+new_tplid+"') not defined");
        }
      } else {
        if (selrec && selrec.value4enum) {
          new_tplid = selrec.value4enum;
          if (selrec.title4enum) {
            new_tpltitle = selrec.title4enum;
          } else {
            new_tpltitle = selrec.value4enum;
          }
        } else {
          console.warn("vEditor4Select['"+vEditor4Select.path+"'] does not provide a selected record");
        }
      }

      var vIndex = this.arr4title.indexOf(new_tplid);
      if (vIndex >= 0) {
        
        this.switcher.value = this.arr4value[vIndex];
        this.value = this.arr4value[vIndex];
        this.preview4selector.innerHTML =  new_tpltitle + " ("+ new_tplid+ ")";
        this.selected = vIndex;
        
      } else {
        
        console.warn("Template with ID='"+new_tplid+"' does not exist");
      }
    } else {
    }
  },
  syncEditor4Select: function () {
    this.sync4Select();
  },
  getValue: function() {
    
    return this.getAttribute4Enum('value4enum');
  },
  getEditor4Template: function(pID) {
    pID = pID || "output";
    var ed;
    if (this["editor4"+pID]) {
      ed = this["editor4"+pID];
    } else {
      if (this.schema["editorid4"+pID]) {
        
        ed = this.jsoneditor.getEditor(this.schema["editorid4"+pID]);
        if (ed) {
          this["editor4"+pID] = ed;
        } else {
          console.warn("WARNING: "+this.editortype+".getEditor4Template('"+this.path+"') editor4"+pID+" with id='"+this.schema["editorid4"+pID]+"' does not exist - "+pID+" for template '"+this.value+"' will not be generated");
        }
      } else {
        console.warn("WARNING: "+this.editortype+".getEditor4Template('"+this.path+"') editorid4"+pID+" is not defined in schema");
      }

    }
    return ed;
  },
  getEditorValue4Template: function(pID) {
    var ret = "";
    var ed = this.getEditor4Template(pID);
    if (ed) {
      ret = ed.getValue();
    } else {
    }
    return ret;
  },
  
  getEditor4Boolean: function() {
    return this.getEditor4Template("boolean");
  },
  getEditor4Select: function() {
    return this.getEditor4Template("select");
  },
  getEditor4Input: function() {
    return this.getEditor4Template("input");
  },
  getEditor4Output: function() {
    return this.getEditor4Template("output");
  },
  
  getEditorValue4Select: function() {
    return this.getEditorValue4Template("select");
  },
  getEditorValue4Input: function() {
    return this.getEditorValue4Template("input");
  },
  getEditorValue4Output: function() {
    return this.getEditorValue4Template("output");
  },
  onChange: function (bubble) {
    this.value = this.input.value;
    this._super(bubble);
  },
  getTemplate4Enum: function () {
    return this.getAttribute4Enum('value4enum');
  },
  onInputChange: function() {

    var val = this.getValue4Template();
    this.editor4output = this.getEditor4Output();
    if (this.editor4output) {
      if (this.check_options_schema("output_append",false) === true) {
        var appendval = this.editor4output.getValue() + val;
        this.editor4output.setValue(appendval);
      } else {
        
        this.editor4output.setValue(val);
      }
    } else {
    }
    this.onChange(true);
  },
  getValue4Template: function() {
    var out = "undefined value for template";
    this.syncEditor4Select();
    var new_val   = this.getValue();
    var new_tplid = this.getTitle4Enum();
    this.editor4input  = this.getEditor4Input();

    this.value = new_val;
    
    if (this.editor4input) {

        var vars = this.editor4input.getTemplateFieldValues();
        
        this.template4output = this.jsoneditor.compileTemplate(this.getTemplate4Enum(), this.template_engine);
        out = this.template4output(vars);
        
    } else {
    }
    return out;
  },
  build: function() {
    var self = this;
    this._super();
    this.switcher.addEventListener('change',function() {
      self.onInputChange();
    });
    if (this.schema.editorid4select) {
      var p4s = document.createElement("span");
      p4s.innerHTML = "Selector ID Template";
      this.switcher.parentNode.insertBefore(p4s,this.switcher);
      this.preview4selector = p4s;
    } else {
    }

  },
  postBuild: function() {
    var self = this;
    this._super();
    this.editor4output = this.getEditor4Output();
    if (!this.select_templates) {
      this.select_templates = {};
    }
    
    if (this.arr4value) {
      for (var i = 0; i < this.enum.length; i++) {
        var enum_rec = ""+this.enum[i];
        this.select_templates[enum_rec.title4enum] = this.jsoneditor.compileTemplate(this.enum[i].value4enum, this.template_engine);
      }
    }
    if (this.schema.editorid4select) {
      this.switcher.style.display = "none";
    };
    this.syncEditor4Select();
    this.registerTitleSelector(self);

  }
});
JSONEditor.defaults.editors["json2store"] = JSONEditor.AbstractEditor.extend({
  editortype: "json2store",
  input4json: null,
  options: {
    "hidden_editor":false,
    "hidden_preview": true
  },
  build: function() {
    
    var self = this, i;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle()+" STRING");
    if (!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
    
    if (this.schema.question || this.schema.questionTemplate) {
      var vHeader = " - Header: "+this.getTitle() + " - path='" + this.path + "'";
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    
    this.preview_input = this.theme.getPreviewInput("INPRE"+this.get_unique_id(),"src/editors/slides.js:14 - "+this.editortype+".build('"+this.path+"')");
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    this.input = this.theme.getTextareaInput();

    this.input.addEventListener('change', function (e) {
      var user_input = self.input.value;
      if (user_input) {
        try {
          var json = JSON.parse(user_input);
          self.setValue(json);
          
        }
        catch(e) {
          window.alert('invalid JSON - '+user_input);
          throw e;
        }
      } else {
        alert("user_input is not defined");
      }
    });

    this.control = this.theme.getFormControl(this.label, this.input, this.description, this.question, null, this.edit_input, this.preview_input);
    this.container.appendChild(this.control);

  },
  build_preview: function(options,new_title) {
    this.build_value_preview(options,new_title);
  },
  getValue: function() {
    return this.value;
  },
  setValue: function(val) {
    if (val) {
      this.setValue4noChangeEvent(val);
      this.onChange(true);
    }
  },
  setValue4noChangeEvent: function(val) {
    if (val) {
      this.value = val;
      this.input.value = JSON.stringify(val,null,4);
      
    }
  },
  getNumColumns: function() {
    return 2;
  }
});

JSONEditor.defaults.editors.csv2json = JSONEditor.defaults.editors.object.extend({
  editortype: "csv2json",
  format4json:"arr-of-rows",
  
  options:{
    sort: {
        perform:false,
        colkey:"undefined-col-key",
        mode4sort: "numeric" 
    },
    csv: {
      separator: ',',
      delimiter: '"',
      newline: "\n",
      headers: true,
    },
    json: {
      keyprefix:"key",
      keys: [],
      titles: []
    }
  },
  hooks: {
    castToScalar: function (value, state) {
      var hasDot = /\./;
      if (isNaN(value)) {
        return value;
      } else {
        if (hasDot.test(value)) {
          return parseFloat(value);
        } else {
          var integer = parseInt(value);
          if (isNaN(integer)) {
            return null;
          } else {
            return integer;
          }
        }
      }
    }
  },
  preBuild: function() {
    var self = this;
    var vDefault = {
      "csv":`"var1","var2","time"\r
      "8293","12.3","45,45","true","5:34"\r\n\n
      "18293","112.3","145,45","false","15:45"
      "1.2","12.3"
      `,
      "json4csv": null
    };
    
    vDefault = this.extend_with_schema_defaults(vDefault);
    var source_schema = {
      "type": "object",
      
      "title": this.getTitle(),
      "default":vDefault,
      "properties": {
        "csv": {
            "title": $check_options(self.options,"title4csv","CSV-File:"),
            "type": "string",
            "format": "textarea",
            "options":{
                "hidden":false,
                "enable_load_button":true,
                "enable_save_button":true
            }
        },
        "options4csv": {
            "title": $check_options(self.options,"options4csv","CSV-Options:"),
            "type": "object",
            
            "format": "grid2order",
            "properties": {
              "separator": {
                    "title": $check_options(self.options,"title4separator","Separator:"),
                    "type":"string",
                    "maxLength":1,
                    "options": {
                        "input_width":"35px",
                        "grid_columns":4,
                        "hidden": false
                    },
                    "default":',',
                    "propertyOrder": 10
              },
              "delimiter":{
                    "title":$check_options(self.options,"title4delimiter","Delimiter:"),
                    "type":"string",
                    "maxLength":1,
                    "options": {
                      "input_width":"35px",
                      "grid_columns":4,
                      "hidden": false
                    },
                    "default":'"',
                    "propertyOrder": 20
              },
              "nodatasymbol": {
                  "title": "Not Available Symbol",
                  "type":"string",
                  "enum":["\"\"",
                    "NA",
                    "null"
                  ],
                  "description":"Used if value in CSV was missing",
                  "options": {
                      "grid_columns":4,
                      "hidden": false
                  },
                  "default":"NA",
                  "propertyOrder": 30
              },
              "newline": {
                  "title": "New Line Symbol",
                  "type":"string",
                  "enum":[
                    "\\n",
                    "\\r\\n"
                  ],
                  "options": {
                    "grid_columns":4,
                    "hidden": true
                  },
                  "default":"\\n",
                  "propertyOrder": 40
              },
              "type4json": {
                "title": "JSON Type",
                "type":"string",
                "description":"Format of the generated JSON",
                "enum":[
                  "array4rows",
                  "array4cols",
                  "json4plotly",
                  "json4morris"
                ],
                "options": {
                  "enumTitles":[
                    "Array of Rows",
                    "Array of Cols",
                    "Plotly Graph",
                    "MorrisJS Graph"
                  ],
                  "grid_columns":4,
                  "hidden": false
                },
                "default":"json4morris",
                "propertyOrder": 50
              },
              "useheader": {
                  "type": "boolean",
                  "title": $check_options(self.options,"title4useheadercheckbox","Use Header in CSV:"),
                  "format": "checkbox",
                  "default": true,
                  "question": $check_options(self.options,"title4useheaderquestion","Does the CSV file has a header as first line?"),
                  "description": "Check if CSV file contains a header as first line of the CSV",
                  "options": {
                      "grid_columns":4,
                      "hidden": false
                  },
                  "propertyOrder": 60
              },
              "colprefix": {
                  "title": "Header Prefix",
                  "type":"string",
                  "default":"val",
                  "options": {
                    
                    "grid_columns":4,
                    "hidden": false
                  },
                  "propertyOrder": 70
              }

            },
            "options":{
                "small_header":true,
                "collapsed":true,
                "hidden":false,
                "enable_load_button":true,
                "enable_save_button":true
            }
        },
        "json4csv": {
            "title": $check_options(self.options,"title4json","JSON for CSV:"),
            "type": "json2store",
            "options":{
                "hidden":false,
                "enable_load_button":true,
                "enable_save_button":true
            }
        }
      }
    };
    
    var updated_schema = this.extend_from_schema(source_schema);

    self._super();
  },
  build:function () {
    this._super();
  },
  postBuild: function () {
    this._super();
  },
  generateJSON: function (options) {
    options = options || this.getOptions4JSON() || {};
    var val = this.getValue4CSV();
    if (val) {
      var csv_sanitized = this.check_newline(val);

      var arr;
      switch (options.type4json) {
        case "plotly":
          arr = this.toArrayOfObjects(csv_sanitized);
        break;
        case "json4morris":
          arr = this.toObject4MorrisJS(csv_sanitized);
        break;
        case "array4rows":
          arr = this.toArrayOfRows(csv_sanitized);
        break;
        case "array4cols":
          arr = this.toArrayOfCols(csv_sanitized);
        break;
        default:
          arr = this.toArrayOfCols(csv_sanitized);
      }

      this.editors["json4csv"].setValue4noChangeEvent(arr);
      
    } else {
    }

  },
  onChildEditorChange: function(editor) {
    console.log("Editor ["+editor.key+"] ["+editor.path+"] call onChildEditorChange() of editor ["+this.path+"]");
    var vKey = editor.key;
    var options = this.getOptions4JSON();
    
    switch (vKey) {
      case "csv":
        this.generateJSON(options);
      break;
      case "options4csv":
        this.generateJSON(options);
      break;
      case "json4csv":
        var val = this.getValue4JSON();
        
        if (val) {
          this.setValue4JSON(val);
        } else {
          console.error("JSON error - JSON ["+this.path+".json4csv] could not been parsed!");
        }
      break;
      default:

    }
    this.onChange(true);
  },
  getValue4JSON: function () {
    var ed4j = this.editors["json2csv"];
    if (ed4j) {
      return ed4j.getValue()
    } else {
      console.warn("json2csv-Editor does not exist");
    }
  },
  setValue4JSON: function (val) {
    this.editors["json2csv"].setValue(val);
  },
  getOptions4JSON: function () {
    var ed4j = null;
    var vOptions =  {
        "type4json":"array4rows",
        "separator": ",",
        "delimiter": "\"",
        "newline": "\\n",
        "colprefix": "val",
        "nodatasymbol": "NA",
        "useheader": true
      };
    if (this.editors && this.editors["options4csv"] && this.editors.options4csv["getValue"]) {
       ed4j = this.editors["options4csv"];
       var opt = ed4j.getValue();
       if (opt) {
         vOptions = opt;
       } else {
         console.warn("Generated Subeditor 'options4csv' is missing - using default values for options4csv "+JSON.stringify(vOptions,null,4));
       }
    };
    return vOptions;
  },
  setOptions4CSV: function (val) {
    var ed4j = this.editors["options4csv"];
    if (ed4j) {
      this.editors["options4csv"].setValue(val);
    } else {
      console.warn("options4csv-Editor does not exist");
    }
  },
  getValue4CSV: function () {
    var ed4j = this.editors["csv"];
    if (ed4j) {
      return ed4j.getValue()
    } else {
      console.warn("csv-Editor does not exist");
    }
  },
  setValue4CSV: function (val) {
    var ed4j = this.editors["csv"];
    if (ed4j) {
      this.editors["csv"].setValue(val);
    } else {
      console.warn("csv-Editor does not exist");
    }
  },
  escapeString: function (pString) {
      var ret = "";
      if (pString) {
        ret = pString.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      }
      return ret
  },
  set_inital_state: function (options) {

    if (!options.state.rowNum) {
      options.state.rowNum = 1;
    }
    if (!options.state.colNum) {
      options.state.colNum = 1;
    }

  },
  parse: function (csv, options) {
    
      options = options || this.getOptions4JSON();
      var self = this;
      if (!csv) {
        csv = "parser, content, undefined\n 1,2,3.4"
      }
      
      var separator = options.separator;
      var delimiter = options.delimiter;

      var data = [];
      var entry = [];
      var state = 0;
      var value = '';
      var exit = false;

      function endOfEntry () {
        
        state = 0;
        value = '';

        if (options.start && options.state.rowNum < options.start) {
          
          entry = [];
          options.state.rowNum++;
          options.state.colNum = 1;
          return;
        }

        if (options.onParseEntry === undefined) {
          
          data.push(entry);
        } else {
          var hookVal = options.onParseEntry(entry, options.state); 
          
          if (hookVal !== false) {
            data.push(hookVal);
          }
        }

        entry = [];

        if (options.end && options.state.rowNum >= options.end) {
          exit = true;
        }

        options.state.rowNum++;
        options.state.colNum = 1;
      }

      function endOfValue () {
        if (options.onParseValue === undefined) {
          
          entry.push(value);
        } else if (options.headers && options.state.rowNum === 1) {
          
          entry.push(value);
        } else {
          var hook = options.onParseValue(value, options.state); 
          
          if (hook !== false) {
            entry.push(hook);
          }
        }

        value = '';
        state = 0;
        
        options.state.colNum++;
      }

      var escSeparator = self.escapeString(separator);
      var escDelimiter = self.escapeString(delimiter);

      var match = /(D|S|\r\n|\n|\r|[^DS\r\n]+)/;
      var matchSrc = match.source;
      matchSrc = matchSrc.replace(/S/g, escSeparator);
      matchSrc = matchSrc.replace(/D/g, escDelimiter);
      match = new RegExp(matchSrc, 'gm');

      csv.replace(match, function (pChar) {
        if (exit) {
          return;
        }
        switch (state) {
          
          case 0:
            
            if (pChar === separator) {
              value += '';
              endOfValue();
              break;
            }
            
            if (pChar === delimiter) {
              state = 1;
              break;
            }
            
            if (/^(\r\n|\n|\r)$/.test(pChar)) {
              endOfValue();
              endOfEntry();
              break;
            }
            
            value += pChar;
            state = 3;
            break;

          case 1:
            
            if (pChar === delimiter) {
              state = 2;
              break;
            }
            
            value += pChar;
            state = 1;
            break;

          case 2:
            
            if (pChar === delimiter) {
              value += pChar;
              state = 1;
              break;
            }
            
            if (pChar === separator) {
              endOfValue();
              break;
            }
            
            if (/^(\r\n|\n|\r)$/.test(pChar)) {
              endOfValue();
              endOfEntry();
              break;
            }
            
            throw Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');

          case 3:
            
            if (pChar === separator) {
              endOfValue();
              break;
            }
            
            if (/^(\r\n|\n|\r)$/.test(pChar)) {
              endOfValue();
              endOfEntry();
              break;
            }
            if (pChar === delimiter) {
            
              throw Error('CSV Data Error: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
            }
            
            throw Error('CSV Data Error: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
          default:
            
            throw Error('CSV Data Error: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
        }
        
      });

      if (entry.length !== 0) {
        endOfValue();
        endOfEntry();
      }

      return data;
    },

    splitLines: function (csv, options) {
      options = options || this.getOptions4JSON();
      
    var self = this;
      if (!csv) {
        return undefined;
      }

      var separator = options.separator || this.options.csv.separator;
      var delimiter = options.delimiter || this.options.csv.delimiter;

      options.state = options.state || {};
      if (!options.state.rowNum) {
        options.state.rowNum = 1;
      }

      var entries = [];
      var state = 0;
      var entry = '';
      var exit = false;

      function endOfLine () {
        
        state = 0;

        if (options.start && options.state.rowNum < options.start) {
          
          entry = '';
          options.state.rowNum++;
          return;
        }

        if (options.onParseEntry === undefined) {
          
          entries.push(entry);
        } else {
          var hookVal = options.onParseEntry(entry, options.state); 
          
          if (hookVal !== false) {
            entries.push(hookVal);
          }
        }

        entry = '';

        if (options.end && options.state.rowNum >= options.end) {
          exit = true;
        }

        options.state.rowNum++;
      }

      var escSeparator = self.escapeString(separator);
      var escDelimiter = self.escapeString(delimiter);

      var match = /(D|S|\n|\r|[^DS\r\n]+)/;
      var matchSrc = match.source;
      matchSrc = matchSrc.replace(/S/g, escSeparator);
      matchSrc = matchSrc.replace(/D/g, escDelimiter);
      match = new RegExp(matchSrc, 'gm');

      csv.replace(match, function (pChar) {

        if (exit) {
          return;
        }
        switch (state) {
          
          case 0:
            
            if (pChar === separator) {
              entry += pChar;
              state = 0;
              break;
            }
            
            if (pChar === delimiter) {
              entry += pChar;
              state = 1;
              break;
            }
            
            if (pChar === '\n') {
              endOfLine();
              break;
            }
            
            if (/^\r$/.test(pChar)) {
              break;
            }
            
            entry += pChar;
            state = 3;
            break;

          case 1:
            
            if (pChar === delimiter) {
              entry += pChar;
              state = 2;
              break;
            }
            
            entry += pChar;
            state = 1;
            break;

          case 2:
            
            var prevChar = entry.substr(entry.length - 1);
            if (pChar === delimiter && prevChar === delimiter) {
              entry += pChar;
              state = 1;
              break;
            }
            
            if (pChar === separator) {
              entry += pChar;
              state = 0;
              break;
            }
            
            if (pChar === '\n') {
              endOfLine();
              break;
            }
            
            if (pChar === '\r') {
              break;
            }
            
            throw Error('CSVDataError: Illegal state [Row:' + options.state.rowNum + ']');

          case 3:
            
            if (pChar === separator) {
              entry += pChar;
              state = 0;
              break;
            }
            
            if (pChar === '\n') {
              endOfLine();
              break;
            }
            
            if (pChar === '\r') {
              break;
            }
            
            if (pChar === delimiter) {
              throw Error('CSV-Data Error: Illegal quote [Row:' + options.state.rowNum + ']');
            }
            
            throw Error('CSV-Data Error: Illegal state [Row:' + options.state.rowNum + ']');
          default:
            
            throw Error('CSV-Data Error: Unknown state [Row:' + options.state.rowNum + ']');
        }
        
      });

      if (entry !== '') {
        endOfLine();
      }

      return entries;
    },

    parseEntry: function (csv, options) {
      options = options || this.getOptions4JSON();
      var self = this;
      
      var separator = options.separator;
      var delimiter = options.delimiter;

      if (!options.state.rowNum) {
        options.state.rowNum = 1;
      }
      if (!options.state.colNum) {
        options.state.colNum = 1;
      }

      var entry = [];
      var state = 0;
      var value = '';

      function endOfValue () {
        if (options.onParseValue === undefined) {
          
          entry.push(value);
        } else {
          var hook = options.onParseValue(value, options.state); 
          
          if (hook !== false) {
            entry.push(hook);
          }
        }
        
        value = '';
        state = 0;
        
        options.state.colNum++;
      }

      if (!options.match) {
        
        var escSeparator = self.escapeString(separator);
        var escDelimiter = self.escapeString(delimiter);

        var match = /(D|S|\n|\r|[^DS\r\n]+)/;
        var matchSrc = match.source;
        matchSrc = matchSrc.replace(/S/g, escSeparator);
        matchSrc = matchSrc.replace(/D/g, escDelimiter);
        options.match = new RegExp(matchSrc, 'gm');
      }

      csv.replace(options.match, function (pChar) {
        switch (state) {
          
          case 0:
            
            if (pChar === separator) {
              value += '';
              endOfValue();
              break;
            }
            
            if (pChar === delimiter) {
              state = 1;
              break;
            }
            
            if (pChar === '\n' || pChar === '\r') {
              break;
            }
            
            value += pChar;
            state = 3;
            break;

          case 1:
            
            if (pChar === delimiter) {
              state = 2;
              break;
            }
            
            value += pChar;
            state = 1;
            break;

          case 2:
            
            if (pChar === delimiter) {
              value += pChar;
              state = 1;
              break;
            }
            
            if (pChar === separator) {
              endOfValue();
              break;
            }
            
            if (pChar === '\n' || pChar === '\r') {
              break;
            }
            
            throw Error('CSVDataError: Illegal State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');

          case 3:
            
            if (pChar === separator) {
              endOfValue();
              break;
            }
            
            if (pChar === '\n' || pChar === '\r') {
              break;
            }
            
            if (pChar === delimiter) {
              throw Error('CSVDataError: Illegal Quote [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
            }
            
            throw Error('CSVDataError: Illegal Data [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
          default:
            
            throw Error('CSVDataError: Unknown State [Row:' + options.state.rowNum + '][Col:' + options.state.colNum + ']');
        }
        
      });

      endOfValue();

      return entry;
  },
  helpers: {

    collectPropertyNames: function (objects) {
      var o = [];
      var propName = [];
      var props = [];
      for (o in objects) {
        for (propName in objects[o]) {
          if ((objects[o].hasOwnProperty(propName)) &&
              (props.indexOf(propName) < 0) &&
              (typeof objects[o][propName] !== 'function')) {
            props.push(propName);
          }
        }
      }
      return props;
    }
  },
  toArray: function (csv, options, callback) {

    if (options !== undefined && typeof (options) === 'function') {
      if (callback !== undefined) {
        console.warn("It seems that you used callback function as second parameter - use 'null' or '{}' as second parameter");
        callback = options;
      }
      options = {};
    }

    options = (options !== undefined ? options : {});
    var config = {};
    config.callback = ((callback !== undefined && typeof (callback) === 'function') ? callback : false);
    config.separator = 'separator' in options ? options.separator : this.options.csv.separator;
    config.delimiter = 'delimiter' in options ? options.delimiter : this.options.csv.delimiter;
    var state = (options.state !== undefined ? options.state : {});

    options = {
      delimiter: config.delimiter,
      separator: config.separator,
      onParseEntry: options.onParseEntry,
      onParseValue: options.onParseValue,
      state: state
    };

    var entry = this.parseEntry(csv, options);

    if (!config.callback) {
      return entry;
    } else {
      config.callback('', entry);
    }
  },
  toArrayOfCols: function (csv, options, callback) {
    options = options || this.getOptions4JSON();
    
    var a4cols = [];
    var a4rows = this.toArrayOfRows(csv, options, callback);

    var col_header;
    var col_count;
    var wrong_header_cols = [];
    var header_cols = [];

    if (a4rows && a4rows.length > 0) {
      col_header = a4rows[0]; 
      col_count  = a4rows[0].length;
      var a4cols = [];
      for (var i = 0; i < col_count; i++) {
        a4cols.push([]);
      }
      
      if ($check_options(options,"useheader",true) == false) {

        col_header = []
        for (var i = 0; i < col_count; i++) {
          col_header[i] = options.colprefix+""+i;
        }
      } else {

        for (var i = 0; i < col_count; i++) {
          
          var col_title = (col_header[i]).replace(/[^a-zA-Z0-9]/g,"");
          if (col_title) {
              if (col_title != col_header[i]) {
                wrong_header_cols.push(col_header[i]);
              };
              col_header[i] = col_title;
          } else {
            col_header[i] = options.colprefix+""+(i+1);
            
          }
        }
        
        if (wrong_header_cols.length > 0) {
          alert("Incompatible header ['"+wrong_header_cols.join("','")+"']")
        }
      }
      var vNA = options.nodatasymbol;
      if (vNA == "null") {
        vNA = null;
      }
      for (var k = 0; k < a4rows.length; k++) {
        var row = a4rows[k];
        for (var j = 0; j < col_count; j++) {
          var col_value = row[j] || options.nodatasymbol || "NA";
          (a4cols[j]).push(col_value);
        }
      }
    }
    return a4cols;
  },
  toArrayOfRows: function (csv, options, callback) {
    
    if (typeof(csv) === "string") {
      console.log("CALL toArrayOfRows() with 'csv' is of type string:\n"+JSON.stringify(csv));
    } else {
      console.error("ERROR: csv is not of type string");
      return []
      
    };

    if (options !== undefined && typeof (options) === 'function') {
      if (callback !== undefined) {
        
        console.warn("It seems that you used callback function as second parameter - use 'null' or '{}' as second parameter");
        callback = options;
      }
      options = {};
    }

    options = (options !== undefined ? options : {});
    var config = {};
    config.callback = ((callback !== undefined && typeof (callback) === 'function') ? callback : false);
    config.separator = 'separator' in options ? options.separator : this.options.csv.separator;
    config.delimiter = 'delimiter' in options ? options.delimiter : this.options.csv.delimiter;

    var data = [];
    options = {
      delimiter: config.delimiter,
      separator: config.separator,
      onPreParse: options.onPreParse,
      onParseEntry: options.onParseEntry,
      onParseValue: options.onParseValue,
      onPostParse: options.onPostParse,
      start: options.start,
      end: options.end,
      state: {
        rowNum: 1,
        colNum: 1
      }
    };

    if (options.onPreParse !== undefined) {
      csv = options.onPreParse(csv, options.state);
    }

    data = this.parse(csv, options);

    if (options.onPostParse !== undefined) {
      data = options.onPostParse(data, options.state);
    }

    if (!config.callback) {
      return data;
    } else {
      config.callback('', data);
    }
  },
  fromArrayOfRows: function (arrays, options, callback) {

    if (options !== undefined && typeof (options) === 'function') {
      if (callback !== undefined) {
        return console.error('You cannot use the callback function with the 2nd argument being a function');
      }
      callback = options;
      options = {};
    }

    options = options || this.getOptions4JSON()
    var config = {};
    config.callback = ((callback !== undefined && typeof (callback) === 'function') ? callback : false);
    config.separator = 'separator' in options ? options.separator : this.options.csv.separator;
    config.delimiter = 'delimiter' in options ? options.delimiter : this.options.csv.delimiter;

    var output = '';
    var line;
    var lineValues;
    var i;
    var j;

    for (i = 0; i < arrays.length; i++) {
      line = arrays[i];
      lineValues = [];
      for (j = 0; j < line.length; j++) {
        var strValue = (line[j] === undefined || line[j] === null) ? '' : line[j].toString();
        if (strValue.indexOf(config.delimiter) > -1) {
          strValue = strValue.replace(new RegExp(config.delimiter, 'g'), config.delimiter + config.delimiter);
        }

        var escMatcher = '\n|\r|S|D';
        escMatcher = escMatcher.replace('S', config.separator);
        escMatcher = escMatcher.replace('D', config.delimiter);

        if (strValue.search(escMatcher) > -1) {
          strValue = config.delimiter + strValue + config.delimiter;
        }
        lineValues.push(strValue);
      }
      output += lineValues.join(config.separator) + '\n';
    }

    if (!config.callback) {
      return output;
    } else {
      config.callback('', output);
    }
  },

  toArrayOfObjects: function (csv, options, callback) {
    
    if (options !== undefined && typeof (options) === 'function') {
      if (callback !== undefined) {
        return console.error('You cannot 3 arguments with the 2nd argument being a function');
      }
      callback = options;
      options = {};
    }

    options = (options !== undefined ? options : {});
    var config = {};
    config.callback = ((callback !== undefined && typeof (callback) === 'function') ? callback : false);
    config.separator = 'separator' in options ? options.separator : this.options.csv.separator;
    config.delimiter = 'delimiter' in options ? options.delimiter : this.options.csv.delimiter;
    config.headers = 'headers' in options ? options.headers : this.options.csv.headers;
    options.start = 'start' in options ? options.start : 1;

    if (config.headers) {
      options.start++;
    }
    if (options.end && config.headers) {
      options.end++;
    }

    var lines = [];
    var data = [];

    options = {
      delimiter: config.delimiter,
      separator: config.separator,
      onPreParse: options.onPreParse,
      onParseEntry: options.onParseEntry,
      onParseValue: options.onParseValue,
      onPostParse: options.onPostParse,
      start: options.start,
      end: options.end,
      state: {
        rowNum: 1,
        colNum: 1
      },
      match: false,
      transform: options.transform
    };

    var headerOptions = {
      delimiter: config.delimiter,
      separator: config.separator,
      start: 1,
      end: 1,
      state: {
        rowNum: 1,
        colNum: 1
      },
      headers: true
    };

    if (options.onPreParse !== undefined) {
      csv = options.onPreParse(csv, options.state);
    }

    var headerLine = this.parsers.splitLines(csv, headerOptions);
    var headers = this.toArray(headerLine[0], headerOptions);

    lines = this.parsers.splitLines(csv, options);

    options.state.colNum = 1;
    if (headers) {
      options.state.rowNum = 2;
    } else {
      options.state.rowNum = 1;
    }

    for (var i = 0, len = lines.length; i < len; i++) {
      var entry = this.toArray(lines[i], options);
      var object = {};
      for (var j = 0; j < headers.length; j++) {
        object[headers[j]] = entry[j];
      }
      if (options.transform !== undefined) {
        data.push(options.transform.call(undefined, object));
      } else {
        data.push(object);
      }

      options.state.rowNum++;
    }

    if (options.onPostParse !== undefined) {
      data = options.onPostParse(data, options.state);
    }

    if (!config.callback) {
      return data;
    } else {
      config.callback('', data);
    }
  },
  fromArrayOfObjects: function (objects, options, callback) {
    
    if (options !== undefined && typeof (options) === 'function') {
      if (callback !== undefined) {
        console.log('use callback function as 2nd argument');
      }
      callback = options;
      options = {};
    }

    options = (options !== undefined ? options : {});
    var config = {};
    config.callback = ((callback !== undefined && typeof (callback) === 'function') ? callback : false);
    config.separator = 'separator' in options ? options.separator : this.options.csv.separator;
    config.delimiter = 'delimiter' in options ? options.delimiter : this.options.csv.delimiter;
    config.headers = 'headers' in options ? options.headers : this.options.csv.headers;
    config.sortOrder = 'sortOrder' in options ? options.sortOrder : 'declare';
    config.manualOrder = 'manualOrder' in options ? options.manualOrder : [];
    config.transform = options.transform;

    if (typeof config.manualOrder === 'string') {
      config.manualOrder = this.toArray(config.manualOrder, config);
    }

    if (config.transform !== undefined) {
      var origObjects = objects;
      objects = [];

      var i;
      for (i = 0; i < origObjects.length; i++) {
        objects.push(config.transform.call(undefined, origObjects[i]));
      }
    }

    var props = this.helpers.collectPropertyNames(objects);

    if (config.sortOrder === 'alpha') {
      props.sort();
    } 

    if (config.manualOrder.length > 0) {
      var propsManual = [].concat(config.manualOrder);
      var p;
      for (p = 0; p < props.length; p++) {
        if (propsManual.indexOf(props[p]) < 0) {
          propsManual.push(props[p]);
        }
      }
      props = propsManual;
    }

    var o;
    var line;
    var output = [];
    var propName;
    if (config.headers) {
      output.push(props);
    }

    for (o = 0; o < objects.length; o++) {
      line = [];
      for (p = 0; p < props.length; p++) {
        propName = props[p];
        if (propName in objects[o] && typeof objects[o][propName] !== 'function') {
          line.push(objects[o][propName]);
        } else {
          line.push('');
        }
      }
      output.push(line);
    }

    return this.fromArrays(output, options, config.callback);
  },

  check_newline: function (csv,pNewLine) {
    var vNewLine = pNewLine || "\n";
    console.log("csv:\n"+csv);
    
    var csv_ret = csv.replace(/([\n\r|\r\n|\n|\r]+)/g,vNewLine);
    csv_ret = csv_ret.replace(/\n[\s]+/g,vNewLine);
    return csv_ret;
  },
  rows: function (csv,pSep,pNewline){
    
    var vNewLine = pNewLine || "\n";

    var vSep = pSep || ",";
    var lines=csv.split(vNewLine);

    var result = [];

    var headers=lines[0].split(vSep);

    for(var i=1;i<lines.length;i++){

  	  var obj = {};
  	  var currentline=lines[i].split(vSep);
      
  	  for(var j=0;j<headers.length;j++){
  		  obj[headers[j]] = currentline[j];
  	  }

  	  result.push(obj);

    }

    return result; 
    
  },
  cols: function (csv,pSep,pNewline){
    
    var vNewLine = pNewLine || "\n";

    var vSep = pSep || ",";
    var lines=csv.split(vNewLine);

    var result = {};

    var headers=lines[0].split(vSep);
    for (var h = 0; h < headers.length; h++) {

      result[headers[h]]= new Array(lines.length - 1);
    }
    for(var i=1;i<lines.length;i++){
      
      var currentline=lines[i].split(vSep);
      
      for(var j=0;j<headers.length;j++){
        result[headers[j]][i] = currentline[j];
      }

      result.push(obj);

    }

    return result; 
    
  },
  array2d: function (pCSV, options, callback) {
    var csv_ret = [];
    var csv_clean = this.check_newline(pCSV);
    console.log("csv_clean="+JSON.stringify(csv_clean));
    csv_ret = this.toArrayOfRows(csv_clean, options, callback);
    
    return csv_ret;
  },
  german_decimals_convert: function (pString) {
    var vValue = null;
    var vString = "";
    if (pString && (typeof(pString) === "string")) {
      vString = pString.replace(/,/g,".");
      vValue = parseFloat(vString);
      if (isNaN(vValue)) {
        vValue = null;
      }
    } else {
      
    }
    return vValue;
  },
  toObject4MorrisJS: function (csv, options, callback) {
    options = options || this.getOptions4JSON();
    var colors = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf","#ff0000","#00ff00","#0000ff","#c0c0c0"];
    if (options) {
      if (options.colors) {
        colors = options.colors;
      } else {
      }
    } else {
    }
    var csv_ret = this.array2d(csv, options, callback);
    var header = csv_ret[0];
    
    var index = 0;
    var colorindex = 0;
    var data = [];
    var color4curve = "#00000";
    for (var i = 0; i < header.length; i++) {
      index++;
      var rec = {
          "name": "y"+index,
          
          "col": [],
          "color": colors[i],
          "title": header[i]
      };

      for (var k = 1; k < csv_ret.length; k++) {
        csv_ret[k][i] = this.german_decimals_convert(csv_ret[k][i]);
        rec.col.push(((csv_ret[k][i]) || " NA "));
      }
      
      data.push(rec);
    }
    return data;
  }

});
JSONEditor.defaults.editors.base64 = JSONEditor.AbstractEditor.extend({
  editortype: "base64",
  
  getNumColumns: function() {
    return 4;
  },
  preBuild: function () {
    this._super();
  },
  build: function() {
    var self = this;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) {
      this.title = this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
      this.container.appendChild(this.title);
    }
    
    this.input = this.theme.getFormInputField('hidden');
    this.div_input = this.theme.getParagraph(" ");
    this.div_input.appendChild(this.input);
    
    this.container.appendChild(this.input);

    if ((this.check_options_schema("readOnly",false) == true) ||
       (this.check_options_schema("enable_load_file_button",false) == true)) {
      if(!window.FileReader) throw "FileReader required for base64 editor";
      
    }

    if(this.schema.question || this.schema.questionTemplate) {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
      this.container.appendChild(this.question);
    }
    
    this.preview = this.theme.getParagraph("no file loaded");
    this.container.appendChild(this.preview);
    if(this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
      this.container.appendChild(this.description);
      
    }

    this.input_element_id = "FORMCONTROL4"+this.get_unique_id();

    self.preview_is_visible = true;
  },
  getDataURL: function() {
    return this.getValue();
  },
  setDataURL: function(value,filename) {
    var self = this;
    if (filename) {
      this.options["filename"] = filename;
    }
    self.value = value;
    self.refreshPreview();
    self.onChange(true);
  },
  save2file: function (pFilename) {
    var self = this;
    var vFilename = this.get_filename4save(null,);
    if (pFilename) {
      vFilename = pFilename;
    }
    console.log(this.editortype+".save2file('"+vFilename+"') path='"+this.path+"'");
    var dataurl = this.getValue();
    self.download_blob(vFilename,dataurl);
  },
  build_preview: function(options,new_title) {
    
    this.build_value_preview(options,new_title);
  },
  show_preview:function () {
    
    var self = this;
    if (self.check_options_schema("hidden",false) == false) {
      if (this.preview) {
        this.refreshPreview();
        this.preview.style.display = "";
        this.preview_is_visible = true;
      } else {
        
      }
    } else {
      this.hide_preview();
      
    }
  },
  hide_preview:function () {
    var self = this;
    if (this.preview) {
      this.preview.style.display = "none";
      this.preview_is_visible = false;
    } else {
    }
  },
  toggle_preview: function () {
    var self = this;
    if (self.preview_is_visible == false) {
      self.show_preview();
      self.preview_is_visible = true;
    } else {
      self.hide_preview();
      self.preview_is_visible = false;
    }
  },
  refreshPreview: function() {
    if(this.last_preview === this.value) return;
    this.last_preview = this.value;

    this.preview.innerHTML = '';

    if(!this.value) return;

    var mime = this.value.match(/^data:([^;,]+)[;,]/);
    if(mime) mime = mime[1];

    if(!mime) {
      this.preview.innerHTML = '<em>Invalid data URI</em>';
    } else {
      this.preview.innerHTML = '<strong>Type:</strong> '+mime+', <strong>Size:</strong> '+Math.floor((this.value.length-this.value.split(',')[0].length-1)/1.33333)+' bytes';
      if(mime.substr(0,5)==="image") {
        this.preview.innerHTML += '<br>';
        var img = document.createElement('img');
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100px';
        img.src = this.value;
        this.preview.appendChild(img);
      }
      if(mime.substr(0,5)==="audio") {
        this.preview.innerHTML += '<br>';
        var audio = document.createElement('audio');
        audio.setAttribute("controls",true)
        audio.src = this.value;
        this.preview.appendChild(audio);
      }
    }
  },
  enable: function() {
    if(this.uploader) this.uploader.disabled = false;
    this._super();
  },
  disable: function() {
    if(this.uploader) this.uploader.disabled = true;
    this._super();
  },
  setValue: function(val) {
    if (val && typeof(val) == "object") {
      if (val.hasOwnProperty("filename")) {

      }
    }
    if(this.value !== val) {
      this.value = val;
      this.input.value = this.value;
      this.refreshPreview();
      this.onChange();
    }
  },
  destroy: function() {
    if(this.preview && this.preview.parentNode) this.preview.parentNode.removeChild(this.preview);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.uploader && this.uploader.parentNode) this.uploader.parentNode.removeChild(this.uploader);

    this._super();
  }
});
JSONEditor.defaults.editors.upload = JSONEditor.AbstractEditor.extend({
  editortype: "upload",
  getNumColumns: function() {
    return 4;
  },
  build: function() {
    var self = this;

    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.title = this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    this.input = this.theme.getFormInputField('hidden');
    this.container.appendChild(this.input);

    if(this.check_options_schema("readOnly",false) == true) {

      if(!this.jsoneditor.options.upload) throw "Upload handler required for upload editor";

      this.uploader = this.theme.getFormInputField('file');

      this.uploader.addEventListener('change',function(e) {
        e.preventDefault();
        e.stopPropagation();

        if(this.files && this.files.length) {
          var fr = new FileReader();
          fr.onload = function(evt) {
            self.preview_value = evt.target.result;
            self.refreshPreview();
            self.onChange(true);
            fr = null;
          };
          fr.readAsDataURL(this.files[0]);
        }
      });
    }
    
    var question = this.schema.question;
    if (!question) question = '';

    this.preview_question = this.theme.getFormInputQuestion(question);
    this.container.appendChild(this.preview_question);

    var description = this.schema.description;
    if (!description) description = '';

    this.preview = this.theme.getFormInputDescription(description);
    this.container.appendChild(this.preview);

    this.control = this.theme.appendFormControl(
      this.container,
      this.label,
      this.uploader||this.input,
      this.preview,
      this.question);
    
  },
  refreshPreview: function() {
    if(this.last_preview === this.preview_value) return;
    this.last_preview = this.preview_value;

    this.preview.innerHTML = '';

    if(!this.preview_value) return;

    var self = this;

    var mime = this.preview_value.match(/^data:([^;,]+)[;,]/);
    if(mime) mime = mime[1];
    if(!mime) mime = 'unknown';

    var file = this.uploader.files[0];

    this.preview.innerHTML = '<strong>Type:</strong> '+mime+', <strong>Size:</strong> '+file.size+' bytes';
    if(mime.substr(0,5)==="image") {
      this.preview.innerHTML += '<br>';
      var img = document.createElement('img');
      img.style.maxWidth = '100%';
      img.style.maxHeight = '100px';
      img.src = this.preview_value;
      this.preview.appendChild(img);
    }
    if(mime.substr(0,4)==="text") {
      this.preview.innerHTML += '<br>';
      var textarea = document.createElement('textarea');
      textarea.style.maxWidth = '100%';
      textarea.style.maxHeight = '100px';
      textarea.value = this.preview_value;
      this.preview.appendChild(textarea);
    }

    this.preview.innerHTML += '<br>';
    var uploadButton = this.getButton('Upload', 'load', 'Upload');
    this.preview.appendChild(uploadButton);
    uploadButton.addEventListener('click',function(event) {
      event.preventDefault();

      uploadButton.setAttribute("disabled", "disabled");
      self.theme.removeInputError(self.uploader);

      if (self.theme.getProgressBar) {
        self.progressBar = self.theme.getProgressBar();
        self.preview.appendChild(self.progressBar);
      }

      self.jsoneditor.options.upload(self.path, file, {
        success: function(url) {
          self.setValue(url);

          if(self.parent) self.parent.onChildEditorChange(self);
          else self.jsoneditor.onChange();

          if (self.progressBar) self.preview.removeChild(self.progressBar);
          uploadButton.removeAttribute("disabled");
        },
        failure: function(error) {
          self.theme.addInputError(self.uploader, error);
          if (self.progressBar) self.preview.removeChild(self.progressBar);
          uploadButton.removeAttribute("disabled");
        },
        updateProgress: function(progress) {
          if (self.progressBar) {
            if (progress) self.theme.updateProgressBar(self.progressBar, progress);
            else self.theme.updateProgressBarUnknown(self.progressBar);
          }
        }
      });
    });
  },
  enable: function() {
    if(this.uploader) this.uploader.disabled = false;
    this._super();
  },
  disable: function() {
    if(this.uploader) this.uploader.disabled = true;
    this._super();
  },
  setValue: function(val) {
    if(this.value !== val) {
      this.value = val;
      this.input.value = this.value;
      this.onChange();
    }
  },
  destroy: function() {
    if(this.preview && this.preview.parentNode) this.preview.parentNode.removeChild(this.preview);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    if(this.uploader && this.uploader.parentNode) this.uploader.parentNode.removeChild(this.uploader);

    this._super();
  }
});
JSONEditor.defaults.editors.checkbox = JSONEditor.AbstractEditor.extend({
  editortype: "checkbox",
  setValue: function(value,initial) {
    this.value = !!value;
    this.input.checked = this.value;
    this.onChange();
  },
  register: function() {
    this._super();
    if(!this.input) return;
    this.input.setAttribute('name',this.formname);
  },
  unregister: function() {
    this._super();
    if(!this.input) return;
    this.input.removeAttribute('name');
  },
  getNumColumns: function() {
    return Math.min(12,Math.max(this.getTitle().length/7,2));
  },
  build: function() {
    
    var self = this;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) {

    }
    if(!this.options.compact) this.header = this.title = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    this.input = this.theme.getCheckbox();
    this.input.id = this.get_unique_id();
    
    var vSpan = document.createElement("span");
    vSpan.setAttribute("remark","Checkbox Span");
    vSpan.appendChild(this.input);
    if (this.schema.question || this.schema.questionTemplate) {
      this.container.appendChild(this.header);

      this.question = vSpan;
      vSpan.appendChild(document.createTextNode(this.schema.question));
        
    } else {
      vSpan.appendChild(document.createTextNode(this.getTitle()));

    }
    this.container.appendChild(vSpan);
    
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
      var vSpanDsc = this.get_div();
      this.container.appendChild(vSpanDsc);
      vSpanDsc.appendChild(this.description);
    }
    if (this.options.compact) this.container.className += ' compact';

    if(this.schema.readOnly || this.schema.readonly) {
      this.always_disabled = true;
      this.input.disabled = true;
    }

    this.input.addEventListener('change',function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.value = this.checked;
      self.onChange(true);
    });

  },
  enable: function() {
    if(!this.always_disabled) {
      this.input.disabled = false;
    }
    this._super();
  },
  disable: function() {
    this.input.disabled = true;
    this._super();
  },
  destroy: function() {
    if(this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);
    this._super();
  }
});
JSONEditor.defaults.editors.arraySelectize = JSONEditor.AbstractEditor.extend({
  build: function() {
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.title = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    this.title_controls = this.theme.getHeaderButtonHolder();
    this.title.appendChild(this.title_controls);
    this.error_holder = document.createElement('div');

    if(this.schema.description) {
      this.description = this.theme.getDescription(this.schema.description);
    }

    this.input = document.createElement('select');
    this.input.setAttribute('multiple', 'multiple');

    var group = this.theme.getFormControl(this.title, this.input, this.description);

    this.container.appendChild(group);
    this.container.appendChild(this.error_holder);

    window.jQuery(this.input).selectize({
      delimiter: false,
      createOnBlur: true,
      create: true
    });
  },
  postBuild: function() {
      var self = this;
      this.input.selectize.on('change', function(event) {
          self.refreshValue();
          self.onChange(true);
      });
  },
  destroy: function() {
    this.empty(true);
    if(this.title && this.title.parentNode) this.title.parentNode.removeChild(this.title);
    if(this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    if(this.input && this.input.parentNode) this.input.parentNode.removeChild(this.input);

    this._super();
  },
  empty: function(hard) {},
  setValue: function(value, initial) {
    var self = this;
    
    value = value || [];
    if(!(Array.isArray(value))) value = [value];

    this.input.selectize.clearOptions();
    this.input.selectize.clear(true);

    value.forEach(function(item) {
      self.input.selectize.addOption({text: item, value: item});
    });
    this.input.selectize.setValue(value);

    this.refreshValue(initial);
  },
  refreshValue: function(force) {
    this.value = this.input.selectize.getValue();
  },
  showValidationErrors: function(errors) {
    var self = this;

    var my_errors = [];
    var other_errors = [];
    $each(errors, function(i,error) {
      if(error.path === self.path) {
        my_errors.push(error);
      }
      else {
        other_errors.push(error);
      }
    });

    if(this.error_holder) {

      if(my_errors.length) {
        var message = [];
        this.error_holder.innerHTML = '';
        this.error_holder.style.display = '';
        $each(my_errors, function(i,error) {
          self.error_holder.appendChild(self.theme.getErrorMessage(error.message));
        });
      }
      
      else {
        this.error_holder.style.display = 'none';
      }
    }
  }
});

JSONEditor.defaults.editors.slider = JSONEditor.AbstractEditor.extend({
  editortype: "slider",
  build: function() {
    
    var self = this, i;
    
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());
    
    if(this.schema.question || this.schema.questionTemplate) {
      var vHeader = " - Header: "+this.getTitle() + " - path='" + this.path + "'";
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    
    this.preview_input = this.theme.getPreviewInput("INPRE"+this.get_unique_id(),"src/editors/slides.js:14 - "+this.editortype+".build('"+this.path+"')");
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    this.format = this.schema.format;
    if(!this.format && this.schema.media && this.schema.media.type) {
      this.format = this.schema.media.type.replace(/(^(application|text)\/(x-)?(script\.)?)|(-source$)/g,'');
    }
    if(!this.format && this.options.default_format) {
      this.format = this.options.default_format;
    }

    var min = this.schema.minimum || 0;
    var max = this.schema.maximum || Math.max(100,min+1);
    var step = (max-min)/100;
    if(this.schema.multipleOf) {
      if(min%this.schema.multipleOf) min = Math.ceil(min/this.schema.multipleOf)*this.schema.multipleOf;
      if(max%this.schema.multipleOf) max = Math.floor(max/this.schema.multipleOf)*this.schema.multipleOf;
      step = this.schema.multipleOf;
    }
    if(this.schema.step) {
      step = this.schema.step;
    }
    this.input = this.theme.getRangeInput(min,max,step);
    this.input.style.width="100%";
    this.minimum = min;
    this.maximum = max;
    this.edit_input = document.createElement('input');
    this.edit_input.setAttribute('type','text');
    this.edit_input.setAttribute("size",3);
    this.edit_input.style.marginLeft="15px";

    var span_edit_input = document.createElement('span');

    this.edit_input.addEventListener('change', function (e) {
      var user_input = self.edit_input.value;
      console.log("Value changed in edit "+self.edit_input.value);
      if(!isNaN(user_input)) {
        var val = user_input; 
        if ((val > max) || (val < min)) {
          console.warn("Value " + val +" not with the range ["+ min +","+ max+"]");
          
          self.restore_edit_value();
        } else {
          self.setValue(self.edit_input.value);
          self.update_preview();
          console.log("slider.value="+self.input.value+ " this.value="+self.value);
        }
      } else {
        console.warn("User input is not a number");
        self.restore_edit_value();
      }

    });
    this.input.addEventListener('change', function (e) {
      console.log("Input Click Value changed to "+self.input.value);
      self.edit_input.value = self.input.value;
      self.value = self.input.value;
      
      self.onChange(true);
    });
    if(this.format) this.input.setAttribute('data-schemaformat',this.format);

    this.control = this.theme.appendFormControl(this.container,this.label, this.input, this.description, this.question, null, this.edit_input, this.preview_input);

  },
  build_preview: function(options,new_title) {
    this.build_value_preview(options,new_title);
  },
  show_editor:function() {
    if (this.input) {
      this.input.style.display = "";
    }
    if (this.edit_input) {
      this.edit_input.style.display = "";
    }
    this.editor_is_visible = true;
  },
  hide_editor:function() {
    if (this.input) {
      this.input.style.display = "none";
    }
    if (this.edit_input) {
      this.edit_input.style.display = "none";
    }
    
    this.editor_is_visible = false;
  },
  show_preview:function() {
    if (this.preview_input) {
      this.preview_input.style.display = "";
    }
    this.update_preview();
    
    this.preview_is_visible = true;
  },
  hide_preview:function() {
    if (this.preview_input) {
      this.preview_input.style.display = "none";
    }
    
    this.preview_is_visible = false;
  },
  getNumColumns: function() {
    return 2;
  },
  restore_edit_value : function () {
    this.edit_input.value = this.value;
  },
  sanitize: function(value) {
    return (value+"").replace(/[^0-9\.\-\+]/g,'');
    
  },
  getNumColumns: function() {
    return 2;
  },
  getValue: function() {
    return (this.value * 1);
  },
  setValue: function(pValue,initial) {
    if (typeof pValue !== "undefined") {
      pValue = pValue * 1;
      console.log("convert defined into integer: "+pValue);
    } else {
      if (this.schema.default) {
        pValue = this.schema.default
      }
    }

    if(this.value !== pValue) {
      this.value = pValue;
      this.input.value = pValue;
      this.edit_input.value = pValue;
      
      this.onChange();
      
    }
    
  },
  refreshEditValue: function() {
    this.value = this.input.value;
    this.edit_input_value = this.input.value;
    console.log("Refresh Edit Value to "+this.edit_input_value);
  },
  X_update_preview: function(options) {
    var options = this.init_preview_options(options);
    options.container_preview.innerHTML = "";
    this.build_preview(options);
  }

});

JSONEditor.defaults.editors.circularslider = JSONEditor.defaults.editors.string.extend({
  editortype: "circularslider",
  
  preBuild: function() {
    var self = this, i;
    this._super();
    if (window.CircularSlider) {

    } else {
      console.error("please import the library 'js/circularslider.js' to your main HTML file");
    }
  },
  build: function() {
    var self = this, i;
    this._super();
    
  },
  build_preview: function(options,new_title) {
    this._super(options,new_title);
  },
  show_editor:function() {
    this._super()
  },
  hide_editor:function() {
    this._super()
  },
  show_preview:function() {
    this._super()
  },
  hide_preview:function() {
    this._super()
  },
  getNumColumns: function() {
    return 2;
  },
  sanitize: function(value) {
    return (value+"").replace(/[^0-9\.\-\+]/g,'');
    
  },
  getValue: function() {
    return (this.value * 1);
  },
  setValue: function(pValue,initial) {
    this._super(pValue,initial);
    
  },
  refreshEditValue: function() {
    this.value = this.input.value;
    this.edit_input_value = this.input.value;
    console.log("Refresh Edit Value to "+this.edit_input_value);
  },

});

JSONEditor.defaults.editors.verticalslider = JSONEditor.defaults.editors.string.extend({
  editortype: "verticalslider",
  preBuild: function() {
    var self = this, i;
    this._super();

  },
  build: function() {
    var self = this, i;

    this.schema.format = "range";
    this._super();
    var sl = this.input;
    var psl = sl.parentNode;
    psl.style.height = "220px";
    alert("offsetHeight="+psl.offsetHeight + " input.offsetHeight="+sl.offsetHeight);
    var sls = sl.style;
    sls.backgroundColor = 'red';
    sls.webkitTransform = 'rotate(90deg) translateX(100px)';

  },
  postBuild: function() {
    this._super();
    
  },
  build_preview: function(options,new_title) {
    this._super(options,new_title);
  },
  show_editor:function() {
    this._super()
  },
  hide_editor:function() {
    this._super()
  },
  show_preview:function() {
    this._super()
  },
  hide_preview:function() {
    this._super()
  },
  getNumColumns: function() {
    return 2;
  },
  sanitize: function(value) {
    return (value+"").replace(/[^0-9\.\-\+]/g,'');
    
  },
  getValue: function() {
    return (this.value * 1);
  },
  setValue: function(pValue,initial) {
    this._super(pValue,initial);
    
  },
  refreshEditValue: function() {
    this.value = this.input.value;
    this.edit_input_value = this.input.value;
    console.log("Refresh Edit Value to "+this.edit_input_value);
  },

});
JSONEditor.defaults.editors.largearray = JSONEditor.defaults.editors.object.extend({
  editortype: "largearray",
  
  aName : "myjson",
	
	aLoadedFile : "", 
	
	aData : [{}],
	
	current : 0,

  setValue: function (value,initial) {
      var vValue = value;
      if (Array.isArray(value)) {
        vValue = {
          "current":0,
          "data":value
        };
      }
      this.setArrayValue(vValue,initial);
      
  },
  getValue: function () {
      var vRet = {
          "data": this.aData,
          "current": this.current
      };
      return vRet;
  },
  getValue4Template: function (pTplID) {
    
    var self = this;
    var val4data = this.getValue();
    val = "UNDEFINED TEMPLATE with ID='"+pTplID+"': Editor: "+this.editorype + "[" +this.path + "]  create one in  schema.outputTemplates."+pTplID+" ";
    if (this.schema.outputTemplates  && this.schema.outputTemplates[pTplID]) {
      
      this.output_templates[pTplID] = this.jsoneditor.compileTemplate(this.schema.outputTemplates[pTplID], this.template_engine);
      var current_save = this.current;
      val = "";
      if(this.aData) {
        var bubble = false;
        if (this.aData && this.aData.length > 0) {
          this.output_templates[pTplID] = this.jsoneditor.compileTemplate(this.schema.outputTemplates[pTplID], this.template_engine);
          for(var i=0; i<this.aData.length; i++) {
            this.goto(""+i,bubble);
            var vars = self.getTemplateFieldValues();
            vars.self = val4data.data[i];
            var tpl_text = self.output_templates[pTplID](vars);

            val += tpl_text;
          }
          
        } else {
          console.error(this.editortype+".getValue4Template('"+pTplID+"','"+this.path+"') does not exist.");
        }
      }
      this.goto(current_save+"");
    } else {
      console.warn("Editor "+this.editortype+".getValue4Template('"+this.path+"') this.schema.outputTemplates['"+pTplID+"'] does not exist");
    }
    return val;
  },
  build: function() {
      var self = this;
      this._super();

      this.navigation.style.display = '';
      var vID_Array = ["fastbackward","backward","count","arraylength","forward","fastforward","delete_record","add_record"];
      
      for (var i = 0; i < vID_Array.length; i++) {
        
        this[vID_Array[i]+"_controls"] = this.theme.getHeaderButtonHolder();
        
        this[vID_Array[i]+"_controls"].style.display = "";
        switch (vID_Array[i]) {
          case "count":
            
            var count = document.createElement("input");
            count.setAttribute("type","text");
            count.setAttribute("size",2);
            this[vID_Array[i]+"_input"] = count;
            this[vID_Array[i]+"_controls"].appendChild(count);
          break;
          case "arraylength":
            
            var array_length = document.createElement("span");
            array_length.textContent = "MAX"
            this[vID_Array[i]+"_input"] = array_length;
            this[vID_Array[i]+"_controls"].appendChild(array_length);
          break;
          case "delete_record":
            this[vID_Array[i]+"_button"] = this.getButton('','delete','Delete Record');
            this[vID_Array[i]+"_controls"].appendChild(this[vID_Array[i]+"_button"]);
          break;
          case "add_record":
            this[vID_Array[i]+"_button"] = this.getButton('','add','Add Record');
            this[vID_Array[i]+"_controls"].appendChild(this[vID_Array[i]+"_button"]);

          break;
          default:
            this[vID_Array[i]+"_button"] = this.getButton('',vID_Array[i],vID_Array[i]);
            this[vID_Array[i]+"_controls"].appendChild(this[vID_Array[i]+"_button"]);
        }
        
        this.navigation.appendChild(this[vID_Array[i]+"_controls"]);
      }
      this.fastbackward_button.addEventListener('click',function(e) {
        self.goto(self.current-10);
      });
      this.backward_button.addEventListener('click',function(e) {
        self.goto(self.current-1);
      });
      this.count_input.addEventListener('change',function(e) {
        self.goto(parseInt(self.count_input.value)-1);
      });
      this.forward_button.addEventListener('click',function(e) {
        self.goto(self.current+1);
      });
      this.fastforward_button.addEventListener('click',function(e) {
        self.goto(self.current+10);
      });

      this.delete_record_button.addEventListener('click',function(e) {
        self.deleteAsk();
      });

      this.add_record_button.addEventListener('click',function(e) {
        self.add_record();
        self.last();
      });
      this.add_record_controls.appendChild(this.add_record_button);
      this.add_record_controls.style.display = "";
  },
  build_preview: function(preview_options) {
    var new_title = this.getTitle()+ " " + (this.current+1) +":"
    
    this._super(preview_options,new_title);
  },
  build_preview_all: function(preview_options) {
    
    if ($check_options(preview_options,"enable_preview",false) == true) {
      if (preview_options && preview_options.hasOwnProperty("container_preview")) {
        this.container_preview = preview_options["container_preview"];
        this.container_preview.style.position = 'relative';
        if ($check_options(preview_options,"hidden_preview",false) == true) {
          this.container_preview.style.display = "none";
        };
        
      } else {
        console.error("CALL: editor["+this.path+"].build_preview(options) - 'options.container_preview' was not defined");
      }
    } else {
      console.error("CALL: editor["+this.path+"].build_preview(options) - 'options' was not defined");
    }
    
    var self = this;
    var vJSON = this.getValue();
    console.log("LargeArray.build_preview() JSON: "+JSON.stringify(vJSON,null,4));
    if (vJSON.hasOwnProperty("data")) {
      var json_array = vJSON["data"];
      
      if(this.schema.question || this.schema.questionTemplate) {
        var question = this.theme.getQuestion(this.schema.question);
        
      }
      
      var subeditor_holder = this.theme.getIndentedPanel();

      if(this.schema.description || this.schema.descriptionTemplate) {
        var description = this.theme.getDescription(this.schema.description);
        
      }
      var current = this.current;
      for (var i = 0; i < json_array.length; i++) {
        console.log("build_preview() - render "+i);
        this.goto(i,false);

        var new_title = self.getTitle()+ " " + (i+1) +":"
        
        self._super(preview_options,new_title);

      };
      this.goto(current,false);
    }
  },
  render_preview: function(options) {
    var self = this;

    console.log("LargeArray.render_preview() JSON: "+JSON.stringify(vJSON,null,4));
    this._super(options);
    if (this.hasOwnProperty("aData")) {
      var json_array = this.aData;
      
      if(this.schema.question) {
        var question = this.theme.getQuestion(this.schema.question);
        
      }
      
      var subeditor_holder = this.theme.getIndentedPanel();

      if(this.schema.description) {
        var description = this.theme.getDescription(this.schema.description);
        this.container_preview.appendChild(description);
      }
      var current = this.current;
      for (var i = 0; i < json_array.length; i++) {
        this.goto(i);
        $each(this.editors, function(key,editor) {
          
        });
      }
      this.goto(current);
    } else {
      console.error("LargeArray.render_preview() data was not defined.");
    }
  },
  display_search_result : function() {
   
   if (this.search_result && this.search_result.result) {
     var msg = "";
     if (this.search_result.result.length == 0) {
         msg = this.translate('error_no_search_results');
     } else {
         msg = this.translate('message_result');
         msg += "<textarea>"+JSON.stringify(this.search_result,null,4)+"</textarea>";
     }
     console.log("MESSAGE: "+msg);
     this.search_result_holder.innerHTML = msg;
   }
   this.show_search_control();
 },
 search4array: function (pKeywordArray) {
   return this.search4largearray(pKeywordArray);
 },
 search4largearray: function (pKeywordArray) {
    
    var self = this;

    var vResultLA = [];
    var vJSON = this.getValue();
    var vArray = vJSON.data;
    this.search_result_holder.innerHTML = "";
    var srh = document.createElement("ul");
    this.search_result_holder.appendChild(srh);
    var vFound = -1;
    var vFoundArray = [];
    for (var i = 0; i < vArray.length; i++) {
    
      this.goto(i);
      console.log("LargeArray: Search record [" + i + "]");
      
      var vRecordResult = this.search_in_record(pKeywordArray);
      if (vRecordResult) {
        if (vRecordResult.result) {
          if (vRecordResult.result.length > 0) {
            vFoundArray.push(i);
            console.log("LargeArray: record "+ i+" found ['"+pKeywordArray.join("','")+"']");
            vResultLA.push(vRecordResult);
            
          } else {
            console.error("LargeArray: nothing found in record "+ i);
          }
        } else {
          console.error("LargeArray: vRecordResult.data does not exist. JSON="+JSON.stringify(vRecordResult,null,4));
        }
      } else {
        console.error("LargeArray: vRecordResult does not exist at return of this.search_in_record() call");
      }
    }
    if (vFoundArray.length > 0) {
      vFound = vFoundArray[0];
      
      $each(vFoundArray,function (i,obj) {
        var number = obj;
        var sr = document.createElement("li");
        srh.appendChild(sr);
        var but = self.getButton((number+1)+" "+self.getTitle(),"search","Result");
        sr.appendChild(but);
        but.addEventListener('click',function(e) {
          
          console.log("--src/largearray.js:327 - "+self.editortype+".search4largearray('"+self.path+"') Display Record"+number);
          self.goto(number);
        });

      });

      this.show();
      this.goto(vFound);
    }

    return vResultLA;
  },
  search_in_record: function (pKeywordArray) {
    console.log("Search in LargeArray Record '" + this.path + "." + this.current + "' with keyword [" + pKeywordArray.join(",") + "]");
    var self = this;
    var checkboxes = this.search_key_checkboxes;
    if (checkboxes) {
      console.log("Search Checkboxes for Object are defined");
      for (var key in checkboxes) {
        console.log("checkbox '"+key +"' found with boolean="+checkboxes[key].checked);
        if (checkboxes.hasOwnProperty(key)) {

        }
      }
    }
    var vRecResult = [];
    $each(this.property_order, function(j,key) {
      var editor = self.editors[key];
      var vEditorID = editor.editor_id;
      if (checkboxes && checkboxes.hasOwnProperty(key) && !(checkboxes[key].checked)) {
        console.log("Do not search in subeditor '" + key + "' because of checkbox was not checked");
        self.hide4id(vEditorID)
      } else {
        console.log("Search in LargeArray["+self.current+"] subeditor '" + key +"'");
        var vRecEditorResult = editor.search4array(pKeywordArray);
        var editor_search_result = {
          "current" : self.current,
          "path" : editor.path,
          "id": vEditorID,
          "result" : vRecEditorResult
        };
        if (vRecEditorResult.result && vRecEditorResult.result.length && (vRecEditorResult.result.length > 0)) {
          vRecResult.push(editor_search_result);
        } else {
          self.hide4id(vEditorID)
        }
      };
    });

    return {
      "path" : self.path,
      "id": self.editor_id,
      "result" :vRecResult
    };
  },
  addLargeArrayControls: function() {
    
    var self = this;

    this.large_array_controls.style = ""; 
    this.add_row_button = this.getButton(this.getItemTitle(),'add',this.translate('button_add_row_title',[this.getItemTitle()]));
    
    this.add_row_button.addEventListener('click',function(e) {
        if(self.aData) {
          
          self.aData.push({});
          self.last();
        } else {
          console.error("LargeArray add_row_button() - Array data does not exist.");
        }
    });
    this.largearray_controls.appendChild(this.add_row_button);

      this.delete_last_row_button = this.getButton(this.translate('button_delete_last',[this.getItemTitle()]),'delete',this.translate('button_delete_last_title',[this.getItemTitle()]));
      this.delete_last_row_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        var rows = self.getValue();

        var new_active_tab = null;
        if(self.rows.length > 1 && self.rows[self.rows.length-1].tab === self.active_tab) new_active_tab = self.rows[self.rows.length-2].tab;

        rows.pop();
        self.setValue(rows);
        if(new_active_tab) {
          self.active_tab = new_active_tab;
          self.refreshTabs();
        }
        self.onChange(true);
      });
      self.controls.appendChild(this.delete_last_row_button);

      this.remove_all_rows_button = this.getButton(this.translate('button_delete_all'),'delete',this.translate('button_delete_all_title'));
      this.remove_all_rows_button.addEventListener('click',function(e) {
        e.preventDefault();
        e.stopPropagation();
        self.setValue([]);
        self.onChange(true);
      });
      this.controls.appendChild(this.remove_all_rows_button);

      var vSearchControl = this.getSearchControl();
      if (vSearchControl) {
        for (var i = 0; i < vSearchControl.length; i++) {
          this.title.appendChild(vSearchControl[i]);
        }
      } else {
        console.warn("CALL getSearchControl() did not return a vSearchControl array - Search control not defined!");
      }

  },
  getCurrentValue: function() {

    var self = this;
    var result = {};
    $each(this.property_order,function(i,key) {
      
      result[key] = self.editors[key].getValue();
    });
    
    return result;
  },
  setCurrentValue: function(value, initial,bubble) {
    var self = this;
    value = value || {};

    if(typeof value !== "object" || Array.isArray(value)) value = {};

    $each(this.cached_editors, function(i,editor) {
      
      if(typeof value[i] !== "undefined") {
        self.addObjectProperty(i);
        editor.setValue(value[i],initial);
      }
      
      else if(!initial && !self.isRequired(editor)) {
        self.removeObjectProperty(i);
      }
      
      else {
        editor.setValue(editor.getDefault(),initial);
      }
    });

    $each(value, function(i,val) {
      if(!self.cached_editors[i]) {
        self.addObjectProperty(i);
        if(self.editors[i]) self.editors[i].setValue(val,initial);
      }
    });

    this.refreshValue();
    this.layoutEditors();
    this.onChange(bubble);
  },
  setArrayValue: function(value, initial, current) {
    var i;

    initial = initial || {
      "current":0,
      "data":[{}]
    };
    value = value || initial;
    this.current = 0; 
    if(this.is_hash(value) == true) {

      if ((value.hasOwnProperty("data")) && (value.hasOwnProperty("current"))) {
          if (this.is_array(value.data)) {
            this.current = value.current;
            this.initArray(value.data, value.current);
          } else {
            console.error("CALL: setArrayValue() - value.data is not an array");
          }
      } else {
        console.warn("CALL: setArrayValue() was called with JSON=hash, that was not a LargeArray-value with current value and not an array");
        this.aData = [value];
        this.current = 0;
      }
    } else {
      if(Array.isArray(value)) {
        this.initArray(value, 0);
      } else {
        console.error("CALL: setArrayValue() - value does not have a usable format.");
        this.aData = initial
      }
    }
    
    this.onChange();
  },

  initArray : function (pData,pCurrent) {
    if (pData) {
  		this.aData = pData;
  	};
    if (this.aData.length == 0) {
  		this.aData.push({});
      this.setValue({});
      this.current = 0;
  	} else {
      if (typeof pCurrent === 'number') {
        
        pCurrent = Math.round(pCurrent);
      } else {
        console.warn("CALL: initArray() - pCurrent='" + pCurrent+ "' is not a number!");
        pCurrent = 0;
      };
      if (pCurrent < 0) {
        
        this.current = 0;
        console.warn("LargeArray.init(pData,pCurrent) pCurrent="+pCurrent);
      } else if (pCurrent >= this.aData.length) {
        
        console.warn("LargeArray.init(pData,pCurrent) pCurrent=" + pCurrent + ">=" + this.aData.length);
        this.current = this.aData.length - 1;
      };
      this.goto(this.current);
    }
  },

  setArray: function(pLargeArray) {
    if (this.is_hash(pLargeArray) == true) {
      if (pLargeArray.hasOwnProperty("data")) {
        if (this.is_array(pLargeArray) == true) {
          if (pLargeArray.hasOwnProperty("current")) {
            
            this.initArray(pLargeArray.data,pLargeArray.current);
          } else {
            this.initArray(pLargeArray.data,0);
          }
        } else {
          console.error("setArray(pLargeArray) pLargeArray.data is not of type 'Array'");
        }
      } else {
        console.error("setArray(pLargeArray) pLargeArray.data does not exist");
      }
    }

  },

  getArray: function(pLargeArray) {
    return {
      "data": this.aData,
      "current": this.current
    }
  },

  prev : function () {
    if (this.current > 0) {
        this.current--;
    };
    console.log("LargeArray: Prev Click ["+this.current+"]");
    this.edit();
  },

  next: function (bubble) {
    if (this.current < (this.aData.length-1)) {
        this.current++;
    };
    console.log("Next Click ["+this.current+"]");
    this.edit(bubble);
  },

  goto: function (pNumberString, bubble) {
    var i = 0;
    if (typeof pNumberString === "string") {
      
      if (pNumberString.length > 0) {
        pNumberString = pNumberString.replace(/[^0-9]/g,'');
        i = parseInt(pNumberString);
      }
    } else if (typeof pNumberString === "number") {
      i = Math.round(pNumberString);
    }
    console.log("LargeArray.goto('"+pNumberString+"') String Parameter");
  	if (i >= 0) {
  		if (i < this.aData.length) {
  	      this.current = i;
  	  } else if (this.aData.length > 0) {
          this.current = this.aData.length-1;
  				this.check();
  	  } else {
  	      this.current = -1;
  	  };
  	} else {
      this.current = 0;
    }
    console.log("Goto ["+this.current+"]");
    this.edit(bubble);

  },

  check: function (bubble) {
    if (this.aData.length === 0) {
        this.current = -1
    } else {
        if (this.current < 0) {
            this.current = 0
        };
        if (this.current >= this.aData.length) {
            this.current = this.aData.length - 1;
        };
    };
    this.updateCurrentEdit(bubble);
  },

  first: function (bubble) {
    this.current = 0;
    console.log("LargeArray: First Click ["+this.current+"]");
    this.edit(bubble);
  },

  last: function (bubble) {
    this.current = this.aData.length - 1;
    console.log("Last Click ["+this.current+"]");
    this.edit(bubble);

  },

  edit: function (bubble) {
    
    if (this.aData.length == 0) {
        
        console.log("pData is empty create an empty element in the large array")
        this.aData.push({});
        this.current = 0;
    };
    if (this.current < 0) {
        console.log("current index in large array is not for the large array - use first element")
        this.current = 0;
    };
    this.setCurrentValue(this.aData[this.current],null,bubble);
    this.updateCurrentEdit();
  },
  deleteAsk: function () {
    if (this.aData.length > 1) {
      var vOK = confirm(this.getTitle()+ " "+(this.current+1)+": "+this.translate("warn_delete_record") );
      if(vOK == true) {
          this.deleteRecord();
      } else {
          console.log("Delete Record cancelled")
      };
    } else {
      alert("Warning: Large Arrays consist of at least one record.")
    }

  },
  deleteRecord: function () {
    this.check(); 
    if (this.current > -1) {
        this.aData.splice(this.current, 1);
    } else {
      this.aData = [];
      this.updateCurrentEdit();
    };
  	this.check();

    this.edit();

  },
  add_record: function () {

    var vDefault = this.getCurrentValue();
    this.aData.push(vDefault);
    this.current = this.aData.length - 1; 
    
    this.edit();
  },

  setSchema: function (pSchema) {
    this.schema = pSchema;
    if (pData) {
      if (this.is_array(pData) == true) {
        this.aData = pData;
      }
    };
    console.log("LargeArray: setSchema() - create a new JSON editor for the tree node.");
    console.log("getArray() for current array data prior to destroy() of the current editor");
    console.log("Destroy the current JSON editor and build the new editor with pSchema");
  },

  getSchema: function () {
    return this.schema;
  },

  getFilename4Path: function (pExtension) {
    var vExtension = pExtension || "json";
    var vFilename = this.path;
    vFilename = vFilename.replace(/\./g,"_");
    vFilename += this.current + "." + vExtension;
    return vFilename;
  },
  
  updateCurrentEdit: function () {
    if (this.arraylength_input) {
      this.arraylength_input.textContent = "[" + this.aData.length + "]";
    } else {
      console.log("arraylength_input for editing the index does not exist in LargeArray JSON editor");
    }
    if (this.count_input) {
      this.count_input.value = (this.current+1);
    } else {
      console.log("count_input for editing the index does not exist in LargeArray JSON editor");
    }
  },
  onChange: function (bubble) {
    var vRecord = this.getCurrentValue();
    this.aData[this.current] = this.getCurrentValue();
    this._super(bubble);
    this.updateCurrentEdit();
  }
});
JSONEditor.defaults.editors["array4name"] = JSONEditor.defaults.editors.array.extend({
  editortype: "array4name",
  getValue4Name: function (pName) {
    var vJSON = null;
    if (pName) {
      var arr = this.getValue();
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == pName) {
          vJSON = arr[i];
          break;
        }
      }
      if (!vJSON) {
        console.warn("Record in "+this.editortype+"['"+this.path+"'] with getValue4Name('"+pName+"')-call with name not found - src/editors/array4name.js:14 ");
      }
    }
    return vJSON;
  },
  setValue4Name: function (pName,val) {
    var vJSON = null;
    if (pName) {
      var arr = this.getValue();
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].name == pName) {
          vJSON = arr[i];
          break;
        }
      }
      if (!vJSON) {
        arr.push(val);
      }
      this.setValue(arr);
    }
    return vJSON;
  },
  getNumColumns: function() {
    return this._super();
  },
  build: function() {
    this._super();
    
  }
});
JSONEditor.defaults.editors.starrating = JSONEditor.defaults.editors.string.extend({

  editortype: "starrating",
  format: "image",
  
  preBuild: function() {
    this._super();
  },
  build: function () {
    var self = this, i;
    if (this.schema  && this.schema.format) {
      this.format = this.schema.format;
    }
    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.header = this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    if(this.schema.question || this.schema.questionTemplate) {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    
    this.preview_id = "INPRE"+this.get_unique_id();
    this.preview_input = this.theme.getPreviewInput(this.preview_id);
    if (self.check_options_schema("enable_preview",false) == false) {
      this.preview_input.style.display = "none";
    }
    if(this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    if (this.options.infoText) this.infoButton = this.theme.getInfoButton(this.translateProperty(this.options.infoText))
    if (this.options.compact) this.container.classList.add('compact')

    var max = 5;
    if (this.schema.enum === undefined) {
      max = this.schema.maximum ? this.schema.maximum : 5
      if (this.schema.exclusiveMaximum) {
        
        max--;
      }
      
      this.enum_values = [];
      for (var k = 0; k < max; k++) {
        var value =  "val"+(k + 1);
        this.enum_values.push(value);
      }
    } else {
      this.enum_values = this.schema.enum;
    };
    max = this.enum_values.length;
    
    this.ratingContainer = document.createElement('div');
    this.ratingContainer.classList.add('star-rating');
    this.ratingContainer.classList.add('star-'+max);

    var radioInputEventhandler = function (e) {
      e.preventDefault()
      e.stopPropagation()
      self.setValue(e.currentTarget.value);
      self.update_preview();
      self.onChange(true)
    }
    this.imageGroup = []

    var ev = this.enum_values;
    if (this.format && this.format == "image") {
      for (var i = 0; i < ev.length; i++) {
        var star = {
          "checked": this.getStarIcon("star4checked"),
          "unchecked": this.getStarIcon("star4unchecked")
        };
        this.imageGroup.push(star);
        var imgclick = document.createElement("a");
        imgclick.setAttribute("star",i+1);
        imgclick.setAttribute("starvalue",ev[i]);
        star.checked.style.display = "none";
        imgclick.appendChild(star.checked);
        imgclick.appendChild(star.unchecked);
        var vStarNumber = i+1;
        imgclick.addEventListener('click', function (e) {
          var val = this.getAttribute('starvalue');
          var old_value = self.getValue();
          if (val == old_value) {
            
            self.setValue("-");
            self.value = "-";
            self.input.value = "-";
            self.title4value = "-";
            self.onChange(true);
            self.update_preview(" ");
            
          } else {
            self.setValue(val);
          }
          var count = this.getAttribute('star');

        }, false);
        this.ratingContainer.appendChild(imgclick);
      }
      
    }
    
    this.radioGroup = [];

    var display4radio = "none";
    if (this.format !== "image") {
      display4radio = ""
    }

    for (var i = 0; i < ev.length; i++) {
    
      var id = this.formname + (i + 1);

      var radioInput = this.theme.getFormInputField('radio');
      radioInput.name = this.formname+"[starrating]";
      radioInput.value = this.getValue4Enum(ev,i,"value4enum");
      radioInput.style.display = display4radio;
      radioInput.id = id;
      radioInput.addEventListener('change', radioInputEventhandler, false)
      this.radioGroup.push(radioInput);

      var radioLabel = document.createElement('label')
      radioLabel.htmlFor = id;
      radioLabel.title = this.getValue4Enum(ev,i,"title4enum");
      radioLabel.style.display = display4radio;
      if (this.options.displayValue) {
        radioLabel.classList.add('starrating-display-enabled');
      }
      radioLabel.classList.add('starrating-display-enabled');

      this.ratingContainer.appendChild(radioInput);
      this.ratingContainer.appendChild(radioLabel);
    }

    if (this.schema.readOnly || this.schema.readonly) {
      this.disable(true)
      for (var j = 0; j < this.radioGroup.length; j++) {
        this.radioGroup[j].disabled = true
      }
      this.ratingContainer.classList.add('readonly')
    }

    var ratingsContainerWrapper = this.theme.getContainer();
    ratingsContainerWrapper.appendChild(this.ratingContainer);

    this.input = ratingsContainerWrapper;

    this.input_element_id = "FORMCONTROL4"+this.get_unique_id();

    this.control = this.theme.appendFormControl(
        this.container,
        this.label, this.input,
        this.description, this.question,
        null,null,
        
        this.preview_input,this.buttons4title,
        this.input_element_id
    );

    this.refreshValue();
  },
  getValue4Enum: function (ev,i,type4value) {
    
    var vRet = "val"+i;
    if (typeof ev[i]  === "string") {
      vRet = ev[i];
    } else {
      if (ev[i]) {
        var vEnum = ev[i];
        if ((typeof ev[i]  === "object") && (vEnum[type4value])) {
          vRet = vEnum[type4value];
        }
      }
    }
    return vRet;
  },
  getStarIcon: function (name4icon) {
    var iconsize =  this.options.iconsize || "30px";
    var icon;
    if (name4icon == "star4checked") {
      if (this.options && this.options.icon4checked) {
        icon = this.iconlib.getIcon(this.options.icon4checked,"url");
      } else {
        icon = this.iconlib.getIcon(name4icon);
      }
    } else if (name4icon == "star4unchecked") {
      if (this.options && this.options.icon4unchecked) {
        icon = this.iconlib.getIcon(this.options.icon4unchecked,"url");
      } else {
        icon = this.iconlib.getIcon(name4icon);
      }
    } else {
      icon = this.iconlib.getIcon(name4icon);
    }
    icon.style.width = iconsize;
    icon.style.height = iconsize;
    return icon;
  },
  getStarCount: function () {
    var count = 0;
    var ev = this.enum_values;
    var val = this.getValue();
    count = ev.indexOf(val)
    if (count < 0) {
      count = 0
    }
    return count;
  },
  setImageRating: function (count) {
    
    if (this.enum_values) {
      if (this.format && this.format == "image") {
          var ev = this.enum_values;
          for (var i = 0; i < ev.length; i++) {
            if (i < count) {
              this.setImageStar(i,"checked");
            } else {
              this.setImageStar(i,"unchecked");
            }
          }
      }
    }
  },
  setImageStar: function (i,pChecked) {
    if (i <this.imageGroup.length) {
      var star = this.imageGroup[i];
      if (pChecked == "checked") {
        this.hide4dom(star["unchecked"]);
        this.show4dom(star["checked"]);
      } else {
        this.hide4dom(star["checked"]);
        this.show4dom(star["unchecked"]);
      }
    }
  },
  enable: function () {
    if (!this.always_disabled) {
      for (var i = 0; i < this.radioGroup.length; i++) {
        this.radioGroup[i].disabled = false
      }
      this.ratingContainer.classList.remove('readonly')
      this.disabled = false
    }
  },
  disable: function (alwaysDisabled) {
    if (alwaysDisabled) this.always_disabled = true
    for (var i = 0; i < this.radioGroup.length; i++) {
      this.radioGroup[i].disabled = true
    }
    this.ratingContainer.classList.add('readonly')
    this.disabled = true
  },

  destroy: function () {
    if (this.ratingContainer.parentNode && this.ratingContainer.parentNode.parentNode) this.ratingContainer.parentNode.parentNode.removeChild(this.ratingContainer.parentNode);
    if (this.label && this.label.parentNode) this.label.parentNode.removeChild(this.label);
    if (this.description && this.description.parentNode) this.description.parentNode.removeChild(this.description);
    this._super();
  },

  getNumColumns: function () {
    return 4
  },
  update_preview: function(overwrite) {
    var content = "" + (overwrite || this.title4enum) + "";
    var div = this.get_div("preview-input");
    div.style.marginLeft = "10px";
    $setContent(div,content);
    this.preview_input.innerHTML = "";
    this.preview_input.appendChild(div);
  },

  getValue: function () {
    return this.value
  },

  setValue: function (value) {
    this.setImageRating(0);
    var ev = this.enum_values;
    for (var i = 0; i < this.radioGroup.length; i++) {
      this.radioGroup[i].checked = false
    }
    for (var i = 0; i < this.radioGroup.length; i++) {
      console.log("comparison '"+this.radioGroup[i].value+"'=='"+value+"'");
      if ((this.radioGroup[i].value+"") === (value+"")) {
        this.setImageRating(i+1);
        this.radioGroup[i].checked = true
        this.value = value;
        this.title4enum = this.getValue4Enum(ev,i,"title4enum");
        this.onChange(true);
        break ;
      }
    }
    this.update_preview();
  }

});
JSONEditor.defaults.editors.urlparam = JSONEditor.defaults.editors.string.extend({
  editortype: "urlparam",
  getValue: function() {
    return encodeURIComponent(this._super());
  },
  setValue: function(value,initial,from_template) {
    this._super(decodeURIComponent(value),decodeURIComponent(initial),from_template);
  }
});

JSONEditor.defaults.editors["image"] = JSONEditor.AbstractEditor.extend({
  editortype: "image",
  backgroundImage: null, 

show_editor:function() {
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "";
    }
    if (this.canvas) {
      this.canvas.style.display = "";
    }
    this.editor_is_visible = true;
  },
  hide_editor:function() {
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "none";
    }
    if (this.canvas) {
      this.canvas.style.display = "none";
    }
    
    this.editor_is_visible = false;
  },
  show_preview:function() {
    if (this.preview_input) {
      this.preview_input.style.display = "";
    }
    this.update_preview();
    
    this.preview_is_visible = true;
  },
  hide_preview:function() {
    if (this.preview_input) {
      this.preview_input.style.display = "none";
    }
    
    this.preview_is_visible = false;
  },
  update_preview:function() {
    var self = this;
    if (this.preview_input) {
      if (window.Canvas) {
      }
      this.preview_input.innerHTML = "";
      if (this.canvas_preview) {
          this.preview_image = new Image();
          var ctx = this.canvas_preview.getContext('2d');
          this.preview_image.onload = function(){
            ctx.drawImage(self.preview_image,0,0); 
          };
          this.preview_image.src = this.signaturePad.toDataURL()+"";

          this.preview_input.appendChild(this.preview_image);
      }
    } else {
    }

  },
  enable: function () {
    
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "";
    }
    if (this.canvas) {
      this.canvas.style.display = "";
    }
    this.editor_is_visible = true;
    if (this.preview_input) {
      this.preview_input.style.display = "none";
      this.preview_is_visible = false;
    }
  },
  disable: function () {
    
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "none";
    }
    if (this.canvas) {
      this.canvas.style.display = "none";
    }
    this.editor_is_visible = true;
    if (this.preview_input) {
      this.preview_input.style.display = "";
      this.update_preview();
      this.preview_is_visible = true;
    } else {
      console.error("preview_input is not defined")
    };
    
  },

  build: function() {
    var self = this;

    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    this.preview_input = this.get_div("preview_input");
    this.preview_input.style.display = "none";

    if (this.schema.question || this.schema.questionTemplate)  {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }  
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    var formname = this.formname.replace(/\W/g, '');

      this.input = this.theme.getFormInputField('hidden');
      this.container.appendChild(this.input);

      var imageContainer = this.get_div("imageContainer");
      imageContainer.classList.add('signature-container');

      var canvas = document.createElement('canvas');
      this.canvas_preview = document.createElement('canvas');

      this.canvas_raw = document.createElement('canvas');
      this.canvas_raw.style.display = "none";
      this.canvas = canvas;

      canvas.setAttribute('name', formname);
      canvas.classList.add('image');
      imageContainer.appendChild(canvas);
      imageContainer.appendChild(this.canvas_raw);
      
      if (!this.hasOwnProperty("options")) {
        
        this.options = {
          "canvas_width": 640,
          "canvas_height": 360,
          "image_filename": "image4json"
        };
      }
      if (this.options.hasOwnProperty("canvas_width")) {
        console.log("ImageCanvas: options.canvas_width='" + this.options.canvas_width +  "' is defined");
      } else {
        this.options.canvas_width = 640;
        console.log("Image/Canvas: options.canvas_width='" + this.options.canvas_width +  "'");
      }
      if (this.options.hasOwnProperty("canvas_height")) {
        console.log("Image/Canvas: options.canvas_height='" + this.options.canvas_height +  "' is defined");
      } else {
        this.options.canvas_height = 360;
        console.log("Image/Canvas: options.canvas_width='" + this.options.canvas_height +  "'");
      }
      console.log("Image/Canvas build()-call - path="+this.path);
      var imgslider = document.createElement('div');
      if (window.Caman) {
        console.log("scr/editors/image.js:201 - Caman4JS image processor exists.");
        imgslider.innerHTML = "Caman4JS Slider";
      } else {
        console.log("scr/editors/image.js:204 - Caman4JS image processor missing.");
        imgslider.setAttribute("style","display:none");
      }
      this.canvas_slider = imgslider;

      var buttons = document.createElement('div');
      if (this.checkHidden("all")  === true) {
        buttons.setAttribute("style","display:none");
      }
      this.canvas_buttons = buttons;

      var loadButton = this.getButton('Load','load','Load Image');
      if (this.checkHidden("load")  === true) {
        loadButton.setAttribute("style","display:none")
      }
      buttons.appendChild(loadButton);

      var clearButton = this.getButton('','delete','Clear Image');
      if (this.checkHidden("clear")  === true) {
        clearButton.setAttribute("style","display:none")
      }
      buttons.appendChild(clearButton);

      var span3 = document.createElement('span');
      span3.innerHTML = " &nbsp; "
      if (this.checkHidden("save") === true) {
        bgColor.setAttribute("style","display:none");
      }
      buttons.appendChild(span3);

      var inputFileButton = this.theme.getInputFileButton("Image File");

      buttons.appendChild(inputFileButton);

      var saveButton = this.getButton('Save','save','Save Image');
      if (this.checkHidden("save")  === true) {
        saveButton.setAttribute("style","display:none")
      }
      buttons.appendChild(saveButton);

      imageContainer.appendChild(imgslider);
      imageContainer.appendChild(buttons);

      var setFormat = document.createElement('select');
      setFormat.setAttribute("imageformat","SVG");
      
      var img_format_arr = ["SVG","SVG-RAW","PNG","JPG","JSON"];
      
      var vDefaultFormat = "SVG";
      if (self.options && self.options.canvas_image_format) {
        vDefaultFormat = self.options.canvas_image_format;
        vDefaultFormat = vDefaultFormat.toUpperCase();
      }
      for (var i = 0; i < img_format_arr.length; i++) {
        var imgfmt = document.createElement('option');
        if (img_format_arr[i]==vDefaultFormat) {
          imgfmt.setAttribute("selected","selected");
        };
        imgfmt.innerHTML = img_format_arr[i];
        setFormat.appendChild(imgfmt);
      };
      if (this.checkHidden("save")  === true) {
        setFormat.setAttribute("style","display:none")
      }
      buttons.appendChild(setFormat);

      var name4file = document.createElement('input');
      this.name4file = name4file;
      if (this.checkHidden("save")  === true) {
        name4file.setAttribute("style","display:none")
      }
      buttons.appendChild(name4file);
      if (this.options && this.options.image_filename) {
        name4file.value = this.options.image_filename;
      } else {
        name4file.value = "image";
      }

      if (this.options && this.options.compact) {
        if (this.container) {
          var class_att = this.container.getAttribute('class');
          if (class_att) {
            this.container.setAttribute('class', class_att + ' compact' );
          } else {
            console.warn("Image/Canvas class_att undefined");
          }
        } else {
          console.warn("Container undefined for image editor");
        }
      }
      if (this.schema.readOnly || this.schema.readonly) {
        this.always_disabled = true;
        this.disable();
      }

      inputFileButton.addEventListener('change', function (e) {
        console.log("Event 'onchange' - Input File Image");
        
        const image_file = inputFileButton.files[0];
        const reader4image = new FileReader();

        reader4image.addEventListener("load", function () {

          var mimetype = "image-undefined";
          var raw = null;
          if (reader4image.result) {

            var basename4file = image_file.name;
            if (basename4file && basename4file.indexOf(".") > 0) {
              basename4file = basename4file.substr(0,basename4file.lastIndexOf("."));
            }
            self.name4file.value = basename4file;

            mimetype = $mimetyp4data_url(reader4image.result,mimetype);
            console.log("Load file '"+image_file.name+"' with MIME-type: '"+mimetype+"'");
            console.log("Load and store Base64 encoded image in SignaturePad MIME-Type='"+mimetype+"'");
            if ( mimetype.indexOf("image") >= 0) {
              self.setBase64Value(reader4image.result);

            } else {
              if ( mimetype.indexOf("application/json") >= 0) {
                if (raw) {
                  
                  var vJSON = null;
                  try{
                    vJSON = JSON.parse(raw);

                  } catch(e) {
                    alert("JSON Parsing Error: " + e.message)
                  }
                  if (vJSON) {
                    self.setValue4JSON(vJSON);
                  }
                }
              } else {
                console.log("Ignored file format for MIME type '"+mimetype+"'");
              }
            } 
          }  
        }, false);

        if (image_file) {
          reader4image.readAsDataURL(image_file);
        }
      });

      saveButton.addEventListener('click', function (e) {
        var vFilename = self.name4file.value || self.options.image_filename ||  "image";
        var vFormat = "undef";
        if (self.options && self.options.not_empty && self.signaturePad.isEmpty()) {
          alert("Please provide an image at JSON Editor '" + self.path + "'.");
        } else {

          if (self.options && self.options.image_filename ) {
            vFilename = self.options.image_filename;
          } else {
            vFilename = 'image'; 
          }
          vFilename += "_" + self.path ; 
          vFilename = vFilename.replace(/[^a-zA-Z0-9]/g,"_");
          if (self.options && self.options.image_format) {
            vFormat = self.options.image_format;
          } else {
            vFormat = 'png'; 
          }
          vFormat = vFormat.toUpperCase();
          if (setFormat && setFormat.value) {
            vFormat = setFormat.value;
            console.log("Selected Image Format for Export = '" + vFormat + "'");
            vFormat = vFormat.toLowerCase();
          }
          switch (vFormat) {
            case "png":
                vFilename += "." + vFormat.toLowerCase();
                dataURL = self.signaturePad.toDataURL();
                self.download_blob(vFilename,dataURL);
            break;
            case "jpg":
                vFilename += "." + vFormat.toLowerCase();
                dataURL = self.signaturePad.toDataURL("image/jpeg");
                self.download_blob(vFilename,dataURL);
            break;
            case "svg":
                vFilename += "." + vFormat.toLowerCase();
                
                dataURL = self.signaturePad.toDataURL("image/svg+xml+img");
                self.download_blob(vFilename,dataURL);
            break;
            case "svg-raw":
                
                vFilename += "-raw.svg";
                dataURL = self.signaturePad.toDataURL("image/svg+xml");
                self.download_blob(vFilename,dataURL);

            break;
            case "svg-img":
                
                vFilename += "-img.svg";
                dataText = self.signaturePad.toDataText("image/svg+xml+img");
                self.download_text(vFilename,dataText);
            break;
            case "json":
                vFilename += "." + vFormat.toLowerCase();
                dataText = self.signaturePad.toDataText("application/json");
                self.download_text(vFilename,dataText);
            break;
            default:
                vFilename += "." + "png";
                dataURL = self.signaturePad.toDataURL();
                self.download_blob(vFilename,dataURL);

          };
          console.log("Save to File '" + vFilename + "'");
          
        }
        console.log("Image '" + vFilename + "' Saved Image");
      });

      this.control = this.theme.appendFormControl(
        this.container,
        this.label, imageContainer,
        this.description, this.question,
        null,null,
        this.preview_input
      );
      
      this.refreshValue();

      canvas.width = imageContainer.offsetWidth;
      if (this.options && this.options.canvas_height) {
        
        canvas.height = this.options.canvas_height;
      } else {
        canvas.height = '300'; 
      }
      if (this.options && this.options.canvas_width) {
        
        canvas.width = this.options.canvas_width;
      } else {
        canvas.width = '500'; 
      }
      if (window.Canvas) {
        var message = document.createElement('p');
        message.innerHTML = 'src/editors/image.js:451 - Image Editor CamanJS is available by including CamanJS from http://camanjs.com/';
        this.container.appendChild(message);
      } else {
        var message = document.createElement('p');
        message.innerHTML = 'src/editors/image.js:455 - Image Editor CamanJS is not available, please include CamanJS from http://camanjs.com/';
        this.container.appendChild(message);
      };
      this.canvas = canvas;
  },
  postBuild: function() {
    this._super();
    if (this.signaturePad) {
        this.value = this.signaturePad.toJSON();
    } else {
      this.value = {};
    }
    
  },
  checkHidden: function(elementID) {
    var vBoolean = false;
    if (this.options) {
      if (this.options.hiddenMenu) {
        
        if (this.options.hiddenMenu.hasOwnProperty(elementID) ) {
          vBoolean = this.options.hiddenMenu[elementID];
        }
      }
    } else {
      console.Warn("this.options do not exist!");
    }

    console.log("SignaturePad Menu: checkHidden('" + elementID + "')="+vBoolean);
    return vBoolean;
  },
  getValue: function(pFormat) {
    
    pFormat = pFormat || "json";
    if (window.SignaturePad) {
    
      if (this.signaturePad) {
        if (pFormat == "dataurl") {
          this.value = this.signaturePad.toDataURL();
        } else {
          this.value = this.signaturePad.toJSON();
          if (this.backgroundImage) {
            if (typeof this.backgroundImage === "string") {
              this.value.backgroundImage = this.backgroundImage;
            } else {
              this.value.backgroundImage = this.backgroundImage;
            }
          }
        }
      } else {
        console.warn("WARNING: signaturePad is not defined in editor '" + this.path + "' getValue() call");
      }
    } else {
      console.warn("WARNING: constructor 'SignaturePad' is not defined in editor '" + this.path + "' getValue() call");
    }
    return this.value;
  },
  max_tile_width: 450,
  max_tile_height: 250,
  clearCanvas: function() {
    var self = this;
    self.signaturePad.clear();
    self.signaturePad._data = [];
    self.value.backgroundImage = null;
    self.backgroundImage = null;
  },
  setCanvasSize: function(pWidth, pHeight) {
    var self = this;
    var ratio = 1.0;
    var vWidth  = pWidth || this.max_tile_width;
    var vHeight = pHeight || this.max_tile_height;
    if (self.container.offsetWidth < vWidth) {
        if (self.container.offsetWidth > 0) {
          ratio = self.container.offsetWidth/vWidth;
          vWidth = Math.floor(ratio*vWidth);
          vHeight = Math.floor(ratio*vHeight);
          if (vWidth < 10) vWidth = 10;
          if (vHeight < 10) vHeight = 10;
        }
    };
    self.canvas.height = vHeight;
    self.canvas.width = vWidth;
    self.value.canvas_width = vWidth;
    self.value.canvas_height = vHeight;
    
    self.canvas.getContext("2d").scale(1.0, 1.0);
  },
  setBase64Value: function (val) {
    var self = this;
    if (val !== '') {

      var img = new Image();
      
      img.onload = function ()  {
        self.clearCanvas();
        var disp = self.canvas.style.display;
        
        self.canvas_raw.height = img.height;
        self.canvas_raw.width = img.width;
        self.canvas_raw.getContext("2d").drawImage(img, 0, 0);
        
        self.setCanvasSize(img.width,img.height);
        self.canvas.getContext("2d").drawImage(img, 0, 0,img.width,img.height);
        
        self.jsonImage = $canvas2json(self.canvas);

        console.log("ImagePad - Image loaded - width=" + img.width+" height="+img.height+ " canvas.width="+self.canvas.width+" canvas.height="+self.canvas.height);

      }
      
      img.src = val;
    }
  },
  setValue: function (val) {
    var self = this;
    
    if (window.Caman) {

    }
    
    if (this.clearCanvas) {

      if (val) {
        
        if (typeof(val) == "string") {
          
          this.clearCanvas();
          this.setBase64Value(val)
        } else {
          if (typeof(val) == "object") {
            self.setValue4JSON(val);
          }
        }
      } else {
        console.warn("WARNING: value parameter 'val' is not defined in editor '" + this.path + "' setValue() call");
      }
    } else {
      console.warn("WARNING: Constructor 'ImagePad' is not defined in editor '" + this.path + "' setValue() call");
    }
    self.watch_listener();
    self.jsoneditor.notifyWatchers(this.path);
    return false;

  },

  getValue4JSON:function () {
    
    return this.getValue();
  },
  setValue4JSON:function (pJSON) {
    var self = this;
    if (pJSON) {
      this.clearCanvas();
      
      if (pJSON.canvas_width || pJSON.canvas_height) {
        var vHeight = pJSON.canvas_height || this.options.canvas_height || this.canvas.height;
        var vWidth  = pJSON.canvas_width  || this.options.canvas_width  || this.canvas.width;
        this.setCanvasSize(vWidth,vHeight);
        $json2canvas(pJSON,self.canvas_raw,self,pJSON.data)
      }

      this.update_preview();
      if (pJSON.backgroundColor) {
        if (self.signaturePad) {
          self.signaturePad.backgroundColor = pJSON.backgroundColor;
        }
        bgColor.value = pJSON.backgroundColor;
      }
      if (pJSON.penColor) {
        if (self.signaturePad) {
          self.signaturePad.penColor = pJSON.penColor;
        }
        penColor.value = pJSON.penColor;
      }
    }
  },
  destroy: function () {
    if(this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    if(this.canvas_preview && this.canvas_preview.parentNode) this.canvas_preview.parentNode.removeChild(this.canvas_preview);
    if(this.canvas_raw && this.canvas_raw.parentNode) this.canvas_raw.parentNode.removeChild(this.canvas_raw);
    if(this.preview_image && this.preview_image.parentNode) this.preview_image.parentNode.removeChild(this.preview_image);
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);

    this._super();
  }
});

JSONEditor.defaults.editors["signature"] = JSONEditor.AbstractEditor.extend({
  editortype: "signature",
  backgroundImage: null, 

  show_editor:function() {
    var self = this;
    if (this.editor_holder) {
      this.show4dom(this.editor_holder,this.editor_holder.id)
      this.show_editor_controls();
    }
    this.editor_is_visible = true;
  },
  hide_editor:function() {
    var self = this;
    if (this.editor_holder) {
      this.hide4dom(this.editor_holder,this.editor_holder.id);
      this.hide_editor_controls();
    }
    this.editor_is_visible = false;
  },
  show_editor_controls:function() {

    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "";
    }
    if (this.canvas) {
      this.canvas.style.display = "";
    }
  },
  hide_editor_controls:function() {
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "none";
    }
    if (this.canvas) {
      this.canvas.style.display = "none";
    }
    
  },
  show_preview:function() {
    if (this.preview_input) {
      this.preview_input.style.display = "";
    }
    this.update_preview();
    
    this.preview_is_visible = true;
  },
  hide_preview:function() {
    if (this.preview_input) {
      this.preview_input.style.display = "none";
    }
    
    this.preview_is_visible = false;
  },
  update_preview:function() {
    var self = this;
    if (this.preview_input) {
      if (window.SignaturePad) {
      
        this.preview_input.innerHTML = "";
        if (this.canvas_preview) {
          this.preview_image = new Image();
          var ctx = this.canvas_preview.getContext('2d');
          this.preview_image.onload = function(){
            ctx.drawImage(self.preview_image,0,0); 
          };
          this.preview_image.src = this.signaturePad.toDataURL()+"";

          this.preview_input.appendChild(this.preview_image);
        }
      } else {
      }
    } else {
    }

  },
  enable: function () {
    
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "";
    }
    if (this.canvas) {
      this.canvas.style.display = "";
    }
    this.editor_is_visible = true;
    if (this.preview_input) {
      this.preview_input.style.display = "none";
      this.preview_is_visible = false;
    }
  },
  disable: function () {
    
    if (this.canvas_buttons) {
      this.canvas_buttons.style.display = "none";
    }
    if (this.canvas) {
      this.canvas.style.display = "none";
    }
    this.editor_is_visible = true;
    if (this.preview_input) {
      this.preview_input.style.display = "";
      this.update_preview();
      this.preview_is_visible = true;
    } else {
      console.error("preview_input is not defined")
    };
    
  },
  getDefault: function () {
    if (this.schema.default) {
      return this.schema.default;
    } else {
      if (this.signaturePad) {
        return this.signaturePad.toJSON();
      } else {
        return {};
      }
    }
  },
  build: function() {
    var self = this;

    this.header4title = this.theme.getHeader4Title(this.getTitle());
    if(!this.options.compact) this.label = this.theme.getHeader4TitleButtons(this.header4title,this.getButtons4Title());

    this.preview_input = this.get_div("preview_input");
    this.preview_input.style.display = "none";

    if (this.schema.question || this.schema.descriptionTemplate)  {
      this.question = this.theme.getFormInputQuestion(this.schema.question);
    }
    if (this.schema.description || this.schema.descriptionTemplate) {
      this.description = this.theme.getFormInputDescription(this.schema.description);
    }
    var formname = this.formname.replace(/\W/g, '');

    if (window.SignaturePad) {

      this.input = this.theme.getFormInputField('hidden');
      this.container.appendChild(this.input);

      var signatureContainer = this.get_div("signatureContainer");
      this.editor_holder = signatureContainer;
      signatureContainer.classList.add('signature-container');
      
      var canvas = document.createElement('canvas');
      this.canvas_preview = document.createElement('canvas');

      this.canvas_raw = document.createElement('canvas');
      this.canvas_raw.style.display = "none";
      this.canvas = canvas;

      canvas.setAttribute('name', formname);
      canvas.classList.add('signature');
      signatureContainer.appendChild(canvas);
      signatureContainer.appendChild(this.canvas_raw);
      
      if (!this.hasOwnProperty("options")) {
        
        this.options = {
          "canvas_width": 640,
          "canvas_height": 360,
          "penColor":"blue",
          "backgroundColor":"#FFFFFF",
          "image_filename": "image4json"
        };
      }
      
      if (this.options.hasOwnProperty("penColor")) {
        console.log("SignaturePad: options.penColor='" + this.options.penColor + "' is defined");
      } else {
        this.options.penColor = "blue";
        console.log("SignaturePad: options.penColor='" + this.options.penColor + "'");
      }
      if (this.options.hasOwnProperty("backgroundColor")) {
        console.log("SignaturePad: options.backgroundColor='" + this.options.backgroundColor +  "' is defined");
      } else {
        this.options.backgroundColor = "#FFFFFF";
        console.log("SignaturePad: options.backgroundColor='" + this.options.backgroundColor +"'");
      }
      if (this.options.hasOwnProperty("canvas_width")) {
        console.log("SignaturePad: options.canvas_width='" + this.options.canvas_width +  "' is defined");
      } else {
        this.options.canvas_width = 640;
        console.log("SignaturePad: options.canvas_width='" + this.options.canvas_width +  "'");
      }
      if (this.options.hasOwnProperty("canvas_height")) {
        console.log("SignaturePad: options.canvas_height='" + this.options.canvas_height +  "' is defined");
      } else {
        this.options.canvas_height = 360;
        console.log("SignaturePad: options.canvas_width='" + this.options.canvas_height +  "'");
      }
      this.signaturePad = new window.SignaturePad(canvas, {
        penColor: self.options.penColor,
        backgroundColor: self.options.backgroundColor,
        onEnd: function () {
          
          if (!self.signaturePad.isEmpty()) {

          } else {

          }
          self.refreshValue();
          self.is_dirty = true;
          self.watch_listener();
          self.jsoneditor.notifyWatchers(this.path);
          if (self.parent) self.parent.onChildEditorChange(this);
          else self.jsoneditor.onChange(true);
        }
      });
      console.log("SignaturePad build()-call - path="+this.path);
      var imgslider = document.createElement('div');
      if (window.Caman) {
        console.log("scr/editors/signature.js:201 - Caman4JS image processor exists.");
        imgslider.innerHTML = "Caman4JS Slider";
      } else {
        console.log("scr/editors/signature.js:204 - Caman4JS image processor missing.");
        imgslider.setAttribute("style","display:none");
      }
      this.canvas_slider = imgslider;

      var buttons = document.createElement('div');
      if (this.checkHidden("all")  === true) {
        buttons.setAttribute("style","display:none");
      }
      this.canvas_buttons = buttons;

      var loadButton = this.getButton('Load','load','Load Image');
      if (this.checkHidden("load")  === true) {
        loadButton.setAttribute("style","display:none")
      }
      buttons.appendChild(loadButton);

      var clearButton = this.getButton('','delete','Clear Image');
      if (this.checkHidden("clear")  === true) {
        clearButton.setAttribute("style","display:none")
      }
      buttons.appendChild(clearButton);

      var span1 = document.createElement('span');
      span1.innerHTML = " &nbsp; ";
      if (this.checkHidden("penColor")  === true) {
        span1.setAttribute("style","display:none")
      }
      buttons.appendChild(span1);

      var penColor = document.createElement('input');
      this.penColor = penColor;
      
      penColor.setAttribute("type","color");
      penColor.setAttribute("value",this.options.penColor);
      penColor.setAttribute("data-schemaformat","color");
      if (this.checkHidden("penColor")  === true) {
        penColor.setAttribute("style","display:none")
      }
      buttons.appendChild(penColor);

      var setColor = this.getButton('','brush','Pen Color');
      if (this.checkHidden("penColor")  === true) {
        setColor.setAttribute("style","display:none")
      }
      buttons.appendChild(setColor);

      var span2 = document.createElement('span');
      span2.innerHTML = " &nbsp; "
      if (this.checkHidden("backgroundColor")  === true) {
        span2.setAttribute("style","display:none")
      }
      buttons.appendChild(span2);

      var bgColor = document.createElement('input');
      this.bgColor = bgColor;
      
      bgColor.setAttribute("type","color");
      bgColor.setAttribute("value",this.options.backgroundColor);
      bgColor.setAttribute("data-schemaformat","color");
      if (this.checkHidden("backgroundColor")  === true) {
        bgColor.setAttribute("style","display:none")
      }
      buttons.appendChild(bgColor);

      var setBackgroundColor = this.getButton('','backgroundcolor','Background Color');
      if (this.checkHidden("backgroundColor") === true) {
        setBackgroundColor.setAttribute("style","display:none")
      }
      buttons.appendChild(setBackgroundColor);

      var span3 = document.createElement('span');
      span3.innerHTML = " &nbsp; "
      if (this.checkHidden("save") === true) {
        bgColor.setAttribute("style","display:none");
      }
      buttons.appendChild(span3);

      var inputFileButton = this.theme.getInputFileButton("Image File");

      buttons.appendChild(inputFileButton);

      var saveButton = this.getButton('Save','save','Save Image');
      if (this.checkHidden("save")  === true) {
        saveButton.setAttribute("style","display:none")
      }
      buttons.appendChild(saveButton);

      signatureContainer.appendChild(imgslider);
      signatureContainer.appendChild(buttons);

      var setFormat = document.createElement('select');
      setFormat.setAttribute("imageformat","SVG");
      
      var img_format_arr = ["SVG","SVG-RAW","PNG","JPG","JSON"];
      
      var vDefaultFormat = "SVG";
      if (self.options && self.options.canvas_image_format) {
        vDefaultFormat = self.options.canvas_image_format;
        vDefaultFormat = vDefaultFormat.toUpperCase();
      }
      for (var i = 0; i < img_format_arr.length; i++) {
        var imgfmt = document.createElement('option');
        if (img_format_arr[i]==vDefaultFormat) {
          imgfmt.setAttribute("selected","selected");
        };
        imgfmt.innerHTML = img_format_arr[i];
        setFormat.appendChild(imgfmt);
      };
      if (this.checkHidden("save")  === true) {
        setFormat.setAttribute("style","display:none")
      }
      buttons.appendChild(setFormat);

      var name4file = document.createElement('input');
      this.name4file = name4file;
      if (this.checkHidden("save")  === true) {
        name4file.setAttribute("style","display:none")
      }
      buttons.appendChild(name4file);
      if (this.options && this.options.image_filename) {
        name4file.value = this.options.image_filename;
      } else {
        name4file.value = "image";
      }

      if (this.options && this.options.compact) {
        if (this.container) {
          var class_att = this.container.getAttribute('class');
          if (class_att) {
            this.container.setAttribute('class', class_att + ' compact' );
          } else {
            console.warn("SignaturePad class_att undefined");
          }
        } else {
          console.warn("Container undefined for signature pad");
        }
      }
      if (this.schema.readOnly || this.schema.readonly) {
        this.always_disabled = true;
        this.disable();
      }

      clearButton.addEventListener('click', function (e) {
        var check = confirm(self.translate('warn_image_clear'));
        if (check === true) {
          e.preventDefault();
          e.stopPropagation();
          self.signaturePad.clear();
          self.signaturePad._data = [];
          self.signaturePad._backgroundImage = null;
          self.backgroundImage = null;
          self.value.backgroundImage = null;
          self.refreshValue();
          self.onChange(true);
          
        }
        
      });

      penColor.addEventListener('change', function (e) {
        console.log("Onchange Event of Pen Color SignaturePad: "+ this.value);
        self.signaturePad.penColor = this.value;
      });

      setColor.addEventListener('click', function (e) {

        console.log("Set Pen Color SignaturePad: "+ penColor.value);
        self.signaturePad.penColor = penColor.value;

      });
      var bgHandler = function (e) {
        console.log("Onchange Event of Background Color SignaturePad: "+ this.value);
        
        var check = confirm(self.translate('warn_image_overwrite'));
        if (check === true) {
          var vData = self.signaturePad.toData();
          
          self.setBackgroundColor(self.bgColor.value);
          self.clearCanvas();
          
          console.log("Set Background Color SignaturePad: "+ self.bgColor.value);
          var ctx = canvas.getContext("2d");
          
          ctx.fillStyle = this.value;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          
          self.signaturePad.fromData(vData);
          
          self.signaturePad.strokeEnd();
        }
      }

      bgColor.addEventListener('change', bgHandler);

      setBackgroundColor.addEventListener('click', bgHandler);
      loadButton.addEventListener('click', function (e) {
        console.log("Load Image into JSON Editor - path: '" + self.path + "'");
        inputFileButton.click();
      });

      inputFileButton.addEventListener('change', function (e) {
        console.log("Event 'onchange' - Input File Image");
        
        const image_file = inputFileButton.files[0];
        const reader4image = new FileReader();

        reader4image.addEventListener("load", function () {

          var mimetype = "image-undefined";
          var raw = null;
          if (reader4image.result) {

            var basename4file = image_file.name;
            if (basename4file && basename4file.indexOf(".") > 0) {
              basename4file = basename4file.substr(0,basename4file.lastIndexOf("."));
            }
            self.name4file.value = basename4file;

            mimetype = $mimetyp4data_url(reader4image.result,mimetype);
            console.log("Load file '"+image_file.name+"' with MIME-type: '"+mimetype+"'");
            console.log("Load and store Base64 encoded image in SignaturePad MIME-Type='"+mimetype+"'");
            if ( mimetype.indexOf("image") >= 0) {
              self.setBase64Value(reader4image.result);

            } else {
              if ( mimetype.indexOf("application/json") >= 0) {
                if (raw) {
                  
                  var vJSON = null;
                  try{
                    vJSON = JSON.parse(raw);

                  } catch(e) {
                    alert("JSON Parsing Error: " + e.message)
                  }
                  if (vJSON) {
                    self.setValue4JSON(vJSON);
                  }
                }
              } else {
                console.log("Ignored file format for MIME type '"+mimetype+"'");
              }
            } 
          }  
        }, false);

        if (image_file) {
          reader4image.readAsDataURL(image_file);
        }
      });

      saveButton.addEventListener('click', function (e) {
        var vFilename = self.name4file.value || self.options.image_filename ||  "image";
        var vFormat = "undef";
        if (self.options && self.options.not_empty && self.signaturePad.isEmpty()) {
          alert("Please provide an image at JSON Editor '" + self.path + "'.");
        } else {

          if (self.options && self.options.image_filename ) {
            vFilename = self.options.image_filename;
          } else {
            vFilename = 'image'; 
          }
          vFilename += "_" + self.path ; 
          vFilename = vFilename.replace(/[^a-zA-Z0-9]/g,"_");
          if (self.options && self.options.image_format) {
            vFormat = self.options.image_format;
          } else {
            vFormat = 'png'; 
          }
          vFormat = vFormat.toUpperCase();
          if (setFormat && setFormat.value) {
            vFormat = setFormat.value;
            console.log("Selected Image Format for Export = '" + vFormat + "'");
            vFormat = vFormat.toLowerCase();
          }
          switch (vFormat) {
            case "png":
                vFilename += "." + vFormat.toLowerCase();
                dataURL = self.signaturePad.toDataURL();
                self.download_blob(vFilename,dataURL);
            break;
            case "jpg":
                vFilename += "." + vFormat.toLowerCase();
                dataURL = self.signaturePad.toDataURL("image/jpeg");
                self.download_blob(vFilename,dataURL);
            break;
            case "svg":
                vFilename += "." + vFormat.toLowerCase();
                
                dataURL = self.signaturePad.toDataURL("image/svg+xml+img");
                self.download_blob(vFilename,dataURL);
            break;
            case "svg-raw":
                
                vFilename += "-raw.svg";
                dataURL = self.signaturePad.toDataURL("image/svg+xml");
                self.download_blob(vFilename,dataURL);

            break;
            case "svg-img":
                
                vFilename += "-img.svg";
                dataText = self.signaturePad.toDataText("image/svg+xml+img");
                self.download_text(vFilename,dataText);
            break;
            case "json":
                vFilename += "." + vFormat.toLowerCase();
                
                dataText = JSON.stringify(self.getValue(),null,4);
                self.download_text(vFilename,dataText);
            break;
            default:
                vFilename += "." + "png";
                dataURL = self.signaturePad.toDataURL();
                self.download_blob(vFilename,dataURL);

          };
          console.log("Save to File '" + vFilename + "'");
          
        }
        console.log("Image '" + vFilename + "' Saved Image");
      });

      this.control = this.theme.appendFormControl(
        this.container,
        this.label, signatureContainer,
        this.description, this.question,
        null,null,
        this.preview_input
      );
      
      this.refreshValue();

      canvas.width = signatureContainer.offsetWidth;
      if (this.options && this.options.canvas_height) {
        
        canvas.height = this.options.canvas_height;
      } else {
        canvas.height = '300'; 
      }
      if (this.options && this.options.canvas_width) {
        
        canvas.width = this.options.canvas_width;
      } else {
        canvas.width = '500'; 
      }
    } else {
      var message = document.createElement('p');
      message.innerHTML = 'Signature pad is not available, please include SignaturePad from http://github.com/szimek/signature_pad';
      this.container.appendChild(message);
    };
    this.penColor = penColor;
    this.bgColor = bgColor;
    this.canvas = canvas;
    if (this.signaturePad) {
        this.value = this.signaturePad.toJSON();
    } else {
      this.value = {};
    }
  },
  postBuild: function() {
    this._super();
    if (this.get_options_schema("enable_edit",true) == true) {
      this.show_editor();
    }

  },
  checkHidden: function(elementID) {
    var vBoolean = false;
    if (this.options) {
      if (this.options.hiddenMenu) {
        
        if (this.options.hiddenMenu.hasOwnProperty(elementID) ) {
          vBoolean = this.options.hiddenMenu[elementID];
        }
      }
    } else {
      console.Warn("this.options do not exist!");
    }

    console.log("SignaturePad Menu: checkHidden('" + elementID + "')="+vBoolean);
    return vBoolean;
  },
  getValue: function(pFormat) {
    
    pFormat = pFormat || "json";
    if (window.SignaturePad) {
    
      if (this.signaturePad) {
        if (pFormat == "dataurl") {
          this.value = this.signaturePad.toDataURL();
        } else {
          this.value = this.signaturePad.toJSON();
          if (this.backgroundImage) {
            if (typeof this.backgroundImage === "string") {
              this.value.backgroundImage = this.backgroundImage;
            } else {
              this.value.backgroundImage = this.backgroundImage;
            }
          }
        }
      } else {
        console.warn("WARNING: signaturePad is not defined in editor '" + this.path + "' getValue() call");
      }
    } else {
      console.warn("WARNING: constructor 'SignaturePad' is not defined in editor '" + this.path + "' getValue() call");
    }
    return this.value;
  },
  max_tile_width: 450,
  max_tile_height: 250,
  clearCanvas: function() {
    var self = this;
    self.signaturePad.clear();
    self.signaturePad._data = [];
    self.value.backgroundImage = null;
    self.backgroundImage = null;
  },
  setCanvasSize: function(pWidth, pHeight) {
    var self = this;
    var ratio = 1.0;
    var vMargin = 40;
    var vWidth  = pWidth || this.max_tile_width;
    var vHeight = pHeight || this.max_tile_height;
    if (self.container.offsetWidth < vWidth+vMargin) {
        if (self.container.offsetWidth > 0) {
          ratio = self.container.offsetWidth/(vWidth+vMargin);
          vWidth = Math.floor(ratio*vWidth);
          vHeight = Math.floor(ratio*vHeight);
          if (vWidth < 10) vWidth = 10;
          if (vHeight < 10) vHeight = 10;
        }
    };
    self.canvas.height = vHeight;
    self.canvas.width = vWidth;
    self.value.canvas_width = vWidth;
    self.value.canvas_height = vHeight;
    
    self.canvas.getContext("2d").scale(1.0, 1.0);
  },
  setBase64Value: function (val) {
    var self = this;
    if (val !== '') {

      var img = new Image();
      
      img.onload = function ()  {
        self.signaturePad.clear();
        var disp = self.canvas.style.display;
        
        self.canvas_raw.height = img.height;
        self.canvas_raw.width = img.width;
        self.canvas_raw.getContext("2d").drawImage(img, 0, 0);
        
        self.setCanvasSize(img.width,img.height);
        $copy2canvas4size(self.canvas_raw,self.canvas,self.canvas.width,self.canvas.height)

        self.backgroundImage = $canvas2json(self.canvas);
        self.value.backgroundImage = self.backgroundImage;

        self.setBackgroundImage(self.backgroundImage);

        console.log("SignaturePad - Image loaded - width=" + img.width+" height="+img.height+ " canvas.width="+self.canvas.width+" canvas.height="+self.canvas.height);

      }
      
      img.src = val;
    }
  },
  setValue: function (val) {
    var self = this;
    
    if (window.SignaturePad) {

      if (self.signaturePad) {
        
        self.signaturePad.clear();
        
        if (val) {
          
          if (typeof(val) == "string") {
            
            this.clearCanvas();
            this.setBase64Value(val)
          } else {
            if (typeof(val) == "object") {
              self.setValue4JSON(val);
            }
          }
        } else {
          console.warn("WARNING: value parameter 'val' is not defined in editor '" + this.path + "' setValue() call");
        }
      } else {
        console.warn("WARNING: Constructor 'SignaturePad' is not defined in editor '" + this.path + "' setValue() call");
      }
      if (self.watch_listener) {
        self.watch_listener();
        self.jsoneditor.notifyWatchers(this.path);
      }
      return false;
    }
  },

  getValue4JSON:function () {
    
    return this.getValue();
  },
  setValue4JSON:function (pJSON) {
    var self = this;
    var pad =  this.signaturePad;
    
    if (pJSON) {
      pad.clear();
      pad._data = [];
      
      if (pJSON.canvas_width || pJSON.canvas_height) {
        var vHeight = pJSON.canvas_height || this.options.canvas_height || this.canvas.height;
        var vWidth  = pJSON.canvas_width  || this.options.canvas_width  || this.canvas.width;
        this.setCanvasSize(vWidth,vHeight);
      }
      if (pJSON.penColor) {
        this.penColor.value = pJSON.penColor;
        this.signaturePad.penColor = pJSON.penColor;
        this.value.penColor = pJSON.penColor;
      }
      pJSON.backgroundColor = pJSON.backgroundColor || this.options.backgroundColor || "#FFFFFF";
      
      this.setBackgroundColor(pJSON.backgroundColor);
      console.log("Set Background Color SignaturePad: "+ this.bgColor.value);

      if (pJSON.backgroundImage) {

        if (typeof pJSON.backgroundImage === "string") {
          this.backgroundImage = {
             "width": this.canvas.width,
             "height": this.canvas.height,
             "tilewidth": this.canvas.width,
             "tileheight": this.canvas.height,
             "widthcount": 1,  
             "heightcount":1,   
             "tiles":[]
          };
          this.backgroundImage.tiles.push(pJSON.backgroundImage);
          this.value.backgroundImage = this.backgroundImage;
          
          this.signaturePad.fromDataURL(pJSON.backgroundImage,null,self.update_preview,pJSON.data);
        } else {
          if (pJSON.backgroundImage.width && pJSON.backgroundImage.height) {

            this.backgroundImage = pJSON.backgroundImage;
            this.value = pJSON;
            $json2canvas(pJSON.backgroundImage,this.canvas,self,pJSON.data);

          } else {
            alert("JSON has not a valid background image in the JSON");
          }
        }
      } else {
        console.log("JSON import to SignaturePad - no backgroundImage");
        
        this.setBackgroundColor()

        this.signaturePad.fromDrawingData(pJSON.data);
      }

    }
  },
  setBackgroundColor:function(pBackgroundColor) {
    var vBGcolor = pBackgroundColor || this.value.backgroundColor || this.bgColor.value || "#FFFFFF";
    var ctx = this.canvas.getContext("2d");
    ctx.fillStyle = vBGcolor;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.bgColor.value = vBGcolor;
    this.value.backgroundColor = vBGcolor;
    this.signaturePad.backgroundColor = vBGcolor
    this.bgColor.value = vBGcolor;
  },
  setBackgroundImage: function(pBackgroundImage) {
    
    var self = this;
    
    if (pBackgroundImage) {
      this.backgroundImage = pBackgroundImage;
    }
    this.value.backgroundImage = this.backgroundImage;
    self.refreshValue();
    self.onChange(true);
    
  },

  destroy: function () {
    if(this.canvas && this.canvas.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    if(this.canvas_preview && this.canvas_preview.parentNode) this.canvas_preview.parentNode.removeChild(this.canvas_preview);
    if(this.canvas_raw && this.canvas_raw.parentNode) this.canvas_raw.parentNode.removeChild(this.canvas_raw);
    if(this.preview_image && this.preview_image.parentNode) this.preview_image.parentNode.removeChild(this.preview_image);
    if(this.preview_input && this.preview_input.parentNode) this.preview_input.parentNode.removeChild(this.preview_input);
    this.signaturePad.off();
    delete this.signaturePad;

    this._super();
  }
});

JSONEditor.defaults.editors.geolocation = JSONEditor.defaults.editors.object.extend({
  editortype: "geolocation",
  preBuild: function() {
    var self = this;
    var vDefault = {
      "longitude":-1.0,
      "latitude": 49.0,
      "zoom": 7
    }
    if (this.schema.default) {
      for (var variable in vDefault) {
        if (this.schema.default.hasOwnProperty(variable)) {
          vDefault[variable] = this.schema.default[variable];
        }
      }
    }
    var source_schema = {
      "type": "object",
      "format":"grid",
      "title": this.getTitle(),
      "properties": {
        "latitude": {
            "title": $check_options(self.options,"title4latitude","Latitude:"),
            "type": "number",
            "minimum": -90.0,
            "maximum": +90.0,
            "default": vDefault.latitude
        },
        "longitude": {
            "title": $check_options(self.options,"title4longitude","Longitude:"),
            "type": "number",
            "minimum": -180.0,
            "maximum": +180.0,
            "default":  vDefault.longitude
        },
        "zoom":{
          "title":"Zoom",
          "type": "integer",
          "enum":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
          "default": vDefault.zoom
        }
      },
    };
    
    if (self.schema) {
      for (var variable in source_schema) {
          if (source_schema.hasOwnProperty(variable)) {
            self.schema[variable] = source_schema[variable];
          }
      }
    }
    
    self._super();

  },
  build: function () {
    var self = this;
    self._super();
    this.holder4map = this.theme.getMapHolder('openlayers3');
    
    this.preview_input.appendChild(this.holder4map);
    this.map4loc = null;
    var vMapCenter = [-1.81185, 52.443141];
    var vZoom = 6;
    if (ol) {
        
        var osm_default = new ol.layer.Tile({
          source: new ol.source.OSM()
        });

        this.map4loc = new ol.Map({
          layers: [osm_default],
          target: 'map',
          view: new ol.View({
            center: ol.proj.transform(vMapCenter, 'EPSG:4326', 'EPSG:3857'),
            zoom: vZoom
          })
        });

        var mousePosition = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(7),
        projection: 'EPSG:4326',
        
        target: this.container_preview,
        undefinedHTML: '&nbsp;'
      });

      this.map4loc.addControl(mousePosition);

      this.map4loc.on('click', function(evt) {
        var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');

        var vLonLat = lonlat[0] + ","+ lonlat[1];

        alert("Latitude: "+lonlat[0]+" - Longitude: "+lonlat[1]+" selected");
        //ENd: map.on('click'"
      });

    }  else {
        alert("ERROR: No Internet Access - no OpenLayers")
    };

  }
});
JSONEditor.defaults.editors.map4osm = JSONEditor.defaults.editors.array.extend({
  editortype: "map4osm",
  itemschema: null,
  buildX: function() {
    var self = this;
    this.itemschema = this.schema;
    this.langschema.items = this.itemschema;
    this.schema = this.langschema.items;
    this._super();
  },
  initX: function(pOptions) {
    
    var self = this;
    
    var vOptions = {
      schema:  {
                "type": "array",
                "title": "Language Array",
                "format": "tabs",
                "options": {
                    "disable_collapse": false,
                    "disable_array_add": false,
                    "disable_array_delete": false,
                    "disable_array_reorder": false,
                    "disable_properties": false,
                    "collapsed": false,
                    "hidden": false
                },
                "items": {
                    "type": "number",
                    "title": "Title Root Numberarray ",
                    "default": 34.5,
                    "description": "A description for 'items'  Type: 'number'",
                    "options": {
                        "hidden": false
                    }
                },
            }
    };
    var vSchema = $cloneJSON(pOptions.schema);
    pOptions.schema = vOptions.schema;
    pOptions.schema.items = vSchema;

    this._super(pOptions);
  }
  
});
JSONEditor.defaults.editors.langselect = JSONEditor.defaults.editors.array.extend({
  editortype: "langselect",

  languages: [
      {
          "text": "English",
          "value": "en"
      },
      {
          "text": "Spanish",
          "value": "es"
      },
      {
          "text": "German",
          "value": "de"
      },
      {
          "text": "French",
          "value": "fr"
      },
      {
          "text": "Italian",
          "value": "it"
      },
      {
          "text": "Dutch",
          "value": "nl"
      },
      {
          "text": "Japanese",
          "value": "ja"
      },
      {
          "text": "Polish",
          "value": "pl"
      },
      {
          "text": "Russian",
          "value": "ru"
      },
      {
          "text": "Swedish",
          "value": "sv"
      },
      {
          "text": "Vietnamese",
          "value": "vi"
      },
      {
          "text": "Arabic",
          "value": "ar"
      },
      {
          "text": "Indonesian",
          "value": "id"
      },
      {
          "text": "Malay",
          "value": "ms"
      },
      {
          "text": "Catalan",
          "value": "ca"
      },
      {
          "text": "Czech",
          "value": "cs"
      },
      {
          "text": "Basque",
          "value": "eu"
      },
      {
          "text": "Persian",
          "value": "fa"
      },
      {
          "text": "Korean",
          "value": "ko"
      },
      {
          "text": "Hungarian",
          "value": "hu"
      },
      {
          "text": "Norwegian",
          "value": "no"
      },
      {
          "text": "Portuguese",
          "value": "pt"
      },
      {
          "text": "Romanian",
          "value": "ro"
      },
      {
          "text": "Serbian",
          "value": "sr"
      },
      {
          "text": "Serbo-Croatian",
          "value": "sh"
      },
      {
          "text": "Finnish",
          "value": "fi"
      },
      {
          "text": "Turkish",
          "value": "tr"
      },
      {
          "text": "Ukrainian",
          "value": "uk"
      },
      {
          "text": "Chinese",
          "value": "zh"
      },
      {
          "text": "Bosnian",
          "value": "bs"
      },
      {
          "text": "Bulgarian",
          "value": "bg"
      },
      {
          "text": "Danish",
          "value": "da"
      },
      {
          "text": "Estonian",
          "value": "et"
      },
      {
          "text": "Greek",
          "value": "el"
      },
      {
          "text": "Esperanto",
          "value": "eo"
      },
      {
          "text": "Galician",
          "value": "gl"
      },
      {
          "text": "Hebrew",
          "value": "he"
      },
      {
          "text": "Croatian",
          "value": "hr"
      },
      {
          "text": "Latvian",
          "value": "lv"
      },
      {
          "text": "Lithuanian",
          "value": "lt"
      },
      {
          "text": "Norwegian Nynorsk",
          "value": "nn"
      },
      {
          "text": "Slovak",
          "value": "sk"
      },
      {
          "text": "Slovenian",
          "value": "sl"
      },
      {
          "text": "Thai",
          "value": "th"
      }
  ],
  execute_fetch: function (value4ts) {
    
    var self = this;
    if (window.wtf_fetch) {
      wtf_fetch.getPage(value4ts.article , value4ts.language ,value4ts.domain, function(err, doc) {
        if (doc && doc.wiki) {
          var val = self.getValue();
          if (val && val[value4ts.language] && val[value4ts.language].wiki) {
            val[value4ts.language].wiki  = doc.wiki;
            self.setValue(val);
          } else {
            console.error("Value of langselect JSON editor does not contain a 'wiki' property for languages");
          }
        } else {
          console.error("execute Wiki Fetch was not successfull value="+JSON.stringify(value4ts,null,4));
        }
      });
    }
  },
  preBuild: function() {
    if (this.schema.title4select) {
      var title4sel = this.schema.title4select;
      var id4sel = "language";
      if (this.schema.id4select) {
        id4sel = this.schema.id4select;
        this.schema.items["headerTemplate"] = title4sel +" - [{{self."+id4sel+"}}]";
      }
    }

    if (this.check_options_schema("enable_execute_button",false) === true) {
      if (window.wtf_fetch || document.wtf_fetch) {
        this["execute"] = function () {
          var value4ts = this.getSelectedValue();
          if (value4ts) {
            this.execute_fetch(value4ts);
          } else {
            console.error("selected value for the language does not exist.");
          }
        };
        alert("WTF fetch is defined and execute functions is set");
      } else {
        alert("WTF fetch not defined")
      }
    } else {
    }
    this._super();
  },
  build: function() {
    var self = this;

    this._super();
  },
  postBuild: function() {
    var self = this;

    this._super();
  },
  initX: function(pOptions) {
    
    var self = this;
    
    var vOptions = {
      schema:  {
                "type": "array",
                "title": "Language Array",
                "format": "tabs",
                "options": {
                    "disable_collapse": false,
                    "disable_array_add": false,
                    "disable_array_delete": false,
                    "disable_array_reorder": false,
                    "disable_properties": false,
                    "collapsed": false,
                    "hidden": false
                },
                "items": {
                    "type": "number",
                    "title": "Title Root Numberarray ",
                    "default": 34.5,
                    "description": "A description for 'items'  Type: 'number'",
                    "options": {
                        "hidden": false
                    }
                },
            }
    };
    var vSchema = $cloneJSON(pOptions.schema);
    pOptions.schema = vOptions.schema;
    pOptions.schema.items = vSchema;

    this._super(pOptions);
  }
  
});
JSONEditor.defaults.editors.languageselector = JSONEditor.defaults.editors.enum.extend({
  editortype: "languageselector",
  languages: [
      {
          "text": "English",
          "value": "en"
      },
      {
          "text": "Spanish",
          "value": "es"
      },
      {
          "text": "German",
          "value": "de"
      },
      {
          "text": "French",
          "value": "fr"
      },
      {
          "text": "Italian",
          "value": "it"
      },
      {
          "text": "Dutch",
          "value": "nl"
      },
      {
          "text": "Japanese",
          "value": "ja"
      },
      {
          "text": "Polish",
          "value": "pl"
      },
      {
          "text": "Russian",
          "value": "ru"
      },
      {
          "text": "Swedish",
          "value": "sv"
      },
      {
          "text": "Vietnamese",
          "value": "vi"
      },
      {
          "text": "Arabic",
          "value": "ar"
      },
      {
          "text": "Indonesian",
          "value": "id"
      },
      {
          "text": "Malay",
          "value": "ms"
      },
      {
          "text": "Catalan",
          "value": "ca"
      },
      {
          "text": "Czech",
          "value": "cs"
      },
      {
          "text": "Basque",
          "value": "eu"
      },
      {
          "text": "Persian",
          "value": "fa"
      },
      {
          "text": "Korean",
          "value": "ko"
      },
      {
          "text": "Hungarian",
          "value": "hu"
      },
      {
          "text": "Norwegian",
          "value": "no"
      },
      {
          "text": "Portuguese",
          "value": "pt"
      },
      {
          "text": "Romanian",
          "value": "ro"
      },
      {
          "text": "Serbian",
          "value": "sr"
      },
      {
          "text": "Serbo-Croatian",
          "value": "sh"
      },
      {
          "text": "Finnish",
          "value": "fi"
      },
      {
          "text": "Turkish",
          "value": "tr"
      },
      {
          "text": "Ukrainian",
          "value": "uk"
      },
      {
          "text": "Chinese",
          "value": "zh"
      },
      {
          "text": "Bosnian",
          "value": "bs"
      },
      {
          "text": "Bulgarian",
          "value": "bg"
      },
      {
          "text": "Danish",
          "value": "da"
      },
      {
          "text": "Estonian",
          "value": "et"
      },
      {
          "text": "Greek",
          "value": "el"
      },
      {
          "text": "Esperanto",
          "value": "eo"
      },
      {
          "text": "Galician",
          "value": "gl"
      },
      {
          "text": "Hebrew",
          "value": "he"
      },
      {
          "text": "Croatian",
          "value": "hr"
      },
      {
          "text": "Latvian",
          "value": "lv"
      },
      {
          "text": "Lithuanian",
          "value": "lt"
      },
      {
          "text": "Norwegian Nynorsk",
          "value": "nn"
      },
      {
          "text": "Slovak",
          "value": "sk"
      },
      {
          "text": "Slovenian",
          "value": "sl"
      },
      {
          "text": "Thai",
          "value": "th"
      }
  ],
  itemschema: null,
  preBuild: function() {
    var self = this;
    if (this.schema) {
      
      if (!this.schema.enum) {
        this.schema.enum = [];
        this.schema.format = "select";
        if (!this.schema.options) {
          this.schema.options = {};
        }
        this.options["enum_titles"] = [];
        
        for (var i = 0; i < self.languages.length; i++) {
          this.schema.enum.push(self.languages[i].value);
          this.options.enum_titles.push(self.languages[i].text);
        }
      }
    }
    this._super();
  },
  postBuild: function() {
    var self = this;
    this._super();
    if (this.schema) {
      
      if (this.schema.default) {
        if (!this.value) {
          this.value = this.schema.default;
          this.switcher.value = this.value;
          
        }
      }
    }
  },
  
});
JSONEditor.defaults.editors["plot4array"] = JSONEditor.defaults.editors.object.extend({
  editortype: "plot4array",
  format:"morris",

  execute: function(pFormat) {
    var vFormat = pFormat || this.format;
    alert("Plot Graph in Format ")
  },
  getNumColumns: function() {
    return 12;
  },
  preBuild: function() {
    var self = this;
    var vDefault = 

    vDataJSON.schema4json =  {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "additionalProperties": true,
        "title": "CSV2Chart",
        "definitions": {
            "comment": {
                "title": "Comment:",
                "type": "string",
                "format": "textarea",
                "default": ""
            },
            "yesno": {
                "default": "yes",
                "type": "string",
                "enum": [
                    "yes",
                    "no"
                ]
            }
        },
        "type": "object",
        "id": "http://niebert.github.io/json-editor",
        "options": {
            "disable_collapse": false,
            "disable_edit_json": false,
            "disable_properties": false,
            "collapsed": false,
            "hidden": false
        },
        "defaultProperties": [
            "type",
            "linewidth",
            "interpolate",
            "showSymbols",
            "sizeSymbols",
            "width",
            "height",
            "legend",
            "colorpalette",
            "colors",
            "axis",
            "data"
        ],
        "properties": {
            "type": {
                "type": "string",
                "id": "/properties/type",
                "title": "Type",
                "default": "line",
                "enum": [
                    "line",
                    "stackedarea",
                    "area",
                    "rect"
                ],
                "format": "text",
                "description": "Type of chart: 'line' for line chart, 'area' is a line chart with colored area under the curve. 'stackedarea' for multiple data column with aggregate area of values as stack. 'rect' for bar charts with rectangular visualization of discrete values",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 10
            },
            "linewidth": {
                "type": "integer",
                "id": "/properties/linewidth",
                "title": "Linewidth",
                "default": 2,
                "description": "Defines the 'linewidth'  in pixels as 'integer' value",
                "enum": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ],
                "options": {
                    "hidden": false
                },
                "propertyOrder": 20
            },
            "interpolate": {
                "type": "string",
                "id": "/properties/interpolate",
                "title": "Interpolate",
                "default": "line",
                "enum": [
                    "line",
                    "curve",
                    "none"
                ],
                "format": "text",
                "description": "Defines the methof how the data is interpolated, 'linear'=straight lines between the data point or 'curve' for a curved/smooth interpolation between the points. ",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 30
            },
            "showSymbols": {
                "type": "string",
                "id": "/properties/showSymbols",
                "title": "Show Symbols",
                "enum": [
                    "yes",
                    "no"
                ],
                "default": "yes",
                "format": "text",
                "description": "Show data points as symbols in the chart.",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 40
            },
            "sizeSymbols": {
                "type": "integer",
                "id": "/properties/linewidth",
                "title": "Size of Symbols",
                "default": 3,
                "enum": [
                    0,
                    1,
                    2,
                    3,
                    4,
                    5,
                    6,
                    7,
                    8,
                    9,
                    10
                ],
                "options": {
                    "hidden": false
                },
                "propertyOrder": 45
            },
            "width": {
                "type": "integer",
                "id": "/properties/width",
                "title": "Width",
                "default": 600,
                "description": "A description for 'width'  of the chart as 'integer' value",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 50
            },
            "height": {
                "type": "integer",
                "id": "/properties/height",
                "title": "Height",
                "default": 480,
                "description": "A description for 'height' of the chart as 'integer' value",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 60
            },
            "legend": {
                "type": "string",
                "id": "/properties/legend",
                "title": "Legend",
                "default": "Legend",
                "description": "A Label for the legend for the graph in Wikiversity",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 65
            },
            "colorpalette": {
                "type": "string",
                "id": "/properties/colorpalette",
                "title": "Colorpalette",
                "default": "user-defined",
                "enum": [
                    "default",
                    "user-defined"
                ],
                "format": "text",
                "description": "Defines the 'colorpalette' for the curves in the graph. If set to 'default' the colors for the data column are ignored",
                "options": {
                    "hidden": false
                },
                "propertyOrder": 70
            },
            "colors": {
                "type": "string",
                "id": "/properties/colors",
                "title": "Colors",
                "default": "red,blue,green,black,yellow,#c0c0c0",
                "format": "text",
                "description": "Hidden Comma Separated Values of 'colors' aggregated from the curve colors before export - Type: 'string' Path: '/properties/colors'",
                "options": {
                    "hidden": true
                },
                "propertyOrder": 80
            },
            "axis": {
                "type": "object",
                "id": "/properties/axis",
                "title": "Axis",
                "options": {
                    "disable_collapse": false,
                    "disable_edit_json": false,
                    "disable_properties": false,
                    "collapsed": true,
                    "hidden": false
                },
                "defaultProperties": [
                    "x",
                    "y"
                ],
                "properties": {
                    "x": {
                        "type": "object",
                        "id": "/properties/axis/properties/x",
                        "title": "x-Axis",
                        "options": {
                            "disable_collapse": false,
                            "disable_edit_json": true,
                            "disable_properties": true,
                            "collapsed": true,
                            "hidden": false
                        },
                        "defaultProperties": [
                            "title",
                            "angle",
                            "scaletype",
                            "grid"
                        ],
                        "properties": {
                            "title": {
                                "type": "string",
                                "id": "/properties/axis/properties/x/properties/title",
                                "title": "x-Axis Title ",
                                "default": "unit x-axis",
                                "format": "text",
                                "description": "The x-axis title is usually used for the units of the x-axis (e.g. 'years - Age')",
                                "options": {
                                    "hidden": false
                                },
                                "propertyOrder": 10
                            },
                            "angle": {
                                "type": "string",
                                "id": "/properties/axis/properties/x/properties/angle",
                                "title": "x-Axis Angle",
                                "default": "0",
                                "enum": [
                                    "0",
                                    "-15",
                                    "-30",
                                    "-45",
                                    "-60",
                                    "-75",
                                    "-90",
                                    "15",
                                    "30",
                                    "45",
                                    "60",
                                    "75",
                                    "90"
                                ],
                                "description": "The x-Axis Angle defines the angle for the x-values, e.g. for dates so that the x-value do not overlap. Use -40 degrees for dates or long x-values e.g. 1500000",
                                "options": {
                                    "hidden": false
                                },
                                "propertyOrder": 20
                            },
                            "scaletype": {
                                "type": "string",
                                "id": "/properties/axis/properties/x/properties/scaletype",
                                "title": "Scaletype",
                                "default": "linear",
                                "enum": [
                                    "linear",
                                    "log",
                                    "sqrt"
                                ],
                                "format": "text",
                                "description": "Description for 'scaletype' Type: 'string' Path: '/properties/axis/properties/x/properties/scaletype'",
                                "options": {
                                    "hidden": false
                                },
                                "propertyOrder": 30
                            },
                            "grid": {
                                "type": "string",
                                "id": "/properties/axis/properties/x/properties/grid",
                                "title": "Show x-Grid Lines",
                                "enum": [
                                    "yes",
                                    "no"
                                ],
                                "default": "no",
                                "format": "text",
                                "description": "Show horizontal grid in chart",
                                "options": {
                                    "hidden": false
                                },
                                "propertyOrder": 40
                            }

                        },
                        "propertyOrder": 20
                    },
                    "y": {
                        "type": "object",
                        "id": "/properties/axis/properties/y",
                        "title": "y-Axis",
                        "options": {
                            "disable_collapse": false,
                            "disable_edit_json": true,
                            "disable_properties": true,
                            "collapsed": true,
                            "hidden": false
                        },
                        "defaultProperties": [
                            "title",
                            "scaletype",
                            "grid"
                        ],
                        "properties": {
                            "title": {
                                "type": "string",
                                "id": "/properties/axis/properties/y/properties/title",
                                "title": "Title",
                                "default": "unit y-axis",
                                "format": "text",
                                "description": "The y-axis title is usually used for the units of the y-axis (e.g. 'Kg Weight')",
                                "options": {
                                    "hidden": false
                                },
                                "propertyOrder": 10
                            },
                            "scaletype": {
                                "type": "string",
                                "id": "/properties/axis/properties/y/properties/scaletype",
                                "title": "Scaletype",
                                "default": "linear",
                                "enum": [
                                    "linear",
                                    "log",
                                    "sqrt"
                                ],
                                "format": "text",
                                "description": "Description for 'scaletype' Type: 'string' Path: '/properties/axis/properties/y/properties/scaletype'",
                                "options": {
                                    "hidden": false
                                },
                                "propertyOrder": 20
                            },
                              "grid": {
                                  "type": "string",
                                  "id": "/properties/axis/properties/y/properties/grid",
                                  "title": "Show y-Grid Lines",
                                  "enum": [
                                      "yes",
                                      "no"
                                  ],
                                  "default": "no",
                                  "format": "text",
                                  "description": "Show vertical grid in chart",
                                  "options": {
                                      "hidden": false
                                  },
                                  "propertyOrder": 30
                              },
                        },
                        "propertyOrder": 30
                    }
                },
                "propertyOrder": 110
            },
            "data": {
                "type": "array",
                "id": "/properties/data",
                "title": "Data",
                "format": "tabs",
                "options": {
                    "disable_collapse": false,
                    "disable_array_add": false,
                    "disable_array_delete": false,
                    "disable_array_reorder": false,
                    "disable_properties": false,
                    "collapsed": false,
                    "hidden": false
                },
                "items": {
                    "type": "object",
                    "id": "/properties/data/items",
                    "title": "Data ",
                    "headerTemplate": "Column: {{self.title}}",
                    "options": {
                        "disable_collapse": false,
                        "disable_edit_json": false,
                        "disable_properties": false,
                        "collapsed": false,
                        "hidden": false
                    },
                    "defaultProperties": [
                        "name",
                        "title",
                        "color",
                        "collist",
                        "col"
                    ],
                    "properties": {
                        "name": {
                            "type": "string",
                            "id": "/properties/data/items/properties/name",
                            "title": "Chart Variable Name - Automated Hidden",
                            "default": "y1",
                            "format": "text",
                            "description": "These variable names are automated set as y1, y2, y3, ... according to index",
                            "options": {
                                "hidden": true
                            },
                            "propertyOrder": 10
                        },
                        "title": {
                            "type": "string",
                            "id": "/properties/data/items/properties/title",
                            "title": "Title",
                            "default": "",
                            "format": "text",
                            "description": "Description for the y-values'",
                            "options": {
                                "hidden": false
                            },
                            "propertyOrder": 20
                        },
                        "color": {
                            "type": "string",
                            "id": "/properties/data/items/properties/color",
                            "title": "Color y-Values",
                            "default": "#000000",
                            "format": "color",
                            "description": "The defined color is used for line, curve in the graph if 'colorpalette' is set to 'user-defined for 'colorpalette=default' the default colors are used",
                            "options": {
                                "hidden": false
                            },
                            "propertyOrder": 30
                        },
                        "collist": {
                            "type": "string",
                            "id": "/properties/data/items/properties/collist",
                            "title": "Comma Separated Column List",
                            "default": "",
                            "format": "text",
                            "description": "Thes comma seperated y-values in  'collist' a populated and update by json_post_process() and the values are automated concatenated for y1, y2, y3, ... ",
                            "options": {
                                "hidden": true
                            },
                            "propertyOrder": 40
                        },
                        "col": {
                            "type": "array",
                            "id": "/properties/data/items/properties/col",
                            "title": "Col",
                            "headerTemplate": "Values",
                            "format": "tabs",
                            "options": {
                                "disable_collapse": false,
                                "disable_array_add": false,
                                "disable_array_delete": false,
                                "disable_array_reorder": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "items": {
                                "type": "number",
                                "id": "/properties/data/items/properties/col/items",
                                "title": "Value ",
                                "default": 0.0,
                                "options": {
                                    "hidden": false
                                }
                            },
                            "propertyOrder": 50
                        }
                    }
                },
                "propertyOrder": 120
            }
        }
    };

    var vPlotlyDefault = {
      "plotformat": "2D", 
      "data": {
        "x": [61,60,75,82,89,103,115,121,134,141,125],
        "y": [4,8,8,9,2,9,14,11,18,12,13],
        "mode":"lines"
      },
      "layout": {
        "title4plot": "Title for the Plot",
        "xaxis": {
          "range": {
            "bottom":40,
            "top": 160
          },
          "title4axis": "Square Meters"
        },
        "yaxis": {
          "range": {
            "bottom":5,
            "top": 16
          },
          "title4axis": "Price in Millions"
        },
        "zaxis": {
          "range": {
            "bottom":5,
            "top": 16
          },
          "title4axis": "Price in Millions"
        }
      }
    }; 
    if (this.schema.default) {
      for (var variable in vDefault) {
        if (this.schema.default.hasOwnProperty(variable)) {
          vDefault[variable] = this.schema.default[variable];
        }
      }
    }
    var source_schema = {
      "type": "object",
      "format":"grid2order",
      "title": this.getTitle(),
      "options": {
          "disable_collapse": false,
          "disable_edit_json": false,
          "disable_properties": false,
          "collapsed": false,
          "hidden": false
      },
      "properties": {
        "plotformat": {
            "title": "Plot Format", 
            "type": "string",
            "enum": [
              "2D Line",
              "2D Dots",
              "2D Interpolate",
              "2D Bar",
              "3D Grid",
              "3D Surface"
            ],

            "default": "ploty"
        },
        "layout": {
            "title": "Layout Graph", 
            "type": "object",
            "format":"grid2order",
            "defaultProperties":  {
              "title4axis":"CMD",
              "type": "object",
              "format":"grid2order",

              "headerTemplate": "({{i1}}) {{self.title4axis}}",
              "options":{                
                "enable_execute_button":false,
              },
              "properties": {
                  "title4axis":{
                    "title": "Title",
                    "type": "string",
                    "default":"",
                    "headerTemplate":"{{self}}",
                    "propertyOrder":10,
                    "options":{
                      "enable_preview_edit_button":false,
                      "enable_edit_button":true,
                      "enable_preview": false,
                      "enable_edit":false,
                      "enable_execute_button":false,
                      "grid_columns": 3
                    }
                  },
                  "cmd": {
                    "title": "CAS Command",
                    "type": "casinput",
                    "format":"textarea",
                    "propertyOrder":20,
                    "options":{
                      "enable_preview_button":true,
                      "enable_execute_button":true,
                      "grid_columns": 8
                    }
                  },
                  "result4cmd": {
                    "title": "Result Command",
                    "type": "math4string",
                    "format":"textarea",
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview":true,
                      "enable_preview_button":true,
                      "enable_execute_button":false,
                      "grid_columns": 12
                    }
                  },
                  "plot4cmd": {
                    "title": "Plot 4 Command",
                    "type": "math4plot",
                    "format":"plotly",
                    "propertyOrder":40,
                    "options":{
                      "hidden":false,
                      "enable_preview":true,
                      "enable_preview_button":true,
                      "enable_execute_button":false,
                      "grid_columns": 12
                    }
                  }
              },
            }
        },
        "casfunctions": {
            "title": $check_options(self.options,"title4functions","Functions:"),
            "type": "array",
            "format":"tabs",
            "default":vDefault,
            "items":  {
              "title":"CAS Funktions",
              "type": "object",
              "format":"grid2order",

              "headerTemplate": "({{i1}}) {{self.name}}({{self.args}})",
              "options":{
                
                "enable_execute_button":true,
                "table_columns":[
                  {
                    "width":"30%",
                    "verticalAlign":"bottom",
                    "assign":["name"]
                  },
                  {
                    "width":"20%",
                    "verticalAlign":"top",
                    "assign": ["args"]
                  },
                  {
                    "width":"50%",
                    "verticalAlign":"top",
                    "assign": ["def"]
                  }
                ]
              },
              "properties": {
                  "name":{
                    "title": "Name",
                    "type": "string",
                    "default":"",
                    "propertyOrder":10,
                    "options":{
                      "enable_preview_edit_button":true,
                      "enable_preview": true,
                      "enable_edit":false,
                      "enable_play_button":false,
                      "grid_columns": 3
                    }
                  },
                  "args": {
                    "title": "Arguments",
                    "type": "casinput",
                    "format":"textarea",
                    "propertyOrder":20,
                    "options":{
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 9
                    }
                  },
                  "def": {
                    "title": "Definition",
                    "type": "string",
                    
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 12
                    }
                  }
              },
            }
        }
      },

    };
    var X_source_schema = {
      "type": "object",
      "format":"grid",
      "title": this.getTitle(),
      "properties": {
        "castype": {
            "title": $check_options(self.options,"title4castype","Computer Algebra System:"),
            "type": "string",
            "enum": [
              "algebrite",
              "maxima",
              "octave",
              "r",
              "javascript"
            ],

            "default": "maxima"
        },
        "commands": {
            "title": $check_options(self.options,"title4commands","Commands:"),
            "type": "array",
            "format":"tabs",
            "default":vDefault.commands,
            "items":  {
              "title":"CMD",
              "type": "cascommand",
              "format":"grid2order",

              "headerTemplate": "({{i1}}) {{self.cmdtitle}}",
              "options":{
                
                "enable_execute_button":true,
                "table_columns":[
                  {
                    "width":"25%",
                    "verticalAlign":"top",
                    "assign": ["cmdtitle"]
                  },
                  {
                    "width":"75%",
                    "verticalAlign":"top",
                    "assign":["cmd"]
                  },
                  {
                    "width":"100%",
                    "verticalAlign":"bottom",
                    "assign":["result4cmd"]
                  }
                ]
              },
              "properties": {
                  "cmdtitle":{
                    "title": "Title",
                    "type": "string",
                    "default":"",
                    "headerTemplate":"{{self}}",
                    "propertyOrder":10,
                    "options":{
                      "enable_preview_edit_button":false,
                      "enable_edit_button":true,
                      "enable_preview": false,
                      "enable_edit":false,
                      "enable_execute_button":false,
                      "grid_columns": 3
                    }
                  },
                  "cmd": {
                    "title": "CAS Command",
                    "type": "casinput",
                    "format":"textarea",
                    "propertyOrder":20,
                    "options":{
                      "enable_preview_button":true,
                      "enable_execute_button":true,
                      "grid_columns": 8
                    }
                  },
                  "result4cmd": {
                    "title": "Result Command",
                    "type": "math4string",
                    "format":"textarea",
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview":true,
                      "enable_preview_button":true,
                      "enable_execute_button":false,
                      "grid_columns": 12
                    }
                  },
                  "plot4cmd": {
                    "title": "Plot 4 Command",
                    "type": "math4plot",
                    "format":"plotly",
                    "propertyOrder":40,
                    "options":{
                      "hidden":false,
                      "enable_preview":true,
                      "enable_preview_button":true,
                      "enable_execute_button":false,
                      "grid_columns": 12
                    }
                  }
              },
            }
        },
        "casfunctions": {
            "title": $check_options(self.options,"title4functions","Functions:"),
            "type": "array",
            "format":"tabs",
            "default":vDefault.casfunctions,
            "items":  {
              "title":"CAS Funktions",
              "type": "object",
              "format":"grid2order",

              "headerTemplate": "({{i1}}) {{self.name}}({{self.args}})",
              "options":{
                
                "enable_execute_button":true,
                "table_columns":[
                  {
                    "width":"30%",
                    "verticalAlign":"bottom",
                    "assign":["name"]
                  },
                  {
                    "width":"20%",
                    "verticalAlign":"top",
                    "assign": ["args"]
                  },
                  {
                    "width":"50%",
                    "verticalAlign":"top",
                    "assign": ["def"]
                  }
                ]
              },
              "properties": {
                  "name":{
                    "title": "Name",
                    "type": "string",
                    "default":"",
                    "propertyOrder":10,
                    "options":{
                      "enable_preview_edit_button":true,
                      "enable_preview": true,
                      "enable_edit":false,
                      "enable_play_button":false,
                      "grid_columns": 3
                    }
                  },
                  "args": {
                    "title": "Arguments",
                    "type": "casinput",
                    "format":"textarea",
                    "propertyOrder":20,
                    "options":{
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 9
                    }
                  },
                  "def": {
                    "title": "Definition",
                    "type": "string",
                    
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 12
                    }
                  }
              },
            }
        }
      },
    };
    
    if (self.schema) {
      for (var variable in source_schema) {
          if (source_schema.hasOwnProperty(variable)) {
            self.schema[variable] = source_schema[variable];
          }
      }
    };
    
    self._super();
  },
  build: function() {
    this._super();
    
    this.show_preview();
    
  },
  change: function() {
    
    this._super();
    if (this.preview_input) {

      this.show_preview();
    } else {
    }
  },
  math2latex: function (pContent) {
    var vContent = pContent || "";
    
    if (vContent) {
      var arr = vContent.split("\n");
      
      vContent = "\\begin{array}{l} \n \\displaystyle " + arr.join("\\\\\n \\displaystyle ") + "\n\\end{array}";
    }
    if (vContent.indexOf("*")>=0) {

    }
    vContent = "\\( \\displaystyle "+vContent+"\\)";
    return vContent;
  },
  update_preview: function () {
    if (window.MathJax) {
    			
    			var vContent = this.getValue();
          
          vContent = this.math2latex(vContent);
          this.preview_input.innerHTML = vContent;
          MathJax.Hub.Typeset();

    } else {
    		
        this._super();
    }
  },
  postBuild: function () {

  },
  build_preview: function (preview_options,new_title) {
    
    var container_preview = preview_options.container_preview;
    this._super(preview_options,new_title);
    var self = this;
    
    if (container_preview) {
      container_preview.innerHTML = "";
    }
  }

});
JSONEditor.defaults.editors.math4string = JSONEditor.defaults.editors.string.extend({
  editortype: "math4string",
  format:"latex",

  sanitize: function(value) {
    value = value + "";
    return value;
    
  },
  getNumColumns: function() {
    return 2;
  },
  build: function() {
    this._super();
    
    this.show_preview();
    
  },
  change: function() {
    
    this._super();
    if (this.preview_input) {

      this.show_preview();
    } else {
    }
  },
  math2latex: function (pContent) {
    var vContent = pContent || "";
    
    if (vContent) {
      var arr = vContent.split("\n");
      
      vContent = "\\begin{array}{l} \n \\displaystyle " + arr.join("\\\\\n \\displaystyle ") + "\n\\end{array}";
    }
    if (vContent.indexOf("*")>=0) {

    }
    vContent = vContent.replace(/\^([0-9]+)/g,function (expression,number) { return "^{"+number+"}"})
    vContent = "\\( \\displaystyle "+vContent+"\\)";
    return vContent;
  },
  update_preview: function (pContent) {
    var vContent = pContent || this.getValue();
    if (window.MathJax) {

          vContent = this.math2latex(vContent);
          this.preview_input.innerHTML = vContent;
          MathJax.Hub.Typeset();

    } else {
    		
        this._super();
    }
  },
  updateContentText: function(content_text) {
    this._super(content_text);
    this.update_preview(content_text);
  },
  postBuild: function () {

    this._super();
  },
  build_preview: function (preview_options,new_title) {
    
    var container_preview = preview_options.container_preview;
    this._super(preview_options,new_title);
    var self = this;
    
    if (container_preview) {
      container_preview.innerHTML = "";
    }
  }

});
JSONEditor.defaults.editors.math4plot = JSONEditor.defaults.editors.object.extend({
  editortype: "cascommand",
  
  execute: function () {
      
  },

  preBuild: function () {
    var self = this;
    var vDefault = {};
    vDefault = this.extend_with_schema_defaults(vDefault);
    var schema_part = {
      "type4plot":{
          "type": "string",
          "title": "Type Plot",
          "default": "line2d",
          "enum":[
            "line2d",
            "line3d",
            "surface3d",
            "marker2d",
            "marker3d",
            "linemarker2d",
            "linemarker3d"
          ],
          "format": "text",
          "description": "Description for 'type4plot' Type: 'string' Path: '/properties/data2d/items/properties/type4plot'",
          "options": {
              "hidden": false
          },
          "propertyOrder": 10
      }
    };
    var hidden4mode = false;
    var source_schema = {
        "title": this.getTitle(),
        "type": "object",
        "url4jsoneditor": "http://niebert.github.io/json-editor",
        "options": {
            "disable_collapse": false,
            "disable_edit_json": false,
            "disable_properties": false,
            "collapsed": true,
            "hidden": false
        },
        "defaultProperties": [
            "data2d",
            "data3d",
            "layout"
        ],
        "properties": {
            "data2d": {
                "type": "array",
                "path": "/properties/data2d",
                "title": "Data for Plot",
                "format": "tabs",
                "options": {
                    "disable_collapse": false,
                    "disable_array_add": false,
                    "disable_array_delete": false,
                    "disable_array_reorder": false,
                    "disable_properties": false,
                    "collapsed": true,
                    "hidden": false
                },
                "items": {
                    "headerTemplate": "Data 2D [{{i1}}]",
                    "oneOf": [
                        {
                            "type": "object",
                            "path": "/properties/data2d/oneof0",
                            "title": "Data 2D [1]",
                            "options": {
                                "disable_collapse": false,
                                "disable_edit_json": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "defaultProperties": [
                                "type4plot",
                                "mode4lines",
                                "mode",
                                "x",
                                "y",
                                "line"
                            ],
                            "properties": {
                                "type4plot": schema_part.type4plot,
                                "mode4lines": {
                                    "type": "string",
                                    "contentTemplate": "mode4lines",
                                    "options": {
                                        "hidden": hidden4mode,
                                    },
                                    "propertyOrder": 20
                                },
                                "mode": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/mode",
                                    "title": "Mode",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'mode' Type: 'string' Path: '/properties/data2d/items/properties/mode'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 30
                                },
                                "x": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/x",
                                    "title": "X",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'x' Type: 'string' Path: '/properties/data2d/items/properties/x'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 40
                                },
                                "y": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/y",
                                    "title": "Y",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'y' Type: 'string' Path: '/properties/data2d/items/properties/y'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 50
                                },
                                "line": {
                                    "type": "object",
                                    "path": "/properties/data2d/items/properties/line",
                                    "title": "Line",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "color",
                                        "width"
                                    ],
                                    "properties": {
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data2d/items/properties/line/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "text",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data2d/items/properties/line/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "width": {
                                            "type": "integer",
                                            "path": "/properties/data2d/items/properties/line/properties/width",
                                            "title": "Width",
                                            "default": 4,
                                            "description": "A description for 'width'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 60
                                },
                                "mode4markers": {
                                    "type": "string",
                                    "contentTemplate":"mode4markers",
                                    "options": {
                                        "hidden": hidden4mode
                                    }
                                },
                                "markers": {
                                    "type": "object",
                                    "options": {
                                        "hidden": true
                                    }
                                }
                            }
                        },
                        {
                            "type": "object",
                            "path": "/properties/data2d/oneof1",
                            "title": "[1] /properties/data2d",
                            "options": {
                                "disable_collapse": false,
                                "disable_edit_json": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "defaultProperties": [
                                "type4plot",
                                "mode",
                                "mode4markers",
                                "x",
                                "y",
                                "markers"
                            ],
                            "properties": {
                              "type4plot": schema_part.type4plot,
                              "mode": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/mode",
                                    "title": "Mode",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'mode' Type: 'string' Path: '/properties/data2d/items/properties/mode'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 20
                                },
                                "mode4markers": {
                                    "type": "string",
                                    "contentTemplate":"mode4markers",
                                    "options": {
                                        "hidden": hidden4mode
                                    },
                                    "propertyOrder": 30
                                },
                                "x": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/x",
                                    "title": "X",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'x' Type: 'string' Path: '/properties/data2d/items/properties/x'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 40
                                },
                                "y": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/y",
                                    "title": "Y",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'y' Type: 'string' Path: '/properties/data2d/items/properties/y'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 50
                                },
                                "markers": {
                                    "type": "object",
                                    "path": "/properties/data2d/items/properties/markers",
                                    "title": "Markers",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "color",
                                        "size"
                                    ],
                                    "properties": {
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data2d/items/properties/markers/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "color",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data2d/items/properties/markers/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "size": {
                                            "type": "integer",
                                            "path": "/properties/data2d/items/properties/markers/properties/size",
                                            "title": "Size",
                                            "default": 7,
                                            "description": "A description for 'size'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 60
                                },
                                "mode4lines": {
                                    "type": "string",
                                    "options": {
                                        "hidden": true
                                    }
                                },
                                "line": {
                                    "type": "object",
                                    "options": {
                                        "hidden": true
                                    }
                                }
                            }
                        },
                        {
                            "type": "object",
                            "path": "/properties/data2d/oneof2",
                            "title": "[2] /properties/data2d",
                            "options": {
                                "disable_collapse": false,
                                "disable_edit_json": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "defaultProperties": [
                                "type4plot",
                                "mode4lines",
                                "mode",
                                "x",
                                "y",
                                "line",
                                "markers"
                            ],
                            "properties": {
                                "type4plot": schema_part.type4plot,
                                "mode4lines": {
                                    "type": "string",
                                    "title": "Mode Lines",
                                    "contentTemplate": "mode4lines",
                                    "format": "text",
                                    "description": "Description for 'mode4lines' Type: 'string' Path: '/properties/data2d/items/properties/mode4lines'",
                                    "options": {
                                        "hidden": hidden4mode
                                    },
                                    "propertyOrder": 20
                                },
                                "mode": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/mode",
                                    "title": "Mode",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'mode' Type: 'string' Path: '/properties/data2d/items/properties/mode'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 30
                                },
                                "x": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/x",
                                    "title": "X",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'x' Type: 'string' Path: '/properties/data2d/items/properties/x'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 40
                                },
                                "y": {
                                    "type": "string",
                                    "path": "/properties/data2d/items/properties/y",
                                    "title": "Y",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'y' Type: 'string' Path: '/properties/data2d/items/properties/y'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 50
                                },
                                "line": {
                                    "type": "object",
                                    "path": "/properties/data2d/items/properties/line",
                                    "title": "Line",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "color",
                                        "width"
                                    ],
                                    "properties": {
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data2d/items/properties/line/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "text",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data2d/items/properties/line/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "width": {
                                            "type": "integer",
                                            "path": "/properties/data2d/items/properties/line/properties/width",
                                            "title": "Width",
                                            "default": 4,
                                            "description": "A description for 'width'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 60
                                },
                                "markers": {
                                    "type": "object",
                                    "path": "/properties/data2d/items/properties/markers",
                                    "title": "Markers",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "color",
                                        "size"
                                    ],
                                    "properties": {
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data2d/items/properties/markers/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "color",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data2d/items/properties/markers/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "size": {
                                            "type": "integer",
                                            "path": "/properties/data2d/items/properties/markers/properties/size",
                                            "title": "Size",
                                            "default": 7,
                                            "description": "A description for 'size'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 70
                                },
                                "mode4markers": {
                                    "type": "string",
                                    "options": {
                                        "hidden": true
                                    }
                                }
                            }
                        }
                    ]
                },
                "propertyOrder": 10
            },
            "data3d": {
                "type": "array",
                "path": "/properties/data3d",
                "title": "Data 3D",
                "format": "tabs",
                "options": {
                    "disable_collapse": false,
                    "disable_array_add": false,
                    "disable_array_delete": false,
                    "disable_array_reorder": false,
                    "disable_properties": false,
                    "collapsed": true,
                    "hidden": false
                },
                "items": {
                    "headerTemplate": "Data 3D {{i1}}",
                    "oneOf": [
                        {
                            "type": "object",
                            "title": "[0] plot3d - surface",
                            "format":"grid2order",
                            "options": {
                                "disable_collapse": false,
                                "disable_edit_json": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "defaultProperties": [
                                "type4plot",
                                "mode4lines",
                                "mode",
                                "x",
                                "y",
                                "z",
                                "opacity",
                                "line"
                            ],
                            "properties": {
                                "type4plot": schema_part.type4plot,
                                "mode4surface": {
                                    "type": "string",
                                    "contentTemplate": "surface",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 20
                                },
                                "mode": {
                                    "type": "string",
                                    "contentTemplate": "surface",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 30
                                },
                                "x": {
                                    "type": "string",
                                    "title": "x-Values - CSV",
                                    "default": "",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 40
                                },
                                "y": {
                                    "type": "string",
                                    "title": "y-Values - CSV",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 50
                                },
                                "z": {
                                    "type": "string",
                                    "title": "y-Values - CSV",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 60
                                },
                                "opacity": {
                                    "type": "slider",
                                    "path": "/properties/data3d/items/properties/opacity",
                                    "title": "Opacity",
                                    "default": 0.7,
                                    "description": "A description for 'opacity'  Type: 'number'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 70
                                },
                                "line": {
                                    "type": "object",
                                    "path": "/properties/data3d/items/properties/line",
                                    "title": "Line",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "width",
                                        "color"
                                    ],
                                    "properties": {
                                        "width": {
                                            "type": "integer",
                                            "path": "/properties/data3d/items/properties/line/properties/width",
                                            "title": "Width",
                                            "default": 10,
                                            "description": "A description for 'width'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data3d/items/properties/line/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "color",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data3d/items/properties/line/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 80
                                },
                                "mode4markers": {
                                    "type": "string",
                                    "options": {
                                        "hidden": true
                                    }
                                },
                                "markers": {
                                    "type": "object",
                                    "options": {
                                        "hidden": true
                                    }
                                },
                                "mode4linesmarkers": {
                                    "type": "string",
                                    "options": {
                                        "hidden": true
                                    }
                                }
                            }
                        },
                        {
                            "type": "object",
                            "format":"grid2order",
                            "path": "/properties/data3d/oneof1",
                            "format":"grid2order",
                            "title": "[1] 2D Lines ",
                            "options": {
                                "disable_collapse": false,
                                "disable_edit_json": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "defaultProperties": [
                                "type4plot",
                                "mode4markers",
                                "mode",
                                "x",
                                "y",
                                "z",
                                "opacity",
                                "markers"
                            ],
                            "properties": {
                                "type4plot": schema_part.type4plot,
                                "mode4markers": {
                                    "type": "string",
                                    "contentTemplate": "markers",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 20
                                },
                                "mode": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/mode",
                                    "title": "Mode",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'mode' Type: 'string' Path: '/properties/data3d/items/properties/mode'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 30
                                },
                                "x": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/x",
                                    "title": "X",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'x' Type: 'string' Path: '/properties/data3d/items/properties/x'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 40
                                },
                                "y": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/y",
                                    "title": "Y",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'y' Type: 'string' Path: '/properties/data3d/items/properties/y'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 50
                                },
                                "z": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/z",
                                    "title": "Z",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'z' Type: 'string' Path: '/properties/data3d/items/properties/z'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 60
                                },
                                "opacity": {
                                    "type": "number",
                                    "path": "/properties/data3d/items/properties/opacity",
                                    "title": "Opacity",
                                    "default": 0.7,
                                    "description": "A description for 'opacity'  Type: 'number'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 70
                                },
                                "markers": {
                                    "type": "object",
                                    "path": "/properties/data3d/items/properties/markers",
                                    "title": "Markers",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "color",
                                        "size"
                                    ],
                                    "properties": {
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data3d/items/properties/markers/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "color",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data3d/items/properties/markers/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "size": {
                                            "type": "integer",
                                            "path": "/properties/data3d/items/properties/markers/properties/size",
                                            "title": "Size",
                                            "default": 7,
                                            "description": "A description for 'size'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 80
                                },
                                "mode4lines": {
                                    "type": "string",
                                    "options": {
                                        "hidden": true
                                    }
                                },
                                "line": {
                                    "type": "object",
                                    "options": {
                                        "hidden": true
                                    }
                                },
                                "mode4linesmarkers": {
                                    "type": "string",
                                    "options": {
                                        "hidden": true
                                    }
                                }
                            }
                        },
                        {
                            "type": "object",
                            "path": "/properties/data3d/oneof2",
                            "title": "[2] plot3d - scatter3d - lines+markers",
                            "options": {
                                "disable_collapse": false,
                                "disable_edit_json": false,
                                "disable_properties": false,
                                "collapsed": false,
                                "hidden": false
                            },
                            "defaultProperties": [
                                "type4plot",
                                "mode4linesmarkers",
                                "mode",
                                "x",
                                "y",
                                "z",
                                "opacity",
                                "line",
                                "markers"
                            ],
                            "properties": {
                                "type4plot": schema_part.type4plot,
                                "mode4linesmarkers": {
                                    "type": "string",
                                    "contentTemplate": "mode4linesmarkers",
                                    "options": {
                                        "hidden": hidden4mode
                                    },
                                    "propertyOrder": 20
                                },
                                "mode": {
                                    "type": "string",
                                    "contentTemplate": "scatter3d",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 30
                                },
                                "x": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/x",
                                    "title": "X",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'x' Type: 'string' Path: '/properties/data3d/items/properties/x'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 40
                                },
                                "y": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/y",
                                    "title": "Y",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'y' Type: 'string' Path: '/properties/data3d/items/properties/y'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 50
                                },
                                "z": {
                                    "type": "string",
                                    "path": "/properties/data3d/items/properties/z",
                                    "title": "Z",
                                    "default": "",
                                    "format": "text",
                                    "description": "Description for 'z' Type: 'string' Path: '/properties/data3d/items/properties/z'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 60
                                },
                                "opacity": {
                                    "type": "number",
                                    "path": "/properties/data3d/items/properties/opacity",
                                    "title": "Opacity",
                                    "default": 0.7,
                                    "description": "A description for 'opacity'  Type: 'number'",
                                    "options": {
                                        "hidden": false
                                    },
                                    "propertyOrder": 70
                                },
                                "line": {
                                    "type": "object",
                                    "path": "/properties/data3d/items/properties/line",
                                    "title": "Line",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "width",
                                        "color"
                                    ],
                                    "properties": {
                                        "width": {
                                            "type": "integer",
                                            "path": "/properties/data3d/items/properties/line/properties/width",
                                            "title": "Width",
                                            "default": 10,
                                            "description": "A description for 'width'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data3d/items/properties/line/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "color",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data3d/items/properties/line/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 80
                                },
                                "markers": {
                                    "type": "object",
                                    "path": "/properties/data3d/items/properties/markers",
                                    "title": "Markers",
                                    "options": {
                                        "disable_collapse": false,
                                        "disable_edit_json": false,
                                        "disable_properties": false,
                                        "collapsed": false,
                                        "hidden": false
                                    },
                                    "defaultProperties": [
                                        "color",
                                        "size"
                                    ],
                                    "properties": {
                                        "color": {
                                            "type": "string",
                                            "path": "/properties/data3d/items/properties/markers/properties/color",
                                            "title": "Color",
                                            "default": "",
                                            "format": "color",
                                            "description": "Description for 'color' Type: 'string' Path: '/properties/data3d/items/properties/markers/properties/color'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 10
                                        },
                                        "size": {
                                            "type": "integer",
                                            "path": "/properties/data3d/items/properties/markers/properties/size",
                                            "title": "Size",
                                            "default": 7,
                                            "description": "A description for 'size'  Type: 'integer'",
                                            "options": {
                                                "hidden": false
                                            },
                                            "propertyOrder": 20
                                        }
                                    },
                                    "propertyOrder": 90
                                }
                            }
                        }
                    ]
                },
                "propertyOrder": 20
            },
            "layout": {
                "type": "object",
                "path": "/properties/layout",
                "title": "Layout",
                "options": {
                    "disable_collapse": false,
                    "disable_edit_json": false,
                    "disable_properties": false,
                    "collapsed": false,
                    "hidden": false
                },
                "defaultProperties": [
                    "xaxis4title",
                    "yaxis4title",
                    "zaxis4title"
                ],
                "properties": {
                    "xaxis4title": {
                        "type": "string",
                        "path": "/properties/layout/properties/xaxis4title",
                        "title": "Xaxis Title",
                        "default": "",
                        "format": "text",
                        "description": "Description for 'xaxis4title' Type: 'string' Path: '/properties/layout/properties/xaxis4title'",
                        "options": {
                            "hidden": false
                        },
                        "propertyOrder": 10
                    },
                    "yaxis4title": {
                        "type": "string",
                        "path": "/properties/layout/properties/yaxis4title",
                        "title": "Yaxis Title",
                        "default": "",
                        "format": "text",
                        "description": "Description for 'yaxis4title' Type: 'string' Path: '/properties/layout/properties/yaxis4title'",
                        "options": {
                            "hidden": false
                        },
                        "propertyOrder": 20
                    },
                    "zaxis4title": {
                        "type": "string",
                        "path": "/properties/layout/properties/zaxis4title",
                        "title": "Zaxis Title",
                        "default": "",
                        "format": "text",
                        "description": "Description for 'zaxis4title' Type: 'string' Path: '/properties/layout/properties/zaxis4title'",
                        "options": {
                            "hidden": false
                        },
                        "propertyOrder": 30
                    }
                },
                "propertyOrder": 30
            }
        }
    }
    var updated_schema = this.extend_from_schema(source_schema);

    this._super();
  },
  
  extract_plot_params: function(pCMD,pPlotType) {

  },
  execute4plot: function(pCMD,pPlotType) {
    
    var out = "Plot '"+pPlotType.type.toUpperCase()+"'-Command undefined";
    if (pCMD) {
      out = pCMD;
    }
    var options = this.init_preview_options(options);
    options.container_preview.innerHTML = out;
  },
  execute: function () {
    var val = this.getValue();
    if (val) {
      if (val.hasOwnProperty("cmd")) {
        if (val.hasOwnProperty("result4cmd")) {
          var path = this.path + ".cmd";
          var vCASinput = this.jsoneditor.getEditor(path);
          if (vCASinput && vCASinput.execute) {
            vCASinput.execute();
          }
        } else {
          console.error("CAS Command executed at editor '"+this.path+"' does not have 'result4cmd' attribute that is used to store the result of the computation for the executed command in 'cmd'.");
        }
      } else {
        console.error("CAS Command executed at editor '"+this.path+"' does not have 'cmd' attribute that contains the executed command");
      }
    } else {
      console.error("CAS Command executed at editor '"+this.path+"' does not have a valid JSON for executing a CAS command");
    }

  }
});
JSONEditor.defaults.editors.casinput = JSONEditor.defaults.editors.string.extend({
  editortype: "casinput",
  cas_command: null,
  cas_list: null,
  cas: null,

  postBuild: function() {
    this._super();
    this.determine_cas();
  },
  execute: function () {
    var vCR = "";
    var result = "";
    var vContent = this.getValue();
    if (vContent) {
        var arr = vContent.split("\n");
        
        for (var i = 0; i < arr.length; i++) {
          result += vCR + this.execute_line(arr[i]);
          vCR = "\n";
        }
        var path4result = this.parent.path+".result4cmd";
        var vEditor4Result = this.jsoneditor.getEditor(path4result);
        if (vEditor4Result) {
          
          vEditor4Result.setValue(result);
        }
    } else {
      alert("Editor "+this.parent.editortype+".execute('"+this.parent.path+"') provides no value with getValue()");
    }

  },
  execute_line: function (pCMD) {
    var result = " ";
    if (pCMD) {
      var vCMD = pCMD;
      
      if (this.cas_command) {

        if (vCMD.indexOf(":=") > 0) {
          if (this.cas) {
            var cmd_arr = vCMD.split(":=");
            if ((cmd_arr[0]).indexOf("(")>= 0) {

              var vFCT = this.parse_function(vCMD);
              result = this.append_function(vFCT);
            } else {
              var vVAR = this.parse_variable(vCMD);
              result = this.append_variable(vVAR);
            }
          }  else {
            console.error("CAS Function definition could not be executed at editor '"+this.path+"' does not have 'cas' editor that contains a 'casfunctions' editor");
          }

        } else {

            var vPlotType = this.check_plot_type(vCMD);
            if (vPlotType) {
                result = this.execute_plot(vCMD,vPlotType);
            } else {
              
                vCMD = vCMD.trim();

                var regex = /[A-Za-z][A-Za-z0-9_]*\(/g;
                var vMatches = vCMD.match(regex);
                
                var vExec = vCMD;
                if (vMatches && vMatches.length > 0) {
                  
                  vExec = this.expand_fct_eval(vCMD);
                }
                result = this.execute_cas(vCMD,vExec);
                
            }
          }

        } else {
          console.error("CAS Command executed at editor '"+this.path+"' does not have 'result4cmd' attribute that is used to store the result of the computation for the executed command in 'cmd'.");
        }
    } else {
      console.error("CAS Command counld not be executed at editor '"+this.path+"' because no CAS command provided with 'pCMD'");
    }
    return result;
  },
  execute_plot: function(vCMD,vPlotType) {
    var ret = "PLOT2D";
    if (this.cas_command) {
      
      ret = this.cas_command.execute4plot(vPlotType,vCMD);
    } else {
      alert("Call PLOT with '"+vCMD+"' could not been executed - cascommand missing!");
    }
    return ret;
  },
  execute_plot3d: function(vCMD) {
    var ret = "PLOT3D";
    if (this.cas_command) {
      ret = this.cas_command.execute4plot("3D",vCMD);
    } else {
      alert("Call PLOT3D with '"+vCMD+"' could not been executed");
    }
    return ret;
  },
  expand_fct_eval: function (pCMD,terms,count) {
    count = count || 1;
    var ret = "expand-fct-eval";
    if (this.cas_command) {
      ret = this.cas_command.expand_fct_eval(pCMD,terms,count);
    } else {
      alert("Call: expand_fct_eval() - with '"+pCMD+"' could not been executed");
    }
    return ret;
  },
  expand_fct_def: function (pCMD) {
    var ret = pCMD;
    var exp_def = false;
    if (pCMD) {
      ret = pCMD.replace(/[A-Za-z][A-Za-z0-9_]*\(/,function (expr) {
        if (expr == "d(") {
          exp_def = true
        }
        return expr
      })
      if (exp_def == true) {
        ret = this.cas4run(this.expand_fct_eval(pCMD))
      }
    }
    return ret
  },
  execute_cas: function (pCMD,pExec) {
    var result = pCMD + "-CAS-Undefined"
    if (window.Algebrite) {
      
      try {
        var vExec = pExec || pCMD;
        if (vExec && (vExec.indexOf("#") >= 0)) {
          vExec = this.remove_comments(vExec);
        }

        if (vExec.trim()) {
            result_non_latex = Algebrite.run(vExec).toString();
            if (/[0-9\+\*\^\{\}]+/.test(result_non_latex)) {
              
              result = this.input2latex(result_non_latex);
              
            } else {
              result = Algebrite.run("printlatex("+vExec+")");
            }
            result = this.input2latex( this.remove_comments(pCMD)) + " = " +result;
        } else {
            result = "";
        }

      } catch (err) {
        var errDesc = err;
        alert("Error:" + errDesc );
        
        result = "";
      }
    } else {
      alert("Algebrite library 'algebra4browser.js' was not embedded.")
    }
    return result;
  },
  determine_cas_command: function () {
    if (this.parent) {
      this.cas_command = this.parent;
      
    }
  },
  determine_cas_list: function () {
    this.determine_cas_command();
    if (this.cas_command) {
      if (this.cas_command.parent) {
        this.cas_list = this.cas_command.parent;
      } else {
        this.cas_list = null;
      }
    }
  },
  cas4run: function (cmd) {
    var res = cmd;
    if (this.cas_command) {
      res = this.cas_command.cas4run(cmd);
    }
    return res;
  },
  determine_cas: function () {
    this.determine_cas_list();
    if (this.cas_list) {
      if (this.cas_list.parent) {
        this.cas = this.cas_list.parent;
        if (this.cas.editors["casfunctions"]) {
          this.casfunctions = this.cas.editors["casfunctions"];
        } else {
        }
        if (this.cas.editors["casvariables"]) {
          this.casvariables = this.cas.editors["casvariables"];
        } else {
        }
      } else {
        this.cas = null;
      }
    }
  },
  parse_function: function(cmd) {
    var def_split = cmd.split(":=");
    var vName = "";
    var vFCT = null;
    var vFCTargs = def_split[0];
    var vDef = def_split[1];
    vFCTargs = vFCTargs.trim();
    vDef = vDef.trim();
    if (vFCTargs && vDef) {
      if (vFCTargs.indexOf("(")>0) {
        var vFCTsplit = vFCTargs.split("(");
        var vName = vFCTsplit[0];
        vName = vName.trim();
        
        var vArgs = vFCTsplit[1];
        if (vArgs.indexOf(")")>0) {
          vArgs.substr(0,vArgs.indexOf(")"));
          vArgs = vArgs.replace(/[^a-zA-Z0-9_,]/g,"");
          
          vFCT = {
            "name":vName,
            "args":vArgs,
            "def":this.expand_fct_def(vDef)
          }
        } else {
          alert("Definition of function '"+cmd+"' has no arguments.");
          
        };
      } else {
        alert("Definition of function '"+cmd+"' has no function name.");
        
      }
    } else {
      alert("Command definition for '"+cmd+"' failed.");
      
    }
    return vFCT;
  },
  X_append_function: function (pFCT) {
    var result = "undefined-function-declaration";
    var vFCT = pFCT || null;
    if (vFCT) {

      if (this.casfunctions) {
          this.casfunctions.setValue4Name(vFCT.name,vFCT);
          result = this.fct2result(vFCT);
          
      } else {
          alert("Editor for CAS-Function ["+path+"] does not exist!");
      }
    }
    return result;
  },
  append_function: function (pFCT) {
    var vFound = false;
    var result = "undefined-function-declaration";
    var vFCT = pFCT || null;
    if (vFCT) {

      if (this.cas) {
        var vEditor4CAS = this.cas;
        var path = vEditor4CAS.path+".casfunctions";
        var vEditor4FCT = this.jsoneditor.getEditor(path);
        if (vEditor4FCT) {
          var cf = vEditor4FCT.getValue();
          for (var i = 0; i < cf.length; i++) {
            if (cf[i].name == vFCT.name) {
              vFound = true;
              cf[i] = vFCT;
            }
          }
          if (vFound == false) {
            cf.push(vFCT)
          }
          vEditor4FCT.setValue(cf);
          result = this.fct2result(vFCT);
          
        } else {
          alert("Editor for CAS-Variables ["+path+"] does not exist!");
        }
      }
    }
    return result;
  },
  get_function_def: function (fname) {
    var vFCT = null;
    if (fname) {
      if (this.cas) {
        var vEditor4CAS = this.cas;
        var path = vEditor4CAS.path+".casfunctions";
        var vEditor4FCT = this.jsoneditor.getEditor(path);
        if (vEditor4FCT) {
          var cf = vEditor4FCT.getValue();
          for (var i = 0; i < cf.length; i++) {
            if (cf[i].name == fname) {
              vFCT = cf[i];
              break;
            }
          }
          
        } else {
          alert("Editor for CAS-Function ["+path+"] does not exist!");
        }
      } else {
        console.error("Function name not defined in casinput.js:149 ");
      }
    }
    return vFCT;
  },
  fct2result:function(pFCT) {
    var result = "";
    if (pFCT && pFCT.def) {
      var vAlgebriteCMD = "printlatex("+pFCT.def+")";
      result = pFCT.name +"("+pFCT.args+")" + ":=" + Algebrite.run(vAlgebriteCMD).toString();
      
    }
    return result;
  },
  parse_variable: function(cmd) {
    
    var vVAR = null;
    var def_split = cmd.split(":=");
    var vName = def_split[0];
    var vDef = def_split[1];
    vName = vName.trim();
    vDef = vDef.trim();
    if (vName && vDef) {
      var vNameClean = vName.replace(/[^a-zA-Z0-9_]/g,"");
      if (vName == vNameClean) {
        
        vVAR = {
            "name":vName,
            "def":vDef
        }
      } else {
        alert("Definition of variable '"+cmd+"' has invalid characters for '"+vname+"'.");
        
      }
    } else {
      alert("Variable definition for '"+cmd+"' failed.");
      
    }
    return vVAR;
  },
  append_variable: function (pVAR) {
    var vFound = false;
    var result = "undefined-function-declaration";
    var vVAR = pVAR || null;
    if (vVAR) {

      if (this.cas) {
        var vEditor4CAS = this.cas;
        var path = vEditor4CAS.path+".casvariables";
        var vEditor4VAR = this.jsoneditor.getEditor(path);
        if (vEditor4VAR) {
          var cv = vEditor4VAR.getValue();
          for (var i = 0; i < cv.length; i++) {
            if (cv[i].name == vVAR.name) {
              vFound = true;
              cv[i] = vVAR;
            }
          }
          if (vFound == false) {
            cv.push(vVAR)
          }
          vEditor4VAR.setValue(cv);
          result = this.var2result(vVAR);
          
        } else {
          alert("Editor for CAS-Function ["+path+"] does not exist!");
        }
      }
    }
    return result;
  },
  get_variable_def: function (vname) {
    var vVAR = null;
    if (vname) {
      if (this.cas) {
        var vEditor4CAS = this.cas;
        var path = vEditor4CAS.path+".casvariables";
        var vEditor4VAR = this.jsoneditor.getEditor(path);
        if (vEditor4VAR) {
          var cv = vEditor4VAR.getValue();
          for (var i = 0; i < cv.length; i++) {
            if (cv[i].name == vname) {
              vVAR = cv[i];
              break;
            }
          }
          
        } else {
          alert("Editor for CAS-Variables ["+path+"] does not exist!");
        }
      } else {
        console.error("Variable name not defined in casinput.js:237 ");
      }
    }
    return vVAR;
  },
  expand_variables: function(cmd) {
    var self = this;
    if (cmd && cmd.length > 0) {
      var regex = /([A-Za-z][A-Za-z0-9_]*)/g;
      
      cmd = cmd.replace(regex,function (variable) {
        var ret = variable;
        var vardef = self.get_variable_def(variable);
        if (vardef) {
          
          ret = vardef.def;
        } else {

        }
        return ret;
      });
    } else {
      alert("Expand variable definition for '"+cmd+"' failed.");
      
    }
    return cmd;
  },
  cas4run: function (cmd) {
    var ret = cmd;
    if (Algebrite) {
      ret = Algebrite.run(cmd).toString()
    }
    return ret;
  },
  var2result:function(pVAR) {
    var result = "var2result-undefined";
    if (pVAR && pVAR.def) {
      var vAlgebriteCMD = "printlatex("+pVAR.def+")";
      result = pVAR.name + ":=" + this.cas4run(vAlgebriteCMD);
    }
    return result;
  },
  remove_comment_line: function (pCMD) {
    var vCMD = "";

    if (pCMD) {
      pCMD = pCMD.replace(/#([0-9ABCDE]{6})/g,function (expression,colorcode) {
        return "___"+colorcode+"___";
      });
      var vPos = pCMD.indexOf("#");
      if  (vPos >=0) {
        vCMD = pCMD.substr(0,vPos);
      } else {
        vCMD = pCMD;
      }
      vCMD = vCMD.replace(/___([0-9ABCDE]{6})___/g,function (expression,colorcode) {
        return "#"+colorcode;
      });

    }
    return vCMD;
  },
  remove_comments: function (pCMD) {
    var vCMD = "";
    if (pCMD) {
      var vLineArray = pCMD.split("\n");
      for (var i = 0; i < vLineArray.length; i++) {
        vLineArray[i] = this.remove_comment_line(vLineArray[i]);
      }
      vCMD = vLineArray.join("\n");
    }
    return vCMD;
  },
  input2latex: function(pCMD) {
    var vCMD= "";
    if (pCMD) {
      vCMD = pCMD.replace(/\*/g," \\cdot ");
      vCMD = vCMD.replace(/\*/g,"\\cdot ");
      vCMD = this.replace_string(vCMD,"= nil\n","\n");
      vCMD = vCMD.replace(/= nil$/,"");
      
    }
    return vCMD;
  },
  extract_plot_params: function(pPlotType,pCMD) {
    if (this.cas_command) {
      return this.cas_command.extract_plot_params(pPlotType,pCMD);
    } else {
      alert("ERROR: "+this.editortype+".extract_plot_params('"+this.path+"') cascommand not defined");
      return pPlotType;
    }
  },
  check_plot_type: function (pCMD) {
    var types = ["plot2d","plot3d","curve2d","curve3d","plane3d"];
    
    var dim4in  = [1,2,1,1,2];
    var dim4out = [1,1,2,3,3];
    var vCMD = pCMD || " ";
    var ret = {
      "type":"-",
      "dim4in": 0,
      "dim4out": 0,
      "plotargs":"",
      "fct":"",
      "fct2expanded":"", 
      "data4plot":{
        
      },
      "param4plot":{
        
      },
      "var2data":[] 
    };
    for (var i = 0; i < types.length; i++) {
      var search = types[i]+"(";
      var pos = vCMD.indexOf(search);
      if (pos >= 0) {
        var plotargs = $find_parameter_of_function(vCMD,types[i],pos);
        ret = {
          "type": types[i],
          "dim4in": dim4in[i],
          "dim4out": dim4out[i],
          "plotargs":plotargs,
          "fct": "f(x)",
          "fct2expanded": "x^2",
          "param4plot":{}
        };
        ret.param4plot = this.extract_plot_params(ret,vCMD);
      }
    }
    if (ret.type == "-") {
      ret = null
    }
    return ret;
  }
});
JSONEditor.defaults.editors.cascommand = JSONEditor.defaults.editors.object.extend({
  editortype: "cascommand",

  postBuild: function() {
    this._super();
    this.determine_cas();
  },
  determine_cas_list: function () {
    if (this.parent) {
        this.cas_list = this.parent;
    } else {
      this.cas_list = null;
    }
  },
  determine_cas: function () {
    if (this.editors["cmdtitle"]) {
      this.title4cmd = this.editors["cmdtitle"];
    } else {
    };
    this.determine_cas_list();
    if (this.cas_list) {
      
      if (this.cas_list.parent) {
        this.cas = this.cas_list.parent;
        
        if (this.cas.editors["casfunctions"]) {
          this.casfunctions = this.cas.editors["casfunctions"];
          
        } else {
        }
        if (this.cas.editors["casvariables"]) {
          this.casvariables = this.cas.editors["casvariables"];
          
        } else {
        }
      } else {
        this.cas = null;
      }
    } else {
    }
  },
  get_function_def: function (fname) {
    var vFCT = null;
    if (fname) {
      if (this.is_Math_function(fname) == true) {
        vFCT = {
            "name": fname,
            "args": "x",
            "def": fname+"(x)"
          };
      } else if (this.casfunctions) {
          var cf = this.casfunctions.getValue();
          if (cf) {
            for (var i = 0; i < cf.length; i++) {
              if (cf[i].name == fname) {
                vFCT = cf[i];
                break;
              }
            }
          } else {
            alert("cf not defined");
          }
          
      } else {
      }
    }  else {
    }
    return vFCT;
  },
  get_variable_def: function (vname) {
    var vVAR = null;
    if (vname) {
      if (this.casvariables) {
          var cv = this.casvariables.getValue();
          for (var i = 0; i < cv.length; i++) {
            if (cv[i].name == vname) {
              vVAR = cv[i];
              break;
            }
          }
          
      } else {
          alert("Editor for CAS-Variables ["+path+"] does not exist!");
      }

    } else {
      console.error("Variable name 'vname'  not defined in cascommand.js:107 ");
    }
    return vVAR;
  },
  extract_plot_params: function(pPlotType,pCMD) {
    
    var self = this;
    pCMD = pCMD || " ";
    if (pPlotType && pPlotType.plotargs) {
      var pa = pPlotType.plotargs;
      if (!pPlotType.param4plot) {
        pPlotType.param4plot = {};
      };
      pa = pa.replace(/\s*/g,"");
      var regex = /,([A-Za-z][A-Za-z0-9_]*)\[([^\]]+)\]/g;
      pCMD = pCMD.replace(regex,function (expression,variable,params) {
        var ret = ""; 
        
        if (variable) {
          pPlotType.param4plot[variable] = params.split(",");
        } else {
          
        }
        return ret;
      });
      if (pPlotType.type) {
          pPlotType.is_function_call = true;
          var fctstr  = $find_parameter_of_function(pCMD,pPlotType.type,0);
          var term_list = [];
          var vec_list = [];
          var ops_list = [];
          var varstr  = this.tokenize_functions(term_list,fctstr);
          varstr  = this.tokenize_operations(ops_list,varstr);
          if (varstr) {
            
            if (pPlotType.dim4out > 1) {
              varstr = this.tokenize_vectors(vec_list,varstr);
            }
            
            var fctlist   = varstr.split(",");
            var fct2xlist = [];
            for (var i = 0; i < fctlist.length; i++) {

              if (pPlotType.dim4out > 1) {

                fctlist[i] = this.detokenize_vectors(vec_list,fctlist[i]);
                
                if ((fctlist[i]).indexOf("[") >=0) {
                  pPlotType.is_function_call = false;
                }
              }

              fctlist[i] = this.detokenize_functions(term_list,fctlist[i]);

              var fct2x = fctlist[i];
              fct2x = this.detokenize_operations(ops_list,fct2x);
              fct2x = this.detokenize_functions(term_list,fct2x);
              fct2x = this.expand_fct_eval(fct2x,term_list);
              
              fct2xlist.push(fct2x);
            }
            
            pPlotType.fctlist = fctlist;
            pPlotType.fct2xlist = fct2xlist;
            pPlotType.fct = fctlist[0];
            pPlotType.fct2expanded = fct2xlist[0];
          } else {
            
            pPlotType.fct = fctstr;
            
            pPlotType.fctlist = [fctstr];
            pPlotType.fct2expanded = this.expand_fct_eval(pPlotType.fct,terms_list);
          }
      }
      this.add_var2data(pPlotType);
      var fctid = "timeout"+this.get_unique_id();
      window.call4timeout = function(pEditor,pFunction,pParam) {
        
        if (pEditor) {
          
          if (pEditor[pFunction]) {
            
            if (pParam) {
              
              pEditor[pFunction](pParam)
            } else {
              pEditor[pFunction]();
            }
          }
        } else {
          alert("pEditor not defined")
        }
      }
      this.load_spinner();
      setTimeout(window.call4timeout,"100",self,"calculate_output",pPlotType);

    } else {
      console.error("ERROR: "+this.editortype+".execute4plot('"+this.path+"') pCMD='"+pCMD+"' - pPlotType.plotargs undefined");
    }
    return pPlotType.param4plot;
  },
  get_step4domain: function (pt,range,valcount) {
    var max_steps = 100;
    var min_steps = 50;
    return this.get_step4domain_min_max(range,valcount,min_steps,max_steps)
  },
  get_step4domain_3d: function (pt,range,valcount) {
    var max_steps = 100;
    var min_steps = 50;

    return this.get_step4domain_min_max(range,valcount,min_steps,max_steps)
  },
  get_step4domain_min_max: function (range,valcount,min_steps,max_steps) {

    var step = 1;
    range = parseFloat(range+"");
    if (range > max_steps) {
      step = Math.floor(range/max_steps) + 1;
    } else {
      var tof = 0; 
      var lastnum = [8,6,5,4,2,1];
      var lnmax = lastnum.length - 1
      var ln = lnmax;
      var tenpow = 1.0;
      while ((range/step < min_steps) && (tof<10)) {
        if (ln == lnmax) {
          tenpow *= 0.1;
          ln = 0;
          tof++;
        } else {
          ln++;
        };
        step = tenpow * lastnum[ln];
        step = step.toFixed(tof);
      }
    }
    
    return {
         "step":step,
         "fixed": i
       };
  },
  get_segmentation: function (pt,vname,param4vname) {
    var vc_default = 10;
    var segmentation = vc_default;
    if (param4vname) {
      if (param4vname.length > 2) {
        param4vname[2] = Math.floor(param4vname[2]*1);
        param4vname[1] = param4vname[1]*1
        param4vname[0] = param4vname[0]*1
      } else if (param4vname.length > 1) {
        param4vname.push(vc_default);
        param4vname[1] = param4vname[1]*1;
        param4vname[0] = param4vname[0]*1;
      } else if (param4vname.length > 0) {
        param4vname[0] = param4vname[0]*1;
        param4vname.push(param4vname[0]+10);
        param4vname.push(vc_default);
      } else {
        param4vname.push(-5);
        param4vname.push(+5);
        param4vname.push(11);
      }
    } else {
      param4vname = [-5,+5,11]
    }
    if (param4vname[2]<=0) {
      param4vname[2] = vc_default;
    }
    pt.param4plot[vname] = param4vname;
    segmentation = param4vname[2];
    return segmentation;
  },
  populate_domain4plot: function (pt,vname,param4vname) {
    
    var ret = [];
    var segmentation = 20;
    if (vname) {
      if (!param4vname) {
        
        pt.param4plot[vname] = [-5,+5,11];
      } else {
        segmentation = this.get_segmentation(pt,vname,param4vname);
      };
      param4vname = pt.param4plot[vname];
      
      var range = param4vname[1] - param4vname[0];
      range = Math.round(range);
      var s4d = 1;
      if (pt.dim4in > 1) {
          s4d = this.get_step4domain_3d(pt,range,segmentation);
      } else {
          s4d = this.get_step4domain(pt,range,segmentation);
      }
      var step = s4d.step;
      pt["fixed"] = s4d.fixed;
      var xval =0;
      var xstart   = parseFloat(param4vname[0]+"")*1.0;
      var maxval = parseFloat(param4vname[1]+"")*1.0;

      if (step > 0) {
          
          var count = Math.round(range/step);

          for (var i = 0; i <= count; i++) {
              xval = (xstart + i*step).toFixed(s4d.fixed);
              ret.push(xval);
          }
      } else {
          console.warn("step=0 not valid - use a default range from [0,10]");
          ret =[0,1,2,3,4,5,6,7,8,9,10];
      }
    } else {
      console.warn("populate_domain4plot() - vname is missing ");
    }
    return ret;
  },
  get_fct_name: function (fcall) {
    var ret = "fname"+self.get_unique_id();
    if (fcall && fcall.indexOf("(") > 0) {
      ret = fcall.substr(0,fcall.indexOf("("));
    }
    return ret;
  },
  
  float2integer: function (y) {
    if (y && y.length > 0) {
      if (Array.isArray(y[0])) {
        for (var i = 0; i < y.length; i++) {
          y[i] = this.float2integer_column(y[i]);
        }
      } else {
        y = this.float2integer_column(y);
      }
    }
    return y;
  },

  float2integer_column: function(arr) {
    if (arr && arr.length && (arr.length>0) ) {
      var minval = parseFloat(arr[0]+"");
      var maxval = parseFloat(arr[0]+"");

      for (var k = 0; k < arr.length; k++) {
        arr[k] = parseFloat(arr[k]+"");
        if (arr[k] > maxval) maxval = arr[k];
        if (arr[k] < minval) minval = arr[k];
      }
      var valspan = maxval-minval;
      
      if (valspan > 50) {
        for (var i = 0; i < arr.length; i++) {
          arr[i] = Math.round(arr[i]);
        }
      }
    }
    return arr;
  },
  integer2floatstring: function (value) {
    value = value+"";
    if (value) {
      if (value.indexOf(".") < 0) {
        value = value+".0";
      }
    }
    return value;
  },
  replace_vars_input: function (pPlotType,vname,fct2x) {
  
    var self = this;
    var pt = pPlotType;
    fct2x = fct2x || "undefined4replace2input";
    var val4fct = "";
    
    var regex = /([A-Za-z][A-Za-z0-9_]*)/g;
    var y = [];
    
    if (pt.var2data.length > 0) {
      vname = vname || pt.var2data[0];
      var x = pt.data4plot[vname];
      if (x && x.length > 0) {
        for (var k = 0; k < pt.var2data.length; k++) {
          for (var i = 0; i < x.length; i++) {
            val4fct = fct2x.replace(regex,function (pVar) {
              if (pVar == vname) {
                
                return self.bracket_wrapper(self.integer2floatstring(x[i]));
              } else {
                return pVar;
              }
            });
            y.push(val4fct);
          }
        }
      } else {
        alert("ERROR: replace variables in functional definition - variable name '"+vname+"' is undefined in var2data")
      }
    };
    
    return y;
  },
  calc_info: function (msg) {
    var opt4plot = this.init_preview_options({});

    this.show_preview();
    if (opt4plot.container_preview) {
      opt4plot.container_preview.innerHTML = "";
      var h3 = document.createElement("h3");
      var msgtext = document.createTextNode(msg);
      h3.appendChild(msgtext);
      opt4plot.container_preview.appendChild(h3);
    }
  },
  eval_cas4domain: function (dim4in,y) {
    var self = this;
    var i = 0;
    var cmd;
    
    if (dim4in == 2) {
      var row = 0;
      while (row < y.length) {
        y=y[row];
        i = 0;
        while(i < y.length) {
            
            y[i] = self.cas_numeric(y[i]);
            i++
        }
        y[row]=y;
        
        row++;
      }
    } else if (dim4in = 1) {
      for (var i = 0; i < y.length; i++) {
        y[i] = this.cas_numeric(y[i]);
      }
    } else {
      alert("ERROR: PlotType with input dimension "+pPlotType.dim4in+" cannot be processed");
    }
    return y;
  },
  eval_cas_numeric: function(y) {
    var self = this;
    
    if (y) {
      var i = 0;
      while(i < y.length) {
          y[i] = self.cas_numeric(y[i]);
          i++
      }
    } else {
      console.error("y is not defined in eval_cas_numeric() y="+JSON.stringify(y));
    }
    return y;
  },
  cas4run: function (cmd) {
    var ret = cmd;
    if (Algebrite) {
      ret = Algebrite.run(cmd).toString()
    } else {
      console.warn("Waring: Argebrite is not defined");
    }
    return ret;
  },
  X_cas_numeric: function(pExec) {
    var numstr = "";
    eval("numstr="+pExec);
    return numstr;
    
  },

  cas_numeric: function(pExec) {

    var numstr = Algebrite.run(pExec).toString()
    if (numstr) {
      numstr = this.replace_string(numstr,"...","");
      numstr = this.replace_string(numstr,"Infinity","0.1");
    } else {
      numstr = "9999";
    }
    return numstr;
    
  },
  eval_cas_numeric_check: function(pExec) {
    if (window.Algerite) {
      return Algebrite.run(pExec);
    } else {
      alert("Algebrite is undefined - import js/algebrite4browser.js")
      return "undefined-Algebrite"
    }
  },
  getColorArray: function (pt) {
    var ca = ["red","blue","green","#000000","#C0C0C0"];
    if (this.cas && this.cas.getColorArray) {
      ca = this.cas.getColorArray();
    }
    if (pt && pt.param4plot && pt.param4plot.color && pt.param4plot.color.length) {
      
      var c = pt.param4plot.color;
      if (Array.isArray(c) && c.length > 0) {
        for (var i = 0; i < ca.length; i++) {
          c.push(ca[i]);
        }
        ca = c;
      }
    }
    return ca;
  },
  getCommandTitle: function() {
    
    if (this.title4cmd) {
      return this.title4cmd.getValue();
    } else {
      alert("ERROR: cmdtitle editor not defined");
      return "";
    }
  },
  getLayout4Plot: function(pt) {
    var ret;
    switch (pt.dim4in) {
      case 1:
          switch (pt.dim4out) {
            
            case 1:
              ret = {

                "xaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": pt.var2data[0]
                },
                "yaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": pt.fctlist.join(", ")
                },
                "title": this.getCommandTitle()
            };
            break;
            case 2:
              
              ret = {

                "xaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": "x"
                },
                "yaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": "y"
                },
                "title": this.getCommandTitle()
            };
            break;
            case 3:
              
              ret = {

                "xaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": "x",
                },
                "yaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": "y"
                },
                "zaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": "z"
                },
                "title": this.getCommandTitle()
            };
            break;
            default:

          }
      break;
      case 2:
          switch (pt.dim4out) {
            
            case 1:
              ret = {
                "title":  this.getCommandTitle(),

                X_margin: {
                  l: 65,
                  r: 50,
                  b: 65,
                  t: 90
                }
              };
            break;
            case 1111:
              ret = {

                "xaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": pt.var2data[0]
                },
                "yaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": pt.var2data[1]
                },
                "zaxis": {
                      "type": 'linear',
                      "autorange": true,
                      "title": pt.fctlist
                },
                "title": this.getCommandTitle()
            };
            break;
            default:

          }
      break;
      default:

    }
    return ret;
  },
  plot2preview: function(pt, layout, data) {
    var opt4plot = this.init_preview_options({});

    if (opt4plot.container_preview) {
      
      opt4plot.container_preview.innerHTML = "";
      var div_height = this.get_options_schema("height","600px");
      opt4plot.container_preview.style.height = div_height;
      
      if (window.Plotly) {
          Plotly.newPlot(opt4plot.container_preview, data, layout);
      } else {
          alert("Plotly is not defined")
      }
    } else {
      console.error("container_preview does not exist")
    }
  },
  get_trace_xy: function (pt,x,y,i)  {
    var color4line = this.getColorArray(pt);
    i = i || 0;
    var trace = {
      "x": x,
      "y": y,
      "mode": "lines",
      "type": "scatter",
      "name": (pt.fctlist[i] || ("f"+i)),
      "opacity": this.get_plot_option4index(pt,i,"opacity",0.7),
      "line":{
        "width": this.get_plot_option4index(pt,i,"linewidth",5),
        "color":color4line[i]
      }
    };
    return trace
  },
  calculate_in1_out1: function (pt) {
    var x = pt.data4plot[pt.var2data[0]];
    var data = [];
    for (var i = 0; i < pt.fctlist.length; i++) {
        var y = pt.data4plot["out4data"+i];
        pt.fct = pt.fctlist[i];
        pt.fct2expanded = pt.fct2xlist[i];
        
        y = this.float2integer(y);
        var trace = this.get_trace_xy(pt,x,y,i);
        data.push(trace);
    };
    var layout = this.getLayout4Plot(pt);
    this.plot2preview(pt, layout, data);
  },
  get_curve_xy: function (pt,xy,i) {
    var color4line = this.getColorArray(pt);
    i = i || 0;
    var curve = {
      "type": 'scatter',
      "mode": 'lines',
      "name": (pt.fctlist[i] || ("f"+i)),
      "opacity": this.get_plot_option4index(pt,i,"opacity",0.7),
      "line":{
        "width": this.get_plot_option4index(pt,i,"linewidth",5),
        "color":color4line[i]
      },
      "x":[],
      "y":[]
    };
    for (var i = 0; i < xy.length; i++) {
      var vec = xy[i];
      if (vec) {
        if (vec.length >= 2)  {
          curve.x.push(vec[0]);
          curve.y.push(vec[1]);
        }
      }
    }
    return curve;
  },
  calculate_in1_out2: function (pt) {

      if (pt && pt.data4plot) {
        var t = pt.data4plot[pt.var2data[0]];
        var data = [];
        for (var i = 0; i < pt.fctlist.length; i++) {
            var xy = pt.data4plot["out4data"+i];
            var curve = this.get_curve_xy(pt,xy,i);
            data.push(curve);
        };
        var layout = this.getLayout4Plot(pt);
        this.plot2preview(pt, layout, data);
      } else {
        console.error("calculate_in1_out2(pt) PlotType 'pt' not defined.");
      }

  },
  get_plot_option: function (pt,id4option,default_value,i) {
    var vRet = default_value;
    if (pt && pt.param4plot) {
        vRet = $check_options(pt.param4plot,id4option,default_value);
    }
    return vRet;
  },
  get_plot_option4index: function (pt,i,id4option,default_value) {
    var vRet = default_value;
    if (pt && pt.param4plot) {
        var vArr = $check_options(pt.param4plot,id4option,default_value);
        if (Array.isArray(vArr)) {
          if (vArr.length > 0) {
            if (i < vArr.length) {
              if (i >= 0) {
                vRet = vArr[i];
              }
            } else {
              vRet = vArr[0];
            }
          }
        } else {
          vRet = vArr;
        }
    }
    return vRet;
  },
  get_curve_xyz: function (pt,xyz,i) {
    var color4line = this.getColorArray(pt);
    i = i || 0;
    var curve = {
      "type": 'scatter3d',
      "mode": 'lines',
      "name": (pt.fctlist[i] || ("f"+i)),
      "opacity":  this.get_plot_option4index(pt,i,"opacity",0.7),
      "line":{
        "width": this.get_plot_option4index(pt,i,"linewidth",5),
        "color":color4line[i]
      },
      "x":[],
      "y":[],
      "z":[]
    };
    
    for (var i = 0; i < xyz.length; i++) {

      var vec = xyz[i];
      if (vec) {
        if (vec.length >= 3)  {
          curve.x.push(vec[0]);
          curve.y.push(vec[1]);
          curve.z.push(vec[2]);
        } else {
          console.warn("Output dimension must be 3, but it is just "+vec.length+" in ["+vec.join(",")+"]");
        }
      }
    }
    return curve;
  },
  calculate_in1_out3: function (pt) {
    if (pt && pt.data4plot) {
      var data = [];
      var t = pt.data4plot[pt.var2data[0]];
      for (var i = 0; i < pt.fctlist.length; i++) {
          var xyz = pt.data4plot["out4data"+i];
          var curve = this.get_curve_xyz(pt,xyz,i);
          data.push(curve);
      };
      var layout = this.getLayout4Plot(pt);
      this.plot2preview(pt, layout, data);
    } else {
      console.error("calculate_in1_out3(pPlotType) pPlotType not defined.");
    }
  },
  calculate_in1_output: function (pPlotType) {
    switch (pPlotType.dim4out) {
      case 1:
        this.calculate_in1_out1(pPlotType);
      break;
      case 2:
        this.calculate_in1_out2(pPlotType);
      break;
      case 3:
        this.calculate_in1_out3(pPlotType);
      break;
      default:
        console.error("calculate output is undefined for input dimension "+pPlotType.dim4in);
    }
  },
  get_surface_xyz: function (pt,x,y,z,i)  {
    i = i || 0;
    var surface = {
      "x": x,
      "y": y,
      "z": z,
      
      "type": "surface",
      "name": (pt.fctlist[i] || ("f"+i)),

    };
    return surface;
  },
  calculate_in2_out1: function (pt) {
    if (pt.data4plot) {
      var x = pt.data4plot[pt.var2data[0]];
      var y = pt.data4plot[pt.var2data[1]];
      if (x && y) {
        var data = [];
        for (var i = 0; i < pt.fctlist.length; i++) {
            var z = pt.data4plot["out4data"+i];
            
            if (z) {
              
              var surface = this.get_surface_xyz(pt,x,y,z,i);
              data.push(surface);
            } else {
              console.error("For function '"+pt.fctlist[i]+"' are the z-value undefined - pt.data4plot="+JSON.stringify(pt.data4plot));
            }
        };
        var layout = this.getLayout4Plot(pt);
        this.plot2preview(pt, layout, data);
      } else {
        console.error("Data for '"+pt.var2data[0]+"' or '"+pt.var2data[1]+"' was not defined.");
      }
    } else {
      console.error("calculate_in2_out1() - Input dimension is "+pt.data4plot.length+ " but needs to be 2");
    }

  },
  calculate_in2_out2: function (pt) {
    if (pt.data4plot) {
      var x = pt.data4plot[pt.var2data[0]];
      var y = pt.data4plot[pt.var2data[1]];
      if (x && y) {
        var data = [];
        
        for (var i = 0; i < pt.fctlist.length; i++) {

            var z = pt.data4plot["out4data"+i];
            
            if (z) {
              
              var surface = this.get_surface_xyz(pt,x,y,z,i);
              data.push(surface);
            } else {
              console.error("For function '"+pt.fctlist[i]+"' are the z-value undefined - pt.data4plot="+JSON.stringify(pt.data4plot));
            }
        };
        var layout = this.getLayout4Plot(pt);
        this.plot2preview(pt, layout, data);
      } else {
        console.error("Data for '"+pt.var2data[0]+"' or '"+pt.var2data[1]+"' was not defined.");
      }
    } else {
      console.error("calculate_in2_out1() - Input dimension is "+pt.data4plot.length+ " but needs to be 2");
    }

  },
  calculate_in2_out3: function (pt) {
    if (pt.data4plot) {
      var x = pt.data4plot[pt.var2data[0]];
      var y = pt.data4plot[pt.var2data[1]];
      if (x && y) {
        var data = [];
        
        for (var i = 0; i < pt.fctlist.length; i++) {

            var z = pt.data4plot["out4data"+i];
            
            if (z) {
              
              var surface = this.get_surface_xyz(pt,x,y,z,i);
              data.push(surface);
            } else {
              console.error("For function '"+pt.fctlist[i]+"' are the z-value undefined - pt.data4plot="+JSON.stringify(pt.data4plot));
            }
        };
        var layout = this.getLayout4Plot(pt);
        this.plot2preview(pt, layout, data);
      } else {
        console.error("Data for '"+pt.var2data[0]+"' or '"+pt.var2data[1]+"' was not defined.");
      }
    } else {
      console.error("calculate_in2_out1() - Input dimension is "+pt.data4plot.length+ " but needs to be 2");
    }

  },
  calculate_in2_output: function (pPlotType) {
    
    switch (pPlotType.dim4out) {
      case 1:
        
        this.calculate_in2_out1(pPlotType);
      break;
      case 2:
        
        this.calculate_in2_out2(pPlotType);
      break;
      case 3:
        
        this.calculate_in2_out3(pPlotType);
      break;
      default:
        console.error("calculate output is undefined for input dimension "+pPlotType.dim4in);
    }
  },
  term2string: function (arr) {
    var self = this;
    if(Array.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        if(Array.isArray(arr[i])) {
          arr[i] = self.term2string(arr[i]);
        } else {
          arr[i]+"";
        }
      }
    } else {
      arr = [];
    }
    return arr
  },
  calculate_input1: function (pPlotType) {

      if (pPlotType) {
        var pt = pPlotType;
        var color4line = this.getColorArray();
        var term_list = [];
        
        if (pt.var2data.length > 0) {
          var vname = pt.var2data[0];
          
          var x = pt.data4plot[vname];
          
          x = this.float2integer(x);
          var data = [];
          if (this.cas.parser4math) {
            for (var i = 0; i < pt.fctlist.length; i++) {
              pt.fct = pt.fctlist[i];
              pt.fct2expanded = pt.fct2xlist[i];
              var fct2x = this.cas.parser4math.simplify(pt.fct2expanded);

              var y = this.cas.parser4math.evaluate4array(fct2x,vname,x);

              pt.data4plot["out4data"+i] = y;
              
            }
          } else {
            console.error("Math4JS is not loaded - include script with  <script src=\"js/math4js.js\"></script> before loading jsoneditor.js");
          }
        }
      } else {
        console.error("calculate_input(pPlotType) pPlotType not defined.");
      }
  },
  calculate_input2_function: function (pt,vname1,vname2,x1,x2) {
      var term_list = [];

      var y2 = this.replace_vars_input(pt,vname2,pt.fct2expanded);

      var surface = [];
      for (var i2 = 0; i2 < x2.length; i2++) {

        var y1 = this.replace_vars_input(pt,vname1,y2[i2]);

        surface[i2] = y1; 
        
      }
      surface = this.eval_cas4domain(pt.dim4in,surface);

      pt.data4plot["out4data"+i] = surface;

  },
  calculate_input2: function (pPlotType) {

      if (pPlotType) {
        var pt = pPlotType;
        
        var term_list = [];

        if (pt.var2data.length > 1) {
          var vname1 = pt.var2data[0];
          var vname2 = pt.var2data[1];
          var x1 = pt.data4plot[vname1];
          var x2 = pt.data4plot[vname2];
          
          x1 = this.float2integer(x1);
          x2 = this.float2integer(x2);
          
          for (var i = 0; i < pt.fctlist.length; i++) {
            pt.fct = pt.fctlist[i];
            pt.fct2expanded = this.expand_fct_eval(pt.fct2xlist[i],term_list)+"";
            pt.fct2expanded = pt.fct2expanded.replace(/\s/g,"");
            var y = this.cas.parser4math.evaluate4array2d(pt.fct2expanded,vname1,vname2,x1,x2);
            
            pt.data4plot["out4data"+i] = y;
          }
        }
      } else {
        console.error("calculate_input(pPlotType) pPlotType not defined.");
      }
  },
  calculate_output: function (pPlotType) {
    
    switch (pPlotType.dim4in) {
      case 1:
        this.calculate_input1(pPlotType);
        this.calculate_in1_output(pPlotType);
      break;
      case 2:
        this.calculate_input2(pPlotType);
        this.calculate_in2_output(pPlotType);
      break;
      default:
        console.error("calculate output is undefined for input dimension "+pPlotType.dim4in);
    }
  },
  load_spinner: function () {
    var opt4plot = this.init_preview_options({});

    if (opt4plot.container_preview) {
      opt4plot.container_preview.style.display = "";
      opt4plot.container_preview.innerHTML = "";
      var spinner = this.iconlib.getIcon("brush");

      spinner.style.width = "120px";
      spinner.style.height = "120px";
      opt4plot.container_preview.appendChild(spinner);
      var h2 = document.createElement("h2");
      h2.innerHTML = "Processing Graph ...";
      opt4plot.container_preview.appendChild(h2);
    }
  },
  add_var2data: function (pPlotType) {
    var self = this;
    
    var regex = /([A-Za-z][A-Za-z0-9_]*)/g;
    var hash4var = {};
    if (pPlotType && pPlotType.fct2expanded) {
      
      if (!pPlotType.data4plot) {
        pPlotType.data4plot = {};
      }
      
      if (!pPlotType.var2data) {
        
        pPlotType.var2data = [];
      } else {
        
        var var2data = pPlotType.var2data;
        
        if (var2data.length > 0) {
          for (var i = 0; i < var2data.length; i++) {
            hash4var[var2data[i]] = var2data[i];
          }
          pPlotType.var2data = [];
        }
      }

      var vCMD = pPlotType.fct2expanded;
      vCMD = vCMD.replace(regex,function (variable) {
        if (self.is_Math_function(variable) == false) {
          hash4var[variable] = variable;
          return "";
        } else if (variable == "diff") {
          return "d";
        } else {
          return variable;
        }
      });

      for (var variable in hash4var) {
        if (hash4var.hasOwnProperty(variable)) {
          pPlotType.var2data.push(variable);
        }
      }
      
      var pt =  pPlotType;
      for (var i = 0; i < pt.var2data.length; i++) {
        var vname = pt.var2data[i];
        if (pt.param4plot[vname]) {
          pt.data4plot[vname] = this.populate_domain4plot(pt,vname,pt.param4plot[vname]);
        } else {
          alert("Variable '"+vname+"' has no range definition in "+pt.type+"-command. Add e.g. "+vname+"[-5,5] to definition of the plot command!");
          pt.data4plot[vname] = this.populate_domain4plot(pt,vname,[-5,5]);
        }
      };
      if (pt.var2data.length == pt.dim4in) {
        
      } else {

        pt.dim4in = pt.var2data.length;
        switch (pt.type) {
          case "plot2d":
            if (pt.dim4in > 1) {
              alert("2D-Plot with an input domain dimension of "+pt.dim4in+" is not possible.");
            } else {
              if (pt.dim4in == 1) {
                pt.dim4in = 1;
                pt.dim4out = 1;
              } else {
                alert("Specify the input variable with a plot-range e.g. 'x[-5,5]' in the "+pt.type+" parameters!");
              }
            }
          break;
          case "plot3d":
            if (pt.dim4in > 2) {
              alert("3D-Plot with an input domain dimension of "+pt.dim4in+" is not possible.");
            } else {
              if (pt.dim4in > 0) {
                pt.dim4out = 3 - pt.dim4in;
              } else {
                alert("Specify the input variables with a plot-range e.g. 'x[-5,5] y[3,8]' in the "+pt.type+" parameters!");
              }
            }
          break;
          case "curve2d":
            if (pt.dim4in > 1) {
              alert("2D-Curve with an input domain dimension of "+pt.dim4in+" is not possible.");
            } else {
              if (pt.dim4in == 1) {
                pt.dim4out = 2;
              } else {
                alert("Specify the input variables with a plot-range e.g. 't[-5,5]' in the "+pt.type+" parameters!");
              }
            }
          break;
          case "curve3d":
            if (pt.dim4in > 1) {
              alert("3D-Curve with an input domain dimension of "+pt.dim4in+" is not possible.");
            } else {
              if (pt.dim4in == 1) {
                pt.dim4out = 3;
              } else {
                alert("Specify the input variables with a plot-range e.g. 't[-5,5]' in the "+pt.type+" parameters!");
              }
            }
          break;
          case "plane3d":
            if (pt.dim4in !== 2) {
              alert("3D-Plane with an input domain dimension of "+pt.dim4in+" is not possible. Input dimension must be 2.");
              pt.dim4in = 2
            } else {
              pt.dim4out = 3;
            }
          break;
          default:
            alert((pt.type.toUpperCase())+": Input dimensions do not match - function '"+pt.fct2expanded+"' has dim4in="+pt.dim4in+" input dimensions for the selected plot command '"+pPlotType.type+"' with pt.dim4out="+pt.dim4out+" as output dimension. But the definition of function requires input dimension "+pt.var2data.length+" (pt.var2data="+JSON.stringify(pt.var2data));
            pt.dim4in = pt.var2data.length;

        }
      }
    } else {
    }
    pPlotType = pt;
  },
  bracket_wrapper: function(term) {
    var wrap_brackets = false;
    var needed4char = ["+","-","*","/","^","(",")","[","]"];
    for (var i = 0; i < needed4char.length; i++) {
      if (term.indexOf(needed4char[i])>=0) {
        wrap_brackets = true
      };
    };
    if ((term.charAt(0) == "(") && (term.charAt(term.length-1) == ")")) {
      wrap_brackets = false;
    }
    if ((term.charAt(0) == "[") && (term.charAt(term.length-1) == "]")) {
      wrap_brackets = false;
    }
    if (wrap_brackets == true) {
      term = "("+term+")";
    }
    return term;
  },
  expand_fct_eval: function (pCMD,terms,count) {
    var self = this;
    var eval_term = "7^3+3";
    terms = terms || [];
    count = count || 1;
    var vCMD = pCMD || " ";
    
    var regex = /([A-Za-z][A-Za-z0-9_]*)\(([a-zA-Z_0-9,]+)\)/g;
    
    var vExec = vCMD;
    var undef_fct = [];

    vCMD = vCMD.replace(regex,function (fcall,fname,params) {
        
        var var4term = "fct"+self.get_unique_id();
        var vFCT = self.get_function_def(fname);
        if (vFCT) {

          var par_split = params.split(",");
          var args_split = vFCT.args.split(",");
          for (var i = 0; i < args_split.length; i++) {
            args_split[i] = args_split[i].trim();
          }
          if (par_split.length < args_split.length) {
            alert("Function call of '"+fname+"("+params+")' has not enough arguments f("+vFCT.args+")");
            
            terms.push({
              "var":   var4term,
              "value": fcall
            });
          } else {
            var param_regex = /([A-Za-z][A-Za-z0-9_]*)/g;
            
            var vars4def = vFCT.def.match(param_regex);
            if (vars4def && vars4def.length > 0) {

            }
            var def_expanded = self.expand_variables(vFCT.def);
            def_expanded = def_expanded.replace(param_regex,function (x) {
              var arg_index = args_split.indexOf(x);
              if (arg_index >= 0) {

                return self.bracket_wrapper(par_split[arg_index]);
              } else {
                return x;
              }
            });
            def_expanded = self.expand_variables(def_expanded);
            terms.push({
              "var":   var4term,
              "value": def_expanded
            });
            return var4term;
          }
        } else {
          terms.push({
            "var":   var4term,
            "value": fcall
          });
        }
        return var4term;
    });

    var vMatches = vCMD.match(regex);
    if (vMatches && vMatches.length > 0) {
      count++;
      if (count < 10) {
        eval_term = this.expand_fct_eval(vCMD,terms,count);
      }
    } else {

      for (var i = (terms.length); i>0 ; i--) {
        vCMD = vCMD.replace(terms[i-1].var,terms[i-1].value);
      }
      eval_term = vCMD;
    }
    return eval_term;
  },
  is_Math_function: function (variable) {
    var ret = false;
    if (Math[variable]) {
      ret = true;
    }
    return ret;
  },
  expand_variables: function(pCMD) {
    var self = this;
    if (pCMD) {
      pCMD += " ";
      var regex = /([A-Za-z][A-Za-z0-9_]*)/g;
      
      pCMD = pCMD.replace(regex,function (expression,variable) {
        var ret = variable;
        var vardef = self.get_variable_def(variable);
        if (vardef) {
          
          ret = vardef.def;
        } else {
          if (self.is_Math_function(variable) == false) {
          }
          
        }
        return ret;
      });
    } else {
      alert("Expand variable definition for '"+pCMD+"' failed.");
      
    }
    return pCMD;
  },
  detokenize_termlist: function(pTermList,pCMD) {
    var vCMD = pCMD;
    pTermList = pTermList || [];
    pCMD = pCMD || " ";
    var regex = /[A-Za-z][A-Za-z0-9_]*/g;
    pCMD = pCMD.replace(regex,function (variable) {
      var ret = variable;
      for (var i = 0; i < pTermList.length; i++) {
        if (pTermList[i].varid === variable) {
          ret = pTermList[i].cmd;
        };
      }
      return ret;
    });

    return pCMD;
  },
  detokenize_functions: function(pTermList,pCMD) {
    var vCMD = this.detokenize_termlist(pTermList,pCMD);
    return vCMD;
  },
  tokenize_functions: function(pTermList,pCMD) {
    var self = this;
    var vCMD = pCMD;
    pTermList = pTermList || [];
    pCMD = pCMD || " ";

    var regex = /([A-Za-z][A-Za-z0-9_]*)\(([A-Za-z0-9_,\+\-]+)\)/g;
    pCMD = pCMD.replace(regex,function (expression,variable,params) {
      var ret = "fct"+self.get_unique_id(); 
      
      var type4fct = "function";
      if (self.is_Math_function(variable) == true) {
        
      };
      if (variable) {
        pTermList.push(
          {
            "varid": ret,
            "type": type4fct,
            "name":variable,
            "args": params,
            "cmd":expression
          }
        )
      } else {
        alert("Missing arguments of function '"+variable+"' in command '"+expression+"' identified.");
        
      }
      return ret;
    });

    return pCMD;
  },
  detokenize_operations: function(pTermList,pCMD) {
    var vCMD = this.detokenize_termlist(pTermList,pCMD);
    
    return vCMD;
  },
  tokenize_operations: function(pTermList,pCMD) {
    var self = this;
    pTermList = pTermList || [];
    pCMD = pCMD || " ";
    var regex = /([A-Za-z0-9_]+)([\+\-:\*\^])([A-Za-z0-9_]+)/g;
    pCMD = pCMD.replace(regex,function (expression,term1,ops,term2) {
      var ret = "op"+self.get_unique_id(); 
      pTermList.push(
          {
            "varid": ret,
            "type": "operation",
            "cmd":expression
          }
      );
      return ret;
    });

    return pCMD;
  },
  detokenize_vectors: function(pTermList,pCMD) {
    pCMD = this.detokenize_termlist(pTermList,pCMD);
    return pCMD;
  },
  tokenize_vectors: function(pTermList,pCMD) {
    var self = this;
    pTermList = pTermList || [];
    pCMD = pCMD || " ";
    var regex = /\[[A-Za-z0-9_,\*\+\-\^]+\]/g;
    pCMD = pCMD.replace(regex,function (expression) {
      var ret = "vec"+self.get_unique_id(); 
      if (expression) {
        pTermList.push(
          {
            "varid": ret,
            "type": "expression",
            "cmd":expression
          }
        )
      }
      return ret;
    });
    return pCMD;
  },
  tokenize_fct_call: function(pTermList,pCMD) {
    var self = this;
    pTermList = pTermList || [];
    var regex = /([A-Za-z][A-Za-z0-9_]*)\(([A-Za-z0-9_,]*)\)/g;
    pCMD = pCMD.replace(regex,function (expression,fname,args) {
      var ret = "vec"+self.get_unique_id(); 
      if (expression) {
        pTermList.push(
          {
            "varid": ret,
            "type": "functioncall",
            "name":fname,
            "args": args,
            "cmd":expression
          }
        )
      }
      return ret;
    });
    return {
      "termlist":pTermList,
      "cmd":pCMD
    }
  },
  get_fct4result: function(pPlotType,fct) {
    var arg4fct = "x";
    if (pPlotType) {
      if(pPlotType.var2data) {
        arg4fct = pPlotType.var2data.join(",");
      }
      var undef4fct = pPlotType.type+"("+arg4fct+")";
      if (fct) {
        if (fct.indexOf("[") >= 0) {
          
          fct = undef4fct;
        } else if (fct.indexOf("(") < 0) {
          
          fct = undef4fct;
        }
      }
    } else {
    }

    return fct;
  },
  execute4plot: function(pPlotType,pCMD) {
    
    if (!pPlotType) {
      alert("pPlotType is not defined");
      return "pPlotType-not-defined";
    }
    pPlotType = pPlotType || {
          "type":"-",
          "dim4in": 0,
          "dim4out": 0,
          "plotargs":"", 
          "fct":"f(x)",
          "fname":"f",
          "fct2expanded": "x^2", 
          "param4plot":{
            
          },
          "varundef":[]
        };

    var out =pPlotType.type+":";
    for (var i = 0; i < pPlotType.fctlist.length; i++) {
      var fcall = this.get_fct4result(pPlotType,pPlotType.fctlist[i]);

      out += " "+fcall+"="+ this.input2latex(pPlotType.fct2xlist[i]) +" \\quad ";
    }
    return out;
  },
  input2latex: function(pCMD) {
    var vCMD= "";
    if (pCMD) {
      vCMD = pCMD.replace(/\*/g," \\cdot ");
      
      vCMD = vCMD.replace(/\[([\+\-,0-9]+)\]/g,function (exp,vec) {
        return "\\left(\\begin{array}{c}" + (vec.split(",")).join(" \\\\ ") + "\\end{array}\\right)"
      })
    }
    return vCMD;
  },
  execute: function () {
    var val = this.getValue();
    val["result4cmd"] = " x ";
    if (val) {
      if (val.hasOwnProperty("cmd")) {
        if (val.hasOwnProperty("result4cmd")) {
          var path = this.path + ".cmd";
          var vCASinput = this.jsoneditor.getEditor(path);
          if (vCASinput && vCASinput.execute) {
            vCASinput.execute();
          }
        } else {
          console.error("CAS Command executed at editor '"+this.path+"' does not have 'result4cmd' attribute that is used to store the result of the computation for the executed command in 'cmd'.");
        }
      } else {
        console.error("CAS Command executed at editor '"+this.path+"' does not have 'cmd' attribute that contains the executed command");
      }
    } else {
      console.error("CAS Command executed at editor '"+this.path+"' does not have a valid JSON for executing a CAS command");
    }

  }
});

JSONEditor.defaults.editors.cas = JSONEditor.defaults.editors.object.extend({
  editortype: "cas",
  exec_index: -1,
  math4js: null,
  parser4math: null,
  execThread: function () {
    var self = this;
    var val = this.getValue();
    var commands = val.commands;
    if ((this.exec_index+1) < commands.length) {
      this.exec_index++;  
    }
    
    if ((this.exec_index >= 0) && (this.exec_index < commands.length)) {

      var vEditor4CMD = this.jsoneditor.getEditor(this.path+".commands."+this.exec_index);
      if (vEditor4CMD) {
        if (vEditor4CMD.execute) {
          vEditor4CMD.execute();
        } else {
          alert("CAS Command Editor ["+vEditorCMD.path+"] CMD"+this.exec_index+" does not have an execute() method!");
        }
      } else {
        alert("CAS Command Editor ["+this.exec_index+"] does not exist!");
      }
      var vEditor4CMDList = this.jsoneditor.getEditor(this.path+".commands");
      if (vEditor4CMDList) {
        if (vEditor4CMDList.gotoTab) {
          
          vEditor4CMDList.gotoTab(this.exec_index,"val"+this.exec_index)
        } else {
          alert("Command List Editor does not interpret the 'gotoTab("+this.exec_index+")' method.")
          
        }
      } else {
        alert("CAS Command List Editor does not exist!");
      }

    }

  },
  execute: function () {
      this.execThread();
  },
  preBuild: function() {
    var self = this;
    if (window.Math4JS) {
      this.math4js = new Math4JS();
      this.parser4math = new self.math4js.Parser();

    } else {
      console.error("Math4JS does not exist - please import math4js.js in your HTML5 app");
    }
    var vDefault = {
      "castype": "algebrite", 
      "commands": [
        "plot3d(g(x,y),x[-5,5],y[-3,8])",
        "plot3d(sin(x)+cos(y),x[-5,5],y[-3,8])",
        "plot3d(f2d(t),t[-5,5])",
        "curve2d(cur2d(t),t[-5,5])",
        "curve3d(cur(t),t[-5,5])",
        "curve3d(K(t),t[0,1])",
        "3+4",
        "x+x",
        "100!",
        "11! # gets long after 50000!",
        "f(x):=x^2",
        "g(x,y):=x^3+y^4",
        "factor(100!)",
        "13579/99999 + 13580/100000\nnumerator(1/a+1/b)\ndenominator(1/(x-1)/(x-2))\nrationalize(a/b+b/a)",
        "A=1+i\nB=sqrt(2)*exp(i*pi/8)\nA-B\nrect",
        "simplify(cos(x)^2 + sin(x)^2)\nsimplify(a*b+a*c)\nsimplify(n!/(n+1)!)",
        "(x-1)*(x-2)^3",
        "roots(3 x + 12 + y = 24) # first degree (in x)\nroots(a*x^2+b*x+c) # second degree",
        "nroots(x^16+x^15+2)",
        "# Define a tensor function\nF=[x+2y,3x+4y]\n# now the gradient\nd(F,[x,y])",
        "d(x^2)\n# gradients are derivatives on vectors\nr=sqrt(x^2+y^2)\nd(r,[x,y])",
        "integral(x^2)\nintegral(x*y,x,y)",
        "# compute integrals\ndefint(x^2,y,0,sqrt(1-x^2),x,-1,1)",
        "#calculating in an exponential domain\nf=sin(t)^4-2*cos(t/2)^3*sin(t)\nf=circexp(f)\ndefint(f,t,0,2*pi)"
      ],
      "casfunctions": [
        {
          "name":"g",
          "args":"x,y",
          "def":"1/(1+x^2+y^2)"
        },
        {
          "name":"f",
          "args":"x",
          "def":"x^5"
        },
        {
          "name":"f2d",
          "args":"t",
          "def":"[sin(t)*t,3*cos(t)*t]"
        },
        {
          "name":"h",
          "args":"x",
          "def":"sin(x)"
        },
        {
          "name":"cur",
          "args":"t",
          "def":"[cos(t),sin(t),t]"
        },
        {
          "name":"cur2d",
          "args":"t",
          "def":"[cos(t)*t,sin(t)*t]"
        },
        {
          "name":"K",
          "args":"t",
          "def":"v1* (1-t)^3 +v2*3*(1-t)^2*t+ v3*3*(1-t)*t^2 +v4*t^3"
        }

      ],
      "casvariables": [
        {
          "name":"c1",
          "def":"x^3+y^4"
        },
        {
          "name":"c2",
          "def":"23^5-4+sin(13)"
        },
        {
          "name":"c3",
          "def":"f1(x)"
        },
        {
          "name": "v1",
          "def": "[3,4,5]"
        },
        {
          "name": "v2",
          "def": "[5,4,-3]"
        },
        {
          "name": "v3",
          "def": "[-6,-1,6]"
        },
        {
          "name": "v4",
          "def": "[-3,-7,0]"
        }
      ]
    };
    for (var i = 0; i < vDefault.commands.length; i++) {
      var vCMD = vDefault.commands[i];
      var vTitle = vCMD.substr(0,10);
      if (vTitle.length < vCMD.length) {
        vTitle = vTitle + "...";
      }  
      if (vTitle.length < 10) {
        vTitle +="     ";
      }
      vDefault.commands[i] = {
        "cmdtitle": vTitle,
        "cmd": vCMD,
        "result4cmd": "cmd"+i
      }
    }
    
    vDefault = this.extend_with_schema_defaults(vDefault);
    
    var source_schema = {
      "type": "object",
      "format":"grid",
      "title": this.getTitle(),
      "properties": {
        "castype": {
            "title": $check_options(self.options,"title4castype","Computer Algebra System:"),
            "type": "string",
            "enum": [
              "algebrite",
              "maxima",
              "octave",
              "r",
              "javascript"
            ],
            "options":{
              "hidden":true
            },
            "default": "maxima"
        },
        "title4cas": {
          "title": "Title for CAS",
          "type": "string",
          
          "default":"Computer Algebra System",
          "options": {
            "hidden":true
          }
        },
        "title4commands": {
          "title": "Title for Commands",
          "type": "string",
          
          "default":"Commands",
          "options": {
            "hidden":true
          }
        },
        "title4functions": {
          "title": "Title for Functions",
          "type": "string",
          
          "default":"Functions",
          "options": {
            "hidden":true
          }
        },
        "title4variables": {
          "title": "Title for Variables",
          "type": "string",
          
          "default":"Variables",
          "options": {
            "hidden":true
          }
        },
        "commands": {
            "title": "CAS4Wiki",
            "headerTemplate": "{{up.self.title4commands}}",
            "type": "array",
            "format":"tabs",
            "options": {
              "enable_load_button":false,
              "enable_save_button":false,
              "hidden":false
            },
            "default":vDefault.commands,
            "items":  {
              "title":"CMD",
              "type": "cascommand",
              "format":"grid2order",

              "defaultProperties": [
                  "cmdtitle",
                  "cmd",
                  
                  "result4cmd"
              ],
              "headerTemplate": "({{i1}}) {{self.cmdtitle}}",
              "options":{
                
                "disable_edit_json": true,
                "disable_properties":true,
                "enable_execute_button":true,
                "table_columns":[
                  {
                    "width":"25%",
                    "verticalAlign":"top",
                    "assign": ["cmdtitle"]
                  },
                  {
                    "width":"75%",
                    "verticalAlign":"top",
                    "assign":["cmd"]
                  },
                  {
                    "width":"100%",
                    "verticalAlign":"bottom",
                    "assign":["result4cmd"]
                  }
                ]
              },
              "properties": {
                  "cmdtitle":{
                    "title": "Title",
                    "type": "string",
                    "default":"",
                    "headerTemplate":"{{self}}",
                    "propertyOrder":10,
                    "options":{
                      "enable_preview_edit_button":false,
                      "enable_edit_button":true,
                      "enable_preview": false,
                      "enable_edit":false,
                      "enable_execute_button":false,
                      "grid_columns": 3
                    }
                  },
                  "cmd": {
                    "title": "CAS Command",
                    "type": "casinput",
                    "format":"textarea",
                    "propertyOrder":20,
                    "options":{
                      "rows": 8,
                      "enable_preview_edit_button":false,
                      "enable_preview": false,
                      "enable_execute_button":true,
                      "grid_columns": 9
                    }
                  },
                  "result4cmd": {
                    "title": "Result Command",
                    "type": "math4string",
                    "format":"textarea",
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview":true,
                      "enable_edit":false,
                      "enable_edit_button":true,
                      "grid_columns": 12
                    }
                  },

              }  
            } 
        },
        "casfunctions": {
            "title": $check_options(self.options,"title4functions","Functions:"),
            "headerTemplate": "{{up.self.title4functions}}",
            "type": "array4name",
            "format":"tabs",
            "default":vDefault.casfunctions,
            "items":  {
              "title":"CAS Function",
              "type": "object",
              "format":"grid2order",

              "headerTemplate": "({{i1}}) {{self.name}}({{self.args}})",
              "options":{
                "enable_load_button":false,
                "enable_save_button":false,
                "disable_edit_json": true,
                "disable_properties":true,

                "enable_execute_button":true,
                "table_columns":[
                  {
                    "width":"30%",
                    "verticalAlign":"bottom",
                    "assign":["name"]
                  },
                  {
                    "width":"20%",
                    "verticalAlign":"top",
                    "assign": ["args"]
                  },
                  {
                    "width":"50%",
                    "verticalAlign":"top",
                    "assign": ["def"]
                  }
                ]
              },
              "properties": {
                  "name":{
                    "title": "Name",
                    "type": "string",
                    "default":"",
                    "propertyOrder":10,
                    "options":{
                      "enable_load_button":false,
                      "enable_save_button":false,
                      "enable_preview_edit_button":true,
                      "enable_preview": true,
                      "enable_edit":false,
                      "enable_play_button":false,
                      "grid_columns": 3
                    }
                  },
                  "args": {
                    "title": "Arguments",
                    "type": "casinput",
                    "format":"textarea",
                    "propertyOrder":20,
                    "options":{
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 9
                    }
                  },
                  "def": {
                    "title": "Definition",
                    "type": "string",
                    
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 12
                    }
                  }
              },
            }
        },
        "casvariables": {
            "title": $check_options(self.options,"title4variables","Variables:"),
            "headerTemplate": "{{up.self.title4variables}}",
            "type": "array4name",
            "format":"tabs",
            "default":vDefault.casvariables,
            "items":  {
              "title":"CAS Variables",
              "type": "object",
              "format":"grid2order",

              "headerTemplate": "({{i1}}) {{self.name}}",
              "options":{
                "enable_load_button":false,
                "enable_save_button":false,
                "disable_edit_json": true,
                "disable_properties":true,
                
                "enable_execute_button":true,
                "table_columns":[
                  {
                    "width":"25%",
                    "verticalAlign":"top",
                    "assign":["name"]
                  },
                  {
                    "width":"75%",
                    "verticalAlign":"top",
                    "assign": ["value"]
                  }
                ]
              },
              "properties": {
                  "name":{
                    "title": "Name",
                    "type": "string",
                    "default":"",
                    "propertyOrder":10,
                    "options":{
                      "enable_preview_edit_button":true,
                      "enable_preview": false,
                      "enable_edit":true,
                      "enable_play_button":false,
                      "grid_columns": 3
                    }
                  },
                  "def": {
                    "title": "Value",
                    "type": "string",
                    "default": 0,
                    "propertyOrder":30,
                    "options":{
                      "hidden":false,
                      "enable_preview_button":true,
                      "enable_play_button":true,
                      "grid_columns": 6
                    }
                  }
              },
            }
        }

      },
    };
    
    var updated_schema = this.extend_from_schema(source_schema);

    self._super();
  },
  build:function () {
    this._super();
  },
  postBuild: function () {
    this._super();
    
  }
});
JSONEditor.defaults.editors.today = JSONEditor.defaults.editors.string.extend({
  editortype: "today",
  getNumColumns: function() {
    return 2;
  },
  getValue: function() {
    return $getDate();
  }
});
JSONEditor.defaults.editors.calendar = JSONEditor.defaults.editors.string.extend({
  editortype: "calendar",
  sanitize: function(value) {
    return (value+"").replace(/[^0-9\.\-eE]/g,'');
  },
  X_getNumColumns: function() {
    return 2;
  },
  C_getValue: function() {
    return this.value*1;
  }
});
var matchKey = (function () {
  var elem = document.documentElement;

  if (elem.matches) return 'matches';
  else if (elem.webkitMatchesSelector) return 'webkitMatchesSelector';
  else if (elem.mozMatchesSelector) return 'mozMatchesSelector';
  else if (elem.msMatchesSelector) return 'msMatchesSelector';
  else if (elem.oMatchesSelector) return 'oMatchesSelector';
})();

JSONEditor.AbstractTheme = Class.extend({
  cssformat:"html",
  getContainer: function(pID) {
    var vNode = document.createElement('div');
    if (pID) {
      pID = pID.replace(/[^A-Za-z0-9_\/\-]/g,"");
      vNode.id = pID+"";
    }
    return vNode;
  },
  getPlotContainer:function (pID,pContent,pOptions) {
    pContent = pContent || "src/theme.js:23 -getPlotContainer('"+pID+"') - preview_input with CSS format '"+this.cssformat+"' and ID='"+pID+"' - called in build of src/editors/string.js";
    pOptions  = pOptions || {};
    pOptions.outtype = "plotly";
    var vNode = this.getContainer(pID);
    vNode.setAttribute("style","width:100%;max-width:3000px");
    $setContent(vNode,pContent,pOptions);
    return vNode;
  },
  getPreviewInput:function (pID,pContent,pOptions) {
    pContent = pContent || "src/theme.js:28 -getPreviewInput('"+pID+"') - preview_input with CSS format '"+this.cssformat+"' and ID='"+pID+"' - called in build of src/editors/string.js";
    
    pOptions  = pOptions || {};
    pOptions.outtype = "html";
    var vNode = this.getContainer(pID);
    vNode.setAttribute("style","display:none");
    $setContent(vNode,pContent,pOptions);
    return vNode;
  },
  getMapHolder:function (maptype) {
    var el = document.createElement('div');
    el.classList.add("map");
    return el;
  },
  getFloatRightLinkHolder: function() {
    var el = document.createElement('div');
    el.style = el.style || {};
    el.style.cssFloat = 'right';
    el.style.marginLeft = '10px';
    return el;
  },
  getModal: function() {
    var el = document.createElement('div');
    el.style.backgroundColor = 'white';
    el.style.border = '1px solid black';
    el.style.boxShadow = '3px 3px black';
    el.style.position = 'absolute';
    el.style.zIndex = '10';
    el.style.display = 'none';
    return el;
  },
  getNavigationContainer: function(pDisplay) {
    var el = document.createElement('div');
    el.className = 'div4navigation';
    if (pDisplay) {
      el.style.display = pDisplay;
    }
    return el;
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.className = 'row';
    return el;
  },
  getGridColumn: function() {
    var el = document.createElement('div');
    return el;
  },
  setGridColumnSize: function(el,size) {

  },
  getLink: function(text) {
    var el = document.createElement('a');
    el.setAttribute('href','#');
    el.appendChild(document.createTextNode(text));
    return el;
  },
  disableHeader: function(header) {
    header.style.color = '#ccc';
  },
  disableLabel: function(label) {
    label.style.color = '#ccc';
  },
  enableHeader: function(header) {
    header.style.color = '';
  },
  enableLabel: function(label) {
    label.style.color = '';
  },
  getHeader4Title: function(text) {
    var el = document.createElement('span');
    el.setAttribute("theme-object","getHeader4Title");
    el.textContent = text;
    return el;
  },
  getHeader4TitleButtons: function(header4title,buttons4title) {
    
    var el = document.createElement('h4');
    el.setAttribute("theme-object","getHeader4TitleButtons");
    
    el.appendChild(header4title);
    if (buttons4title) {
      el.appendChild(document.createTextNode(" "));
      for (var i = 0; i < buttons4title.length; i++) {
        el.appendChild(document.createTextNode(" "));
        el.appendChild(buttons4title[i]);
      }
    }
    return el;
  },
  getFormTitle4Buttons: function(text,buttons4title) {
    
    var header4title = this.getHeader4Title(text);
    return this.getHeader4TitleButtons(header4title,buttons4title);
  },
  getFormInputLabel: function(text) {
    var label = document.createElement('label');
    label.appendChild(document.createTextNode(text));
    return label;
  },
  getCheckboxLabel: function(text) {
    var el = this.getFormInputLabel(text);
    el.style.fontWeight = 'normal';
    return el;
  },
  getHeader: function(text,tag) {
    tag = tag || "h3";
    var el = document.createElement(tag);
    if(typeof text === "string") {
      
      $setContent(el,text);
    }
    else {
      el.appendChild(text);
    }

    return el;
  },
  getCheckbox: function() {
    var el = this.getFormInputField('checkbox');
    el.style.display = 'inline-block';
    el.style.width = 'auto';
    return el;
  },
  getMultiCheckboxHolder: function(controls,label,description,question) {
    var el = document.createElement('div');

    if(label) {
      label.style.display = 'block';
      el.appendChild(label);
    }

    if(question) {
      
      el.appendChild(question);
    }

    for(var i in controls) {
      if(!controls.hasOwnProperty(i)) continue;
      controls[i].style.display = 'inline-block';
      controls[i].style.marginRight = '20px';
      el.appendChild(controls[i]);
    }

    if(description) el.appendChild(description);

    return el;
  },
  getInputFileButton: function (pName) {

    pName = pName || "Input File";
    var inputFileButton = document.createElement('input');
    inputFileButton.setAttribute("type","file");
    inputFileButton.setAttribute("style","display:none");
    inputFileButton.setAttribute("value",pName);
    return inputFileButton;
  },
  getSelectInput: function(options,titles) {
    var select = document.createElement('select');
    if(options) this.setSelectOptions(select, options,titles);
    return select;
  },
  getSwitcher: function(options,titles) {
    var switcher = this.getSelectInput(options,titles);
    switcher.style.backgroundColor = 'transparent';
    switcher.style.display = 'inline-block';
    switcher.style.fontStyle = 'italic';
    switcher.style.fontWeight = 'normal';
    switcher.style.height = 'auto';
    switcher.style.marginBottom = 0;
    switcher.style.marginLeft = '5px';
    switcher.style.padding = '0 0 0 3px';
    switcher.style.width = 'auto';
    return switcher;
  },
  getSwitcherOptions: function(switcher) {
    return switcher.getElementsByTagName('option');
  },
  setSwitcherOptions: function(switcher, options, titles) {
    this.setSelectOptions(switcher, options, titles);
  },
  setSelectOptions: function(select, options, titles) {
    titles = titles || [];
    select.innerHTML = '';
    for(var i=0; i<options.length; i++) {
      var option = document.createElement('option');
      option.setAttribute('value',options[i]);
      option.textContent = titles[i] || options[i];
      select.appendChild(option);
    }
  },
  
  getTextareaInput: function(options) {
    options = options || {};
    var el = document.createElement('textarea');
    el.setAttribute("theme-object","textarea-input-theme")
    el.style = el.style || {};
    
    el.style.width = options.width || '100%';
    if (options) {
      if (options.rows) {
         el.setAttribute("rows",options.rows);
       } else if (options.height){
         el.style.height = options.height || '300px';
       }
    }
    el.style.boxSizing = 'border-box';
    return el;
  },
  getRangeInput: function(min,max,step) {
    var el = this.getFormInputField('range');
    el.setAttribute('min',min);
    el.setAttribute('max',max);
    el.setAttribute('step',step);
    return el;
  },
  getFormInputField: function(type) {
    var el = document.createElement('input');
    el.setAttribute('type',type);
    return el;
  },
  afterInputReady: function(input) {

  },
  getSpanLabel4Buttons: function (label,buttons4title) {
    var span4title = document.createElement('span');
    span4title.appendChild(label);
    if (buttons4title) {
      for (var i = 0; i < buttons4title.length; i++) {
        span4title.appendChild(buttons4title[i]);
      }
    } else {
    }
    return span4title;
  },
  getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    return this.appendFormControl(null,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth);
  },
  appendFormControl: function(pParent,label, input, description,question,pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    
    var el = document.createElement('div');
    el.className = 'form-control';
    el.style.width = "100%";

    if (pParent) {
      pParent.appendChild(el);
    }

    var col_width = pColWidth || 25;
    var width = 100;
    if (pre_input) {
      width -= col_width;
    }
    if (post_input) {
      width -= col_width;
    }

    if (label) {
      var span4title = this.getSpanLabel4Buttons(label,buttons4title);
      el.appendChild(span4title);
    }
    if (question) el.appendChild(question);
    if (preview_input) {

      el.appendChild(preview_input);
    }
    
    var table = document.createElement('div');
    if (pInputID) {
      table.id = pInputID;
      
    }
    table.setAttribute("width","100%");
    
    table.style.width = "100%";

    table.style.width="100%";
    table.style.tableLayout = "fixed";
    
    var tr = table;
    if (pre_input) {

      var td1  = document.createElement('div');
      td1.setAttribute("width",col_width+"%");
      td1.style.width = col_width+"%";
      td1.style.float = "left";
      td1.appendChild(pre_input);
      tr.appendChild(td1);
    }
    
    var td2  = document.createElement('div');
    td2.setAttribute("theme-object","form-control-theme");
    td2.setAttribute("width",width+"%");
    td2.style.width = width+"%";
    td2.style.float = "left";

    tr.appendChild(td2);
    if (input.type === 'checkbox') {
      label.insertBefore(input,label.firstChild);
      td2.appendChild(label);
      td2.setAttribute("width",width+"%");
      td2.style.width = width+"%";
    } else {
      td2.appendChild(input);
      td2.setAttribute("width",width+"%");
      td2.style.width = width+"%";
    }
    td2.style.float = "left";
    if (post_input) {
      
      var td3  = document.createElement('div');
      td3.appendChild(post_input);
      td3.style.width = col_width+"%";
      td3.style.float = "left";
      tr.appendChild(td3);
    }
    el.appendChild(table);
    
    if(description) {
      var br  = document.createElement('br');
      el.appendChild(br);
      var div_description = document.createElement('div');
      div_description.appendChild(description);
      el.appendChild(div_description);
    };
    return el;
  },
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.style = el.style || {};
    el.style.paddingLeft = '10px';
    el.style.marginLeft = '10px';
    
    return el;
  },
  getChildEditorHolder: function() {
    return document.createElement('div');
  },
  getQuestion: function(text) {
    return this.getParagraph(text);
  },
  getDescription: function(text) {
    return this.getParagraph(text);
  },
  getParagraph: function(text) {
    text = text || "";
    var el = document.createElement('p');
    el.innerHTML = text;
    return el;
  },
  getCheckboxDescription: function(text) {
    return this.getParagraph(text);
  },
  getFormInputQuestion: function(text) {
    return this.getParagraph(text);
  },
  getFormInputDescription: function(text) {
    return this.getParagraph(text);
  },
  getHeaderButtonHolder: function() {
    return this.getButtonHolder();
  },
  getButtonHolder: function() {
    return document.createElement('span');
  },

  getButton: function(text, icon, title) {
    var el = document.createElement('button');
    el.type = 'button';
    this.setButtonText(el,text,icon,title);
    return el;
  },
  setButtonText: function(button, text, icon, title) {
    if (button) {
      button.innerHTML = '';
      if(icon) {
        button.appendChild(icon);
        button.innerHTML += ' ';
      }
      
      button.appendChild(document.createTextNode(text));
      if(title) button.setAttribute('title',title);
    } else {
    }
  },
  getDiv4Atts: function(atts) {
    atts = atts || [];
    var el = document.createElement('div');
    if (atts) {
      for (var variable in atts) {
        if (atts.hasOwnProperty(variable)) {
          el.style[variable] = att.value;
        }
      }  button.innerHTML = '';
    if(icon) {
      button.appendChild(icon);
      button.innerHTML += ' ';
    }
    button.appendChild(document.createTextNode(text));
    if(title) button.setAttribute('title',title);

    }
    return el;
  },
  getTable: function(atts) {
    atts = atts || [];
    var tab = document.createElement('table');
    if (atts) {
      for (var variable in atts) {
        if (atts.hasOwnProperty(variable)) {
          tab.style[variable] = atts.value;
        }
      }
    }
    return tab;
  },
  getTableRow: function(atts) {
    
    var el = document.createElement('tr');
    el.style.display = "table-row";
    
    return el;
  },
  getTableHead: function(atts) {
    
    var el = document.createElement('thead');
    
    return el;
  },
  getTableBody: function(atts) {
    
    var el = document.createElement('tbody');
    
    return el;
  },
  getTableCell: function(atts) {
    
    var el = document.createElement('td');
    
    return el;
  },
  getTableHeaderCell: function(text,buttons4title) {
    var el = document.createElement('th');
    
    if (buttons4title) {
      var label = document.createElement("span");
      $setContent(label,text+" ");
      var span4title = this.getSpanLabel4Buttons(label,buttons4title);
      el.appendChild(span4title);
    } else {
      $setContent(el,text);
    }
    return el;
  },
  getErrorMessage: function(text) {
    var el = document.createElement('p');
    el.style = el.style || {};
    el.style.color = 'red)';
    el.appendChild(document.createTextNode(text));
    return el;
  },
  addInputError: function(input, text) {
  },
  removeInputError: function(input) {
  },
  addTableRowError: function(row) {
  },
  removeTableRowError: function(row) {
  },
  getTabHolder: function() {
    var el = document.createElement('div');
    el.innerHTML = "<div style='float: left; width: 130px;' class='tabs'></div><div class='content' style='margin-left: 130px;'></div><div style='clear:both;'></div>";
    return el;
  },
  X_getTabHolder: function() {
    var el = document.createElement('div');
    el.innerHTML = "<ul class='nav nav-tabs span2' style='margin-right: 0;'></ul><div class='tab-content span10' style='overflow:visible;'></div>";
    return el;
  },
  getTabSelectHolder: function() {
    var el = document.createElement('div');
    el.setAttribute("theme-object","tab-select-holder");
    el.innerHTML = "<div style='display:none'></div><div></div>";
    return el;
  },
  getTabHolderDOM: function() {

    var el = document.createElement('div');
    el.setAttribute("theme-object","tab-holder-dom");
    
    var men  = this.getTabMenuHolderDOM();
    var body = this.getTabBodyHolderDOM();
    var tail = this.getTabTailHolderDOM();
    el.appendChild(men);
    el.appendChild(body);
    el.appendChild(tail);

    return el;
  },
  getTabMenuHolderDOM: function() {
    var el = document.createElement('div');
    el.setAttribute("theme-object","tab-menu-holder-dom");
    el.style.cssFloat = "left";
    el.style.width = 130;
    el.classList.add('tabs');
    
    return el;
  },
  getTabBodyHolderDOM: function() {
    var el = document.createElement('div');
    el.setAttribute("theme-object","tab-body-holder-dom");
    el.style.marginLeft = "130px";
    el.classList.add('content');
    
    return el;
  },
  getTabTailHolderDOM: function() {
    var el = document.createElement('div');
    el.setAttribute("theme-object","tab-tail-holder-dom");
    el.style.clear = "both";
    return el;
  },
  applyStyles: function(el,styles) {
    el.style = el.style || {};
    for(var i in styles) {
      if(!styles.hasOwnProperty(i)) continue;
      el.style[i] = styles[i];
    }
  },
  closest: function(elem, selector) {
    while (elem && elem !== document) {
      if (elem[matchKey]) {
        if (elem[matchKey](selector)) {
          return elem;
        } else {
          elem = elem.parentNode;
        }
      }
      else {
        return false;
      }
    }
    return false;
  },
  getTab: function(span) {
    var el = document.createElement('div');
    el.appendChild(span);
    el.style = el.style || {};
    this.applyStyles(el,{
      boxSizing: 'border-box',
      
      border: '1px solid #ff0000',
      background: 'red',
      margin: '2px',
      
      borderWidth: '1px 2px 1px 1px',
      textAlign: 'center',
      lineHeight: '30px',
      borderRadius: '5px',
      borderBottomRightRadius: 0,
      borderTopRightRadius: 0,
      fontWeight: 'bold',
      cursor: 'pointer'
    });
    return el;
  },
  getTabMenuHolder: function(tab_holder) {
    return tab_holder.children[0];
  },
  getTabContentHolder: function(tab_holder) {
    return tab_holder.children[1];
  },
  getTabContent: function() {
    return this.getIndentedPanel();
  },
  markTabActive: function(tab,bgcolor) {
    bgcolor = bgcolor || 'white';
    this.applyStyles(tab,{
      opacity: 1,
      background: bgcolor,
    });
  },
  markTabInactive: function(tab,bgcolor,opacity_inactive) {
    bgcolor = bgcolor || '';
    opacity_inactive = opacity_inactive || 0.5;
    this.applyStyles(tab,{
      opacity: opacity_inactive,
      background: bgcolor
    });
  },
  addTab: function(holder, tab) {
    holder.children[0].appendChild(tab);
  },
  getBlockLink: function() {
    var link = document.createElement('a');
    link.style.display = 'block';
    return link;
  },
  getBlockLinkHolder: function() {
    var el = document.createElement('div');
    return el;
  },
  getLinksHolder: function() {
    var el = document.createElement('div');
    return el;
  },
  createMediaLink: function(holder,link,media) {
    holder.appendChild(link);
    media.style.width='100%';
    holder.appendChild(media);
  },
  createImageLink: function(holder,link,image) {
    holder.appendChild(link);
    link.appendChild(image);
  }
});
JSONEditor.defaults.themes.bootstrap2 = JSONEditor.AbstractTheme.extend({
  cssformat:"bootstrap2",
  getRangeInput: function(min, max, step) {
    
    return this._super(min, max, step);
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    el.className = 'container-fluid';
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.className = 'row-fluid';
    return el;
  },
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.display = 'inline-block';
    el.style.fontWeight = 'bold';
    return el;
  },
  setGridColumnSize: function(el,size) {
    el.className = 'span'+size;
  },
  getSelectInput: function(options) {
    var input = this._super(options);
    input.style.width = 'auto';
    input.style.maxWidth = '98%';
    return input;
  },
  getFormInputField: function(type) {
    var el = this._super(type);
    el.style.width = '98%';
    return el;
  },
  afterInputReady: function(input) {
    if(input.controlgroup) return;
    input.controlgroup = this.closest(input,'.control-group');
    input.controls = this.closest(input,'.controls');
    if(this.closest(input,'.compact')) {
      input.controlgroup.className = input.controlgroup.className.replace(/control-group/g,'').replace(/[ ]{2,}/g,' ');
      input.controls.className = input.controlgroup.className.replace(/controls/g,'').replace(/[ ]{2,}/g,' ');
      input.style.marginBottom = 0;
    }

  },
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.className = 'well well-small';
    el.style.paddingBottom = 0;
    return el;
  },
  getFormInputDescription: function(text) {
    var el = document.createElement('p');
    el.className = 'help-inline';
    
    $setContent(el,text);
    return el;
  },
  getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    return this.appendFormControl(null,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth);
  },
  appendFormControl: function(pParent,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    
    var ret = document.createElement('div');
    ret.className = 'control-group';

    var col_width = pColWidth || 25;
    var width = 100;
    if (pre_input) {
      width -= col_width;
    }
    if (post_input) {
      width -= col_width;
    }

    var controls = document.createElement('div');
    controls.className = 'controls';

    if (label && input.getAttribute('type') === 'checkbox') {
      ret.appendChild(controls);
      label.className += ' checkbox';
      if (pInputID) {
        label.id = pInputID;
        
      }
      if(question) {
        
        label.appendChild(question);
      }
      if (preview_input) {
        preview_input.className += ' control-label';this.preview_image.id
        label.appendChild(preview_input);
      }
      label.appendChild(input);
      controls.appendChild(label);
      controls.style.height = '30px';
    } else {
      if(label) {
        label.className += ' control-label';
        if (buttons4title) {
          var span4title = this.getSpanLabel4Buttons(label,buttons4title);
          ret.appendChild(span4title);
        } else {
          ret.appendChild(label);
        }
      }
      if(question) {
        question.className += ' control-label';
        ret.appendChild(question);
      }
      if (preview_input) {
        preview_input.className += ' control-label';
        ret.appendChild(preview_input);
      }
      
      var table = document.createElement('div');
      table.setAttribute("width","100%");
      table.style.width = "100%";
      
      if (pInputID) {
        table.id = pInputID;
        
      }
      
      var tr  = table;

      if (pre_input) {

        var td1  = document.createElement('div');
        td1.setAttribute("width",col_width+"%");
        td1.style.width = col_width+"%";
        td1.style.float = "left";
        td1.style.cssText = "text-align: center";
        td1.appendChild(pre_input);
        tr.appendChild(td1);
      }
      
      var td2  = document.createElement('div');
      td2.setAttribute("theme-object","form-control-bootstrap2");
      td2.setAttribute("width",col_width+"%");
      td2.style.width = col_width+"%";
      td2.style.float = "left";
      td2.appendChild(input);
      tr.appendChild(td2);
      td2.style.width = width+"%";
      if (post_input) {
        
        var td3  = document.createElement('div');
        td3.setAttribute("width",col_width+"%");
        td3.style.width = col_width+"%";
        td3.style.float = "left";
        td3.style.cssText = "text-align: center";
        td3.appendChild(post_input);
        tr.appendChild(td3);
      }
      controls.appendChild(table);
      ret.appendChild(controls);
    }

    if(description) {
      var br  = document.createElement('br');
      controls.appendChild(br);
      controls.appendChild(description);
    }
    return ret;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.marginLeft = '10px';
    return el;
  },
  getButtonHolder: function() {
    var el = document.createElement('div');
    el.className = 'btn-group';
    return el;
  },
  getButton: function(text, icon, title) {
    var el =  this._super(text, icon, title);
    el.className += ' btn btn-default';
    return el;
  },
  getTable: function() {
    var el = document.createElement('table');
    el.className = 'table table-bordered';
    el.style.width = 'auto';
    el.style.maxWidth = 'none';
    return el;
  },
  addInputError: function(input,text) {
    if(!input.controlgroup || !input.controls) return;
    input.controlgroup.className += ' error';
    if(!input.errmsg) {
      input.errmsg = document.createElement('p');
      input.errmsg.className = 'help-block errormsg';
      input.controls.appendChild(input.errmsg);
    }
    else {
      input.errmsg.style.display = '';
    }

    $setContent(input.errmsg,text);
  },
  removeInputError: function(input) {
    if(!input.errmsg) return;
    input.errmsg.style.display = 'none';
    input.controlgroup.className = input.controlgroup.className.replace(/\s?error/g,'');
  },
  getTabHolder: function() {
    var el = document.createElement('div');
    el.className = 'tabbable tabs-left';
    el.innerHTML = "<ul class='nav nav-tabs span2' style='margin-right: 0;'></ul><div class='tab-content span10' style='overflow:visible;'></div>";
    return el;
  },
  getTabHolderDOM: function() {
    var el = document.createElement('div');
    
    var men = this.getTabMenuHolderDOM();
    var body = this.getTabBodyHolderDOM();
    var tail = this.getTabTailHolderDOM();
    el.appendChild(men);
    el.appendChild(body);
    el.appendChild(tail);

    return el;
  },
  getTabMenuHolderDOM: function() {
    var el = document.createElement('ul');
    el.classList.add('nav');
    el.classList.add('nav-tabs');
    el.classList.add('span2');
    el.style.marginRight = "0px";
    
    return el;
  },
  getTabBodyHolderDOM: function() {
    var el = document.createElement('div');
    el.style["margin-left"] = "130px";
    el.classList.add('content');
    
    return el;
  },
  getTabTailHolderDOM: function() {
    var el = document.createElement('div');
    el.style.display = "none";
    return el;
  },
  getTab: function(text) {
    var el = document.createElement('li');
    var a = document.createElement('a');
    a.setAttribute('href','#');
    a.appendChild(text);
    el.appendChild(a);
    return el;
  },
  getTabMenuHolder: function(tab_holder) {
    return tab_holder.children[0];
  },
  getTabContentHolder: function(tab_holder) {
    return tab_holder.children[1];
  },
  getTabContent: function() {
    var el = document.createElement('div');
    el.className = 'tab-pane active';
    return el;
  },
  markTabActive: function(tab) {
    tab.className += ' active';
  },
  markTabInactive: function(tab) {
    tab.className = tab.className.replace(/\s?active/g,'');
  },
  addTab: function(holder, tab) {
    holder.children[0].appendChild(tab);
  },
  getProgressBar: function() {
    var container = document.createElement('div');
    container.className = 'progress';

    var bar = document.createElement('div');
    bar.className = 'bar';
    bar.style.width = '0%';
    container.appendChild(bar);

    return container;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;

    progressBar.firstChild.style.width = progress + "%";
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;

    progressBar.className = 'progress progress-striped active';
    progressBar.firstChild.style.width = '100%';
  }
});
JSONEditor.defaults.themes.bootstrap3 = JSONEditor.AbstractTheme.extend({
  cssformat:"bootstrap3",
  getSelectInput: function(options) {
    var el = this._super(options);
    el.className += 'form-control';
    
    return el;
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.className = 'row';
    return el;
  },
  getGridColumn: function() {
    var el = document.createElement('div');
    return el;
  },
  setGridColumnSize: function(el,size) {
    el.className = 'col-md-'+size;
  },
  afterInputReady: function(input) {
    if(input.controlgroup) return;
    input.controlgroup = this.closest(input,'.form-group');
    if(this.closest(input,'.compact')) {
      input.controlgroup.style.marginBottom = 0;
    }

  },
  getTextareaInput: function(options) {
    options = options || {};
    var el = document.createElement('textarea');
    el.className = 'form-control';
    el.style.width = options.width || '100%';
    return el;
  },
  getRangeInput: function(min, max, step) {
    
    return this._super(min, max, step);
  },
  getFormInputField: function(type) {
    var el = this._super(type);
    if(type !== 'checkbox') {
      el.className += 'form-control';
    }
    return el;
  },
  getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    return this.appendFormControl(null,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth);
  },
  appendFormControl: function(pParent,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    
    var group = document.createElement('div');
    if (pParent) {
      pParent.appendChild(group);
    }
    var col_width = pColWidth || 25;
    var width = 100;
    if (pre_input) {
      width -= col_width;
    }
    if (post_input) {
      width -= col_width;
    }

    if(label && input.type === 'checkbox') {
      group.className += ' checkbox';
      label.appendChild(input);
      if (pInputID) {
        label.id = pInputID;
        
      }
      label.style.fontSize = '14px';
      group.style.marginTop = '0';
      group.appendChild(label);
      input.style.position = 'relative';
      input.style.cssFloat = 'left';
    } else {
      group.className += ' form-group';
      if(label) {
        label.className += ' control-label';
        group.appendChild(label);
      }
      if(question) {
        question.className += ' control-label';
        group.appendChild(question);
      }
      if (preview_input) {
        preview_input.className += ' control-label';
        group.appendChild(preview_input);
      }
      
      var table = document.createElement('div');
      if (pInputID) {
        table.id = pInputID;
        
      }
      table.setAttribute("width","100%");
      table.style.width="100%";
      group.appendChild(table);

      var tr  = table;

      if (pre_input) {

        var td1  = document.createElement('div');
        td1.setAttribute("width",col_width+"%");
        td1.style.cssText = "text-align: center";
        td1.style.width = col_width+"%";
        td1.style.float = "left";
        td1.appendChild(pre_input);
        tr.appendChild(td1);
      }
      
      var td2 = document.createElement('div');
      td2.setAttribute("theme-object","form-control-bootstrap3");
      td2.setAttribute("width",width+"%");
      td2.style.width= width+"%";
      td2.style.float = "left";
      td2.appendChild(input);
      tr.appendChild(td2);

      if (post_input) {
        
        var td3  = document.createElement('div');
        td3.setAttribute("width",col_width+"%");
        td3.style.width = col_width+"%";
        td3.style.float = "left";
        td3.style.cssText = "text-align: center";
        td3.appendChild(post_input);
        tr.appendChild(td3);
      }
    }
    if(description) {
      var br  = document.createElement('br');
      group.appendChild(br);
      group.appendChild(description);
    }
    return group;
  },
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.className = 'well well-sm';
    el.style.paddingBottom = 0;
    return el;
  },
  getFormInputDescription: function(text) {
    var el = document.createElement('div');
    el.className = 'help-block';
    el.innerHTML = text;
    return el;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.marginLeft = '10px';
    return el;
  },
  getButtonHolder: function() {
    var el = document.createElement('div');
    el.className = 'btn-group';
    return el;
  },
  getButton: function(text, icon, title) {
    var el = this._super(text, icon, title);
    el.className += 'btn btn-default';
    return el;
  },
  getTable: function() {
    var el = document.createElement('table');
    el.className = 'table table-bordered';
    el.style.width = 'auto';
    el.style.maxWidth = 'none';
    return el;
  },

  addInputError: function(input,text) {
    if(!input.controlgroup) return;
    input.controlgroup.className += ' has-error';
    if(!input.errmsg) {
      input.errmsg = document.createElement('p');
      input.errmsg.className = 'help-block errormsg';
      input.controlgroup.appendChild(input.errmsg);
    }
    else {
      input.errmsg.style.display = '';
    }
    $setContent(input.errmsg,text);
    
  },
  removeInputError: function(input) {
    if(!input.errmsg) return;
    input.errmsg.style.display = 'none';
    input.controlgroup.className = input.controlgroup.className.replace(/\s?has-error/g,'');
  },
  getTabHolder: function() {
    var el = document.createElement('div');
    el.innerHTML = "<div class='tabs list-group col-md-2'></div><div class='col-md-10'></div>";
    el.className = 'rows';
    return el;
  },
  getTabHolderDOM: function() {
    var el = document.createElement('div');
    
    var men = this.getTabMenuHolderDOM();
    var body = this.getTabBodyHolderDOM();
    var tail = this.getTabTailHolderDOM();
    el.appendChild(men);
    el.appendChild(body);
    el.appendChild(tail);

    return el;
  },
  getTabMenuHolderDOM: function() {
    var el = document.createElement('ul');
    
    el.classList.add('tabs');
    el.classList.add('list-group');
    el.classList.add('col-md-2');
    return el;
  },
  getTabBodyHolderDOM: function() {
    var el = document.createElement('div');
    
    el.classList.add('col-md-10');
    return el;
  },
  getTabTailHolderDOM: function() {
    var el = document.createElement('div');
    el.style.display = "none";
    return el;
  },
  getTab: function(text) {
    var el = document.createElement('a');
    el.className = 'list-group-item';
    el.setAttribute('href','#');
    el.appendChild(text);
    return el;
  },
  markTabActive: function(tab) {
    tab.className += ' active';
  },
  markTabInactive: function(tab) {
    tab.className = tab.className.replace(/\s?active/g,'');
  },
  getProgressBar: function() {
    var min = 0, max = 100, start = 0;

    var container = document.createElement('div');
    container.className = 'progress';

    var bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.setAttribute('role', 'progressbar');
    bar.setAttribute('aria-valuenow', start);
    bar.setAttribute('aria-valuemin', min);
    bar.setAttribute('aria-valuenax', max);
    bar.innerHTML = start + "%";
    container.appendChild(bar);

    return container;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;

    var bar = progressBar.firstChild;
    var percentage = progress + "%";
    bar.setAttribute('aria-valuenow', progress);
    bar.style.width = percentage;
    bar.innerHTML = percentage;
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;

    var bar = progressBar.firstChild;
    progressBar.className = 'progress progress-striped active';
    bar.removeAttribute('aria-valuenow');
    bar.style.width = '100%';
    bar.innerHTML = '';
  }
});

JSONEditor.defaults.themes.foundation = JSONEditor.AbstractTheme.extend({
  cssformat:"foundation",
  getChildEditorHolder: function() {
    var el = document.createElement('div');
    el.style.marginBottom = '15px';
    return el;
  },
  getSelectInput: function(options) {
    var el = this._super(options);
    el.style.minWidth = 'none';
    el.style.padding = '5px';
    el.style.marginTop = '3px';
    return el;
  },
  getSwitcher: function(options) {
    var el = this._super(options);
    el.style.paddingRight = '8px';
    return el;
  },
  afterInputReady: function(input) {
    if(this.closest(input,'.compact')) {
      input.style.marginBottom = 0;
    }
    input.group = this.closest(input,'.form-control');
  },
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.display = 'inline-block';
    return el;
  },
  getFormInputField: function(type) {
    var el = this._super(type);
    el.style.width = '100%';
    el.style.marginBottom = type==='checkbox'? '0' : '12px';
    return el;
  },
  getFormInputDescription: function(text) {
    var el = document.createElement('p');
    
    $setContent(el,text);
    el.style.marginTop = '-10px';
    el.style.fontStyle = 'italic';
    return el;
  },
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.className = 'panel';
    el.style.paddingBottom = 0;
    return el;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.display = 'inline-block';
    el.style.marginLeft = '10px';
    el.style.verticalAlign = 'middle';
    return el;
  },
  getButtonHolder: function() {
    var el = document.createElement('div');
    el.className = 'button-group';
    return el;
  },
  getButton: function(text, icon, title) {
    var el = this._super(text, icon, title);
    el.className += ' small button';
    return el;
  },
  addInputError: function(input,text) {
    if(!input.group) return;
    input.group.className += ' error';

    if(!input.errmsg) {
      input.insertAdjacentHTML('afterend','<small class="error"></small>');
      input.errmsg = input.parentNode.getElementsByClassName('error')[0];
    }
    else {
      input.errmsg.style.display = '';
    }

    $setContent(input.errmsg,text);
    
  },
  removeInputError: function(input) {
    if(!input.errmsg) return;
    input.group.className = input.group.className.replace(/ error/g,'');
    input.errmsg.style.display = 'none';
  },
  getProgressBar: function() {
    var progressBar = document.createElement('div');
    progressBar.className = 'progress';

    var meter = document.createElement('span');
    meter.className = 'meter';
    meter.style.width = '0%';
    progressBar.appendChild(meter);
    return progressBar;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;
    progressBar.firstChild.style.width = progress + '%';
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;
    progressBar.firstChild.style.width = '100%';
  }
});

JSONEditor.defaults.themes.foundation3 = JSONEditor.defaults.themes.foundation.extend({
  getHeaderButtonHolder: function() {
    var el = this._super();
    el.style.fontSize = '.6em';
    return el;
  },
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.fontWeight = 'bold';
    return el;
  },
  getTabHolder: function() {
    var el = document.createElement('div');
    el.className = 'row';
    el.innerHTML = "<dl class='tabs vertical two columns'></dl><div class='tabs-content ten columns'></div>";
    return el;
  },
  getTabHolderDOM: function() {
    var el = document.createElement('div');
    el.className = 'row';
    
    var men = this.getTabMenuHolderDOM();
    var body = this.getTabBodyHolderDOM();
    var tail = this.getTabTailHolderDOM();
    el.appendChild(men);
    el.appendChild(body);
    el.appendChild(tail);

    return el;
  },
  getTabMenuHolderDOM: function() {
    var el = document.createElement('dl');
    
    el.classList.add('tabs');
    el.classList.add('vertical');
    el.classList.add('two');
    el.classList.add('columns');
    return el;
  },
  getTabBodyHolderDOM: function() {
    var el = document.createElement('div');
    
    el.classList.add('tabs-content');
    el.classList.add('ten');
    el.classList.add('columns');
    return el;
  },
  getTabTailHolderDOM: function() {
    var el = document.createElement('div');
    
    el.style.display = "none";
    return el;
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.className = 'row';
    return el;
  },
  getGridColumn: function() {
    var el = document.createElement('div');
    return el;
  },
  setGridColumnSize: function(el,size) {
    var sizes = ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve'];
    el.className = 'columns '+sizes[size];
  },
  getTab: function(text) {
    var el = document.createElement('dd');
    var a = document.createElement('a');
    a.setAttribute('href','#');
    a.appendChild(text);
    el.appendChild(a);
    return el;
  },
  getTabContentHolder: function(tab_holder) {
    return tab_holder.children[1];
  },
  getTabContent: function() {
    var el = document.createElement('div');
    el.className = 'content active';
    el.style.paddingLeft = '5px';
    return el;
  },
  markTabActive: function(tab) {
    tab.className += ' active';
  },
  markTabInactive: function(tab) {
    tab.className = tab.className.replace(/\s*active/g,'');
  },
  addTab: function(holder, tab) {
    holder.children[0].appendChild(tab);
  }
});

JSONEditor.defaults.themes.foundation4 = JSONEditor.defaults.themes.foundation.extend({
  getHeaderButtonHolder: function() {
    var el = this._super();
    el.style.fontSize = '.6em';
    return el;
  },
  setGridColumnSize: function(el,size) {
    el.className = 'columns large-'+size;
  },
  getFormInputDescription: function(text) {
    var el = this._super(text);
    el.style.fontSize = '.8rem';
    return el;
  },
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.fontWeight = 'bold';
    return el;
  }
});

JSONEditor.defaults.themes.foundation5 = JSONEditor.defaults.themes.foundation.extend({
  getFormInputDescription: function(text) {
    var el = this._super(text);
    el.style.fontSize = '.8rem';
    return el;
  },
  setGridColumnSize: function(el,size) {
    el.className = 'columns medium-'+size;
  },
  getButton: function(text, icon, title) {
    var el = this._super(text,icon,title);
    el.className = el.className.replace(/\s*small/g,'') + ' tiny';
    return el;
  },
  getTabHolder: function() {
    var el = document.createElement('div');
    el.innerHTML = "<dl class='tabs vertical'></dl><div class='tabs-content vertical'></div>";
    return el;
  },
  getTab: function(text) {
    var el = document.createElement('dd');
    var a = document.createElement('a');
    a.setAttribute('href','#');
    a.appendChild(text);
    el.appendChild(a);
    return el;
  },
  getTabContentHolder: function(tab_holder) {
    return tab_holder.children[1];
  },
  getTabContent: function() {
    var el = document.createElement('div');
    el.className = 'content active';
    el.style.paddingLeft = '5px';
    return el;
  },
  markTabActive: function(tab) {
    tab.className += ' active';
  },
  markTabInactive: function(tab) {
    tab.className = tab.className.replace(/\s*active/g,'');
  },
  addTab: function(holder, tab) {
    holder.children[0].appendChild(tab);
  }
});

JSONEditor.defaults.themes.foundation6 = JSONEditor.defaults.themes.foundation5.extend({
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.className = 'callout secondary';
    return el;
  },
  getButtonHolder: function() {
    var el = document.createElement('div');
    el.className = 'button-group tiny';
    el.style.marginBottom = 0;
    return el;
  },
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.display = 'block';
    return el;
  },
  getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    return this.appendFormControl(null,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth);
  },
  appendFormControl: function(pParent,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    
    var col_width = pColWidth || 25;
    var width = 100;
    if (pre_input) {
      width -= col_width;
    }
    if (post_input) {
      width -= col_width;
    }

    var el = document.createElement('div');
    el.className = 'form-control';
    if(label) el.appendChild(label);
    if (question) el.appendChild(question);
    if (preview_input) el.appendChild(preview_input);
    if(label && input.type === 'checkbox') {
      if (label) {
        label.insertBefore(input,label.firstChild);
        label.appendChild(input);
      } else {
        el.appendChild(input);
      }
    } else {
      
      var table = document.createElement('div');
      if (pInputID) {
        table.id = pInputID;
        
      }
      table.style.width="100%";
      table.setAttribute("width","100%");
      el.appendChild(table);

      var tr  = table;
      
      if (pre_input) {

        var td1  = document.createElement('div');
        td1.setAttribute("width",col_width+"%");
        td1.style.cssText = "text-align: center";
        td1.style.width = col_width+"%";
        td1.style.float = "left";
        td1.appendChild(pre_input);
        tr.appendChild(td1);
      }
      
      var td2 = document.createElement('div');
      td2.setAttribute("theme-object","form-control-foundation");
      td2.setAttribute("width",width+"%");
      td2.style.width= width+"%";
      td2.style.float = "left";
      td2.appendChild(input);
      tr.appendChild(td2);
      if (post_input) {
        
        var td3  = document.createElement('div');
        td3.setAttribute("width",col_width+"%");
        td3.style.cssText = "text-align: center";
        td3.style.float = "left";
        td3.style.width = col_width+"%";
        td3.appendChild(post_input);
        tr.appendChild(td3);
      }
    }
    if(description)  {
      var br  = document.createElement('br');
      el.appendChild(br);
      el.appendChild(description);
    }
    return el;
  },
  addInputError: function(input,text) {
    if(!input.group) return;
    input.group.className += ' error';

    if(!input.errmsg) {
      var errorEl = document.createElement('span');
      errorEl.className = 'form-error is-visible';
      input.group.getElementsByTagName('label')[0].appendChild(errorEl);

      input.className = input.className + ' is-invalid-input';

      input.errmsg = errorEl;
    } else {
      input.errmsg.style.display = '';
      input.className = '';
    }

    $setContent(input.errmsg,text);
    
  },
  removeInputError: function(input) {
    if(!input.errmsg) return;
    input.className = input.className.replace(/ is-invalid-input/g,'');
    if(input.errmsg.parentNode) {
      input.errmsg.parentNode.removeChild(input.errmsg);
    }
  },
});
JSONEditor.defaults.themes.html = JSONEditor.AbstractTheme.extend({
  cssformat:"html",
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.display = 'block';
    el.style.marginBottom = '3px';
    el.style.fontWeight = 'bold';
    return el;
  },
  XgetFormInputDescription: function(text) {
    var el = this._super(text);
    el.style.fontSize = '.8em';
    el.style.margin = 0;
    el.style.display = 'inline-block';
    el.style.fontStyle = 'italic';
    return el;
  },
  getIndentedPanel: function() {
    var el = this._super();
    
    el.style.padding = '5px';
    el.style.margin = '5px';
    el.style.borderRadius = '3px';
    return el;
  },
  getChildEditorHolder: function() {
    var el = this._super();
    el.style.marginBottom = '8px';
    return el;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.display = 'inline-block';
    el.style.marginLeft = '10px';
    el.style.fontSize = '.8em';
    el.style.verticalAlign = 'middle';
    return el;
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    el.className = 'gridtable';
    el.style.width = '100%';
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.style.width = '100%';
    el.style.marginLeft = '-15px';
    el.style.marginRight = '-15px';
    el.style.boxSizing = 'border-box';
    
    el.className = 'gridrow';
    return el;
  },
  getTextareaInput: function(options) {
    options = options || {};
    var el = document.createElement('textarea');
    el.className = 'textarea-input';
    el.style.width = options.width || '100%';
    el.style.height = 'auto';
    return el;
  },

  getGridColumn: function() {

    var el = document.createElement('div');
    el.style.float = 'left';
    el.style.position = 'relative';
    el.style.boxSizing = 'border-box';
    el.style.minHeight = '1px';
    el.style.paddingLeft = '15px';
    el.style.paddingRight = '15px';
    
    return el;
  },
  setGridColumnSize: function(el,size,rowsize) {
    rowsize = rowsize || 12;
    if (isNaN(rowsize)) {
      rowsize = 12;
    }
    if (isNaN(size)) {
    } else {
      var percentage = 100*size/rowsize;
      if ((percentage > 10.0) && (percentage <= 100.0)) {
        el.style.width = percentage+'%';
      } else {
      }
    }
  },
  X_getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID) {
    var el = this._super(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID);
    return el;
  },
  getTable: function() {
    var el = this._super();
    
    el.style.marginBottom = '5px';
    return el;
  },
  addInputError: function(input, text) {
    input.style.borderColor = 'red';

    if(!input.errmsg) {
      var group = this.closest(input,'.form-control');
      input.errmsg = document.createElement('div');
      input.errmsg.setAttribute('class','errmsg');
      input.errmsg.style = input.errmsg.style || {};
      input.errmsg.style.color = 'red';
      group.appendChild(input.errmsg);
    }
    else {
      input.errmsg.style.display = 'block';
    }

    input.errmsg.innerHTML = '';
    input.errmsg.appendChild(document.createTextNode(text));
  },
  removeInputError: function(input) {
    input.style.borderColor = '';
    if(input.errmsg) input.errmsg.style.display = 'none';
  },
  getProgressBar: function() {
    var max = 100, start = 0;

    var progressBar = document.createElement('progress');
    progressBar.setAttribute('max', max);
    progressBar.setAttribute('value', start);
    return progressBar;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;
    progressBar.setAttribute('value', progress);
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;
    progressBar.removeAttribute('value');
  }
});
JSONEditor.defaults.themes.htmlinline = JSONEditor.AbstractTheme.extend({
  cssformat:"htmlinline",
  getFormInputLabel: function(text) {
    var el = this._super(text);
    el.style.display = 'block';
    el.style.marginBottom = '3px';
    el.style.fontWeight = 'bold';
    return el;
  },
  getFormInputDescription: function(text) {
    var el = this._super(text);
    el.style.fontSize = '.8em';
    el.style.margin = 0;
    el.style.display = 'inline-block';
    el.style.fontStyle = 'italic';
    return el;
  },
  getIndentedPanel: function() {
    var el = this._super();
    
    el.style.padding = '5px';
    el.style.margin = '5px';
    el.style.borderRadius = '3px';
    return el;
  },
  getChildEditorHolder: function() {
    var el = this._super();
    el.style.marginBottom = '8px';
    return el;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.display = 'inline-block';
    el.style.marginLeft = '10px';
    el.style.fontSize = '.8em';
    el.style.verticalAlign = 'middle';
    return el;
  },
  getGridContainer: function() {
    var el = document.createElement('div');
    el.className = 'gridtable';
    el.style.width = '100%';
    return el;
  },
  getGridRow: function() {
    var el = document.createElement('div');
    el.style.width = '100%';
    el.style.marginLeft = '-15px';
    el.style.marginRight = '-15px';
    el.style.boxSizing = 'border-box';
    
    el.className = 'gridrow';
    return el;
  },
  getTextareaInput: function(options) {
    options = options || {};
    var el = document.createElement('textarea');
    el.className = 'textarea-input';
    el.style.width = options.width || '100%';
    el.style.height = 'auto';
    return el;
  },

  getGridColumn: function() {

    var el = document.createElement('div');
    el.style.float = 'left';
    el.style.position = 'relative';
    el.style.boxSizing = 'border-box';
    el.style.minHeight = '1px';
    el.style.paddingLeft = '15px';
    el.style.paddingRight = '15px';
    
    return el;
  },
  setGridColumnSize: function(el,size,rowsize) {
    rowsize = rowsize || 12;
    if (isNaN(rowsize)) {
      rowsize = 12;
    }
    if (isNaN(size)) {
    } else {
      var percentage = 100*size/rowsize;
      if ((percentage > 10.0) && (percentage <= 100.0)) {
        el.style.width = percentage+'%';
      } else {
      }
    }
  },
  X_getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID) {
    var el = this._super(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID);
    return el;
  },
  getTable: function() {
    var el = this._super();
    
    el.style.marginBottom = '5px';
    return el;
  },
  addInputError: function(input, text) {
    input.style.borderColor = 'red';

    if(!input.errmsg) {
      var group = this.closest(input,'.form-control');
      input.errmsg = document.createElement('div');
      input.errmsg.setAttribute('class','errmsg');
      input.errmsg.style = input.errmsg.style || {};
      input.errmsg.style.color = 'red';
      group.appendChild(input.errmsg);
    }
    else {
      input.errmsg.style.display = 'block';
    }

    input.errmsg.innerHTML = '';
    input.errmsg.appendChild(document.createTextNode(text));
  },
  removeInputError: function(input) {
    input.style.borderColor = '';
    if(input.errmsg) input.errmsg.style.display = 'none';
  },
  getProgressBar: function() {
    var max = 100, start = 0;

    var progressBar = document.createElement('progress');
    progressBar.setAttribute('max', max);
    progressBar.setAttribute('value', start);
    return progressBar;
  },
  updateProgressBar: function(progressBar, progress) {
    if (!progressBar) return;
    progressBar.setAttribute('value', progress);
  },
  updateProgressBarUnknown: function(progressBar) {
    if (!progressBar) return;
    progressBar.removeAttribute('value');
  }
});
JSONEditor.defaults.themes.jqueryui = JSONEditor.AbstractTheme.extend({
  cssformat:"jqueryui",
  getTable: function() {
    var el = this._super();
    el.setAttribute('cellpadding',5);
    el.setAttribute('cellspacing',0);
    return el;
  },
  getTableHeaderCell: function(text) {
    var el = this._super(text);
    el.className = 'ui-state-active';
    el.style.fontWeight = 'bold';
    return el;
  },
  getTableCell: function() {
    var el = this._super();
    el.className = 'ui-widget-content';
    return el;
  },
  getHeaderButtonHolder: function() {
    var el = this.getButtonHolder();
    el.style.marginLeft = '10px';
    el.style.fontSize = '.6em';
    el.style.display = 'inline-block';
    return el;
  },
  getFormInputDescription: function(text) {
    var el = this.getDescription(text);
    el.style.marginLeft = '10px';
    el.style.display = 'inline-block';
    return el;
  },
  getFormControl: function(label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    return this.appendFormControl(null,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth);
  },
  appendFormControl: function(pParent,label, input, description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth) {
    var el = this._super(pParent,label,input,description, question, pre_input,post_input,preview_input,buttons4title,pInputID,pColWidth);
    if(input.type === 'checkbox') {
      el.style.lineHeight = '25px';

      el.style.padding = '3px 0';
    }
    else {
      el.style.padding = '4px 0 8px 0';
    }
    return el;
  },
  getDescription: function(text) {
    var el = document.createElement('span');
    el.style.fontSize = '.8em';
    el.style.fontStyle = 'italic';
    
    $setContent(el,text);
    return el;
  },
  getButtonHolder: function() {
    var el = document.createElement('div');
    el.className = 'ui-buttonset';
    el.style.fontSize = '.7em';
    return el;
  },
  getFormInputLabel: function(text) {
    var el = document.createElement('label');
    el.style.fontWeight = 'bold';
    el.style.display = 'block';
    
    $setContent(el,text);
    return el;
  },
  getButton: function(text, icon, title) {
    var button = document.createElement("button");
    button.className = 'ui-button ui-widget ui-state-default ui-corner-all';

    if(icon && !text) {
      button.className += ' ui-button-icon-only';
      icon.className += ' ui-button-icon-primary ui-icon-primary';
      button.appendChild(icon);
    }
    
    else if(icon) {
      button.className += ' ui-button-text-icon-primary';
      icon.className += ' ui-button-icon-primary ui-icon-primary';
      button.appendChild(icon);
    }
    
    else {
      button.className += ' ui-button-text-only';
    }

    var el = document.createElement('span');
    el.className = 'ui-button-text';
    
    $setContent(el,text||title||".");

    button.appendChild(el);

    button.setAttribute('title',title);

    return button;
  },
  setButtonText: function(button,text, icon, title) {
    button.innerHTML = '';
    button.className = 'ui-button ui-widget ui-state-default ui-corner-all';

    if(icon && !text) {
      button.className += ' ui-button-icon-only';
      icon.className += ' ui-button-icon-primary ui-icon-primary';
      button.appendChild(icon);
    }
    
    else if(icon) {
      button.className += ' ui-button-text-icon-primary';
      icon.className += ' ui-button-icon-primary ui-icon-primary';
      button.appendChild(icon);
    }
    
    else {
      button.className += ' ui-button-text-only';
    }

    var el = document.createElement('span');
    el.className = 'ui-button-text';
    
    $setContent(el,text||title||".");
    button.appendChild(el);

    button.setAttribute('title',title);
  },
  getIndentedPanel: function() {
    var el = document.createElement('div');
    el.className = 'ui-widget-content ui-corner-all';
    el.style.padding = '1em 1.4em';
    el.style.marginBottom = '20px';
    return el;
  },
  afterInputReady: function(input) {
    if(input.controls) return;
    input.controls = this.closest(input,'.form-control');
  },
  addInputError: function(input,text) {
    if(!input.controls) return;
    if(!input.errmsg) {
      input.errmsg = document.createElement('div');
      input.errmsg.className = 'ui-state-error';
      input.controls.appendChild(input.errmsg);
    }
    else {
      input.errmsg.style.display = '';
    }

    $setContent(input.errmsg,text);
    
  },
  removeInputError: function(input) {
    if(!input.errmsg) return;
    input.errmsg.style.display = 'none';
  },
  markTabActive: function(tab) {
    tab.className = tab.className.replace(/\s*ui-widget-header/g,'')+' ui-state-active';
  },
  markTabInactive: function(tab) {
    tab.className = tab.className.replace(/\s*ui-state-active/g,'')+' ui-widget-header';
  }
});
JSONEditor.defaults.themes.barebones = JSONEditor.AbstractTheme.extend({
  cssformat:"barebones",
  getFormInputLabel: function (text) {
        var el = this._super(text);
        return el;
    },
    getFormInputDescription: function (text) {
        var el = this._super(text);
        return el;
    },
    getIndentedPanel: function () {
        var el = this._super();
        return el;
    },
    getChildEditorHolder: function () {
        var el = this._super();
        return el;
    },
    getHeaderButtonHolder: function () {
        var el = this.getButtonHolder();
        return el;
    },
    getTable: function () {
        var el = this._super();
        return el;
    },
    addInputError: function (input, text) {
        if (!input.errmsg) {
            var group = this.closest(input, '.form-control');
            input.errmsg = document.createElement('div');
            input.errmsg.setAttribute('class', 'errmsg');
            group.appendChild(input.errmsg);
        }
        else {
            input.errmsg.style.display = 'block';
        }

        input.errmsg.innerHTML = '';
        input.errmsg.appendChild(document.createTextNode(text));
    },
    removeInputError: function (input) {
        input.style.borderColor = '';
        if (input.errmsg) input.errmsg.style.display = 'none';
    },
    getProgressBar: function () {
        var max = 100, start = 0;

        var progressBar = document.createElement('progress');
        progressBar.setAttribute('max', max);
        progressBar.setAttribute('value', start);
        return progressBar;
    },
    updateProgressBar: function (progressBar, progress) {
        if (!progressBar) return;
        progressBar.setAttribute('value', progress);
    },
    updateProgressBarUnknown: function (progressBar) {
        if (!progressBar) return;
        progressBar.removeAttribute('value');
    }
});
JSONEditor.AbstractIconLib = Class.extend({
  imgtag:"img", 
  width: 14,
  height: 14,
  mapping: {
    "collapse": '',
    "expand": '',
    "delete": '',
    "edit": '',
    "add": '',
    "cancel": '',
    "save": '',
    "moveup": '',
    "movedown": '',
    "load": '',
    "settings": '',
    "backgroundcolor": '',
    "brush": '',
    "search": '',
    "backward": '',
    "fastbackward": '',
    "forward": '',
    "fastforward": '',
    "globe": '',
    "info": '',
    "eye": '',
    "view": ''
  },
  icon_prefix: '',

  getIconClass: function(key) {
    if(this.mapping[key]) {
      
      return this.icon_prefix+this.mapping[key];
    } else {
      
      return this.getIcon4Image(key,"base64");
    }
  },
  getIcon4Image: function(key,imgtag) {
    imgtag = imgtag || this.imgtag;
    
    var img = document.createElement('img');
    img.setAttribute("width", this.width);
    img.setAttribute("height", this.height);
    if (imgtag == "url") {
      
      img.setAttribute("src", key);
      return img;
    } else {
      
      var vIcon = this.getIconData(key);
      if(!vIcon) {
        return null;
      } else {
        if (imgtag == "base64") {
          img.setAttribute("src", vIcon.src);
        } else {
          img.setAttribute("src", vIcon.path + "/" + vIcon.name);
        }
      }
       
      return img;
    }
  },
  getIcon: function(key,imgtag) {
    imgtag = imgtag || this.imgtag;
    if (this.imgtag && (this.imgtag === "iconlib")) {
      return this.getIcon4Class(key);
    } else {
      return this.getIcon4Image(key,imgtag);
    }
  },
  getIcon4Class: function(key) {
    var iconclass = this.getIconClass(key);

    if(!iconclass) return null;

    var i = document.createElement('i');
    i.className = iconclass;
    return i;
  },
  getIconData: function(key) {
    if (key == "view" || key == "preview") {
      key = "eye"
    };
    if (this.icons && this.icons[key]) {
      return this.icons[key];
    } else {
      if (key) {
        console.error("ERROR: Icon not found for key '" + key + "' in src/iconlib.js");
      }
      return null;
    }
  }

});

JSONEditor.defaults.iconlibs.icons4menu = JSONEditor.AbstractIconLib.extend({
  imgtag:"base64", 
  mapping: {
    "calendar":"calendar.svg",
    "collapse": "carat-d-black.svg",
    "expand": "carat-r-black.svg",
    "calendar": "calendar", 
    "delete": "fa-trash-black",
    "edit": "edit-black.svg",
    "add": "plus-black.svg",
    "substract": "minus-black.svg",
    "cancel": "cancel-black.svg",
    "load": "fa-folder-open-black.svg",
    "save": "fa-file-save-black.svg",
    "moveup": "arrow-u-black.svg",
    "movedown": "arrow-d-black.svg",
    "brush": 'brush-paint.svg',
    "backgroundcolor": 'background-color.svg',
    "eye": 'eye-black.svg',
    "settings": 'gear-black.svg',
    "search": 'search-black.svg',
    "backward": 'fa-audio-back-black.svg',
    "fastbackward": 'fa-audio-backward-black.svg',
    "forward": 'fa-audio-play-black.svg',
    "fastforward": 'fa-audio-forward-black.svg',
    "globe": 'fa-globe-black.svg',
    "location":'location-black.svg',
    "info": 'info-black.svg',
    "star4unchecked": 'star4white-black.svg',
    "star4checked": 'star4yellow-black.svg',
    "transfer": 'transfer-black.svg',
    "view": 'eye-black.svg'

  },
  icon_prefix: 'icons4menu-',
  icons: {
    "calendar": {
            "name": "calendar.svg",
            "path": "img/icons-svg",
            "used": false,
            "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBzdHlsZT0iZmlsbDpjdXJyZW50Q29sb3I7IiBkPSJNMCw4aDJWNkgwVjh6IE0zLDhoMlY2SDNWOHogTTYsOGgyVjZINlY4eiBNOSw4aDJWNkg5Vjh6IE0xMiw4aDJWNmgtMlY4eiBNMCwxMWgyVjlIMFYxMXogTTMsMTFoMlY5SDNWMTF6IE02LDExaDJWOUg2VjExegoJIE05LDExaDJWOUg5VjExeiBNMTIsMTFoMlY5aC0yVjExeiBNMCwxNGgydi0ySDBWMTR6IE0zLDE0aDJ2LTJIM1YxNHogTTYsMTRoMnYtMkg2VjE0eiBNOSwxNGgydi0ySDlWMTR6IE0xMiwxCgljMC0wLjU1My0wLjQ0Ny0xLTEtMXMtMSwwLjQ0Ny0xLDFINGMwLTAuNTUzLTAuNDQ3LTEtMS0xUzIsMC40NDcsMiwxSDB2NGgxNFYxSDEyeiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
            "license": "CC0",
            "group": "other",
            "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path style=\"fill:currentColor;\" d=\"M0,8h2V6H0V8z M3,8h2V6H3V8z M6,8h2V6H6V8z M9,8h2V6H9V8z M12,8h2V6h-2V8z M0,11h2V9H0V11z M3,11h2V9H3V11z M6,11h2V9H6V11z\n\t M9,11h2V9H9V11z M12,11h2V9h-2V11z M0,14h2v-2H0V14z M3,14h2v-2H3V14z M6,14h2v-2H6V14z M9,14h2v-2H9V14z M12,1\n\tc0-0.553-0.447-1-1-1s-1,0.447-1,1H4c0-0.553-0.447-1-1-1S2,0.447,2,1H0v4h14V1H12z\"/>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
            "wikicommons": "http://jquerymobile.com/download/"
    },
    "collapse":  {
        "name": "carat-d-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cG9seWdvbiBmaWxsPSIjMDAwIiBwb2ludHM9IjExLjk0OSwzLjQwNCA3LDguMzU0IDIuMDUsMy40MDQgLTAuMDcxLDUuNTI1IDcsMTIuNTk2IDE0LjA3LDUuNTI1ICIvPgo8L3N2Zz4K",
        "license": "CC0",
        "group": "navigation",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<polygon fill=\"#000\" points=\"11.949,3.404 7,8.354 2.05,3.404 -0.071,5.525 7,12.596 14.07,5.525 \"/>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/carat-d-black.svg"
    },
    "expand": {
        "name": "carat-r-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojMDAwIiBwb2ludHM9IjMuNDA0LDIuMDUxIDguMzU0LDcgMy40MDQsMTEuOTUgNS41MjUsMTQuMDcgMTIuNTk2LDcgNS41MjUsLTAuMDcxICIvPgo8L3N2Zz4K",
        "license": "CC0",
        "group": "navigation",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<polygon style=\"fill:#000\" points=\"3.404,2.051 8.354,7 3.404,11.95 5.525,14.07 12.596,7 5.525,-0.071 \"/>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/carat-r-black.svg"
    },
    "delete": {
        "name": "fa-trash-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzM3NDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzcvN2QvVHJhc2hfZm9udF9hd2Vzb21lLnN2ZyIKICAgc29kaXBvZGk6ZG9jbmFtZT0idHJhc2hfZm9udF9hd2Vzb21lLnN2ZyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMzc1MSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczM3NDkiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSI2NDAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNDgwIgogICAgIGlkPSJuYW1lZHZpZXczNzQ3IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIwLjEzMTY5NjQzIgogICAgIGlua3NjYXBlOmN4PSI4OTYiCiAgICAgaW5rc2NhcGU6Y3k9Ijg5NiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjUiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmczNzQxIiAvPgogIDxnCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsMTk3LjQyMzczLDEyNTUuMDUwOCkiCiAgICAgaWQ9ImczNzQzIj4KICAgIDxwYXRoCiAgICAgICBkPSJNIDUxMiw4MDAgViAyMjQgcSAwLC0xNCAtOSwtMjMgLTksLTkgLTIzLC05IGggLTY0IHEgLTE0LDAgLTIzLDkgLTksOSAtOSwyMyB2IDU3NiBxIDAsMTQgOSwyMyA5LDkgMjMsOSBoIDY0IHEgMTQsMCAyMywtOSA5LC05IDksLTIzIHogbSAyNTYsMCBWIDIyNCBxIDAsLTE0IC05LC0yMyAtOSwtOSAtMjMsLTkgaCAtNjQgcSAtMTQsMCAtMjMsOSAtOSw5IC05LDIzIHYgNTc2IHEgMCwxNCA5LDIzIDksOSAyMyw5IGggNjQgcSAxNCwwIDIzLC05IDksLTkgOSwtMjMgeiBtIDI1NiwwIFYgMjI0IHEgMCwtMTQgLTksLTIzIC05LC05IC0yMywtOSBoIC02NCBxIC0xNCwwIC0yMyw5IC05LDkgLTksMjMgdiA1NzYgcSAwLDE0IDksMjMgOSw5IDIzLDkgaCA2NCBxIDE0LDAgMjMsLTkgOSwtOSA5LC0yMyB6IE0gMTE1Miw3NiB2IDk0OCBIIDI1NiBWIDc2IFEgMjU2LDU0IDI2MywzNS41IDI3MCwxNyAyNzcuNSw4LjUgMjg1LDAgMjg4LDAgaCA4MzIgcSAzLDAgMTAuNSw4LjUgNy41LDguNSAxNC41LDI3IDcsMTguNSA3LDQwLjUgeiBNIDQ4MCwxMTUyIGggNDQ4IGwgLTQ4LDExNyBxIC03LDkgLTE3LDExIEggNTQ2IHEgLTEwLC0yIC0xNywtMTEgeiBtIDkyOCwtMzIgdiAtNjQgcSAwLC0xNCAtOSwtMjMgLTksLTkgLTIzLC05IGggLTk2IFYgNzYgcSAwLC04MyAtNDcsLTE0My41IC00NywtNjAuNSAtMTEzLC02MC41IEggMjg4IHEgLTY2LDAgLTExMyw1OC41IFEgMTI4LC0xMSAxMjgsNzIgdiA5NTIgSCAzMiBxIC0xNCwwIC0yMyw5IC05LDkgLTksMjMgdiA2NCBxIDAsMTQgOSwyMyA5LDkgMjMsOSBoIDMwOSBsIDcwLDE2NyBxIDE1LDM3IDU0LDYzIDM5LDI2IDc5LDI2IGggMzIwIHEgNDAsMCA3OSwtMjYgMzksLTI2IDU0LC02MyBsIDcwLC0xNjcgaCAzMDkgcSAxNCwwIDIzLC05IDksLTkgOSwtMjMgeiIKICAgICAgIGlkPSJwYXRoMzc0NSIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojMDAwIiAvPgogIDwvZz4KPC9zdmc+Cg==",
        "license": "CC BY-SA 3.0",
        "group": "main",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg3741\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/7/7d/Trash_font_awesome.svg\"\n   sodipodi:docname=\"trash_font_awesome.svg\">\n  <metadata\n     id=\"metadata3751\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3749\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3747\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3741\" />\n  <g\n     transform=\"matrix(1,0,0,-1,197.42373,1255.0508)\"\n     id=\"g3743\">\n    <path\n       d=\"M 512,800 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 256,0 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z m 256,0 V 224 q 0,-14 -9,-23 -9,-9 -23,-9 h -64 q -14,0 -23,9 -9,9 -9,23 v 576 q 0,14 9,23 9,9 23,9 h 64 q 14,0 23,-9 9,-9 9,-23 z M 1152,76 v 948 H 256 V 76 Q 256,54 263,35.5 270,17 277.5,8.5 285,0 288,0 h 832 q 3,0 10.5,8.5 7.5,8.5 14.5,27 7,18.5 7,40.5 z M 480,1152 h 448 l -48,117 q -7,9 -17,11 H 546 q -10,-2 -17,-11 z m 928,-32 v -64 q 0,-14 -9,-23 -9,-9 -23,-9 h -96 V 76 q 0,-83 -47,-143.5 -47,-60.5 -113,-60.5 H 288 q -66,0 -113,58.5 Q 128,-11 128,72 v 952 H 32 q -14,0 -23,9 -9,9 -9,23 v 64 q 0,14 9,23 9,9 23,9 h 309 l 70,167 q 15,37 54,63 39,26 79,26 h 320 q 40,0 79,-26 39,-26 54,-63 l 70,-167 h 309 q 14,0 23,-9 9,-9 9,-23 z\"\n       id=\"path3745\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "wikicommons": "http://upload.wikimedia.org/wikipedia/commons/7/7d/Trash_font_awesome.svg"
    },
    "edit": {
        "name": "fa-edit-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE4NTAgMTg1MCIKICAgaWQ9InN2ZzMwMjUiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzQvNGMvRWRpdF9mb250X2F3ZXNvbWUuc3ZnIgogICBzb2RpcG9kaTpkb2NuYW1lPSJlZGl0X2ZvbnRfYXdlc29tZS5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMwMzUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzMDMzIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iNjQwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjQ4MCIKICAgICBpZD0ibmFtZWR2aWV3MzAzMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4xMzE2OTY0MyIKICAgICBpbmtzY2FwZTpjeD0iODk2IgogICAgIGlua3NjYXBlOmN5PSI4OTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMzAyNSIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDMwLjM3Mjg4MSwxMzczLjc5NjYpIgogICAgIGlkPSJnMzAyNyI+CiAgICA8cGF0aAogICAgICAgZD0iTSA4ODgsMzUyIDEwMDQsNDY4IDg1Miw2MjAgNzM2LDUwNCB2IC01NiBoIDk2IHYgLTk2IGggNTYgeiBtIDQ0MCw3MjAgcSAtMTYsMTYgLTMzLC0xIEwgOTQ1LDcyMSBxIC0xNywtMTcgLTEsLTMzIDE2LC0xNiAzMywxIGwgMzUwLDM1MCBxIDE3LDE3IDEsMzMgeiBtIDgwLC01OTQgViAyODggUSAxNDA4LDE2OSAxMzIzLjUsODQuNSAxMjM5LDAgMTEyMCwwIEggMjg4IFEgMTY5LDAgODQuNSw4NC41IDAsMTY5IDAsMjg4IHYgODMyIFEgMCwxMjM5IDg0LjUsMTMyMy41IDE2OSwxNDA4IDI4OCwxNDA4IGggODMyIHEgNjMsMCAxMTcsLTI1IDE1LC03IDE4LC0yMyAzLC0xNyAtOSwtMjkgbCAtNDksLTQ5IHEgLTE0LC0xNCAtMzIsLTggLTIzLDYgLTQ1LDYgSCAyODggcSAtNjYsMCAtMTEzLC00NyAtNDcsLTQ3IC00NywtMTEzIFYgMjg4IHEgMCwtNjYgNDcsLTExMyA0NywtNDcgMTEzLC00NyBoIDgzMiBxIDY2LDAgMTEzLDQ3IDQ3LDQ3IDQ3LDExMyB2IDEyNiBxIDAsMTMgOSwyMiBsIDY0LDY0IHEgMTUsMTUgMzUsNyAyMCwtOCAyMCwtMjkgeiBNIDEzMTIsMTIxNiAxNjAwLDkyOCA5MjgsMjU2IEggNjQwIHYgMjg4IHogbSA0NDQsLTEzMiAtOTIsLTkyIC0yODgsMjg4IDkyLDkyIHEgMjgsMjggNjgsMjggNDAsMCA2OCwtMjggbCAxNTIsLTE1MiBxIDI4LC0yOCAyOCwtNjggMCwtNDAgLTI4LC02OCB6IgogICAgICAgaWQ9InBhdGgzMDI5IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAiIC8+CiAgPC9nPgo8L3N2Zz4K",
        "license": "CC BY-SA 3.0",
        "group": "other",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1850 1850\"\n   id=\"svg3025\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/4/4c/Edit_font_awesome.svg\"\n   sodipodi:docname=\"edit_font_awesome.svg\">\n  <metadata\n     id=\"metadata3035\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3033\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3031\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3025\" />\n  <g\n     transform=\"matrix(1,0,0,-1,30.372881,1373.7966)\"\n     id=\"g3027\">\n    <path\n       d=\"M 888,352 1004,468 852,620 736,504 v -56 h 96 v -96 h 56 z m 440,720 q -16,16 -33,-1 L 945,721 q -17,-17 -1,-33 16,-16 33,1 l 350,350 q 17,17 1,33 z m 80,-594 V 288 Q 1408,169 1323.5,84.5 1239,0 1120,0 H 288 Q 169,0 84.5,84.5 0,169 0,288 v 832 Q 0,1239 84.5,1323.5 169,1408 288,1408 h 832 q 63,0 117,-25 15,-7 18,-23 3,-17 -9,-29 l -49,-49 q -14,-14 -32,-8 -23,6 -45,6 H 288 q -66,0 -113,-47 -47,-47 -47,-113 V 288 q 0,-66 47,-113 47,-47 113,-47 h 832 q 66,0 113,47 47,47 47,113 v 126 q 0,13 9,22 l 64,64 q 15,15 35,7 20,-8 20,-29 z M 1312,1216 1600,928 928,256 H 640 v 288 z m 444,-132 -92,-92 -288,288 92,92 q 28,28 68,28 40,0 68,-28 l 152,-152 q 28,-28 28,-68 0,-40 -28,-68 z\"\n       id=\"path3029\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "wikicommons": "http://upload.wikimedia.org/wikipedia/commons/4/4c/Edit_font_awesome.svg"
    },
    "add": {
        "name": "plus-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cG9seWdvbiBmaWxsPSIjMDAwIiBwb2ludHM9IjE0LDUgOSw1IDksMCA1LDAgNSw1IDAsNSAwLDkgNSw5IDUsMTQgOSwxNCA5LDkgMTQsOSAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==",
        "license": "CC0",
        "group": "action",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<polygon fill=\"#000\" points=\"14,5 9,5 9,0 5,0 5,5 0,5 0,9 5,9 5,14 9,14 9,9 14,9 \"/>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/plus-black.svg"
  },
    "cancel": {
        "name": "fa-cancel-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzMwMDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zL2QvZGUvUmVtb3ZlX2ZvbnRfYXdlc29tZS5zdmciCiAgIHNvZGlwb2RpOmRvY25hbWU9InJlbW92ZV9mb250X2F3ZXNvbWUuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzMDExIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMzAwOSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjY0MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI0ODAiCiAgICAgaWQ9Im5hbWVkdmlldzMwMDciCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuMTMxNjk2NDMiCiAgICAgaW5rc2NhcGU6Y3g9Ijg5NiIKICAgICBpbmtzY2FwZTpjeT0iODk2IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzMwMDEiIC8+CiAgPGcKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwyMDUuMDE2OTUsMTI2Mi42NDQxKSIKICAgICBpZD0iZzMwMDMiPgogICAgPHBhdGgKICAgICAgIGQ9Im0gMTI5OCwyMTQgcSAwLC00MCAtMjgsLTY4IEwgMTEzNCwxMCBxIC0yOCwtMjggLTY4LC0yOCAtNDAsMCAtNjgsMjggTCA3MDQsMzA0IDQxMCwxMCBxIC0yOCwtMjggLTY4LC0yOCAtNDAsMCAtNjgsMjggTCAxMzgsMTQ2IHEgLTI4LDI4IC0yOCw2OCAwLDQwIDI4LDY4IEwgNDMyLDU3NiAxMzgsODcwIHEgLTI4LDI4IC0yOCw2OCAwLDQwIDI4LDY4IGwgMTM2LDEzNiBxIDI4LDI4IDY4LDI4IDQwLDAgNjgsLTI4IGwgMjk0LC0yOTQgMjk0LDI5NCBxIDI4LDI4IDY4LDI4IDQwLDAgNjgsLTI4IGwgMTM2LC0xMzYgcSAyOCwtMjggMjgsLTY4IDAsLTQwIC0yOCwtNjggTCA5NzYsNTc2IDEyNzAsMjgyIHEgMjgsLTI4IDI4LC02OCB6IgogICAgICAgaWQ9InBhdGgzMDA1IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAiIC8+CiAgPC9nPgo8L3N2Zz4K",
        "license": "CC BY-SA 3.0",
        "group": "action",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg3001\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/d/de/Remove_font_awesome.svg\"\n   sodipodi:docname=\"remove_font_awesome.svg\">\n  <metadata\n     id=\"metadata3011\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3009\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3007\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3001\" />\n  <g\n     transform=\"matrix(1,0,0,-1,205.01695,1262.6441)\"\n     id=\"g3003\">\n    <path\n       d=\"m 1298,214 q 0,-40 -28,-68 L 1134,10 q -28,-28 -68,-28 -40,0 -68,28 L 704,304 410,10 q -28,-28 -68,-28 -40,0 -68,28 L 138,146 q -28,28 -28,68 0,40 28,68 L 432,576 138,870 q -28,28 -28,68 0,40 28,68 l 136,136 q 28,28 68,28 40,0 68,-28 l 294,-294 294,294 q 28,28 68,28 40,0 68,-28 l 136,-136 q 28,-28 28,-68 0,-40 -28,-68 L 976,576 1270,282 q 28,-28 28,-68 z\"\n       id=\"path3005\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "wikicommons": "http://upload.wikimedia.org/wikipedia/commons/d/de/Remove_font_awesome.svg"
    },
    "load":{
        "name": "fa-folder-open-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE5NTAgMTk1MCIKICAgaWQ9InN2ZzMwMDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzMvM2EvRm9sZGVyX29wZW5fYWx0X2ZvbnRfYXdlc29tZS5zdmciCiAgIHNvZGlwb2RpOmRvY25hbWU9ImZvbGRlcl9vcGVuX2FsdF9mb250X2F3ZXNvbWUuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzMDExIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMzAwOSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjY0MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI0ODAiCiAgICAgaWQ9Im5hbWVkdmlldzMwMDciCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuMTMxNjk2NDMiCiAgICAgaW5rc2NhcGU6Y3g9Ijk1NC41IgogICAgIGlua3NjYXBlOmN5PSI4OTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMzAwMSIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDMwLjM3Mjg4MSwxNDQzLjQyMzcpIgogICAgIGlkPSJnMzAwMyI+CiAgICA8cGF0aAogICAgICAgZD0ibSAxNzgxLDYwNSBxIDAsMzUgLTUzLDM1IEggNjQwIFEgNjAwLDY0MCA1NTQuNSw2MTguNSA1MDksNTk3IDQ4Myw1NjYgTCAxODksMjAzIHEgLTE4LC0yNCAtMTgsLTQwIDAsLTM1IDUzLC0zNSBoIDEwODggcSA0MCwwIDg2LDIyIDQ2LDIyIDcxLDUzIGwgMjk0LDM2MyBxIDE4LDIyIDE4LDM5IHogTSA2NDAsNzY4IGggNzY4IHYgMTYwIHEgMCw0MCAtMjgsNjggLTI4LDI4IC02OCwyOCBIIDczNiBxIC00MCwwIC02OCwyOCAtMjgsMjggLTI4LDY4IHYgNjQgcSAwLDQwIC0yOCw2OCAtMjgsMjggLTY4LDI4IEggMjI0IHEgLTQwLDAgLTY4LC0yOCAtMjgsLTI4IC0yOCwtNjggViAzMzEgbCAyNTYsMzE1IHEgNDQsNTMgMTE2LDg3LjUgNzIsMzQuNSAxNDAsMzQuNSB6IE0gMTkwOSw2MDUgcSAwLC02MiAtNDYsLTEyMCBMIDE1NjgsMTIyIFEgMTUyNSw2OSAxNDUyLDM0LjUgMTM3OSwwIDEzMTIsMCBIIDIyNCBRIDEzMiwwIDY2LDY2IDAsMTMyIDAsMjI0IHYgOTYwIHEgMCw5MiA2NiwxNTggNjYsNjYgMTU4LDY2IGggMzIwIHEgOTIsMCAxNTgsLTY2IDY2LC02NiA2NiwtMTU4IHYgLTMyIGggNTQ0IHEgOTIsMCAxNTgsLTY2IDY2LC02NiA2NiwtMTU4IFYgNzY4IGggMTkyIHEgNTQsMCA5OSwtMjQuNSA0NSwtMjQuNSA2NywtNzAuNSAxNSwtMzIgMTUsLTY4IHoiCiAgICAgICBpZD0icGF0aDMwMDUiCiAgICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIgogICAgICAgc3R5bGU9ImZpbGw6IzAwMCIgLz4KICA8L2c+Cjwvc3ZnPgo=",
        "license": "CC BY-SA 3.0",
        "group": "main",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1950 1950\"\n   id=\"svg3001\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/3/3a/Folder_open_alt_font_awesome.svg\"\n   sodipodi:docname=\"folder_open_alt_font_awesome.svg\">\n  <metadata\n     id=\"metadata3011\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3009\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3007\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"954.5\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3001\" />\n  <g\n     transform=\"matrix(1,0,0,-1,30.372881,1443.4237)\"\n     id=\"g3003\">\n    <path\n       d=\"m 1781,605 q 0,35 -53,35 H 640 Q 600,640 554.5,618.5 509,597 483,566 L 189,203 q -18,-24 -18,-40 0,-35 53,-35 h 1088 q 40,0 86,22 46,22 71,53 l 294,363 q 18,22 18,39 z M 640,768 h 768 v 160 q 0,40 -28,68 -28,28 -68,28 H 736 q -40,0 -68,28 -28,28 -28,68 v 64 q 0,40 -28,68 -28,28 -68,28 H 224 q -40,0 -68,-28 -28,-28 -28,-68 V 331 l 256,315 q 44,53 116,87.5 72,34.5 140,34.5 z M 1909,605 q 0,-62 -46,-120 L 1568,122 Q 1525,69 1452,34.5 1379,0 1312,0 H 224 Q 132,0 66,66 0,132 0,224 v 960 q 0,92 66,158 66,66 158,66 h 320 q 92,0 158,-66 66,-66 66,-158 v -32 h 544 q 92,0 158,-66 66,-66 66,-158 V 768 h 192 q 54,0 99,-24.5 45,-24.5 67,-70.5 15,-32 15,-68 z\"\n       id=\"path3005\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "wikicommons": "http://upload.wikimedia.org/wikipedia/commons/3/3a/Folder_open_alt_font_awesome.svg"
    },
    "save": {
        "name": "fa-file-save-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzMwMDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzIvMjAvU2F2ZV9mb250X2F3ZXNvbWUuc3ZnIgogICBzb2RpcG9kaTpkb2NuYW1lPSJzYXZlX2ZvbnRfYXdlc29tZS5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMwMTEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzMDA5IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iNjQwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjQ4MCIKICAgICBpZD0ibmFtZWR2aWV3MzAwNyIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4xMzE2OTY0MyIKICAgICBpbmtzY2FwZTpjeD0iODk2IgogICAgIGlua3NjYXBlOmN5PSI4OTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMzAwMSIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEyOS4wODQ3NSwxMjcwLjIzNzMpIgogICAgIGlkPSJnMzAwMyI+CiAgICA8cGF0aAogICAgICAgZD0ibSAzODQsMCBoIDc2OCBWIDM4NCBIIDM4NCBWIDAgeiBtIDg5NiwwIGggMTI4IHYgODk2IHEgMCwxNCAtMTAsMzguNSAtMTAsMjQuNSAtMjAsMzQuNSBsIC0yODEsMjgxIHEgLTEwLDEwIC0zNCwyMCAtMjQsMTAgLTM5LDEwIFYgODY0IHEgMCwtNDAgLTI4LC02OCAtMjgsLTI4IC02OCwtMjggSCAzNTIgcSAtNDAsMCAtNjgsMjggLTI4LDI4IC0yOCw2OCB2IDQxNiBIIDEyOCBWIDAgaCAxMjggdiA0MTYgcSAwLDQwIDI4LDY4IDI4LDI4IDY4LDI4IGggODMyIHEgNDAsMCA2OCwtMjggMjgsLTI4IDI4LC02OCBWIDAgeiBNIDg5Niw5MjggdiAzMjAgcSAwLDEzIC05LjUsMjIuNSAtOS41LDkuNSAtMjIuNSw5LjUgSCA2NzIgcSAtMTMsMCAtMjIuNSwtOS41IFEgNjQwLDEyNjEgNjQwLDEyNDggViA5MjggcSAwLC0xMyA5LjUsLTIyLjUgUSA2NTksODk2IDY3Miw4OTYgaCAxOTIgcSAxMywwIDIyLjUsOS41IDkuNSw5LjUgOS41LDIyLjUgeiBtIDY0MCwtMzIgViAtMzIgcSAwLC00MCAtMjgsLTY4IC0yOCwtMjggLTY4LC0yOCBIIDk2IHEgLTQwLDAgLTY4LDI4IC0yOCwyOCAtMjgsNjggdiAxMzQ0IHEgMCw0MCAyOCw2OCAyOCwyOCA2OCwyOCBoIDkyOCBxIDQwLDAgODgsLTIwIDQ4LC0yMCA3NiwtNDggbCAyODAsLTI4MCBxIDI4LC0yOCA0OCwtNzYgMjAsLTQ4IDIwLC04OCB6IgogICAgICAgaWQ9InBhdGgzMDA1IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAiIC8+CiAgPC9nPgo8L3N2Zz4K",
        "license": "CC BY-SA 3.0",
        "group": "other",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg3001\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/2/20/Save_font_awesome.svg\"\n   sodipodi:docname=\"save_font_awesome.svg\">\n  <metadata\n     id=\"metadata3011\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3009\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3007\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3001\" />\n  <g\n     transform=\"matrix(1,0,0,-1,129.08475,1270.2373)\"\n     id=\"g3003\">\n    <path\n       d=\"m 384,0 h 768 V 384 H 384 V 0 z m 896,0 h 128 v 896 q 0,14 -10,38.5 -10,24.5 -20,34.5 l -281,281 q -10,10 -34,20 -24,10 -39,10 V 864 q 0,-40 -28,-68 -28,-28 -68,-28 H 352 q -40,0 -68,28 -28,28 -28,68 v 416 H 128 V 0 h 128 v 416 q 0,40 28,68 28,28 68,28 h 832 q 40,0 68,-28 28,-28 28,-68 V 0 z M 896,928 v 320 q 0,13 -9.5,22.5 -9.5,9.5 -22.5,9.5 H 672 q -13,0 -22.5,-9.5 Q 640,1261 640,1248 V 928 q 0,-13 9.5,-22.5 Q 659,896 672,896 h 192 q 13,0 22.5,9.5 9.5,9.5 9.5,22.5 z m 640,-32 V -32 q 0,-40 -28,-68 -28,-28 -68,-28 H 96 q -40,0 -68,28 -28,28 -28,68 v 1344 q 0,40 28,68 28,28 68,28 h 928 q 40,0 88,-20 48,-20 76,-48 l 280,-280 q 28,-28 48,-76 20,-48 20,-88 z\"\n       id=\"path3005\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "wikicommons": "http://upload.wikimedia.org/wikipedia/commons/2/20/Save_font_awesome.svg"
    },
    "moveup": {
        "name": "arrow-u-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cG9seWdvbiBmaWxsPSIjMDAwIiBwb2ludHM9IjcsMCAwLDcgNSw3IDUsMTQgOSwxNCA5LDcgMTQsNyAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==",
        "license": "CC0",
        "group": "arrow",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<polygon fill=\"#000\" points=\"7,0 0,7 5,7 5,14 9,14 9,7 14,7 \"/>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/arrow-u-black.svg"
    },
    "movedown": {
      "name": "arrow-d-black.svg",
      "path": "img/icons-svg",
      "used": false,
      "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cG9seWdvbiBzdHlsZT0iZmlsbDojMDAwMDAwOyIgcG9pbnRzPSI5LDcgOSwwIDUsMCA1LDcgMCw3IDcsMTQgMTQsNyAiLz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==",
      "license": "CC0",
      "group": "arrow",
      "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<polygon style=\"fill:#000000;\" points=\"9,7 9,0 5,0 5,7 0,7 7,14 14,7 \"/>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
      "icon_source": "http://jquerymobile.com/download/",
      "url": "http://niebert.github.io/icons4menu/img/icons-svg/arrow-d-black.svg"
    },
    "brush": {
        "name": "brush-paint-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PHN2ZwogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIKICB2ZXJzaW9uPSIxLjAiCiAgeD0iMHB4IgogIHk9IjBweCIKICB2aWV3Qm94PSIwIDAgMjQgMjQiCiAgd2lraWNvbW1vbnM9Imh0dHBzOi8vdXBsb2FkLndpa2ltZWRpYS5vcmcvd2lraXBlZGlhL2NvbW1vbnMvZi9mZC9CcnVzaF8tX1RoZV9Ob3VuX1Byb2plY3Quc3ZnIgogIHdpZHRoPSIxNHB4IgogIGhlaWdodD0iMTRweCIKICBpY29uZ3JvdXA9ImVkaXRvciIKICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyNCAyNCIKICB4bWw6c3BhY2U9InByZXNlcnZlIgogIGljb25saWNlbnNlPSJDQzAiPgogIDxyZWN0IHg9IjEwLjgiIHk9IjcuOSIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MDcxIDAuNzA3MSAtMC43MDcxIDAuNzA3MSAxMS43NTg2IC01LjU1MzMpIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiB3aWR0aD0iMy42IiBoZWlnaHQ9IjciPjwvcmVjdD4KICA8cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBkPSJNMTAuMSwxOC4xICBjMS4yLTEuMiwxLjItMy4xLDAtNC4ycy0zLjEtMS4yLTQuMiwwUzMsMjEsMywyMVM4LjksMTkuMywxMC4xLDE4LjF6Ij48L3BhdGg+CiAgPHBhdGggZD0iTTEwLjgsMTguMWMwLjgtMC44LDAuOC0yLjIsMC0zcy0yLjItMC44LTMsMHMtMiw1LTIsNVM5LjksMTguOSwxMC44LDE4LjF6Ij48L3BhdGg+CiAgPHBhdGggZD0iTTIxLjcsNC45bC0yLjYtMi42Yy0wLjQtMC40LTEtMC40LTEuNCwwbC01LjMsNS4zbDQsNGw1LjMtNS4zQzIyLjEsNS45LDIyLjEsNS4yLDIxLjcsNC45eiI+PC9wYXRoPgo8L3N2Zz4K",
        "license": "CC0",
        "group": "editor",
        "raw": "<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n  version=\"1.0\"\n  x=\"0px\"\n  y=\"0px\"\n  viewBox=\"0 0 24 24\"\n  wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/f/fd/Brush_-_The_Noun_Project.svg\"\n  width=\"14px\"\n  height=\"14px\"\n  icongroup=\"editor\"\n  enable-background=\"new 0 0 24 24\"\n  xml:space=\"preserve\"\n  iconlicense=\"CC0\">\n  <rect x=\"10.8\" y=\"7.9\" transform=\"matrix(0.7071 0.7071 -0.7071 0.7071 11.7586 -5.5533)\" fill=\"none\" stroke=\"#000000\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke-miterlimit=\"10\" width=\"3.6\" height=\"7\"></rect>\n  <path fill=\"none\" stroke=\"#000000\" stroke-width=\"2\" stroke-linejoin=\"round\" stroke-miterlimit=\"10\" d=\"M10.1,18.1  c1.2-1.2,1.2-3.1,0-4.2s-3.1-1.2-4.2,0S3,21,3,21S8.9,19.3,10.1,18.1z\"></path>\n  <path d=\"M10.8,18.1c0.8-0.8,0.8-2.2,0-3s-2.2-0.8-3,0s-2,5-2,5S9.9,18.9,10.8,18.1z\"></path>\n  <path d=\"M21.7,4.9l-2.6-2.6c-0.4-0.4-1-0.4-1.4,0l-5.3,5.3l4,4l5.3-5.3C22.1,5.9,22.1,5.2,21.7,4.9z\"></path>\n</svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/f/fd/Brush_-_The_Noun_Project.svg",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/brush-paint-black.svg"
    },
    "backgroundcolor":{
        "name": "background-color-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiCiAgdmVyc2lvbj0iMS4xIgogIHdpZHRoPSIxNHB4IgogIGhlaWdodD0iMTRweCIKICBpY29uZ3JvdXA9ImVkaXRvciIKICBpY29ubGljZW5zZT0iQ0MwIgogIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zLzEvMWQvUGFpbnRfQ2FuXy1fVGhlX05vdW5fUHJvamVjdC5zdmciCiAgdmlld0JveD0iMCAwIDEwMCAxMDAiCiAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIKICB4bWw6c3BhY2U9InByZXNlcnZlIgogIHNvdXJjZWZpbGVuYW1lPSJQYWludF9DYW5fLV9UaGVfTm91bl9Qcm9qZWN0LnN2ZyIKICA+CjxnPjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik02OC4xNzgsNTkuMDEzYy0wLjAzNy0wLjI5Mi0wLjA5Mi0wLjU5NC0wLjE1OC0wLjkwNmMtMC4wMzktMC4xODctMC4wODgtMC4zNzktMC4xMzctMC41NzEgICBjLTAuMDQ3LTAuMTc3LTAuMDk4LTAuMzU3LTAuMTUyLTAuNTM4Yy0wLjExMS0wLjM3My0wLjIzOC0wLjc1NC0wLjM4My0xLjE0N2MtMC4wNDQtMC4xMTctMC4wODYtMC4yMzMtMC4xMzMtMC4zNTEgICBjLTAuNTcxLTEuNDc2LTEuMzc3LTMuMDc3LTIuMzg3LTQuNzY0QzY0LjYwMiwyNC40NDksNTUuNjIxLDQuMDAzLDQ0LjE4OCw0LjAwM2MtNS44NTUsMC0xMS4xOTksNS4yMDYtMTUuMDQ4LDE0LjY1OSAgIGMtMS43Myw0LjI0OS0zLjA4NCw5LjE2NS00LjAyOCwxNC40OThMMS4wMTQsNTcuMjU3Yy0zLjM3MywzLjM3MiwxLjk0NiwxNC4xNTksMTEuODc4LDI0LjA5NCAgIGM5LjkzNSw5LjkzMiwyMC43MjEsMTUuMjQ5LDI0LjA5NCwxMS44NzZsMzAuMjU3LTMwLjI1NWMwLjE4OS0wLjE4OSwwLjM0Mi0wLjQwOSwwLjQ3Ny0wLjY0NGMwLjAyNy0wLjA0NSwwLjA1NS0wLjA4OCwwLjA3OC0wLjEzNSAgIGMwLjExNy0wLjIzLDAuMjEyLTAuNDc4LDAuMjgzLTAuNzQ0YzAuMDE4LTAuMDY3LDAuMDI5LTAuMTM2LDAuMDQ1LTAuMjA2YzAuMDU1LTAuMjUzLDAuMDk2LTAuNTIxLDAuMTExLTAuODA0ICAgYzAuMDA2LTAuMDgyLDAuMDA2LTAuMTY2LDAuMDA4LTAuMjQ5YzAuMDA0LTAuMjUxLTAuMDA4LTAuNTE0LTAuMDI5LTAuNzg1QzY4LjIwMyw1OS4yNzUsNjguMTkzLDU5LjE0Nyw2OC4xNzgsNTkuMDEzeiAgICBNMjUuNTc2LDU4LjY5OWMtMy4yNzYsMC01LjkzNS0yLjY1Ni01LjkzNS01LjkzNGMwLTIuNTk1LDEuNjY4LTQuNzk1LDMuOTg5LTUuNjAxYy0wLjA2LDEuNTE1LTAuMDksMy4wNDQtMC4wOSw0LjU4NSAgIGMwLDEuMTI2LDAuOTEyLDIuMDM4LDIuMDM4LDIuMDM4YzEuMTI1LDAsMi4wMzgtMC45MTIsMi4wMzgtMi4wMzhjMC0xLjUxOSwwLjAzMS0zLjAyNywwLjA5LTQuNTE5ICAgYzIuMjI1LDAuODU2LDMuODA3LDMuMDA5LDMuODA3LDUuNTM0QzMxLjUxMiw1Ni4wNDMsMjguODU0LDU4LjY5OSwyNS41NzYsNTguNjk5eiBNMzIuMTc3LDI2LjM5NiAgIGMtMC4wMiwwLjAxLTAuMDM4LDAuMDItMC4wNTgsMC4wMjdjLTAuMzE0LDAuMTU1LTAuNjA3LDAuMzM0LTAuODQ5LDAuNTc2bC0wLjg0NywwLjg0OWMwLjcwOC0yLjczNywxLjUzNy01LjMwNywyLjQ5MS03LjY0OSAgIGMzLjEzNi03LjcwNCw3LjI0NS0xMi4xMiwxMS4yNzMtMTIuMTJjNy4yNTUsMCwxNC45NzUsMTQuNDEzLDE2LjM1NywzNi41NTljLTAuMDAzLTAuMDA0LTAuMDA2LTAuMDA3LTAuMDA4LTAuMDEyICAgYy0wLjE3NS0wLjIxNi0wLjM1OS0wLjQzMy0wLjU0MS0wLjY0OWMtMC4yODQtMC4zNDUtMC41NzItMC42OTEtMC44Ny0xLjAzOGMtMC4yMDMtMC4yMzYtMC40MTEtMC40NzMtMC42MjItMC43MTEgICBjLTAuMzE1LTAuMzU5LTAuNjM5LTAuNzE3LTAuOTctMS4wNzZjLTAuMTgzLTAuMi0wLjM2NC0wLjQtMC41NTItMC41OTljLTAuNTI1LTAuNTYtMS4wNjItMS4xMTgtMS42MTgtMS42NzQgICBjLTEuMTM5LTEuMTM5LTIuMjg4LTIuMjA5LTMuNDM3LTMuMjJjLTAuMDA1LTAuMDA1LTAuMDEtMC4wMS0wLjAxNS0wLjAxNGMtMC4wODctMC4wNzctMC4xNzMtMC4xNTEtMC4yNjEtMC4yMjUgICBjLTAuNjEzLTAuNTM1LTEuMjI1LTEuMDUyLTEuODM0LTEuNTQ2Yy0wLjA3NC0wLjA2Mi0wLjE0OC0wLjEyNC0wLjIyMi0wLjE4NGMtMC4wMDIsMC0wLjAwNC0wLjAwMS0wLjAwNS0wLjAwMyAgIGMtMC41NzYtMC40NjItMS4xNDktMC45MTEtMS43MTktMS4zMzhjLTAuMDI2LTAuMDE4LTAuMDUyLTAuMDM2LTAuMDc3LTAuMDU2Yy0wLjAwNi0wLjAwNC0wLjAxMS0wLjAwNy0wLjAxNy0wLjAxMSAgIGMtMS4xNzMtMC44NzYtMi4zMjUtMS42NjMtMy40NS0yLjM2OWMtMC4xMDUtMC4wNjgtMC4yMTItMC4xMzQtMC4zMTYtMC4xOTljLTAuMDAxLDAtMC4wMDEsMC0wLjAwMi0wLjAwMSAgIGMtMC4zOTItMC4yNDEtMC43NzctMC40NjktMS4xNTgtMC42ODhjMCwwLTAuMDAxLTAuMDAxLTAuMDAyLTAuMDAyYy0wLjE0NS0wLjA4Mi0wLjI5LTAuMTctMC40MzQtMC4yNSAgIGMtMC4wMDEsMC0wLjAwNC0wLjAwMS0wLjAwNC0wLjAwMmMtMC41MzQtMC4yOTYtMS4wNTctMC41NzMtMS41NjgtMC44MjZjLTAuMDQtMC4wMTctMC4wOC0wLjAzNS0wLjExOS0wLjA1NCAgIGMtMC4wMDUtMC4wMDItMC4wMDktMC4wMDUtMC4wMTQtMC4wMDZjLTAuNDM3LTAuMjEzLTAuODY2LTAuNDA5LTEuMjg2LTAuNTg2Yy0wLjAwMS0wLjAwMS0wLjAwMi0wLjAwMi0wLjAwNS0wLjAwNCAgIGMtMC4xMS0wLjA0NS0wLjIxOC0wLjA4OC0wLjMyNi0wLjEzMWMtMC4zNjctMC4xNDktMC43MjYtMC4yODUtMS4wNzctMC40MDhjLTAuMDAxLDAtMC4wMDQtMC4wMDEtMC4wMDYtMC4wMDIgICBjLTAuMTUxLTAuMDUyLTAuMzAyLTAuMTAzLTAuNDUxLTAuMTUxYy0wLjMyNS0wLjEwMy0wLjYzOC0wLjE4OS0wLjk0Ni0wLjI2NmMtMC4xMTQtMC4wMy0wLjIzMi0wLjA2NC0wLjM0Mi0wLjA4OSAgIGMwLDAtMC4wMDEsMC0wLjAwMS0wLjAwMWMtMC43NTItMC4xNjYtMS40NTItMC4yNTgtMi4wODYtMC4yNThjLTAuMTA0LDAtMC4xOTcsMC4wMTUtMC4yOTcsMC4wMiAgIGMtMC4wNjcsMC4wMDUtMC4xMzUsMC4wMS0wLjIwMiwwLjAxNWMwLDAtMC4wMDEsMC0wLjAwNCwwYy0wLjU2MiwwLjA0Ni0xLjA2NSwwLjE3LTEuNTA1LDAuMzc1SDMyLjE3N3ogTTY1LjgwMSw2MS41MzIgICBjLTAuMzQ2LDAuMzQ0LTAuOTkyLDAuNDE2LTEuNDc1LDAuNDE2Yy0zLjU4NSwwLTExLjI4OS0zLjg0Ny0xOS43MzYtMTIuMjk2Yy00LjY1LTQuNjUtOC4zOTUtOS42MS0xMC41NDQtMTMuOTY1ICAgYy0xLjk1Ny0zLjk3LTIuMDgtNi41LTEuMzM1LTcuMjQ2YzAuMzQ0LTAuMzQ1LDAuOTkyLTAuNDE3LDEuNDc3LTAuNDE3YzMuNTg0LDAsMTEuMjg4LDMuODQ5LDE5LjczNiwxMi4yOTUgICBjMC42MjcsMC42MjgsMS4yMzYsMS4yNjEsMS44MjgsMS44OTdjMC4wOTcsMC4xMDQsMC4xODgsMC4yMDksMC4yODMsMC4zMTVjMC41MDgsMC41NTIsMS4wMDYsMS4xMDcsMS40ODUsMS42NjQgICBjMC4wNTQsMC4wNjIsMC4xMDQsMC4xMjMsMC4xNTcsMC4xODZjMC41MjMsMC42MTIsMS4wMzEsMS4yMjQsMS41MTYsMS44MzRjMC4wMDgsMC4wMTEsMC4wMTgsMC4wMjIsMC4wMjUsMC4wMzQgICBjMC41MTgsMC42NTMsMS4wMTQsMS4zMDYsMS40ODUsMS45NTJjMS4yOTMsMS43NzcsMi40LDMuNTIzLDMuMjg4LDUuMTk1YzAuMTU5LDAuMjk3LDAuMzI5LDAuNTk4LDAuNDczLDAuODkxICAgQzY2LjQyMiw1OC4yNTcsNjYuNTQ3LDYwLjc4Niw2NS44MDEsNjEuNTMyeiI+CjwvcGF0aD4KPHBhdGggZmlsbD0iIzAwMCIgZD0iTTk5LjkzNiw2OC4wMTRjLTAuMzI4LTMuMDA3LTEuOTUxLTkuNDgyLTcuOTI0LTEzLjk4NGMtNi4yOTUtNC42NDUtMTIuMDktNC4yNTYtMTUuMTI3LTMuOTI1ICAgYzQuMTYyLDUuNDI1LDMuNDY3LDExLjI2NSwxLjk2MywxNC44MmMtMC43MDUsMS42NzEtMS4wMDgsMy41MzgtMC43OTcsNS40NzNjMC42NTgsNi4wNDIsNi4wODgsMTAuNDA3LDEyLjEzMyw5Ljc1MSAgIEM5Ni4yMjcsNzkuNDg5LDEwMC41OTIsNzQuMDU3LDk5LjkzNiw2OC4wMTR6Ij48L3BhdGg+PC9nPjwvc3ZnPgo=",
        "license": "CC0",
        "group": "editor",
        "raw": "<svg xmlns=\"http://www.w3.org/2000/svg\"\n  xmlns:xlink=\"http://www.w3.org/1999/xlink\"\n  version=\"1.1\"\n  width=\"14px\"\n  height=\"14px\"\n  icongroup=\"editor\"\n  iconlicense=\"CC0\"\n  wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/1/1d/Paint_Can_-_The_Noun_Project.svg\"\n  viewBox=\"0 0 100 100\"\n  enable-background=\"new 0 0 100 100\"\n  xml:space=\"preserve\"\n  sourcefilename=\"Paint_Can_-_The_Noun_Project.svg\"\n  >\n<g><path fill=\"#000\" d=\"M68.178,59.013c-0.037-0.292-0.092-0.594-0.158-0.906c-0.039-0.187-0.088-0.379-0.137-0.571   c-0.047-0.177-0.098-0.357-0.152-0.538c-0.111-0.373-0.238-0.754-0.383-1.147c-0.044-0.117-0.086-0.233-0.133-0.351   c-0.571-1.476-1.377-3.077-2.387-4.764C64.602,24.449,55.621,4.003,44.188,4.003c-5.855,0-11.199,5.206-15.048,14.659   c-1.73,4.249-3.084,9.165-4.028,14.498L1.014,57.257c-3.373,3.372,1.946,14.159,11.878,24.094   c9.935,9.932,20.721,15.249,24.094,11.876l30.257-30.255c0.189-0.189,0.342-0.409,0.477-0.644c0.027-0.045,0.055-0.088,0.078-0.135   c0.117-0.23,0.212-0.478,0.283-0.744c0.018-0.067,0.029-0.136,0.045-0.206c0.055-0.253,0.096-0.521,0.111-0.804   c0.006-0.082,0.006-0.166,0.008-0.249c0.004-0.251-0.008-0.514-0.029-0.785C68.203,59.275,68.193,59.147,68.178,59.013z    M25.576,58.699c-3.276,0-5.935-2.656-5.935-5.934c0-2.595,1.668-4.795,3.989-5.601c-0.06,1.515-0.09,3.044-0.09,4.585   c0,1.126,0.912,2.038,2.038,2.038c1.125,0,2.038-0.912,2.038-2.038c0-1.519,0.031-3.027,0.09-4.519   c2.225,0.856,3.807,3.009,3.807,5.534C31.512,56.043,28.854,58.699,25.576,58.699z M32.177,26.396   c-0.02,0.01-0.038,0.02-0.058,0.027c-0.314,0.155-0.607,0.334-0.849,0.576l-0.847,0.849c0.708-2.737,1.537-5.307,2.491-7.649   c3.136-7.704,7.245-12.12,11.273-12.12c7.255,0,14.975,14.413,16.357,36.559c-0.003-0.004-0.006-0.007-0.008-0.012   c-0.175-0.216-0.359-0.433-0.541-0.649c-0.284-0.345-0.572-0.691-0.87-1.038c-0.203-0.236-0.411-0.473-0.622-0.711   c-0.315-0.359-0.639-0.717-0.97-1.076c-0.183-0.2-0.364-0.4-0.552-0.599c-0.525-0.56-1.062-1.118-1.618-1.674   c-1.139-1.139-2.288-2.209-3.437-3.22c-0.005-0.005-0.01-0.01-0.015-0.014c-0.087-0.077-0.173-0.151-0.261-0.225   c-0.613-0.535-1.225-1.052-1.834-1.546c-0.074-0.062-0.148-0.124-0.222-0.184c-0.002,0-0.004-0.001-0.005-0.003   c-0.576-0.462-1.149-0.911-1.719-1.338c-0.026-0.018-0.052-0.036-0.077-0.056c-0.006-0.004-0.011-0.007-0.017-0.011   c-1.173-0.876-2.325-1.663-3.45-2.369c-0.105-0.068-0.212-0.134-0.316-0.199c-0.001,0-0.001,0-0.002-0.001   c-0.392-0.241-0.777-0.469-1.158-0.688c0,0-0.001-0.001-0.002-0.002c-0.145-0.082-0.29-0.17-0.434-0.25   c-0.001,0-0.004-0.001-0.004-0.002c-0.534-0.296-1.057-0.573-1.568-0.826c-0.04-0.017-0.08-0.035-0.119-0.054   c-0.005-0.002-0.009-0.005-0.014-0.006c-0.437-0.213-0.866-0.409-1.286-0.586c-0.001-0.001-0.002-0.002-0.005-0.004   c-0.11-0.045-0.218-0.088-0.326-0.131c-0.367-0.149-0.726-0.285-1.077-0.408c-0.001,0-0.004-0.001-0.006-0.002   c-0.151-0.052-0.302-0.103-0.451-0.151c-0.325-0.103-0.638-0.189-0.946-0.266c-0.114-0.03-0.232-0.064-0.342-0.089   c0,0-0.001,0-0.001-0.001c-0.752-0.166-1.452-0.258-2.086-0.258c-0.104,0-0.197,0.015-0.297,0.02   c-0.067,0.005-0.135,0.01-0.202,0.015c0,0-0.001,0-0.004,0c-0.562,0.046-1.065,0.17-1.505,0.375H32.177z M65.801,61.532   c-0.346,0.344-0.992,0.416-1.475,0.416c-3.585,0-11.289-3.847-19.736-12.296c-4.65-4.65-8.395-9.61-10.544-13.965   c-1.957-3.97-2.08-6.5-1.335-7.246c0.344-0.345,0.992-0.417,1.477-0.417c3.584,0,11.288,3.849,19.736,12.295   c0.627,0.628,1.236,1.261,1.828,1.897c0.097,0.104,0.188,0.209,0.283,0.315c0.508,0.552,1.006,1.107,1.485,1.664   c0.054,0.062,0.104,0.123,0.157,0.186c0.523,0.612,1.031,1.224,1.516,1.834c0.008,0.011,0.018,0.022,0.025,0.034   c0.518,0.653,1.014,1.306,1.485,1.952c1.293,1.777,2.4,3.523,3.288,5.195c0.159,0.297,0.329,0.598,0.473,0.891   C66.422,58.257,66.547,60.786,65.801,61.532z\">\n</path>\n<path fill=\"#000\" d=\"M99.936,68.014c-0.328-3.007-1.951-9.482-7.924-13.984c-6.295-4.645-12.09-4.256-15.127-3.925   c4.162,5.425,3.467,11.265,1.963,14.82c-0.705,1.671-1.008,3.538-0.797,5.473c0.658,6.042,6.088,10.407,12.133,9.751   C96.227,79.489,100.592,74.057,99.936,68.014z\"></path></g></svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/1/1d/Paint_Can_-_The_Noun_Project.svg",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/background-color-black.svg"
    },
    "eye": {
        "name": "eye-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNNywyQzMsMiwwLDcsMCw3czMsNSw3LDVzNy01LDctNVMxMSwyLDcsMnogTTcsMTBjLTEuNjU3LDAtMy0xLjM0NC0zLTNjMC0xLjY1NywxLjM0My0zLDMtM3MzLDEuMzQzLDMsMwoJQzEwLDguNjU2LDguNjU3LDEwLDcsMTB6IE03LDZDNi40NDgsNiw2LDYuNDQ3LDYsN2MwLDAuNTUzLDAuNDQ4LDEsMSwxczEtMC40NDcsMS0xQzgsNi40NDcsNy41NTIsNiw3LDZ6Ii8+Cjwvc3ZnPgo=",
        "license": "CC0",
        "group": "other",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path fill=\"#000\" d=\"M7,2C3,2,0,7,0,7s3,5,7,5s7-5,7-5S11,2,7,2z M7,10c-1.657,0-3-1.344-3-3c0-1.657,1.343-3,3-3s3,1.343,3,3\n\tC10,8.656,8.657,10,7,10z M7,6C6.448,6,6,6.447,6,7c0,0.553,0.448,1,1,1s1-0.447,1-1C8,6.447,7.552,6,7,6z\"/>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/eye-black.svg"
    },
    "settings":{
        "name": "gear-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTMuNjIxLDUuOTA0bC0xLjAzNi0wLjI1OWMtMC4xNjgtMC4wNDItMC4zMDMtMC4xNjgtMC4zNTUtMC4zMzJjLTAuMDkyLTAuMjg0LTAuMjA1LTAuNTU5LTAuMzM5LTAuODIKCWMtMC4wNzktMC4xNTMtMC4wNzMtMC4zMzcsMC4wMTctMC40ODZsMC41NDktMC45MTVjMC4xMTgtMC4xOTYsMC4wODgtMC40NDgtMC4wNzUtMC42MWwtMC44NjItMC44NjMKCWMtMC4xNjItMC4xNjMtMC40MTQtMC4xOTMtMC42MTEtMC4wNzVsLTAuOTE2LDAuNTVDOS44NDQsMi4xODIsOS42NTksMi4xODgsOS41MDYsMi4xMDlDOS4yNDQsMS45NzUsOC45NywxLjg2MSw4LjY4NiwxLjc3CgljLTAuMTY1LTAuMDUyLTAuMjktMC4xODctMC4zMzItMC4zNTRMOC4wOTUsMC4zNzlDOC4wMzksMC4xNTYsNy44MzksMCw3LjYwOSwwSDYuMzkxYy0wLjIyOSwwLTAuNDMsMC4xNTYtMC40ODUsMC4zNzlMNS42NDYsMS40MTUKCUM1LjYwNCwxLjU4Miw1LjQ3OSwxLjcxOCw1LjMxMywxLjc3Yy0wLjI4NCwwLjA5Mi0wLjU1OSwwLjIwNi0wLjgyLDAuMzRDNC4zMzksMi4xODgsNC4xNTUsMi4xODIsNC4wMDcsMi4wOTNMMy4wOTIsMS41NDQKCWMtMC4xOTYtMC4xMTgtMC40NDgtMC4wODctMC42MSwwLjA3NUwxLjYxOSwyLjQ4MUMxLjQ1NywyLjY0NCwxLjQyNiwyLjg5NiwxLjU0NCwzLjA5M2wwLjU0OSwwLjkxNAoJYzAuMDg5LDAuMTQ4LDAuMDk1LDAuMzMyLDAuMDE3LDAuNDg2QzEuOTc1LDQuNzU1LDEuODYxLDUuMDI5LDEuNzcsNS4zMTRjLTAuMDUzLDAuMTY0LTAuMTg4LDAuMjktMC4zNTQsMC4zMzJMMC4zNzksNS45MDUKCUMwLjE1Niw1Ljk2MSwwLDYuMTYxLDAsNi4zOTF2MS4yMTljMCwwLjIyOSwwLjE1NiwwLjQzLDAuMzc5LDAuNDg1bDEuMDM2LDAuMjZDMS41ODIsOC4zOTYsMS43MTcsOC41MjEsMS43Nyw4LjY4NwoJYzAuMDkyLDAuMjg0LDAuMjA1LDAuNTU5LDAuMzQsMC44MkMyLjE4OCw5LjY2LDIuMTgyLDkuODQ0LDIuMDkzLDkuOTkzbC0wLjU0OSwwLjkxNWMtMC4xMTgsMC4xOTUtMC4wODcsMC40NDgsMC4wNzUsMC42MQoJbDAuODYyLDAuODYyYzAuMTYyLDAuMTYzLDAuNDE0LDAuMTkzLDAuNjEsMC4wNzVsMC45MTUtMC41NDljMC4xNDgtMC4wODksMC4zMzItMC4wOTUsMC40ODYtMC4wMTcKCWMwLjI2MiwwLjEzNSwwLjUzNiwwLjI0OCwwLjgyLDAuMzRjMC4xNjUsMC4wNTMsMC4yOTEsMC4xODcsMC4zMzIsMC4zNTRsMC4yNTksMS4wMzZDNS45NiwxMy44NDQsNi4xNiwxNCw2LjM5LDE0aDEuMjIKCWMwLjIyOSwwLDAuNDMtMC4xNTYsMC40ODUtMC4zNzlsMC4yNTktMS4wMzZjMC4wNDItMC4xNjcsMC4xNjgtMC4zMDIsMC4zMzMtMC4zNTRjMC4yODQtMC4wOTIsMC41NTktMC4yMDUsMC44Mi0wLjM0CgljMC4xNTQtMC4wNzgsMC4zMzgtMC4wNzIsMC40ODYsMC4wMTdsMC45MTQsMC41NDljMC4xOTcsMC4xMTgsMC40NDksMC4wODgsMC42MTEtMC4wNzRsMC44NjItMC44NjMKCWMwLjE2My0wLjE2MiwwLjE5My0wLjQxNSwwLjA3NS0wLjYxMWwtMC41NDktMC45MTVjLTAuMDg5LTAuMTQ4LTAuMDk2LTAuMzMyLTAuMDE3LTAuNDg1YzAuMTM0LTAuMjYzLDAuMjQ4LTAuNTM2LDAuMzM5LTAuODIKCWMwLjA1My0wLjE2NSwwLjE4OC0wLjI5MSwwLjM1NS0wLjMzM2wxLjAzNi0wLjI1OUMxMy44NDQsOC4wMzksMTQsNy44MzksMTQsNy42MDlWNi4zOUMxNCw2LjE2LDEzLjg0NCw1Ljk2LDEzLjYyMSw1LjkwNHogTTcsMTAKCWMtMS42NTcsMC0zLTEuMzQzLTMtM3MxLjM0My0zLDMtM3MzLDEuMzQzLDMsM1M4LjY1NywxMCw3LDEweiIvPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
        "license": "CC0",
        "group": "other",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path fill=\"#000\" d=\"M13.621,5.904l-1.036-0.259c-0.168-0.042-0.303-0.168-0.355-0.332c-0.092-0.284-0.205-0.559-0.339-0.82\n\tc-0.079-0.153-0.073-0.337,0.017-0.486l0.549-0.915c0.118-0.196,0.088-0.448-0.075-0.61l-0.862-0.863\n\tc-0.162-0.163-0.414-0.193-0.611-0.075l-0.916,0.55C9.844,2.182,9.659,2.188,9.506,2.109C9.244,1.975,8.97,1.861,8.686,1.77\n\tc-0.165-0.052-0.29-0.187-0.332-0.354L8.095,0.379C8.039,0.156,7.839,0,7.609,0H6.391c-0.229,0-0.43,0.156-0.485,0.379L5.646,1.415\n\tC5.604,1.582,5.479,1.718,5.313,1.77c-0.284,0.092-0.559,0.206-0.82,0.34C4.339,2.188,4.155,2.182,4.007,2.093L3.092,1.544\n\tc-0.196-0.118-0.448-0.087-0.61,0.075L1.619,2.481C1.457,2.644,1.426,2.896,1.544,3.093l0.549,0.914\n\tc0.089,0.148,0.095,0.332,0.017,0.486C1.975,4.755,1.861,5.029,1.77,5.314c-0.053,0.164-0.188,0.29-0.354,0.332L0.379,5.905\n\tC0.156,5.961,0,6.161,0,6.391v1.219c0,0.229,0.156,0.43,0.379,0.485l1.036,0.26C1.582,8.396,1.717,8.521,1.77,8.687\n\tc0.092,0.284,0.205,0.559,0.34,0.82C2.188,9.66,2.182,9.844,2.093,9.993l-0.549,0.915c-0.118,0.195-0.087,0.448,0.075,0.61\n\tl0.862,0.862c0.162,0.163,0.414,0.193,0.61,0.075l0.915-0.549c0.148-0.089,0.332-0.095,0.486-0.017\n\tc0.262,0.135,0.536,0.248,0.82,0.34c0.165,0.053,0.291,0.187,0.332,0.354l0.259,1.036C5.96,13.844,6.16,14,6.39,14h1.22\n\tc0.229,0,0.43-0.156,0.485-0.379l0.259-1.036c0.042-0.167,0.168-0.302,0.333-0.354c0.284-0.092,0.559-0.205,0.82-0.34\n\tc0.154-0.078,0.338-0.072,0.486,0.017l0.914,0.549c0.197,0.118,0.449,0.088,0.611-0.074l0.862-0.863\n\tc0.163-0.162,0.193-0.415,0.075-0.611l-0.549-0.915c-0.089-0.148-0.096-0.332-0.017-0.485c0.134-0.263,0.248-0.536,0.339-0.82\n\tc0.053-0.165,0.188-0.291,0.355-0.333l1.036-0.259C13.844,8.039,14,7.839,14,7.609V6.39C14,6.16,13.844,5.96,13.621,5.904z M7,10\n\tc-1.657,0-3-1.343-3-3s1.343-3,3-3s3,1.343,3,3S8.657,10,7,10z\"/>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/gear-black.svg"
    },
    "search": {
        "name": "search-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgkgd2lkdGg9IjE0cHgiIGhlaWdodD0iMTRweCIgdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNMTAuMTcxLDguNzY2YzAuNjE3LTAuODg4LDAuOTc5LTEuOTY0LDAuOTc5LTMuMTI2YzAtMy4wMzctMi40NjMtNS41LTUuNS01LjVzLTUuNSwyLjQ2My01LjUsNS41czIuNDYzLDUuNSw1LjUsNS41CgljMS4xNTIsMCwyLjIyMy0wLjM1NSwzLjEwNC0wLjk2MmwzLjY4NCwzLjY4M2wxLjQxNC0xLjQxNEwxMC4xNzEsOC43NjZ6IE01LjY0OSw5LjE0Yy0xLjkzMywwLTMuNS0xLjU2Ny0zLjUtMy41CgljMC0xLjkzMywxLjU2Ny0zLjUsMy41LTMuNWMxLjkzMywwLDMuNSwxLjU2NywzLjUsMy41QzkuMTQ5LDcuNTcyLDcuNTgyLDkuMTQsNS42NDksOS4xNHoiLz4KPC9zdmc+Cg==",
        "license": "CC0",
        "group": "editor",
        "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\t width=\"14px\" height=\"14px\" viewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path fill=\"#000\" d=\"M10.171,8.766c0.617-0.888,0.979-1.964,0.979-3.126c0-3.037-2.463-5.5-5.5-5.5s-5.5,2.463-5.5,5.5s2.463,5.5,5.5,5.5\n\tc1.152,0,2.223-0.355,3.104-0.962l3.684,3.683l1.414-1.414L10.171,8.766z M5.649,9.14c-1.933,0-3.5-1.567-3.5-3.5\n\tc0-1.933,1.567-3.5,3.5-3.5c1.933,0,3.5,1.567,3.5,3.5C9.149,7.572,7.582,9.14,5.649,9.14z\"/>\n</svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/search-black.svg"
    },
    "backward": {
        "name": "fa-audio-back-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzMwMDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4xIChjZTY2NjNiM2I3LCAyMDIxLTA1LTI1KSIKICAgd2lkdGg9IjE0cHgiCiAgIGhlaWdodD0iMTRweCIKICAgaWNvbmxpY2Vuc2U9IkNDQlkzU0EiCiAgIHdpa2ljb21tb25zPSJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zL2QvZDMvUGxheV9mb250X2F3ZXNvbWUuc3ZnIgogICBzb2RpcG9kaTpkb2NuYW1lPSJmYS1hdWRpby1iYWNrLWJsYWNrLnN2ZyIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMzAxMSI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczMwMDkiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSI4ODQiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNDgwIgogICAgIGlkPSJuYW1lZHZpZXczMDA3IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIwLjEzMTY5NjQzIgogICAgIGlua3NjYXBlOmN4PSI4OTkuNzk2NiIKICAgICBpbmtzY2FwZTpjeT0iODk1Ljk5OTk5IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIzNCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzMwMDEiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0icm90YXRlKDE4MCw3ODAuNTAxNCw2NDIuODAyOTQpIgogICAgIGlkPSJnMzAwMyI+CiAgICA8cGF0aAogICAgICAgZD0iTSAxMzg0LDYwOSA1NiwtMTI5IFEgMzMsLTE0MiAxNi41LC0xMzIgMCwtMTIyIDAsLTk2IHYgMTQ3MiBxIDAsMjYgMTYuNSwzNiAxNi41LDEwIDM5LjUsLTMgTCAxMzg0LDY3MSBxIDIzLC0xMyAyMywtMzEgMCwtMTggLTIzLC0zMSB6IgogICAgICAgaWQ9InBhdGgzMDA1IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAwMDAiIC8+CiAgPC9nPgo8L3N2Zz4K",
        "license": "CCBY3SA",
        "group": "audio",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg3001\"\n   version=\"1.1\"\n   inkscape:version=\"1.1 (ce6663b3b7, 2021-05-25)\"\n   width=\"14px\"\n   height=\"14px\"\n   iconlicense=\"CCBY3SA\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/d/d3/Play_font_awesome.svg\"\n   sodipodi:docname=\"fa-audio-back-black.svg\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\">\n  <metadata\n     id=\"metadata3011\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3009\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"884\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3007\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"899.7966\"\n     inkscape:cy=\"895.99999\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"34\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3001\"\n     inkscape:pagecheckerboard=\"0\" />\n  <g\n     transform=\"rotate(180,780.5014,642.80294)\"\n     id=\"g3003\">\n    <path\n       d=\"M 1384,609 56,-129 Q 33,-142 16.5,-132 0,-122 0,-96 v 1472 q 0,26 16.5,36 16.5,10 39.5,-3 L 1384,671 q 23,-13 23,-31 0,-18 -23,-31 z\"\n       id=\"path3005\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000000\" />\n  </g>\n</svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/d/d3/Play_font_awesome.svg",
        "url": "http://commons.wikimedia.org/wiki/File:Play_font_awesome.svg"
    },
    "fastbackward":{
        "name": "fa-audio-backward-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzIiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIGljb25saWNlbnNlPSJDQ0JZM1NBIgogICB3aWtpY29tbW9ucz0iaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy9jL2M4L0JhY2t3YXJkX2ZvbnRfYXdlc29tZS5zdmciCiAgIHNvZGlwb2RpOmRvY25hbWU9ImJhY2t3YXJkX2ZvbnRfYXdlc29tZS5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTEyIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMTAiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSI2NDAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iNDgwIgogICAgIGlkPSJuYW1lZHZpZXc4IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIwLjEzMTY5NjQzIgogICAgIGlua3NjYXBlOmN4PSI4OTYiCiAgICAgaW5rc2NhcGU6Y3k9Ijg5NiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjUiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIiAvPgogIDxnCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMSwwLDAsLTEsNy41OTMyMjAzLDEyOTMuMDE2OSkiCiAgICAgaWQ9Imc0Ij4KICAgIDxwYXRoCiAgICAgICBkPSJtIDE2MTksMTM5NSBxIDE5LDE5IDMyLDEzIDEzLC02IDEzLC0zMiBWIC05NiBxIDAsLTI2IC0xMywtMzIgLTEzLC02IC0zMiwxMyBMIDkwOSw1OTUgcSAtOCw5IC0xMywxOSBWIC05NiBxIDAsLTI2IC0xMywtMzIgLTEzLC02IC0zMiwxMyBMIDE0MSw1OTUgcSAtMTksMTkgLTE5LDQ1IDAsMjYgMTksNDUgbCA3MTAsNzEwIHEgMTksMTkgMzIsMTMgMTMsLTYgMTMsLTMyIFYgNjY2IHEgNSwxMSAxMywxOSB6IgogICAgICAgaWQ9InBhdGg2IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAiIC8+CiAgPC9nPgo8L3N2Zz4K",
        "license": "CCBY3SA",
        "group": "audio",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg2\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   iconlicense=\"CCBY3SA\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/c/c8/Backward_font_awesome.svg\"\n   sodipodi:docname=\"backward_font_awesome.svg\">\n  <metadata\n     id=\"metadata12\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs10\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview8\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg2\" />\n  <g\n     transform=\"matrix(1,0,0,-1,7.5932203,1293.0169)\"\n     id=\"g4\">\n    <path\n       d=\"m 1619,1395 q 19,19 32,13 13,-6 13,-32 V -96 q 0,-26 -13,-32 -13,-6 -32,13 L 909,595 q -8,9 -13,19 V -96 q 0,-26 -13,-32 -13,-6 -32,13 L 141,595 q -19,19 -19,45 0,26 19,45 l 710,710 q 19,19 32,13 13,-6 13,-32 V 666 q 5,11 13,19 z\"\n       id=\"path6\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/c/c8/Backward_font_awesome.svg",
        "url": "http://commons.wikimedia.org/wiki/File:Backward_font_awesome.svg"
    },
    "forward": {
        "name": "fa-audio-play-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzMwMDEiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIGljb25saWNlbnNlPSJDQ0JZM1NBIgogICB3aWtpY29tbW9ucz0iaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy9kL2QzL1BsYXlfZm9udF9hd2Vzb21lLnN2ZyIKICAgc29kaXBvZGk6ZG9jbmFtZT0icGxheV9mb250X2F3ZXNvbWUuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEzMDExIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMzAwOSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjY0MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSI0ODAiCiAgICAgaWQ9Im5hbWVkdmlldzMwMDciCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuMTMxNjk2NDMiCiAgICAgaW5rc2NhcGU6Y3g9Ijg5NiIKICAgICBpbmtzY2FwZTpjeT0iODk2IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIyNSIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzMwMDEiIC8+CiAgPGcKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwtMSwyMjcuNzk2NjEsMTMwOC4yMDM0KSIKICAgICBpZD0iZzMwMDMiPgogICAgPHBhdGgKICAgICAgIGQ9Ik0gMTM4NCw2MDkgNTYsLTEyOSBRIDMzLC0xNDIgMTYuNSwtMTMyIDAsLTEyMiAwLC05NiB2IDE0NzIgcSAwLDI2IDE2LjUsMzYgMTYuNSwxMCAzOS41LC0zIEwgMTM4NCw2NzEgcSAyMywtMTMgMjMsLTMxIDAsLTE4IC0yMywtMzEgeiIKICAgICAgIGlkPSJwYXRoMzAwNSIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojMDAwIiAvPgogIDwvZz4KPC9zdmc+Cg==",
        "license": "CCBY3SA",
        "group": "audio",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg3001\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   iconlicense=\"CCBY3SA\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/d/d3/Play_font_awesome.svg\"\n   sodipodi:docname=\"play_font_awesome.svg\">\n  <metadata\n     id=\"metadata3011\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3009\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3007\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3001\" />\n  <g\n     transform=\"matrix(1,0,0,-1,227.79661,1308.2034)\"\n     id=\"g3003\">\n    <path\n       d=\"M 1384,609 56,-129 Q 33,-142 16.5,-132 0,-122 0,-96 v 1472 q 0,26 16.5,36 16.5,10 39.5,-3 L 1384,671 q 23,-13 23,-31 0,-18 -23,-31 z\"\n       id=\"path3005\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/d/d3/Play_font_awesome.svg",
        "url": "http://commons.wikimedia.org/wiki/File:Play_font_awesome.svg"
    },
    "fastforward": {
        "name": "fa-audio-forward-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzIiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIGljb25saWNlbnNlPSJDQ0JZM1NBIgogICB3aWtpY29tbW9ucz0iaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy83LzdmL0ZvcndhcmRfZm9udF9hd2Vzb21lLnN2ZyIKICAgc29kaXBvZGk6ZG9jbmFtZT0iZm9yd2FyZF9mb250X2F3ZXNvbWUuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExMiI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczEwIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iNjQwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjQ4MCIKICAgICBpZD0ibmFtZWR2aWV3OCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4xMzE2OTY0MyIKICAgICBpbmtzY2FwZTpjeD0iODk2IgogICAgIGlua3NjYXBlOmN5PSI4OTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iZzQiIC8+CiAgPGcKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxIDAgMCAtMSAwIDE1MzYpIgogICAgIGlkPSJnNCI+CiAgICA8cGF0aAogICAgICAgZD0ibSAxODEuNjc3OTYsMTUwLjc2MjcxIHEgLTE5LC0xOSAtMzIsLTEzIC0xMi45OTk5OSw2IC0xMi45OTk5OSwzMiBWIDE2NDEuNzYyNyBxIDAsMjYgMTIuOTk5OTksMzIgMTMsNiAzMiwtMTMgbCA3MTAsLTcwOS45OTk5OSBxIDgsLTggMTMsLTE5IHYgNzA5Ljk5OTk5IHEgMCwyNiAxMywzMiAxMyw2IDMyLC0xMyBMIDE2NTkuNjc4LDk1MC43NjI3MSBxIDE5LC0xOSAxOSwtNDUgMCwtMjYgLTE5LC00NSBsIC03MTAuMDAwMDQsLTcxMCBxIC0xOSwtMTkgLTMyLC0xMyAtMTMsNiAtMTMsMzIgdiA3MTAgcSAtNSwtMTAgLTEzLC0xOSB6IgogICAgICAgaWQ9InBhdGg2IgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiMwMDAiIC8+CiAgPC9nPgo8L3N2Zz4K",
        "license": "CCBY3SA",
        "group": "audio",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg2\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   iconlicense=\"CCBY3SA\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/7/7f/Forward_font_awesome.svg\"\n   sodipodi:docname=\"forward_font_awesome.svg\">\n  <metadata\n     id=\"metadata12\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs10\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview8\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"g4\" />\n  <g\n     transform=\"matrix(1 0 0 -1 0 1536)\"\n     id=\"g4\">\n    <path\n       d=\"m 181.67796,150.76271 q -19,-19 -32,-13 -12.99999,6 -12.99999,32 V 1641.7627 q 0,26 12.99999,32 13,6 32,-13 l 710,-709.99999 q 8,-8 13,-19 v 709.99999 q 0,26 13,32 13,6 32,-13 L 1659.678,950.76271 q 19,-19 19,-45 0,-26 -19,-45 l -710.00004,-710 q -19,-19 -32,-13 -13,6 -13,32 v 710 q -5,-10 -13,-19 z\"\n       id=\"path6\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/7/7f/Forward_font_awesome.svg",
        "url": "http://commons.wikimedia.org/wiki/File:Forward_font_awesome.svg"
    },
    "globe": {
        "name": "fa-globe-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgdmlld0JveD0iMCAtMjU2IDE3OTIgMTc5MiIKICAgaWQ9InN2ZzMwMjUiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC40OC4zLjEgcjk4ODYiCiAgIHdpZHRoPSIxNHB4IgogICBoZWlnaHQ9IjE0cHgiCiAgIGljb25saWNlbnNlPSJDQ0JZM1NBIgogICB3aWtpY29tbW9ucz0iaHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy84LzhiL0dsb2JlX2ZvbnRfYXdlc29tZS5zdmciCiAgIHNvZGlwb2RpOmRvY25hbWU9Imdsb2JlX2ZvbnRfYXdlc29tZS5zdmciPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTMwMzUiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMzMDMzIiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iNjQwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjQ4MCIKICAgICBpZD0ibmFtZWR2aWV3MzAzMSIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4xMzE2OTY0MyIKICAgICBpbmtzY2FwZTpjeD0iODk2IgogICAgIGlua3NjYXBlOmN5PSI4OTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjI1IgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjAiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMzAyNSIgLz4KICA8ZwogICAgIHRyYW5zZm9ybT0ibWF0cml4KDEsMCwwLC0xLDEzNi42Nzc5NywxMzAwLjYxMDIpIgogICAgIGlkPSJnMzAyNyI+CiAgICA8cGF0aAogICAgICAgZD0ibSAxMTkzLDk5MyBxIDExLDcgMjUsMjIgdiAtMSBxIDAsLTIgLTkuNSwtMTAgLTkuNSwtOCAtMTEuNSwtMTIgLTEsMSAtNCwxIHogbSAtNiwtMSBxIC0xLDEgLTIuNSwzIC0xLjUsMiAtMS41LDMgMywtMiAxMCwtNSAtNiwtNCAtNiwtMSB6IG0gLTQ1OSwxODMgcSAtMTYsMiAtMjYsNSAxLDAgNi41LC0xIDUuNSwtMSAxMC41LC0yIDUsLTEgOSwtMiB6IG0gNDUsMzcgcSA3LDQgMTMuNSwyLjUgNi41LC0xLjUgNy41LC03LjUgLTUsMyAtMjEsNSB6IG0gLTgsLTYgLTMsMiBxIC0yLDMgLTUuNSw1IC0zLjUsMiAtNC41LDIgMiwtMSAyMSwtMyAtNiwtNCAtOCwtNiB6IG0gLTEwMiw4NCB2IDIgcSAxLC0yIDMsLTUuNSAyLC0zLjUgMywtNS41IHogbSAtMTA1LC00MCBxIDAsLTIgLTEsLTIgbCAtMSwyIGggMiB6IE0gOTMzLDIwNiB2IC0xIDEgeiBNIDc2OCwxNDA4IHEgMjA5LDAgMzg1LjUsLTEwMyBRIDEzMzAsMTIwMiAxNDMzLDEwMjUuNSAxNTM2LDg0OSAxNTM2LDY0MCAxNTM2LDQzMSAxNDMzLDI1NC41IDEzMzAsNzggMTE1My41LC0yNSA5NzcsLTEyOCA3NjgsLTEyOCA1NTksLTEyOCAzODIuNSwtMjUgMjA2LDc4IDEwMywyNTQuNSAwLDQzMSAwLDY0MCAwLDg0OSAxMDMsMTAyNS41IDIwNiwxMjAyIDM4Mi41LDEzMDUgNTU5LDE0MDggNzY4LDE0MDggeiBtIDQ3MiwtMTI0NiA1LDUgcSAtNywxMCAtMjksMTIgMSwxMiAtMTQsMjYuNSAtMTUsMTQuNSAtMjcsMTUuNSAwLDQgLTEwLjUsMTEgLTEwLjUsNyAtMTcuNSw4IC05LDIgLTI3LC05IC03LC0zIC00LC01IC0zLDMgLTEyLDExIC05LDggLTE2LDExIC0yLDEgLTcuNSwxIC01LjUsMCAtOC41LDIgLTEsMSAtNiw0LjUgLTUsMy41IC03LDQuNSAtMiwxIC02LjUsMyAtNC41LDIgLTcuNSwxLjUgLTMsLTAuNSAtNy41LC0yLjUgLTQuNSwtMiAtOC41LC02IC00LC00IC00LjUsLTE1LjUgLTAuNSwtMTEuNSAtMi41LC0xNC41IC04LDYgLTAuNSwyMCA3LjUsMTQgMS41LDIwIC03LDcgLTIxLDAuNSAtMTQsLTYuNSAtMjEsLTE1LjUgLTEsLTEgLTkuNSwtNS41IFEgOTYzLDI0MSA5NjAsMjM4IHEgLTQsLTYgLTksLTE3LjUgLTUsLTExLjUgLTYsLTEzLjUgMCwyIC0yLjUsNi41IC0yLjUsNC41IC0yLjUsNi41IC0xMiwtMiAtMTYsMyA1LC0xNiA4LC0xNyBsIC00LDIgcSAtMSwtNiAzLC0xNSA0LC05IDQsLTExIDEsLTUgLTEuNSwtMTMgLTIuNSwtOCAtMi41LC0xMSAwLC0yIDUsLTExIDQsLTE5IC0yLC0zMiAwLC0xIC0zLjUsLTcgLTMuNSwtNiAtNi41LC0xMSBsIC0yLC01IC0yLDEgcSAtMSwxIC0yLDAgLTEsLTYgLTksLTEzIC04LC03IC0xMCwtMTEgLTE1LC0yMyAtOSwtMzggMywtOCAxMCwtMTAgMywtMSAzLDIgMSwtOSAtMTEsLTI3IDEsLTEgNCwtMyAtMTcsMCAtMTAsLTE0IDIwMiwzNiAzNTIsMTgxIGggLTMgeiBNIDY4MCwzNDcgcSAxNiwzIDMwLjUsLTE2IDE0LjUsLTE5IDIyLjUsLTIzIDQxLC0yMCA1OSwtMTEgMCwtOSAxNCwtMjggMywtNCA2LjUsLTExLjUgMy41LC03LjUgNS41LC0xMC41IDUsLTcgMTksLTE2IDE0LC05IDE5LC0xNiA2LDMgOSw5IDEzLC0zNSAyNCwtMzQgNSwwIDgsOCAwLC0xIC0wLjUsLTMgLTAuNSwtMiAtMS41LC0zIDcsMTUgNSwyNiBsIDYsNCBxIDUsNCA1LDUgLTYsNiAtOSwtMyAtMzAsLTE0IC00OCwyMiAtMiwzIC00LjUsOCAtMi41LDUgLTUsMTIgLTIuNSw3IC0xLjUsMTEuNSAxLDQuNSA2LDQuNSAxMSwwIDEyLjUsMS41IDEuNSwxLjUgLTIuNSw2IC00LDQuNSAtNCw3LjUgLTEsNCAtMS41LDEyLjUgUSA4NTMsMzE4IDg1MiwzMjIgbCAtNSw2IHEgLTUsNiAtMTEuNSwxMy41IC02LjUsNy41IC03LjUsOS41IC00LC0xMCAtMTYuNSwtOC41IC0xMi41LDEuNSAtMTguNSw5LjUgMSwtMiAtMC41LC02LjUgLTEuNSwtNC41IC0xLjUsLTYuNSAtMTQsMCAtMTcsMSAxLDYgMywyMSAyLDE1IDQsMjIgMSw1IDUuNSwxMy41IDQuNSw4LjUgOCwxNS41IDMuNSw3IDQuNSwxNCAxLDcgLTQuNSwxMC41IC01LjUsMy41IC0xOC41LDIuNSAtMjAsLTEgLTI5LC0yMiAtMSwtMyAtMywtMTEuNSAtMiwtOC41IC01LC0xMi41IC0zLC00IC05LC03IC04LC0zIC0yNywtMiAtMTksMSAtMjYsNSAtMTQsOCAtMjQsMzAuNSAtMTAsMjIuNSAtMTEsNDEuNSAwLDEwIDMsMjcuNSAzLDE3LjUgMywyNyAwLDkuNSAtNiwyNi41IDMsMiAxMCwxMC41IDcsOC41IDExLDExLjUgMiwyIDUsMiBoIDUgcSAwLDAgNCwyIDQsMiAzLDYgLTEsMSAtNCwzIC0zLDMgLTQsMyA0LC0zIDE5LC0xIDE1LDIgMTksMiAwLDEgMjIsMCAxNywtMTMgMjQsMiAwLDEgLTIuNSwxMC41IC0yLjUsOS41IC0wLjUsMTQuNSA1LC0yOSAzMiwtMTAgMywtNCAxNi41LC02IDEzLjUsLTIgMTguNSwtNSAzLC0yIDcsLTUuNSA0LC0zLjUgNiwtNSAyLC0xLjUgNiwtMC41IDQsMSA5LDcgMTEsLTE3IDEzLC0yNSAxMSwtNDMgMjAsLTQ4IDgsLTIgMTIuNSwtMiA0LjUsMCA1LDEwLjUgMC41LDEwLjUgMCwxNS41IC0wLjUsNSAtMS41LDEzIGwgLTIsMzcgcSAtMTYsMyAtMjAsMTIuNSAtNCw5LjUgMS41LDIwIDUuNSwxMC41IDE2LjUsMTkuNSAxLDEgMTYuNSw4IDE1LjUsNyAyMS41LDEyIDI0LDE5IDE3LDM5IDksLTIgMTEsOSBsIC01LDMgcSAtNCwzIC04LDUuNSAtNCwyLjUgLTUsMS41IDExLDcgMiwxOCA1LDMgOCwxMS41IDMsOC41IDksMTEuNSA5LC0xNCAyMiwtMyA4LDkgMiwxOCA1LDggMjIsMTEuNSAxNywzLjUgMjAsOS41IDUsLTEgNywwIDIsMSAyLDQuNSB2IDcuNSBxIDAsMCAxLDguNSAxLDguNSAzLDcuNSA0LDYgMTYsMTAuNSAxMiw0LjUgMTQsNS41IGwgMTksMTIgcSA0LDQgMCw0IDE4LC0yIDMyLDExIDEzLDEyIC01LDIzIDIsNyAtNCwxMC41IC02LDMuNSAtMTYsNS41IDMsMSAxMiwwLjUgOSwtMC41IDEyLDEuNSAxNSwxMSAtNywxNyAtMjAsNSAtNDcsLTEzIC0zLC0yIC0xMywtMTIgLTEwLC0xMCAtMTcsLTExIDE1LDE4IDUsMjIgOCwtMSAyMi41LDkgMTQuNSwxMCAxNS41LDExIDQsMiAxMC41LDIuNSA2LjUsMC41IDguNSwxLjUgNzEsMjUgOTIsLTEgOCwxMSAxMSwxNSAzLDQgOS41LDkgNi41LDUgMTUuNSw4IDIxLDcgMjMsOSBsIDEsMjMgcSAtMTIsLTEgLTE4LDggLTYsOSAtNywyMiBsIC02LC04IHEgMCw2IC0zLjUsNy41IC0zLjUsMS41IC03LjUsMC41IC00LC0xIC05LjUsLTIgLTUuNSwtMSAtNy41LDAgLTksMiAtMTkuNSwxNS41IC0xMC41LDEzLjUgLTE0LjUsMTYuNSA5LDAgOSw1IC0yLDUgLTEwLDggMSw2IC0yLDggLTMsMiAtOSwwIC0yLDEyIC0xLDEzIC02LDEgLTExLDExIC01LDEwIC04LDEwIC0yLDAgLTQuNSwtMiAtMi41LC0yIC01LC01LjUgbCAtNSwtNyBxIDAsMCAtMy41LC01LjUgbCAtMiwtMiBxIC0xMiw2IC0yNCwtMTAgLTksMSAtMTcsLTIgMTUsNiAyLDEzIC0xMSw1IC0yMSwyIDEyLDUgMTAsMTQgLTIsOSAtMTIsMTYgMSwwIDQsLTEgMywtMSA0LC0xIC0xLDUgLTkuNSw5LjUgLTguNSw0LjUgLTE5LjUsOSAtMTEsNC41IC0xNCw2LjUgLTcsNSAtMzYsMTAuNSAtMjksNS41IC0zNiwxLjUgLTUsLTMgLTYsLTYgLTEsLTMgMS41LC04LjUgMi41LC01LjUgMy41LC04LjUgNiwtMjMgNSwtMjcgLTEsLTMgLTguNSwtOCAtNy41LC01IC01LjUsLTEyIDEsLTQgMTEuNSwtMTAgMTAuNSwtNiAxMi41LC0xMiA1LC0xMyAtNCwtMjUgLTQsLTUgLTE1LC0xMSAtMTEsLTYgLTE0LC0xMCAtNSwtNSAtMy41LC0xMS41IDEuNSwtNi41IDAuNSwtOS41IDEsMSAxLDIuNSAwLDEuNSAxLDIuNSAwLC0xMyAxMSwtMjIgOCwtNiAtMTYsLTE4IC0yMCwtMTEgLTIwLC00IDEsOCAtNy41LDE2IC04LjUsOCAtMTAuNSwxMiAtMiw0IC0zLjUsMTkgLTEuNSwxNSAtOS41LDIxIC02LDQgLTE5LDQgLTEzLDAgLTE4LC01IDAsMTAgLTQ5LDMwIC0xNyw4IC01OCw0IDcsMSAwLDE3IC04LDE2IC0yMSwxMiAtOCwyNSAtNCwzNSAyLDUgOSwxNCA3LDkgOSwxNSAxLDMgMTUuNSw2IDE0LjUsMyAxNi41LDggMSw0IC0yLjUsNi41IC0zLjUsMi41IC05LjUsNC41IDUzLC02IDYzLDE4IDUsOSAzLDE0IDAsLTEgMiwtMSAyLDAgMiwtMSAxMiwzIDcsMTcgMTksOCAyNiw4IDUsLTEgMTEsLTYgNiwtNSAxMCwtNSAxNywtMyAyMS41LDEwIDQuNSwxMyAtOS41LDIzIDcsLTQgNyw2IC0xLDEzIC03LDE5IC0zLDIgLTYuNSwyLjUgLTMuNSwwLjUgLTYuNSwwIC0zLC0wLjUgLTcsMC41IC0xLDAgLTgsMiAtMSwtMSAtMiwtMSBoIC04IHEgLTQsLTIgLTQsLTUgdiAtMSBxIC0xLC0zIDQsLTYgbCA1LC0xIDMsLTIgcSAtMSwwIC0yLjUsLTIuNSAtMS41LC0yLjUgLTIuNSwtMi41IDAsLTMgMywtNSAtMiwtMSAtMTQsLTcuNSAtMTIsLTYuNSAtMTcsLTEwLjUgLTEsLTEgLTQsLTIuNSAtMywtMS41IC00LC0yLjUgLTIsLTEgLTQsMiAtMiwzIC00LDkgLTIsNiAtNCwxMS41IC0yLDUuNSAtNC41LDEwIC0yLjUsNC41IC01LjUsNC41IC0xMiwwIC0xOCwtMTcgMywxMCAtMTMsMTcuNSAtMTYsNy41IC0yNSw3LjUgMjAsMTUgLTksMzAgbCAtMSwxIHEgLTMwLC00IC00NSwtNyAtMiwtNiAzLC0xMiAtMSwtNyA2LC05IDAsLTEgMC41LC0xIDAuNSwwIDAuNSwtMSAwLDEgLTAuNSwxIC0wLjUsMCAtMC41LDEgMywtMSAxMC41LC0xLjUgNy41LC0wLjUgOS41LC0xLjUgMywtMSA0LjUsLTIgbCA3LjUsLTUgcSAwLDAgNS41LC02IDUuNSwtNiAtMi41LC01IC0yLC0xIC05LC00IC03LC0zIC0xMi41LC01LjUgLTUuNSwtMi41IC02LjUsLTMuNSAtMywtNSAwLC0xNiAzLC0xMSAtMiwtMTUgLTUsNSAtMTAsMTguNSAtNSwxMy41IC04LDE3LjUgOCwtOSAtMzAsLTYgbCAtOCwxIHEgLTQsMCAtMTUsLTIgLTExLC0yIC0xNiwtMSAtNywwIC0yOSw2IDcsMTcgNSwyNSA1LDAgNywyIGwgLTYsMyBxIC0zLC0xIC0yNSwtOSAyLC0zIDgsLTkuNSA2LC02LjUgOSwtMTEuNSAtMjIsNiAtMjcsLTIgMCwtMSAtOSwwIC0yNSwxIC0yNCwtNyAxLC00IDksLTEyIDAsLTkgLTEsLTkgLTI3LDIyIC0zMCwyMyAtMTcyLC04MyAtMjc2LC0yNDggMSwtMiAyLjUsLTExIDEuNSwtOSAzLjUsLTguNSAyLDAuNSAxMSw0LjUgOSwtOSAzLC0yMSAyLDIgMzYsLTIxIDU2LC00MCAyMiwtNTMgdiA1LjUgcSAwLDAgMSw2LjUgLTksLTEgLTE5LDUgLTMsLTYgMC41LC0yMCAzLjUsLTE0IDExLjUsLTE0IC04LDAgLTEwLjUsLTE3IFEgMjU3LDgzNCAyNTcsODEyLjUgMjU3LDc5MSAyNTYsNzg3IGwgMiwtMSBxIC0zLC0xMyA2LC0zNy41IDksLTI0LjUgMjQsLTIwLjUgLTQsLTE4IDUsLTIxIC0xLC00IDAsLTggMSwtNCA0LjUsLTguNSAzLjUsLTQuNSA2LC03IGwgNy41LC03LjUgNiwtNiBxIDI4LC0xMSA0MSwtMjkgNCwtNiAxMC41LC0yNC41IFEgMzc1LDU5OCAzODQsNTkxIHEgLTIsLTYgMTAsLTIxLjUgMTIsLTE1LjUgMTEsLTI1LjUgLTEsMCAtMi41LC0wLjUgLTEuNSwtMC41IC0yLjUsLTAuNSAzLC04IDE2LjUsLTE2IDEzLjUsLTggMTYuNSwtMTQgMiwtMyAyLjUsLTEwLjUgMC41LC03LjUgMywtMTIgMi41LC00LjUgOC41LC0yLjUgMywyNCAtMjYsNjggLTE2LDI3IC0xOCwzMSAtMyw1IC01LjUsMTYuNSAtMi41LDExLjUgLTQuNSwxNS41IDI3LC05IDI2LC0xMyAtNSwtMTAgMjYsLTUyIDIsLTMgMTAsLTEwIDgsLTcgMTEsLTEyIDMsLTQgOS41LC0xNC41IFEgNDgyLDUwNyA0ODYsNTAyIHEgLTEsMCAtMywtMiBsIC0zLC0zIHEgNCwtMiA5LC01IDUsLTMgOCwtNC41IDMsLTEuNSA3LjUsLTUgNC41LC0zLjUgNy41LC03LjUgMTYsLTE4IDIwLC0zMyAxLC00IDAuNSwtMTUuNSBRIDUzMiw0MTUgNTM0LDQxMCBxIDIsLTYgNiwtMTEgNCwtNSAxMS41LC0xMCA3LjUsLTUgMTEuNSwtNyA0LC0yIDE0LjUsLTYuNSAxMC41LC00LjUgMTEuNSwtNS41IDIsLTEgMTgsLTExIDE2LC0xMCAyNSwtMTQgMTAsLTQgMTYuNSwtNC41IDYuNSwtMC41IDE2LDIuNSA5LjUsMyAxNS41LDQgeiIKICAgICAgIGlkPSJwYXRoMzAyOSIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojMDAwIiAvPgogIDwvZz4KPC9zdmc+Cg==",
        "license": "CCBY3SA",
        "group": "other",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n   xmlns:cc=\"http://creativecommons.org/ns#\"\n   xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   viewBox=\"0 -256 1792 1792\"\n   id=\"svg3025\"\n   version=\"1.1\"\n   inkscape:version=\"0.48.3.1 r9886\"\n   width=\"14px\"\n   height=\"14px\"\n   iconlicense=\"CCBY3SA\"\n   wikicommons=\"http://upload.wikimedia.org/wikipedia/commons/8/8b/Globe_font_awesome.svg\"\n   sodipodi:docname=\"globe_font_awesome.svg\">\n  <metadata\n     id=\"metadata3035\">\n    <rdf:RDF>\n      <cc:Work\n         rdf:about=\"\">\n        <dc:format>image/svg+xml</dc:format>\n        <dc:type\n           rdf:resource=\"http://purl.org/dc/dcmitype/StillImage\" />\n      </cc:Work>\n    </rdf:RDF>\n  </metadata>\n  <defs\n     id=\"defs3033\" />\n  <sodipodi:namedview\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1\"\n     objecttolerance=\"10\"\n     gridtolerance=\"10\"\n     guidetolerance=\"10\"\n     inkscape:pageopacity=\"0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:window-width=\"640\"\n     inkscape:window-height=\"480\"\n     id=\"namedview3031\"\n     showgrid=\"false\"\n     inkscape:zoom=\"0.13169643\"\n     inkscape:cx=\"896\"\n     inkscape:cy=\"896\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"25\"\n     inkscape:window-maximized=\"0\"\n     inkscape:current-layer=\"svg3025\" />\n  <g\n     transform=\"matrix(1,0,0,-1,136.67797,1300.6102)\"\n     id=\"g3027\">\n    <path\n       d=\"m 1193,993 q 11,7 25,22 v -1 q 0,-2 -9.5,-10 -9.5,-8 -11.5,-12 -1,1 -4,1 z m -6,-1 q -1,1 -2.5,3 -1.5,2 -1.5,3 3,-2 10,-5 -6,-4 -6,-1 z m -459,183 q -16,2 -26,5 1,0 6.5,-1 5.5,-1 10.5,-2 5,-1 9,-2 z m 45,37 q 7,4 13.5,2.5 6.5,-1.5 7.5,-7.5 -5,3 -21,5 z m -8,-6 -3,2 q -2,3 -5.5,5 -3.5,2 -4.5,2 2,-1 21,-3 -6,-4 -8,-6 z m -102,84 v 2 q 1,-2 3,-5.5 2,-3.5 3,-5.5 z m -105,-40 q 0,-2 -1,-2 l -1,2 h 2 z M 933,206 v -1 1 z M 768,1408 q 209,0 385.5,-103 Q 1330,1202 1433,1025.5 1536,849 1536,640 1536,431 1433,254.5 1330,78 1153.5,-25 977,-128 768,-128 559,-128 382.5,-25 206,78 103,254.5 0,431 0,640 0,849 103,1025.5 206,1202 382.5,1305 559,1408 768,1408 z m 472,-1246 5,5 q -7,10 -29,12 1,12 -14,26.5 -15,14.5 -27,15.5 0,4 -10.5,11 -10.5,7 -17.5,8 -9,2 -27,-9 -7,-3 -4,-5 -3,3 -12,11 -9,8 -16,11 -2,1 -7.5,1 -5.5,0 -8.5,2 -1,1 -6,4.5 -5,3.5 -7,4.5 -2,1 -6.5,3 -4.5,2 -7.5,1.5 -3,-0.5 -7.5,-2.5 -4.5,-2 -8.5,-6 -4,-4 -4.5,-15.5 -0.5,-11.5 -2.5,-14.5 -8,6 -0.5,20 7.5,14 1.5,20 -7,7 -21,0.5 -14,-6.5 -21,-15.5 -1,-1 -9.5,-5.5 Q 963,241 960,238 q -4,-6 -9,-17.5 -5,-11.5 -6,-13.5 0,2 -2.5,6.5 -2.5,4.5 -2.5,6.5 -12,-2 -16,3 5,-16 8,-17 l -4,2 q -1,-6 3,-15 4,-9 4,-11 1,-5 -1.5,-13 -2.5,-8 -2.5,-11 0,-2 5,-11 4,-19 -2,-32 0,-1 -3.5,-7 -3.5,-6 -6.5,-11 l -2,-5 -2,1 q -1,1 -2,0 -1,-6 -9,-13 -8,-7 -10,-11 -15,-23 -9,-38 3,-8 10,-10 3,-1 3,2 1,-9 -11,-27 1,-1 4,-3 -17,0 -10,-14 202,36 352,181 h -3 z M 680,347 q 16,3 30.5,-16 14.5,-19 22.5,-23 41,-20 59,-11 0,-9 14,-28 3,-4 6.5,-11.5 3.5,-7.5 5.5,-10.5 5,-7 19,-16 14,-9 19,-16 6,3 9,9 13,-35 24,-34 5,0 8,8 0,-1 -0.5,-3 -0.5,-2 -1.5,-3 7,15 5,26 l 6,4 q 5,4 5,5 -6,6 -9,-3 -30,-14 -48,22 -2,3 -4.5,8 -2.5,5 -5,12 -2.5,7 -1.5,11.5 1,4.5 6,4.5 11,0 12.5,1.5 1.5,1.5 -2.5,6 -4,4.5 -4,7.5 -1,4 -1.5,12.5 Q 853,318 852,322 l -5,6 q -5,6 -11.5,13.5 -6.5,7.5 -7.5,9.5 -4,-10 -16.5,-8.5 -12.5,1.5 -18.5,9.5 1,-2 -0.5,-6.5 -1.5,-4.5 -1.5,-6.5 -14,0 -17,1 1,6 3,21 2,15 4,22 1,5 5.5,13.5 4.5,8.5 8,15.5 3.5,7 4.5,14 1,7 -4.5,10.5 -5.5,3.5 -18.5,2.5 -20,-1 -29,-22 -1,-3 -3,-11.5 -2,-8.5 -5,-12.5 -3,-4 -9,-7 -8,-3 -27,-2 -19,1 -26,5 -14,8 -24,30.5 -10,22.5 -11,41.5 0,10 3,27.5 3,17.5 3,27 0,9.5 -6,26.5 3,2 10,10.5 7,8.5 11,11.5 2,2 5,2 h 5 q 0,0 4,2 4,2 3,6 -1,1 -4,3 -3,3 -4,3 4,-3 19,-1 15,2 19,2 0,1 22,0 17,-13 24,2 0,1 -2.5,10.5 -2.5,9.5 -0.5,14.5 5,-29 32,-10 3,-4 16.5,-6 13.5,-2 18.5,-5 3,-2 7,-5.5 4,-3.5 6,-5 2,-1.5 6,-0.5 4,1 9,7 11,-17 13,-25 11,-43 20,-48 8,-2 12.5,-2 4.5,0 5,10.5 0.5,10.5 0,15.5 -0.5,5 -1.5,13 l -2,37 q -16,3 -20,12.5 -4,9.5 1.5,20 5.5,10.5 16.5,19.5 1,1 16.5,8 15.5,7 21.5,12 24,19 17,39 9,-2 11,9 l -5,3 q -4,3 -8,5.5 -4,2.5 -5,1.5 11,7 2,18 5,3 8,11.5 3,8.5 9,11.5 9,-14 22,-3 8,9 2,18 5,8 22,11.5 17,3.5 20,9.5 5,-1 7,0 2,1 2,4.5 v 7.5 q 0,0 1,8.5 1,8.5 3,7.5 4,6 16,10.5 12,4.5 14,5.5 l 19,12 q 4,4 0,4 18,-2 32,11 13,12 -5,23 2,7 -4,10.5 -6,3.5 -16,5.5 3,1 12,0.5 9,-0.5 12,1.5 15,11 -7,17 -20,5 -47,-13 -3,-2 -13,-12 -10,-10 -17,-11 15,18 5,22 8,-1 22.5,9 14.5,10 15.5,11 4,2 10.5,2.5 6.5,0.5 8.5,1.5 71,25 92,-1 8,11 11,15 3,4 9.5,9 6.5,5 15.5,8 21,7 23,9 l 1,23 q -12,-1 -18,8 -6,9 -7,22 l -6,-8 q 0,6 -3.5,7.5 -3.5,1.5 -7.5,0.5 -4,-1 -9.5,-2 -5.5,-1 -7.5,0 -9,2 -19.5,15.5 -10.5,13.5 -14.5,16.5 9,0 9,5 -2,5 -10,8 1,6 -2,8 -3,2 -9,0 -2,12 -1,13 -6,1 -11,11 -5,10 -8,10 -2,0 -4.5,-2 -2.5,-2 -5,-5.5 l -5,-7 q 0,0 -3.5,-5.5 l -2,-2 q -12,6 -24,-10 -9,1 -17,-2 15,6 2,13 -11,5 -21,2 12,5 10,14 -2,9 -12,16 1,0 4,-1 3,-1 4,-1 -1,5 -9.5,9.5 -8.5,4.5 -19.5,9 -11,4.5 -14,6.5 -7,5 -36,10.5 -29,5.5 -36,1.5 -5,-3 -6,-6 -1,-3 1.5,-8.5 2.5,-5.5 3.5,-8.5 6,-23 5,-27 -1,-3 -8.5,-8 -7.5,-5 -5.5,-12 1,-4 11.5,-10 10.5,-6 12.5,-12 5,-13 -4,-25 -4,-5 -15,-11 -11,-6 -14,-10 -5,-5 -3.5,-11.5 1.5,-6.5 0.5,-9.5 1,1 1,2.5 0,1.5 1,2.5 0,-13 11,-22 8,-6 -16,-18 -20,-11 -20,-4 1,8 -7.5,16 -8.5,8 -10.5,12 -2,4 -3.5,19 -1.5,15 -9.5,21 -6,4 -19,4 -13,0 -18,-5 0,10 -49,30 -17,8 -58,4 7,1 0,17 -8,16 -21,12 -8,25 -4,35 2,5 9,14 7,9 9,15 1,3 15.5,6 14.5,3 16.5,8 1,4 -2.5,6.5 -3.5,2.5 -9.5,4.5 53,-6 63,18 5,9 3,14 0,-1 2,-1 2,0 2,-1 12,3 7,17 19,8 26,8 5,-1 11,-6 6,-5 10,-5 17,-3 21.5,10 4.5,13 -9.5,23 7,-4 7,6 -1,13 -7,19 -3,2 -6.5,2.5 -3.5,0.5 -6.5,0 -3,-0.5 -7,0.5 -1,0 -8,2 -1,-1 -2,-1 h -8 q -4,-2 -4,-5 v -1 q -1,-3 4,-6 l 5,-1 3,-2 q -1,0 -2.5,-2.5 -1.5,-2.5 -2.5,-2.5 0,-3 3,-5 -2,-1 -14,-7.5 -12,-6.5 -17,-10.5 -1,-1 -4,-2.5 -3,-1.5 -4,-2.5 -2,-1 -4,2 -2,3 -4,9 -2,6 -4,11.5 -2,5.5 -4.5,10 -2.5,4.5 -5.5,4.5 -12,0 -18,-17 3,10 -13,17.5 -16,7.5 -25,7.5 20,15 -9,30 l -1,1 q -30,-4 -45,-7 -2,-6 3,-12 -1,-7 6,-9 0,-1 0.5,-1 0.5,0 0.5,-1 0,1 -0.5,1 -0.5,0 -0.5,1 3,-1 10.5,-1.5 7.5,-0.5 9.5,-1.5 3,-1 4.5,-2 l 7.5,-5 q 0,0 5.5,-6 5.5,-6 -2.5,-5 -2,-1 -9,-4 -7,-3 -12.5,-5.5 -5.5,-2.5 -6.5,-3.5 -3,-5 0,-16 3,-11 -2,-15 -5,5 -10,18.5 -5,13.5 -8,17.5 8,-9 -30,-6 l -8,1 q -4,0 -15,-2 -11,-2 -16,-1 -7,0 -29,6 7,17 5,25 5,0 7,2 l -6,3 q -3,-1 -25,-9 2,-3 8,-9.5 6,-6.5 9,-11.5 -22,6 -27,-2 0,-1 -9,0 -25,1 -24,-7 1,-4 9,-12 0,-9 -1,-9 -27,22 -30,23 -172,-83 -276,-248 1,-2 2.5,-11 1.5,-9 3.5,-8.5 2,0.5 11,4.5 9,-9 3,-21 2,2 36,-21 56,-40 22,-53 v 5.5 q 0,0 1,6.5 -9,-1 -19,5 -3,-6 0.5,-20 3.5,-14 11.5,-14 -8,0 -10.5,-17 Q 257,834 257,812.5 257,791 256,787 l 2,-1 q -3,-13 6,-37.5 9,-24.5 24,-20.5 -4,-18 5,-21 -1,-4 0,-8 1,-4 4.5,-8.5 3.5,-4.5 6,-7 l 7.5,-7.5 6,-6 q 28,-11 41,-29 4,-6 10.5,-24.5 Q 375,598 384,591 q -2,-6 10,-21.5 12,-15.5 11,-25.5 -1,0 -2.5,-0.5 -1.5,-0.5 -2.5,-0.5 3,-8 16.5,-16 13.5,-8 16.5,-14 2,-3 2.5,-10.5 0.5,-7.5 3,-12 2.5,-4.5 8.5,-2.5 3,24 -26,68 -16,27 -18,31 -3,5 -5.5,16.5 -2.5,11.5 -4.5,15.5 27,-9 26,-13 -5,-10 26,-52 2,-3 10,-10 8,-7 11,-12 3,-4 9.5,-14.5 Q 482,507 486,502 q -1,0 -3,-2 l -3,-3 q 4,-2 9,-5 5,-3 8,-4.5 3,-1.5 7.5,-5 4.5,-3.5 7.5,-7.5 16,-18 20,-33 1,-4 0.5,-15.5 Q 532,415 534,410 q 2,-6 6,-11 4,-5 11.5,-10 7.5,-5 11.5,-7 4,-2 14.5,-6.5 10.5,-4.5 11.5,-5.5 2,-1 18,-11 16,-10 25,-14 10,-4 16.5,-4.5 6.5,-0.5 16,2.5 9.5,3 15.5,4 z\"\n       id=\"path3029\"\n       inkscape:connector-curvature=\"0\"\n       style=\"fill:#000\" />\n  </g>\n</svg>\n",
        "icon_source": "http://upload.wikimedia.org/wikipedia/commons/8/8b/Globe_font_awesome.svg",
        "url": "http://commons.wikimedia.org/wiki/File:Globe_font_awesome.svg"
    },
    "location":{
            "name": "location-black.svg",
            "path": "img/icons-svg",
            "used": false,
            "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgl3aWR0aD0iMTRweCIKCWhlaWdodD0iMTRweCIKCWljb25saWNlbnNlPSJDQzAiCgl2aWV3Qm94PSIwIDAgMTQgMTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0IDE0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik03LDBDNC43OTEsMCwzLDEuNzkxLDMsNGMwLDIsNCwxMCw0LDEwczQtOCw0LTEwQzExLDEuNzkxLDkuMjA5LDAsNywweiBNNyw2QzUuODk2LDYsNSw1LjEwNCw1LDRzMC44OTYtMiwyLTIKCWMxLjEwNCwwLDIsMC44OTYsMiwyUzguMTA0LDYsNyw2eiIvPgo8L3N2Zz4K",
            "license": "CC0",
            "group": "navigation",
            "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\twidth=\"14px\"\n\theight=\"14px\"\n\ticonlicense=\"CC0\"\n\tviewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path fill=\"#000\" d=\"M7,0C4.791,0,3,1.791,3,4c0,2,4,10,4,10s4-8,4-10C11,1.791,9.209,0,7,0z M7,6C5.896,6,5,5.104,5,4s0.896-2,2-2\n\tc1.104,0,2,0.896,2,2S8.104,6,7,6z\"/>\n</svg>\n",
            "icon_source": "http://jquerymobile.com/download/",
            "url": "http://niebert.github.io/icons4menu/img/icons-svg/location-black.svg"
    },
    "info":{
            "name": "info-black.svg",
            "path": "img/icons-svg",
            "used": false,
            "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiCgl3aWR0aD0iMTRweCIKCWhlaWdodD0iMTRweCIKCWljb25saWNlbnNlPSJDQzAiCgl2aWV3Qm94PSIwIDAgMTQgMTQiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDE0IDE0OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxwYXRoIGZpbGw9IiMwMDAiIGQ9Ik03LDBDMy4xMzQsMCwwLDMuMTM0LDAsN3MzLjEzNCw3LDcsN3M3LTMuMTM0LDctN1MxMC44NjYsMCw3LDB6IE03LDJjMC41NTIsMCwxLDAuNDQ3LDEsMVM3LjU1Miw0LDcsNFM2LDMuNTUzLDYsMwoJUzYuNDQ4LDIsNywyeiBNOSwxMUg1di0xaDFWNkg1VjVoM3Y1aDFWMTF6Ii8+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=",
            "license": "CC0",
            "group": "main",
            "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\" id=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\twidth=\"14px\"\n\theight=\"14px\"\n\ticonlicense=\"CC0\"\n\tviewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path fill=\"#000\" d=\"M7,0C3.134,0,0,3.134,0,7s3.134,7,7,7s7-3.134,7-7S10.866,0,7,0z M7,2c0.552,0,1,0.447,1,1S7.552,4,7,4S6,3.553,6,3\n\tS6.448,2,7,2z M9,11H5v-1h1V6H5V5h3v5h1V11z\"/>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n<g>\n</g>\n</svg>\n",
            "icon_source": "http://jquerymobile.com/download/",
            "url": "http://niebert.github.io/icons4menu/img/icons-svg/info-black.svg"
        },
    "star4checked":{
        "name": "star4yellow-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICB4PSIwcHgiCiAgIHk9IjBweCIKICAgd2lkdGg9IjIwcHgiCiAgIGhlaWdodD0iMjBweCIKICAgaWNvbmxpY2Vuc2U9IkNDMCIKICAgdmlld0JveD0iMCAwIDIwIDIwIgogICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMCAyMCIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgaWQ9InN2ZzQiCiAgIHNvZGlwb2RpOmRvY25hbWU9InN0YXI0eWVsbG93LWJsYWNrLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4xLjEgKDNiZjVhZTBkMjUsIDIwMjEtMDktMjApIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzCiAgICAgaWQ9ImRlZnM4IiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3NiIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIzNi4zNSIKICAgICBpbmtzY2FwZTpjeD0iOS4zNjcyNjI3IgogICAgIGlua3NjYXBlOmN5PSIxMS44NzA3MDIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNTYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmc0IiAvPjxwYXRoCiAgICAgc29kaXBvZGk6dHlwZT0ic3RhciIKICAgICBzdHlsZT0iZmlsbDojZTNkZTE2O3N0cm9rZTojMTExMTExO3N0cm9rZS1vcGFjaXR5OjE7ZmlsbC1vcGFjaXR5OjEiCiAgICAgaWQ9InBhdGg1MTQiCiAgICAgaW5rc2NhcGU6ZmxhdHNpZGVkPSJmYWxzZSIKICAgICBzb2RpcG9kaTpzaWRlcz0iNSIKICAgICBzb2RpcG9kaTpjeD0iMTAuMjU5NTk1IgogICAgIHNvZGlwb2RpOmN5PSIxMC42NTU4MTMiCiAgICAgc29kaXBvZGk6cjE9IjEyLjU0MDg1OCIKICAgICBzb2RpcG9kaTpyMj0iNi4yNzA0Mjg3IgogICAgIHNvZGlwb2RpOmFyZzE9IjAuOTU1NDcwMyIKICAgICBzb2RpcG9kaTphcmcyPSIxLjU4Mzc4ODgiCiAgICAgaW5rc2NhcGU6cm91bmRlZD0iMCIKICAgICBpbmtzY2FwZTpyYW5kb21pemVkPSIwIgogICAgIGQ9Im0gMTcuNDk4NDg5LDIwLjg5NjQ5NCAtNy4zMjAzNiwtMy45NzA3ODEgLTcuNDIxMDU4NywzLjc3OTI0MiAxLjUxNDMyMTUsLTguMTg5MTE1IC01Ljg4NzUwNjMsLTUuODg5OTk2MSA4LjI1NjI2MjQsLTEuMDkwMzcwNCAzLjc4MjM3OTEsLTcuNDE5NDYwMSAzLjU4ODMzLDcuNTE1MjI5MiA4LjIyNTE0NSwxLjMwNDUxNzUgLTYuMDM4NTUzLDUuNzM1MDM3OSB6IgogICAgIGlua3NjYXBlOnRyYW5zZm9ybS1jZW50ZXIteD0iLTAuMDM3NjcyNjc0IgogICAgIGlua3NjYXBlOnRyYW5zZm9ybS1jZW50ZXIteT0iLTAuODg5NTE2MTYiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC43NDgyMzIyLDAsMCwwLjc3Mzc4ODU5LDIuMzA2NzUxOCwyLjg1MDU4MzMpIiAvPjwvc3ZnPgo=",
        "license": "CC0",
        "group": "action",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   version=\"1.1\"\n   x=\"0px\"\n   y=\"0px\"\n   width=\"20px\"\n   height=\"20px\"\n   iconlicense=\"CC0\"\n   viewBox=\"0 0 20 20\"\n   enable-background=\"new 0 0 20 20\"\n   xml:space=\"preserve\"\n   id=\"svg4\"\n   sodipodi:docname=\"star4yellow-black.svg\"\n   inkscape:version=\"1.1.1 (3bf5ae0d25, 2021-09-20)\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"><defs\n     id=\"defs8\" /><sodipodi:namedview\n     id=\"namedview6\"\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1.0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:pageopacity=\"0.0\"\n     inkscape:pagecheckerboard=\"0\"\n     showgrid=\"false\"\n     inkscape:zoom=\"36.35\"\n     inkscape:cx=\"9.3672627\"\n     inkscape:cy=\"11.870702\"\n     inkscape:window-width=\"1920\"\n     inkscape:window-height=\"1056\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"0\"\n     inkscape:window-maximized=\"1\"\n     inkscape:current-layer=\"svg4\" /><path\n     sodipodi:type=\"star\"\n     style=\"fill:#e3de16;stroke:#111111;stroke-opacity:1;fill-opacity:1\"\n     id=\"path514\"\n     inkscape:flatsided=\"false\"\n     sodipodi:sides=\"5\"\n     sodipodi:cx=\"10.259595\"\n     sodipodi:cy=\"10.655813\"\n     sodipodi:r1=\"12.540858\"\n     sodipodi:r2=\"6.2704287\"\n     sodipodi:arg1=\"0.9554703\"\n     sodipodi:arg2=\"1.5837888\"\n     inkscape:rounded=\"0\"\n     inkscape:randomized=\"0\"\n     d=\"m 17.498489,20.896494 -7.32036,-3.970781 -7.4210587,3.779242 1.5143215,-8.189115 -5.8875063,-5.8899961 8.2562624,-1.0903704 3.7823791,-7.4194601 3.58833,7.5152292 8.225145,1.3045175 -6.038553,5.7350379 z\"\n     inkscape:transform-center-x=\"-0.037672674\"\n     inkscape:transform-center-y=\"-0.88951616\"\n     transform=\"matrix(0.7482322,0,0,0.77378859,2.3067518,2.8505833)\" /></svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/star4yellow-black.svg"
    },
    "star4unchecked":{
        "name": "star4white-black.svg",
        "path": "img/icons-svg",
        "used": false,
        "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmVyc2lvbj0iMS4xIgogICB4PSIwcHgiCiAgIHk9IjBweCIKICAgd2lkdGg9IjIwcHgiCiAgIGhlaWdodD0iMjBweCIKICAgaWNvbmxpY2Vuc2U9IkNDMCIKICAgdmlld0JveD0iMCAwIDIwIDIwIgogICBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMCAyMCIKICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgaWQ9InN2ZzQiCiAgIHNvZGlwb2RpOmRvY25hbWU9InN0YXI0d2hpdGUtYmxhY2suc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEuMSAoM2JmNWFlMGQyNSwgMjAyMS0wOS0yMCkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c3ZnPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnMKICAgICBpZD0iZGVmczgiIC8+PHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXc2IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxLjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjM2LjM1IgogICAgIGlua3NjYXBlOmN4PSI5LjM2NzI2MjciCiAgICAgaW5rc2NhcGU6Y3k9IjExLjg3MDcwMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTA1NiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzQiIC8+PHBhdGgKICAgICBzb2RpcG9kaTp0eXBlPSJzdGFyIgogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7c3Ryb2tlOiMxMTExMTE7c3Ryb2tlLW9wYWNpdHk6MTtmaWxsLW9wYWNpdHk6MSIKICAgICBpZD0icGF0aDUxNCIKICAgICBpbmtzY2FwZTpmbGF0c2lkZWQ9ImZhbHNlIgogICAgIHNvZGlwb2RpOnNpZGVzPSI1IgogICAgIHNvZGlwb2RpOmN4PSIxMC4yNTk1OTUiCiAgICAgc29kaXBvZGk6Y3k9IjEwLjY1NTgxMyIKICAgICBzb2RpcG9kaTpyMT0iMTIuNTQwODU4IgogICAgIHNvZGlwb2RpOnIyPSI2LjI3MDQyODciCiAgICAgc29kaXBvZGk6YXJnMT0iMC45NTU0NzAzIgogICAgIHNvZGlwb2RpOmFyZzI9IjEuNTgzNzg4OCIKICAgICBpbmtzY2FwZTpyb3VuZGVkPSIwIgogICAgIGlua3NjYXBlOnJhbmRvbWl6ZWQ9IjAiCiAgICAgZD0ibSAxNy40OTg0ODksMjAuODk2NDk0IC03LjMyMDM2LC0zLjk3MDc4MSAtNy40MjEwNTg3LDMuNzc5MjQyIDEuNTE0MzIxNSwtOC4xODkxMTUgLTUuODg3NTA2MywtNS44ODk5OTYxIDguMjU2MjYyNCwtMS4wOTAzNzA0IDMuNzgyMzc5MSwtNy40MTk0NjAxIDMuNTg4MzMsNy41MTUyMjkyIDguMjI1MTQ1LDEuMzA0NTE3NSAtNi4wMzg1NTMsNS43MzUwMzc5IHoiCiAgICAgaW5rc2NhcGU6dHJhbnNmb3JtLWNlbnRlci14PSItMC4wMzc2NzI2NzQiCiAgICAgaW5rc2NhcGU6dHJhbnNmb3JtLWNlbnRlci15PSItMC44ODk1MTYxNiIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjc0ODIzMjIsMCwwLDAuNzczNzg4NTksMi4zMDY3NTE4LDIuODUwNTgzMykiIC8+PC9zdmc+Cg==",
        "license": "CC0",
        "group": "action",
        "raw": "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<svg\n   version=\"1.1\"\n   x=\"0px\"\n   y=\"0px\"\n   width=\"20px\"\n   height=\"20px\"\n   iconlicense=\"CC0\"\n   viewBox=\"0 0 20 20\"\n   enable-background=\"new 0 0 20 20\"\n   xml:space=\"preserve\"\n   id=\"svg4\"\n   sodipodi:docname=\"star4white-black.svg\"\n   inkscape:version=\"1.1.1 (3bf5ae0d25, 2021-09-20)\"\n   xmlns:inkscape=\"http://www.inkscape.org/namespaces/inkscape\"\n   xmlns:sodipodi=\"http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"><defs\n     id=\"defs8\" /><sodipodi:namedview\n     id=\"namedview6\"\n     pagecolor=\"#ffffff\"\n     bordercolor=\"#666666\"\n     borderopacity=\"1.0\"\n     inkscape:pageshadow=\"2\"\n     inkscape:pageopacity=\"0.0\"\n     inkscape:pagecheckerboard=\"0\"\n     showgrid=\"false\"\n     inkscape:zoom=\"36.35\"\n     inkscape:cx=\"9.3672627\"\n     inkscape:cy=\"11.870702\"\n     inkscape:window-width=\"1920\"\n     inkscape:window-height=\"1056\"\n     inkscape:window-x=\"0\"\n     inkscape:window-y=\"0\"\n     inkscape:window-maximized=\"1\"\n     inkscape:current-layer=\"svg4\" /><path\n     sodipodi:type=\"star\"\n     style=\"fill:#ffffff;stroke:#111111;stroke-opacity:1;fill-opacity:1\"\n     id=\"path514\"\n     inkscape:flatsided=\"false\"\n     sodipodi:sides=\"5\"\n     sodipodi:cx=\"10.259595\"\n     sodipodi:cy=\"10.655813\"\n     sodipodi:r1=\"12.540858\"\n     sodipodi:r2=\"6.2704287\"\n     sodipodi:arg1=\"0.9554703\"\n     sodipodi:arg2=\"1.5837888\"\n     inkscape:rounded=\"0\"\n     inkscape:randomized=\"0\"\n     d=\"m 17.498489,20.896494 -7.32036,-3.970781 -7.4210587,3.779242 1.5143215,-8.189115 -5.8875063,-5.8899961 8.2562624,-1.0903704 3.7823791,-7.4194601 3.58833,7.5152292 8.225145,1.3045175 -6.038553,5.7350379 z\"\n     inkscape:transform-center-x=\"-0.037672674\"\n     inkscape:transform-center-y=\"-0.88951616\"\n     transform=\"matrix(0.7482322,0,0,0.77378859,2.3067518,2.8505833)\" /></svg>\n",
        "icon_source": "http://jquerymobile.com/download/",
        "url": "http://niebert.github.io/icons4menu/img/icons-svg/star4white-black.svg"
    },
    "transfer":{
            "name": "recycle-black.svg",
            "path": "img/icons-svg",
            "used": false,
            "src": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIgoJaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJd2lkdGg9IjE0cHgiCgloZWlnaHQ9IjE0cHgiCglpY29ubGljZW5zZT0iQ0MwIgoJdmlld0JveD0iMCAwIDE0IDE0IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCAxNCAxNDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8cGF0aCBmaWxsPSIjMDAwIiBkPSJNMyw3aDFMMiw0TDAsN2gxYzAsMy4zMTMsMi42ODcsNiw2LDZjMC43MDIsMCwxLjM3NC0wLjEyNywyLTAuMzV2LTIuMjA1QzguNDEsMTAuNzg5LDcuNzMyLDExLDcsMTFDNC43OTEsMTEsMyw5LjIwOSwzLDd6CgkgTTEzLDdjMC0zLjMxMy0yLjY4OC02LTYtNkM2LjI5OCwxLDUuNjI2LDEuMTI3LDUsMS4zNDl2Mi4yMDZDNS41OSwzLjIxMSw2LjI2OCwzLDcsM2MyLjIwOSwwLDQsMS43OTEsNCw0aC0xbDIsM2wyLTNIMTN6Ii8+Cjwvc3ZnPgo=",
            "license": "CC0",
            "group": "other",
            "raw": "<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>\n<!-- Generator: Adobe Illustrator 16.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->\n<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\n<svg version=\"1.1\"\n\tid=\"Layer_1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0px\" y=\"0px\"\n\twidth=\"14px\"\n\theight=\"14px\"\n\ticonlicense=\"CC0\"\n\tviewBox=\"0 0 14 14\" style=\"enable-background:new 0 0 14 14;\" xml:space=\"preserve\">\n<path fill=\"#000\" d=\"M3,7h1L2,4L0,7h1c0,3.313,2.687,6,6,6c0.702,0,1.374-0.127,2-0.35v-2.205C8.41,10.789,7.732,11,7,11C4.791,11,3,9.209,3,7z\n\t M13,7c0-3.313-2.688-6-6-6C6.298,1,5.626,1.127,5,1.349v2.206C5.59,3.211,6.268,3,7,3c2.209,0,4,1.791,4,4h-1l2,3l2-3H13z\"/>\n</svg>\n",
            "icon_source": "http://jquerymobile.com/download/",
            "url": "http://niebert.github.io/icons4menu/img/icons-svg/recycle-black.svg"
    },
    "view":{
            "name": "fa-vr-headset-black.svg",
            "path": "img/icons-svg",
            "used": false,
            "src": "data:image/svg+xml;base64,PHN2ZwogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICB2aWV3Qm94PSIwIDAgNTEyIDUxMiIKICB3aWR0aD0iMTRweCIKICBoZWlnaHQ9IjE0cHgiCiAgaWNvbmxpY2Vuc2U9IkNDQlkzU0EiCiAgd2lraWNvbW1vbnM9Imh0dHBzOi8vY29tbW9ucy53aWtpbWVkaWEub3JnL3dpa2kvRmlsZTpGb250X0F3ZXNvbWVfNV9icmFuZHNfc2ltcGx5YnVpbHQuc3ZnIgogID48cGF0aCBzdHlsZT0iZmlsbDojMDAwIiBkPSJNNDgxLjIgNjRoLTEwNmMtMTQuNSAwLTI2LjYgMTEuOC0yNi42IDI2LjN2MzkuNkgxNjMuM1Y5MC4zYzAtMTQuNS0xMi0yNi4zLTI2LjYtMjYuM2gtMTA2QzE2LjEgNjQgNC4zIDc1LjggNC4zIDkwLjN2MzMxLjRjMCAxNC41IDExLjggMjYuMyAyNi42IDI2LjNoNDUwLjRjMTQuOCAwIDI2LjYtMTEuOCAyNi42LTI2LjNWOTAuM2MtLjItMTQuNS0xMi0yNi4zLTI2LjctMjYuM3pNMTQ5LjggMzU1LjhjLTM2LjYgMC02Ni40LTI5LjctNjYuNC02Ni40IDAtMzYuOSAyOS43LTY2LjYgNjYuNC02Ni42IDM2LjkgMCA2Ni42IDI5LjcgNjYuNiA2Ni42IDAgMzYuNy0yOS43IDY2LjQtNjYuNiA2Ni40em0yMTIuNCAwYy0zNi45IDAtNjYuNi0yOS43LTY2LjYtNjYuNiAwLTM2LjYgMjkuNy02Ni40IDY2LjYtNjYuNCAzNi42IDAgNjYuNCAyOS43IDY2LjQgNjYuNCAwIDM2LjktMjkuOCA2Ni42LTY2LjQgNjYuNnoiLz48L3N2Zz4KPCEtLQpGb250IEF3ZXNvbWUgRnJlZSA1LjQuMSBieSBAZm9udGF3ZXNvbWUgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbQpMaWNlbnNlIC0gaHR0cHM6Ly9mb250YXdlc29tZS5jb20vbGljZW5zZS9mcmVlIChJY29uczogQ0MgQlkgNC4wLCBGb250czogU0lMIE9GTCAxLjEsIENvZGU6IE1JVCBMaWNlbnNlKQotLT4K",
            "license": "CCBY3SA",
            "group": "device",
            "raw": "<svg\n  xmlns=\"http://www.w3.org/2000/svg\"\n  viewBox=\"0 0 512 512\"\n  width=\"14px\"\n  height=\"14px\"\n  iconlicense=\"CCBY3SA\"\n  wikicommons=\"http://commons.wikimedia.org/wiki/File:Font_Awesome_5_brands_simplybuilt.svg\"\n  ><path style=\"fill:#000\" d=\"M481.2 64h-106c-14.5 0-26.6 11.8-26.6 26.3v39.6H163.3V90.3c0-14.5-12-26.3-26.6-26.3h-106C16.1 64 4.3 75.8 4.3 90.3v331.4c0 14.5 11.8 26.3 26.6 26.3h450.4c14.8 0 26.6-11.8 26.6-26.3V90.3c-.2-14.5-12-26.3-26.7-26.3zM149.8 355.8c-36.6 0-66.4-29.7-66.4-66.4 0-36.9 29.7-66.6 66.4-66.6 36.9 0 66.6 29.7 66.6 66.6 0 36.7-29.7 66.4-66.6 66.4zm212.4 0c-36.9 0-66.6-29.7-66.6-66.6 0-36.6 29.7-66.4 66.6-66.4 36.6 0 66.4 29.7 66.4 66.4 0 36.9-29.8 66.6-66.4 66.6z\"/></svg>\n<!--\nFont Awesome Free 5.4.1 by @fontawesome - http://fontawesome.com\nLicense - http://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)\n-->\n",
            "icon_source": "http://commons.wikimedia.org/wiki/File:Font_Awesome_5_brands_simplybuilt.svg",
            "url": "http://commons.wikimedia.org/wiki/File:File:Font_Awesome_5_brands_simplybuilt.svg"
      }

  }
});

JSONEditor.defaults.iconlibs.bootstrap2 = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'chevron-down',
    "decompose":'',
    "aggregate":'',
    "expand": 'chevron-up',
    "delete": 'trash',
    "edit": 'pencil',
    "add": 'plus',
    "cancel": 'ban-circle',
    "load": 'folder',
    "save": 'hdd',
    "moveup": 'arrow-up',
    "movedown": 'arrow-down',
    "brush": 'brush',
    "backgroundcolor": 'paint-bucket',
    "eye": 'eye-open',
    "settings": 'gear',
    "search": 'search',
    "backward": 'step-backward',
    "fastbackward": 'fast-forward',
    "forward": 'step-forward',
    "fastforward": 'fast-forward',
    "globe": 'globe',
    "info": 'info-sign',
    "transfer": 'retweet',
    "view": 'eye-open'
  },
  icon_prefix: 'icon-'
});

JSONEditor.defaults.iconlibs.bootstrap3 = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'chevron-down',
    "expand": 'chevron-right',
    "delete": 'trash',
    "edit": 'edit',
    "add": 'plus',
    "cancel": 'remove',
    "load":'folder-open',
    "save": 'floppy-disk',
    "moveup": 'arrow-up',
    "movedown": 'arrow-down',
    "brush": 'pencil',
    "backgroundcolor": 'tint',
    "eye": 'eye-open',
    "settings": 'cog',
    "search": 'search',
    "backward": 'step-backward',
    "fastbackward": 'fast-forward',
    "forward": 'step-forward',
    "fastforward": 'fast-forward',
    "globe": 'globe',
    "info": 'info-sign',
    "transfer": 'retweet',
    "view": 'eye-open'
  },
  icon_prefix: 'glyphicon glyphicon-'
});

JSONEditor.defaults.iconlibs.fontawesome3 = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'chevron-down',
    "expand": 'chevron-right',
    "delete": 'remove',
    "edit": 'pencil',
    "add": 'plus',
    "cancel": 'ban-circle',
    "load":'folder-open-alt',
    "save": 'save',
    "moveup": 'arrow-up',
    "movedown": 'arrow-down',
    "brush": 'paint-brush',
    "backgroundcolor": 'tint',
    "eye": 'eye-open',
    "settings": 'cog',
    "search": 'search',
    "backward": 'step-backward',
    "fastbackward": 'fast-forward',
    "forward": 'step-forward',
    "fastforward": 'fast-forward',
    "globe": 'globe',
    "info": 'info-sign',
    "transfer": 'retweet',
    "view": 'eye-open'
  },
  icon_prefix: 'icon-'
});

JSONEditor.defaults.iconlibs.fontawesome4 = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'caret-square-o-down',
    "expand": 'caret-square-o-right',
    "delete": 'times',
    "edit": 'pencil',
    "add": 'plus',
    "cancel": 'ban',
    "load":'folder-open-alt',
    "save": 'floppy-o',
    "moveup": 'arrow-up',
    "movedown": 'arrow-down',
    "brush": 'paint-brush',
    "backgroundcolor": 'tint',
    "eye": 'eye-open',
    "settings": 'cog',
    "search": 'search',
    "backward": 'step-backward',
    "fastbackward": 'fast-forward',
    "forward": 'step-forward',
    "fastforward": 'fast-forward',
    "globe": 'globe',
    "info": 'info-sign',
    "transfer": 'retweet',
    "view": 'eye-open'
  },
  icon_prefix: 'fa fa-'
});

JSONEditor.defaults.iconlibs.foundation2 = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'minus',
    "expand": 'plus',
    "delete": 'remove',
    "edit": 'edit',
    "add": 'add-doc',
    "cancel": 'error',
    "load":'folder',
    "save": 'inbox',
    "moveup": 'up-arrow',
    "movedown": 'down-arrow',
    "brush": 'graph',
    "backgroundcolor": 'pinterest',
    "settings": 'settings',
    "search": 'search',
    "backward": 'step-backward',
    "fastbackward": 'fast-forward',
    "forward": 'step-forward',
    "fastforward": 'fast-forward',
    "globe": 'globe',
    "location": 'location',
    "transfer": 'inbox',
    "view": 'eyeball'
  },
  icon_prefix: 'foundicon-'
});

JSONEditor.defaults.iconlibs.foundation3 = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'minus',
    "expand": 'plus',
    "delete": 'x',
    "edit": 'pencil',
    "add": 'page-add',
    "cancel": 'x-circle',
    "load":'folder',
    "save": 'save',
    "moveup": 'arrow-up',
    "movedown": 'arrow-down',
    "brush": 'clipboard-pencil',
    "backgroundcolor": 'paint-bucket',
    "eye": 'eye',
    "settings": 'settings',
    "search": 'search',
    "backward": 'rewind',
    "fastbackward": 'previous',
    "forward": 'fast-forward',
    "fastforward": 'next',
    "globe": 'globe',
    "location": 'location',
    "transfer": 'inbox',
    "view": 'eyeball'
  },
  icon_prefix: 'fi-'
});

JSONEditor.defaults.iconlibs.jqueryui = JSONEditor.AbstractIconLib.extend({
  imgtag:"iconlib", 
  mapping: {
    "calendar":"calendar",
    "collapse": 'triangle-1-s',
    "expand": 'triangle-1-e',
    "delete": 'trash',
    "edit": 'pencil',
    "add": 'plusthick',
    "substract": "minusthick",
    "cancel": 'closethick',
    "load":'folder-open',
    "save": 'disk',
    "moveup": 'arrowthick-1-n',
    "movedown": 'arrowthick-1-s',
    "brush": 'pencil',
    "backgroundcolor": 'clipboard',
    "settings": 'gear',
    "search": 'search',
    "backward": 'seek-prev',
    "fastbackward": 'seek-first',
    "forward": 'seek-next',
    "fastforward": 'seek-end',
    "globe": 'extlink',
    "location": 'pin-s',
    "info": 'info',
    "transfer": 'transfer',
    "view": 'lightbulb'
  },
  icon_prefix: 'ui-icon ui-icon-'
});

JSONEditor.defaults.templates["default"] = function() {
  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'default' defined ");
        return function (context) {
          return "no template for engine 'default' defined";
        }
      };
      var matches = template.match(/{{\s*([a-zA-Z0-9\-_ \.#]+)\s*}}/g);
      var l = matches && matches.length;

      if(!l) return function() { return template; };

      var replacements = [];
      var fct_value4path = function (path,vars) {
        var patharr = path.split('.');
        var n = patharr.length;
        var func;
        
        if(n > 1) {
          var cur;
          func = function(vars) {
            cur = vars;
            for(i=0; i<n; i++) {
              cur = cur[patharr[i]];
              if(!cur) break;
            }
            return cur;
          };
        } else {
          patharr = patharr[0];
          func = function(vars) {
            return vars[patharr];
          };
        }
        return func;
      };
      var get_replacement = function(i) {
        var path = matches[i].replace(/[{}]+/g,'').trim();
        if (path && path.indexOf("#")>=0) {
          tplpath = path.split("#");
          var func, patharr, path1arr;
          var operation = "-";
          var path1 = "-";
          var value1 = "-";
          var value2else = "-";
          if (tplpath.length > 3) {
            path      = tplpath[0];
            patharr = path.split('.');
            operation = tplpath[1];
            path1      = tplpath[2];
            value1     = tplpath[3];
            value2else = "";
            if (tplpath.length > 4) {
              value2else = tplpath[4];
            }
            patharr  = path.split('.');
            path1arr = path1.split('.');
            var n  = patharr.length;
            var n1 = path1arr.length;
            
            var cur;
            var cur1;
            func = function(vars) {
                  cur = vars;
                  cur1 = vars;
                  for(i=0; i<n; i++) {
                    cur = cur[patharr[i]];
                    if(!cur) break;
                  }
                  for(i=0; i<n1; i++) {
                    cur1 = cur1[path1arr[i]];
                    if(!cur1) break;
                  }
                  switch (operation) {
                    case "ifelse":
                        if ((cur1+"") !== value1) {
                          cur = value2else;
                        }
                    break;
                    case "if":
                        if ((cur1+"") == value1) {
                          cur = value2else;
                        }
                    break;
                    case "ifnotelse":
                      if ((cur1+"") !== value1) {
                          cur = value2else;
                        }
                    break;
                    case "ifnot":
                      if ((cur1+"") !== value1) {
                          cur = value2else;
                        }
                    break;
                    default:

                  }
                  return cur;
              };
          }
        } else {
          var patharr = path.split('.');
          var n = patharr.length;
          
          var cur;
          func = function(vars) {
              cur = vars;
              for(i=0; i<n; i++) {
                cur = cur[patharr[i]];
                if(!cur) break;
              }
              return cur;
          };
        }

        replacements.push({
          s: matches[i],
          o: operation,
          t: tplid,
          r: func
        });
      };
      for(var i=0; i<l; i++) {
        get_replacement(i);
      }

      var tplfunc = function(vars) {
        var ret = template+"";
        var r,repl;
        for(i=0; i<l; i++) {
          r = replacements[i];
          repl = r.r(vars);
          ret = ret.replace(r.s, repl);
        }
        return ret;
      };

      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  };
};
JSONEditor.defaults.templates.ejs = function() {
  if(!window.EJS) return false;

  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      var compiled = new window.EJS({
        text: template
      });

      return function(context) {
        return compiled.render(context);
      };
    }
  };
};
JSONEditor.defaults.templates.handlebars = function() {
  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'Handlebars' defined ");
        return function (context) {
          return "no template for engine 'handlebars' defined"
        }
      }
      var tplfunc = window.Handlebars.compile(template);
      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  }
};
JSONEditor.defaults.templates.hogan = function() {
  if(!window.Hogan) return false;

  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'hogan' defined ");
        return function (context) {
          return "no template for engine 'hogan' defined";
        }
      };
      var compiled = window.Hogan.compile(template);
      var tplfunc = function(context) {
        return compiled.render(context);
      };
      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  };
};
JSONEditor.defaults.templates.markup = function() {
  if(!window.Mark || !window.Mark.up) return false;

  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'markup' defined ");
        return function (context) {
          return "no template for engine 'markup' defined"
        }
      }
      var tplfunc = function(context) {
        return window.Mark.up(template,context);
      };
      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  };
};
JSONEditor.defaults.templates.mustache = function() {
  if(!window.Mustache) return false;

  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'mustache' defined ");
        return function (context) {
          return "no template for engine 'mustache' defined"
        }
      }
      var tplfunc = function(view) {
        return window.Mustache.render(template, view);
      };
      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  };
};
JSONEditor.defaults.templates.swig = function() {
  
  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'swig' defined ");
        return function (context) {
          return "no template for engine 'swig' defined";
        }
      }
      var tplfunc = window.swig.compile(template);
      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  }
};
JSONEditor.defaults.templates.underscore = function() {
  if(!window._) return false;

  return {
    tplfunclist: {},
    compile: function(template,tplid,tplfunclist) {
      if (!template) {
        console.error("No template for engine 'underscore' defined ");
        return function (context) {
          return "no template for engine 'underscore' defined";
        }
      }
      var tplfunc = function(context) {
        return window._.template(template, context);
      };
      if (tplfunclist) {
        this.tplfunclist = tplfunclist;
      }
      if (tplid) {
        this.tplfunclist[tplid] = tplfunc;
      }
      return tplfunc;
    }
  };
};

JSONEditor.defaults.translate = function(key, variables, rephash) {
  rephash = rephash || {};
  var lang = JSONEditor.defaults.languages[JSONEditor.defaults.language];
  if(!lang) throw "Unknown language "+JSONEditor.defaults.language;

  var string = lang[key] || JSONEditor.defaults.languages[JSONEditor.defaults.default_language][key];

  if(typeof string === "undefined") throw "Unknown translate string "+key;

  if(variables) {
    for(var i=0; i<variables.length; i++) {
      string = string.replace(new RegExp('\\{\\{'+i+'}}','g'),variables[i]);
    }
  }
  if (rephash) {
    for (var key in rephash) {
      if (rephash.hasOwnProperty(key)) {
        string = string.replace("{{"+key+"}}",rephash[key]);
      }
    }
  }

  return string;
};

JSONEditor.defaults.default_language = 'en';
JSONEditor.defaults.language = JSONEditor.defaults.default_language;
JSONEditor.defaults.languages.en = {
  
  error_notset: "Property must be set in editor {{0}}",
  
  error_notempty: "Value required {{0}}",
  
  error_enum: "Value must be one of the enumerated values",
  
  error_anyOf: "Value must validate against at least one of the provided schemas",
  
  error_oneOf: 'Value must validate against exactly one of the provided schemas. It currently validates against {{0}} of the schemas.',
  
  error_not: "Value must not validate against the provided schema",
  
  error_type_union: "Value must be one of the provided types",
  
  error_type: "Value must be of type {{0}}",
  
  error_disallow_union: "Value must not be one of the provided disallowed types",
  
  error_disallow: "Vabuttonlue must not be of type {{0}}",
  
  error_multipleOf: "Value must be a multiple of {{0}}",
  
  error_maximum_excl: "Value must be less than {{0}}",
  
  error_maximum_incl: "Value must be at most {{0}} i.e. the maximum",
  
  error_minimum_excl: "Value must be greater than the mibimum {{0}}",
  
  error_minimum_incl: "Value must be at least {{0}} i.e. the minimum",
  
  error_maxLength: "Value must be at most {{0}} characters long",
  
  error_minLength: "Value must be at least {{0}} characters long",
  
  error_pattern: "Value must match the pattern {{0}}",
  
  error_additionalItems: "No additional items allowed in this array",
  
  error_maxItems: "Value must have at most {{0}} items",
  
  error_minItems: "Value must have at least {{0}} items",
  
  error_uniqueItems: "Array must have unique items",
  
  error_maxProperties: "Object must have at most {{0}} properties",
  
  error_minProperties: "Object must have at least {{0}} properties",
  
  error_required: "Object is missing the required property '{{0}}'",
  
  error_additional_properties: "No additional properties allowed, but property {{0}} is set",
  
  error_dependency: "Must have property {{0}}",
  
  error_no_search_results: "No results found on search - press X to go back to JSON editor",
  
  error_no_search_keywords: "No keywords provided for search - please insert at least one word into keyword input. Search in JSON editor was not executed",
   
  button_delete_all: "All",
  
  button_delete_all_title: "Delete All",
  
  button_delete_last: "Last {{0}}",
  
  button_delete_last_title: "Delete Last {{0}}",
  
  button_add_row_title: "Add {{0}}",
  
  button_execute: "Execute",
  
  button_play: "Play",
  
  button_move_down_title: "Move down",
  
  button_move_up_title: "Move up",
  
  button_delete_row_title: "Delete {{0}}",
  
  button_delete_row_title_short: "Delete",
  
  button_collapse: "Collapse",
  
  button_expand: "Expand",
  
  button_load: "Load",
  
  button_save: "Save",

  button_preview: "Preview",
  
  button_edit: "Edit",
  
  button_settings: "Settings",
  
  button_properties: "Properties",

  button_search: "Search",
  button_search_close: "Close",

  button_clear: "Clear",

  warn_delete_record: "Do you really want to delete the record?",
  warn_image_clear: "Do you really want to clear the image?",
  warn_image_overwrite: "Do you really want to overwrite the image with the background color?",
  warn_overwrite: "Do you really want to overwrite the content of the editor?",

  label_image: "Image",
  
  label_selector: "Select",

  label_file: "File",

  label_desrcription: "Description",

  label_question: "Question",

  message_result: "Search was successful. Records are displayed. "

};

JSONEditor.defaults.theme = 'html';

JSONEditor.defaults.iconlib = 'icons4menu';

JSONEditor.defaults.template = 'default';

JSONEditor.defaults.options = {
};

JSONEditor.defaults.processor = {
};

JSONEditor.plugins = {
  ace: {
    theme: ''
  },
  epiceditor: {

  },
  sceditor: {

  },
  select2: {

  },
  selectize: {
  },
  map4osm: {
  },
  mathlatex: {

  },
  signature: {

  }
};

JSONEditor.processor = {
};

$each(JSONEditor.defaults.editors, function(i,editor) {
  JSONEditor.defaults.editors[i].options = editor.options || {};
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(typeof schema.type !== "string") return "multiple";
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  
  if(!schema.type && schema.properties ) return "object";
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  
  if(typeof schema.type === "string") return schema.type;
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema.type === 'boolean') {
    
    if(schema.format === "checkbox" || (schema.options && schema.options.checkbox)) {
      return "checkbox";
    }
    
    return (JSONEditor.plugins.selectize.enable) ? 'selectize' : 'select';
  }
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  
  if(schema.type === "any") return "multiple";
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  
  if(schema.type === "string" && schema.media && schema.media.binaryEncoding==="base64") {
    return "base64";
  }
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema.type === "string" && schema.format === "url" && schema.options && schema.options.upload === true) {
    if(window.FileReader) return "upload";
  }
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  
  if(schema.type === "array" && schema.format === "table") {
    return "table";
  }
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema.enumSource) return (JSONEditor.plugins.selectize.enable) ? 'selectize' : 'select';
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema["enum"]) {
    if(schema.type === "array" || schema.type === "object") {
      return "enum";
    }
    else if(schema.type === "number" || schema.type === "integer" || schema.type === "string") {
      return (JSONEditor.plugins.selectize.enable) ? 'selectize' : 'select';
    }
  }
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  if(schema.type === "array" && schema.items && !(Array.isArray(schema.items)) && schema.uniqueItems && ['string','number','integer'].indexOf(schema.items.type) >= 0) {
    
    if(schema.items.enum) {
      return 'multiselect';
    }
    
    else if(JSONEditor.plugins.selectize.enable && schema.items.type === "string") {
      return 'arraySelectize';
    }
  }
});

JSONEditor.defaults.resolvers.unshift(function(schema) {
  
  if(schema.oneOf || schema.anyOf) return "multiple";
});

(function() {
  if(window.jQuery || window.Zepto) {
    var $ = window.jQuery || window.Zepto;
    $.jsoneditor = JSONEditor.defaults;
    
    $.fn.jsoneditor = function(options) {
      var self = this;
      var editor = this.data('jsoneditor');
      if(options === 'value') {
        if(!editor) throw "Must initialize jsoneditor before getting/setting the value";

        if(arguments.length > 1) {
          editor.setValue(arguments[1]);
        }
        
        else {
          return editor.getValue();
        }
      }
      else if(options === 'validate') {
        if(!editor) throw "Must initialize jsoneditor before validating";

        if(arguments.length > 1) {
          return editor.validate(arguments[1]);
        }
        
        else {
          return editor.validate();
        }
      }
      else if(options === 'destroy') {
        if(editor) {
          editor.destroy();
          this.data('jsoneditor',null);
        }
      }
      else {
        
        if(editor) {
          editor.destroy();
        }

        editor = new JSONEditor(this.get(0),options);
        this.data('jsoneditor',editor);

        editor.on('change',function() {
          self.trigger('change');
        });
        editor.on('ready',function() {
          self.trigger('ready');
        });
      }
      
      return this;
    };
  }
})();
  window.JSONEditor = JSONEditor;
})();