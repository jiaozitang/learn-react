import { setAttribute } from '../react-dom'

export default function diff (dom, vnode, container) {
    const ret = diffNode(dom, vnode)

    if (container) {
        container.appendChild(ret)
    }

    return ret
}

function diffNode(dom, vnode) {
    let out = dom
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') {
        vnode = ''
    } 

    if (typeof vnode === 'number') {
        vnode = String(vnode)
    }

    if (typeof vnode === 'string') {
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                dom.textContent = vnode
            }
        } else {
            out = document.createTextNode(vnode)
            if (dom && dom.parentNode) {
                dom.parentNode.replaceChild(dom, out)
            }
        }

        return out
    }

    if (!dom) {
        console.log(vnode)
        out = document.createElement(vnode.tag)
    }

    diffAttribute(out, vnode)
    return out
}

function diffAttribute (dom, vnode) {
    const oldAttrs = {}
    const newAttrs = vnode.attrs
    const domAttrs = dom.attributes
    const arr = [...domAttrs]
    arr.forEach(item => {
        oldAttrs[item.name] = item.value
    })

    for (let key in oldAttrs) {
        if (!(key in newAttrs)) {
            setAttribute(dom, key, undefined)
        }
    }

    for (let key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key])
        }
    }
}