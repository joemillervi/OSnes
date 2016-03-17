import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import d3 from 'd3';
import _ from 'lodash';

import './style.scss';


const Chart = React.createClass({
  getInitialState: function() {
    return {
      windowWidth: 40   
    }
  },

  componentDidMount: function() {
    window.setTimeout(()=>this.handleResize(), 100)
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },  

  handleResize: function(e) {
    if(window.innerWidth > 600) {
      this.setState({windowWidth: ((window.innerWidth) * 2/3 * 1/4  *1.1)}) ;
    } else {
      this.setState({windowWidth: window.innerWidth * 1/4 * 1.1});
    }
  },

  getButtonLabel: function(index) {
    switch (index) {
      case 0:
          return 'A';
      case 1:
          return 'B';
      case 2:
          return 'Up';
      case 3:
          return 'Right';
      case 4:
          return 'Down';
      case 5:
          return 'Left';
      case 6:
          return 'Start';
      case 7:
          return 'Select';
      default:
          break;
    }
  },
  
  render: function() {
    const data = this.props.data || []
    const width = this.state.windowWidth
    const barHeight = 12;
    const margin = 0;
    const labelSpace = 40;
    
    const x = d3.scale.linear()
                .domain([0, _.max(data)])
                .range([0, width-labelSpace])
    
    const colorScale = d3.scale.category20()
                         .domain(data)
    return (
      <svg 
        className="chart csstrans" 
        width={width} 
        height={barHeight * data.length}>
        <ReactCSSTransitionGroup
          transitionName="addBar" 
          component="g"
          transitionEnterTimeout={2000}
          transitionLeaveTimeout={3000}
          >
        {
          data.map((n, i) => (
            <g key={i}>
              <g 
                transform={`translate(${margin},${barHeight*i})`}>
                <rect 
                  fill={'white'} 
                  width={labelSpace} 
                  height={barHeight-1}
                 />
                <text 
                  x="30" 
                  y="9" 
                  dy=".005em"
                  style={{fill:'Black'}}
                >
                  {this.getButtonLabel(i)}
                </text>
              </g>
              <g 
                transform={`translate(${labelSpace},${barHeight*i})`}>
                <rect 
                  fill={colorScale(n)} 
                  width={x(n)} 
                  height={barHeight-1}
                 />
                <text 
                  x={x(n)-2} 
                  y="9" 
                  dy=".005em"
                  style={{fill:'white'}}
                >
                  {n}
                </text>
              </g>
            </g>
          ))
        }
        </ReactCSSTransitionGroup>
      </svg>
    )
  }
})

export default Chart
