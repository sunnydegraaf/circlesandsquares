// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"utils/joystick.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Joystick =
/*#__PURE__*/
function () {
  /**
   * Creates a joystick object for one player
   * @param joystickNumber The number of the first joystick starts at 0
   * @param numOfButtons The number of buttons needed by your game
   */
  function Joystick(joystickNumber, numOfButtons) {
    _classCallCheck(this, Joystick);

    // BUT1 and BUT2 are the indexes of the redirect function. 
    // When both are pressed, redirect to homepage
    this.BUT1 = 8;
    this.BUT2 = 9; // FIELDS

    this.joystickNumber = 0;
    this.numberOfBUttons = 0;
    this.axes = []; // private isConnected     : boolean = false

    this.isConnected = false;
    this.joystickNumber = joystickNumber;
    this.numberOfBUttons = numOfButtons;
  } // PROPERTIES
  // axes for directional use 
  // values are -1, 0, 1 because arcade sticks are digital


  _createClass(Joystick, [{
    key: "update",
    value: function update() {
      if (this.isConnected) {
        var gamepad = navigator.getGamepads()[this.gamepad.index];

        if (gamepad) {
          this.readGamepad(gamepad);
        }
      }
    }
  }, {
    key: "readGamepad",
    value: function readGamepad(gamepad) {
      for (var index = 0; index < this.numberOfBUttons; index++) {
        if (this.buttonPressed(gamepad.buttons[index]) && !this.buttonPressed(this.previousGamepad.buttons[index])) {
          var eventName = 'joystick' + this.JoystickNumber + 'button' + index;
          console.log("Dispatch event: " + eventName);
          document.dispatchEvent(new Event(eventName));
        }

        if (this.buttonPressed(gamepad.buttons[this.BUT1]) && this.buttonPressed(gamepad.buttons[this.BUT2]) && (!this.buttonPressed(this.previousGamepad.buttons[this.BUT1]) || !this.buttonPressed(this.previousGamepad.buttons[this.BUT2]))) {
          document.dispatchEvent(new Event('redirect'));
        }
      } // gamepad has 4 axes, first is x, second is y
      // an axe returns a float, only int is needed


      this.axes[0] = Math.round(gamepad.axes[0]);
      this.axes[1] = Math.round(gamepad.axes[1]);
      this.previousGamepad = gamepad;
    }
    /**
     * Helper function to filter some bad input
     * @param b
     */

  }, {
    key: "buttonPressed",
    value: function buttonPressed(b) {
      if (_typeof(b) == "object") {
        return b.pressed;
      }

      return b == 1.0;
    }
  }, {
    key: "destroy",
    value: function destroy() {}
  }, {
    key: "X",
    get: function get() {
      return Math.round(this.axes[0]);
    }
  }, {
    key: "Y",
    get: function get() {
      return Math.round(this.axes[1]);
    } // Joystick identifier

  }, {
    key: "JoystickNumber",
    get: function get() {
      return this.joystickNumber;
    } // Current gamepad

  }, {
    key: "Gamepad",
    get: function get() {
      return this.gamepad;
    },
    set: function set(gamepad) {
      this.gamepad = gamepad;
    } // previous gamepad

  }, {
    key: "PreviousGamepad",
    get: function get() {
      return this.previousGamepad;
    },
    set: function set(previousGamepad) {
      this.previousGamepad = previousGamepad;
    }
  }]);

  return Joystick;
}();

