import React from 'react';
import { mount } from 'enzyme';
import VirtualizedScrollview from '../src';

describe('<VirtualizedScrollview />', () => {
  test('renders correctly', () => {
    const wrapper = mount(<VirtualizedScrollview />);
    expect(wrapper).toMatchSnapshot();
  });
});
