# **manipulate-http-resopnse**
This package allows manipulating browser based HTTP responses easily. It will support manipulating any response of fetch or XMLHttpRequest.

> Note: It only supports fetch with JSON response for now.

## **Install**
1. CDN: Add following script to the end of your `<head>` section.
```
<script src="https://cdn.jsdelivr.net/gh/back2lobby/manipulate-http-response/manipulator.js"></script>
```
2. Normal: Just copy paste `manipulator.js` file into your project and link it in the `<head>` section.
## **Usage**
Create an object of class `Manipulate`. Its constructor accepts two callback functions.
```
new Manipulate((url)=>{
    return url === 'https://jsonplaceholder.typicode.com/posts/1';
},(res)=>{
    res.title = "This Is Manipulated Title";
    return res;
})
```
First callback function is for validating the URL and the second callback function is the function which will manipulate.

Basically we are telling the manipulation system that if the first callback returns true for any response then manipulate that response with the second callback.

Manipulation System will pass the url of response to the first callback. While it will pass the response as javascript object (parsed json).

Here is the demo code, where it will manipulate the response as required.
```
//creating a manipulator for all responses with url https://jsonplaceholder.typicode.com/posts/1

new Manipulate((url)=>{
    return url === 'https://jsonplaceholder.typicode.com/posts/1';
},(data)=>{
    data.title = "This Is Manipulated Title";
    return data;
})

//fetch request that will be manipulated

fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => response.json())
.then(json => console.log(json))

//fetch request that will not be manipulated

fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => response.json())
  .then(json => console.log(json))

```