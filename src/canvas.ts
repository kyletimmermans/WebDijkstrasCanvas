// If 1st click, next click is 2nd (next)
// If 2nd click, next click is 1st (reset)
var clickTracker = 1;

var labelTracker = 'A';

var nodes = [];

// For edge drawing between 2 vertices
var tempnodes = [];

var svg = d3.select("body").append("svg") 
    .attr("width", 700)
    .attr("height", 500)
    .on("contextmenu", DrawVertex);
    
// Used w/ clickTracker
// Keep track of src and dst node click
//    src -> dst, src -> dst, etc
// And keep track of which nodes we are connecting
function DrawEdge(v) {
    if (clickTracker == 1) {
        // In nodes, find the inner array where the
        // 1st elem of it starts with the label we are looking for
        tempnodes.push(nodes.find(innerArray=>innerArray[0]===v));
        clickTracker = 2;
    } else {
        // check if 2nd choice is valid
        if (tempnodes[0][0] == v) {
            console.error("Can't create edge to self vertex!");
            // Reset so new edge can be drawn
            clickTracker = 1;
            tempnodes.pop();
        }

        tempnodes.push(nodes.find(innerArray=>innerArray[0]===v));
        clickTracker = 1;
        
        // Graph.AddEdge();

        // Reset tempnodes
        tempnodes.pop();
        tempnodes.pop();
   }
}

/* If the distance between the centers of the circles
   is less than the radius of both circles (buffer area), then they
   don't have the proper amount of distance between each other
   and the radius' must be overlapping / touching at some point

   If the distance between the 2 epicenters is less than the
   allotted space between them (2 radii), than their areas will
   follow and be overlapped. They need two buffers worth of
   space, otherwise one is on top of the other. */
function CircleOverlap(c1, c2, r) {
    // c1 only has 2 fields
    let dx = c1[0] - c2[1];
    let dy = c1[1] - c2[2];
    let distance = Math.sqrt(dx*dx+dy*dy) 
    if (distance <= r + r) {
        return true;
    } else {
        return false;
    }
}
    
function DrawVertex() {
    // Limit amount of vertices
    if (labelTracker > "Z") {
        console.error("Cannot add more vertices!");
        return;
    }
    
    // Mouse coords (constantly changing)
    var m = d3.pointer(this);
    
    // Check for vertex overlap
    let nlength = nodes.length;
    for (let i = 0; i < nlength; i++) {
        if (CircleOverlap([m[0], m[1]], nodes[i], 20)) {
            console.error("Overlap!");
            return;    
        }
    }

    var vertex = svg.append("circle")
        .attr('cx', m[0])
        .attr('cy', m[1])
        .attr('r', 20)
        .style('fill', 'green');
    
    // Hold onto nodes (vertices) for now
    nodes.push([labelTracker, m[0], m[1]]);
   
    var vertexLabel = svg.append('text')
        .attr('x', m[0])
        .attr('y', m[1])
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text(labelTracker);
      
    // G.AddVertex();
    
    // Creates a local copy of labelTracker that is specific to the
    // circle and label being created and attached to the click handler and stored.
    // The click handler needs to remember the value that was in the local scope at the time it
    // was initialized. Otherwise it will not have the value for later on when it is clicked

    // If the events are called later, they won't have anything to use for DrawEdge,
    // so save it now while we have it
    let vertexAttr = labelTracker;
    
    // Onclick the vertex/vertex label, start the DrawEdge process
    vertex.on("click", function() {
        DrawEdge(vertexAttr);
    });
    
    vertexLabel.on("click", function() {
        DrawEdge(vertexAttr);
    });
    
    // Get current letter, turn to num, add 1, back to character
    labelTracker = String.fromCharCode(labelTracker.charCodeAt(0) + 1);
}