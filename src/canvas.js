// Use 5.9.2 which has d3.mouse()
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@5.9.2/+esm";
import {Graph} from './graph.js';

const G = new Graph();

// If 1st click, next click is 2nd (next)
// If 2nd click, next click is 1st (reset)
var clickTracker = 1;

var labelTracker = 'A'; // Store letter label for vertex

// Store coords for every node
// Used for edge weight distance
// and preventing circle overlapping
var coords = [];

// For edge drawing between 2 vertices
// Store the 2 currently selected vertices (the last 2 vertices clicked)
// "Temporary Vertices"
var tempv = [];

// Store line data which goes through the
// 1st part of drawEdge and then the 2nd part later
var line;

// Fit into Bootstrap HTML container, don't hardcode dimensions
var containerWidth = document.getElementById("canvas").getBoundingClientRect().width;
var containerHeight = document.getElementById("canvas").getBoundingClientRect().height;

// Append errors to html console
var consoleSquare = document.getElementById("console-square");
// Keep track of err nums to prevent console overflow
var errorAmount = 0;

function console_error(msg) {
    let errorMsgDiv = document.createElement("div");
    errorMsgDiv.id = "error-msg";errorMsgDiv.style.color = "#FF807F";
    errorMsgDiv.style.background = "#290000";
    errorMsgDiv.innerHTML = "&emsp;ⓧ Error: "+msg;
    if (errorAmount != 5) {
        consoleSquare.appendChild(errorMsgDiv);
        errorAmount++;
    } else {
        // Remove all errors and start from the top
        Array.from(document.querySelectorAll('#error-msg')).forEach(errorDiv => errorDiv.remove());
        consoleSquare.appendChild(errorMsgDiv);
        errorAmount = 1;
    }
}

// Create d3 window
var svg = d3.select("body").append("svg") 
    .attr("width", containerWidth)
    .attr("height", containerHeight)
    .on("contextmenu", drawVertex)
    .on("click", function() {
        // Check if the background was clicked
        if (!d3.event.target.matches("circle, text")) {
            drawEdge(1, 1, true);
        }
    }
);

// Used w/ clickTracker
// Keep track of src and dst node click
//    src -> dst, src -> dst, etc
// And keep track of which vertices we are connecting

// v = the vertex we just clicked on so we know which vertices
// we're working with here, m is the mouse object
// c is check if the white background was clicked
function drawEdge(v, m, c) {
    if (clickTracker == 1) {

        if (c) { return; }

        // Begin to draw line, place down 1st (x1, y1) and 2nd (x2, y2) point
        line = svg.append("line")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])
        .style("pointer-events", "none"); // Prevent line from interfering w/ mouse clicks on circles

        // Start changing the coords of the
        // 2nd line point (end point) on mousemove
        svg.on("mousemove", function() {
            var m2 = d3.mouse(this);
            line.attr("x2", m2[0]).attr("y2", m2[1])
        });

        // Put letter to number e.g. 'A' == 0 (1st node in actual graph DS)
        // -65 bc ASCII 'A' is 65 and subtracting it brings us back to normal vertex #'s
        tempv.push(v.charCodeAt(0)-65);
        clickTracker = 2;
   } else {
        // On 2nd click stop creating line and place it down
        svg.on("mousemove", null);

        // Remove the line, it can't textPath, but we
        // used it for its easy coords system
        line.remove();

        // If 2nd click is in white background, reset
        if (c) { clickTracker = 1; tempv = []; return; }

        // Put in 2nd clicked vertex into tempv
        tempv.push(v.charCodeAt(0)-65)

        // Get coords of specific vertices by using their letter to find them
        let c1 = coords.find(innerArray=>innerArray[0]===String.fromCharCode(tempv[0]+65));
        let c2 = coords.find(innerArray=>innerArray[0]===String.fromCharCode(tempv[1]+65));
        
        // Weight = Distance between points / 10
        let dx = c1[1] - c2[1];
        let dy = c1[2] - c2[2];
        let weight = Math.round(Math.sqrt(dx*dx+dy*dy) / 10);

        let check = G.addEdge(tempv[0], tempv[1], weight);

        if (check != 0) {
            if (check == 1)
                console_error("Can't create an edge to the same vertex!");
            if (check == 2)
                console_error("Edge already exists between these two vertices!");
        }

        if (check == 0) {
            // Create pretty points for nice path to be drawn from node-to-node
            let p = prettyPoints([c1[1], c1[2]], [c2[1], c2[2]])
            
            // Generate randomIDs so each path can have a textPath find it uniquely
            let random = new Uint32Array(1);crypto.getRandomValues(random);
            
            // Prevent upside-down textPath label
            // if x1 > x2, right to left draw
            if (p[0] > p[2]) {
                svg.append("path")
                    .attr("id", random[0].toString())
                    .attr("d", "M "+p[2]+" "+p[3]+" L "+p[0]+" "+p[1]);
            } else { // Left to right normal
                svg.append("path")
                    .attr("id", random[0].toString())
                    .attr("d", "M "+p[0]+" "+p[1]+" L "+p[2]+" "+p[3]);
            }

            svg.append("text")
                .attr("dy", -5)
                .append("textPath")
                .attr("xlink:href","#"+random[0].toString())
                .style("text-anchor","middle") 
                .attr("startOffset","50%")
                .text(weight);
        }

        // Reset so new edge can be drawn
        clickTracker = 1;

        // Reset tempv for next temporary edge
        tempv = [];
   }
}


