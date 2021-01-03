import View from "./View";
import Model from "./Model";

export default class Controller {
    constructor(model) {
        this.model = model;
        this.view = new View(this);
        this.isGameLose = false;
        this.isGameWon = false;
        this.WinningTile = 2048;
    }

    resetGame() {
        this.model.score = 0;
        view.isGameLose = false;
        view.isGameWon = false;
        this.model.createField();
    }

    control(event) {
        if (event.KeyCode === 27) this.resetGame();
        if (!this.model.canMove()) {
            this.isGameLose = true;
        } else {
            if (!this.isGameLose && !this.isGameWon) {
                switch (event.KeyCode) {
                    case 37:
                        this.model.moveLeft();
                        break;
                    case 38:
                        //движение вверх
                        break;
                    case 39:
                        //движение вправо
                        break;
                    case 40:
                        //движение вниз
                        break;
                }
                if (this.model.maxTile === this.WinningTile) this.view.isGameWon = true;
            }
        }
        this.view.render();
    }
}