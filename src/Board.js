import React from 'react';

class Element extends React.Component{
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
  /* Rendering */
  renderElement(i){
    return (
      <Element value={this.props.elements[i][0]}
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
