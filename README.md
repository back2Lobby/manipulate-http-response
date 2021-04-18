# **manipulate-http-resopnse**
This package allows manipulating browser based HTTP responses easily. It will support manipulating any response of fetch or XMLHttpRequest.

> Note: It only supports fetch with JSON & TEXT response for now.

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
    constructor(urlValidate,responseType,manipulator)
```
### Parameters:
1. `urlValidate` - Function for validating the URL. It will be passed the URL of response. It should return boolean value.
2. `responseType` - Supported types for now are "json" and "text".
3. `manipulator` - Function for manipulating response. It will be passed the response data.
```
new Manipulate((url)=>{
    return url === 'https://jsonplaceholder.typicode.com/posts/1';
},"json",(res)=>{
    res.title = "This Is Manipulated Title";
    return res;
})
```
Basically we are telling the manipulation system that if the first function `urlValidator` returns true for any response then manipulate that response with the second function `manipulator`.

Here is the [demo code](https://jsfiddle.net/Back2Lobby/6a3ceboj/10/), where it will manipulate the response as required.
```
//creating a manipulator for all responses with url https://jsonplaceholder.typicode.com/posts/1

new Manipulate((url)=>{
  return url === 'https://jsonplaceholder.typicode.com/posts/1';
},"json",(data)=>{
  data.title = "This Is Manipulated Title";
  return data;
})

//fetch request whose response will be manipulated because there is a Manipulate object for it

fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => response.json())
.then(json => console.log(json))

//fetch request whose response will be manipulated because there is no Manipulate object for it

fetch('https://jsonplaceholder.typicode.com/todos/1')
.then(response => response.json())
.then(json => console.log(json))
```

A function `makeResponse` is available that can be used to create a response from given data. Below is an example where we use fetch response multiple times.

```
//post manipulating request manually - actually this allows you to re-read the response after reading it

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
