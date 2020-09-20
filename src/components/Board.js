import React from 'react';

class Element extends React.Component{
  /*
   * Represents each sqaure in the grid drawn to the user.
   */

  render(){
    return(
      <button className="board-element"
              onClick={() => this.props.onClick()}
              style={{backgroundColor: this.props.value}}>
      </button>
    );
  }
}

class Board extends React.Component{
  /*
   * Creates the grid of sqaures which the user will create there maze.
   *
   * The board is created by drawing an array of Ellements (HTML buttons)
   * then using CSS to put them in a nice format.
   *
   * The onclock function for each button is handled in APP and passed down.
   * This allows the buttons to not work when running the graph search.
   */

  /* Rendering */
  renderElement(i){
    let value = this.props.elements[i][0];

    /* If the override color has been set then use it */
    if(this.props.elements[i][2].length > 0){
      value = this.props.elements[i][2];
    }

    return (
      <Element value={value}
               onClick={() => this.props.onClick(i)}/>
    );
  }

  renderRow(i){
    let row = [];

    for(var j = 0; j < this.props.size; j++){
      row.push(this.renderElement(this.props.size * i + j));
    }

    return(
      <div className="board-row">
        {row}
      </div>
    );
  }

  render(){
    var rows = []

    for(var i = 0; i < this.props.size; i++){
      rows.push(this.renderRow(i));
    }

    return (
      <div className="board">
        {rows}
      </div>
    );
  }
}

export default Board;
