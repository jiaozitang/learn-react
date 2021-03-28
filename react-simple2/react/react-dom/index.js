const ReactDOM = {
    render
}

var ELEMENT_NODE = 1;

var DOCUMENT_NODE = 9;

var internalContainerInstanceKey = '__reactContainer$' + randomKey;

var randomKey = Math.random().toString(36).slice(2);

var internalInstanceKey = '__reactFiber$' + randomKey;

var LegacyRoot = 0;

var noTimeout = -1;

var NoLanePriority = 0;

function createRootImpl(container, tag, options) {
    // Tag is either LegacyRoot or Concurrent Root
    var hydrate = options != null && options.hydrate === true;
    var hydrationCallbacks = options != null && options.hydrationOptions || null;
    var mutableSources = options != null && options.hydrationOptions != null && options.hydrationOptions.mutableSources || null;
    var root = createContainer(container, tag, hydrate);
    markContainerAsRoot(root.current, container);
    var containerNodeType = container.nodeType;
  
    {
      var rootContainerElement = container.nodeType === COMMENT_NODE ? container.parentNode : container;
      listenToAllSupportedEvents(rootContainerElement);
    }
  
    if (mutableSources) {
      for (var i = 0; i < mutableSources.length; i++) {
        var mutableSource = mutableSources[i];
        registerMutableSourceForHydration(root, mutableSource);
      }
    }
  
    return root;
  }

  function createFiberRoot(containerInfo, tag, hydrate, hydrationCallbacks) {
    var root = new FiberRootNode(containerInfo, tag, hydrate);
    // stateNode is any.
  
  
    var uninitializedFiber = createHostRootFiber(tag);
    root.current = uninitializedFiber;
    uninitializedFiber.stateNode = root;
    initializeUpdateQueue(uninitializedFiber);
    return root;
  }

  function createContainer(containerInfo, tag, hydrate, hydrationCallbacks) {
    return createFiberRoot(containerInfo, tag, hydrate);
  }

  function FiberRootNode(containerInfo, tag, hydrate) {
    this.tag = tag;
    this.containerInfo = containerInfo;
    this.pendingChildren = null;
    this.current = null;
    this.pingCache = null;
    this.finishedWork = null;
    this.timeoutHandle = noTimeout;
    this.context = null;
    this.pendingContext = null;
    this.hydrate = hydrate;
    this.callbackNode = null;
    this.callbackPriority = NoLanePriority;
    this.eventTimes = createLaneMap(NoLanes);
    this.expirationTimes = createLaneMap(NoTimestamp);
    this.pendingLanes = NoLanes;
    this.suspendedLanes = NoLanes;
    this.pingedLanes = NoLanes;
    this.expiredLanes = NoLanes;
    this.mutableReadLanes = NoLanes;
    this.finishedLanes = NoLanes;
    this.entangledLanes = NoLanes;
    this.entanglements = createLaneMap(NoLanes);
  
    {
      this.mutableSourceEagerHydrationData = null;
    }
  
    {
      this.interactionThreadID = tracing.unstable_getThreadID();
      this.memoizedInteractions = new Set();
      this.pendingInteractionMap = new Map();
    }
  
    {
      switch (tag) {
        case BlockingRoot:
          this._debugRootType = 'createBlockingRoot()';
          break;
  
        case ConcurrentRoot:
          this._debugRootType = 'createRoot()';
          break;
  
        case LegacyRoot:
          this._debugRootType = 'createLegacyRoot()';
          break;
      }
    }
  }

function legacyCreateRootFromDOMContainer(container, forceHydrate) {
    var shouldHydrate = forceHydrate || shouldHydrateDueToLegacyHeuristic(container); // First clear any existing content.
  
    if (!shouldHydrate) {
      var warned = false;
      var rootSibling;
  
      while (rootSibling = container.lastChild) {
        {
          if (!warned && rootSibling.nodeType === ELEMENT_NODE && rootSibling.hasAttribute(ROOT_ATTRIBUTE_NAME)) {
            warned = true;
  
            error('render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.');
          }
        }
  
        container.removeChild(rootSibling);
      }
    }
  
    {
      if (shouldHydrate && !forceHydrate && !warnedAboutHydrateAPI) {
        warnedAboutHydrateAPI = true;
  
        warn('render(): Calling ReactDOM.render() to hydrate server-rendered markup ' + 'will stop working in React v18. Replace the ReactDOM.render() call ' + 'with ReactDOM.hydrate() if you want React to attach to the server HTML.');
      }
    }
  
    return createLegacyRoot(container, shouldHydrate ? {
      hydrate: true
    } : undefined);
  }


