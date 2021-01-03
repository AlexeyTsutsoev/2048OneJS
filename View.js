import Controller from "./Controller"
import Model from "./Model"

export default class View {
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
        let header = this.createElem('div', 'Header', this.controller.model.score);
        this.game.appendChild(header);
        //создание поля
        let field = this.createElem('div', 'Field', '');
        this.game.appendChild(field);
        //отрисовка матрицы
        for (let i = 0; i < this.controller.model.matrix.length; i++) {
            for (let j = 0; j < this.controller.model.matrix[i].length; j++) {
                let tile = this.createElem('div', 'Tile', this.controller.model.matrix[i][j].value);
                field.appendChild(tile);
            }
        }
    }
}