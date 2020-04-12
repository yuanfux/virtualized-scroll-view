import React from 'react';
import {
  // StyleSheet,
  View,
  findNodeHandle,
} from 'react-native';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
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

const isInViewport = ({
  horizontal,
  containerWidth,
  containerHeight,
  scrollY,
  scrollX,
  viewportBuffer,
  width,
  height,
  x,
  y,
}) => {
  console.log('inViewport');
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
  return inViewport;
};

class VirtualizedView extends React.Component {
  viewRef = React.createRef();

  state = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    visible: true,
  }

  static getDerivedStateFromProps(props, state) {
    const {
      horizontal,
      width: containerWidth,
      height: containerHeight,
      scrollY,
      scrollX,
      viewportBuffer,
    } = props;
    const {
      width,
      height,
      x,
      y,
      visible,
    } = state;
    const nextVisible = isInViewport({
      horizontal,
      containerWidth,
      containerHeight,
      scrollY,
      scrollX,
      viewportBuffer,
      width,
      height,
      x,
      y,
    });
    if (visible !== nextVisible) {
      return {
        visible: nextVisible,
      };
    }
    return null;
  }

  componentDidMount() {
    this.measureLayout();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { scrollX, scrollY, ...restProps } = this.props;
    const { scrollX: nextScrollX, scrollY: nextScrollY, ...restNextProps } = nextProps;

    if (
      shallowCompare({
        props: restProps,
        state: this.state,
      }, restNextProps, nextState)
    ) {
      return true;
    }
    return false;
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
      viewportBuffer,
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
        elementLength + elementOffset < scrollOffset - viewportBuffer
        || elementOffset > scrollOffset + viewPortLength + viewportBuffer
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
        viewportBuffer,
        containerRef,
        ...restProps
      },
    } = this;

    const { visible } = this.state;
    const { width, height } = this.state;
    // original
    // console.log('render');
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
  scrollY: PropTypes.number,
  scrollX: PropTypes.number,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.number,
  horizontal: PropTypes.bool,
  viewportBuffer: PropTypes.number,
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
  viewportBuffer: 200,
  containerRef: { current: {} },
};

export default VirtualizedViewWrapper;
