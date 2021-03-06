import { hasValidRef } from "./tools";

// 创建 Element
function createElement(type, config, children) {
    var propName; // Reserved names are extracted
  
    var props = {};
    var key = null;
    var ref = null;
    var self = null;
    var source = null;
  
    if (config != null) {
      if (hasValidRef(config)) {
        ref = config.ref;
  
        {
        //   warnIfStringRefCannotBeAutoConverted(config);
        }
      }
  
      if (hasValidKey(config)) {
        key = '' + config.key;
      }
  
      self = config.__self === undefined ? null : config.__self;
      source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object
  
      for (propName in config) {
        if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    } // Children can be more than one argument, and those are transferred onto
    // the newly allocated props object.
  
  
    var childrenLength = arguments.length - 2;
  
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
  
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
  
      {
        if (Object.freeze) {
          Object.freeze(childArray);
        }
      }
  
      props.children = childArray;
    } // Resolve default props
  
  
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
  
      for (propName in defaultProps) {
        if (props[propName] === undefined) {
          props[propName] = defaultProps[propName];
        }
      }
    }
  
    {
      if (key || ref) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
  
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
  
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  
    return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
  }

  var ReactElement = function (type, key, ref, self, source, owner, props) {
    var element = {
      // This tag allows us to uniquely identify this as a React Element
      $$typeof: REACT_ELEMENT_TYPE,
      // Built-in properties that belong on the element
      type: type,
      key: key,
      ref: ref,
      props: props,
      // Record the component responsible for creating this element.
      _owner: owner
    };
  
    {
      // The validation flag is currently mutative. We put it on
      // an external backing store so that we can freeze the whole object.
      // This can be replaced with a WeakMap once they are implemented in
      // commonly used development environments.
      element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
      // the validation flag non-enumerable (where possible, which should
      // include every environment we run tests in), so the test framework
      // ignores it.
  
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      }); // self and source are DEV only properties.
  
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      }); // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
  
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
  
      if (Object.freeze) {
        Object.freeze(element.props);
        Object.freeze(element);
      }
    }
  
    return element;
  };

export const React = {
    createElement
}