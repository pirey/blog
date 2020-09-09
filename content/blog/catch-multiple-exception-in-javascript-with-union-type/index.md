---
title: Catch multiple exception in javascript with union type
date: 2019-06-15 00:00:08
description: "Here you will learn to simulate multiple exception type handling using functional programming concept."
tags:
  - javascript
---

Javascript doesn't have built-in method for catching different types of exception.

But, first of all, I should mention that javascript do have some [built-in exception types](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Error_types). And we can [check for its instance type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Handling_a_specific_error) to handle different case of errors. If we need custom error for our app, we can also [define our own error type](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#Custom_Error_Types).

That being said, there is another way we can workaround this, using union type. Union type is a way to represent a type that can hold several different value at a time. Its like enum in some other language (javascript doesn't have enum keyword), but simply better, because each type can hold additional value (or not).

We will use a library called [`union-type`](https://github.com/paldepind/union-type) to demonstrate this.

First, we create our custom error type.

```javascript
const Type = require('union-type')

const Err = Type({
  InvalidParam: [String],
  ValidationError: [String, Object],
  UnknownError: [],
})
```

We created `Err` custom error type. It has three possible value, the error can be either `InvalidParam`, `ValidationError`, or `UnknownError`.

Each one of them can hold additional value, for example the `InvalidParam` can hold one additional value of type `String`, that we can use to pass in the error message.

The `ValidationError` has two values, first is of type `String` to pass in error message and the second is of type `Object` to pass in the validation error details.

Let say the `UnknownError` is a generic error and doesn't have additional info, so we pass empty array `[]`.

To create one of those errors, we use the constructor function provided by `union-type` library inside the `Err` object.

The name of the constructor function is the same as the error type. The function can also receive argument or not, depending whether the error type has additional value attached to it.

For example we have a function for updating user profile.

```javascript
async function updateProfile(userId, payload) {
  if (!validId(userId)) {
    throw Err.InvalidParam('Invalid param')
  }

  if (!validPayload(payload)) {
    throw Err.ValidationError('Validation Error', {
      name: 'Name is required',
      email: 'Email format is invalid',
    })
  }

  return await db.updateProfile(userId, payload).catch(_ => {
    // whoops, we don't know what caused the error
    throw Err.UnknownError()
  })
}
```

In javascript we can throw any object to raise an exception, so we just throw our custom error. So, the `updateProfile` will either throw `InvalidParam`, `ValidationError`, `UnknownError` if any error occurs, or returns the updated profile if success.

Now we need a way to act on the result of `updateProfile` accordingly. The `Err` have a method called `case`, used to kind of `switch..case` all the possible values.

For example, we can use the function like so:

```javascript
async function routeHandler(req, res) {
  try {
    const userId = req.params.userId
    const payload = req.body
    const updated = await updateProfile(userId, payload)

    res.status(200).json(updated)
  } catch (error) {
    // handle different errors appropriately
    Err.case({
      InvalidParam: message => res.status(400).json({message}),
      ValidationError: (message, errors) =>
        res.status(422).json({message, errors}),
      UnknownError: () => res.status(500).json({message: 'Unknown Error'}),
    })(error)
  }
}
```

Nice and clean!

Also, be sure to check out the documentation of [`union-type`](https://github.com/paldepind/union-type) for more info.
