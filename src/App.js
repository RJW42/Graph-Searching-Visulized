import React from 'react';

import Board from './components/Board.js';
import ColorPicker from './components/ColorPicker';

import AStar from './graph-utils/AStar.js';
import Dijkstra from './graph-utils/Dijkstra.js';

class Element{
  constructor(name, color, value){
    this.name = name;
    this.color = color;
    this.value = value;
  }
}

class SearchDropdown extends React.Component{
  renderContent(){
    let content = [];

    for(let i = 0; i < this.props.searches.length; i++){
      content.push(
        <button class="dropdown-content-button" onClick={() => this.props.onClick(this.props.searches[i][1])}>
          {this.props.searches[i][0]}
        </button>
      );
    }

    return content;
  }

  render(){
    return(
      <div class="search-dropdown">
        <button class="search-dropdown-button">
          {this.props.searches[this.props.current][0]}
        </button>
        <div class="search-dropdown-contnent">
          {this.renderContent()}
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props){
    super(props);

    /* Base values */
    const size = 25;
    const active = 0;

    /* Base values */
    this.size = size;
    this.start_name = 'Start';
    this.end_name = 'End';
    this.base_tile = 0;
    this.search_delay = 10;
    this.path_delay = 100;
    this.clean = true;
    this.busy = false;

    this.graphs = [AStar, Dijkstra];
    this.searches = [["AStar", 0], ["Dijkstra", 1]];

    /* Init picker elements */
    var pickerElements = [
      new Element('Base Tile', 'Cyan', 1),
      new Element('Fast Tile', 'Blue', 2),
      new Element('Faster Tile', 'Orange', 4),
      new Element('Wall', 'Black', -1),
      new Element(this.start_name, 'Green', 1),
      new Element(this.end_name, 'Red', 1)
    ];

    /* Init Board Elements */
    var boardElements = new Array(size * size);
    for(var i = 0; i < size * size; i++){
      boardElements[i] = ([pickerElements[active].color, pickerElements[active].value, ""]);
    }

    this.state = {
      pickerElements: pickerElements,
      boardElements: boardElements,
      size: size,
      start_pos: -1,
      end_pos: -1,
      active: 1,
      current_graph: 0
    };
  }

  /* Handle searching of the board (grid) */
  startSearch(){
    if(this.busy)
      return;
    /* First check if can actually search */
    if(this.state.start_pos === -1 || this.state.end_pos === -1)
      return;

    this.clean = false;
    this.busy = true;

    /* Create a graph and start the search */
    let g = new (this.graphs[this.state.current_graph])(this.state.boardElements, this.state.start_pos, this.state.end_pos, this.size);
    let visited_path = g.search();

    let visited = visited_path[0];
    let path = visited_path[1].reverse();

    const elements = this.state.boardElements.slice();

    /* Update the classes of all tiles in the search */
    let t = 0;
    let continue_loop = true;

    visited.forEach(node => {
      if(node === this.state.end_pos){
        continue_loop = false;
      }

      if(continue_loop){
        t += this.search_delay;
        setTimeout(() => {
          elements[node] = [elements[node][0], elements[node][1], "Pink"];
          this.setState({
            boardElements: elements
          })
        }, t);
      }
    });

    /* Update the classes of all tiles in the search path  */
    path.forEach(node => {
      t += this.path_delay;
      setTimeout(() => {
        elements[node] = [elements[node][0], elements[node][1], "Red"];
        this.setState({
          boardElements: elements
        })
      }, t);
    });

    /* Set the board to not busy again */
    setTimeout(() => {
      this.busy = false;
    }, t);
  }

  /* Handle Edditing of the board */
  handlePickerClick(i){
    /*
     * Deals with the canging of the selected tile (i.e selected tile being
     * item that will be placed on the board e.g. wall, start, ...)
     */
    this.setState({
      active: i
    });
  }

  handleBoardClick(i){
    /*
     * Deals with all aspects of the user clicking the board
     */

    if(this.busy)
      return;

    /* Place a tile of the current sollected at the given position */
    const active = this.state.pickerElements[this.state.active];
    const base = this.state.pickerElements[this.base_tile];
    const elements=this.state.boardElements.slice();

    elements[i] = [active.color, active.value, ""];

    this.setState({
      boardElements: elements
    });

    /* If the tile was a start or end tile we need to remove the previous if
     * palced and update the start / end postion*/
    if(active.name === this.start_name){
      if(this.state.start_pos === -1 ){
        /* Need to update the start postion */
        this.setState({
          start_pos: i
        })
      }else{
        /* Need to update start postion and remove previous*/
        elements[this.state.start_pos] = [base.color, base.value, ""];

        this.setState({
          boardElements: elements,
          start_pos: i
        })
      }
    }else if(active.name === this.end_name){
      if(this.state.end_pos === -1){
        /* Need to update the end position */
        this.setState({
          end_pos: i
        })
      }else{
        /* Need to update end position and remove previous */
        elements[this.state.end_pos] = [base.color, base.value, ""];

        this.setState({
          boardElements: elements,
          end_pos: i
        })
      }
    }else{
      /* Wasnt placing start or end position but could have overidden them */
      if(i === this.state.start_pos){
        this.setState({
          start_pos: -1
        });
      }else if(i === this.state.end_pos){
        this.setState({
          end_pos: -1
        });
      }
    }

    /* Finally check if the board needs to be clearder */
    if(!this.clean)
      this.resetSearchColors(elements);
  }

  handleSearchChange(i){
    /*
     * Change the current search algorithm
     */
    this.setState({
      current_graph: i
    });
  }

  clearBoard(){
    /*
     * Remove all items on the board.
     */
    if(this.busy)
      return;

    const elements = this.state.boardElements.slice();
    const base = this.state.pickerElements[this.base_tile];

    for(let i = 0; i < this.size * this.size; i++){
      elements[i] = [base.color, base.value, ""];
    }

    this.setState({
      boardElements: elements,
      start_pos: -1,
      end_pos: -1
    });

    this.clean = true;
  }

  resetSearchColors(elements=this.state.boardElements.slice()){
    /*
     * Clears the route drawn on the board from the search. But leaves
     * all walls, start, end, ... items on the board
     */

    if(this.busy)
      return;

    for(let i = 0; i < this.size * this.size; i++){
      elements[i] = [elements[i][0], elements[i][1], ""];
    }

    this.setState({
      boardElements: elements
    });

    this.clean = true;
  }

  render(){
    return (
      <div className="app">
        <h1> Graph Search Visualization </h1>
        <div className="board-editor">
          <ColorPicker elements={this.state.pickerElements} active={this.state.active}
                       onClick={(i) => this.handlePickerClick(i)}/>
          <Board size={this.state.size} elements={this.state.boardElements}
                 onClick={(i) => this.handleBoardClick(i)}/>
          <div className="editor-controls">
            <SearchDropdown searches={this.searches} current={this.state.current_graph}
                            onClick={(i) => this.handleSearchChange(i)}/>
            <button className="start" onClick={() => this.startSearch()}>
              Start
            </button>
            <button className="reset" onClick={() => this.resetSearchColors()}>
              Reset
            </button>
            <button className="clear" onClick={() => this.clearBoard()}>
              Clear
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App
