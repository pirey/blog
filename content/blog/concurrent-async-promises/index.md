---
title: Concurrent Async Promises
date: '2023-12-31T10:49:58+0700'
description: 'Efficient concurrent async promises handling in typescript'
---

In TypeScript, we can run multiple async promises concurrently using the
[`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) and [`Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) function.

With `Promise.all()` we might _lose_ the results if any
of the promises reject.

```typescript
const ps = [
  Promise.resolve(1),
  Promise.reject('error for some reason'),
  Promise.resolve(2),
]

Promise.all(ps).then(console.log).catch(console.error)
// .. will print out "error for some reason"
```

On the other hand, `Promise.allSettled()` is usually a better option if we want
to get all the results regardless of wheter promise is resolved or rejected.

```typescript
const ps = [
  Promise.resolve(1),
  Promise.reject('error for some reason'),
  Promise.resolve(2),
]

Promise.all(ps).then(console.log).catch(console.error)
// [
//   { status: 'fulfilled', value: 1 },
//   { status: 'rejected', reason: 'some reason' },
//   { status: 'fulfilled', value: 2 }
// ]
```

To retrieve all the resolved promises only, we can filter the results.

```typescript
const promises = [
  Promise.resolve(1),
  Promise.resolve(2),
  Promise.reject('error for some reason'),
  Promise.resolve(4),
  Promise.resolve(5),
]
const results = await Promise.allSettled(promises)
const resolvedPromises = results
  .filter(resulve => result.status === 'fulfilled')
  .map(result => result.value)
// .. [1, 2, 4, 5]
```

However, when we have many promises, we might face high memory consumption.
Imagine we have a list of namespaces, then we want to retrieve all users for each of those namespaces.

```typescript
function getUserByNamespace(namespace) {
  return fetch(`namespace/${namespace}/users`) // each namespace might have hundreds if not thousands of users
}

const namespaces = ['namespace1', 'namespace2', ..., 'namespace896'] // suppose we have hundreds of namespaces
const users = await Promise.allSettled(namespaces.map(getUserByNamespaces))
  .filter(resulve => result.status === 'fulfilled')
  .map(result => result.value)
// .. [user1, user2, user3, ..., userN]
```

In this case, one simple solution is to divide the promises into multiple smaller ones, then process them sequentially.

First, we divide the list of namespaces into chunks of namespaces.

```typescript
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  return Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize)
  )
}

const namespaces = [
  'namespace1',
  'namespace2',
  'namespac3',
  'namespace4',
  'namespace5',
  'namespace6',
]
const namespaceChunks = chunkArray(namespaces, 2)
// [
//   ['namespace1', 'namespace2'],
//   ['namespace3', 'namespace4'],
//   ['namespace5', 'namespace6'],
// ]
```

Then we loop the chunks and handle the promises sequentially.
Also, we use the `Map()` data type to store the results to avoid redundancy.

```typescript
const users = new Map()
for (const namespaceChunk of namespaceChunks) {
  const namespaceUsers = await Promise.allSettled(
    namespaceChunk.map(getUserByNamespace)
  )

  namespaceUsers.forEach(result => {
    if (result.status === 'fulfilled') {
      const user = result.value
      users.set(user.id, user)
    }
  })
}

console.log(Array.from(users.values()))
// .. [user1, user2, user3, ..., userN]
```
