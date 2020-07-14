import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Grid from '../.';

const App = () => {
  return (
    <div>
      <Grid />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
