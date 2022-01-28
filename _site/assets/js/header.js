let c;
let ps = [];

function setup(){
    let w = document.querySelector("#heady").offsetWidth;
    let h = document.querySelector("#heady").offsetHeight;
    c = createCanvas(w,h);
    c.parent("heady");
    frameRate(25);

    for(let i=0; i<100; i++) ps.push(new Hobbler());

    background("#EA7600");
}

function draw(){

    background("#EA7600");

    for(let i=0; i<ps.length; i++){
        ps[i].update();
        ps[i].draw();
    }
}
