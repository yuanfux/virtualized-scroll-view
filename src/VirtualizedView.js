import React from 'react';
import {
  // StyleSheet,
  View,
  findNodeHandle,
} from 'react-native';
import PropTypes from 'prop-types';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';

const VirtualizedViewWrapper = props => (
  <VirtualizedScrollViewContext.Consumer>
    {
      value => (
        <VirtualizedView
          {...props}
          {...value}
        >
          { props.children }
        </VirtualizedView>
      )
    }
  </VirtualizedScrollViewContext.Consumer>
);

VirtualizedViewWrapper.propTypes = {
  children: PropTypes.node,
};

VirtualizedViewWrapper.defaultProps = {
  children: null,
};

class VirtualizedView extends React.PureComponent {
  viewRef = React.createRef();

  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  }

  componentDidMount() {
    this.measureLayout();
  }

  componentDidUpdate(prevProps) {
    const { contentHeight, contentWidth } = this.props;
    if (
      prevProps.contentHeight !== contentHeight
      || prevProps.contentWidth !== contentWidth
    ) {
      this.measureLayout();
    }
  }

  measureLayout = () => {
    const { containerRef } = this.props;
    if (
      containerRef.current
      && this.viewRef.current
    ) {
      const scrollViewNode = findNodeHandle(containerRef.current);
      this.viewRef.current.measureLayout(
        scrollViewNode,
        (x, y, width, height) => {
          this.setState({
            x,
            y,
            width,
            height,
          });
        },
      );
    }
  }

  isMeasurementFinished = () => {
    const {
      width: containerWidth,
      height: containerHeight,
    } = this.props;
    const {
      width,
      height,
    } = this.state;
    if (
      containerWidth
      && containerHeight
      && width
      && height
    ) {
      return true;
    }
    return false;
  }

  inViewport = () => {
    const {
      horizontal,
      width: containerWidth,
      height: containerHeight,
      scrollY,
      scrollX,
    } = this.props;
    const {
      width,
      height,
      x,
      y,
    } = this.state;

    let inViewport = true;

    if (this.isMeasurementFinished()) {
      const scrollOffset = horizontal ? scrollX : scrollY;
      const viewPortLength = horizontal ? containerWidth : containerHeight;
      const elementOffset = horizontal ? x : y;
      const elementLength = horizontal ? width : height;
      if (
        elementLength + elementOffset < scrollOffset
        || elementOffset > scrollOffset + viewPortLength
      ) {
        inViewport = false;
      }
    }

    return inViewport;
  }

  render = () => {
    const {
      props: {
        children,
        width: containerWidth,
        height: containerHeight,
        scrollY,
        scrollX,
        contentHeight,
        contentWidth,
        horizontal,
        containerRef,
        ...restProps
      },
    } = this;

    // original
    let view = (
      <View
        {...restProps}
        ref={this.viewRef}
      >
        {children}
      </View>
    );

    // placeholder
    if (
      this.isMeasurementFinished()
      && !this.inViewport()
    ) {
      const { width, height } = this.state;
      view = (
        <View
          {...restProps}
          style={{
            width,
            height,
          }}
        />
      );
    }

    return view;
  }
}

VirtualizedView.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
  scrollY: PropTypes.number,
  scrollX: PropTypes.number,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.number,
  horizontal: PropTypes.bool,
  containerRef: PropTypes.shape({
    current: PropTypes.any,
  }),
};

VirtualizedView.defaultProps = {
  children: null,
  width: 0,
  height: 0,
  scrollY: 0,
  scrollX: 0,
  contentHeight: 0,
  contentWidth: 0,
  horizontal: false,
  containerRef: { current: {} },
};

export default VirtualizedViewWrapper;
