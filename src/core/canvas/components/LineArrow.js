import { Vector2 } from "../../util.js";

export class LineArrow {

    constructor(options) {

        this.object = options.object;
        this.from_position = options.from_position ?? new Vector2(0, 0);
        this.to_position = options.to_position ?? new Vector2(0, 0);

        this.position = this.from_position;

        this.drawing_context = undefined;
        this.context = undefined;
        this.line_color = '#3F3F3F88';
        this.arrow_color = '#3F3F3F';
        this.margin_center = options.margin_center ?? 0;

        this.draw_func = this._draw_dashed_line;
        this.arrow_direction_draw = this._draw_arrow_curved;
        switch (options.arrow_direction){
            case 'bottom': 
                this.arrow_direction_draw = this._draw_arrow_to_bottom_circle;
                break;
        }
    }

    static pointsTo(from, to, arrow_dir = 'curve', margin = 0, object = undefined) {
        let arrow = new LineArrow({
            from_position: from,
            to_position: to,
            arrow_direction: arrow_dir,
            margin_center: margin,
            object: object
        });
        return arrow;
    }

    draw() {
        this._draw_curve_dashed_line();
    }

    _draw_curve_dashed_line() {
        let p1 = new Vector2(this.from_position.x, this.from_position.y);
        let p2 = new Vector2(this.to_position.x, this.to_position.y);
        let size = 10;

        let angle = Math.atan2((p2.y - p1.y), (p2.x - p1.x));
        let hyp = Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y));

        let curvature = -Math.cos(angle) * hyp/10;

        this.context.save();
        this.context.translate(p1.x, p1.y);
        this.context.rotate(angle);

        // line
        this.context.beginPath();
        this.context.strokeStyle = this.line_color;
        this.context.setLineDash([3, 5]);
        this.context.lineWidth = 2;
        this.context.moveTo(this.margin_center, 0);
        this.context.quadraticCurveTo(hyp / 2, 0, hyp, 0);
        
        this.context.stroke();
        
        this.context.restore();

        // triangle
        this.arrow_direction_draw({p1, p2, angle, hyp, size, curvature});
    }

    _draw_arrow_curved(configs) {
        this.context.save();
        this.context.translate(configs.p.x, configs.p.y);
        this.context.rotate(configs.angle);
        
        this.context.beginPath();
        this.context.fillStyle = this.arrow_color;
        this.context.lineTo(configs.hyp - configs.size, configs.size*0.8);
        this.context.lineTo(configs.hyp, 0);
        this.context.lineTo(configs.hyp - configs.size, -configs.size*0.8);
        this.context.closePath();
        this.context.fill();

        this.context.restore();
    }

    _draw_arrow_to_bottom(configs) {
        this.context.save();
        this.context.beginPath();

        this.context.fillStyle = this.arrow_color;
        this.context.lineTo(configs.p2.x - configs.size, configs.p2.y);
        this.context.lineTo(configs.p2.x, configs.p2.y + configs.size);
        this.context.lineTo(configs.p2.x + configs.size, configs.p2.y);

        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }

    _draw_arrow_to_bottom_circle(configs) {
        this.context.save();
        this.context.beginPath();

        this.context.fillStyle = this.arrow_color;
        this.context.arc(configs.p2.x, configs.p2.y, 5, 0, 2 * Math.PI);

        this.context.closePath();
        this.context.fill();
        this.context.restore();
    }
}