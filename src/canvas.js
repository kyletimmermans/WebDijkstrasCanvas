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

// Create d3 window
var svg = d3.select("body").append("svg") 
    .attr("width", Math.round(screen.availWidth/1.5))
    .attr("height", window.innerHeight-20)
    .on("contextmenu", drawVertex);


// Used w/ clickTracker
// Keep track of src and dst node click
//    src -> dst, src -> dst, etc
// And keep track of which vertices we are connecting

// v = the vertex we just clicked on so we know which vertices
// we're working with here, m is the mouse object
function drawEdge(v, m) {
    if (clickTracker == 1) {

        // Begin to draw line, place down 1st (x1, y1) and 2nd (x2, y2) point
        line = svg.append("line")
        .attr("x1", m[0])
        .attr("y1", m[1])
        .attr("x2", m[0])
        .attr("y2", m[1])

        // Start changing the coords of the
        // 2nd line point (end point) on mousemove
        svg.on("mousemove", function() {
            var m2 = d3.mouse(this);
            // -1 so the line doesn't get in the way of the pointer
            line.attr("x2", m2[0]-1).attr("y2", m2[1]-1)
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

        // Put in 2nd clicked vertex into tempv
        tempv.push(v.charCodeAt(0)-65)
        
        // Weight = Distance between points / 10
        let dx = tempv[0][0] - tempv[1][0];
        let dy = tempv[0][1] - tempv[1][1];
        let weight = Math.round(Math.sqrt(dx*dx+dy*dy) / 10);

        var check = G.addEdge(tempv[0], tempv[1], weight);

        if (check != 0) {
            if (check == 1)
                console.error("Can't create an edge to the same vertex!");
            if (check == 2)
                console.error("Edge already exists between these two vertices!");
        }

        if (check == 0) {
            // We need the centers of both vertices so we can
            // draw the pretty path between them

            // tempv is just the vertex # used in the actual DS here
            let p = prettyPoints(tempv[0], tempv[1])
            
            // Make path object bc it can take textPath label
            // And use the coords from the line
            svg.append("path")
              .attr("d", "M "+p[0]+" "+p[1]+" L "+p[2]+" "+p[3]);
        } else if (check == 1) {
            console.error("Can't create an edge to the same vertex!");
        } else if (check == 2) {
            console.error("Edge already exists between these two vertices!");
        }

        // Reset so new edge can be drawn
        clickTracker = 1;

        // Reset tempv for next temporary edge
        tempv.pop();
        tempv.pop();
   }
}


// Create green circles and keep track of their
// coords. Also attach click event handlers so
// that each left click is a drawEdge() function
function drawVertex() {
    // Limit amount of vertices
    if (labelTracker > "Z") {
        console.error("Cannot add more vertices!");
        return;
    }
    
    // Mouse coords (constantly changing)
    var m = d3.mouse(this);
    
    // Check for vertex overlap
    let clength = coords.length;
    for (let i = 0; i < clength; i++) {
        if (circleOverlap([m[0], m[1]], coords[i], 25)) {
            console.error("Overlap!");
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
        drawEdge(vertexAttr, m);
    });
    
    vertexLabel.on("click", function() {
        drawEdge(vertexAttr, m);
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


// Reset all d3 objects for a new graph to be made
function resetD3() {
    // Reset actual graph data structure
    G.resetGraph()

    // Remove all d3 objects
    // d3.select all circles --> remove
    // d3.select all edge labels --> remove
    // d3.select all paths --> remove
    // d3.select all pathlabels --> remove

    // Reset all global variables
    clickTracker = 1;
    labelTracker = 'A';
    coords = [];
    tempv = [];
}