// Create green circles and keep track of their
// coords. Also attach click event handlers so
// that each left click is a drawEdge() function
function drawVertex() {
    // Limit amount of vertices
    if (labelTracker > "Z") {
        console_error("Cannot add more vertices!");
        return;
    }
    
    // Mouse coords (constantly changing)
    var m = d3.mouse(this);
    
    // Check for vertex overlap
    let clength = coords.length;
    for (let i = 0; i < clength; i++) {
        if (circleOverlap([m[0], m[1]], coords[i], 25)) {
            console_error("Node Overlap!");
            return;    
        }
    }

    // Draw circle
    var vertex = svg.append("circle")
        .attr('cx', m[0])
        .attr('cy', m[1])
        .attr('r', 25)
        .style('fill', 'green');
    
    // Add its coords to the list (x, y)
    coords.push([labelTracker, m[0], m[1]]);
   
    // Label the circle with a letter
    var vertexLabel = svg.append('text')
        .attr('x', m[0])
        .attr('y', m[1])
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(labelTracker);
    
    // Add vertex to actual graph
    G.addVertex();
    
    // Creates a local copy of labelTracker that is specific to the
    // circle and label being created and attached to the click handler and stored.
    // The click handler needs to remember the value that was in the local scope at the time it
    // was initialized. Otherwise it will not have the value for later on when it is clicked

    // If the events are called later, they won't have anything to use for drawEdge,
    // so save it now while we have it
    let vertexAttr = labelTracker;
    
    // Onclick the vertex/vertex label, start the draw_edge process
    vertex.on("click", function() {
        drawEdge(vertexAttr, m, false);
    });
    
    vertexLabel.on("click", function() {
        drawEdge(vertexAttr, m, false);
    });
    
    // Get current letter, turn to num, add 1, turn back to new character
    labelTracker = String.fromCharCode(labelTracker.charCodeAt(0) + 1);
}


/* If the distance between the centers of the circles
   is less than the radius of both circles (buffer area), then they
   don't have the proper amount of distance between each other
   and the radius' must be overlapping / touching at some point

   If the distance between the 2 epicenters is less than the
   allotted space between them (2 radii), than their areas will
   follow and be overlapped. They need two buffers worth of
   space, otherwise one is on top of the other. */
