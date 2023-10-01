export class Graph {
    constructor() {
        // Stores vertices, the vertices' pointers to 
        // other vertices (edges), and the weights of the edges
        this.graph = [];
    }


    // Append the pointers to the new vertex, to the current vertices
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


    // Src & Dst vertice
    dijkstra(v1, v2) {
        return path;
    }


    // Reset graph
    reset() {
        this.graph = [];
    }

}