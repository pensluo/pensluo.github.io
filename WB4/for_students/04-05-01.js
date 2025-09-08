/**
 * 04-05-01.js - a simple JavaScript file that gets loaded with
 * page 5 of Workbook 4 (CS559).
 *
 * written by Michael Gleicher, January 2019
 * modified January 2020, February 2021
 *
 */

/**
 * If you want to read up on JavaScript classes, 
 * see the tutorial on the class website:
 * 
 * https://cs559.github.io/559Tutorials/javascript/oop-in-js-1/
 */

const flashTime = 5000;

class Boid {
    /**
     * 
     * @param {number} x    - initial X position
     * @param {number} y    - initial Y position
     * @param {number} vx   - initial X velocity
     * @param {number} vy   - initial Y velocity
     */
    constructor(x, y, vx = 1, vy = 0) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.legAngle = 0;
        this.ctimer = 0;
    }
    /**
     * Draw the Boid
     * @param {CanvasRenderingContext2D} context 
     */
    draw(context) {
        context.save(); // location
            context.translate(this.x, this.y);
            context.rotate(Math.atan2(this.vy,this.vx));
            context.scale(0.9,0.9);
            context.save(); // body
                context.lineWidth = 2;
                context.save(); // front legs
                    context.translate(4,0);
                    context.rotate(.5*Math.sin(this.legAngle));
                    context.beginPath();
                    context.moveTo(16,11);
                    context.lineTo(4,10);
                    context.lineTo(5,0);
                    context.lineTo(4,-10);
                    context.lineTo(16,-11);
                    context.stroke();
                 context.restore();
                context.save(); // middle legs
                    context.rotate(.8*Math.sin(this.legAngle));
                    context.beginPath();
                    context.moveTo(-1,16);
                    context.lineTo(4,10);
                    context.lineTo(5,0);
                    context.lineTo(4,-10);
                    context.lineTo(-1,-16);
                    context.stroke();
                context.restore();
                context.save(); // back legs
                    context.rotate(.8*Math.cos(this.legAngle));
                    context.beginPath();
                    context.moveTo(-12,14);
                    context.lineTo(-1,9);
                    context.lineTo(-5,0);
                    context.lineTo(-1,-9);
                    context.lineTo(-12,-14);
                    context.stroke();
                context.restore();
                context.lineWidth = 1;
                context.fillStyle = "darkred"; // abdomen
                if (this.ctimer > 0){
                    context.fillStyle = "yellow";
                }
                context.strokeStyle = "black";
                context.beginPath();
                context.ellipse(0,0,10,6,0,0,2*Math.PI);
                context.fill();
                context.stroke();
                context.strokeRect(-8,-1,10,2);
                context.beginPath(); // chompers
                context.moveTo(10,4);
                context.lineTo(15,6);
                context.lineTo(25,3);
                context.lineTo(17,2);
                context.moveTo(10,-4); // left chomper
                context.lineTo(15,-6);
                context.lineTo(25,-3);
                context.lineTo(17,-2);
                context.fill();
                context.stroke();
                context.fillStyle = "black"; // thorax
                context.beginPath();
                context.ellipse(6,0,3,5,0,0,2*Math.PI);
                context.fill();
                context.stroke();
                context.beginPath(); // head
                context.ellipse(10,0,3,6,0,0,2*Math.PI);
                context.fill();
                context.stroke();
            context.restore();
        context.restore();
    }
    /**
     * Perform the "steering" behavior -
     * This function should update the velocity based on the other
     * members of the flock.
     * It is passed the entire flock (an array of Boids) - that includes
     * "this"!
     * Note: dealing with the boundaries does not need to be handled here
     * (in fact it can't be, since there is no awareness of the canvas)
     * *
     * And remember, (vx,vy) should always be a unit vector!
     * @param {Array<Boid>} flock 
     */
    steer(flock) {
        let me = this;
        /*
		// Note - this sample behavior is just to help you understand
		// what a steering function might  do
		// all this one does is have things go in circles, rather than
		// straight lines
		// Something this simple would not count for the advanced points:
		// a "real" steering behavior must consider other boids,
		// or at least obstacles.
		
        // a simple steering behavior: 
        // create a rotation matrix that turns by a small amount
        // 2 degrees per time step
        const angle = 2 * Math.PI / 180;
        const s = Math.sin(angle);
        const c = Math.cos(angle);

        let ovx = this.vx;
        let ovy = this.vy;

        this.vx =  ovx * c + ovy * s;
        this.vy = -ovx * s + ovy * c;
		*/
        // random boid steering
        let randomDraw = Math.floor(50 * Math.random()); // 1 in 50 chance to turn slightly
        if (randomDraw == 0){
            let currentAngle = Math.atan2(me.vy,me.vx);
            let change = .3 - .6 * Math.random(); // change size: +-.3
            currentAngle += change;
            me.vx = Math.cos(currentAngle);
            me.vy = Math.sin(currentAngle);
        }

        const boidsize = 18;
        let nearby = [];
        flock.forEach(function (boid) {
            if (me!=boid){
                // boid collision
                if ((Math.abs(me.x-boid.x) <= boidsize)&&(Math.abs(me.y-boid.y) <= boidsize)){
                    let ydir = me.y-boid.y;
                    let xdir = me.x-boid.x;
                    let mag = Math.sqrt(xdir*xdir+ydir*ydir);
                    me.vx = xdir / mag;
                    me.vy = ydir / mag;
                    me.ctimer = flashTime;
                }
                // keep track of nearby boids that will influence steering
                const distance = Number(distanceSlider.value);
                if (Math.sqrt((me.x-boid.x)*(me.x-boid.x)+(me.y-boid.y)*(me.y-boid.y)) <= distance){
                    nearby.push(boid);
                }
            }
        });
        // boid alignment
        let alignment = Number(alignmentSlider.value);
        let avgxv = 0.0;
        let avgyv = 0.0;
        nearby.forEach (function (boid){
            avgxv += boid.vx;
            avgyv += boid.vy;
        });

        if (nearby.length != 0){
            avgxv = avgxv/nearby.length;
            avgyv = avgyv/nearby.length;
        } else {
            avgxv = me.vx;
            avgyv = me.vy;
        }

        let desiredAngle = Math.atan2(avgyv, avgxv);
        let currentAngle = Math.atan2(me.vy,me.vx);
        let change;
        if (Math.abs(desiredAngle-currentAngle) > Math.PI){
            change = -alignment*(desiredAngle-currentAngle)/75;
        } else {
            change = alignment*(desiredAngle-currentAngle)/75;
        }
        currentAngle += change;
        me.vx = Math.cos(currentAngle);
        me.vy = Math.sin(currentAngle);

        // boid separation
        let separation = Number(separationSlider.value);
        currentAngle = Math.atan2(me.vy,me.vx);
        nearby.forEach (function (boid){
            let ydir = me.y-boid.y;
            let xdir = me.x-boid.x;
            let separationTheta = Math.atan2(ydir,xdir);
            let separationAmt;
            if (Math.abs(separationTheta-currentAngle) > Math.PI){
                separationAmt = -separation*(separationTheta-currentAngle)/200;
            } else {
                separationAmt = separation*(separationTheta-currentAngle)/200;
            }
            currentAngle += separationAmt;
            me.vx = Math.cos(currentAngle);
            me.vy = Math.sin(currentAngle);
        });
        
        // boid cohesion
        let cohesion = Number(cohesionSlider.value);
        currentAngle = Math.atan2(me.vy,me.vx);
        let avgx = 0;
        let avgy = 0;
        nearby.forEach (function (boid){
            avgx += boid.x;
            avgy += boid.y;
        });

        if (nearby.length != 0){
            avgx = avgx/nearby.length;
            avgy = avgy/nearby.length;
            let cohesionAngle = Math.atan2(avgy-me.y, avgx-me.x);
            let cohesionAmount;
            if (Math.abs(cohesionAngle-currentAngle) > Math.PI){
                cohesionAmount = -cohesion*(cohesionAngle-currentAngle)/100;
            } else {
                cohesionAmount = cohesion*(cohesionAngle-currentAngle)/100;
            }
            currentAngle += cohesionAmount;
            me.vx = Math.cos(currentAngle);
            me.vy = Math.sin(currentAngle);
        }  

        // mouse attraction
        currentAngle = Math.atan2(me.vy,me.vx);
        let mouseAttraction = Number(mouseAttractionSlider.value);
        let yToMouse = mouseY-me.y;
        let xToMouse = mouseX-me.x;
        let mouseAngle = Math.atan2(yToMouse, xToMouse);
        let mouseAmount;
        if (Math.abs(mouseAngle-currentAngle) > Math.PI){
            mouseAmount = -mouseAttraction*(mouseAngle-currentAngle)/150;
        } else {
            mouseAmount = mouseAttraction*(mouseAngle-currentAngle)/150;
        }
        currentAngle += mouseAmount;
        me.vx = Math.cos(currentAngle);
        me.vy = Math.sin(currentAngle);
    }
}


