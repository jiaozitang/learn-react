// alert(1)

import React from './react'
import ReactDOM from './react/react-dom'

const ele = (
    <div className='box' onClick={() => console.log('click')}>
        box
        <p>123</p>
    </div>
)

function Home (props) {
    return (
        <div className='home'>
            Home
            <p>home-1</p>
        </div>
    )
}

class Home3 extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            num: 0
        }
    }

    componentWillMount () {
        console.log('组件将要加载')
    }

    componentWillReveiveProps () {
        console.log('组件接收参数')
    }

    componentWillUpdate () {
        console.log('组件将要更新')
    }

    componentDidMount () {
        console.log('组件已经加载')
    }

    componentDidUpdate () {
        console.log('组件已经更新')
    }

    render () {
        return (
            <div className='home3'>
                Home3
                <p>home-3</p>
                <p>num: {this.state.num}</p>
                <button onClick={() => this.setState({num: this.state.num + 1})}>add</button>
            </div>
        )
    }
}

console.log(ele)

ReactDOM.render(ele, document.querySelector('#root'))
// ReactDOM.render(<Home title='home' />, document.querySelector('#root'))
ReactDOM.render(<Home3 title='home3' />, document.querySelector('#root'))