class Tile {
    constructor(value) {
        this.value = value;
    }

    setValue(newValue) {
        this.value = newValue;
    }

    getValue() {
        return this.value;
    }

    getColor() {
        switch (this.value) {
            case 0:
                return 'lightgray';
            case 2:
                return 'lightyellow';
            case 4:
                return 'lightgreen';
            case 8:
                return 'lightsalmon';
            case 16:
                return 'orange';
            case 32:
                return 'Tomato';
            case 64:
                return 'red';
            case 128:
                return 'yellow';
            case 256:
                return 'YellowGreen';
            case 512:
                return 'DarkOrange';
            case 1024:
                return 'OrangeRed';
            case 2048:
                return 'DarkRed';
        }
    }
};

/*---------------------------------------------------------------------*/

class Model {
    constructor() {
        this.maxTile = 0;
        this.createField();
        this.score = 0;
        localStorage.setItem('bestScore', this.score);
    }

    saveRecord() {
        console.log('рекорд обновлен')
        localStorage.setItem('bestScore', this.score);
    }

    getScore() {
        const ln = this.matrix.length;
        this.score = 0;

        for (let i = 0; i < ln; i++) {
            for (let j = 0; j < ln; j++) {
                this.score += this.matrix[i][j].getValue();
            }
        }

        if (this.score > localStorage.getItem('bestScore')) {
            this.saveRecord();
        }
        return this.score;
    }

    canMove() {
        const ln = this.matrix.length;
        if (this.getEmptyTiles().length !== 0) return true;
        for (let i = 0; i < ln; i++) {
            for (let j = 0; j < ln; j++) {
                try {
                    if (this.matrix[i][j].getValue() === this.matrix[i - 1][j].getValue()) return true;
                } catch (err) {
                    continue;
                }
            }
        }

        for (let i = 0; i < ln; i++) {
            for (let j = 0; j < ln; j++) {
                try {
                    if (this.matrix[i][j].getValue() == this.matrix[i][j - 1].getValue()) return true;
                } catch (err) {
                    continue;
                }
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
        const ln = this.matrix.length;
        for (let i = 0; i < ln; i++) {
            for (let j = 0; j < ln; j++) {
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
        try {
            if (emptyTiles.length !== 0) {
                let randomIndex = Math.round((emptyTiles.length - 1) * Math.random());
                emptyTiles[randomIndex].setValue(this.twoOrFour());
            }
        } catch (err) {
            console.log(randomIndex);
            console.log(emptyTiles);
            console.log(emptyTiles[randomIndex]);
        }
    }

    compressTilesLeft(tilesArr) {
        let isChanged = false;
        let tempTile;
        const ln = this.matrix.length;
        for (let i = 0; i < ln - 1; i++) {
            for (let j = 0; j < ln - 1; j++) {
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
        const ln = this.matrix.length;

        for (let i = 0; i < ln - 1; i++) {
            if (tilesArr[i].getValue() !== 0 && tilesArr[i].getValue() === tilesArr[i + 1].getValue()) {
                tilesArr[i].setValue(tilesArr[i].getValue() * 2);
                tilesArr[i + 1].setValue(0);
                if (tilesArr[i] > this.maxTile) this.maxTile = tilesArr[i];
                this.score = this.getScore();
                isChanged = true;
            }
        }

        if (isChanged) {
            let tempTile;
            for (let i = 0; i < ln - 1; i++) {
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
        const ln = this.matrix.length;

        for (let i = 0; i < ln; i++) {
            if (this.compressTilesLeft(this.matrix[i]) || this.mergeTiles(this.matrix[i])) isChanged = true;
        }

        if (isChanged) this.addTile();
    }

    rotateMatrix() {
        const ln = this.matrix.length;

        for (let i = 0; i < ln / 2; i++) {
            for (let j = i; j < ln - i - 1; j++) {
                let tempTile = this.matrix[i][j];
                this.matrix[i][j] = this.matrix[j][ln - i - 1];
                this.matrix[j][ln - i - 1] = this.matrix[ln - i - 1][ln - j - 1];
                this.matrix[ln - i - 1][ln - j - 1] = this.matrix[ln - j - 1][i];
                this.matrix[ln - j - 1][i] = tempTile;
            }
        }
    }


    moveRight() {
        this.rotateMatrix();
        this.rotateMatrix();
        this.moveLeft();
        this.rotateMatrix();
        this.rotateMatrix();
    }

    moveDown() {
        this.rotateMatrix();
        this.rotateMatrix();
        this.rotateMatrix();
        this.moveLeft();
        this.rotateMatrix();
    }

    moveUp() {
        this.rotateMatrix();
        this.moveLeft();
        this.rotateMatrix();
        this.rotateMatrix();
        this.rotateMatrix();
    }
};


/*-------------------------------------------------------------*/

class View {
    constructor(controller) {
        this.controller = controller;
        this.game = document.getElementsByClassName('Game')[0];
    }

    createElem(elem, className, value) {
        let target = document.createElement(elem);
        target.classList.add(className);
        target.innerHTML = value;
        return target;
    }

    render() {
        //созадние загаловка
        this.game.innerHTML = '';
        let header = this.createElem('div', 'Header', `Текущее значение: ${this.controller.model.getScore()}
        <br>Рекорд:${localStorage.getItem('bestScore')}`);
        this.game.appendChild(header);
        //создание поля
        let field = this.createElem('div', 'Field', '');
        this.game.appendChild(field);
        //отрисовка матрицы
        for (let i = 0; i < this.controller.model.matrix.length; i++) {
            for (let j = 0; j < this.controller.model.matrix[i].length; j++) {
                let tile = this.createElem('div', 'Tile', this.controller.model.matrix[i][j].value);
                tile.style.background = this.controller.model.matrix[i][j].getColor();
                field.appendChild(tile);
            }
        }
    }
};


/*---------------------------------------------------------------------------------*/


class Controller {
    constructor(model) {
        this.model = model;
        this.view = new View(this);
        this.isGameLose = false;
        this.isGameWon = false;
        this.WinningTile = 2048;
    }

    resetGame() {
        console.log(`reset`)
        this.isGameLose = false;
        this.isGameWon = false;
        this.model.createField();
    }

    restart() {
        if (this.isGameLose) {
            let lose = confirm('Вы проиграли. Сыграть ещё?');
            if (lose) {
                this.resetGame();
            }
        }
        if (this.isGameWon) {
            let win = confirm('Вы Выиграли! Сыграть ещё?');
            if (win) {
                this.resetGame();
            }
        }
        this.view.render();
    }

    control(event) {
        if (event.keyCode === 27) this.resetGame();
        if (!this.model.canMove()) {
            console.log('нельзя двигаться')
            this.isGameLose = true;
        } else {
            if (!this.isGameLose && !this.isGameWon) {
                switch (event.keyCode) {
                    case 37:
                        this.model.moveLeft();
                        break;
                    case 38:
                        this.model.moveUp();
                        break;
                    case 39:
                        this.model.moveRight();
                        break;
                    case 40:
                        this.model.moveDown();
                        break;
                }
                if (this.model.maxTile === this.WinningTile) this.isGameWon = true;
            }
        }
        this.view.render();
    }
};

/*-------------------------------------------------------------------------------------------------------------------------*/

let model = new Model();
let controller = new Controller(model);
controller.view.render();
let body = document.getElementById('body');
body.addEventListener('keydown', (event) => {
    controller.control(event);
    controller.restart();
});