exports.Joystick = Joystick;
},{}],"utils/arcade.ts":[function(require,module,exports) {
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var joystick_1 = require("./joystick");

var Arcade =
/*#__PURE__*/
function () {
  /**
   * Creates an arcade 'cabinet'
   */
  function Arcade() {
    var _this = this;

    _classCallCheck(this, Arcade);

    this.REDIRECT_URL = "http://hr-cmgt.github.io/arcade-server";
    this.joysticks = [];
    document.addEventListener("redirect", function () {
      return _this.onRedirect();
    });
    window.addEventListener("gamepadconnected", function (e) {
      return _this.onGamePadConnected(e);
    });
    window.addEventListener("gamepaddisconnected", function (e) {
      return _this.onGamePadDisconnected(e);
    });
  } // PROPERTIES


  _createClass(Arcade, [{
    key: "onRedirect",

    /**
     * Handles redirect fired from joystick
     */
    value: function onRedirect() {
      window.location.href = this.REDIRECT_URL;
    }
    /**
     * Handles connecting a joystick
     * @param e Gamepad event
     */

  }, {
    key: "onGamePadConnected",
    value: function onGamePadConnected(e) {
      console.log('Game pad connected');
      console.log("Joystick number: " + e.gamepad.index);
      var joystick = this.createAndAddJoystick(e.gamepad.index, 6);
      joystick.isConnected = true;
      joystick.PreviousGamepad = joystick.Gamepad;
      joystick.Gamepad = e.gamepad;

      if (joystick.PreviousGamepad == null) {
        joystick.PreviousGamepad = e.gamepad;
      }
    }
    /**
     * Handles disconnecting a joystick
     * @param e Gamepad event
     */

  }, {
    key: "onGamePadDisconnected",
    value: function onGamePadDisconnected(e) {
      this.removeJoystick(e.gamepad.index);
    }
    /**
     * Creates an Joystick and adds it to this arcade
     * @param joystickNumber Unique identifier given by the joystick
     * @param numOfButtons Sets number of buttons on joystick
     */

  }, {
    key: "createAndAddJoystick",
    value: function createAndAddJoystick(joystickNumber, numOfButtons) {
      var joystickCheck = this.getJoystickByNumber(joystickNumber);

      if (joystickCheck != null) {
        return joystickCheck;
      }

      var joystickNew = new joystick_1.Joystick(joystickNumber, numOfButtons);
      this.joysticks[joystickNumber] = joystickNew;
      return joystickNew;
    }
    /**
     * Removes a Joystick from this arcade
     * @param joystickNumber Unique identifier of the joystick
     */

  }, {
    key: "removeJoystick",
    value: function removeJoystick(joystickNumber) {
      var joystickCheck = this.getJoystickByNumber(joystickNumber);

      if (joystickCheck == null) {
        return;
      }

      var index = this.joysticks.indexOf(joystickCheck);
      this.joysticks[index].destroy();

      if (index > -1) {
        this.joysticks.splice(index, 1);
      }
    }
    /**
     * Get a Joystick with its unique identifier
     * @param joystickNumber Unique identifier given by the joystick
     */

  }, {
    key: "getJoystickByNumber",
    value: function getJoystickByNumber(joystickNumber) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.joysticks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var joystick = _step.value;

          if (joystick.JoystickNumber == joystickNumber) {
            return joystick;
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }, {
    key: "Joysticks",
    get: function get() {
      return this.joysticks;
    }
  }]);

  return Arcade;
}();

exports.Arcade = Arcade;
},{"./joystick":"utils/joystick.ts"}],"CST.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CST = {
  SCENES: {
    LOAD: "LOAD",
    MENU: "MENU",
    PLAY: "PLAY",
    GAMEOVER: "GAMEOVER"
  },
  IMAGE: {
    OPTIONS: "options_button2.png",
    PLAY: "play_button2.png",
    TITLE: "background2.jpg"
  },
  AUDIO: {},
  SPRITE: {}
};
},{}],"assets/image/block.png":[function(require,module,exports) {
module.exports = "/block.50bf629f.png";
},{}],"assets/image/enemy.png":[function(require,module,exports) {
module.exports = "/enemy.bb5a0a1e.png";
},{}],"assets/image/character.png":[function(require,module,exports) {
module.exports = "/character.6e2ca09d.png";
},{}],"assets/image/Food.png":[function(require,module,exports) {
module.exports = "/Food.2497f5cd.png";
},{}],"assets/image/play_button2.png":[function(require,module,exports) {
module.exports = "/play_button2.cb213a99.png";
},{}],"assets/image/options_button2.png":[function(require,module,exports) {
module.exports = "/options_button2.855eb198.png";
},{}],"assets/image/background2.jpg":[function(require,module,exports) {
module.exports = "/background2.80d45458.jpg";
},{}],"assets/image/restart_button.png":[function(require,module,exports) {
module.exports = "/restart_button.d0b2016b.png";
},{}],"assets/image/menu_button.png":[function(require,module,exports) {
module.exports = "/menu_button.7f7689a0.png";
},{}],"assets/image/tileset_dungeon2.png":[function(require,module,exports) {
module.exports = "/tileset_dungeon2.3d3957b7.png";
},{}],"assets/maps/level1.json":[function(require,module,exports) {
module.exports = {
  "height": 15,
  "infinite": false,
  "layers": [{
    "data": "KgAAACoAAAAwAAAAKgAAACoAAAAqAAAAMAAAACoAAAAwAAAAMAAAACoAAAAwAAAAMAAAACoAAAAwAAAAKgAAACoAAAAqAAAAMAAAACoAAAAqAAAAKgAAADAAAAAqAAAAKgAAACoAAAAwAAAAMAAAADAAAAAwAAAAMAAAACoAAAAwAAAAMAAAACoAAAAwAAAAMAAAADAAAAAwAAAAMAAAACoAAAAqAAAAKgAAACoAAAAwAAAAKgAAACoAAAAwAAAAKgAAACoAAAAwAAAAKgAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAqAAAAKgAAACoAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAqAAAAKgAAACoAAAAwAAAAMAAAADAAAAAqAAAAKgAAACoAAAAqAAAAMAAAACoAAAAqAAAAMAAAADAAAAAqAAAAMAAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAACoAAAAwAAAAKgAAACoAAAAwAAAAKgAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAACoAAAAwAAAAMAAAACoAAAAwAAAAMAAAADAAAAAwAAAAKgAAADAAAAAwAAAAKgAAACoAAAAqAAAAKgAAACoAAAAwAAAAMAAAACoAAAAwAAAAKgAAACoAAAAqAAAAMAAAACoAAAAqAAAAMAAAADAAAAAwAAAAMAAAACoAAAAqAAAAMAAAACoAAAAqAAAAMAAAACoAAAAwAAAAMAAAADAAAAAqAAAAMAAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAwAAAAMAAAACoAAAAwAAAAKgAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAwAAAAMAAAACoAAAAwAAAAKgAAADAAAAAwAAAAKgAAADAAAAAwAAAAMAAAADAAAAAqAAAAKgAAADAAAAAwAAAAMAAAACoAAAAqAAAAKgAAACoAAAAwAAAAMAAAACoAAAAqAAAAKgAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAwAAAAKgAAADAAAAAwAAAAKgAAACoAAAAwAAAAMAAAADAAAAAqAAAAKgAAADAAAAAqAAAAKgAAADAAAAAwAAAAMAAAACoAAAAwAAAAMAAAADAAAAAwAAAAKgAAACoAAAAqAAAAKgAAADAAAAAwAAAAMAAAACoAAAAwAAAAMAAAADAAAAAqAAAAMAAAADAAAAAwAAAAKgAAADAAAAAqAAAAMAAAACoAAAAwAAAAKgAAACoAAAAqAAAAMAAAADAAAAAwAAAAKgAAADAAAAAwAAAAMAAAADAAAAAwAAAAMAAAADAAAAAqAAAAKgAAADAAAAAwAAAAKgAAADAAAAAwAAAAMAAAADAAAAAwAAAAKgAAADAAAAAwAAAAKgAAADAAAAAwAAAAMAAAACoAAAAwAAAAKgAAACoAAAAqAAAAKgAAACoAAAAwAAAAMAAAACoAAAAqAAAAKgAAACoAAAAqAAAAKgAAACoAAAAwAAAAKgAAADAAAAAwAAAAKgAAACoAAAAqAAAA",
    "encoding": "base64",
    "height": 15,
    "id": 1,
    "name": "ground",
    "opacity": 1,
    "type": "tilelayer",
    "visible": false,
    "width": 20,
    "x": 0,
    "y": 0
  }, {
    "data": "JQAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACYAAAAmAAAAJgAAACcAAAAtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwAAAC0AAAAAAAAAKAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAoAAAAKAAAACgAAAAAAAAAKAAAAAAAAAAvAAAALQAAAAAAAAAwAAAAAAAAACUAAAAnAAAAAAAAACgAAAAoAAAAKAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAKAAAAAAAAAAwAAAAAAAAAC8AAAAtAAAAAAAAACgAAAAAAAAALQAAAC8AAAAAAAAAAAAAAAAAAAAoAAAAAAAAACgAAAAoAAAAKAAAAAAAAAAoAAAAAAAAACgAAAAAAAAALwAAAC0AAAAAAAAAKAAAAAAAAAAtAAAALwAAAAAAAAAoAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAoAAAAAAAAACgAAAAAAAAAKAAAAAAAAAAvAAAALQAAAAAAAAAoAAAAAAAAADUAAAA3AAAAAAAAACgAAAAAAAAAAAAAAAAAAAAoAAAAKAAAACgAAAAAAAAAKAAAACgAAAAoAAAAAAAAAC8AAAAtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAACgAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwAAAC0AAAAAAAAAKAAAACgAAAAAAAAAKAAAAAAAAAAAAAAAAAAAACgAAAAAAAAAKAAAAAAAAAAoAAAAKAAAADAAAAAoAAAAKAAAAAAAAAAvAAAALQAAAAAAAAAoAAAAAAAAAAAAAAAoAAAAMAAAACgAAAAAAAAAKAAAAAAAAAAoAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAC8AAAAtAAAAAAAAADAAAAAAAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAKAAAAAAAAAAoAAAAKAAAACgAAAAAAAAALwAAAC0AAAAAAAAAKAAAAAAAAAAAAAAAKAAAACgAAAAoAAAAMAAAACgAAAAAAAAAKAAAAAAAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAvAAAALQAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAKAAAACgAAAAwAAAAKAAAACgAAAAoAAAAAAAAAC8AAAAtAAAAAAAAACgAAAAAAAAAKAAAACgAAAAoAAAAKAAAACgAAAAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALwAAADUAAAA2AAAANgAAADYAAAA2AAAANgAAADYAAAA2AAAANgAAADYAAAA2AAAANgAAADYAAAA2AAAANgAAADYAAAA2AAAANgAAADYAAAA3AAAA",
    "encoding": "base64",
    "height": 15,
    "id": 3,
    "name": "top",
    "opacity": 1,
    "type": "tilelayer",
    "visible": true,
    "width": 20,
    "x": 0,
    "y": 0
  }, {
    "data": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAA8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAAAAAAAAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwAAAAAAAAAAAAAAAAAAAAcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAA8AAAAAAAAAGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
    "encoding": "base64",
    "height": 15,
    "id": 2,
    "name": "wall",
    "opacity": 1,
    "type": "tilelayer",
    "visible": false,
    "width": 20,
    "x": 0,
    "y": 0
  }, {
    "draworder": "topdown",
    "id": 5,
    "name": "pushBlocks",
    "objects": [{
      "gid": 65,
      "height": 32,
      "id": 16,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 64,
      "y": 128
    }, {
      "gid": 65,
      "height": 32,
      "id": 17,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 64,
      "y": 352
    }, {
      "gid": 65,
      "height": 32,
      "id": 18,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 64,
      "y": 416
    }, {
      "gid": 65,
      "height": 32,
      "id": 19,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 192,
      "y": 320
    }, {
      "gid": 65,
      "height": 32,
      "id": 20,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 256,
      "y": 384
    }, {
      "gid": 65,
      "height": 32,
      "id": 22,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 224,
      "y": 96
    }, {
      "gid": 65,
      "height": 32,
      "id": 23,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 352,
      "y": 352
    }, {
      "gid": 65,
      "height": 32,
      "id": 24,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 480,
      "y": 288
    }, {
      "gid": 65,
      "height": 32,
      "id": 25,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 448,
      "y": 416
    }, {
      "gid": 65,
      "height": 32,
      "id": 26,
      "name": "",
      "rotation": 0,
      "type": "",
      "visible": true,
      "width": 32,
      "x": 544,
      "y": 128
    }],
    "opacity": 1,
    "type": "objectgroup",
    "visible": true,
    "x": 0,
    "y": 0
  }],
  "nextlayerid": 6,
  "nextobjectid": 27,
  "orientation": "orthogonal",
  "renderorder": "right-down",
  "tiledversion": "1.2.3",
  "tileheight": 32,
  "tilesets": [{
    "columns": 8,
    "firstgid": 1,
    "image": "..\/..\/..\/..\/..\/..\/Downloads\/dungeonTileset.png",
    "imageheight": 256,
    "imagewidth": 256,
    "margin": 0,
    "name": "dungeonTileset",
    "spacing": 0,
    "tilecount": 64,
    "tileheight": 32,
    "tiles": [{
      "id": 36,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 37,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 38,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 39,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 44,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 45,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 46,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 52,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 53,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }, {
      "id": 54,
      "properties": [{
        "name": "collides",
        "type": "bool",
        "value": true
      }]
    }],
    "tilewidth": 32
  }, {
    "columns": 1,
    "firstgid": 65,
    "image": "..\/..\/..\/..\/..\/..\/Downloads\/block.png",
    "imageheight": 32,
    "imagewidth": 32,
    "margin": 0,
    "name": "block",
    "spacing": 0,
    "tilecount": 1,
    "tileheight": 32,
    "tilewidth": 32
  }],
  "tilewidth": 32,
  "type": "map",
  "version": 1.2,
  "width": 20
};
},{}],"scenes/LoadScene.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST");

var LoadScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(LoadScene, _Phaser$Scene);

  function LoadScene() {
    _classCallCheck(this, LoadScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoadScene).call(this, {
      key: CST_1.CST.SCENES.LOAD
    }));
  }

  _createClass(LoadScene, [{
    key: "loadImages",
    value: function loadImages() {
      this.load.spritesheet("pushBlock", require("../assets/image/block.png"), {
        frameWidth: 32,
        frameHeight: 32
      });
      this.load.spritesheet("monster", require("../assets/image/enemy.png"), {
        frameWidth: 32,
        frameHeight: 32
      });
      this.load.spritesheet("characterBait", require("../assets/image/character.png"), {
        frameWidth: 32,
        frameHeight: 32
      });
      this.load.spritesheet("bait", require("../assets/image/Food.png"), {
        frameWidth: 16,
        frameHeight: 16
      });
      this.load.image("play_button", require("../assets/image/play_button2.png"));
      this.load.image("options_button", require("../assets/image/options_button2.png"));
      this.load.image("background", require("../assets/image/background2.jpg"));
      this.load.image("restart_button", require("../assets/image/restart_button.png"));
      this.load.image("menu_button", require("../assets/image/menu_button.png"));
    }
  }, {
    key: "preload",
    value: function preload() {
      var _this = this;

      this.loadImages(); //load map

      this.load.image("Dungeon", require("../assets/image/tileset_dungeon2.png"));
      this.load.tilemapTiledJSON("mappy", require("../assets/maps/level1.json")); // loading bar

      var progressBar = this.add.graphics();
      var progressBox = this.add.graphics();
      progressBox.fillStyle(0x222222, 0.8);
      progressBox.fillRect(160.5, 270, 320, 50);
      var width = this.cameras.main.width;
      var height = this.cameras.main.height;
      var loadingText = this.make.text({
        x: width / 2,
        y: height / 2 - 50,
        text: 'Loading...',
        style: {
          font: '20px monospace',
          fill: '#ffffff'
        }
      });
      loadingText.setOrigin(0.5, 0.5);
      var percentText = this.make.text({
        x: width / 2,
        y: height / 2 - 5,
        text: '0%',
        style: {
          font: '18px monospace',
          fill: '#ffffff'
        }
      });
      percentText.setOrigin(0.5, 0.5);
      var assetText = this.make.text({
        x: width / 2,
        y: height / 2 + 50,
        text: '',
        style: {
          font: '18px monospace',
          fill: '#ffffff'
        }
      });
      assetText.setOrigin(0.5, 0.5); // @ts-ignore

      this.load.on('progress', function (value) {
        // @ts-ignore
        percentText.setText(parseInt(value * 100) + '%');
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(175.5, 280, 290 * value, 30);
      }); // @ts-ignore

      this.load.on('fileprogress', function (file) {
        assetText.setText('Loading asset: ' + file.key);
      });
      this.load.on("complete", function () {
        progressBar.destroy();
        progressBox.destroy();
        loadingText.destroy();
        percentText.destroy();
        assetText.destroy();

        _this.scene.start(CST_1.CST.SCENES.MENU);
      }); //simulate large load

      for (var i = 0; i < 200; i++) {
        this.load.spritesheet("cat" + i, "./assets/cat.png", {
          frameHeight: 32,
          frameWidth: 32
        });
      }
    }
  }]);

  return LoadScene;
}(Phaser.Scene);

