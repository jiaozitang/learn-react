import Component from '../component'
import diff from './diff'

const ReactDOM = {
    render
}

function render (vnode, constainer, dom) {
    return diff(dom, vnode, constainer)
    // return constainer.appendChild(_render(vnode))
}

function createComponent (comp, props) {
    let inst
    if (!comp) return ''
    if (comp.prototype && comp.prototype.render) {
        inst = new comp(props)
    } else {
        inst = new Component(props)
        inst.constructor = comp
        inst.render = () => {
            return inst.constructor(props)
        }
    }

    return inst
}

function setComponentProps (comp, props) {

    if (!comp.base) {
        if (comp.componentWillMount) {
            comp.componentWillMount()
        }
    } else if (comp.componentWillReveiveProps) {
        comp.componentWillReveiveProps()
    }

    comp.props = props
    renderComponent(comp)
}

export function renderComponent (comp) {
    let base
    const render = comp.render()
    base = _render(render)

    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate()
    }

    if (comp.base && comp.componentDidUpdate) {
        comp.componentDidUpdate()
    }

    if (!comp.base && comp.componentDidMount) {
        comp.componentDidMount()
    }

    console.log(comp.base && comp.base.parentNode, comp.base)
    if (comp.base && comp.base.parentNode) {
        comp.base.parentNode.replaceChild(base, comp.base)
    }


    comp.base = base
}

function _render (vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
        vnode = ''
    } 

    if (typeof vnode === 'number') {
        vnode = String(vnode)
    }
    if (typeof vnode === 'string') {
        return document.createTextNode(vnode)
        
    }

    const { tag, attrs, childrens } = vnode

    if (typeof tag === 'function') {
        const comp = createComponent(tag, attrs)
        setComponentProps(comp, attrs)

        return comp.base
    }

    const dom = document.createElement(tag)

    if (attrs) {
        Object.keys(attrs).forEach(key => {
            const value = attrs[key]
            setAttribute(dom, key, value)
        })
    } 

    if (childrens) {
        childrens.forEach(i => {
            render(i, dom)
        })
    }
    return dom
}

export function setAttribute (dom, key, value) {
    if (key === 'className') {
        key = 'class'
    }

    if (/on\w+/.test(key)) {
        key = key.toLowerCase()
        dom[key] = value || ''
    } else if (key === 'style') {

    } else {
        if (key in dom) {
            dom[key] = value || ''
        }

        if (value) {
            dom.setAttribute(key, value)
        } else {
            dom.removeAttribute(key)
        }
    }
}

export default ReactDOM