import React from './react'
import ReactDOM from './react/react-dom'

const ele = (
    <div className='box' onClick={() => console.log('click')}>
        box
        <p>123</p>
    </div>
)

console.log(ele)
ReactDOM.render(ele, document.querySelector('#root'))