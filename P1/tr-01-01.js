/*jshint esversion: 6 */
// @ts-check

// these two things are the main UI code for the train
// students learned about them in last week's workbook

import { draggablePoints } from "./p1libs/dragPoints.js";
import { RunCanvas } from "./p1libs/runCanvas.js";

// this is a utility that adds a checkbox to the page 
// useful for turning features on and off
import { makeCheckbox } from "./p1libs/inputHelpers.js";

/**
 * Have the array of control points for the track be a
 * "global" (to the module) variable
 *
 * Note: the control points are stored as Arrays of 2 numbers, rather than
 * as "objects" with an x,y. Because we require a Cardinal Spline (interpolating)
 * the track is defined by a list of points.
 *
 * things are set up with an initial track
 */
/** @type Array<number[]> */
let thePoints = [
  [130, 150],
  [180, 450],
  [300, 520],
  [420, 450],
  [470, 150]
];

/**
 * Draw function - this is the meat of the operation
 *
 * It's the main thing that needs to be changed
 *
 * @param {HTMLCanvasElement} canvas
 * @param {number} param
 */
function draw(canvas, param) {
  let context = canvas.getContext("2d");
  // clear the screen
  context?.save();
  context.fillStyle = "#36563e";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context?.restore();

  // draw the control points
  thePoints.forEach(function(pt) {
    context.beginPath();
    context.arc(pt[0], pt[1], 5, 0, Math.PI * 2);
    context.closePath();
    context.fill();
  });

  // now, the student should add code to draw the track and train
  // code from 2-23 live coding session

  let n = thePoints.length;
  const ns = 300;
  const s = Number(document.getElementById("tensionSlider").value); // tension of the cardinal spline. 0.5 for catmull-rom

  context.beginPath();
  context.moveTo(thePoints[1][0],thePoints[1][1]);

  let samples = []; // sample along the curve so we can arc-length parameterize
  let prev = thePoints[1]; // keep track of previous point as we sample

  // draw the spline using beziers, and sample as we go along
  for (let i = 0; i < n; i++){
    let p0 = thePoints[i];
    let p1 = thePoints[(i+1)%n];
    let p2 = thePoints[(i+2)%n];
    let p3 = thePoints[(i+3)%n];
    // find derivatives at the segment endpoints using a cardinal spline
    let pp1 = [s*(p2[0]-p0[0]),s*(p2[1]-p0[1])];
    let pp2 = [s*(p3[0]-p1[0]),s*(p3[1]-p1[1])];
    // find control points of a cubic bezier using the derivatives
    let c1 = [p1[0]+(1/3)*pp1[0], p1[1]+(1/3)*pp1[1]];
    let c2 = [p2[0]-(1/3)*pp2[0], p2[1]-(1/3)*pp2[1]];
    // draw a bezier from p1 to p2
    context.bezierCurveTo(c1[0],c1[1],c2[0],c2[1],p2[0],p2[1]);

    // sample the curve. take 100 samples in each segment
    for (let j = 0; j < ns; j++){
      let t = j / ns; // dependent variable in the hermite equation. how far along we are in the segment
      // use hermite form of a curve to find points along it using the derivatives we calculated earlier
      // indices 2 and 3 are distance from previous point and total distance
      let p;
      if (!(document.getElementById("check-bspline").checked)){ // cardinal spline formulas
        p = [p1[0] + pp1[0] * t + (-3 * p1[0] - 2 * pp1[0] + 3 * p2[0] - pp2[0]) * t * t + (2 * p1[0] + pp1[0] - 2 * p2[0] + pp2[0]) * t * t * t, // x position
              p1[1] + pp1[1] * t + (-3 * p1[1] - 2 * pp1[1] + 3 * p2[1] - pp2[1]) * t * t + (2 * p1[1] + pp1[1] - 2 * p2[1] + pp2[1]) * t * t * t, // y position
              0, 0, // segment length and total length
              pp1[0] + (-3 * p1[0] - 2 * pp1[0] + 3 * p2[0] - pp2[0]) * t * 2 + (2 * p1[0] + pp1[0] - 2 * p2[0] + pp2[0]) * t * t * 3, // x derivative
              pp1[1] + (-3 * p1[1] - 2 * pp1[1] + 3 * p2[1] - pp2[1]) * t * 2 + (2 * p1[1] + pp1[1] - 2 * p2[1] + pp2[1]) * t * t * 3]; // y derivative
      } else { // bspline formulas
        p = [((-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t*t*t+(3*p0[0]-6*p1[0]+3*p2[0])*t*t+(-3*p0[0]+3*p2[0])*t+(p0[0]+4*p1[0]+p2[0]))/6,
            ((-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t*t*t+(3*p0[1]-6*p1[1]+3*p2[1])*t*t+(-3*p0[1]+3*p2[1])*t+(p0[1]+4*p1[1]+p2[1]))/6,
            0,0,
            (3*(-p0[0]+3*p1[0]-3*p2[0]+p3[0])*t*t+2*(3*p0[0]-6*p1[0]+3*p2[0])*t+(-3*p0[0]+3*p2[0]))/6,
            (3*(-p0[1]+3*p1[1]-3*p2[1]+p3[1])*t*t+2*(3*p0[1]-6*p1[1]+3*p2[1])*t+(-3*p0[1]+3*p2[1]))/6];
      }
      // only calculate distance if we aren't at the very first point on the spline
      if (i > 0 || j > 0){
        // store distance and total distance
        p[2] = Math.sqrt((p[0]-prev[0])*(p[0]-prev[0])+(p[1]-prev[1])*(p[1]-prev[1]));
        p[3] = prev[3] + p[2];
      };
      // update previous sample and store this sample
      prev = p;
      samples.push(p);
    }
  }
  if (document.getElementById("check-simple-track").checked){
    context.stroke();
  }
  context?.closePath();

  //fancy track decorations
  if (!(document.getElementById("check-simple-track").checked)){
    // draw rail ties
    let na = Math.floor(samples[samples.length-1][3]/15); // number of arc-length parameterized rail ties
    let total = samples[samples.length-1][3]; // total length of the spline
    for (let i = 0; i < na; i++){
      let u = i / na; // current fraction of the length of the spline
      let t = u * total; // take the fraction in terms of the spline's total length
      let j = 0;
      // find the segment between samples that contains t and draw a rail tie there
      while (j < samples.length){
        if (samples[j][3] >= t){
          break;
        }
        j++;
      }
      context?.save();
      context.fillStyle = "#907350";
      context?.translate(samples[j][0], samples[j][1]);
      context?.rotate(Math.atan2(samples[j][5],samples[j][4]));
      context?.fillRect(-3,-20,6,40);
      context?.restore();
    }

    //draw rails
    context?.save();
    context.strokeStyle = "#5f8971";
    context.lineWidth = 4;
    const railWidth = 13;
    context?.beginPath();
    for (let i = 0; i < samples.length; i++){
      let mag = Math.sqrt(samples[i][4]*samples[i][4]+samples[i][5]*samples[i][5]);
      let [x,y] = [-samples[i][5]/mag, samples[i][4]/mag];
      context?.save();
        context?.translate(samples[i][0],samples[i][1]);
        context?.translate(railWidth * x, railWidth * y);
        if (i == 0) {context?.moveTo(0,0)} else {context?.lineTo(0,0)};
      context?.restore();
    }
    context?.closePath();
    context?.stroke();
    context?.beginPath();
    for (let i = 0; i < samples.length; i++){
      let mag = Math.sqrt(samples[i][4]*samples[i][4]+samples[i][5]*samples[i][5]);
      let [x,y] = [-samples[i][5]/mag, samples[i][4]/mag];
      context?.save();
        context?.translate(samples[i][0],samples[i][1]);
        context?.translate(-railWidth * x, -railWidth * y);
        if (i == 0) {context?.moveTo(0,0)} else {context?.lineTo(0,0)};
      context?.restore();
    }
    context?.closePath();
    context?.stroke();
    context?.restore();

  }

  const carLength = 72;

  // draw train
  let alongCurve = Math.floor(Number(runcanvas.value) * ns);
  if (!(document.getElementById("check-arc-length").checked)){
    drawEngine(samples[alongCurve][0], samples[alongCurve][1], Math.atan2(samples[alongCurve][5],samples[alongCurve][4]));
    //create smoke
    particles.push([samples[alongCurve][0], samples[alongCurve][1], 1]); //x,y,alpha
    // draw the car (without arc-length)
    let c = 0;
    let carLocation = samples[alongCurve][3] - carLength;
    if (carLocation < 0){
      carLocation += samples[samples.length-1][3];
    }
    while (c < samples.length){
      if (samples[c][3] >= carLocation){
          break;
      }
      c++;
    }
    drawCar(samples[c][0],samples[c][1],Math.atan2(samples[c][5],samples[c][4]));
    // another car
    let c2 = 0;
    let carLocation2 = samples[alongCurve][3] - 2*carLength;
    if (carLocation2 < 0){
      carLocation2 += samples[samples.length-1][3];
    }
    while (c2 < samples.length){
      if (samples[c2][3] >= carLocation2){
          break;
      }
      c2++;
    }
    drawCaboose(samples[c2][0],samples[c2][1],Math.atan2(samples[c2][5],samples[c2][4]));
  } else {
    let total = samples[samples.length-1][3]; // total length of the spline
    let u = Number(runcanvas.value) / Number(runcanvas.range.max); // current fraction of the length of the spline
    let t = u * total; // take the fraction in terms of the spline's total length
    let j = 0;
    // find the segment between samples that contains t and draw the train there
    while (j < samples.length){
        if (samples[j][3] >= t){
            break;
        }
        j++;
    }
    // find the location of the car
    let c = 0;
    let carLocation = samples[j][3] - carLength;
    if (carLocation < 0){
      carLocation += samples[samples.length-1][3];
    }
    while (c < samples.length){
      if (samples[c][3] >= carLocation){
          break;
      }
      c++;
    }
    drawEngine(samples[j][0],samples[j][1],Math.atan2(samples[j][5],samples[j][4]));
    particles.push([samples[j][0], samples[j][1], 1]); //x,y,alpha
    drawCar(samples[c][0],samples[c][1],Math.atan2(samples[c][5],samples[c][4]));
    // another car
    let c2 = 0;
    let carLocation2 = samples[j][3] - 2*carLength;
    if (carLocation2 < 0){
      carLocation2 += samples[samples.length-1][3];
    }
    while (c2 < samples.length){
      if (samples[c2][3] >= carLocation2){
          break;
      }
      c2++;
    }
    drawCaboose(samples[c2][0],samples[c2][1],Math.atan2(samples[c2][5],samples[c2][4]));
  }

  //draw smoke
  if (document.getElementById("check-smoke").checked){
    for (let i = 0; i < particles.length; i++){
      let size = (1.1 - particles[i][2]) * 30;
  
      context?.save();
      context.fillStyle = `rgba(100,100,100,${particles[i][2]})`;
      context?.beginPath();
      context?.arc(particles[i][0], particles[i][1], size, 0, 2*Math.PI);
      context?.fill();
      context?.closePath();
      context?.restore();
  
      particles[i][2] -= .08;
    }
  }

  //draw trees
  for (let i = 0; i < trees.length; i++){
    let tooClose = false;
    for (let j = 0; j < samples.length - 30; j += 30){
      let dist = Math.sqrt((trees[i][0]-samples[j][0])*(trees[i][0]-samples[j][0])+(trees[i][1]-15-samples[j][1])*(trees[i][1]-15-samples[j][1]));
      if (dist < 40){tooClose = true; break;}
    }
    if (!tooClose){drawTree(trees[i][0],trees[i][1]);}
  }

  //remove smoke that's dissipated
  particles = particles.filter(particle => ((particle[2]>0)));

}

function drawEngine(x,y,theta){
  context.save();
  context.translate(x,y);
  context.rotate(theta);
  //wheels
  context?.fillRect(-28,-22,10,6);
  context?.fillRect(18,-22,10,6);
  context?.fillRect(-28,16,10,6);
  context?.fillRect(18,16,10,6);
  //other stuff
  context.fillStyle = "#666547";
  context.fillRect(-32,-4,-10,8);
  context.fillStyle = "#6fcb9f";
  context.fillRect(-32,-18,64,36);
  context.fillStyle = "#ffe28a";
  context.fillRect(-32,-6,64,12);
  context.fillStyle = "#666547";
  context.fillRect(-9,-9,18,18);
  context.fillStyle = "black";
  context.fillRect(-5,-5,10,10);
  context.beginPath();
  context.moveTo(32,-20);
  context.lineTo(50,0);
  context.lineTo(32,20);
  context?.closePath();
  context.fillStyle = "#fb2e01";
  context.fill();
  context.restore();
}

function drawCar(x,y,theta){
  context.save();
  context.translate(x,y);
  context.rotate(theta);
    //wheels
    context?.fillRect(-28,-22,10,6);
    context?.fillRect(18,-22,10,6);
    context?.fillRect(-28,16,10,6);
    context?.fillRect(18,16,10,6);
    //other stuff
  context.fillStyle = "#666547";
  context.fillRect(-32,-4,-10,8);
  context.fillStyle = "#ffe28a";
  context.fillRect(-32,-18,64,36);
  context.fillStyle = "#fffeb3";
  context.fillRect(-32,-6,64,12);
  context.fillStyle = "#666547";
  context.fillRect(-25,-6,18,12);
  context.fillRect(7,-6,18,12);
  context.restore();
}

function drawCaboose(x,y,theta){
  context.save();
  context.translate(x,y);
  context.rotate(theta);
    //wheels
    context?.fillRect(-28,-22,10,6);
    context?.fillRect(18,-22,10,6);
    context?.fillRect(-28,16,10,6);
    context?.fillRect(18,16,10,6);
    //other stuff
  context.fillStyle = "#ffe28a";
  context.fillRect(-32,-18,64,36);
  context.fillStyle = "#6fcb9f";
  context.fillRect(-32,-6,64,12);
  context.fillStyle = "#666547";
  context.fillRect(-6,-6,18,12);
  context.fillStyle = "#fb2e01"
  context?.fillRect(-33,-19,8,38);
  context.restore();
}

function drawTree(x,y){
  context.save();
    context?.translate(x,y);
    const treeColor = context.createLinearGradient(0,-60, 0,-10);
    treeColor.addColorStop(0, "#bec991");
    treeColor.addColorStop(.5, "#5a8b5d");

    context.fillStyle = "#907350";
    context?.beginPath();
    context?.moveTo(-10,0);//trunk
    context?.lineTo(10,0);
    context?.lineTo(8,-30);
    context?.lineTo(-8,-30);
    context?.fill();
    context?.closePath();

    context.fillStyle = treeColor;
    context?.beginPath();
    context?.moveTo(0,-30);// middle part
    context?.arc(0,-46,13,0,2*Math.PI);
    context?.fill();
    context?.moveTo(0,-30);// right part
    context?.arc(12,-33,13,0,2*Math.PI);
    context?.fill();
    context?.moveTo(0,-30);// left part
    context?.arc(-12,-33,13,0,2*Math.PI);
    context?.fill();
    context?.closePath();
  context.restore();
}

// sorting code provided by GeeksForGeeks.com
function sortByY(arr){   
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    // Assume the current position holds
    // the minimum element
    let min_idx = i;
    
    // Iterate through the unsorted portion
    // to find the actual minimum
    for (let j = i + 1; j < n; j++) {
        if (arr[j][1] < arr[min_idx][1]) {
        
            // Update min_idx if a smaller element is found
            min_idx = j;
        }
    }
    
    // Move minimum element to its
    // correct position
    let temp = arr[i];
    arr[i] = arr[min_idx];
    arr[min_idx] = temp;
  }
}

/**
 * Initialization code - sets up the UI and start the train
 */
let canvas = /** @type {HTMLCanvasElement} */ (document.getElementById("canvas1"));
let context = canvas.getContext("2d");

let trees = [];
let numTrees = 30;
for (let i = 0; i < numTrees; i++){
  let x = Math.floor(canvas.width*Math.random());
  trees.push([Math.floor(canvas.width*Math.random()),Math.floor(canvas.height*Math.random())]);
}
sortByY(trees);

let particles = [];

// we need the slider for the draw function, but we need the draw function
// to create the slider - so create a variable and we'll change it later
let slider; // = undefined;

// note: we wrap the draw call so we can pass the right arguments
function wrapDraw() {
    // do modular arithmetic since the end of the track should be the beginning
    draw(canvas, Number(slider.value) % thePoints.length);
}
// create a UI
let runcanvas = new RunCanvas(canvas, wrapDraw);
// now we can connect the draw function correctly
slider = runcanvas.range;

// note: if you add these features, uncomment the lines for the checkboxes
// in your code, you can test if the checkbox is checked by something like:
// document.getElementById("check-simple-track").checked
// in your drawing code
// WARNING: makeCheckbox adds a "check-" to the id of the checkboxes
//
// lines to uncomment to make checkboxes
makeCheckbox("simple-track");
makeCheckbox("arc-length").checked=true;
makeCheckbox("smoke").checked=true;
makeCheckbox("bspline");

// helper function - set the slider to have max = # of control points
function setNumPoints() {
    runcanvas.setupSlider(0, thePoints.length, 0.05);
}

setNumPoints();
runcanvas.setValue(0);

// add the point dragging UI
draggablePoints(canvas, thePoints, wrapDraw, 10, setNumPoints);

