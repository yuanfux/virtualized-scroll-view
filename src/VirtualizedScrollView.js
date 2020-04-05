import React from 'react';
import {
  // StyleSheet,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';

class VirtualizedScrollView extends React.PureComponent {
  state = {
    scrollY: 0,
    scrollX: 0,
    contentHeight: 0,
    contentWidth: 0,
  }

  render = () => {
    const {
      props: {
        children,
        horizontal,
      },
      props,
    } = this;
    const {
      scrollY,
      scrollX,
      contentHeight,
      contentWidth,
    } = this.state;

    return (
      <ScrollView
        {...props}
        onScroll={this.onScroll}
        onContentSizeChange={this.onContentSizeChange}
      >
        <VirtualizedScrollViewContext.Provider
          value={{
            scrollY,
            scrollX,
            contentHeight,
            contentWidth,
            horizontal,
          }}
        >
          { children }
        </VirtualizedScrollViewContext.Provider>
      </ScrollView>
    );
  }
}

// const styles = StyleSheet.create({
// });

VirtualizedScrollView.propTypes = {
  children: PropTypes.node,
  horizontal: PropTypes.bool,
};

VirtualizedScrollView.defaultProps = {
  children: null,
  horizontal: false,
};

export default VirtualizedScrollView;
