window.manipulators = [];

class Manipulate{
    constructor(urlValidator,manipulate){
        this.urlValidator = urlValidator;
        this.manipulate = manipulate;
        window.manipulators.push(this);
    }
}

function manipulationSetup(){
    // For Fetch 
    const fetch = window.fetch || '';
    const isPossible = fetch.toString().indexOf('native code') !== -1;
    if(isPossible){
        Object.defineProperty(window,'fetch',{
            value:async function(){
                    const p = await fetch.apply(this, arguments).then(r =>{
                        if(validateResponse(r)){
                            window.resClone = r.clone();
                            const reader = window.resClone.body.getReader();
                            window.respData = "";
                            return new Promise((res,rej) => {
                                let stream = new ReadableStream({
                                    start(controller) {
                                      // The following function handles each data chunk
                                      function push() {
                                        // "done" is a Boolean and value a "Uint8Array"
                                        reader.read().then( ({done, value}) => {
                                          // If there is no more data to read
                                          if (done) {
                                            res(window.resClone ?? null);
                                            window.resClone = null;
                                            controller.close();
                                            return;
                                          }
                                
                                          //modify data
                                          let utf8decoder = new TextDecoder();
                                          let decodedData = utf8decoder.decode(value)
                                          let useableData = null;
                                          window.respData += decodedData;
                                          // Get the data and send it to the browser via the controller
                                          controller.enqueue(value);
                                          // Check chunks by logging to the console
                                          push();
                                        })
                                      }
                                
                                      push();
                                    }
                                  });
                            })
                        }
                        else{
                            return r;
                        }
                    }).then(res => {
                        if(validateResponse(res)){
                            let originalResponse = JSON.parse(window.respData);

                            //manipulate
                            let manipulator = window.manipulators.find(m => m.urlValidator(res.url));

                            let manipulatedResponse = manipulator.manipulate(originalResponse)

                            let utf8encoder = new TextEncoder();
      
                            let encodedData = utf8encoder.encode(JSON.stringify(manipulatedResponse));
                            // Respond with our stream
                            let customResponse = new Response(encodedData);
                            Object.defineProperties(customResponse,{
                                type:{
                                    value:"basic"
                                },
                                url:{
                                    value:res.url
                                }
                            })
                            return customResponse;
                        }
                        else{
                            return res;
                        }
                    })
                    return Promise.resolve(p).then(res => {
                        return res;
                    });
                },
            writable:false
        })
    }
}

manipulationSetup();

function validateResponse(response){
    if(response){
        return window.manipulators.filter(m => {
            return m.urlValidator(response.url)
        }).length > 0;
    }
}