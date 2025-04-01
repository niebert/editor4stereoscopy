      function el(pID) {
        return document.getElementById(pID);
      }

      function renderStereocopyImage() {
		      console.log("Render Stereoscopy Image");
          alert("add_event_listener.js:7 - Render Stereoscopy Image");
	    };

      // Hook up the submit button to log to the console
      el('submit').addEventListener('click',function() {
        // Get the value from the editor
        var vContent = JSON.stringify(editor.getValue(),null,4);
        console.log("JSON Data:\n"+vContent);
      });

      // Hook up the Restore to Default button
      el('restore').addEventListener('click',function() {
        editor.setValue(starting_value);
      });
	// Hook up the Calculate Angle of View button
      el('restore').addEventListener('click',function() {
        calculateAngleOfView(editor.getValue());
      });

      // Hook up the enable/disable button
      el('enable_disable').addEventListener('click',function() {
        // Enable form
        if(!editor.isEnabled()) {
          editor.enable();
        }
        // Disable form
        else {
          editor.disable();
        }
      });

      // Hook up the submit button to export JSON
      el('bExportJSON').addEventListener('click',function() {
        // Get the value from the editor
        var vJSON = editor.getValue();
        var vContent = JSON.stringify(vJSON,null,4);
        var vFile = el("jsonfile").value;
        saveFile2HDD(vFile,vContent);
        console.log("JSON output '"+vFile+"':\n"+vContent);
      });

      // Hook up the submit button to export JSON Schema
      el('bExportSchemaJSON').addEventListener('click',function() {
        // Get the value from the editor
        console.log("BEFORE editor.schema:\n"+JSON.stringify(editor.schema,null,4));
        var vJSON = editor.schema;
        var vContent = JSON.stringify(vJSON,null,4);
        var vFile = "json4schema.json";
        console.log("JSON Schema output '"+vFile+"':\n"+vContent);
        saveFile2HDD(vFile,vContent);
      });

      function getBaseFileName() {
        var vFile = el("jsonfile").value;
        var pos = vFile.lastIndexOf(".");
        if (pos > 0) {
          vFile = vFile.substr(0,pos);
        }
        return vFile;
      }

      function hideCameraImages() {
        var row = document.getElementById("tr4cameraimg");
        if (row) {
          row.style.display = "none"
        } else {
          console.error("Table row for camera images does not exist");
        }
      };

      function showCameraImages() {
        var row = document.getElementById("tr4cameraimg");
        if (row) {
          row.style.display = "table-row"
        } else {
          console.error("Table row for camera images does not exist");
        }
      };

      function toggleCameraImages() {
        var row = document.getElementById("tr4cameraimg");
        if (row && row.style.display == "none") {
            row.style.display = "table-row";
        } else {
          row.style.display = "none";
        }
      }

      function setBaseFileName(pFilename) {
        if (pFilename) {
          var vFile = pFilename;
          var pos = vFile.lastIndexOf(".");
          if (pos > 0) {
            vFile = vFile.substr(0,pos);
          };
          vFile = replaceString(vFile,"_left","");
          vFile = replaceString(vFile,"_links","");
          vFile = replaceString(vFile,"_right","");
          vFile = replaceString(vFile,"_rechts","");
          el("filename4camera2image").value = vFile;
          el("jsonfile").value = vFile+".json";
        }
        return vFile;
      }

      el('bExportOutput').addEventListener('click',function (){
        //alert("show Save Page()");
        var filetype =
        app.nav.page('save');
      });

      function exportOutput4Handlebars() {
        // Get the value from the editor
        console.log("button 'bExportOutput' pressed");
        var vJSON = editor.getValue();
        var vTplID = "template4json";
        var vTemplate = vDataJSON.tpl[vTplID];
        console.log("vTemplate="+vTemplate.substr(0,250)+"...");
        //var vContent = Handlebars4Code.compile_code(vTplID,vJSON);
        var vCompiler = Handlebars4Code.create_compiler4template(vTemplate);
        var vContent = vCompiler(vJSON);
        var vFile = getBaseFileName();
        vFile += el("tExtension").value;
        saveFile2HDD(vFile,vContent);
        console.log("JSON Template Output stored in '"+vFile+"'"+vContent);
      }
