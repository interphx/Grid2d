(function (factory) {
    if (typeof module === 'object' && typeof module.exports === 'object') {
        var v = factory(require, exports); if (v !== undefined) module.exports = v;
    }
    else if (typeof define === 'function' && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.Getters = {
        ConstGetter: function (value) {
            if (arguments.length !== 1) {
                throw new Error('ConstGetter must accept a single argument; it returns a getter function and should not be used as a getter itself');
            }
            return function () {
                return value;
            };
        },
        NullGetter: function () {
            return null;
        },
        ExceptionGetter: function (x, y) {
            throw new Error("Unable to get value of cell (" + x + ", " + y + ")");
        }
    };
    exports.Setters = {
        NoopSetter: function (x, y, value) {
        },
        ExceptionSetter: function (x, y, value) {
            throw new Error("Unable to set value of cell (" + x + ", " + y + ")");
        },
    };
    var Grid = (function () {
        function Grid(width, height, getDefault, getInvalid, setInvalid) {
            if (getInvalid === void 0) { getInvalid = exports.Getters.ExceptionGetter; }
            if (setInvalid === void 0) { setInvalid = exports.Setters.ExceptionSetter; }
            this.width = width;
            this.height = height;
            this.getDefault = getDefault;
            this.getInvalid = getInvalid;
            this.setInvalid = setInvalid;
            this.data = new Array(width * height);
        }
        Grid.prototype.get = function (x, y) {
            var width = this.width, height = this.height;
            if (x < 0 || x >= width || y < 0 || y >= height) {
                return this.getInvalid(x, y);
            }
            var index = y * this.width + x;
            var data = this.data;
            if (data[index] === void 0) {
                data[index] = this.getDefault(x, y);
            }
            return data[index];
        };
        Grid.prototype.set = function (x, y, value) {
            if (x < 0 || x > this.width || y < 0 || y > this.height) {
                this.setInvalid(x, y, value);
            }
            var index = y * this.width + x;
            this.data[index] = value;
        };
        Grid.prototype.isInBounds = function (x, y) {
            return x >= 0 && x < this.width && y >= 0 && y <= this.height;
        };
        Grid.prototype.clear = function (value) {
            var data = this.data;
            for (var i = 0, len = data.length; i < len; ++i) {
                data[i] = value;
            }
        };
        Grid.prototype.insertRow = function (position) {
            if (position < 0 || position > this.height) {
                throw new Error('Row position lies outside of availbable height (' + this.height + '): ' + position.toString());
            }
            var pos = position * this.width;
            var newRow = new Array(this.width);
            this.data = this.data.slice(0, pos).concat(newRow).concat(this.data.slice(pos, this.data.length));
            this.height += 1;
        };
        Grid.prototype.insertColumn = function (position) {
            if (position < 0 || position > this.width) {
                throw new Error('Column position lies outside of availbable width (' + this.width + '): ' + position.toString());
            }
            var newData = [];
            for (var i = 0; i < this.height; ++i) {
                newData = newData
                    .concat(this.data.slice(i * this.width, i * this.width + position))
                    .concat([void 0])
                    .concat(this.data.slice(i * this.width + position, i * this.width + this.width));
            }
            this.data = newData;
            this.width += 1;
        };
        return Grid;
    }());
    exports.Grid = Grid;
});
