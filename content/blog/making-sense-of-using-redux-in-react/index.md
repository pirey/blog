---
title: Making sense of using Redux in React
date: 2019-01-28 18:56:07
description: Simple explanation of react-redux api.
tags:
    - react
    - javascript
---

Redux and react is a separate libraries. They don't know each other (internally). When we store data in redux and want to use that data in react component, we have to somewhat "connect" them.

Let's say we have this component that use redux state

```javascript
import {createStore} from 'redux'
import reducer from './reducer'
const store = createStore(reducer)
const App = () => ( <div>{store.getState().username}</div> )

// somewhere in our code, we make a state update using dispatch
store.dispatch({ 'LOGIN_ACTION' })
```

Everytime the redux state is updated after we dispatch actions, react doesn't know how to react (pun intended) to the changes, therefore the UI is not reflecting the current state. In order for react to be aware of the changes, we need a way to notify our component when the state is updated. That's when we need `react-redux`, another library to `connect` them. The `react-redux` library provide wrapper component, `<Provider />`, where we store the redux store (another pun intended) so that we can refer to it later in child components.

```javascript
import {Provider} from 'react-redux'
import {createStore} from 'redux'
import reducer from './reducer'
const store = createStore(reducer)
render(<Provider store={store}><App /></Provider>)
```


```javascript
// to make it simple, here's the shape of our state
{ isLoggedIn: true, username: 'Faye Valentine' }
```

Later, if we need to use the redux state, we will not call `getState()` manually anymore. Instead, we connect our component with redux using `connect()`.

```javascript
import {connect} from 'react-redux'
// ...
const App = (state) => (<div>Welcome, {state.username}</div>)
const wrapComponentWithState = connect(state => state)
const AppWithState = wrapComponentWithState(App)
```

The `connect()` function receive a function as its first parameter. Using this function, we can tell redux which part of the state that we want to access. The return value of this function will be injected to the wrapped component as props. In the example above, we use `identity` function `state => state`, that means our wrapped component will receive our entire state as the props. But it's up to define the shape, for example we can do this instead:

```javascript
const wrapComponentWithState = connect(state => {
    return {
        greeting: state.isLoggedIn ? `Hello, ${state.username}` : 'Hello, stranger'
    }
})

// ... and in our component we're no longer gain access of entire state,
// instead we only receive greeting as props
const App = ({ greeting }) => <div>{greeting}</div>
```

The `connect()` function returns a function, which will be used to wrap another component, so that the wrapped component can access the state as props, as we discuss above. By using this way, `react-redux` make sure that the props that is injected to the component will always in sync with the current redux state. Another thing we need to do with the redux state is a way to make a change. We can export the store instance that we pass to the `<Provider />` component and import it wherever we needed and call `store.dispatch` to dispatch actions. But let's be a good boy for a moment and follow the guide properly. The `connect()` also can receive second parameter, which is also a function. The purpose of this function is very similar to the first parameter, but instead of receiving state, it receives dispatch as parameter, so we can inject pre-baked dispatcher to our component.

```javascript
const mapStateToProps = state => {
  username: state.username
}
const mapDispatchToProps = dispatch => {
  doLogin: () => {
    dispatch({ type: 'LOGIN_ACTION' })
  }
}
const wrapComponentWithState = connect(
  mapStateToProps,
  mapDispatchToProps
)
// ... we can then access the dispatcher in our component
const App = ({ username, doLogin }) => (
  <button onClick={doLogin}>Login as {username}</button>
)
```

In the example above, we call the first and second parameter as `mapStateToProps` and `mapDispatchToProps` because we "map" the redux state and dispatch to a shape which will be injected to the wrapped component as props. Another thing to note is that since `connect()` returns a function, we can immediately call the returning function and resulting a wrapped component. The `App` component is just a component that receive and display data, while `AppWithState` will contain the actual logic and actions.

```javascript
const App = ({ value1, value2 }) => (
  <div>
    {value1} {value2}
  </div>
)

const AppWithState = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
```

So that's how it is (i guess) why we use redux that way in react app.
