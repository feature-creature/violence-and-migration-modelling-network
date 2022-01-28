
class Particle {

    constructor( ){
        let x = random(width/150,width - width/150);
        let y = random(height/150, height-height/150);
        this.pos = createVector( x, y );
        this.prevPos = this.pos.copy();
        this.vel = createVector(0, 0);
        this.acc = createVector(1, 0);
        this.maxspeed = random(1,5);

        // ----- trail
        this.locs = [];
        this.locsLength = random(5,115);

        // ----- phenotype
        this.w = random(10,15);
        this.c = random(1,254);
        this.ct = 1;
    }

    update( ){

        this.vel.add(this.acc);
        this.vel.limit(this.maxspeed);
        this.acc.mult(0);
        this.pos.add(this.vel);

        // ----- trail
        let p = this.pos.copy();
        this.locs.push(p);
        if(this.locs.length > this.locsLength)this.locs.shift();

        // ----- color
        if(this.c == 255) this.ct = -1;
        if(this.c == 0) this.ct = 1;
        this.c += this.ct;

        // optional
        //this.updatePrev();
    }

    follow( vectors ){

        let x     = floor(this.pos.x / scl);
        let y     = floor(this.pos.y / scl);
        let index = x + y * cols;
        let force = vectors[index];

        this.applyForce(force);
    }

    applyForce( force ){ this.acc.add( force ); }

    updatePrev( ){ this.prevPos = this.pos.copy(); }

    edges( ){

        // border
        let b = 15;

        // ----- right edge
        if( this.pos.x > width - b ){
            this.pos.x = width - b;
            this.updatePrev();
        }

        // ----- left edge
        if( this.pos.x < b ){
            this.pos.x = b;
            this.updatePrev();
        }

        // ----- top edge
        if( this.pos.y > height - b ){
            this.pos.y = height- b;
            this.updatePrev();
        }

        // ----- bottom edge
        if( this.pos.y < b ){
            this.pos.y = b;
            this.updatePrev();
        }
    }

    show( ){

        noFill();
        strokeWeight( map(this.locsLength,15,50,7,2) );

        let a = color(234,118,0,10);
        let b = color(255,10);
        let c = lerpColor(a,b, map(this.c,0,255,0,1));
        stroke( c);

        line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

        beginShape(QUAD_STRIP);
        curveVertex(this.locs[0].x,this.locs[0].y);
        for(let i=0; i<this.locs.length; i++){

            // ----- beginning and end of trail
            if(i == 0 || i == this.locs.length-1){
                push();
                strokeWeight(1);

                let xw = map(this.vel.x,0,10,10,15);
                let yh = map(this.vel.y,0,10,10,15);
                translate( this.locs[i].x, this.locs[i].y );
                rotate( this.vel.x / this.vel.y );

                fill(c);
                ellipse(0,0,xw,yh);

                fill(0,61,76,40);
                ellipse(0,0,5,5);
                pop();
            }

            curveVertex(this.locs[i].x,this.locs[i].y);
        }
        endShape(CLOSE);

        // ----- default do this, but some nice visual changes
        this.updatePrev();
    }

}

