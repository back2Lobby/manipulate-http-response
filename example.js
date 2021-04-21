//creating a manipulator for all responses with url https://jsonplaceholder.typicode.com/posts/1

let m = new Manipulate((url)=>{
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


//fetch request whose response will be manipulated as there is a Manipulate object for it

fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => response.json())
.then(json => console.log(json))

//fetch request whose response will be manipulated as there is no Manipulate object for it

fetch('https://jsonplaceholder.typicode.com/todos/1')
.then(response => response.json())
.then(json => console.log(json))

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
