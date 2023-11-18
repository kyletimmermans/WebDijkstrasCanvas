export class Graph {
    constructor() {
        // Stores vertices, the vertices' pointers to 
        // other vertices (edges), and the weights of the edges
        this.graph = [];
    }


    // Append the pointers to the new vertex, to the current vertices.
    // Then create that new vertex with pointers to the current vertices
    addVertex() {
        let glength = this.graph.length;

        // No appending if its the first vertex, only creation
        if (glength > 0) {
            // Add pointer to every other prexisting vertex to new vertex
            for (let i = 0; i < glength; i++) {
                // Init at 0 bc no edge between them yet
                this.graph[i].push(0)
            }
        }
       
        // Add new vertex
        // +1 bc this node is being added to whats already there
        let arr = new Array(glength+1).fill(0);
        this.graph.push(arr);  
    }


    // Src Vertex, Dst Vertex, Edge Weight
    addEdge(v1, v2, w) {
        // Check if v1 & v2 is a valid edge
        // 0 = Success, 1 = Same Vertex (error)
        // 2 = Edge already exists (error)
        if (v1 == v2) {
            return 1;
        }

        // Only need to check if one way exists
        // If it does, we know the other way does too
        if (this.graph[v1][v2] != 0) {
            return 2;
        }

        // Set each vertices' pointer to one another,
        // to be equal to their edge weight
        // v1 point to v2 & v2 point to v1
        let glength = this.graph.length;
        for (let i = 0; i < glength; i++) {
            if (i == v1) {
                this.graph[v1][v2] = w;
            }

            if (i == v2) {
                this.graph[v2][v1] = w;
            }
        }

        return 0;
    }


    // Recursive helper function to get shortest path elements-
    // in order for given 'parent' array
    traversePath(parents, j) {
        // Base case
        if (parent[j] == -1) {
            this.path.push(j);
            return;   
        }

        // Recursive call to print the path from source to parent of current vertex
        traversePath(parents, parents[j])

        // add current vertex
        this.path.push(j)
    }


    // Graph, Src & Dst vertices
    dijkstra(graph, src, dst) {

        // Track shortest distances, paths, & visited
        let dist = new Array(graph.length).fill(Infinity);
        let parent = new Array(graph.length).fill(-1);
        let visited = new Array(graph.length).fill(false);

        dist[src] = 0;

        // For all nodes in the graph
        // u = currently selected node
        for (let u = 0; u < graph.length; u++) {

            // Get the shortest-distanced non-visited vertex
            let temp_min = Infinity;
            let temp_idx = -1;
            for (let i = 0; i < graph.length; i++) {
                if (visited[u] == false && dist[u] < temp_max) {
                    // Update the newest minimums
                    temp_max = dist[u];
                    temp_idx = u;
                }
            }

            // Mark as visited
            visited[min_idx] = true;

        }



        // Recursively go from final dst to src node and store path in spath
        // child -> parent -> child -> parent -> etc...
        let spath = [];
        traverseParent(parent, dst, spath);

        // reverse() bc we went from dst to src and we want to src to dst
        return [spath, distance];
    }


    // Reset graph
    resetGraph() {
        this.path = [];
    }

}
