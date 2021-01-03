export default class Tile {
    constructor(value) {
        this.value = value;
    }

    setValue(newValue) {
        this.value = newValue;
    }

    getValue() {
        return this.value;
    }
}