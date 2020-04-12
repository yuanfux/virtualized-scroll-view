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

  scrollPosition = {
    x: 0,
    y: 0,
  };

  virtualizedViewRefMap = {};

  setVirtualizedViewRef = (refKey, ref) => {
    this.virtualizedViewRefMap[refKey] = ref;
  }

  updateVirtualizdViews = () => {
    const refKeys = Object.keys(this.virtualizedViewRefMap);
    for (let i = 0; i < refKeys.length; i += 1) {
      this.virtualizedViewRefMap[refKeys[i]].update();
    }
  }

  onScroll = (event) => {
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }

    this.scrollPosition.x = event.nativeEvent.contentOffset.x;
    this.scrollPosition.y = event.nativeEvent.contentOffset.y;
    this.updateVirtualizdViews();
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
      contentHeight,
      contentWidth,
    } = this.state;

    return (
      <View
        style={style}
        ref={this.containerRef}
        onLayout={this.onLayout}
      >
        <ScrollView
          removeClippedSubviews={false}
          {...restProps}
          scrollEventThrottle={16}
          onScroll={this.onScroll}
          onContentSizeChange={this.onContentSizeChange}
          ref={forwardedRef}
        >
          <VirtualizedScrollViewContext.Provider
            value={{
              width,
              height,
              contentHeight,
              contentWidth,
              horizontal,
              viewportBuffer,
              containerRef: this.containerRef,
              scrollPosition: this.scrollPosition,
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
