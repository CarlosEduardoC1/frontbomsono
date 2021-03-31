import * as React from 'react';

export default class ComponentToPrint extends React.PureComponent {

  render() {
    let data = this.props.location.state.data;
    return (
      <div>
        <iframe src={`data:application/pdf;base64,${data}`} height="100%" width="100%"></iframe>
      </div>
    );
  }
}