let socket;
let uid;
let number;
let name;
let my_car = null;
let cars = []

$("#sock-con-butt").click(function () {
    name = $("#user-name").val();
    socket.connect($("#sock-addr").val(), messageReceived, connectionError);
});

function messageReceived(e) {
    $("#sock-info").html($("#sock-info").html() + (e.data+"<br />"));
    let data = JSON.parse(e.data);
    if(data['request_type'] === 'init') {
        uid = data['data']['uid'];
        number = data['data']['number'];
        $("#connection_form").hide();
        $("#race_field").show();
        my_car = new Car(uid, $("#race_field"), number, name);
        setInterval(function() {
            my_car.move();
            socket.send(my_car.getData());
        }, 100);
    } else {
        let star = data['star'];
        $("#star").css('left', star[0]);
        $("#star").css('top', star[1]);
        data = data['data'];
        let numbers = []
        for(let i = 0; i < data.length; ++i) {
            let curr_number = data[i]['number'];
            numbers.push(curr_number);
            if(curr_number !== number) {
                if(cars[curr_number] === undefined) {
                    let new_car = new Car(
                        data[i]['uid'],
                        $("#race_field"),
                        curr_number,
                        data[i]['name']
                    );
                    cars[curr_number] = new_car;
                }
                cars[curr_number].setData(data[i]['x'], data[i]['y'], data[i]['angle'], data[i]['name']);
            }
        }
        for(let i = 0; i < cars.length; ++i) {
            if(cars[i] !== undefined)
                if(!numbers.includes(cars[i].getNumber())) {
                    cars[i].delete();
                    cars[i] = undefined;
                }
        }
    }
}

function connectionError(e) {
    alert("Ошибка подключения!");
}

$(document).keydown(function(event){
    if(my_car == null) return;
    switch (event.keyCode) {
        case 38:
            my_car.forward(1);
            break;
        case 40:
            my_car.backward(1);
            break;
        case 37:
            my_car.left(1);
            break;
        case 39:
            my_car.right(1);
            break;
    }
});

$(document).keyup(function(event){
    if(my_car == null) return;
    switch (event.keyCode) {
        case 38:
            my_car.forward();
            break;
        case 40:
            my_car.backward();
            break;
        case 37:
            my_car.left();
            break;
        case 39:
            my_car.right();
            break;
    }
});

$(function(){
    socket = new MySocket();
});