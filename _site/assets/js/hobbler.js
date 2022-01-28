class Hobbler {

    constructor(){
        this.p = createVector(random(width),random(height));
        this.pp = this.p.copy();
        this.t = floor(random(3,17))
    }

    update (){
        if(frameCount % this.t == 0) this.pp = this.p.copy();
        this.p.add(random(3,10),random(1,3))
        if(this.p.y > height){
            this.p.y = 0;
            this.pp.y = 0;
        }
        if(this.p.x > width){
            this.p.x = 0;
            this.pp.x = 0;
        }
    }

    draw(){
       //fill("#002855")
        fill(0,40,85,150);
        stroke(255);
        line(this.p.x,this.p.y,this.pp.x,this.pp.y);
        ellipse(this.p.x,this.p.y,10,10);
    }



    // class methods
    static setup(n){
        for(let i=0; i<n; i++) ps.push(new Hobbler());
    }

    static run(){
        for(let i=0; i<ps.length; i++){
            ps[i].update();
            ps[i].draw();
        }
    }
}
