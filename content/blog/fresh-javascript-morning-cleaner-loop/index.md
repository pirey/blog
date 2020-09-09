---
title: Fresh javascript morning - cleaner loop
date: 2019-07-09 08:09:02
description: Learn to manipulate list in javascript using functional programming concept.
tags:
    - javascript
---

## List transformation

Suppose we have this list of people:

```javascript
const people = [
    {
        name: 'Jotaro Kujo',
        stand: 'Star Platinum',
        age: 17
    },
    {
        name: 'Kakyoin Noriaki',
        stand: 'Hierophant',
        age: 17
    },
    {
        name: 'Joseph Joestar',
        stand: 'Hermit Purple',
        age: 69
    },
    {
        name: 'Muhammad Avdol',
        stand: 'Magician Red',
        age: 30
    },
    {
        name: 'Jean Pierre Polnareff',
        stand: 'Silver Chariot',
        age: 22
    }
]
```

Now we want to extract only the names of those people.

With imperative `for` loop:

```javascript
const names = []
for (let i = 0; i < people.length; i++) {
    names.push(people[i].name)
}

console.log(names)
// ['Jotaro Kujo', 'Kakyoin Noriaki', 'Joseph Joestar', 'Muhammad Avdol', 'Jean Pierre Polnareff']
```

We can think the process of _extracting_ the names as transforming a list of people into a list of names.

In the example above, our intention is only to get the names of each person, that is the line where we `.push()` each person's name into the `names` variable. Instead we ended up expressed several unrelated things in the loop operation.

We can use more clean way to express our intent, using `.forEach()` method of an array.

```javascript
const names = []
people.forEach(function (person) {
    names.push(person.name)
})

console.log(names)
// ['Jotaro Kujo', 'Kakyoin Noriaki', 'Joseph Joestar', 'Muhammad Avdol', 'Jean Pierre Polnareff']
```

This is better than using `for` loop, because we only express the operation that we care, `names.push(person.name)`.

However, this method have drawback, the function inside `forEach` is tied to the `names` variable.

Instead, we can have data transformation as a single operation, using `.map()`:

```javascript
const names = people.map(function (person) {
    return person.name
})

console.log(names)
// ['Jotaro Kujo', 'Kakyoin Noriaki', 'Joseph Joestar', 'Muhammad Avdol', 'Jean Pierre Polnareff']
```

We can go further by extracting the callback into a separate function:

```javascript
function getName(person) {
    return person.name
}
const names = people.map(getName)

console.log(names)
// ['Jotaro Kujo', 'Kakyoin Noriaki', 'Joseph Joestar', 'Muhammad Avdol', 'Jean Pierre Polnareff']
```

Now we have even cleaner way to express our intent, to transform list of people into list of people's names. With idea of data transformation, working with list will be simpler.

## List filtering

Suppose we want to make a new list of people with age under 30.

With `for` loop:

```javascript
const youngsters = []
for (let i = 0; i < people.length; i++) {
    if (people[i].age < 30) {
        youngsters.push(people[i])
    }
}
```

We can also use `.filter()` method for that:

```javascript
function under30(person) {
    return person.age < 30
}
const youngsters = people.filter(under30).map(getName)

console.log(youngsters)
// ['Jotaro Kujo', 'Kakyoin Noriaki', 'Jean Pierre Polnareff']
```

## Finding item

Using list of people in the previous section, suppose we want to find a person in the list by their name.

With `for` loop, we can see that the operation is burreid inside the loop. We can define additional function to wrap the operation to find a person by their name, to make it reusable.

```javascript
function findByName(name, people) {
    let result = null
    for (let i = 0; i < people.length; i++) {
        if (people[i].name === name) {
            result = people[i]
            break
        }
    }
    return result
}

const jotaro = findByName('Jotaro Kujo', people)
console.log(jotaro.name) // Jotaro Kujo

const notFound = findByName('Not Found', people)
console.log(notFound) // null
```

In the above function, our primary intention is to compare each person's name with the given name, but we ended up declaring mostly unrelated stuff.

We can use `.find()` method instead:

```javascript
const jotaro = people.find(function(person) {
    // if this person's name equals 'Jotaro Kujo' then this person is who we're looking for
    return person.name === 'Jotaro Kujo'
})

console.log(jotaro.name) // Jotaro Kujo
```

The `.find()` method takes a function that returns a `boolean` indicating if the item match what we want to find.

We can make our function reusable by make it a separate function:

```javascript
function hasName(name) {
    return function(person) {
        return person.name === name
    }
}
```

We can use the function like so:

```javascript
const jotaro = people.find(hasName('Jotaro Kujo'))

console.log(jotaro.name) // Jotaro Kujo
```

This is definitely more expressive than previous example that use `for` loop, and we can clearly see what is the intention of the program.

## Notes

The [.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), and [.find()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find) are all native method of `Array` in javascript.
