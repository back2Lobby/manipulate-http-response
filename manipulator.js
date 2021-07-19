window.manipulators = [];

class Manipulate{

    a = [];

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
        for await(let f of this.a){
          data = await f(data)  
        }
        return data;
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
                    let p = await fetch.apply(this, arguments).then(async r => {
                        if(validateResponse(r)){
                            //manipulate
                            let manipulator = window.manipulators.find(m => m.urlValidator(r.url));
                            let manipulatedResponse = await manipulator.process(r);

                            return makeResponse(manipulatedResponse,null,r);
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
 * @param {Object} option - An object with any options you want to override in response object
 * @param {Response} responseModel - response object that will be copied exactly except the body.
 * @returns {Response} new response
 */
function makeResponse(data,options = null,responseModel = null){
    let utf8encoder = new TextEncoder();
    let encodedData = utf8encoder.encode(JSON.stringify(data));
    // Respond with our stream
    let customResponse = new Response(encodedData);
    if((responseModel && responseModel instanceof Object && responseModel.constructor && responseModel.constructor.name == "Response") || (options && options instanceof Object)){
        Object.defineProperties(customResponse,{
            type:{
                value: (responseModel ? responseModel.type : options.type) ?? "default"
            },
            url:{
                value:(responseModel ? responseModel.url : options.url) ?? ""
            },
            status:{
                value:(responseModel ? responseModel.status : options.status) ?? 200
            },
            statusText:{
                value:(responseModel ? responseModel.statusText : options.statusText) ?? ""
            },
            ok:{
                value:(responseModel ? responseModel.ok : options.ok) ?? true
            },
            headers:{
                value:(responseModel ? responseModel.headers : options.headers) ?? new Headers()
            },
            redirected:{
                value:(responseModel ? responseModel.redirected : options.redirected) ?? false
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