exports.LoadScene = LoadScene;
},{"../CST":"CST.ts","../assets/image/block.png":"assets/image/block.png","../assets/image/enemy.png":"assets/image/enemy.png","../assets/image/character.png":"assets/image/character.png","../assets/image/Food.png":"assets/image/Food.png","../assets/image/play_button2.png":"assets/image/play_button2.png","../assets/image/options_button2.png":"assets/image/options_button2.png","../assets/image/background2.jpg":"assets/image/background2.jpg","../assets/image/restart_button.png":"assets/image/restart_button.png","../assets/image/menu_button.png":"assets/image/menu_button.png","../assets/image/tileset_dungeon2.png":"assets/image/tileset_dungeon2.png","../assets/maps/level1.json":"assets/maps/level1.json"}],"scenes/MenuScene.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST");

var MenuScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(MenuScene, _Phaser$Scene);

  function MenuScene() {
    _classCallCheck(this, MenuScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(MenuScene).call(this, {
      key: CST_1.CST.SCENES.MENU
    }));
  }

  _createClass(MenuScene, [{
    key: "init",
    value: function init() {}
  }, {
    key: "create",
    value: function create() {
      var _this = this;

      //creating the menu screen
      //create images
      var background = this.add.image(0, 0, "background").setOrigin(0).setDepth(0);
      var playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "play_button").setDepth(1);
      var optionsButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "options_button").setDepth(1);
      playButton.setInteractive();
      playButton.on("pointerup", function () {
        _this.scene.start(CST_1.CST.SCENES.PLAY);
      });
      optionsButton.setInteractive();
      optionsButton.on("pointerup", function () {//options
      });
    }
  }]);

  return MenuScene;
}(Phaser.Scene);

