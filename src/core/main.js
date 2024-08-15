import { Context } from "./canvas/Context.js";
import { BoardComponent } from "./canvas/components/Board.js";
import { Color, Vector2 } from "./util.js";
import { TicTacToeBoard } from './classes/TicTacToeBoard.js'

const canvas = document.querySelector("#minimax-draw");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const ctx = new Context(canvas);

window.ctx = ctx;
window.create_board = () => {
    return new BoardComponent({
        position: new Vector2(650, 100),
        grid_size: 50,
        board: new TicTacToeBoard({
            size: new Vector2(3,3),
            current_turn: '-'
        })
    });
}