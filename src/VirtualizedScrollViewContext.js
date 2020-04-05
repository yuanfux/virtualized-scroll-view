import { createContext } from 'react';

export default createContext({
  scrollY: 0,
  scrollX: 0,
  contentHeight: 0,
  contentWidth: 0,
  horizontal: false,
});
