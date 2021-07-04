export function isValidContainerLegacy(node) {
    return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && node.nodeValue === ' react-mount-point-unstable '));
  }

export function isContainerMarkedAsRoot(node) {
    return !!node[internalContainerInstanceKey];
  } 

  export function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    {
      topLevelUpdateWarnings(container);
      warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
    }
  
    var root = container._reactRootContainer;
    var fiberRoot;
  
    if (!root) {
      // Initial mount
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
      fiberRoot = root;
  
      if (typeof callback === 'function') {
        var originalCallback = callback;
  
        callback = function () {
          var instance = getPublicRootInstance(fiberRoot);
          originalCallback.call(instance);
        };
      } // Initial mount should not be batched.
  
  
      unbatchedUpdates(function () {
        updateContainer(children, fiberRoot, parentComponent, callback);
      });
    } else {
      fiberRoot = root;
  
      if (typeof callback === 'function') {
        var _originalCallback = callback;
  
        callback = function () {
          var instance = getPublicRootInstance(fiberRoot);
  
          _originalCallback.call(instance);
        };
      } // Update
  
  
      updateContainer(children, fiberRoot, parentComponent, callback);
    }
  
    return getPublicRootInstance(fiberRoot);
  }