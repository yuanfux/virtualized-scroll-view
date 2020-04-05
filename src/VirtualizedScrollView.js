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
    scrollY: 0,
    scrollX: 0,
    contentHeight: 0,
    contentWidth: 0,
  }

  onScroll = (event) => {
    this.setState({
      scrollX: event.nativeEvent.contentOffset.x,
      scrollY: event.nativeEvent.contentOffset.y,
    });

    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
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
        ...restProps
      },
    } = this;

    const {
      width,
      height,
      scrollY,
      scrollX,
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
          {...restProps}
          onScroll={this.onScroll}
          onContentSizeChange={this.onContentSizeChange}
          ref={forwardedRef}
        >
          <VirtualizedScrollViewContext.Provider
            value={{
              width,
              height,
              scrollY,
              scrollX,
              contentHeight,
              contentWidth,
              horizontal,
              containerRef: this.containerRef,
            }}
          >
            { children }
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
};

VirtualizedScrollView.defaultProps = {
  children: null,
  horizontal: false,
  scrollEventThrottle: 16,
  onScroll: null,
  onContentSizeChange: null,
  onLayout: null,
  forwardedRef: null,
};

const VirtualizedScrollViewWrapper = React.forwardRef((props, ref) => (
  <VirtualizedScrollView {...props} forwardedRef={ref} />
));

export default VirtualizedScrollViewWrapper;
