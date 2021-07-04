import { isValidContainerLegacy } from "./react-dom-tools";

function render(element, container, callback) {
    {
      error('ReactDOM.render is no longer supported in React 18. Use createRoot ' + 'instead. Until you switch to the new API, your app will behave as ' + "if it's running React 17. Learn " + 'more: https://reactjs.org/link/switch-to-createroot');
    }
  
    if (!isValidContainerLegacy(container)) {
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

export const ReactDOM = {
    render
}