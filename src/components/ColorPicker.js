import React from 'react';

class Element extends React.Component{
  render(){
    return(
      <div className="color-picker-element">
        <button className={"color-picker-element-button" + this.props.className}
                onClick={() => this.props.onClick()}
                style={{backgroundColor: this.props.color}}>
        </button>
        <h3 className={this.props.className}> {this.props.name} </h3>
      </div>
    );
  }
}

class ColorPicker extends React.Component{
  /* Rendering */
  renderElement(i){
    var classNames = "";

    if(i === this.props.active){
      classNames += " active ";
    }

    return(
      <Element name={this.props.elements[i].name}
               color={this.props.elements[i].color}
               onClick={() => this.props.onClick(i)}
               className={classNames}/>
    );
  }

  render(){
    var elements_html = [];

    for(var i = 0; i < this.props.elements.length; i++){
      elements_html.push(this.renderElement(i));
    }

    return(
      <div className="color-picker">
        {elements_html}
      </div>
    );
  }
}

export default ColorPicker;
