import { Vector2, Color } from "../../util.js";
import { LineArrow } from "./LineArrow.js";

export class BoardComponent {
    
    size;
    position;

    grid_size;
    line_gap;
    symbol_size;
    line_width;

    arrows = [];
    board;
    sub_boards_draw = [];

    bounding_rect = [new Vector2(0, 0), new Vector2(0, 0)];

    constructor(options) {

        this.board = options.board;

        this.size = this.board ? this.board.size : new Vector2(0, 0);

        this.position = options.position ?? new Vector2(200, 200);
        this.context = undefined;
        this.drawing_context = undefined;

        this.grid_size = options.grid_size ?? 50;
        this.line_gap = this.grid_size / 2;
        this.symbol_size = (this.grid_size * 12) / 100;
        this.line_width = options.line_width ?? 4;

        this.x_color = options.x_color ?? new Color(2, 173, 54, 1);
        this.o_color = options.o_color ?? new Color(15, 3, 223, 1);
        this.lines_color = options.lines_color ?? new Color(58, 58, 58, 1);
        this.value_x_color = options.value_x_color ?? new Color(63, 173, 63, 1);
        this.value_o_color = options.value_o_color ?? new Color(173, 63, 63, 1);
        this.text_color = options.text_color ?? new Color(243, 243, 243, 1);

        this.bounding_rect[0] = new Vector2(this.position.x - this.line_gap, this.position.y - this.line_gap/2);
        this.bounding_rect[1] = new Vector2(this.position.x - this.line_gap + this.line_gap*(this.size.y), this.position.y - this.line_gap/2  + this.line_gap*(this.size.x));

    }

    draw() {
        this._draw_lines();
        this._draw_places();
        this._draw_value();
        // this._draw_bounds();
    }

    _draw_bounds(){
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = "#11DA01";
        this.context.lineWidth = 0.5;
        this.context.rect(this.bounding_rect[0].x, this.bounding_rect[0].y, this.bounding_rect[1].x - this.bounding_rect[0].x, this.bounding_rect[1].y - this.bounding_rect[0].y);
        this.context.stroke();
        this.context.restore();
        console.log(this.bounding_rect);
    }

