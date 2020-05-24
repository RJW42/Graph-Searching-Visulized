class Graph{
  constructor(elements, start_node, end_node, row_size){
    /* Init Graph*/
    this.start_node = start_node;
    this.end_node = end_node;
    this.row_size = row_size;
    this.num_nodes = row_size * row_size;
    this.adj = [];

    this.createAdjacencyMatrix(elements);
  }

  /* Graph Creation */
  createAdjacencyMatrix(elements){
    /* Init adj array */
    this.adj = new Array(this.num_nodes);

    for(let i = 0; i < this.num_nodes; i++){
      this.adj[i] = new Array(this.num_nodes);

      for(let j = 0; j < this.num_nodes; j++){
        this.adj[i][j] = 0;
      }
    }

    /* Create the weighte4d adjacency matrix */
    /* The weight of each vertex is equal to 1 over the mean
     * of the values of the two elements. i.e two elements with value 2 will
     * have a conected wieght of 0.5 and two elements of value 1 will have a
     * connected weight of 1. If either of the nodes has a value of < 0 no
     * connection will be made. */
    for(let x = 0; x < this.row_size; x++){
      for(let y = 0; y < this.row_size; y++){
        /*Each element is connected to the two next to it and the one above
         * and below it */
        let node_pos = [x, y];
        let connections = [[x-1, y],
                           [x+1, y],
                           [x, y-1],
                           [x, y+1]];

        this.addConnections(node_pos, connections, elements);
      }
    }
  }

  addConnections(node_pos, connections, elements){
    connections.forEach(connection => {
      /* First check connection is within bounds */
      if(connection[0] >= 0 && connection[0] < this.row_size &&
         connection[1] >= 0 && connection[1] < this.row_size){
        /* Is valid so continue and check if both of the elements are non negative weights */
        let v1 = this.getArrayIndex(node_pos[0], node_pos[1]);
        let v2 = this.getArrayIndex(connection[0], connection[1]);

        if(elements[v1][1] > 0 && elements[v2][1] > 0){
          /* Valid values so continue to add edge */
          let weight = (elements[v1][1] + elements[v2][1]) / 2;

          this.adj[v1][v2] = weight;
          this.adj[v2][v1] = weight;
        }else{
          this.adj[v1][v2] = 0;
          this.adj[v2][v1] = 0;
        }
      }
    });
  }

  getArrayIndex(x, y){
    return (this.row_size * y) + x;
  }

  search(){

  }
}

class Dijkstra extends Graph{
  search(){
    /* Dist stores the distance from the start node to all other nodes
     * SptSet stores all nodes visited by the search
     * Parents stores for each node its parent in the path back to the starting node
     * visited stores the order in which nodes were visited by the searching algoerithm
     */
    var dist = new Array(this.num_nodes).fill(1000000);
    var sptSet = new Array(this.num_nodes).fill(false);
    var parents = new Array(this.num_nodes).fill(0);
    var visited = [];

    dist[this.start_node] = 0;
    parents[this.start_node] = -1;

    /* Perform the search */
    for(var count = 0; count < this.num_nodes; count++){
      /* Get the node with the smallest distance from the start */
      let u = this.minDistance(dist, sptSet);

      sptSet[u] = true;

      /* Update the distance from this node to all other nodes */
      for(let v = 0; v < this.num_nodes; v++){
        if(!sptSet[v] && this.adj[u][v] !== 0 && dist[u] !== 1000000 && dist[u] + this.adj[u][v] < dist[v]){
          dist[v] = dist[u] + this.adj[u][v];
          parents[v] = u;
          visited.push(v);
        }
      }
    }

    /* Return the output */
    var path = this.getPath(this.end_node, parents, []);
    return [visited, path];
  }

  minDistance(dist, sptSet){
    var min = 1000000;
    var min_index = -1;

    for(var v = 0; v < this.num_nodes; v++){
      if(sptSet[v] === false && dist[v] <= min){
        min = dist[v];
        min_index = v;
      }
    }

    return min_index;
  }

  getPath(current_node, parents, curren_path){
      let new_node = parents[current_node];
      if(new_node !== -1){
        curren_path.push(new_node);
        return this.getPath(new_node, parents, curren_path);
      }else{
        return curren_path;
      }
  }
}

export default Graph;
export {Graph, Dijkstra};
