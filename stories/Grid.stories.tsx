import React from 'react';
import { withInfo } from '@storybook/addon-info';
import { array, withKnobs, number, text } from '@storybook/addon-knobs';
import { Grid, StorybookComponent, StorybookProps } from '../src/Grid';

export default {
  title: 'Welcome',
  decorators: [withInfo, withKnobs],
  parameters: {
    info: {
      inline: true,
      source: false,
      propTables: [StorybookComponent],
      maxPropArrayLength: 15,
      maxPropStringLength: 200,
      header: false,
      styles: {
        propTableHead: {
          display: 'none',
        },
        source: {
          h1: {
            margin: '20px 0 20px 0',
            padding: '0 0 5px 0',
            fontSize: '25px',
            borderBottom: 'none',
          },
        },
      },
    },
  },
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props?: Partial<StorybookProps>) => (
  <div style={{ height: 500, width: 500, padding: '40px 0', margin: 'auto' }}>
    <Grid
      colors={array('colors', [
        '#7400b8',
        '#6930c3',
        '#5e60ce',
        '#5390d9',
        '#4ea8de',
        '#48bfe3',
        '#56cfe1',
        '#64dfdf',
        '#72efdd',
        '#80ffdb',
      ])}
      speed={number('speed', 20)}
      maxLineLength={number('maxLineLength', 100)}
      squareSize={number('squareSize', 24)}
      lineWidth={number('lineWidth', 4)}
      gridColor={text('gridColor', 'rgba(191, 194, 198, 0.3)')}
      {...props}
    />
  </div>
);
