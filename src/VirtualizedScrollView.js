import React from 'react';
import {
  // StyleSheet,
  // View,
  ScrollView,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
// import shallowCompare from 'react-addons-shallow-compare';
import debounce from 'lodash.debounce';
import Bottleneck from 'bottleneck';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';

class VirtualizedScrollView extends React.PureComponent {
  containerRef = React.createRef();

  scrollViewLayout = {
    width: 0,
    height: 0,
  }

  contentLayout = {
    width: 0,
    height: 0,
  };

  scrollPosition = {
    x: 0,
    y: 0,
  };

  virtualizedViewRefMap = {};

  // Excessive number of pending callbacks error
  // https://github.com/facebook/react-native/issues/27483

  updateViewVisibilities = debounce((pendingUpdate = false) => {
    const refKeys = Object.keys(this.virtualizedViewRefMap);
    for (let i = 0; i < refKeys.length; i += 1) {
      this.virtualizedViewRefMap[refKeys[i]].updateVisibility(pendingUpdate);
    }
    if (pendingUpdate) {
      // force update to improve performance
      // when the number of views is large
      this.forceUpdate();
    }
  });

  updateViewVisibilitiesPendingUpdate = debounce(() => this.updateViewVisibilities(true))

  updateViewVisibilitiesImmediateUpdate = debounce(() => this.updateViewVisibilities(false))

  updateLayout = refKey => this.virtualizedViewRefMap[refKey].updateLayout()

  // concurrent issue
  // https://github.com/facebook/react-native/issues/27483
  updateViewLayouts = () => {
    const limiter = new Bottleneck({
      maxConcurrent: 500,
    });
    const updateLayout = Platform.OS === 'web' ? this.updateLayout : limiter.wrap(this.updateLayout);
    Promise.all(
      Object.keys(this.virtualizedViewRefMap)
        .map(refKey => updateLayout(refKey)),
    ).then(() => {
      // console.log('all finished');
      // measuring is finished
      // update all visibilities
      this.updateViewVisibilitiesPendingUpdate();
    }).catch(() => {
      console.error('VirtualizedView: updateLayout failed.');
    });
  };

  setVirtualizedViewRef = (refKey, ref) => {
    this.virtualizedViewRefMap[refKey] = ref;
  }

  onScroll = (event) => {
    const { onScroll } = this.props;
    if (onScroll) {
      onScroll(event);
    }
    this.scrollPosition.x = event.nativeEvent.contentOffset.x;
    this.scrollPosition.y = event.nativeEvent.contentOffset.y;
    this.updateViewVisibilitiesImmediateUpdate();
  }

  onContentSizeChange = (contentWidth, contentHeight) => {
    // console.log('onContentSizeChange');
    const prevContentWidth = this.contentLayout.width;
    const prevContentHeight = this.contentLayout.height;
    this.contentLayout.width = contentWidth;
    this.contentLayout.height = contentHeight;

    // updating view layouts will be handled in onLayout when
    // onContentSizeChange is being called for the first time
    if (prevContentWidth !== 0 || prevContentHeight !== 0) {
      this.updateViewLayouts();
    }

    const { onContentSizeChange } = this.props;
    if (onContentSizeChange) {
      onContentSizeChange(contentWidth, contentHeight);
    }
  }

  onLayout = (event) => {
    // const prevWidth = this.scrollViewLayout.width;
    // const prevHeight = this.scrollViewLayout.height;
    this.scrollViewLayout.width = event.nativeEvent.layout.width;
    this.scrollViewLayout.height = event.nativeEvent.layout.height;

    // only need to update view visibilities when
    // onLayout is being called for the first time
    this.updateViewLayouts();

    const { onLayout } = this.props;
    if (onLayout) {
      onLayout(event);
    }
  }

  render = () => {
    const {
      props: {
        children,
        horizontal,
      },
      props: {
        forwardedRef,
        viewportBuffer,
        scrollEventThrottle,
        ...restProps
      },
    } = this;
    return (
      <ScrollView
        removeClippedSubviews={false}
        {...restProps}
        scrollEventThrottle={scrollEventThrottle}
        onLayout={this.onLayout}
        onScroll={this.onScroll}
        onContentSizeChange={this.onContentSizeChange}
        ref={this.containerRef}
      >
        <VirtualizedScrollViewContext.Provider
          value={{
            horizontal,
            viewportBuffer,
            containerRef: this.containerRef,
            scrollViewLayout: this.scrollViewLayout,
            contentLayout: this.contentLayout,
            scrollPosition: this.scrollPosition,
            setVirtualizedViewRef: this.setVirtualizedViewRef,
          }}
        >
          {children}
        </VirtualizedScrollViewContext.Provider>
      </ScrollView>
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
    // PropTypes.func,
  ]),
  viewportBuffer: PropTypes.number,
  scrollEventThrottle: PropTypes.number,
};

VirtualizedScrollView.defaultProps = {
  children: null,
  horizontal: false,
  onScroll: null,
  onContentSizeChange: null,
  onLayout: null,
  forwardedRef: null,
  viewportBuffer: 0,
  scrollEventThrottle: 16,
};

const VirtualizedScrollViewWrapper = React.forwardRef((props, ref) => (
  <VirtualizedScrollView {...props} forwardedRef={ref} />
));

export default VirtualizedScrollViewWrapper;
