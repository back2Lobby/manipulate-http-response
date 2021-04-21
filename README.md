# **manipulate-http-resopnse**
This package allows manipulating browser based HTTP responses easily. It will support manipulating any response of fetch or XMLHttpRequest. It can also be used to re-read responses in fetch requests.

## **Install**
1. CDN: Add following script to the end of your `<head>` section.
```
<script src="https://cdn.jsdelivr.net/gh/back2lobby/manipulate-http-response/manipulator.js"></script>
```
2. Normal: Just copy paste `manipulator.js` file into your project and link it in the `<head>` section.
## **Usage**
Create an object of class `Manipulate`. Its constructor accepts 3 arguments functions.

Syntax for Manipulate Class's Constructor is:

```
    constructor(urlValidate)
```

### Parameters:

1. `urlValidate` - Function for validating the URL. It will be passed the URL of response. It should return boolean value.

```
const m = new Manipulate((url)=>{
    return url === 'https://jsonplaceholder.typicode.com/posts/1';
})

m.then(res => res.json())
  .then(d => {
    d.title = "manipulated title";
    return d;
  })

```

Basically we are telling the manipulation system that if the function passed in constructor `urlValidate` returns true for any response then manipulate that response with those `then function` chains like a real fetch request's promise.

### **Example:**

Creating a manipulator for all responses with url https://jsonplaceholder.typicode.com/posts/1. Here is the [JSFiddle demo](https://jsfiddle.net/Back2Lobby/6a3ceboj/13/) for this example.

```
const m = new Manipulate((url)=>{
  return url === 'https://jsonplaceholder.typicode.com/posts/1';
})

m.then(res => res.json())
  .then(d => {
    d.title = "Manipulated Title";
    return d;
  })
  .then(d => {
    d.id = 9999;
    return d;
  })
```

Now in actual fetch request we are getting manipulated response

```
fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => response.json())
.then(json => console.log(json))
```

## Extras:

A function `makeResponse` is available that can be used to create a response from given data. Basically, it allows you to re-read the response after reading it.

Below is an example where we use fetch response multiple times.

```
fetch('https://jsonplaceholder.typicode.com/todos/1')
.then(response => response.json())
.then(data => {

  //first time
  console.log(data)

  return makeResponse(data);

})
.then(response => response.json())
.then(data => {

  // second time
  console.log(data)

})
```
