import Tile from './Tile'
import Controller from "./Controller"
import View from "./View"

export default class Model {
    constructor() {
        this.maxTile = 0;
        this.score = 0;
        this.createField();
    }

    canMove() {
        if (this.getEmptyTiles().length !== 0) return true;
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j].getValue() == this.matrix[i - 1][j].getValue()) return true;
            }
        }

        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j].getValue() == this.matrix[i][j - 1].getValue()) return true;
            }
        }

        return false;
    }

    createField() {
        this.matrix = [];
        for (let i = 0; i < 4; i++) {
            this.matrix[i] = [];
            for (let j = 0; j < 4; j++) {
                this.matrix[i][j] = new Tile(0);
            }
        }

        this.addTile();
        this.addTile();
    }

    getEmptyTiles() {
        let result = [];
        for (let i = 0; i < this.matrix.length; i++) {
            for (let j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j].value === 0) {
                    result.push(this.matrix[i][j]);
                }
            }
        }
        return result;
    }

    twoOrFour() {
        return (Math.random() > 0.8) ? 2 : 4;
    }

    addTile() {
        let emptyTiles = this.getEmptyTiles();
        if (emptyTiles.length !== 0) {
            let randomIndex = Math.round(emptyTiles.length * Math.random());
            emptyTiles[randomIndex].setValue(this.twoOrFour());
        }
    }

    compressTilesLeft(tilesArr) {
        let isChanged = false;
        let tempTile;
        for (let i = 0; i < this.matrix.length - 1; i++) {
            for (let j = 0; j < this.matrix[i].length - 1; j++) {
                if (tilesArr[j].getValue() === 0 && tilesArr[j + 1].getValue() !== 0) {
                    tempTile = tilesArr[j];
                    tilesArr[j] = tilesArr[j + 1];
                    tilesArr[j + 1] = tempTile;
                    isChanged = true;
                }
            }
        }
        return isChanged;
    }

    mergeTiles(tilesArr) {
        let isChanged = false;

        for (let i = 0; i < this.matrix.length - 1; i++) {
            if (tilesArr[i].getValue() !== 0 && tilesArr[i].getValue() === tilesArr[i + 1].getValue()) {
                tilesArr[i].setValue(tilesArr[i].getValue() * 2);
                tilesArr[i + 1].setValue(0);
                if (tilesArr[i] > this.maxTile) this.maxTile = tilesArr[i];
                this.score += tilesArr[i].getValue();
                isChanged = true;
            }
        }

        if (isChanged) {
            let tempTile;
            for (let i = 0; i < this.matrix.length - 1; i++) {
                if (tilesArr[i].getValue() == 0 && tilesArr[i + 1].getValue() !== 0) {
                    tempTile = tilesArr[i];
                    tilesArr[i] = tilesArr[i + 1];
                    tilesArr[i + 1] = tempTile;
                }
            }
        }
        return isChanged;
    }

    moveLeft() {
        let isChanged = false;

        for (let i = 0; i < this.matrix.length; i++) {
            if (this.compressTilesLeft(this.matrix[i]) || this.mergeTiles(this.matrix[i])) isChanged = true;
        }

        if (isChanged) this.addTile();
    }
}