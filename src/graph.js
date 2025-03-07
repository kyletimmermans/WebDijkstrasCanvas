export class Graph {
    constructor() {
        // Stores vertices, the vertices' pointers to other vertices (edges), and the weights of the edges
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

        // Set each vertices' pointer to one another, to be equal to their edge weight
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


    // Graph, Src & Dst vertices
    dijkstra(graph, src, dst) {

        // Recursive helper function to get shortest path elements in order for given 'parent' array
        function traversePath(parents, j, spath) {
            // Base case
            if (parent[j] == -1) {
                spath.push(j);
                return;
            }

            // Recursive call to print the path from source to parent of current vertex
            traversePath(parents, parents[j], spath)

            // Add current vertex
            spath.push(j)
        }

        // Track shortest distances, paths, & visited
        let dist = new Array(graph.length).fill(Infinity);
        let parent = new Array(graph.length).fill(-1);
        let visited = new Array(graph.length).fill(false);

        // Distance from src to itself is 0
        // This will force the algorithm to start at this node because it is already the smallest in dist
        dist[src] = 0;

        // For all nodes in the graph
        for (let i = 0; i < graph.length; i++) {

            // Get the shortest-distanced non-visited vertex
            let temp_min = Infinity;
            let min_idx = src;
            for (let j = 0; j < graph.length; j++) {
                if (visited[j] == false && dist[j] < temp_min) {
                    // Update the newest minimums
                    temp_min = dist[j];
                    min_idx = j;
                }
            }


            // Mark as visited
            visited[min_idx] = true;


            // v = neighbor node of min_idx
            for (let v = 0; v < graph[min_idx].length; v++) {
                // If the new distance from src to neighbor is shorter
                // Update the distance and parent
                if (graph[min_idx][v] + dist[min_idx] < dist[v] && graph[min_idx][v] != 0 && !visited[v]) {
                    dist[v] = graph[min_idx][v] + dist[min_idx];
                    parent[v] = min_idx;
                }
            }

        }


        // Recursively go from final dst to src node and store path in spath
        // child -> parent -> child -> parent -> etc...
        let spath = [];
        traversePath(parent, dst, spath);

        return [spath, dist[dst]];
    }


    // Reset graph
    resetGraph() {
        this.graph = [];
    }

}
