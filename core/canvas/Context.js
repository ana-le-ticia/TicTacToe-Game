import { Vector2 } from "../util.js";
import { LineArrow } from "./components/LineArrow.js";

export class Context {

    objects = []
    scale = new Vector2(1, 1);

    position = new Vector2(0, 0);
    translate_position = new Vector2(0, 0);

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.setupDragPane();
    }

    reset(){
        this.scale.x = 1;
        this.scale.y = 1;
        this.translate_position.x = 0;
        this.translate_position.y = 0;
        this.clearRect();
        for(let i = this.objects.length; i--;){
            delete this.objects[i];
        }
        this.objects = [];
    }

    add(object) {
        object.drawing_context = this;
        object.context = this.context;
        
        if (object instanceof LineArrow)
            this.objects.push(object);
        else this.objects.unshift(object);

        return this;
    }

    draw() {
        this.clearRect();
        this.context.setTransform(this.scale.x, 0, 0, this.scale.y, this.translate_position.x, this.translate_position.y)

        for(let i = this.objects.length; i--;){
            if(!this.is_object_visible(this.objects[i])) continue;
            this.context.save();
            this.objects[i].draw();
            this.context.restore();
        }

        return this;
    }

    clearRect() {
        this.context.save();

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.context.restore();
        return this;
    }

    setupDragPane(){
        let drag = false;
        let dragStart = new Vector2(0, 0);
        this.canvas.addEventListener('mousedown', (event) => {

            dragStart.x = event.pageX - this.canvas.offsetLeft - this.translate_position.x;
            dragStart.y = event.pageY - this.canvas.offsetTop  - this.translate_position.y;

            drag = true;
            this.canvas.style.cursor = 'grabbing';
        });

        this.canvas.addEventListener('wheel', (event) => {
            
            const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
            const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;

            const prevX = (mouseX - this.translate_position.x) / this.scale.x;
            const prevY = (mouseY - this.translate_position.y) / this.scale.y;

            const zoomIntensity = 0.001;
            this.scale.x -= event.deltaY * zoomIntensity;
            if (this.scale.x <= 0.1) this.scale.x = 0.1;
            if (this.scale.x >= 3) this.scale.x = 3;
            this.scale.y = this.scale.x;

            const newX = (mouseX - this.translate_position.x) / this.scale.x;
            const newY = (mouseY - this.translate_position.y) / this.scale.y;

            this.translate_position.x += (newX - prevX) * this.scale.x;
            this.translate_position.y += (newY - prevY) * this.scale.y;

            this.draw();
        }, { passive: true });

        this.canvas.addEventListener('mouseup', (event) => {
            drag = false;
            dragStart = Vector2.copy(this.position);
            this.canvas.style.cursor = 'default';
        });
        this.canvas.addEventListener('mouseleave', (event) => {
            drag = false;
            dragStart = Vector2.copy(this.position);
            this.canvas.style.cursor = 'default';
        });
        this.canvas.addEventListener('mousemove', (event) => {
            if (drag) {
                this.position.x = event.pageX - this.canvas.offsetLeft;
                this.position.y = event.pageY - this.canvas.offsetTop;

                this.translate_position.x = this.position.x - dragStart.x;
                this.translate_position.y = this.position.y - dragStart.y;

                this.draw();
            }
        });
    }

    is_object_visible(object) {
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;
        const translateX = this.translate_position.x;
        const translateY = this.translate_position.y;
        const scaleX = this.scale.x;
        const scaleY = this.scale.y;

        if (object instanceof LineArrow) {
            const adjustedX1 = (object.position.x * scaleX) + translateX;
            const adjustedY1 = (object.position.y * scaleY) + translateY;
            const adjustedX2 = (object.to_position.x * scaleX) + translateX;
            const adjustedY2 = (object.to_position.y * scaleY) + translateY;
    
            const lineIsOutOfHorizontalBounds = (adjustedX1 < 0 && adjustedX2 < 0) || (adjustedX1 > canvasWidth && adjustedX2 > canvasWidth);
            const lineIsOutOfVerticalBounds = (adjustedY1 < 0 && adjustedY2 < 0) || (adjustedY1 > canvasHeight && adjustedY2 > canvasHeight);
    
            return !(lineIsOutOfHorizontalBounds || lineIsOutOfVerticalBounds);
        }

        const adjustedX1 = (object.position.x * scaleX) + translateX;
        const adjustedY1 = (object.position.y * scaleY) + translateY;
        const adjustedX2 = ((object.position.x + object.bounding_rect[1].x) * scaleX) + translateX;
        const adjustedY2 = ((object.position.y + object.bounding_rect[1].y) * scaleY) + translateY;

        const objectIsOutOfHorizontalBounds = (adjustedX1 < 0 && adjustedX2 < 0) || (adjustedX1 > canvasWidth && adjustedX2 > canvasWidth);
        const objectIsOutOfVerticalBounds = (adjustedY1 < 0 && adjustedY2 < 0) || (adjustedY1 > canvasHeight && adjustedY2 > canvasHeight);

        return !(objectIsOutOfHorizontalBounds || objectIsOutOfVerticalBounds);
    }

    
    origin(){
        return new Vector2((this.canvas.width*this.scale.x)/2-this.translate_position.x, (this.canvas.height*this.scale.y)/2-this.translate_position.y);
    }

    point_distance(vector2){
        return (new Vector2(vector2.x*this.scale.x, vector2.y*this.scale.x)).distance(this.origin());
    }
}