function shouldHydrateDueToLegacyHeuristic(container) {
    var rootElement = getReactRootElementInContainer(container);
    return !!(rootElement && rootElement.nodeType === ELEMENT_NODE && rootElement.hasAttribute(ROOT_ATTRIBUTE_NAME));
  }

  function createLegacyRoot(container, options) {
    return new ReactDOMBlockingRoot(container, LegacyRoot, options);
  }

  function ReactDOMBlockingRoot(container, tag, options) {
    this._internalRoot = createRootImpl(container, tag, options);
  }

function warnOnInvalidCallback$1(callback, callerName) {
    {
      if (callback !== null && typeof callback !== 'function') {
        error('%s(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callerName, callback);
      }
    }
  }

function getInstanceFromNode(node) {
    var inst = node[internalInstanceKey] || node[internalContainerInstanceKey];
  
    if (inst) {
      if (inst.tag === HostComponent || inst.tag === HostText || inst.tag === SuspenseComponent || inst.tag === HostRoot) {
        return inst;
      } else {
        return null;
      }
    }
  
    return null;
  }

function getReactRootElementInContainer(container) {
    if (!container) {
      return null;
    }
  
    if (container.nodeType === DOCUMENT_NODE) {
      return container.documentElement;
    } else {
      return container.firstChild;
    }
  }

function render(element, container, callback) {
    if (!isValidContainer(container)) {
      {
        throw Error( "Target container is not a DOM element." );
      }
    }
  
    {
      var isModernRoot = isContainerMarkedAsRoot(container) && container._reactRootContainer === undefined;
  
      if (isModernRoot) {
        error('You are calling ReactDOM.render() on a container that was previously ' + 'passed to ReactDOM.createRoot(). This is not supported. ' + 'Did you mean to call root.render(element)?');
      }
    }
  
    return legacyRenderSubtreeIntoContainer(null, element, container, false, callback);
  }

  function isContainerMarkedAsRoot(node) {
    return !!node[internalContainerInstanceKey];
  }

function topLevelUpdateWarnings (container) {
    if (container._reactRootContainer && container.nodeType !== COMMENT_NODE) {
      var hostInstance = findHostInstanceWithNoPortals(container._reactRootContainer._internalRoot.current);

      if (hostInstance) {
        if (hostInstance.parentNode !== container) {
          error('render(...): It looks like the React-rendered content of this ' + 'container was removed without using React. This is not ' + 'supported and will cause errors. Instead, call ' + 'ReactDOM.unmountComponentAtNode to empty a container.');
        }
      }
    }

    var isRootRenderedBySomeReact = !!container._reactRootContainer;
    var rootEl = getReactRootElementInContainer(container);
    var hasNonRootReactChild = !!(rootEl && getInstanceFromNode(rootEl));

    if (hasNonRootReactChild && !isRootRenderedBySomeReact) {
      error('render(...): Replacing React-rendered children with a new root ' + 'component. If you intended to update the children of this node, ' + 'you should instead have the existing children update their state ' + 'and render the new components instead of calling ReactDOM.render.');
    }

    if (container.nodeType === ELEMENT_NODE && container.tagName && container.tagName.toUpperCase() === 'BODY') {
      error('render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.');
    }
  };

  function findCurrentFiberUsingSlowPath(fiber) {
    var alternate = fiber.alternate;
  
    if (!alternate) {
      // If there is no alternate, then we only need to check if it is mounted.
      var nearestMounted = getNearestMountedFiber(fiber);
  
      if (!(nearestMounted !== null)) {
        {
          throw Error( "Unable to find node on an unmounted component." );
        }
      }
  
      if (nearestMounted !== fiber) {
        return null;
      }
  
      return fiber;
    } // If we have two possible branches, we'll walk backwards up to the root
    // to see what path the root points to. On the way we may hit one of the
    // special cases and we'll deal with them.
  
  
    var a = fiber;
    var b = alternate;
  
    while (true) {
      var parentA = a.return;
  
      if (parentA === null) {
        // We're at the root.
        break;
      }
  
      var parentB = parentA.alternate;
  
      if (parentB === null) {
        // There is no alternate. This is an unusual case. Currently, it only
        // happens when a Suspense component is hidden. An extra fragment fiber
        // is inserted in between the Suspense fiber and its children. Skip
        // over this extra fragment fiber and proceed to the next parent.
        var nextParent = parentA.return;
  
        if (nextParent !== null) {
          a = b = nextParent;
          continue;
        } // If there's no parent, we're at the root.
  
  
        break;
      } // If both copies of the parent fiber point to the same child, we can
      // assume that the child is current. This happens when we bailout on low
      // priority: the bailed out fiber's child reuses the current child.
  
  
      if (parentA.child === parentB.child) {
        var child = parentA.child;
  
        while (child) {
          if (child === a) {
            // We've determined that A is the current branch.
            assertIsMounted(parentA);
            return fiber;
          }
  
          if (child === b) {
            // We've determined that B is the current branch.
            assertIsMounted(parentA);
            return alternate;
          }
  
          child = child.sibling;
        } // We should never have an alternate for any mounting node. So the only
        // way this could possibly happen is if this was unmounted, if at all.
  
  
        {
          {
            throw Error( "Unable to find node on an unmounted component." );
          }
        }
      }
  
      if (a.return !== b.return) {
        // The return pointer of A and the return pointer of B point to different
        // fibers. We assume that return pointers never criss-cross, so A must
        // belong to the child set of A.return, and B must belong to the child
        // set of B.return.
        a = parentA;
        b = parentB;
      } else {
        // The return pointers point to the same fiber. We'll have to use the
        // default, slow path: scan the child sets of each parent alternate to see
        // which child belongs to which set.
        //
        // Search parent A's child set
        var didFindChild = false;
        var _child = parentA.child;
  
        while (_child) {
          if (_child === a) {
            didFindChild = true;
            a = parentA;
            b = parentB;
            break;
          }
  
          if (_child === b) {
            didFindChild = true;
            b = parentA;
            a = parentB;
            break;
          }
  
          _child = _child.sibling;
        }
  
        if (!didFindChild) {
          // Search parent B's child set
          _child = parentB.child;
  
          while (_child) {
            if (_child === a) {
              didFindChild = true;
              a = parentB;
              b = parentA;
              break;
            }
  
            if (_child === b) {
              didFindChild = true;
              b = parentB;
              a = parentA;
              break;
            }
  
            _child = _child.sibling;
          }
  
          if (!didFindChild) {
            {
              throw Error( "Child was not found in either parent set. This indicates a bug in React related to the return pointer. Please file an issue." );
            }
          }
        }
      }
  
      if (!(a.alternate === b)) {
        {
          throw Error( "Return fibers should always be each others' alternates. This error is likely caused by a bug in React. Please file an issue." );
        }
      }
    } // If the root is not a host container, we're in a disconnected tree. I.e.
    // unmounted.
  
  
    if (!(a.tag === HostRoot)) {
      {
        throw Error( "Unable to find node on an unmounted component." );
      }
    }
  
    if (a.stateNode.current === a) {
      // We've determined that A is the current branch.
      return fiber;
    } // Otherwise B has to be current branch.
  
  
    return alternate;
  }

  function findCurrentHostFiberWithNoPortals(parent) {
    var currentParent = findCurrentFiberUsingSlowPath(parent);
  
    if (!currentParent) {
      return null;
    } // Next we'll drill down this component to find the first HostComponent/Text.
  
  
    var node = currentParent;
  
    while (true) {
      if (node.tag === HostComponent || node.tag === HostText || enableFundamentalAPI ) {
        return node;
      } else if (node.child && node.tag !== HostPortal) {
        node.child.return = node;
        node = node.child;
        continue;
      }
  
      if (node === currentParent) {
        return null;
      }
  
      while (!node.sibling) {
        if (!node.return || node.return === currentParent) {
          return null;
        }
  
        node = node.return;
      }
  
      node.sibling.return = node.return;
      node = node.sibling;
    } // Flow needs the return null here, but ESLint complains about it.
    // eslint-disable-next-line no-unreachable
  
  
    return null;
  }

  function findHostInstanceWithNoPortals(fiber) {
    var hostFiber = findCurrentHostFiberWithNoPortals(fiber);
  
    if (hostFiber === null) {
      return null;
    }
  
    if (hostFiber.tag === FundamentalComponent) {
      return hostFiber.stateNode.instance;
    }
  
    return hostFiber.stateNode;
  }

  function legacyRenderSubtreeIntoContainer(parentComponent, children, container, forceHydrate, callback) {
    {
      topLevelUpdateWarnings(container);
      warnOnInvalidCallback$1(callback === undefined ? null : callback, 'render');
    } // TODO: Without `any` type, Flow says "Property cannot be accessed on any
    // member of intersection type." Whyyyyyy.
  
  
    var root = container._reactRootContainer;
    var fiberRoot;
  
    if (!root) {
      // Initial mount
      root = container._reactRootContainer = legacyCreateRootFromDOMContainer(container, forceHydrate);
      fiberRoot = root._internalRoot;
  
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
      fiberRoot = root._internalRoot;
  
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

  function getPublicRootInstance(container) {
    var containerFiber = container.current;
  
    if (!containerFiber.child) {
      return null;
    }
  
    switch (containerFiber.child.tag) {
      case HostComponent:
        return getPublicInstance(containerFiber.child.stateNode);
  
      default:
        return containerFiber.child.stateNode;
    }
  }

  function getPublicInstance(instance) {
    return instance;
  }

  function isValidContainer(node) {
    return !!(node && (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE || node.nodeType === COMMENT_NODE && node.nodeValue === ' react-mount-point-unstable '));
  }

export default ReactDOM