exports.MenuScene = MenuScene;
},{"../CST":"CST.ts"}],"objects/characterBait.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var characterBait =
/*#__PURE__*/
function (_Phaser$Physics$Arcad) {
  _inherits(characterBait, _Phaser$Physics$Arcad);

  function characterBait(scene) {
    var _this;

    _classCallCheck(this, characterBait);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(characterBait).call(this, scene, 144, 415, "characterBait"));
    var g = _this.scene.game;
    _this.arcade = g.arcade;
    _this.playScene = scene;

    _this.scene.add.existing(_assertThisInitialized(_this));

    _this.setDepth(5);

    _this.addPhysics();

    _this.addAnimations();

    _this.keyboard = _this.scene.input.keyboard.addKeys("W, A, S, D, B, F");
    return _this;
  }

  _createClass(characterBait, [{
    key: "addPhysics",
    value: function addPhysics() {
      this.scene.physics.add.existing(this);
      this.setSize(this.displayWidth, this.displayHeight);
      this.setCollideWorldBounds(true);
    }
  }, {
    key: "update",
    value: function update() {
      this.keyboardInput();
      this.joystickInput();
    }
  }, {
    key: "addAnimations",
    value: function addAnimations() {
      this.scene.anims.create({
        key: "walk",
        frames: this.scene.anims.generateFrameNumbers("characterBait", {
          start: 3,
          end: 5
        }),
        frameRate: 10
      });
    }
  }, {
    key: "joystickInput",
    value: function joystickInput() {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.arcade.Joysticks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var joystick = _step.value;
          joystick.update();
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      if (this.arcade.Joysticks[1]) {
        this.play("walk", true);
        this.setVelocityX(this.arcade.Joysticks[1].X * 100);
        this.setVelocityY(this.arcade.Joysticks[1].Y * 100);

        if (this.arcade.Joysticks[1].X == 1) {
          this.flipX = false;
        }

        if (this.arcade.Joysticks[1].X == -1) {
          this.flipX = true;
        }

        if (this.arcade.Joysticks[1].X == 0 && this.arcade.Joysticks[1].Y == 0) {
          this.play("walk", false);
        }
      }
    }
  }, {
    key: "keyboardInput",
    value: function keyboardInput() {
      // player movement
      if (this.keyboard.W.isDown) {
        this.setVelocityY(-100);
        this.play("walk", true);
        this.flipX = false;
      }

      if (this.keyboard.S.isDown) {
        this.setVelocityY(100);
        this.play("walk", true);
      }

      if (this.keyboard.A.isDown) {
        this.setVelocityX(-100);
        this.play("walk", true);
        this.flipX = true;
      }

      if (this.keyboard.D.isDown) {
        this.setVelocityX(100);
        this.play("walk", true);
        this.flipX = false;
      }

      if (this.keyboard.A.isUp && this.keyboard.D.isUp) {
        this.setVelocityX(0);
      }

      if (this.keyboard.S.isUp && this.keyboard.W.isUp) {
        this.setVelocityY(0);
      }
    }
  }]);

  return characterBait;
}(Phaser.Physics.Arcade.Sprite);

