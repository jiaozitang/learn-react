import React from './libs/react/react'
import ReactDOM from './libs/react/react-dom'

/** @jsx React.createElement */
// function App() {
//   debugger
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const element = React.createElement("div", {
  title: "foo"
}, "hello");

const container = document.getElementById('container')
ReactDOM.render(element, container);

export default App;
