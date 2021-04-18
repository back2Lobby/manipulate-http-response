window.manipulators = [];

class Manipulate{
    constructor(urlValidator,responseType,manipulate){
        // a function to validate/match the response URL - It will be passed the response url
        this.urlValidator = urlValidator;
        // response type as string i.e. "text","json"
        this.responseType = responseType;
        // a function where you will manipulate data - It will be passed the response data to manipulate
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
                    const p = await fetch.apply(this, arguments).then(async r => {
                        if(validateResponse(r)){
                            //manipulate
                            let manipulator = window.manipulators.find(m => m.urlValidator(r.url));
                            let originalResponse 
                            if(manipulator.responseType == "json"){
                                originalResponse = await r.json();
                            }else if(manipulator.responseType == "text"){
                                originalResponse = await r.text();
                            }

                            let manipulatedResponse = manipulator.manipulate(originalResponse)

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