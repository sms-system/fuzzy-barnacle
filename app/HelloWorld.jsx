import React, { Component } from 'react'
// import { Link, Route } from 'wouter'

// export default function HelloWorld(params) {
//   return (
//     <div>
//       Hello,   {params.name}!
//       <Link href="/users/1/about">
//         <a className="link"> about</a>
//       </Link>
//       <Route path="/users/:name/about">
//         <Link href="/users/1">
//           <a className="link"> Profile</a>
//         </Link>
//       </Route>
//     </div>
//   )
// }

export default class HelloWorld extends Component {
  constructor(props) {
    super(props)
    this.state = {date: new Date()}
  }

  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      1000
    )
  }

  componentWillUnmount() {
    clearInterval(this.timerID)
  }

  tick() {
    this.setState({
      date: new Date()
    })
  }

  render() {
    return (
      <div>
        <span>{this.props.rand}</span>
        <h1>Hello, {this.props.name} !</h1>
        <h2>Now is {this.state.date.toLocaleTimeString()}.</h2>
      </div>
    );
  }
}