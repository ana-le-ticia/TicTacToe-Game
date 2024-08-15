
let board_component;
let size = {x: 3, y: 3};
let places = [];
for (let i = 0; i < size.x*size.y; i++){
    places.push('');
}

function change_place(element, x, y) {
    let set_mode;

    if (!element.querySelector('.o') && !element.querySelector('.x')) set_mode = 'x';
    if (element.querySelector('.x')) set_mode = 'o';
    if (element.querySelector('.o')) set_mode = '';

    element.querySelector('span').classList.remove('o');
    element.querySelector('span').classList.remove('x');

    if(set_mode)
        element.querySelector('span').classList.add(set_mode);
    
    set_place(x, y, set_mode);
}

function set_place(x, y, char){
    places[y*size.x+x] = char;
}

function copy_places(){
    return places.map(p => p);
}

function show_all_moves(){

    if(places.filter(e => e == 'o' || e == 'x').length < 2 && !confirm("There are a lot of moves, it can get slow to draw all!"))
        return;

    window.ctx.reset();

    board_component = window.create_board();
    board_component.board.places = copy_places();
    window.ctx.add(board_component);

    board_component.generate_possibilities_rec();
    board_component.draw_possibilities_rec();

    window.ctx.draw();
}

function best_move(){
    document.querySelector(".best-move").classList.add('hidden');
    if(places.find(e => e == 'o' || e == 'x')){
        board_component = window.create_board();
        board_component.board.places = places;

        if(board_component.board.check() == 'x'){
            document.querySelector(".best-move").innerHTML = `You Already Win!`
            document.querySelector(".best-move").classList.remove('hidden');
            return;
        }

        if(board_component.board.check() == 'o'){
            document.querySelector(".best-move").innerHTML = `You Lose!`
            document.querySelector(".best-move").classList.remove('hidden');
            return;
        }
        
        document.querySelector(".best-move").innerHTML = `Best move is <span class="move">(0, 0)</span>`
        
        board_component.generate_possibilities_rec();
        
        let [value, result] = board_component.board.find_best_move();
        
        if(!result){
            document.querySelector(".best-move").innerHTML = `Draw!`
            document.querySelector(".best-move").classList.remove('hidden');
            return;
        }

        document.querySelector(".best-move .move").innerText = `(${result.x}, ${result.y})`;
        document.querySelector(".best-move").classList.remove('hidden');
    }
}