exports.characterBait = characterBait;
},{}],"objects/pushBlock.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var pushBlock =
/*#__PURE__*/
function (_Phaser$Physics$Arcad) {
  _inherits(pushBlock, _Phaser$Physics$Arcad);

  function pushBlock(scene, x, y) {
    var _this;

    _classCallCheck(this, pushBlock);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(pushBlock).call(this, scene, x, y, "pushBlock"));
    _this.playScene = scene;

    _this.scene.add.existing(_assertThisInitialized(_this));

    _this.setDepth(5);

    _this.addPhysics();

    _this.setImmovable(true);

    return _this;
  }

  _createClass(pushBlock, [{
    key: "addPhysics",
    value: function addPhysics() {
      this.scene.physics.add.existing(this);
      this.setSize(this.displayWidth, this.displayHeight);
      this.setCollideWorldBounds(true);
    }
  }]);

  return pushBlock;
}(Phaser.Physics.Arcade.Sprite);

exports.pushBlock = pushBlock;
},{}],"objects/enemy.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var enemy =
/*#__PURE__*/
function (_Phaser$Physics$Arcad) {
  _inherits(enemy, _Phaser$Physics$Arcad);

  function enemy(scene) {
    var _this;

    _classCallCheck(this, enemy);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(enemy).call(this, scene, 300, 350, "monster"));
    _this.playScene = scene;

    _this.scene.add.existing(_assertThisInitialized(_this));

    _this.setDepth(5);

    _this.addPhysics();

    _this.addAnimations();

    _this.play("walkenemy", true);

    _this.setVelocityY(-100);

    _this.flipX = true;
    _this.walking_distance = Phaser.Math.Between(98, 255);
    _this.direction = _this.angle;
    _this.previous_position = _this.x;
    return _this;
  }

  _createClass(enemy, [{
    key: "addPhysics",
    value: function addPhysics() {
      this.scene.physics.add.existing(this);
      this.setSize(this.displayWidth, this.displayHeight);
      this.setCollideWorldBounds(true);
    }
  }, {
    key: "addAnimations",
    value: function addAnimations() {
      this.scene.anims.create({
        key: "walkenemy",
        frames: this.scene.anims.generateFrameNumbers("monster", {
          start: 0,
          end: 3
        }),
        repeat: -1,
        frameRate: 10
      });
    }
  }, {
    key: "collideWall",
    value: function collideWall() {
      // AI movement
      var direction = Phaser.Math.Between(1, 4);

      if (direction == 1) {
        this.setVelocityY(-100);
      } else if (direction == 2) {
        this.setVelocityY(100);
      } else if (direction == 3) {
        this.setVelocityX(100);
        this.flipX = false;
      } else {
        this.setVelocityX(-100);
        this.flipX = true;
      }
    }
  }, {
    key: "update",
    value: function update() {//test for better ai
      // this.new_position =  this.x;
      // if (Math.abs(this.new_position - this.previous_position) >= this.walking_distance) {
      //     this.switch_direction();
      // }
    }
  }, {
    key: "switch_direction",
    value: function switch_direction() {
      this.previous_position = this.x;
      this.body.velocity.x *= -1;
      this.flipX = true;
    }
  }]);

  return enemy;
}(Phaser.Physics.Arcade.Sprite);

