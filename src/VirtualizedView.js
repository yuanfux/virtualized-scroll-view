import React from 'react';
import {
  View,
  findNodeHandle,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';

const pickIrrelevantProps = (props) => {
  const {
    horizontal,
    viewportBuffer,
    containerRef,
    scrollViewLayout,
    contentLayout,
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

  pendingUpdate = false;

  needMeasure = true;

  constructor(props) {
    super(props);
    const {
      layout: {
        width,
        height,
        offset,
      } = {},
      horizontal,
    } = props;

    if (
      typeof width === 'number'
      && typeof height === 'number'
    ) {
      this.width = width;
      this.height = height;
      this.visible = false;
      if (typeof offset === 'number') {
        this[horizontal ? 'x' : 'y'] = offset;
        this.needMeasure = false;
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // irrelevant props change
    // normal rendering
    if (
      shallowCompare({
        props: pickIrrelevantProps(this.props),
        state: this.state,
      }, pickIrrelevantProps(nextProps), nextState)
      || this.pendingUpdate
    ) {
      this.pendingUpdate = false;
      return true;
    }

    // relevant props change
    // customized rendering
    // const {
    //   viewportBuffer,
    //   ...restProps
    // } = this.props;

    // const {
    //   viewportBuffer: nextViewportBuffer,
    //   ...restNextProps
    // } = nextProps;

    // if (
    //   !shallowCompare({
    //     props: restProps,
    //     state: this.state,
    //   }, restNextProps, nextState)
    //   && (viewportBuffer !== nextViewportBuffer)
    // ) {
    //   // viewportBuffer changes
    //   // console.log('relevant change', this.props, nextProps);
    //   this.isInViewport(nextProps);
    // }
    return false;
  }

  isInViewport = (props, pendingUpdate = false) => {
    const {
      horizontal,
      scrollPosition: {
        x: scrollX,
        y: scrollY,
      },
      scrollViewLayout: {
        width: containerWidth,
        height: containerHeight,
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
    // console.log('index', this.props.index);
    // console.log('viewportBuffer', viewportBuffer);
    // console.log('scrollY', scrollY);
    // console.log('scrollViewLayout', containerHeight);
    // console.log('viewLayout', height, width, 'y', y);
    // console.log('-----------------');
    if (
      containerWidth
      && containerHeight
      && width
      && height
    ) {
      const scrollOffset = horizontal ? scrollX : scrollY;
      const viewportLength = horizontal ? containerWidth : containerHeight;
      const elementOffset = horizontal ? x : y;
      const elementLength = horizontal ? width : height;
      if (
        elementLength + elementOffset < scrollOffset - viewportBuffer
        || elementOffset > scrollOffset + viewportLength + viewportBuffer
      ) {
        inViewport = false;
      }
    }

    if (inViewport !== this.visible) {
      this.visible = inViewport;
      if (pendingUpdate) {
        this.pendingUpdate = true;
      } else {
        this.update();
      }
    }
  }

  update = () => {
    this.forceUpdate();
  }

  measureLayout = (props) => {
    if (!this.needMeasure) {
      return Promise.resolve();
    }

    const {
      containerRef,
      // scrollPosition: {
      //   x: scrollX,
      //   y: scrollY,
      // },
    } = props;
    // console.log('containerRef', containerRef);
    // console.log('this.viewRef', this.viewRef);
    return new Promise((resolve, reject) => {
      if (
        containerRef.current
        && this.viewRef.current
      ) {
        const scrollViewNode = findNodeHandle(containerRef.current);
        // console.log('trigger measureLayout');
        this.viewRef.current.measureLayout(
          scrollViewNode,
          (x, y, width, height) => {
            // console.log('measurelayout');
            // console.log('measureLayout', this.props.index, y, height, scrollViewNode);
            // console.log('offset', this.props.index * 100 - y);
            // console.log(scrollViewNode.scrollTop);
            // console.log('duration', performance.now() - start);
            this.x = x + (Platform.OS === 'web' ? scrollViewNode.scrollLeft : 0);
            this.y = y + (Platform.OS === 'web' ? scrollViewNode.scrollTop : 0);
            this.width = width;
            this.height = height;
            resolve();
            // this.updateVisibility(props);
          },
        );
      } else {
        reject();
      }
    });
  }

  updateVisibility = (pendingUpdate) => {
    this.isInViewport(this.props, pendingUpdate);
  };

  updateLayout = () => {
    const rt = this.measureLayout(this.props);
    return rt;
  }

  render = () => {
    const {
      children,
      placeholder,
      style,
      ...restProps
    } = pickIrrelevantProps(this.props);
    const { visible, width, height } = this;
    const viewStyle = visible ? style : {
      width,
      height,
    };
    const view = (
      <View
        {...restProps}
        style={viewStyle}
        ref={this.viewRef}
      >
        { visible ? children : placeholder }
      </View>
    );

    return view;
  }
}

VirtualizedView.propTypes = {
  children: PropTypes.node,
  horizontal: PropTypes.bool,
  viewportBuffer: PropTypes.number,
  placeholder: PropTypes.node,
  layout: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number,
    offset: PropTypes.number,
  }),
};

VirtualizedView.defaultProps = {
  children: null,
  horizontal: false,
  viewportBuffer: 200,
  placeholder: null,
  layout: undefined,
};

export default VirtualizedView;
