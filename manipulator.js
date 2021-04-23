window.manipulators = [];

class Manipulate{

    a = [];

    p = new Promise((res,rej) => {
        this.resolver = res;
    })

    constructor(urlValidator){
        // a function to validate/match the response URL - It will be passed the response url
        this.urlValidator = urlValidator;
        
        window.manipulators.push(this);
    }
    //it makes the object work like a fetch promise
    then(func){
        this.a.push(func);
        return this;
    }
    async process(data){
        for(let f of this.a){
          data = await f(data)  
        }
        this.resolver(data);
    }
}

function manipulationSetup(){
    // For Fetch 
    const fetch = window.fetch || '';
    const isPossible = fetch.toString().indexOf('manipulator') === -1;
    if(isPossible){
        Object.defineProperty(window,'fetch',{
            value:async function(){
                    //manipulator
                    const p = await fetch.apply(this, arguments).then(async r => {
                        if(validateResponse(r)){
                            //manipulate
                            let manipulator = window.manipulators.find(m => m.urlValidator(r.url));
                            manipulator.process(r);
                            let manipulatedResponse = await Promise.resolve(manipulator.p);
                            return makeResponse(manipulatedResponse,r)
                        }
                        else{
                            return r;
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


/**
 * 
 * @param {mix|any} data - Any type of data to be in response body
 * @param {Response} responseModel - response object that will be copied exactly except the body.
 * @returns {Response} new response
 */
function makeResponse(data,responseModel = null){
    let utf8encoder = new TextEncoder();
      
    let encodedData = utf8encoder.encode(JSON.stringify(data));
    // Respond with our stream
    let customResponse = new Response(encodedData);
    if(responseModel){
        Object.defineProperties(customResponse,{
            type:{
                value:responseModel.type
            },
            url:{
                value:responseModel.url
            },
            status:{
                value:responseModel.status
            },
            statusText:{
                value:responseModel.statusText
            },
            headers:{
                value:responseModel.headers
            }
            
        })
    }
    return customResponse;
}

function validateResponse(response){
    if(response){
        return window.manipulators.filter(m => {
            return m.urlValidator(response.url)
        }).length > 0;
    }
}