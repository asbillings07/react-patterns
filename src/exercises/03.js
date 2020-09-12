// Flexible Compound Components with context

import React, {createContext, useContext} from 'react'
import {Switch} from '../switch'

// Right now our component can only clone and pass props to immediate children.
// So we need some way for our compound components to implicitly accept the on
// state and toggle method regardless of where they're rendered within the
// Toggle component's "posterity" :)
//
// The way we do this is through context. React.createContext is the API we
// want. Here's a simple example of that API:
//
// const defaultValue = 'light'
// const ThemeContext = React.createContext(defaultValue)
//
// ...
// <ThemeContext.Provider value={this.state}>
//   {this.props.children}
// </ThemeContext.Provider>
// ...
//
// ...
// <ThemeContext.Consumer>
//   {value => <div>The current theme is: {value}</div>}
// </ThemeContext.Consumer>
// ...

// 🐨 create a ToggleContext with React.createContext here
const ToggleContext = createContext({
  on: false,
  toggle: () => {},
})

class Toggle extends React.Component {
  // 🐨 each of these compound components will need to be changed to use
  // ToggleContext.Consumer and rather than getting `on` and `toggle`
  // from props, it'll get it from the ToggleContext.Consumer value.
  static On = ({children}) => {
    return (
      <ToggleContext.Consumer>
        {(contextValue) => (contextValue.on ? children : null)}
      </ToggleContext.Consumer>
    )
  }
  static Off = ({children}) => {
    return (
      <ToggleContext.Consumer>
        {(contextValue) => (contextValue.on ? null : children)}
      </ToggleContext.Consumer>
    )
  }
  static Button = (props) => {
    return (
      <ToggleContext.Consumer>
        {(contextValue) => (
          <Switch
            on={contextValue.on}
            onClick={contextValue.toggle}
            {...props}
          />
        )}
      </ToggleContext.Consumer>
    )
  }
  // Because we'll be passing state into context, we need to 🐨 add the
  // toggle function to state.
  // 💰 You'll need to move this below the `toggle` function. See
  // if you can figure out why :)

  toggle = () =>
    this.setState(
      ({on}) => ({on: !on}),
      () => this.props.onToggle(this.state.on),
    )
  state = {on: false, toggle: this.toggle}
  render() {
    // Because this.props.children is _immediate_ children only, we need
    // to 🐨 remove this map function and render our context provider with
    // this.props.children as the children of the provider. Then we'll
    // expose the on state and toggle method as properties in the context
    // value (the value prop).
    // return React.Children.map(this.props.children, child =>
    //   React.cloneElement(child, {
    //     on: this.state.on,
    //     toggle: this.toggle,
    //   }),
    // )

    return (
      <ToggleContext.Provider value={this.state}>
        {this.props.children}
      </ToggleContext.Provider>
    )
  }
}

// Don't make changes to the Usage component. It's here to show you how your
// component is intended to be used and is used in the tests.
// You can make all the tests pass by updating the Toggle component.
function Usage({
  onToggle = (...args) => console.log('onToggle', ...args),
}) {
  return (
    <Toggle onToggle={onToggle}>
      <div>
        <Toggle.On>The button is on</Toggle.On>
      </div>
      <Toggle.Off>The button is off</Toggle.Off>
      <div>
        <Toggle.Button />
      </div>
    </Toggle>
  )
}
Usage.title = 'Flexible Compound Components'

export {Toggle, Usage as default}
