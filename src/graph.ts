class Graph {
  graph = [];


  // Append the pointers to the new vertex, to the current vertices
  // Then create that new vertex with pointers to the current vertices
  AddVertex(): void {
      let glength = graph.length;

      // No appending if its the first vertex, only creation
      if (glength > 0) {
        // Add pointer to every other prexisting vertex to new vertex
        for (let i = 0; i < glength; i++) {
            // Init at 0 bc no edge between them yet
            graph[i].push(0)
        }
       }
       
      // Add new vertex
      // +1 bc this node is being added to whats already there
      let arr = new Array(glength+1).fill(0);
      graph.push(arr);  
  }


  // Src & Dst vertice & edge weight
  AddEdge(v1: number, v2: number, w: number ): void {

  }


  // Src & Dst vertice
  Dijkstra(v1: number, v2: number): string {

    return path;
  }

}