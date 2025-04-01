// App: WebApp - Javascript library  - Date: 2020/07/27 11:13:14
function AppLSAC() {
	//--- Navigation -----
	this.nav = {
		"page": function(pid) {
			pid = pid || this.menu.current;
			//console.log("Current Page:"+this.menu.current);
			this.menu.goto_page(pid);
		},
		//---- Menu -----
		"menu":	{
			"current": "home",
			"goto_page": function(pid) {
				pid = pid || this.current;
				if (pid !== this.current) {
					console.log("Goto Page: '"+pid+"' (current page: '"+this.current+"')");
				};
				// store the current page ID in the page-container
				//$('#page-container').attr("currentpage",this.current);

				//this.hide_all_pages();
				$('.pages-app').hide();

				this.current = pid;
				this.hide();
				// use JQuery to show page as DOM element with ID=this.menu.current
				$('#'+this.current).show();
			},
			"hide": function () {
				if ($('ul.opening').is(":visible")) {
  					console.log("MENU: visible > hide menu!");
  					$('ul').toggleClass('opening');
  					$('.menu-toggle').toggleClass('open');
  					this.hide_all_pages();
  					this.goto_page(this.current);
  				} else {
  					//console.log("MENU: is already hidden");
  				};
			},
			"show": function () {
				if ($('ul.opening').is(":visible")) {
  					//console.log("MENU: already visible ");
  				} else {
  					console.log("MENU: is hidden > show menu!");
  					this.hide_all_pages();
  					$('.menu-toggle').toggleClass('open');
  				};
			},
			"toggle": function () {
				$('ul').toggleClass('opening');
  				$('.menu-toggle').toggleClass('open');
  				if ($('ul.opening').is(":visible")) {
  					//console.log("TOGGLE MENU: hide menu ");
  					$('.pages-app').hide();
  				} else {
  					var pageid = $('#page-container').attr("currentpage");
  					//console.log("TOGGLE MENU: hide and show page '" + pageid + "'");
  					$('#'+pageid).show();
  				};
			},
			"hide_all_pages": function () {
				$('.pages-app').hide();
			},
			"show_all_pages": function () {
				$('.pages-app').show();
			}
		},
	};   //--close: nav
	this.evt = {
			"_hide_pages": function () {
				$('.pages-app').hide();
			}, //--close: _hide_pages
			"goto_page": function (pid) {
				$('.pages-app').hide();
				// use JQuery to show page as DOM element with ID=this.menu.current
				$('#'+pid).show();
			},
			"clear_editor": function () {
				el('app_editor').value = '';
				editor.setValue(vDataJSON.db_default);
			},
			"show_json": function () {
				el('app_editor').value = JSON.stringify(editor.getValue(),null,4);
				this.goto_page("print");
			},
			"show_schema": function () {
				el('app_editor').value = JSON.stringify(vDataJSON.schema4json,null,4);
				this.goto_page("print");
			},
			"show_output": function () {
				el('app_editor').value = vDataJSON.out.template4json(editor.getValue());
				this.goto_page("print");
			},
			"show_template": function () {
				el('app_editor').value = vDataJSON.tpl.template4json;
				this.goto_page("print");
			}
	};  //--close: evt

};

// Create an instance of AppLSAC() - see also https://en.wikiversity.org/wiki/AppLSAC
var app = new AppLSAC();

//--- init pages is performed in 'settings.configcode' inserted in 'index.html'----

//--- Assign Toggle Menu Function ----
$('.menu-toggle').click(app.nav.menu.toggle);

//--- init pages ----
app.nav.page("home");

//--- Assign Toggle Menu Function is assigned with 'settings.configcode' in 'index.html' with $('.menu-toggle').click(app.nav.menu.toggle);
