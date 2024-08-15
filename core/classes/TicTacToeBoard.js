import { Vector2 } from "../util.js";

export class TicTacToeBoard {
    constructor(options) {
        this.parent = options.parent ?? undefined;
        this.current_turn = options.current_turn ?? '+';
        this.size = options.size ?? new Vector2(3,3);
        this.places = [];

        this.canvas_component = options.canvas_component;

        this.calculated_value;
        this.move =  options.move ?? new Vector2();
     
        for (let i = 0; i < this.size.x*this.size.y; i++){
            this.places.push('');
        }
        this.sub_boards = [];
    }

    set_place(x, y, char){
        if (x > this.size.x) return;
        if (y > this.size.y) return;
        this.places[y*this.size.x+x] = char;
    }

    get_place(x, y){
        if (x > this.size.x) return;
        if (y > this.size.y) return;
        return this.places[y*this.size.x+x];
    }

    generate_sub_boards_rec(){
        this.generate_sub_boards();
        for (let i = this.sub_boards.length; i--;)
            this.sub_boards[i].generate_sub_boards_rec();
    }

    generate_sub_boards(){
        if (this.check()) return;
        let possibilities = [];
        for (let i = 0;  i < this.size.x; i++){
            for (let j = 0; j < this.size.y; j++){
                if (this.get_place(i, j) == ''){
                    possibilities.push(new Vector2(i, j));
                }
            }
        }
        let new_board;
        for (let i = possibilities.length; i--;){
            new_board = new TicTacToeBoard({
                size: this.size,
                current_turn: this.current_turn == '+' ? '-' : '+',
                parent: this,
                move: new Vector2(possibilities[i].x, possibilities[i].y)
            });
            this.copy_places(new_board.places);
            new_board.set_place(possibilities[i].x, possibilities[i].y, this.current_turn == '+' ? 'o' : 'x');
            this.sub_boards.push(new_board);
        }
    }

    check(){
        let winner = '';
        for (let i = 0;  i < this.size.x; i++){
            for (let j = 0; j < this.size.y - 1; j++){
                if (this.get_place(i, j) == "") break;
                if (this.get_place(i, j) != this.get_place(i, j+1)) break;
                if (j == this.size.y-2) {
                    winner = this.get_place(i, j);
                } 
            }
        }

        for (let j = 0; j < this.size.y; j++){
            for (let i = 0;  i < this.size.x - 1; i++){
                if (this.get_place(i, j) == "") break;
                if (this.get_place(i, j) != this.get_place(i+1, j)) break;
                if (i == this.size.x-2) {
                    winner = this.get_place(i, j);
                }
            }
        }

        if (this.size.x == this.size.y) {
            for (let i = 0;  i < this.size.x - 1; i++){
                if (this.get_place(i, i) == "") break;
                if (this.get_place(i, i) != this.get_place(i+1, i+1)) break;
                if (i == this.size.x-2) {
                    winner = this.get_place(i, i);
                }
            }
            for (let i = 0;  i < this.size.x - 1; i++){
                if (this.get_place(this.size.x-1-i, i) == "") break;
                if (this.get_place(this.size.x-1-i, i) != this.get_place(this.size.x-1 - (i+1), i+1)) break;
                if (i == this.size.x-2) {
                    winner = this.get_place(this.size.x-1-i, i);
                }
            }
        }

        return winner; 
    }

    calculate_points(){
        let points_x = this.count_free_rows_cols('x');
        let points_o = this.count_free_rows_cols('o');
        let winner = this.check();
        if (winner == 'x') return 9;
        if (winner == 'o') return -9;  
        return points_x - points_o;
    }

    count_free_rows_cols(char){
        let points = 0;
        for (let i = 0;  i < this.size.x; i++){
            let there_is_x = false;
            let there_is_o = false;
            for (let j = 0; j < this.size.y; j++){
                if (this.get_place(i, j) == 'x') {
                    there_is_x = true;
                }
                if (this.get_place(i, j) == 'o') {
                    there_is_o = true;
                }
            }
            if (char == 'x' && there_is_x && !there_is_o) points+=1;
            if (char == 'o' && there_is_o && !there_is_x) points+=1;
        }

        for (let j = 0; j < this.size.y; j++){
            let there_is_x = false;
            let there_is_o = false;
            for (let i = 0;  i < this.size.x; i++){
                if (this.get_place(i, j) == 'x') there_is_x = true;
                if (this.get_place(i, j) == 'o') there_is_o = true;
            }
            if (char == 'x' && there_is_x && !there_is_o) points+=1;
            if (char == 'o' && there_is_o && !there_is_x) points+=1;
        }

        if (this.size.x == this.size.y) {
            let there_is_xp = false;
            let there_is_op = false;
            let there_is_xs = false;
            let there_is_os = false;
            for (let i = 0;  i < this.size.x; i++){
                if (this.get_place(i, i) == 'x') there_is_xp = true;
                if (this.get_place(i, i) == 'o') there_is_op = true;
            }
            for (let i = 0;  i < this.size.x; i++){
                if (this.get_place(this.size.x-1-i, i) == 'x') there_is_xs = true;
                if (this.get_place(this.size.x-1-i, i) == 'o') there_is_os = true;
            }
            if (char == 'x' && there_is_xp && !there_is_op) points+=1;
            if (char == 'o' && there_is_op && !there_is_xp) points+=1;
            if (char == 'x' && there_is_xs && !there_is_os) points+=1;
            if (char == 'o' && there_is_os && !there_is_xs) points+=1; 
        }
        return points;
    }

    draw() {
        return !this.places.includes('');
    }

    find_best_move() {
        let bestVal = -Infinity;
        let bestMove;
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                if (this.get_place(i, j) === '') {
                    this.set_place(i, j, 'x');
                    let moveVal = this.minimax(0, false);
                    this.set_place(i, j, '');
                    if (moveVal > bestVal) {
                        bestMove = new Vector2(i, j);
                        bestVal = moveVal;
                    }
                }
            }
        }
        return [bestVal, bestMove];
    }

    minimax(depth, isMaximizing) {
        let score = this.calculate_points();
        if (score === 9) return score;
        if (score === -9) return score;
        if (this.draw()) 0;

        if (isMaximizing) {
            let best = -Infinity;

            for (let i = 0; i < this.size.x; i++) {
                for (let j = 0; j < this.size.y; j++) {
                    if (this.get_place(i, j) === '') {
                        this.set_place(i, j, this.current_turn == '+' ? 'x':'o');
                        best = Math.max(best, this.minimax(depth + 1, false));
                        this.set_place(i, j, '');
                    }
                }
            }
            return best;
        } else {
            let best = Infinity;

            for (let i = 0; i < this.size.x; i++) {
                for (let j = 0; j < this.size.y; j++) {
                    if (this.get_place(i, j) === '') {
                        this.set_place(i, j, this.current_turn == '+' ? 'x':'o');
                        best = Math.min(best, this.minimax(depth + 1, true));
                        this.set_place(i, j, '');
                    }
                }
            }
            return best;
        }
    }

    print(){
        for (let i = 0; i < this.size.x; i++){
            let row = [];
            for (let j = 0; j < this.size.y; j++){
                row.push(this.get_place(i, j));
            }
            console.log(row);
        }
    }

    copy_places(dest){
        for (let i = 0; i < this.size.x * this.size.y; i++) 
            dest[i] = this.places[i];
    }
}