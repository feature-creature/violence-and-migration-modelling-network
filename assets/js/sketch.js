/*
 *
 * Title: UCL VaMM Network website visualisation
 * Name: Luke Demarest
 * Date: 12/2021
 *
 */

let c, flowfield, cols, rows;
let scl = 20;
let inc = 0.7;
let zoff = 0;
let returns = [];
let particles = [];
let numOfParticles = 17;

function setup() {

    let w = document.querySelector("#heady").offsetWidth;
    let h = document.querySelector("#heady").offsetHeight;
    c = createCanvas(w,h);
    c.parent("heady");
    frameRate(25);

    // ----- seeds
    noiseSeed(80);
    randomSeed(100);

    // ----- flowfield
    cols = floor(width / scl);
    rows = floor(height / scl);
    flowfield = new Array(cols * rows);

    // ----- particles
    for( var i = 0; i < numOfParticles; i++ ){ particles[i] = new Particle(); }

    background(234,118,0)

}



function draw() {

    // ----- ghosting background
    if(frameCount % 10 == 0){
        push();
        noStroke();
        fill(234,118,0,15)
        rect(0,0,width,height);
        pop();
    }

    // ----- flowfield
    let yoff = 0;
    for( let y = 0; y < rows; y++ ){
        let xoff = 0;
        for( let x = 0; x < cols; x++ ){

            let angle = noise(xoff, yoff, zoff) * TAU * 14;
            let v     = p5.Vector.fromAngle(angle);
            let index = x + y * cols;

            v.setMag(1.5);
            flowfield[index] = v;
            xoff += inc;

        }

        yoff += inc;
        zoff += 0.03;

    }

    // ----- particles
    for( let i = 0; i < particles.length; i++ ){
        particles[i].follow(flowfield);
        particles[i].update();
        particles[i].edges();
        particles[i].show();
    }

}