/** the actual main program
 * this used to be inside of a function definition that window.onload
 * was set to - however, now we use defer for loading
 */

 /** @type Array<Boid> */
let boids = [];

let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("flock"));
let context = canvas.getContext("2d");

let speedSlider = /** @type {HTMLInputElement} */ (document.getElementById("speed"));
let alignmentSlider = /** @type {HTMLInputElement} */ (document.getElementById("alignment"));
let separationSlider = /** @type {HTMLInputElement} */ (document.getElementById("separation"));
let cohesionSlider = /** @type {HTMLInputElement} */ (document.getElementById("cohesion"));
let distanceSlider = /** @type {HTMLInputElement} */ (document.getElementById("dist"));
let mouseAttractionSlider = /** @type {HTMLInputElement} */ (document.getElementById("mouse"));

let mouseX = canvas.width/2;
let mouseY = canvas.height/2;

canvas.onmousemove = function(event) {
    const x = event.clientX;
    const y = event.clientY;
    let box = /** @type {HTMLCanvasElement} */(event.target).getBoundingClientRect();
    mouseX = x-box.left;
    mouseY = y-box.top;
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.arc(canvas.width/4,canvas.height/2,50,0,Math.PI*2); // left obstacle
    context.stroke();
    context.beginPath();
    context.arc(3*canvas.width/4,canvas.height/2,50,0,Math.PI*2); // right obstacle
    context.stroke();
    boids.forEach(boid => boid.draw(context));
}
// initial beetles
add10();
add10();

