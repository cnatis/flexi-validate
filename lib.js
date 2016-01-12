/*
    Example data structure for a validation object

    validationObj = {
		validationInput: {
			validationProp: {
				isValid: function() {
					return true;
				},
				message: function() {
				    return 'is required';
				}
			}
		},
		username: {
			required: {
				isValid: function(username) {
					if(typeof(username) === 'undefined')
						return false;
					if(username === null)
						return false;
					if(username.trim().length <= 0)
						return false;
					return true;
				},
				message: 'Username is required'
			}
		}
	};
*/
/*
    This object has methods for working with a validation
    data structure as seen above.
*/

// Reduces an array of booleans with the and
// operation.
// ie. item[0] && item[1] && item[n] ...
// Returns true if all items are true
function functionalAnd(result, current) {
    if(result) {
        return current;
    } else {
        return result;
    }
}
// Reduces an array of keys to the resulting object
// ie. result[nestedKey[0]][nestedKey[1]][nestedKey[n]] ...
// Initial value should be the target object
function nestedKeyReduce(result, nestedKey) {
    if(typeof(result) !== 'undefined') {
        if(typeof(result[nestedKey]) !== 'undefined') {
            return result[nestedKey];
        }
    }
    
    return undefined;
}
// Returns a property from a target object using
// a key. If the key is nested it will resolve
// the nesting before returning the object
function resolveNestedObject(targetObj, key) {
    let nestedKeys = key.split('.');
    let isNestedKey = nestedKeys.length > 1;
    let resultObj;
    if(isNestedKey) {
        resultObj = nestedKeys.reduce(nestedKeyReduce, targetObj);
    } else {
        resultObj = targetObj[key];
    }
    
    return resultObj;
}           
// Returns true if the provided item is not
// null or undefined
function isNotUndefined(item) {
    return (typeof(item) !== 'undefined' && item !== null);
}
// Validates parameters
function validateParams(targetObj, validationObj) {
    if(typeof(targetObj) !== 'object') {
        throw new Error('Target object must be an object');
    }
    if(typeof(validationObj) !== 'object') {
        throw new Error('Validation object must be an object');
    }
}
// Validates inputKey parameter
function validateInputKey(validationObj, inputKey) {
    if(typeof(inputKey) !== 'string') {
        throw new Error('Validation input must be a property string');
    } else if(typeof(validationObj[inputKey]) === 'undefined') {
        throw new Error('Validation input property must exist on validation object');
    }
}
// Returns true if all validations are valid
export function isValid(targetObj, validationObj) {
    validateParams(targetObj, validationObj);
        
    let validationKeys = Object.keys(validationObj);
    return validationKeys.reduce(function(result, validationKey) {
        if(result) {
            let validationInputObj = validationObj[validationKey];
            let validationInputKeys = Object.keys(validationInputObj);
            return validationInputKeys.reduce(function(result, inputKey) {
                if(result) {
                    let valdationProp = validationInputObj[inputKey];
                    let resultObj = resolveNestedObject(targetObj, validationKey);
                    if(valdationProp.isValid instanceof Function) {
                        return valdationProp.isValid(resultObj);
                    } else {
                        return true;
                    }
                } else {
                    return result;
                }
            }, true);
        } else {
            return result;
        }
    }, true);
}
// Returns a promise resolving to true if all validations are valid
// and resolving to false if a validation failed
export function isValidAsync(targetObj, validationObj) {
    validateParams(targetObj, validationObj);
    
    let validationKeys = Object.keys(validationObj);
    let result;
    if(validationKeys.length > 0) {
        let validationPromises = validationKeys.map(function(validationKey) {
            let validationInputObj = validationObj[validationKey];
            let validationInputKeys = Object.keys(validationInputObj);
            let validationInputPromises = validationInputKeys.map(function(inputKey) {
                let valdationProp = validationInputObj[inputKey];
                let resultObj = resolveNestedObject(targetObj, validationKey);
                if(valdationProp.isValid instanceof Function) {
                    return Promise.resolve(valdationProp.isValid(resultObj));
                } else {
                    return Promise.resolve(true);
                }
            });
            
            return Promise.all(validationInputPromises).then(function(validationInputResults) {
                return validationInputResults.reduce(functionalAnd);
            });
        }, true);
        
        result = Promise.all(validationPromises).then(function(validationResults) {
            return validationResults.reduce(functionalAnd);
        });
    } else {
        // If there are no constraints every object is valid
        result = Promise.resolve(true);
    }
    return result;
}
// Returns an array of validation messages for each validation prop
// that fails for a single validation input
export function messages(targetObj, validationObj, validationInput) {
    validateParams(targetObj, validationObj);
    validateInputKey(validationObj, validationInput);
    
    let keys = Object.keys(validationObj[validationInput]);

    return keys.map(function(key) {
        let validationProp = validationObj[validationInput][key];
        let resultObj = resolveNestedObject(targetObj, validationInput);
        let message = (validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message);
        if(!validationProp.isValid(resultObj)) return message;
    }).filter(isNotUndefined);
}
// Returns a promise resolving to an array of validation messages 
// for each validation prop that fails for a single validation input
export function messagesAsync(targetObj, validationObj, validationInput) {
    validateParams(targetObj, validationObj);
    validateInputKey(validationObj, validationInput);
    
    let keys = Object.keys(validationObj[validationInput]);

    let validationPromises = keys.map(function(key) {
        let validationProp = validationObj[validationInput][key];
        let resultObj = resolveNestedObject(targetObj, validationInput);
        let message = (validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message);
        return Promise.resolve(validationProp.isValid(resultObj))
            .then(function(isValid) {
                if(!isValid) return message;
            });
    });
    
    return Promise.all(validationPromises)
        .then(function(message) {
            return message.filter(isNotUndefined); 
        });
}
// Returns an array of objects, one object for each validation
// input, with each key on that object being the failed validation
// prop, and the value is the validation message
export function allMessages(targetObj, validationObj) {
    validateParams(targetObj, validationObj);
    
    let keys = Object.keys(validationObj);

    return keys.reduce(function(result, key) {
        let validationInputObj = validationObj[key];
        let validationInputKeys = Object.keys(validationInputObj);
        let validationResult = {};

        validationInputKeys.forEach(function(inputKey) {
            let validationProp = validationInputObj[inputKey];
            let resultObj = resolveNestedObject(targetObj, key);
            let message = (validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message);
            if(!validationProp.isValid(resultObj)) {
                validationResult[inputKey] = message;
            }
        });

        result[key] = validationResult;

        return result;
    }, {});
}
// Returns a promise resolving to an array of objects, one object for 
// each validation input, with each key on that object being the failed 
// validation prop, and the value is the validation message
export function allMessagesAsync(targetObj, validationObj) {
    validateParams(targetObj, validationObj);
    
    let keys = Object.keys(validationObj);

    let validationPromises = keys.map(function(key) {
        let validationInputObj = validationObj[key];
        let validationInputKeys = Object.keys(validationInputObj);
        let validationInputPromises = validationInputKeys.map(function(inputKey) {
            let validationProp = validationInputObj[inputKey];
            let resultObj = resolveNestedObject(targetObj, key);
            let message = (validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message);
            return Promise.resolve(validationProp.isValid(resultObj))
                .then(function(isValid) {
                   if(!isValid) {
                       return {
                           message: message,
                           key: inputKey
                       };
                   }
                });
        });
        
        return Promise.all(validationInputPromises).then(function(validationInputResults) {
            let resultObj = validationInputResults.reduce(function(result, current) {
                result[current.key] = current.message;
                return result;
            }, {});
            resultObj.inputKey = key;
            return resultObj; 
        });
    });
    
    return Promise.all(validationPromises)
        .then(function(allMessages) {
            return allMessages.reduce(function(result, current) {
                result[current.inputKey] = current;
                delete current.inputKey;
                return result;
            }, {});
        });
}
// Returns an object that contains all the attributes of
// the target object that are being validated
export function cleanAttributes(targetObj, validationObj) {
    validateParams(targetObj, validationObj);
    
    let keys = Object.keys(validationObj);
    let result = {};
    keys.forEach(function(key) {
        let isNestedKey = (key.indexOf('.') > -1);
        if(!isNestedKey) {
            result[key] = targetObj[key];
        }
    });
    return result;
}
// Default export object with all functions as properties
export default {
    isValid: isValid,
    isValidAsync: isValidAsync,
    messages: messages,
    messagesAsync: messagesAsync,
    allMessages: allMessages,
    allMessagesAsync: allMessagesAsync,
    cleanAttributes: cleanAttributes
};