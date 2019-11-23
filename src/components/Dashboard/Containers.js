import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../../index.css';
import Plot from 'react-plotly.js';
import ContainerContent from './ContainerContent';
import React from "react";
import _ from "lodash";
import { WidthProvider, Responsive } from "react-grid-layout";

const ResponsiveReactGridLayout = WidthProvider(Responsive);



/**
 * This layout demonstrates how to use a grid with a dynamic number of elements.
 */

export default class DynamicView extends React.PureComponent {
  static defaultProps = {
    className: "layout",
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    rowHeight: 100
  };

  constructor(props) {
    super(props);

    this.state = {
      items: [0, 1].map(function(i, key, list) {
        return {
          plot: false,
          i: i.toString(),
          x: i * 2,
          y: 0,
          w: 3,
          h: 2.2,
          add: i === (list.length - 1)
        };
      }),
      newCounter: 0
    };

    this.onAddItem = this.onAddItem.bind(this);
    this.onLayoutChange = this.onLayoutChange.bind(this);
    this.onBreakpointChange = this.onBreakpointChange.bind(this);
  }

  createElement(el) {
    const removeStyle = {
      position: "absolute",
      right: "2px",
      top: 0,
      cursor: "pointer"
    };
    const i = el.i;
    return (
      <div key={i} data-grid={el}>
        <span
          className="remove"
          style={removeStyle}
        >
        <button onClick={this.onRemoveItem.bind(this, i)}>Remove Item</button>
        <button onClick={this.onRenderPlot.bind(this, i)}>Plot</button>
        {console.log("items", this.state.items[i].plot)}
        { this.showPlot(i) }
        </span>
      </div>
    );
  }
  onAddItem() {
    /*eslint no-console: 0*/
    console.log("adding", this.state.items.length);
    let counter = this.state.items.length;
    console.log("count", counter);
    this.setState({
      // Add a new item. It must have a unique key!
      items: this.state.items.concat({
        plot: false,
        i: counter.toString(),
        x: (this.state.items.length * 2) % (this.state.cols || 12),
        y: Infinity, // puts it at the bottom
        w: 3,
        h: 2.2
      }),
      // Increment the counter to ensure key is always unique.
    });
  }

  // We're using the cols coming back from this to calculate where to add new items.
  onBreakpointChange(breakpoint, cols) {
    this.setState({
      breakpoint: breakpoint,
      cols: cols
    });
  }

  onLayoutChange(layout) {
    this.setState({ layout: layout });
  }

  showPlot(i) {
    if (this.state.items[i].plot) {
      return (
        <Plot
          data={[
              {
              x: [1,2,3,4,2],
              type: 'histogram',
              histnorm: 'percent',
              marker: {color: 'red'}
              }
          ]}
          config={{
              responsive: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['toggleSpikelines', 'zoom2d', 'pan2d', 'select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d']
          }}
          layout={{
              width: 310,
              height: 200,
              xaxis: {visible: true},
              yaxis: {nticks: 3, ticksuffix: "%"}
          }}
          />
      );
    }
  }

  onRemoveItem(i) {
    console.log("removing", i);
    this.setState({ items: _.reject(this.state.items, { i: i }) });
  }

  onRenderPlot(i) {
    const newItems = this.state.items.slice() //copy the array
    newItems[i].plot = true //execute the manipulations
    this.setState({items: newItems}) //set the new state
    console.log('Adding Plot to: ', newItems[i])
  }

  render() {
    console.log(this.props.items)
    return (
      <div>
        <button onClick={this.onAddItem}>Add Item</button>
        <ResponsiveReactGridLayout
          onLayoutChange={this.onLayoutChange}
          onBreakpointChange={this.onBreakpointChange}
          {...this.props}
        >
          {_.map(this.state.items, el => this.createElement(el))}
        </ResponsiveReactGridLayout>
      </div>
    );
  }
}