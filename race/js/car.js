class Car {
    constructor(uid, parent, number, name) {
        this.colors = ['coral', 'lightgreen', 'lightblue', 'white', 'yellow', 'pink', 'orange', 'khaki', 'plum', 'aquamarine'];
        this.uid = uid;
        this.parent = parent;
        this.number = number;
        this.name = name;

        this.speed = 4;
        this.rot_speed = 5;
        this.forward_speed = 0;
        this.backward_speed = 0;
        this.rot_left_speed = 0;
        this.rot_right_speed = 0;
        this.inertia = 0;
        this.MAX_INERTIA = 12;
        this.angle = 0;

        let style = "style='background:" + this.colors[this.number%this.colors.length] + ";'";
        this.obj = $("<div class='car' " + style + "><p>" + this.name + "</p></div>");

        this.parent.append(this.obj);
        this.x = this.obj.position().left;
        this.y = this.obj.position().top;
    }

    getNumber() {
        return this.number;
    }

    forward(speed = 0) {
        this.forward_speed = speed;
    }

    backward(speed = 0) {
        this.backward_speed = speed;
    }

    left(speed = 0) {
        this.rot_left_speed = speed;
    }

    right(speed = 0) {
        this.rot_right_speed = speed;
    }

    rotate() {
        this.obj.css({
            '-webkit-transform' : 'rotate('+this.angle+'deg)',
            '-moz-transform' : 'rotate('+this.angle+'deg)',
            '-ms-transform' : 'rotate('+this.angle+'deg)',
            '-o-transform' : 'rotate('+this.angle+'deg)',
            'transform' : 'rotate('+this.angle+'deg)'
        });
    }

    move() {
        this.angle += (this.rot_right_speed - this.rot_left_speed) * this.rot_speed;
        this.inertia += (this.forward_speed - this.backward_speed) * this.speed;
        this.inertia *= 0.97;
        if(Math.abs(this.inertia) > this.MAX_INERTIA)
            this.inertia = this.MAX_INERTIA * Math.sign(this.inertia);
        this.rotate();
        this.x += this.inertia * Math.cos(this.angle * Math.PI / 180);
        this.y += this.inertia * Math.sin(this.angle * Math.PI / 180);
        if(this.x < 0)
            this.x = 0;
        if(this.y < 0)
            this.y = 0;
        if(this.x > this.parent.width()-this.obj.width())
            this.x = this.parent.width() - this.obj.width();
        if(this.y > this.parent.height()-this.obj.height())
            this.y = this.parent.height() - this.obj.height();
        this.obj.css('left', this.x);
        this.obj.css('top', this.y);
    }

    setData(x, y, angle, name) {
        this.angle = angle;
        this.x = x;
        this.y = y;
        this.name = name;
        this.rotate();
        this.obj.css('left', x);
        this.obj.css('top', y);
        this.obj("p").text(name);
    }

    getData() {
        let data = {};
        data['x'] = this.x;
        data['y'] = this.y;
        data['angle'] = this.angle;
        data['uid'] = this.uid;
        data['name'] = this.name;
        return JSON.stringify(data);
    }

    delete() {
        this.obj.remove();
    }
}