exports.enemy = enemy;
},{}],"objects/bait.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var bait =
/*#__PURE__*/
function (_Phaser$Physics$Arcad) {
  _inherits(bait, _Phaser$Physics$Arcad);

  function bait(scene, x, y) {
    var _this;

    _classCallCheck(this, bait);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(bait).call(this, scene, x, y, "bait", 50));
    _this.playScene = scene;

    _this.scene.add.existing(_assertThisInitialized(_this));

    _this.setDepth(5);

    return _this;
  }

  return bait;
}(Phaser.Physics.Arcade.Sprite);

exports.bait = bait;
},{}],"scenes/PlayScene.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST");

var characterBait_1 = require("../objects/characterBait");

var pushBlock_1 = require("../objects/pushBlock");

var enemy_1 = require("../objects/enemy");

var bait_1 = require("../objects/bait");

var PlayScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(PlayScene, _Phaser$Scene);

  function PlayScene() {
    var _this;

    _classCallCheck(this, PlayScene);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PlayScene).call(this, {
      key: CST_1.CST.SCENES.PLAY
    }));
    document.addEventListener("joystick1button1", function () {
      return _this.placeBait();
    });
    _this.baitCounter = 3;
    return _this;
  }

  _createClass(PlayScene, [{
    key: "create",
    value: function create() {
      //map
      var mappy = this.add.tilemap("mappy");
      var terrain = mappy.addTilesetImage("dungeonTileset", "Dungeon"); //layers

      var ground = mappy.createStaticLayer("ground", [terrain], 0, 0).setDepth(0);
      var wall = mappy.createStaticLayer("wall", [terrain], 0, 0).setDepth(1);
      var top = mappy.createStaticLayer("top", [terrain], 0, 0).setDepth(2); // pushable blocks

      var pushableBlocks = [];
      pushableBlocks = mappy.createFromObjects("pushBlocks", 65, {
        key: "pushableBlocks"
      });
      this.blockGroup = this.physics.add.group();

      for (var i = 0; i < pushableBlocks.length; i++) {
        this.blockGroup.add(new pushBlock_1.pushBlock(this, pushableBlocks[i].x, pushableBlocks[i].y));
      } //bait


      this.baitGroup = this.add.group({
        runChildUpdate: true
      }); // players

      this.player = new characterBait_1.characterBait(this); // enemies

      this.enemy = new enemy_1.enemy(this); //map collisions

      this.physics.add.collider(this.player, ground);
      this.physics.add.collider(this.player, wall);
      this.physics.add.collider(this.player, top);
      this.physics.add.collider(this.player, this.blockGroup, this.bounceWall, undefined, this);
      this.physics.add.collider(this.player, this.enemy, this.gameOver, undefined, this);
      this.physics.add.collider(this.enemy, ground);
      this.physics.add.collider(this.enemy, wall);
      this.physics.add.collider(this.enemy, top, this.collidewall, undefined, this);
      this.physics.add.collider(this.enemy, this.blockGroup, this.enemyDie, undefined, this);
      this.physics.add.collider(this.blockGroup, top);
      this.physics.add.overlap(this.player, this.baitGroup, this.pickupBait, undefined, this); //tile property collisions

      ground.setCollisionByProperty({
        collides: true
      });
      wall.setCollisionByProperty({
        collides: true
      });
      top.setCollisionByProperty({
        collides: true
      });
      this.keyObj = this.input.keyboard.addKey('B'); // Get key object

      this.Keyboard = this.input.keyboard.addKeys("F");
    }
  }, {
    key: "placeBait",
    value: function placeBait() {
      if (this.baitCounter !== 0) {
        this.baitGroup.add(new bait_1.bait(this, this.player.x, this.player.y), true);
        this.baitCounter--;
      }
    }
  }, {
    key: "pickupBait",
    value: function pickupBait(b) {
      console.log("moi");
    }
  }, {
    key: "bounceWall",
    value: function bounceWall(b) {
      //move block when pushed
      if (b.body.touching.left && this.Keyboard.F.isDown) b.setVelocityX(175);else if (b.body.touching.right && this.Keyboard.F.isDown) {
        b.setVelocityX(-175);
      } else if (b.body.touching.up && this.Keyboard.F.isDown) {
        b.setVelocityY(175);
      } else if (b.body.touching.down && this.Keyboard.F.isDown) {
        b.setVelocityY(-175);
      }
    }
  }, {
    key: "collidewall",
    value: function collidewall() {
      // @ts-ignore
      this.enemy.collideWall();
    }
  }, {
    key: "gameOver",
    value: function gameOver() {
      this.scene.start("gameover");
    }
  }, {
    key: "enemyDie",
    value: function enemyDie(b) {
      if (b.body.velocity.x !== 0 || b.body.velocity.y !== 0) {
        this.enemy.destroy(); // slow block down

        setTimeout(function () {
          b.setVelocity(0);
        }, 150);
      } else {
        this.collidewall();
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (this.input.keyboard.checkDown(this.keyObj, 500)) {
        this.placeBait();
      }

      this.player.update();
      this.enemy.update();
    }
  }]);

  return PlayScene;
}(Phaser.Scene);

