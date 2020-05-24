import React from 'react';

import Board from './Board.js';
import ColorPicker from './ColorPicker';

import {Dijkstra} from './Graph.js';

class Element{
  constructor(name, color, value){
    this.name = name;
    this.color = color;
    this.value = value;
  }
}

class App extends React.Component {
  constructor(props){
    super(props);

    /* Base values */
    const size = 20;
    const active = 0;

    this.size = size;
    this.start_name = 'Start';
    this.end_name = 'End';
    this.base_tile = 0;

    /* Init picker elements */
    var pickerElements = [
      new Element('Base Tile', 'Cyan', 1),
      new Element('Wall', 'Black', -1),
      new Element(this.start_name, 'Green', 1),
      new Element(this.end_name, 'Red', 1)
    ];

    /* Init Board Elements */
    var boardElements = new Array(size * size);
    for(var i = 0; i < size * size; i++){
      boardElements[i] = ([pickerElements[active].color, pickerElements[active].value]);
    }

    this.state = {
      pickerElements: pickerElements,
      boardElements: boardElements,
      size: size,
      start_pos: -1,
      end_pos: -1,
      active: 1
    };
  }

  /* Handle searching of the board */
  startSearch(){
    let g = new Dijkstra(this.state.boardElements, this.state.start_pos, this.state.end_pos, this.size);
    let visited_path = g.search();

    let visited = visited_path[0];
    let path = visited_path[1].reverse();

    /* Print all visited nodes as pinl */
    const elements = this.state.boardElements.slice();
    let t1 = 1000;
    let continue_loop = true;
    visited.forEach(node => {
      if(node === this.state.end_pos){
        continue_loop = false;
      }

      if(continue_loop){
        t1 += 10;
        setTimeout(() => {
          elements[node] = ['Pink', elements[node][1]];
          this.setState({
            boardElements: elements
          })
        }, t1);
      }
    });

    /* Print path nodes as red */
    let t2 = t1;
    path.forEach(node => {
      t2 += 100;
      setTimeout(() => {
        elements[node] = ['Red', elements[node][1]];
        this.setState({
          boardElements: elements
        })
      }, t2);
    });
  }

  updateColors(){
    console.log("Test 2");
  }

  /* Handle Edditing of the board */
  handlePickerClick(i){
    this.setState({
      active: i
    });
  }

  handleBoardClick(i){
    /* Place a tile of the current sollected at the given position */
    const elements = this.state.boardElements.slice();
    const active = this.state.pickerElements[this.state.active];
    const base = this.state.pickerElements[this.base_tile];

    elements[i] = [active.color, active.value];

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
        elements[this.state.start_pos] = [base.color, base.value];

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
        elements[this.state.end_pos] = [base.color, base.value];

        this.setState({
          boardElements: elements,
          end_pos: i
        })
      }
    }
  }

  render(){
    return (
      <div className="app">
        <div className="board-editor">
          <ColorPicker elements={this.state.pickerElements} active={this.state.active} onClick={(i) => this.handlePickerClick(i)}/>
          <Board size={this.state.size} elements={this.state.boardElements} onClick={(i) => this.handleBoardClick(i)}/>
          <button onClick={() => this.startSearch()}>Go</button>
        </div>
      </div>
    );
  }
}

export default App
