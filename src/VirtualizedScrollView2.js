import React from 'react';
import {
  // StyleSheet,
  View,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';

class VirtualizedScrollView extends React.PureComponent {
  containerRef = React.createRef();

  state = {
    width: 0,
    height: 0,
    contentHeight: 0,
    contentWidth: 0,
  }

  // scrollX = 0;

  // scrollY = 0;

  scrollPosition = {
    x: 0,
    y: 0,
  };

  virtualizedViewRefMap = {};

  setVirtualizedViewRef = (key, ref) => {
    this.virtualizedViewRefMap[key] = ref;
    // console.log('setRef', Object.keys(this.virtualizedViewRefMap).length);
  }

  updateVirtualizdView = () => {
    const keys = Object.keys(this.virtualizedViewRefMap);
    for (let i = 0; i < keys.length; i += 1) {
      this.virtualizedViewRefMap[keys[i]].update();
    }
  }

  onScroll = (event) => {
    this.scrollPosition.x = event.nativeEvent.contentOffset.x;
    this.scrollPosition.y = event.nativeEvent.contentOffset.y;
    // this.scrollY = event.nativeEvent.contentOffset.y;

    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }

    this.updateVirtualizdView();
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    this.setState({
      contentHeight,
      contentWidth,
    });

    const { onContentSizeChange } = this.props;
    if (onContentSizeChange) {
      onContentSizeChange(contentWidth, contentHeight);
    }
  }

  onLayout = (event) => {
    this.setState({
      width: event.nativeEvent.layout.width,
      height: event.nativeEvent.layout.height,
    });
  }

  render = () => {
    const {
      props: {
        children,
        horizontal,
      },
      props: {
        forwardedRef,
        style,
        viewportBuffer,
        ...restProps
      },
    } = this;

    const {
      width,
      height,
      // scrollY,
      // scrollX,
      contentHeight,
      contentWidth,
    } = this.state;
    console.log('scrollview');
    return (
      <View
        style={style}
        ref={this.containerRef}
        onLayout={this.onLayout}
      >
        <ScrollView
          {...restProps}
          removeClippedSubviews={false}
          onScroll={this.onScroll}
          onContentSizeChange={this.onContentSizeChange}
          ref={forwardedRef}
        >
          <VirtualizedScrollViewContext.Provider
            value={{
              width,
              height,
              // scrollY: this.scrollX,
              // scrollX: this.scrollY,
              scrollPosition: this.scrollPosition,
              contentHeight,
              contentWidth,
              horizontal,
              viewportBuffer,
              containerRef: this.containerRef,
              setVirtualizedViewRef: this.setVirtualizedViewRef,
            }}
          >
            {children}
          </VirtualizedScrollViewContext.Provider>
        </ScrollView>
      </View>
    );
  }
}

VirtualizedScrollView.propTypes = {
  children: PropTypes.node,
  horizontal: PropTypes.bool,
  scrollEventThrottle: PropTypes.number,
  onScroll: PropTypes.func,
  onContentSizeChange: PropTypes.func,
  onLayout: PropTypes.func,
  forwardedRef: PropTypes.oneOfType([
    PropTypes.shape({
      current: PropTypes.any,
    }),
    PropTypes.func,
  ]),
  viewportBuffer: PropTypes.number,
};

VirtualizedScrollView.defaultProps = {
  children: null,
  horizontal: false,
  scrollEventThrottle: 16,
  onScroll: null,
  onContentSizeChange: null,
  onLayout: null,
  forwardedRef: null,
  viewportBuffer: 0,
};

const VirtualizedScrollViewWrapper = React.forwardRef((props, ref) => (
  <VirtualizedScrollView {...props} forwardedRef={ref} />
));

export default VirtualizedScrollViewWrapper;
