import React from 'react';
import {
  // StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';

const VirtualizedViewWrapper = (props) => (
  <VirtualizedScrollViewContext.Consumer>
    {
      (value) => (
        <VirtualizedView
          {...value}
          {...props}>
        </VirtualizedView>
      )
    }
  </VirtualizedScrollViewContext.Consumer>
)

class VirtualizedView extends React.PureComponent {


  render = () => {
    const {
      props
    } = this;
    return (
      <View
        {...props}>
        
      </View>
    );
  }
}

VirtualizedView.propTypes = {
  children: PropTypes.node,

};

VirtualizedView.defaultProps = {
  children: null,
};

export default VirtualizedViewWrapper;
