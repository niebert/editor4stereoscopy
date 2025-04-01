      //-----------------------------------------------
        function get_source(pID) {
          var vSource = "Undefined source in node '" + pID + "'";
          var vNode = document.getElementById(pID);
          if (vNode) {
            vSource = vNode.value;
          } else {
            console.error("DOM node with ID='" + pID + "' undefined!");
          };
          return vSource
        }

        function escape_html(pHTML) {
          pHTML = pHTML.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
          return pHTML
        }

        function printTextArea(pID) {
          console.log("Print HTML content in DIV element with the ID='" + pID + "'");
          var print_win = window.open("","wPrintWin","width=600,height=300,scrollbars=1,resizable=1");
          var code = get_source(pID);

          // Open a print window print_win
          var vPrint_Node = print_win.document.body; //getElementById('print_body');
          if (vPrint_Node) {
            vPrint_Node.innerHTML = "<pre><code class=\"javascript\">" + code + "</code></pre>";
          } else {
            console.error("ERROR: print node in DOM for ID  'print_body' was undefinde");
          }
          print_win.focus();
          //print_win.print();
          //print_win.close();
          //print_win.close();
        }

        function previewTextArea(pID) {
          console.log("Preview HTML content in DIV element with the ID='" + pID + "'");
          var preview_win = window.open("","wPreviewtWin","width=600,height=400,toolbar=yes,location=yes,status=yes,menubar=yes,scrollbars=yes,resizable=yes");
          var code = get_source(pID);

          // Open a print window print_win
          var vPrint_Node = preview_win.document.body; //getElementById('print_body');
          if (vPrint_Node) {
            // code = hljs.highlight('javascript',code).value;
            // console.log("CODE: "+code);
            vPrint_Node.innerHTML = "<h2>Print Preview</h2><pre><code class=\"javascript\">" + code + "</code></pre>";
            //vPrint_Node.innerHTML =  code ;
          } else {
            console.error("ERROR: print node in DOM for ID  'print_body' was undefinde");
          }
          preview_win.focus();
        }
