/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _ApplicationData = __webpack_require__(1);

	var _NavigationBar = __webpack_require__(2);

	var _NavigationBar2 = _interopRequireDefault(_NavigationBar);

	var _Splitter = __webpack_require__(4);

	var _Splitter2 = _interopRequireDefault(_Splitter);

	var _Tree = __webpack_require__(5);

	var _Tree2 = _interopRequireDefault(_Tree);

	var _Menu = __webpack_require__(6);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _Tabs = __webpack_require__(7);

	var _Tabs2 = _interopRequireDefault(_Tabs);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	var _WorkspaceView = __webpack_require__(9);

	var _WorkspaceView2 = _interopRequireDefault(_WorkspaceView);

	var _ProjectList = __webpack_require__(13);

	var _ProjectList2 = _interopRequireDefault(_ProjectList);

	var _ProjectProgressList = __webpack_require__(23);

	var _ProjectProgressList2 = _interopRequireDefault(_ProjectProgressList);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var splitter = new _Splitter2.default();
	splitter.render($('#content-inside'));

	var data = [{
	  label: "Proyek",
	  expanded: true,
	  items: [{
	    id: 'project_list',
	    label: "Daftar Proyek",
	    selected: true
	  }, {
	    id: 'project_progress_list',
	    label: "Progres Proyek"
	  }]
	}, {
	  label: "Laporan",
	  expanded: true,
	  items: [{
	    id: 'report1',
	    label: "Report 1"
	  }]
	}];

	var tree = new _Tree2.default({
	  data: data,
	  onClick: function onClick(item) {

	    if (!tabs.selectTabByTitle(item.label)) {
	      if (item.id == 'project_list') {
	        tabs.add(item.id, item.label, projectList);
	      } else {
	        if (item.id == 'project_progress_list') {
	          tabs.add(item.id, item.label, projectProgressList);
	        }
	      }
	      //  }else if(item.id == 'jadwal_mingguan'){
	      //      tabs.add(item.id, item.label, weeklyScheduleList);
	      //  }else if(item.id == 'data_nilai'){
	      //      tabs.add(item.id, item.label, scoreList);
	      //  }else if(item.id == 'data_siswa'){
	      //      tabs.add(item.id, item.label, studentList);
	      //  }else if(item.id == 'jadwal_rs'){
	      //      tabs.add(item.id, item.label, hospitalScheduleView);
	      //  }else if(item.id == 'jadwal_ps'){
	      //      tabs.add(item.id, item.label, clinicScheduleView);
	      //  }else if(item.id == 'cost_unit'){
	      //      tabs.add(item.id, item.label, costUnitReport);
	      //  }else if(item.id == 'data_rs'){
	      //      tabs.add(item.id, item.label, hospitalList);
	      //  }
	    }
	  }
	});

	var projectList = new _ProjectList2.default();
	var projectProgressList = new _ProjectProgressList2.default();

	var navigationBar = new _NavigationBar2.default([{
	  title: 'Application',
	  content: tree
	}, {
	  title: 'Settings'
	}]);
	navigationBar.render($('#left-content'));

	// var workspaceView = new WorkspaceView();

	var tabs = new _Tabs2.default([{
	  id: 'project_list',
	  title: 'Daftar Proyek',
	  content: projectList
	}]);

	tabs.render($('#right-content'));

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.getMenuData = getMenuData;
	function getMenuData() {
	    var data = [{
	        "id": "12",
	        "text": "Account",
	        "parentid": "-1",
	        "subMenuWidth": '250px'
	    }, {
	        "text": "Help",
	        "id": "1",
	        "parentid": "-1",
	        "subMenuWidth": '250px'
	    }, {
	        "id": "13",
	        "text": "Profile",
	        "parentid": "12"
	    }, {
	        "id": "14",
	        "text": "Logout",
	        "parentid": "12"
	    }];

	    return data;
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var NavigationBar = function () {
	  function NavigationBar(items) {
	    _classCallCheck(this, NavigationBar);

	    this.id = (0, _Utils.guid)();
	    this.items = items;
	  }

	  _createClass(NavigationBar, [{
	    key: 'render',
	    value: function render(container) {
	      var navigationBarContainer = $('<div></div>');
	      navigationBarContainer.attr('id', this.id);
	      for (var i = 0; i < this.items.length; i++) {

	        var title = $('<div>' + this.items[i].title + '</div>');
	        title.appendTo(navigationBarContainer);

	        var contentContainer = $('<div></div>');
	        contentContainer.appendTo(navigationBarContainer);

	        if (this.items[i].content) {
	          this.items[i].content.render(contentContainer);
	        }
	      }
	      navigationBarContainer.appendTo(container);

	      navigationBarContainer.jqxNavigationBar({
	        theme: 'metro',
	        width: '101%',
	        height: '100%'
	      });
	    }
	  }]);

	  return NavigationBar;
	}();

	exports.default = NavigationBar;

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.guid = guid;
	function guid() {
	  function s4() {
	    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	  }
	  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Splitter = function () {
	  function Splitter() {
	    _classCallCheck(this, Splitter);

	    this.id = (0, _Utils.guid)();
	  }

	  _createClass(Splitter, [{
	    key: 'render',
	    value: function render(container) {
	      container.jqxSplitter({ theme: 'metro', width: '100%', height: '100%', panels: [{ size: 200 }] });
	    }
	  }]);

	  return Splitter;
	}();

	exports.default = Splitter;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tree = function () {
	  function Tree(options) {
	    _classCallCheck(this, Tree);

	    this.id = (0, _Utils.guid)();
	    this.source = options.data;
	    this.onClick = options.onClick;
	  }

	  _createClass(Tree, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var treeContainer = $('<div></div>');
	      treeContainer.appendTo(container);
	      treeContainer.jqxTree({
	        theme: 'metro',
	        // source: this.records,
	        source: this.source,
	        width: '100%',
	        height: '100%'
	      });

	      treeContainer.on('itemClick', function (event) {
	        var args = event.args;
	        var item = treeContainer.jqxTree('getItem', args.element);
	        if (_this.onClick) {
	          _this.onClick(item);
	        }
	      });
	    }
	  }]);

	  return Tree;
	}();

	exports.default = Tree;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Menu = function () {
	  function Menu(options) {
	    _classCallCheck(this, Menu);

	    this.id = (0, _Utils.guid)();
	    this.data = options.data;
	    this.onClick = options.onClick;
	  }

	  _createClass(Menu, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var source = {
	        datatype: "json",
	        datafields: [{ name: 'id' }, { name: 'parentid' }, { name: 'text' }, { name: 'subMenuWidth' }],
	        id: 'id',
	        localdata: _this.data
	      };

	      var dataAdapter = new $.jqx.dataAdapter(source);
	      dataAdapter.dataBind();

	      var records = dataAdapter.getRecordsHierarchy('id', 'parentid', 'items', [{ name: 'text', map: 'label' }]);

	      var menuContainer = $('<div></div>');
	      menuContainer.appendTo(container);
	      menuContainer.jqxMenu({
	        theme: 'metro',
	        source: records,
	        width: '100%',
	        height: '100%'
	      });

	      menuContainer.on('itemclick', function (event) {
	        var args = event.args;
	        if (_this.onClick) {
	          _this.onClick(args.id);
	        }
	      });
	    }
	  }]);

	  return Menu;
	}();

	exports.default = Menu;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Tabs = function () {
	  function Tabs(items) {
	    _classCallCheck(this, Tabs);

	    this.id = (0, _Utils.guid)();
	    this.items = items;
	  }

	  _createClass(Tabs, [{
	    key: 'render',
	    value: function render(container) {
	      var tabContainer = $('<div style="margin-top: -1px;"></div>');
	      tabContainer.appendTo(container);
	      tabContainer.attr('id', this.id);
	      var ul = $('<ul></ul>');
	      ul.appendTo(tabContainer);

	      for (var i = 0; i < this.items.length; i++) {

	        var title = $('<li>' + this.items[i].title + '</li>');
	        title.appendTo(ul);
	      }

	      var tempContainer = [];
	      for (var i = 0; i < this.items.length; i++) {

	        var contentContainer = $('<div></div>');
	        contentContainer.appendTo(tabContainer);
	        tempContainer.push(contentContainer);
	      }

	      tabContainer.jqxTabs({
	        theme: 'metro',
	        position: 'top',
	        showCloseButtons: true,
	        width: '100%',
	        height: '100.5%'
	      });

	      for (var i = 0; i < this.items.length; i++) {

	        if (this.items[i].content) {
	          this.items[i].content.render(tempContainer[i]);
	        }
	      }

	      this.component = tabContainer;
	    }
	  }, {
	    key: 'add',
	    value: function add(childTabId, title, content) {

	      var id = this.id + '_' + childTabId;
	      var _contentContainer = '<div id="' + id + '" style="height: 100%;"></div>';
	      this.component.jqxTabs('addLast', title, _contentContainer);

	      content.render($('#' + id));
	    }
	  }, {
	    key: 'selectTabByTitle',
	    value: function selectTabByTitle(title) {
	      var tabFound = false;
	      var tabsLength = this.component.jqxTabs('length');

	      for (var i = 0; i < tabsLength; i++) {
	        var tabTitle = this.component.jqxTabs('getTitleAt', i);
	        if (title == tabTitle) {
	          tabFound = true;
	          this.component.jqxTabs('select', i);
	          break;
	        }
	      }

	      return tabFound;
	    }
	  }]);

	  return Tabs;
	}();

	exports.default = Tabs;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Button = function () {
	  function Button(options) {
	    _classCallCheck(this, Button);

	    this.id = (0, _Utils.guid)();
	    this.onClick = options.onClick;

	    if (options.title) {
	      this.title = options.title;
	    } else {
	      this.title = '';
	    }

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    if (options.imgSrc) {
	      this.imgSrc = options.imgSrc;
	    }

	    this.template = options.template;
	    this.theme = options.theme;
	  }

	  _createClass(Button, [{
	    key: 'render',
	    value: function render(container) {
	      var _this = this;

	      var buttonContainer = $('<input type="button" value="' + this.title + '" />');
	      buttonContainer.attr('id', this.id);
	      buttonContainer.appendTo(container);

	      var buttonOptions = {
	        theme: 'light'
	      };

	      if (this.template) {
	        buttonOptions['template'] = this.template;
	      }

	      if (this.theme) {
	        buttonOptions['theme'] = this.theme;
	      }

	      if (this.width) {
	        buttonOptions['width'] = this.width;
	      }

	      if (this.height) {
	        buttonOptions['height'] = this.height;
	      }

	      if (this.imgSrc) {
	        buttonOptions['imgSrc'] = this.imgSrc;
	      }

	      buttonContainer.jqxButton(buttonOptions);

	      if (this.onClick) {
	        $('#' + this.id).on('click', function () {
	          _this.onClick();
	        });
	      }
	    }
	  }]);

	  return Button;
	}();

	exports.default = Button;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	var _ToggleButton = __webpack_require__(10);

	var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

	var _TextBox = __webpack_require__(11);

	var _TextBox2 = _interopRequireDefault(_TextBox);

	var _ComboBox = __webpack_require__(12);

	var _ComboBox2 = _interopRequireDefault(_ComboBox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var WorkspaceView = function () {
	  function WorkspaceView() {
	    _classCallCheck(this, WorkspaceView);

	    this.id = (0, _Utils.guid)();
	  }

	  _createClass(WorkspaceView, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      this.searchTextBox = new _TextBox2.default({ placeHolder: 'Project', width: 250, height: 24 });
	      var searchButton = new _Button2.default({
	        onClick: function onClick() {},
	        imgSrc: '/pcd_assets/images/search.png',
	        theme: 'metro', width: 30, height: 26
	      });

	      var table = $('<table style="height: 100%; width: 100%; margin: -3px; "></table>');
	      var tr = $('<tr></tr>');
	      var td = $('<td style="padding: 0; height: 40px;"></td>');
	      table.appendTo(container);
	      tr.appendTo(table);
	      td.appendTo(tr);

	      var innerTable = $('<table style="height: 100%; width: 100%;"></table>');
	      var innerTr = $('<tr></tr>');
	      var innerTd = $('<td style="padding-top: 6px; padding-left: 10px; width: 120px; height: 100%;"></td>');
	      innerTable.appendTo(td);
	      innerTr.appendTo(innerTable);
	      innerTd.appendTo(innerTr);

	      innerTd = $('<td style="padding-top: 6px; height: 100%; width: 100px;"></td>');
	      innerTd.appendTo(innerTr);

	      innerTd = $('<td style="padding-top: 6px; height: 100%; width: 86px;"></td>');
	      innerTd.appendTo(innerTr);
	      // this.levelCmb.render(innerTd);

	      innerTd = $('<td style="padding-top: 6px; height: 100%; width: 250px;"></td>');
	      innerTd.appendTo(innerTr);
	      this.searchTextBox.render(innerTd);

	      innerTd = $('<td style="padding-top: 6px; height: 100%;"></td>');
	      var _tempContainer = $('<div style="margin-left: -5px;"></div>');
	      _tempContainer.appendTo(innerTd);
	      innerTd.appendTo(innerTr);
	      searchButton.render(_tempContainer);

	      tr = $('<tr></tr>');
	      td = $('<td style="padding: 0;"></td>');
	      tr.appendTo(table);
	      td.appendTo(tr);
	    }
	  }]);

	  return WorkspaceView;
	}();

	exports.default = WorkspaceView;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ToggleButton = function () {
	  function ToggleButton(options) {
	    _classCallCheck(this, ToggleButton);

	    this.id = (0, _Utils.guid)();

	    if (options.title) {
	      this.title = options.title;
	    } else {
	      this.title = 'Button';
	    }

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    this.onButtonToggled = options.onButtonToggled;
	    this.onButtonNotToggled = options.onButtonNotToggled;
	  }

	  _createClass(ToggleButton, [{
	    key: 'render',
	    value: function render(container) {
	      var buttonContainer = $('<button>' + this.title + '</button>');
	      buttonContainer.appendTo(container);

	      var buttonOptions = {
	        theme: 'light'
	      };

	      if (this.width) {
	        buttonOptions['width'] = this.width;
	      }

	      if (this.height) {
	        buttonOptions['height'] = this.height;
	      }

	      buttonContainer.jqxToggleButton(buttonOptions);

	      var _this = this;

	      buttonContainer.on('click', function () {
	        var toggled = buttonContainer.jqxToggleButton('toggled');
	        if (toggled) {
	          if (_this.onButtonToggled) {
	            _this.onButtonToggled();
	          }
	        } else {
	          if (_this.onButtonNotToggled) {
	            _this.onButtonNotToggled();
	          }
	        }
	      });
	    }
	  }]);

	  return ToggleButton;
	}();

	exports.default = ToggleButton;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TextBox = function () {
	  function TextBox(options) {
	    _classCallCheck(this, TextBox);

	    this.id = (0, _Utils.guid)();

	    if (options.title) {
	      this.title = options.title;
	    } else {
	      this.title = 'Button';
	    }

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    this.placeHolder = options.placeHolder;

	    this.initialValue = options.value;

	    this.disabled = options.disabled;
	  }

	  _createClass(TextBox, [{
	    key: 'render',
	    value: function render(container) {
	      var textBoxContainer = $('<input type="text" />');
	      textBoxContainer.attr('id', this.id);
	      textBoxContainer.appendTo(container);

	      var textBoxOptions = {
	        theme: 'metro'
	      };

	      if (this.width) {
	        textBoxOptions['width'] = this.width;
	      }

	      if (this.height) {
	        textBoxOptions['height'] = this.height;
	      }

	      if (this.placeHolder) {
	        textBoxOptions['placeHolder'] = this.placeHolder;
	      }

	      if (this.disabled) {
	        textBoxOptions['disabled'] = this.disabled;
	      }

	      textBoxContainer.jqxInput(textBoxOptions);

	      if (this.initialValue) {
	        textBoxContainer.val(this.initialValue);
	      }

	      this.component = textBoxContainer;
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.component.val();
	    }
	  }]);

	  return TextBox;
	}();

	exports.default = TextBox;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ComboBox = function () {
	  function ComboBox(options) {
	    _classCallCheck(this, ComboBox);

	    this.id = (0, _Utils.guid)();
	    this.localData = options.localData;
	    this.url = options.url;
	    this.dataFields = options.dataFields;
	    this.comboBoxOptions = options.comboBoxOptions;
	    this.onChange = options.onChange;
	    this.clearSelectionEnabled = options.clearSelectionEnabled;
	    this.initialValue = options.value;
	  }

	  _createClass(ComboBox, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var comboBoxContainer = $('<div></div>');
	      comboBoxContainer.appendTo(container);
	      comboBoxContainer.attr('id', this.id);

	      if (this.localData) {
	        this.comboBoxOptions['source'] = this.localData;
	      } else {
	        var source = {
	          datatype: "json",
	          datafields: this.dataFields,
	          url: _this.url,
	          data: {}
	        };
	        var dataAdapter = new $.jqx.dataAdapter(source);
	        this.comboBoxOptions['source'] = dataAdapter;
	      }

	      comboBoxContainer.jqxComboBox(this.comboBoxOptions);

	      if (this.onChange) {
	        comboBoxContainer.on('change', function (event) {
	          _this.onChange(comboBoxContainer.val());
	        });
	      }

	      if (this.clearSelectionEnabled) {
	        comboBoxContainer.on('keydown', function (event) {
	          if (event.keyCode == 8 || event.keyCode == 46) {
	            comboBoxContainer.jqxComboBox('clearSelection');
	          }
	        });
	      }

	      if (this.initialValue) {
	        if (this.localData) {
	          comboBoxContainer.val(_this.initialValue);
	        } else {
	          comboBoxContainer.on('bindingComplete', function (event) {
	            comboBoxContainer.val(_this.initialValue);
	          });
	        }
	      }

	      this.component = comboBoxContainer;
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.component.val();
	    }
	  }]);

	  return ComboBox;
	}();

	exports.default = ComboBox;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	var _ToggleButton = __webpack_require__(10);

	var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

	var _TextBox = __webpack_require__(11);

	var _TextBox2 = _interopRequireDefault(_TextBox);

	var _DataGrid = __webpack_require__(14);

	var _DataGrid2 = _interopRequireDefault(_DataGrid);

	var _AddProjectWindow = __webpack_require__(15);

	var _AddProjectWindow2 = _interopRequireDefault(_AddProjectWindow);

	var _EditProjectWindow = __webpack_require__(21);

	var _EditProjectWindow2 = _interopRequireDefault(_EditProjectWindow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ProjectList = function () {
	  function ProjectList() {
	    _classCallCheck(this, ProjectList);

	    this.id = (0, _Utils.guid)();
	  }

	  _createClass(ProjectList, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var url = "/projects";

	      var source = {
	        datatype: "json",
	        datafields: [{ name: 'id', type: 'int' }, { name: 'code', type: 'string' }, { name: 'name', type: 'string' }, { name: 'project_type', type: 'int' }, { name: 'description', type: 'string' }],
	        id: "id",
	        url: url
	      };

	      var onSearch = function onSearch(data) {
	        data['searchTxt'] = searchTextBox.getValue();
	        return data;
	      };

	      var cellsrenderer = function cellsrenderer(row, columnfield, value, defaulthtml, columnproperties) {
	        var projectTypeDescription = "";

	        if (value == 1) {
	          projectTypeDescription = "Proyek Lama Non JO/Non KSO";
	        } else if (value == 2) {
	          projectTypeDescription = "Proyek Lama JO/KSO";
	        } else if (value == 3) {
	          projectTypeDescription = "Proyek Baru Sudah Diperoleh Non JO/Non KSO";
	        } else if (value == 4) {
	          projectTypeDescription = "Proyek Baru Sudah Diperoleh JO/KSO";
	        } else if (value == 5) {
	          projectTypeDescription = "Proyek Baru Dalam Pengusahaan Non JO/Non KSO";
	        } else if (value == 6) {
	          projectTypeDescription = "Proyek Baru Dalam Pengusahaan JO/KSO";
	        }

	        return '<span style="margin: 4px; float: ' + columnproperties.cellsalign + ';">' + projectTypeDescription + '</span>';
	      };

	      var dataGridOptions = {
	        width: '100%',
	        height: '100%',
	        pageable: true,
	        altrows: true,
	        theme: 'metro',
	        virtualmode: true,
	        rendergridrows: function rendergridrows(params) {
	          return params.data;
	        },
	        columns: [{ text: 'Kode', datafield: 'code', width: '20%' }, { text: 'Nama', datafield: 'name', width: '20%' }, { text: 'Tipe', datafield: 'project_type', cellsrenderer: cellsrenderer, width: '30%' }, { text: 'Deskripsi', datafield: 'description', width: '30%' }],
	        groups: []
	      };

	      this.dataGrid = new _DataGrid2.default({
	        source: source,
	        onSearch: onSearch,
	        onRowDoubleClick: function onRowDoubleClick(data) {
	          var editProjectWindow = new _EditProjectWindow2.default({
	            data: data,
	            onSaveSuccess: function onSaveSuccess() {
	              _this.dataGrid.refresh();
	            }
	          });
	          editProjectWindow.render($('#dialogWindowContainer'));
	          editProjectWindow.open();
	        },
	        dataGridOptions: dataGridOptions
	      });

	      var searchTextBox = new _TextBox2.default({ placeHolder: 'Kode atau Nama', width: 250, height: 24 });
	      var searchButton = new _Button2.default({
	        imgSrc: '/pcd_assets/images/search.png',
	        theme: 'metro',
	        width: 30,
	        height: 26,
	        onClick: function onClick() {
	          _this.dataGrid.refresh();
	        }
	      });

	      var addProjectButton = new _Button2.default({
	        title: 'Tambah Proyek',
	        template: 'primary',
	        height: 26,
	        onClick: function onClick() {
	          var addProjectWindow = new _AddProjectWindow2.default({
	            onSaveSuccess: function onSaveSuccess() {
	              _this.dataGrid.refresh();
	            }
	          });
	          addProjectWindow.render($('#dialogWindowContainer'));
	          addProjectWindow.open();
	        }
	      });

	      var table = $('<table style="height: 100%; width: 100%; margin: -3px; "></table>');
	      var tr = $('<tr></tr>');
	      var td = $('<td style="padding: 0; height: 40px;"></td>');
	      table.appendTo(container);
	      tr.appendTo(table);
	      td.appendTo(tr);

	      var innerTable = $('<table style="height: 100%; width: 100%;"></table>');
	      var innerTr = $('<tr></tr>');
	      var innerTd = $('<td style="padding-top: 6px; padding-left: 10px; padding-right: 8px; width: 50px; height: 100%;"></td>');
	      innerTable.appendTo(td);
	      innerTr.appendTo(innerTable);
	      innerTd.appendTo(innerTr);
	      addProjectButton.render(innerTd);

	      innerTd = $('<td style="padding-top: 6px; width: 200px; height: 100%;"></td>');
	      innerTd.appendTo(innerTr);
	      searchTextBox.render(innerTd);

	      innerTd = $('<td style="padding-top: 6px; height: 100%; "></td>');
	      var _tempContainer = $('<div style="margin-left: -5px;"></div>');
	      _tempContainer.appendTo(innerTd);
	      innerTd.appendTo(innerTr);
	      searchButton.render(_tempContainer);

	      tr = $('<tr></tr>');
	      td = $('<td style="padding: 0;"></td>');
	      tr.appendTo(table);
	      td.appendTo(tr);

	      this.dataGrid.render(td);
	    }
	  }]);

	  return ProjectList;
	}();

	exports.default = ProjectList;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var DataGrid = function () {
	  function DataGrid(options) {
	    _classCallCheck(this, DataGrid);

	    this.id = (0, _Utils.guid)();
	    this.source = options.source;
	    this.onSearch = options.onSearch;
	    this.dataGridOptions = options.dataGridOptions;
	    this.onRowDoubleClick = options.onRowDoubleClick;
	  }

	  _createClass(DataGrid, [{
	    key: 'render',
	    value: function render(container) {
	      var _this = this;

	      var dataAdapter = new $.jqx.dataAdapter(this.source, {
	        formatData: function formatData(data) {
	          if (_this.onSearch) {
	            return _this.onSearch(data);
	          } else {
	            return data;
	          }
	        },
	        downloadComplete: function downloadComplete(data, status, xhr) {
	          if (!_this.source.totalRecords) {
	            _this.source.totalRecords = data.totalRecords;
	          }
	        }

	      });
	      this.dataGridOptions['source'] = dataAdapter;
	      this.dataGridOptions['altrows'] = true;
	      this.dataGridOptions['columnsresize'] = true;
	      this.dataGridOptions['pagesizeoptions'] = ['50', '100', '500'];
	      this.dataGridOptions['pagesize'] = '50';

	      var dataGridContainer = $('<div style="height: 100%"></div>');
	      dataGridContainer.appendTo(container);
	      dataGridContainer.jqxGrid(this.dataGridOptions);

	      if (this.onRowDoubleClick) {
	        dataGridContainer.on('rowdoubleclick', function (event) {
	          var args = event.args;
	          var rowIndex = args.rowindex;
	          var data = dataGridContainer.jqxGrid('getrowdata', rowIndex);
	          _this.onRowDoubleClick(data);
	        });
	      }

	      this.dataGridContainer = dataGridContainer;
	    }
	  }, {
	    key: 'refresh',
	    value: function refresh() {
	      this.dataGridContainer.jqxGrid('gotopage', 0);
	      this.dataGridContainer.jqxGrid('updatebounddata');
	    }
	  }, {
	    key: 'addGroup',
	    value: function addGroup(groupName) {
	      this.dataGridContainer.jqxGrid('addgroup', groupName);
	    }
	  }]);

	  return DataGrid;
	}();

	exports.default = DataGrid;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	var _Form = __webpack_require__(16);

	var _Form2 = _interopRequireDefault(_Form);

	var _AddWindow = __webpack_require__(17);

	var _AddWindow2 = _interopRequireDefault(_AddWindow);

	var _TextBox = __webpack_require__(11);

	var _TextBox2 = _interopRequireDefault(_TextBox);

	var _TextArea = __webpack_require__(18);

	var _TextArea2 = _interopRequireDefault(_TextArea);

	var _Label = __webpack_require__(19);

	var _Label2 = _interopRequireDefault(_Label);

	var _ProjectTypeComboBox = __webpack_require__(20);

	var _ProjectTypeComboBox2 = _interopRequireDefault(_ProjectTypeComboBox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AddProjectWindow = function () {
	  function AddProjectWindow(options) {
	    _classCallCheck(this, AddProjectWindow);

	    var _this = this;

	    this.id = (0, _Utils.guid)();

	    var project = options.data;
	    this.onSaveSuccess = options.onSaveSuccess;

	    var codeTextBox = new _TextBox2.default({ height: 25, width: '90%' });
	    var nameTextBox = new _TextBox2.default({ height: 25, width: '90%' });
	    var projectTypeComboBox = new _ProjectTypeComboBox2.default({ height: 25, width: '92.5%' });
	    var descriptionTextBox = new _TextArea2.default({ height: 80, width: '92.5%' });

	    var formItems = [{
	      name: 'code',
	      label: 'Code',
	      content: codeTextBox,
	      validation: {
	        type: 'TEXTBOX',
	        rule: 'required'
	      }
	    }, {
	      name: 'name',
	      label: 'Name',
	      content: nameTextBox,
	      validation: {
	        type: 'TEXTBOX',
	        rule: 'required'
	      }
	    }, {
	      name: 'project_type',
	      label: 'Type',
	      content: projectTypeComboBox,
	      validation: {
	        type: 'COMBOBOX',
	        rule: 'required'
	      }
	    }, {
	      name: 'description',
	      label: 'Description',
	      content: descriptionTextBox
	    }];
	    var formOptions = {
	      items: formItems,
	      labelColumnWidth: '120px',
	      onValidationSuccess: function onValidationSuccess(formValue) {
	        $.ajax({
	          method: "POST",
	          url: "/api/projects",
	          data: JSON.stringify(formValue),
	          beforeSend: function beforeSend(xhr) {
	            xhr.setRequestHeader('Accept', 'application/json');
	            xhr.setRequestHeader('Content-Type', 'application/json');
	          }
	        }).done(function () {
	          $("#successNotification").jqxNotification("open");
	          _this.window.close();
	          if (_this.onSaveSuccess) {
	            _this.onSaveSuccess();
	          }
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	          var errorMessage = 'Proses gagal. Status : ' + jqXHR.status + ' [' + jqXHR.statusText + '] : ' + jqXHR.responseText;
	          $("#errorNotification").html('<div>' + errorMessage + '</div>');
	          $("#errorNotification").jqxNotification("open");
	        });
	      }
	    };

	    var form = new _Form2.default(formOptions);

	    this.window = new _AddWindow2.default({
	      width: 390,
	      height: 280,
	      title: 'Add Project',
	      content: form,
	      onSave: function onSave() {
	        form.validate();
	      },
	      onCancel: function onCancel() {
	        _this.window.close();
	      }
	    });
	  }

	  _createClass(AddProjectWindow, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;
	      this.window.render(container);
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      this.window.open();
	    }
	  }]);

	  return AddProjectWindow;
	}();

	exports.default = AddProjectWindow;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Form = function () {
	  function Form(options) {
	    _classCallCheck(this, Form);

	    this.id = (0, _Utils.guid)();
	    this.items = options.items;
	    this.onValidationSuccess = options.onValidationSuccess;
	    this.labelColumnWidth = options.labelColumnWidth;
	    this.contentColumnWidth = options.contentColumnWidth;
	  }

	  _createClass(Form, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      this.formItems = [];

	      var validationRules = [];
	      var form = $('<form></form>');
	      form.appendTo(container);
	      var table = $('<table style="width: 100%;"></table>');
	      table.appendTo(form);
	      for (var i = 0; i < this.items.length; i++) {
	        var tr = $('<tr></tr>');
	        tr.appendTo(table);

	        var td = $('<td></td>');
	        td.appendTo(tr);
	        td.css('padding-top', '5px');
	        td.css('padding-bottom', '5px');
	        if (this.labelColumnWidth) {
	          td.css('width', this.labelColumnWidth);
	        }

	        var label = $('<span>' + this.items[i].label + '</span>');
	        label.appendTo(td);

	        td = $('<td></td>');
	        td.appendTo(tr);
	        td.css('padding-top', '3px');
	        td.css('padding-bottom', '3px');
	        if (this.contentColumnWidth) {
	          td.css('width', this.contentColumnWidth);
	        }

	        this.items[i].content.render(td);
	        this.formItems.push({
	          name: this.items[i].name,
	          content: this.items[i].content
	        });

	        var content = this.items[i].content;
	        var contentId = content.getId();

	        var itemValidation = this.items[i].validation;
	        if (itemValidation) {
	          if (itemValidation.type == 'COMBOBOX') {
	            if (itemValidation.rule == 'required') {

	              //---Closure
	              (function f() {

	                var closureContent = content;
	                validationRules.push({
	                  input: '#' + contentId,
	                  message: 'Wajib diisi',
	                  action: 'select', rule: function rule(input) {
	                    var value = closureContent.getValue();
	                    if (value == null || value == '') {
	                      return false;
	                    } else {
	                      return true;
	                    }
	                  }
	                });
	              })();
	              //----------
	            }
	          } else {
	            if (itemValidation.rule == 'required') {
	              validationRules.push({ input: '#' + contentId, message: 'Wajib diisi', action: 'keyup, blur', rule: 'required' });
	            }
	          }
	        }
	      }

	      form.jqxValidator({
	        rules: validationRules
	      });

	      form.on('validationSuccess', function () {
	        if (_this.onValidationSuccess) {
	          var formValues = {};
	          for (var i = 0; i < _this.formItems.length; i++) {
	            formValues[_this.formItems[i].name] = _this.formItems[i].content.getValue();
	          }
	          _this.onValidationSuccess(formValues);
	        }
	      });

	      this.form = form;
	    }
	  }, {
	    key: 'validate',
	    value: function validate() {
	      this.form.jqxValidator('validate');
	    }
	  }]);

	  return Form;
	}();

	exports.default = Form;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var AddWindow = function () {
	  function AddWindow(options) {
	    _classCallCheck(this, AddWindow);

	    this.id = (0, _Utils.guid)();
	    this.content = options.content;

	    if (options.title) {
	      this.title = options.title;
	    } else {
	      this.title = '';
	    }

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    if (options.buttons) {} else {
	      this.saveButton = new _Button2.default({
	        title: 'Save',
	        template: 'success',
	        onClick: function onClick() {
	          if (options.onSave) {
	            options.onSave();
	          }
	        }
	      });

	      this.cancelButton = new _Button2.default({
	        title: 'Cancel',
	        onClick: function onClick() {
	          if (options.onCancel) {
	            options.onCancel();
	          }
	        }
	      });
	    }
	  }

	  _createClass(AddWindow, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var windowContainer = $('<div></div>');
	      windowContainer.appendTo(container);

	      windowContainer.attr('id', this.id);

	      var windowTitle = $('<div>' + this.title + '</div>');
	      windowTitle.appendTo(windowContainer);

	      var windowContent = $('<div></div>');
	      windowContent.appendTo(windowContainer);

	      var windowOptions = {
	        theme: 'metro',
	        isModal: true,
	        autoOpen: false
	      };

	      if (this.width) {
	        windowOptions['width'] = this.width;
	      }

	      if (this.height) {
	        windowOptions['height'] = this.height;
	      }

	      windowContainer.jqxWindow(windowOptions);

	      windowContainer.on('close', function (event) {
	        windowContainer.jqxWindow('destroy');
	      });

	      var table = $('<table style="height: 100%; width: 100%;"></table>');
	      var tr = $('<tr></tr>');
	      var td = $('<td></td>');
	      table.appendTo(windowContent);
	      tr.appendTo(table);
	      td.appendTo(tr);
	      this.content.render(td);

	      tr = $('<tr></tr>');
	      td = $('<td></td>');
	      tr.appendTo(table);
	      td.appendTo(tr);

	      var innerTable = $('<table style="height: 100%; width: 100%;"></table>');
	      var innerTr = $('<tr></tr>');
	      var innerTd = $('<td style="width: 90%;"></td>');
	      innerTable.appendTo(td);
	      innerTr.appendTo(innerTable);
	      innerTd.appendTo(innerTr);

	      innerTd = $('<td></td>');
	      innerTd.appendTo(innerTr);
	      this.cancelButton.render(innerTd);

	      innerTd = $('<td></td>');
	      innerTd.appendTo(innerTr);
	      this.saveButton.render(innerTd);

	      this.windowContainer = windowContainer;
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      this.windowContainer.jqxWindow('open');
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.windowContainer.jqxWindow('close');
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.windowContainer.jqxWindow('destroy');
	    }
	  }]);

	  return AddWindow;
	}();

	exports.default = AddWindow;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TextArea = function () {
	  function TextArea(options) {
	    _classCallCheck(this, TextArea);

	    this.id = (0, _Utils.guid)();

	    if (options.title) {
	      this.title = options.title;
	    } else {
	      this.title = 'Button';
	    }

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    this.placeHolder = options.placeHolder;

	    this.initialValue = options.value;
	  }

	  _createClass(TextArea, [{
	    key: 'render',
	    value: function render(container) {
	      var textAreaContainer = $('<textarea></textarea>');
	      textAreaContainer.attr('id', this.id);
	      textAreaContainer.appendTo(container);

	      var textAreaOptions = {
	        theme: 'metro'
	      };

	      if (this.width) {
	        textAreaOptions['width'] = this.width;
	      }

	      if (this.height) {
	        textAreaOptions['height'] = this.height;
	      }

	      if (this.placeHolder) {
	        textAreaOptions['placeHolder'] = this.placeHolder;
	      }

	      textAreaContainer.jqxInput(textAreaOptions);

	      if (this.initialValue) {
	        textAreaContainer.val(this.initialValue);
	      }

	      this.component = textAreaContainer;
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.component.val();
	    }
	  }]);

	  return TextArea;
	}();

	exports.default = TextArea;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Label = function () {
	  function Label(options) {
	    _classCallCheck(this, Label);

	    this.id = (0, _Utils.guid)();
	    this.text = options.text;
	    this.bold = options.bold;
	  }

	  _createClass(Label, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var labelContainer = $('<span>' + this.text + '</span>');
	      labelContainer.appendTo(container);
	      if (this.bold) {
	        labelContainer.css('font-weight', 'bold');
	      }
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.text;
	    }
	  }]);

	  return Label;
	}();

	exports.default = Label;