function add10(){
    for (let i = 0; i < 10; i++){
        let x = Math.floor(canvas.width * Math.random());
        let y = Math.floor(canvas.height * Math.random());

        // don't spawn in left obstacle
        let distFromLeft = Math.sqrt(((canvas.width/4)-x)*((canvas.width/4)-x)+
            ((canvas.height/2)-y)*((canvas.height/2)-y));
        while (distFromLeft <= 60){
            x = Math.floor(canvas.width * Math.random());
            y = Math.floor(canvas.height * Math.random());
            distFromLeft = Math.sqrt(((canvas.width/4)-x)*((canvas.width/4)-x)+
            ((canvas.height/2)-y)*((canvas.height/2)-y));
        }
        // don't spawn in right obstacle
        let distFromRight = Math.sqrt(((3*canvas.width/4)-x)*((3*canvas.width/4)-x)+
            ((canvas.height/2)-y)*((canvas.height/2)-y));
        while (distFromRight <= 60){
            x = Math.floor(canvas.width * Math.random());
            y = Math.floor(canvas.height * Math.random());
            distFromRight = Math.sqrt(((3*canvas.width/4)-x)*((3*canvas.width/4)-x)+
            ((canvas.height/2)-y)*((canvas.height/2)-y));
        }

        let theta = 2 * Math.PI * Math.random();
        let vx = Math.cos(theta);
        let vy = Math.sin(theta);
        boids.push(new Boid(x,y,vx,vy));
    }
}

/**
 * Handle the buttons
 */
document.getElementById("add").onclick = function () {
    add10();
};
document.getElementById("clear").onclick = function () {
    boids = [];
};

let lastTime; // will be undefined by default
/**
 * The Actual Execution
 */
function loop(timestamp) {
    // time step - convert to 1/60th of a second frames
    // 1000ms / 60fps
    const delta = (lastTime ? timestamp-lastTime : 0) * 1000.0/60.0;

    // change directions
    boids.forEach(boid => boid.steer(boids));
    // move forward
    let speed = Number(speedSlider.value);
    boids.forEach(function (boid) {
        boid.ctimer = boid.ctimer - delta;
        boid.legAngle += speed/10;
        if (boid.ctimer < 0){
            boid.ctimer = 0;
        }
        boid.x += boid.vx * speed;
        boid.y += boid.vy * speed;
    });
    // make sure that we stay on the screen
    boids.forEach(function (boid) {
        if ((boid.x + boid.vx * speed) > canvas.width){ //update velocity
            boid.vx = -boid.vx;
            boid.ctimer = flashTime;
        }
        if ((boid.x + boid.vx * speed) < 0){
            boid.vx = -boid.vx;
            boid.ctimer = flashTime;
        }
        if ((boid.y + boid.vy * speed) > canvas.height){
            boid.vy = -boid.vy;
            boid.ctimer = flashTime;
        }
        if ((boid.y + boid.vy * speed) < 0){
            boid.vy = -boid.vy;
            boid.ctimer = flashTime;
        }

        //check collision with obstacles
        let distFromLeft = Math.sqrt(((canvas.width/4)-boid.x)*((canvas.width/4)-boid.x)+
            ((canvas.height/2)-boid.y)*((canvas.height/2)-boid.y));
        if (distFromLeft <= 60){
            let ydir = boid.y-canvas.height/2;
            let xdir = boid.x-canvas.width/4;
            let mag = Math.sqrt(xdir*xdir+ydir*ydir);
            boid.vx = xdir / mag;
            boid.vy = ydir / mag;
            boid.ctimer = flashTime;
        }
        // right obstacle
        let distFromRight = Math.sqrt(((3*canvas.width/4)-boid.x)*((3*canvas.width/4)-boid.x)+
            ((canvas.height/2)-boid.y)*((canvas.height/2)-boid.y));
        if (distFromRight <= 60){
            let ydir = boid.y-canvas.height/2;
            let xdir = boid.x-3*canvas.width/4;
            let mag = Math.sqrt(xdir*xdir+ydir*ydir);
            boid.vx = xdir / mag;
            boid.vy = ydir / mag;
            boid.ctimer = flashTime;
        }

        if (boid.x > canvas.width){ //update postion
            boid.x = canvas.width - 1;
        }
        if (boid.x < 0){
            boid.x = 1;
        }
        if (boid.y > canvas.height){
            boid.y = canvas.height - 1;
        }
        if (boid.y < 0){
            boid.y = 1;
        }
    });
    // now we can draw
    draw();
    // and loop
    lastTime = timestamp;
    window.requestAnimationFrame(loop);

}
// start the loop with the first iteration
window.requestAnimationFrame(loop);


