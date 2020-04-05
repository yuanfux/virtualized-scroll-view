import { createContext } from 'react';

export default createContext({
  width: 0,
  height: 0,
  scrollY: 0,
  scrollX: 0,
  contentHeight: 0,
  contentWidth: 0,
  horizontal: false,
  containerRef: { current: {} },
});