/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _ComboBox = __webpack_require__(12);

	var _ComboBox2 = _interopRequireDefault(_ComboBox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ProjectTypeComboBox = function () {
	  function ProjectTypeComboBox(options) {
	    _classCallCheck(this, ProjectTypeComboBox);

	    var _this = this;

	    this.id = (0, _Utils.guid)();

	    var typeList = [{ id: '1', nama: "Proyek Lama Non JO/Non KSO" }, { id: '2', nama: "Proyek Lama JO/KSO" }, { id: '3', nama: "Proyek Baru Sudah Diperoleh Non JO/Non KSO" }, { id: '4', nama: "Proyek Baru Sudah Diperoleh JO/KSO" }, { id: '5', nama: "Proyek Baru Dalam Pengusahaan Non JO/Non KSO" }, { id: '6', nama: "Proyek Baru Dalam Pengusahaan JO/KSO" }];
	    var comboBoxOptions = {
	      displayMember: "nama",
	      valueMember: "id",
	      selectedIndex: 0,
	      width: options.width,
	      height: 25,
	      theme: 'metro',
	      selectionMode: 'dropDownList'
	    };

	    this.comboBox = new _ComboBox2.default({
	      localData: typeList,
	      value: options.value,
	      comboBoxOptions: comboBoxOptions,
	      onChange: function onChange(value) {
	        if (options.onChange) {
	          options.onChange(value);
	        }
	      }
	    });
	  }

	  _createClass(ProjectTypeComboBox, [{
	    key: 'getId',
	    value: function getId() {
	      return this.comboBox.getId();
	    }
	  }, {
	    key: 'render',
	    value: function render(container) {
	      this.comboBox.render(container);
	    }
	  }, {
	    key: 'getValue',
	    value: function getValue() {
	      return this.comboBox.getValue();
	    }
	  }]);

	  return ProjectTypeComboBox;
	}();

	exports.default = ProjectTypeComboBox;

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	var _Form = __webpack_require__(16);

	var _Form2 = _interopRequireDefault(_Form);

	var _EditWindow = __webpack_require__(22);

	var _EditWindow2 = _interopRequireDefault(_EditWindow);

	var _TextBox = __webpack_require__(11);

	var _TextBox2 = _interopRequireDefault(_TextBox);

	var _TextArea = __webpack_require__(18);

	var _TextArea2 = _interopRequireDefault(_TextArea);

	var _Label = __webpack_require__(19);

	var _Label2 = _interopRequireDefault(_Label);

	var _ProjectTypeComboBox = __webpack_require__(20);

	var _ProjectTypeComboBox2 = _interopRequireDefault(_ProjectTypeComboBox);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EditProjectWindow = function () {
	  function EditProjectWindow(options) {
	    _classCallCheck(this, EditProjectWindow);

	    var _this = this;

	    this.id = (0, _Utils.guid)();

	    var project = options.data;
	    this.onSaveSuccess = options.onSaveSuccess;

	    var codeTextBox = new _TextBox2.default({ value: project.code, disabled: true, height: 25, width: '90%' });
	    var nameTextBox = new _TextBox2.default({ value: project.name, height: 25, width: '90%' });
	    var projectTypeComboBox = new _ProjectTypeComboBox2.default({ value: project.projectType, height: 80, width: '92.5%' });
	    var descriptionTextBox = new _TextArea2.default({ value: project.description, height: 80, width: '92.5%' });

	    var formItems = [{
	      name: 'code',
	      label: 'Code',
	      content: codeTextBox,
	      validation: {
	        type: 'TEXTBOX',
	        rule: 'required'
	      }
	    }, {
	      name: 'name',
	      label: 'Name',
	      content: nameTextBox,
	      validation: {
	        type: 'TEXTBOX',
	        rule: 'required'
	      }
	    }, {
	      name: 'project_type',
	      label: 'Type',
	      content: projectTypeComboBox,
	      validation: {
	        type: 'COMBOBOX',
	        rule: 'required'
	      }
	    }, {
	      name: 'description',
	      label: 'Description',
	      content: descriptionTextBox
	    }];
	    var formOptions = {
	      items: formItems,
	      labelColumnWidth: '120px',
	      onValidationSuccess: function onValidationSuccess(formValue) {
	        $.ajax({
	          method: "PUT",
	          url: "/api/projects/" + project.code,
	          data: JSON.stringify(formValue),
	          beforeSend: function beforeSend(xhr) {
	            xhr.setRequestHeader('Accept', 'application/json');
	            xhr.setRequestHeader('Content-Type', 'application/json');
	          }
	        }).done(function () {
	          $("#successNotification").jqxNotification("open");
	          _this.window.close();
	          if (_this.onSaveSuccess) {
	            _this.onSaveSuccess();
	          }
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	          var errorMessage = 'Proses gagal. Status : ' + jqXHR.status + ' [' + jqXHR.statusText + '] : ' + jqXHR.responseText;
	          $("#errorNotification").html('<div>' + errorMessage + '</div>');
	          $("#errorNotification").jqxNotification("open");
	        });
	      }
	    };

	    var form = new _Form2.default(formOptions);

	    this.window = new _EditWindow2.default({
	      width: 390,
	      height: 280,
	      title: 'Edit Project',
	      content: form,
	      onSave: function onSave() {
	        form.validate();
	      },
	      onCancel: function onCancel() {
	        _this.window.close();
	      },
	      onDelete: function onDelete() {
	        var r = confirm("Proses hapus data akan dilakukan!");
	        if (r == true) {
	          $.ajax({
	            method: "DELETE",
	            url: "/api/projects/" + project.code,
	            data: {}
	          }).done(function () {
	            $("#successNotification").jqxNotification("open");
	            _this.window.close();
	            if (_this.onSaveSuccess) {
	              _this.onSaveSuccess();
	            }
	          }).fail(function (jqXHR, textStatus, errorThrown) {
	            var errorMessage = 'Proses gagal. Status : ' + jqXHR.status + ' [' + jqXHR.statusText + '] : ' + jqXHR.responseText;
	            $("#errorNotification").html('<div>' + errorMessage + '</div>');
	            $("#errorNotification").jqxNotification("open");
	          });
	        }
	      }
	    });
	  }

	  _createClass(EditProjectWindow, [{
	    key: 'render',
	    value: function render(container) {
	      var _this = this;
	      this.window.render(container);
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      this.window.open();
	    }
	  }]);

	  return EditProjectWindow;
	}();

	exports.default = EditProjectWindow;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var EditWindow = function () {
	  function EditWindow(options) {
	    _classCallCheck(this, EditWindow);

	    this.id = (0, _Utils.guid)();
	    this.content = options.content;

	    if (options.title) {
	      this.title = options.title;
	    } else {
	      this.title = '';
	    }

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    if (options.buttons) {} else {
	      this.deleteButton = new _Button2.default({
	        title: 'Delete',
	        template: 'danger',
	        onClick: function onClick() {
	          if (options.onDelete) {
	            options.onDelete();
	          }
	        }
	      });

	      this.saveButton = new _Button2.default({
	        title: 'Save',
	        template: 'success',
	        onClick: function onClick() {
	          if (options.onSave) {
	            options.onSave();
	          }
	        }
	      });

	      this.cancelButton = new _Button2.default({
	        title: 'Cancel',
	        onClick: function onClick() {
	          if (options.onCancel) {
	            options.onCancel();
	          }
	        }
	      });
	    }
	  }

	  _createClass(EditWindow, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var windowContainer = $('<div></div>');
	      windowContainer.appendTo(container);

	      windowContainer.attr('id', this.id);

	      var windowTitle = $('<div>' + this.title + '</div>');
	      windowTitle.appendTo(windowContainer);

	      var windowContent = $('<div></div>');
	      windowContent.appendTo(windowContainer);

	      var windowOptions = {
	        theme: 'metro',
	        isModal: true,
	        autoOpen: false
	      };

	      if (this.width) {
	        windowOptions['width'] = this.width;
	      }

	      if (this.height) {
	        windowOptions['height'] = this.height;
	      }

	      windowContainer.jqxWindow(windowOptions);

	      windowContainer.on('close', function (event) {
	        windowContainer.jqxWindow('destroy');
	      });

	      var table = $('<table style="height: 100%; width: 100%;"></table>');
	      var tr = $('<tr></tr>');
	      var td = $('<td></td>');
	      table.appendTo(windowContent);
	      tr.appendTo(table);
	      td.appendTo(tr);
	      this.content.render(td);

	      tr = $('<tr></tr>');
	      td = $('<td></td>');
	      tr.appendTo(table);
	      td.appendTo(tr);

	      var innerTable = $('<table style="height: 100%; width: 100%;"></table>');
	      var innerTr = $('<tr></tr>');
	      var innerTd = $('<td style="width: 90%;"></td>');
	      innerTable.appendTo(td);
	      innerTr.appendTo(innerTable);
	      innerTd.appendTo(innerTr);

	      innerTd = $('<td></td>');
	      innerTd.appendTo(innerTr);
	      innerTd.css('padding-right', '20px');
	      this.deleteButton.render(innerTd);

	      innerTd = $('<td></td>');
	      innerTd.appendTo(innerTr);
	      this.cancelButton.render(innerTd);

	      innerTd = $('<td></td>');
	      innerTd.appendTo(innerTr);
	      this.saveButton.render(innerTd);

	      this.windowContainer = windowContainer;
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'open',
	    value: function open() {
	      this.windowContainer.jqxWindow('open');
	    }
	  }, {
	    key: 'close',
	    value: function close() {
	      this.windowContainer.jqxWindow('close');
	    }
	  }, {
	    key: 'destroy',
	    value: function destroy() {
	      this.windowContainer.jqxWindow('destroy');
	    }
	  }]);

	  return EditWindow;
	}();

	exports.default = EditWindow;

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	var _Button = __webpack_require__(8);

	var _Button2 = _interopRequireDefault(_Button);

	var _ToggleButton = __webpack_require__(10);

	var _ToggleButton2 = _interopRequireDefault(_ToggleButton);

	var _TextBox = __webpack_require__(11);

	var _TextBox2 = _interopRequireDefault(_TextBox);

	var _DataGrid = __webpack_require__(14);

	var _DataGrid2 = _interopRequireDefault(_DataGrid);

	var _FileUpload = __webpack_require__(24);

	var _FileUpload2 = _interopRequireDefault(_FileUpload);

	var _AddProjectWindow = __webpack_require__(15);

	var _AddProjectWindow2 = _interopRequireDefault(_AddProjectWindow);

	var _EditProjectWindow = __webpack_require__(21);

	var _EditProjectWindow2 = _interopRequireDefault(_EditProjectWindow);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var ProjectProgressList = function () {
	  function ProjectProgressList() {
	    _classCallCheck(this, ProjectProgressList);

	    this.id = (0, _Utils.guid)();
	  }

	  _createClass(ProjectProgressList, [{
	    key: 'render',
	    value: function render(container) {

	      var _this = this;

	      var url = "/api/project_progress";

	      var source = {
	        datatype: "json",
	        datafields: [{ name: 'id', type: 'int' }, { name: 'project_code', type: 'string' }, { name: 'month', type: 'int' }, { name: 'year', type: 'int' }, { name: 'rkap_ok', type: 'float' }, { name: 'rkap_op', type: 'float' }, { name: 'rkap_lk', type: 'float' }, { name: 'prognosa_ok', type: 'float' }, { name: 'prognosa_op', type: 'float' }, { name: 'prognosa_lk', type: 'float' }, { name: 'realisasi_ok', type: 'float' }, { name: 'realisasi_op', type: 'float' }, { name: 'realisasi_lk', type: 'float' }, { name: 'description', type: 'string' }],
	        id: "id",
	        url: url
	      };

	      var onSearch = function onSearch(data) {
	        data['searchTxt'] = searchTextBox.getValue();
	        return data;
	      };

	      var columnWidth = 100 / 12 + '%';
	      var dataGridOptions = {
	        width: '100%',
	        height: '100%',
	        groupable: true,
	        pageable: true,
	        altrows: true,
	        theme: 'metro',
	        virtualmode: true,
	        rendergridrows: function rendergridrows(params) {
	          return params.data;
	        },
	        columns: [{ text: 'Project Code', datafield: 'project_code', width: columnWidth }, { text: 'Bulan', datafield: 'month', width: columnWidth }, { text: 'Tahun', datafield: 'year', width: columnWidth }, { text: 'RKAP OK', datafield: 'rkap_ok', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'RKAP OP', datafield: 'rkap_op', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'RKAP LK', datafield: 'rkap_lk', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'Prognosa OK', datafield: 'prognosa_ok', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'Prognosa OP', datafield: 'prognosa_op', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'Prognosa LK', datafield: 'prognosa_lk', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'Realisasi OK', datafield: 'realisasi_ok', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'Realisasi OP', datafield: 'realisasi_op', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }, { text: 'Realisasi LK', datafield: 'realisasi_lk', width: columnWidth, cellsalign: 'right', cellsformat: 'd2' }],
	        groups: ['project_code']
	      };

	      this.dataGrid = new _DataGrid2.default({
	        source: source,
	        onSearch: onSearch,
	        onRowDoubleClick: function onRowDoubleClick(data) {
	          // var editProjectWindow = new EditProjectWindow({
	          //   data: data,
	          //   onSaveSuccess: function(){
	          //     _this.dataGrid.refresh();
	          //   }
	          // });
	          // editProjectWindow.render($('#dialogWindowContainer'));
	          // editProjectWindow.open();
	        },
	        dataGridOptions: dataGridOptions
	      });

	      var searchTextBox = new _TextBox2.default({ placeHolder: 'Kode atau Nama', width: 250, height: 24 });
	      var searchButton = new _Button2.default({
	        imgSrc: '/pcd_assets/images/search.png',
	        theme: 'metro',
	        width: 30,
	        height: 26,
	        onClick: function onClick() {
	          _this.dataGrid.refresh();
	        }
	      });

	      // var fileUpload = new FileUpload({height: 35, width: 103, uploadUrl: '/project_progress/upload', fileInputName: 'progress'});
	      var fileUpload = new _FileUpload2.default({
	        height: 35,
	        width: 103,
	        uploadUrl: 'project_progress/upload',
	        fileInputName: 'progress'
	      });

	      // var uploadButton = new Button({
	      //   title:'Upload',
	      //   template: 'primary',
	      //   height: 26,
	      //   onClick: function(){
	      //     fileUpload.uploadFile();
	      //   }
	      // });

	      var table = $('<table style="height: 100%; width: 100%; margin: -3px; "></table>');
	      var tr = $('<tr></tr>');
	      var td = $('<td style="padding: 0; height: 40px;"></td>');
	      table.appendTo(container);
	      tr.appendTo(table);
	      td.appendTo(tr);

	      var innerTable = $('<table style="height: 100%; width: 100%;"></table>');
	      var innerTr = $('<tr></tr>');
	      var innerTd = $('<td style="padding-top: 6px; padding-left: 10px; padding-right: 8px; width: 50px; height: 100%;"></td>');
	      innerTable.appendTo(td);
	      innerTr.appendTo(innerTable);
	      innerTd.appendTo(innerTr);
	      fileUpload.render(innerTd);

	      // innerTd = $('<td style="padding-top: 6px; width: 70px; height: 100%;"></td>');
	      // innerTd.appendTo(innerTr);
	      // uploadButton.render(innerTd);

	      innerTd = $('<td style="padding-top: 6px; width: 200px; height: 100%;"></td>');
	      innerTd.appendTo(innerTr);
	      searchTextBox.render(innerTd);

	      innerTd = $('<td style="padding-top: 6px; height: 100%; "></td>');
	      var _tempContainer = $('<div style="margin-left: -5px;"></div>');
	      _tempContainer.appendTo(innerTd);
	      innerTd.appendTo(innerTr);
	      searchButton.render(_tempContainer);

	      tr = $('<tr></tr>');
	      td = $('<td style="padding: 0;"></td>');
	      tr.appendTo(table);
	      td.appendTo(tr);

	      this.dataGrid.render(td);
	    }
	  }]);

	  return ProjectProgressList;
	}();

	exports.default = ProjectProgressList;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _Utils = __webpack_require__(3);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//DON'T PUT THIS IN <form></form> TAG
	//THIS IS NOT PART OF FORM!!!!!

	var FileUpload = function () {
	  function FileUpload(options) {
	    _classCallCheck(this, FileUpload);

	    this.id = (0, _Utils.guid)();

	    if (options.width) {
	      this.width = options.width;
	    }

	    if (options.height) {
	      this.height = options.height;
	    }

	    this.uploadUrl = options.uploadUrl;
	    this.fileInputName = options.fileInputName;
	  }

	  _createClass(FileUpload, [{
	    key: 'render',
	    value: function render(container) {
	      var fileUploadContainer = $('<div></div>');
	      fileUploadContainer.attr('id', this.id);
	      fileUploadContainer.appendTo(container);

	      var fileUploadOptions = {
	        theme: 'metro'
	      };

	      if (this.width) {
	        fileUploadOptions['width'] = this.width;
	      } else {
	        fileUploadOptions['width'] = 300;
	      }

	      if (this.height) {
	        fileUploadOptions['height'] = this.height;
	      }

	      fileUploadOptions['uploadUrl'] = this.uploadUrl;
	      fileUploadOptions['fileInputName'] = this.fileInputName;
	      fileUploadOptions['multipleFilesUpload'] = false;
	      fileUploadOptions['autoUpload'] = true;

	      fileUploadContainer.jqxFileUpload(fileUploadOptions);

	      this.component = fileUploadContainer;
	    }
	  }, {
	    key: 'getId',
	    value: function getId() {
	      return this.id;
	    }
	  }, {
	    key: 'upload',
	    value: function upload() {
	      return this.component.jqxFileUpload('uploadAll');
	    }
	  }]);

	  return FileUpload;
	}();

	exports.default = FileUpload;

/***/ }
/******/ ]);