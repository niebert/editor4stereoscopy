
    var lf4d = new LoadFile4DOM();
    var options = {
      "debug": false
    };
    lf4d.init(document,options);
    //---------------------------------------------------
    //----- Create a new Loader with ID "myjsonfile" ----
    //---------------------------------------------------
    // we load the JSON as text file without parsing.
    // the
    var txtfile = lf4d.get_loader_options("myjsonfile","json");
    // Define what to do with the loaded data
    console.log("txtfile="+JSON.stringify(txtfile,null,4));
    txtfile.onload = function (data,err) {
      if (err) {
        // do something on error, perr contains error message
        console.error(err);
        alert("ERROR: Parse JSON was not successful - " + err);
      } else {
        // do something with the file content in data e.g. store  in a HTML textarea (e.g. <textarea id="mytextarea" ...>
        console.log("CALL: txtfile.onload() store the JSON as text file copy into textarea 'jsonstring'");
        // data is now a JSON file that will be converted into string with indent 4 and stored into textarea.
        //window.document.getElementById("jsonstring").value = JSON.stringify(data,null,4);
        if (editor) {
          var vJSON = null;
          try {
            vJSON = JSON.parse(data);
          } catch(e) {
            console.error("ERROR Parse JSON: "+e);
          };
          editor.setValue(vJSON);
        } else {
          console.error("ERROR: JSON Editor 'editor' is not defined");
        }
      }
    };
    // create the loader txtfile
    lf4d.create_load_dialog(txtfile);
    //-------------------------------------------------
    function setImage2Editor(pEditorID,pFileName,pFileBase64) {
      if (editor) {
        var imgeditor = editor.getEditor("root."+pEditorID);
        if (imgeditor) {
          console.log("Image Editor ["+pEditorID+"] is defined!");
          imgeditor.name4file.value = pFileName;
          //alert("type of DataURL='"+(typeof(pFileBase64))+"'")
          imgeditor.setValue(pFileBase64);
        } else {
          console.error("Image Editor ["+pEditorID+"] is missing");
        }
      } else {
        console.log("CALL: setImage2Editor('"+pEditorID+"','"+pFileName+"',pFileBase64) missing editor");
      }
    }
    //-----LEFT IMAGE LOADER------------------------------------------
    var file2leftimage = lf4d.get_loader_options("file2leftimage","dataurl");
       // Define what to do with the loaded data
       file2leftimage.returntype = "filehash"; // data contains the file
       file2leftimage.multiple = false;
       file2leftimage.onload = function (data,err) {
         if (err) {
           // do something on error, err contains error message
           console.error(err);
         } else {
           // do something with the file content in data e.g. store  in a HTML textarea (e.g. <textarea id="mytextarea" ...>
           console.log("CALL: file2leftimage.onload('" + data.name + "')");
           //var vNode = document.getElementById("thumb4left95"); //thumb4imageleft");
           var vDOMID = "preview4left";
           var vNode = document.getElementById(vDOMID); //thumb4imageleft");
           if (vNode) {
             //console.log("CALL: file2leftimage.onload('" + data.name + "'): "+JSON.stringify(data,null,4));
             //vNode.innerHTML = "<tt>" + data.name + "</tt><br>" + data.tag + " ";
             vNode.setAttribute("filename4img",data.name);
             var old_width = vNode.width;
             vNode.onload = function() {
               var ratio = vNode.naturalHeight/vNode.naturalWidth;
               vNode.height = vNode.width * ratio;
             };
             vNode.src = data.file;
             setImage2Editor("left",data.name, data.file);
             setBaseFileName(data.name);
             //zip.file(data.name, data.file, {base64: true})
           } else {
             console.error("ERROR: DOM Element '"+vDOMID+"' does not exist!");
           }

         }
       };
       // create the load dialog 'file2leftimage'
       lf4d.create_load_dialog(file2leftimage);
       //-----------------------------------------------
       var file2rightimage = lf4d.get_loader_options("file2rightimage","dataurl");
       file2rightimage.returntype = "filehash"; // data contains the file
       file2rightimage.multiple = false;
       // Define what to do with the loaded data
       file2rightimage.onload = function (data,err) {
            if (err) {
              // do something on error, err contains error message
              console.error(err);
            } else {
              // do something with the file content in data e.g. store  in a HTML textarea (e.g. <textarea id="mytextarea" ...>
              console.log("CALL: file2rightimage.onload('" + data.name + "')");
              var vDOMID = "preview4right"
              var vNode = document.getElementById(vDOMID);
              if (vNode) {
                //console.log("CALL: file2rightimage.onload('" + data.name + "'): "+JSON.stringify(data,null,4));
                vNode.setAttribute("filename4img",data.name);
                var old_width = vNode.width;
                vNode.onload = function() {
                  var ratio = vNode.naturalHeight/vNode.naturalWidth;
                  vNode.height = vNode.width * ratio;
                };
                vNode.src = data.file;
                setImage2Editor("right",data.name, data.file);
                setBaseFileName(data.name);
                //zip.file(data.name, data.file, {base64: true})
              } else {
                console.error("ERROR: DOM Element '"+vDOMID+"' does not exist!");
              }
            }
          };
          // create the load dialog 'file2rightimage'
          lf4d.create_load_dialog(file2rightimage);
