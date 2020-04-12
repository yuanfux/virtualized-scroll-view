import React from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid/non-secure';
import VirtualizedScrollViewContext from './VirtualizedScrollViewContext';
import VirtualizedView from './VirtualizedView';

class VirtualizedViewWrapper extends React.PureComponent {
  refKey = nanoid();

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
        ref={ref => setVirtualizedViewRef(this.refKey, ref)}
      >
        {children}
      </VirtualizedView>
    );
  }

  render = () => (
    <VirtualizedScrollViewContext.Consumer>
      {value => this.renderVitualizedView(value)}
    </VirtualizedScrollViewContext.Consumer>
  );
}

VirtualizedViewWrapper.propTypes = {
  children: PropTypes.node,
};

VirtualizedViewWrapper.defaultProps = {
  children: null,
};

export default VirtualizedViewWrapper;
