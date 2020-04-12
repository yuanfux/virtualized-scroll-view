import React from 'react';
import {
  // StyleSheet,
  View,
  findNodeHandle,
} from 'react-native';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import debounce from 'lodash.debounce';
import { v4 as uuidv4 } from 'uuid';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';

class VirtualizedViewWrapper extends React.PureComponent {
  id = uuidv4();

  renderVitualizedView = (value) => {
    const {
      setVirtualizedViewRef,
      ...restValue
    } = value;
    const {
      props: {
        children,
      },
      props,
    } = this;
    return (
      <VirtualizedView
        {...props}
        {...restValue}
        ref={ref => setVirtualizedViewRef(this.id, ref)}
      >
        {children}
      </VirtualizedView>
    );
  }

  render = () => {
    console.log('render upper', this.id, this.props.index);
    return (
      <VirtualizedScrollViewContext.Consumer>
        { value => this.renderVitualizedView(value) }
      </VirtualizedScrollViewContext.Consumer>
    );
  }
}

VirtualizedViewWrapper.propTypes = {
  children: PropTypes.node,
};

VirtualizedViewWrapper.defaultProps = {
  children: null,
};

const pickIrrelevantProps = (props) => {
  const {
    width,
    height,
    // scrollY,
    // scrollX,
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
    // const { setVirtualizedViewRef } = this.props;
    // setVirtualizedViewRef(this.viewRef);
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
      console.log('other change');
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
      // viewportBuffer changed
      this.isInViewport(nextProps);
    } else {
      this.measureLayout(nextProps);
    }
    return false;
  }

  // componentDidUpdate(prevProps) {
  //   const {
  //     contentHeight,
  //     contentWidth,
  //     viewportBuffer,
  //   } = this.props;
  //   if (
  //     prevProps.contentHeight !== contentHeight
  //     || prevProps.contentWidth !== contentWidth
  //     || prevProps.viewportBuffer !== viewportBuffer
  //   ) {
  //     this.measureLayout(this.props);
  //   }
  // }

  isInViewport = (props) => {
    // console.log('isInViewport');
    const {
      horizontal,
      width: containerWidth,
      height: containerHeight,
      // scrollY,
      // scrollX,
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
    // console.log('measureLayout');
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
    // console.log('update', this.props.id);
    this.isInViewport(this.props);
  }

  render = () => {
    const {
      children,
      ...restProps
    } = pickIrrelevantProps(this.props);

    const { visible, width, height } = this;
    console.log('render');
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
  // scrollY: PropTypes.number,
  // scrollX: PropTypes.number,
  contentHeight: PropTypes.number,
  contentWidth: PropTypes.number,
  horizontal: PropTypes.bool,
  viewportBuffer: PropTypes.number,
  // containerRef: PropTypes.shape({
  //   current: PropTypes.any,
  // }),
};

VirtualizedView.defaultProps = {
  children: null,
  width: 0,
  height: 0,
  // scrollY: 0,
  // scrollX: 0,
  contentHeight: 0,
  contentWidth: 0,
  horizontal: false,
  viewportBuffer: 200,
  // containerRef: { current: {} },
};

export default VirtualizedViewWrapper;
