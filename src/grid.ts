// TODO: Add flood fill and neighborhoods

export type GridGetter<T> = (x: number, y: number) => T;
export type GridSetter<T> = (x: number, y: number, value: T) => void;

export var Getters = {
    ConstGetter<T>(value: T): GridGetter<T> {
        if (arguments.length !== 1) {
            throw new Error('ConstGetter must accept a single argument; it returns a getter function and should not be used as a getter itself');
        }
        return function() {
            return value;
        }
    },
    NullGetter(): null  {
        return null;
    },
    ExceptionGetter<T>(x: number, y: number): T {
        throw new Error(`Unable to get value of cell (${x}, ${y})`);
    }
};

export var Setters = {
    NoopSetter<T>(x: number, y: number, value: T) {
    },
    ExceptionSetter<T>(x: number, y: number, value: T) {
        throw new Error(`Unable to set value of cell (${x}, ${y})`);
    },
};

export class Grid<T> {
    protected data: (T | undefined)[];

    constructor(
        public width: number,
        public height: number,
        protected readonly getDefault: GridGetter<T>,
        protected readonly getInvalid: GridGetter<T> = Getters.ExceptionGetter,
        protected readonly setInvalid: GridSetter<T> = Setters.ExceptionSetter
    ) {
        this.data = new Array(width * height);
    }

    get(x: number, y: number): T {
        var width = this.width,
            height = this.height;

        if (x < 0 || x >= width || y < 0 || y >= height) {
            return this.getInvalid(x, y);
        }
        var index = y * this.width + x;
        var data = this.data;
        if (data[index] === void 0) {
            data[index] = this.getDefault(x, y);
        }
        // At this point the presence of value is guaranteed
        return data[index] as T;
    }

    set(x: number, y: number, value: T): void {
        if (x < 0 || x > this.width || y < 0 || y > this.height) {
            this.setInvalid(x, y, value);
        }
        var index = y * this.width + x;
        this.data[index] = value;
    }

    isInBounds(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    clear(value?: T) {
        var data = this.data;
        for (var i = 0, len = data.length; i < len; ++i) {
            // If value is omitted, all cells are set to undefined
            data[i] = value;
        }
    }

    insertRow(position: number) {
        if (position < 0 || position > this.height) {
            throw new Error('Row position lies outside of availbable height (' + this.height + '): ' + position.toString());
        }
        var pos = position * this.width;
        var newRow = new Array(this.width);
        this.data = this.data.slice(0, pos).concat(newRow).concat(this.data.slice(pos, this.data.length));
        this.height += 1;
    }

    insertColumn(position: number) {
        if (position < 0 || position > this.width) {
            throw new Error('Column position lies outside of availbable width (' + this.width + '): ' + position.toString());
        }
        var newData: (T | undefined)[] = [];
        for (var i = 0; i < this.height; ++i) {
            newData = newData
                // From the beginning of the row to new column position
                .concat(this.data.slice(i * this.width, i * this.width + position))
                .concat([void 0])
                // From new column position (in original array it contains original data, not new column)
                // to the end of the row
                .concat(this.data.slice(i * this.width + position, i * this.width + this.width));
        }
        this.data = newData;
        this.width += 1;
    }
}
