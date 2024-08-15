
export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static copy(vector2){
        return new Vector2(vector2.x, vector2.y);
    }

    distance(vector2){
        return Math.sqrt((vector2.x-this.x)*(vector2.x-this.x)+(vector2.y-this.y)*(vector2.y-this.y));
    }
}

export class Color {

    constructor(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString(){
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }
}