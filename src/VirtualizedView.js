import React from 'react';
import {
  View,
  findNodeHandle,
} from 'react-native';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

const pickIrrelevantProps = (props) => {
  const {
    width,
    height,
    contentHeight,
    contentWidth,
    horizontal,
    viewportBuffer,
    containerRef,
    scrollPosition,
    ...restProps
  } = props;
  return restProps;
};

class VirtualizedView extends React.Component {
  viewRef = React.createRef();

  x = 0;

  y = 0;

  width = 0;

  height = 0;

  visible = true;

  componentDidMount() {
    this.measureLayout(this.props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // irrelevant props change
    // normal rendering
    if (
      shallowCompare({
        props: pickIrrelevantProps(this.props),
        state: this.state,
      }, pickIrrelevantProps(nextProps), nextState)
    ) {
      return true;
    }

    // relevant props change
    // customized rendering
    const {
      viewportBuffer,
      ...restProps
    } = this.props;

    const {
      viewportBuffer: nextViewportBuffer,
      ...restNextProps
    } = nextProps;

    if (
      !shallowCompare({
        props: restProps,
        state: this.state,
      }, restNextProps, nextState)
      && viewportBuffer !== nextViewportBuffer
    ) {
      // viewportBuffer changes
      this.isInViewport(nextProps);
    } else {
      // other relevant props change
      this.measureLayout(nextProps);
    }
    return false;
  }

  isInViewport = (props) => {
    const {
      horizontal,
      width: containerWidth,
      height: containerHeight,
      scrollPosition: {
        x: scrollX,
        y: scrollY,
      },
      viewportBuffer,
    } = props;

    const {
      width,
      height,
      x,
      y,
    } = this;

    let inViewport = true;
    if (
      containerWidth
      && containerHeight
      && width
      && height
    ) {
      const scrollOffset = horizontal ? scrollX : scrollY;
      const viewPortLength = horizontal ? containerWidth : containerHeight;
      const elementOffset = horizontal ? x : y;
      const elementLength = horizontal ? width : height;
      if (
        elementLength + elementOffset < scrollOffset - viewportBuffer
        || elementOffset > scrollOffset + viewPortLength + viewportBuffer
      ) {
        inViewport = false;
      }
    }
    if (inViewport !== this.visible) {
      this.visible = inViewport;
      this.forceUpdate();
    }
  }

  measureLayout = (props) => {
    const { containerRef } = props;
    if (
      containerRef.current
      && this.viewRef.current
    ) {
      const scrollViewNode = findNodeHandle(containerRef.current);
      this.viewRef.current.measureLayout(
        scrollViewNode,
        (x, y, width, height) => {
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.isInViewport(props);
        },
      );
    }
  }

  update() {
    this.isInViewport(this.props);
  }

  render = () => {
    const {
      children,
      ...restProps
    } = pickIrrelevantProps(this.props);

    const { visible, width, height } = this;
    const view = visible ? (
      <View
        {...restProps}
        ref={this.viewRef}
      >
        {children}
      </View>
    ) : (
      <View
        {...restProps}
        style={{
          width,
          height,
        }}
      />
    );

    return view;
  }
}

VirtualizedView.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  height: PropTypes.number,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.number,
  horizontal: PropTypes.bool,
  viewportBuffer: PropTypes.number,
};

VirtualizedView.defaultProps = {
  children: null,
  width: 0,
  height: 0,
  contentHeight: 0,
  contentWidth: 0,
  horizontal: false,
  viewportBuffer: 200,
};

export default VirtualizedView;