function circleOverlap(c1, c2, r) {
    // c1 only has 2 fields bc has no letter, just raw coords
    let dx = c1[0] - c2[1];
    let dy = c1[1] - c2[2];
    let distance = Math.sqrt(dx*dx+dy*dy) 
    if (distance <= r + r) {
        return true;
    } else {
        return false;
    }
}


function prettyPoints(v1, v2) {
    // Need the vertices letter labels so we can search
    // for their coordinates in the coords arr
    let l1 = String.fromCharCode(v1+65)
    let l2 = String.fromCharCode(v2+65)

    // Go through all sets of coords until we get the ones
    // for the 2 given vertices
    let clength = coords.length;
    let ps = []; // points to work with
    for (let i = 0; i < clength - 1; i++) {
        // Doesn't matter which pretty point we draw from 1st
        if (coords[i][0] == l1 || coords[i][0] == l2) {
            ps.push(coords[i]);
        }
    }

    let p1 = prettyMath(v1, v2);
    let p2 = prettyMath(v2, v1);

    // x1, y1, x2, y2 (final)
    return [p1[0], p1[1], p2[0], p2[1]];
}


// math.stackexchange.com/a/127615
function prettyMath(v1, v2) {
    let cx = v1[0]+(25*(v2[0]-v1[0])/Math.sqrt((v2[0]-v1[0])**2+(v2[1]-v1[1])**2));
    let cy = v1[1]+(25*(v2[1]-v1[1])/Math.sqrt((v2[0]-v1[0])**2+(v2[1]-v1[1])**2));
    return [Math.round(cx), Math.round(cy)];
}


// Assign to reset-button
const resetButton = document.getElementById("reset-button");
resetButton.onclick = resetD3;

// Reset all d3 objects for a new graph to be made
function resetD3() {
    // Reset actual graph data structure
    G.resetGraph()

    // Remove all d3 objects
    svg.selectAll('text, circle, line, textPath, path').remove();

    // Reset all global variables
    clickTracker = 1;
    labelTracker = 'A';
    coords = [];
    tempv = [];
}


// Assign to reset-button
const spathButton = document.getElementById("spath-button");
spathButton.onclick = getShortestPath;

var spathDivCount = 0;

function getShortestPath() {
    let inputBox = document.getElementById("input-box").value;
    let inputs = inputBox.split("->");

    // Input error handling
    if (!inputBox.includes('->')) {
        console_error("Incorrect input format!");
        return;
    } else if (inputs.length != 2) {
        console_error("2 vertices required!");
        return;
    }

    let [v1, v2] = [inputs[0].charCodeAt(0)-65, inputs[1].charCodeAt(0)-65];

    // Input error handling
    if ( (v1 > G.graph.length || v1 < 0) || (v2 > G.graph.length || v2 < 0) ) {
        console_error("One or more vertices does not exist!");
        return;       
    } else if (isNaN(v1) || isNaN(v2)) {
        console_error("Vertices improperly entered!");
        return;
    }

    let [spath, dist] = G.dijkstra(G.graph, v1, v2);
    spath = spath.map((x) => String.fromCharCode(x+65));

    // Append shortest paths on button click
    let printable_spath = "<span><u>"+inputs[0]+" to "+inputs[1]+"</u>: "+spath.join(" → ")+" | Dst = "+dist+"</span>";
    let spathDiv = document.createElement("div");
    spathDiv.id = "spath-div";spathDiv.style.display = "flex";spathDiv.style.flexDirection = "column";
    spathDiv.style.justifyContent = "center";spathDiv.style.alignItems = "center";
    spathDiv.style.color = "white";spathDiv.style.fontSize = "18px";
    spathDiv.innerHTML = printable_spath;
    if (spathDivCount != 5) {
        document.getElementById("spaths").appendChild(spathDiv);
        spathDivCount++;
    } else {
        Array.from(document.querySelectorAll('#spath-div')).forEach(spathDiv => spathDiv.remove());
        document.getElementById("spaths").appendChild(spathDiv);
        spathDivCount = 1;
    }
}
