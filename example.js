//creating a manipulator for all responses with url https://jsonplaceholder.typicode.com/posts/1

new Manipulate((url)=>{
  return url === 'https://jsonplaceholder.typicode.com/posts/1';
},(data)=>{
  data.title = "This Is Manipulated Title";
  return data;
})

//fetch request whose response will be manipulated

fetch('https://jsonplaceholder.typicode.com/posts/1')
.then(response => response.json())
.then(json => console.log(json))

//fetch request whose response will not be manipulated

fetch('https://jsonplaceholder.typicode.com/todos/1')
.then(response => response.json())
.then(json => console.log(json))