exports.PlayScene = PlayScene;
},{"../CST":"CST.ts","../objects/characterBait":"objects/characterBait.ts","../objects/pushBlock":"objects/pushBlock.ts","../objects/enemy":"objects/enemy.ts","../objects/bait":"objects/bait.ts"}],"scenes/GameOverScene.ts":[function(require,module,exports) {
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var CST_1 = require("../CST");

var GameOverScene =
/*#__PURE__*/
function (_Phaser$Scene) {
  _inherits(GameOverScene, _Phaser$Scene);

  function GameOverScene() {
    _classCallCheck(this, GameOverScene);

    return _possibleConstructorReturn(this, _getPrototypeOf(GameOverScene).call(this, {
      key: "gameover"
    }));
  }

  _createClass(GameOverScene, [{
    key: "create",
    value: function create() {
      var _this = this;

      var restartButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "restart_button").setDepth(1);
      var menuButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "menu_button").setDepth(1);
      restartButton.setInteractive();
      restartButton.on("pointerup", function () {
        _this.scene.start(CST_1.CST.SCENES.PLAY);
      });
      menuButton.setInteractive();
      menuButton.on("pointerup", function () {
        _this.scene.start(CST_1.CST.SCENES.MENU);
      });
      this.add.image(0, 0, "background").setOrigin(0).setDepth(0);
    }
  }]);

  return GameOverScene;
}(Phaser.Scene);

exports.GameOverScene = GameOverScene;
},{"../CST":"CST.ts"}],"main.ts":[function(require,module,exports) {
"use strict";
/** @type {import("./typings/phaser")} */

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var arcade_1 = require("./utils/arcade");

var LoadScene_1 = require("./scenes/LoadScene");

var MenuScene_1 = require("./scenes/MenuScene");

var PlayScene_1 = require("./scenes/PlayScene");

var GameOverScene_1 = require("./scenes/GameOverScene"); // @ts-ignore


var config = {
  width: 640,
  height: 480,
  scene: [LoadScene_1.LoadScene, MenuScene_1.MenuScene, PlayScene_1.PlayScene, GameOverScene_1.GameOverScene],
  render: {
    pixelArt: true
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: true
    }
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

var MonsterHunter =
/*#__PURE__*/
function (_Phaser$Game) {
  _inherits(MonsterHunter, _Phaser$Game);

  function MonsterHunter(config) {
    var _this;

    _classCallCheck(this, MonsterHunter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MonsterHunter).call(this, config)); // create the arcade once, otherwise we keep connecting/disconnecting every scene

    _this.arcade = new arcade_1.Arcade();
    return _this;
  }

  return MonsterHunter;
}(Phaser.Game);

exports.MonsterHunter = MonsterHunter;
window.addEventListener("load", function () {
  return new MonsterHunter(config);
});
},{"./utils/arcade":"utils/arcade.ts","./scenes/LoadScene":"scenes/LoadScene.ts","./scenes/MenuScene":"scenes/MenuScene.ts","./scenes/PlayScene":"scenes/PlayScene.ts","./scenes/GameOverScene":"scenes/GameOverScene.ts"}],"../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58253" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.ts"], null)
//# sourceMappingURL=/main.c39d6dcf.js.map