    _draw_lines() {
        this.context.lineWidth = this.line_width;
        this.context.strokeStyle = `${this.lines_color}`;
        this.context.beginPath();


        let init_y = this.position.y - this.line_gap / 2;
        for (let i = 0; i < this.size.y -1; i++) {
            this.context.moveTo(this.position.x + i * this.line_gap, init_y);
            this.context.lineTo(this.position.x + i * this.line_gap, init_y + (this.size.x*this.line_gap));
        }

        let init_x = this.position.x - this.line_gap;
        let const_y = this.position.y + this.line_gap / 2;
        for (let i = 0; i < this.size.x - 1; i++) {
            this.context.moveTo(init_x, const_y + i * this.line_gap);
            this.context.lineTo(init_x + this.line_gap*this.size.y, const_y + i * this.line_gap);
        }

        this.context.stroke();
    }

    
    _draw_value(){
        this.context.save();
        if (!this.board.parent) return;
        
        const text_x = this.position.x + this.line_gap*(this.size.x/2) + 20;
        const text_y = this.position.y-this.line_gap;
        const font_size = 18;

        const str = `${this.board.calculate_points()}`;

        const center_gap_font_size_x = font_size*str.length/4;
        const center_gap_font_size_y = font_size/4;
        this.context.font = `900 ${font_size}px Ubuntu Mono`;
        
        this.context.beginPath();
        this.context.fillStyle = this.board.current_turn == '+' ? `${this.value_x_color}` : `${this.value_o_color}`;
        this.context.strokeStyle = `#000`;
        this.context.lineWidth = 2; 
        this.context.arc(text_x , text_y, font_size, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
        this.context.fillStyle = `${this.text_color}`;
        this.context.strokeText(str, text_x - center_gap_font_size_x, text_y + center_gap_font_size_y);
        this.context.fillText(str, text_x - center_gap_font_size_x, text_y + center_gap_font_size_y);
        this.context.closePath();
        
        this.context.restore();
    }

    _draw_places() {
        for (let i = 0; i < this.size.x; i++) {
            for (let j = 0; j < this.size.y; j++) {
                if(this.get_place(i, j)){
                    this.draw_place(j, i, this.get_place(i, j));
                }
            }
        }
    }

    set_turn(char){
        this.board.current_turn = char;
    }

    get_place(x, y){
        return this.board.get_place(x, y);
    }

    set_place(x, y, char = ''){
        this.board.set_place(x, y, char);
    }

    draw_place(x, y, char = 'o') {
        if (char == 'o') {
            this.drawO(x, y);
        } else {
            this.drawX(x * this.line_gap - this.line_gap / 2, y * this.line_gap);
        }
    }

    drawO(x, y) {
        this.context.save();
        this.context.beginPath();
        this.context.fillStyle = this.o_color;
        this.context.strokeStyle = this.o_color;
        this.context.arc(this.position.x - this.line_gap / 2 + this.line_gap * x, this.position.y + this.line_gap * y, this.symbol_size, 0, 2 * Math.PI);
        this.context.stroke();
        this.context.closePath();
        this.context.restore();
    }

    drawX(x, y) {
        this.context.save();
        this.context.beginPath();

        this.context.fillStyle = this.x_color;
        this.context.strokeStyle = this.x_color;

        this.moveTo(x - this.symbol_size, y - this.symbol_size)
        this.lineTo(x + this.symbol_size, y + this.symbol_size);
        this.context.stroke();

        this.moveTo(x + this.symbol_size, y - this.symbol_size)
        this.lineTo(x - this.symbol_size, y + this.symbol_size);

        this.context.stroke();
        this.context.restore();
    }

    generate_possibilities_rec(){
        this.board.generate_sub_boards_rec();
    }

    generate_possibilities(){
        this.board.generate_sub_boards();
    }

    draw_possibilities_rec(){
        this.draw_possibilities();
        for(let i = this.sub_boards_draw.length; i--;){
            this.sub_boards_draw[i].draw_possibilities_rec()
        }
    }

    draw_possibilities(){

        if (this.board.sub_boards.length <= 0) return;
        
        let board_aux;

        let board_width_gap = this.line_gap*this.size.y + 50;

        let total_possibilities = this.board.sub_boards.length;

        let half_tree_size = (board_width_gap*total_possibilities)/2;
        let center_position = this.position.x + this.grid_size + this.line_gap/2 - half_tree_size;

        let line_arrow;

        for(let i = this.board.sub_boards.length; i--;){
            board_aux = new BoardComponent({
                position: new Vector2(center_position + (i*(board_width_gap)) - (((total_possibilities-1)/2-i)*this.calculate_size_tree_amount(total_possibilities)), this.position.y + this.size.y*this.grid_size+100),
                grid_size: this.grid_size,
                board: this.board.sub_boards[i]
            });
            this.board.sub_boards[i].canvas_component = board_aux;
            line_arrow = LineArrow.pointsTo(this.center_position(), board_aux.top_center_position(), 'bottom', this.grid_size+10, this);
            line_arrow.arrow_color = this.board.current_turn == '+' ? this.x_color : this.o_color;
            line_arrow.context = this.context;
            line_arrow.drawing_context = this.drawing_context;
            this.drawing_context.add(board_aux);
            this.drawing_context.add(line_arrow);
            this.sub_boards_draw.push(board_aux);
        }

    }

    calculate_size_tree_amount(size){
        let board_width_gap = this.line_gap*this.size.y + 50;

        let result = (board_width_gap/2)*size;
        for(let i = size; i > 1; i--)
            result *= (i-1);
        return result;
    }

    transparency(value){
        this.o_color.a = value;
        this.x_color.a = value;
        this.text_color.a = value;
        this.lines_color.a = value;
        this.value_o_color.a = value;
        this.value_x_color.a = value;
    }
    
    center_position(){
        let position = Vector2.copy(this.position);
        position.y += this.grid_size/2 - this.line_gap/2;
        position.x += this.grid_size/2 - this.line_gap/2;
        return position;
    }
    
    top_center_position(){
        let position = Vector2.copy(this.position);
        position.y -= this.grid_size/2 + 5;
        position.x += this.grid_size/2 - this.line_gap/2;
        return position;
    }

    moveTo(x, y) {
        this.context.moveTo(this.position.x + x, this.position.y + y);
    }

    lineTo(x, y) {
        this.context.lineTo(this.position.x + x, this.position.y + y);
    }
}