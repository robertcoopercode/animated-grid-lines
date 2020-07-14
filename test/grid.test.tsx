import React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid } from '../src/Grid';

describe('Grid', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Grid />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
