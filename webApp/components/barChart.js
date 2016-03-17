import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import d3 from 'd3';
import _ from 'lodash';

import './style.scss';


const Chart = React.createClass({
  getInitialState: function() {
    return {
      windowWidth: 100    
    }
  },

  componentDidMount: function() {
    window.setTimeout(()=>this.handleResize(),100)
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.handleResize);
  },  

  handleResize: function(e) {
    if(window.innerWidth > 600) {
      this.setState({windowWidth: window.innerWidth * 0.21});
    } else {
      this.setState({windowWidth: window.innerWidth * 0.31});
    }
  },
  
  render: function() {
    console.log(window.innerWidth);
    const data = this.props.data || []
    const width = this.state.windowWidth-20
    const barHeight = 12;
    const margin = 0;
    const labelSpace = 40;
    
    const x = d3.scale.linear()
                .domain([0, _.max(data)])
                .range([0, width])
    
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
          data.map((n, i) =>(
          <g>

            <g 

              transform={`translate(${margin},${barHeight*i})`}>
              <rect 
                fill={'white'} 
                width={labelSpace} 
                height={barHeight-1}
               />
              <text 
                x={30} 
                y="9" 
                dy=".005em"
                style={{fill:'Black'}}
              >
                {'Select'}
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
                x={x(n)-3} 
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
