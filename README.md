# Flexi Validate
A flexible JavaScript object validator

## Module Formats
* Global (Found in build/flexiValidate.browser.js)
* ES6 (Found in lib.js)
* UMD (AMD, CommonJS2) (Found in build/flexiValidate.node.js)

## Supported Environments
* Node
* Browser

## Supported Features
* Async validators
* Nested object validation
* Complex object validation

## Dependencies
* No external dependencies, Promise MUST be globably available, either shim or run in a run time that has Promise support

## Basic Usage
Flexi Validate is meant to be a barebones tool to run validation assertions on JavaScript objects. Because it is meant to be as barebones as possible, Flexi Validate does not include any utilities for assertions. It will only run your assertions against the target object. Due to the fact that Flexi Validate is barebones, users can bend it to their will. You can use it for validating complex objects by using multiple validation objects and calling isValid inside the first isValid. This can be used to validate an object with an array of objects, the possibilities are nearly endless.

### Validation Object
Example validation object to be passed to Flexi Validate
```
    var validationObj = {
		validationInput: {
			validationProp: {
				isValid: function(item) { // Returns true if item is valid
					return true;	      // Parameter is the targetObj[validationInput]
				},
				message: function(item) { // Can be a function or string
				    return 'is required'; // Parameter is the targetObj[validationInput]
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
```

Each property on the validation object corresponds to a property on the object to be validated, we call this object a "validation input." The properties on a validation input are called "validation props," they are objects containing an isValid function and a message which can be a string or function, used to determine validity.

### Validating an Object
```
    var validationObj = {
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
	
	var objectToValidate = {
	    username: ''
	};
	
	flexiValidate.isValid(objectToValidate, validationObj); 
	// returns false because the username on the object failed the validation test
	
	flexiValidate.allMessages(objectToValidate, validationObj);
	// returns the following data structure
	{
	    username: {
        	required: 'Username is required'
        }
	}
	
	flexiValidate.messages(objectToValidate, validationObj, 'username');
	// returns the following object
	{
	    required: 'Username is required'
	}
```

### Asynchronous Validation of an Object
```
    var validationObj = {
		username: {
			required: {
				isValid: function(username) {
					return new Promise(function(resolve, reject) {
					    setTimeout(function() {
					        if(typeof(username) === 'undefined')
        						resolve(false);
        					if(username === null)
        						resolve(false);
        					if(username.trim().length <= 0)
        					    resolve(false);
        					resolve(true);
					    }, 1000);
					});
				},
				message: 'Username is required'
			}
		}
	};
	
	var objectToValidate = {
	    username: 'testUsername'
	};
	
	flexiValidate.isValidAsync(objectToValidate, validationObj)
    	.then(function(result) {
            // returns true because the username on the object passed the validation test	    
    	});
	
	flexiValidate.allMessagesAsync(objectToValidate, validationObj);
	    .then(function(allMessages) {
	        // returns the following data structure
        	{
            	username: {
            	    required: 'Username is required'
            	}
        	}
	    });
	
	
	flexiValidate.messagesAsync(objectToValidate, validationObj, 'username')
		.then(function(message) {
        	// returns the following object
        	{
        	    required: 'Username is required'
        	}
	    });
```

## API Reference

### isValid

Returns true if all the validations for the target object return true or an array of isValid values if the first parameter is an array
First parameter is the target object or array of objects we want to validate
Second parameter is the validation object containing our validation structure
```
    Boolean || Array isValid(targetObj, validationObj)
```

### isValidAsync

Returns a promise resolving to true if all the validations for the target object return true or an array of promises resolving to isValid values if the first parameter is an array
First parameter is the target object or array of objects we want to validate
Second parameter is the validation object containing our validation structure
```
    Promise || Array isValidAsync(targetObj, validationObj)
```

### messages

Returns an object where each property is a failed validation and the value of that property is the validation message or an array of objects where each object is the result of messages if the first parameter is an array
First parameter is the target object or array of objects we want to validate
Second parameter is the validation object containing our validation structure
Third parameter is the key for the validation input we want to get messages for, should be a string
```
    Object || Array messages(targetObj, validationObj, validationInput)
```

### messagesAsync

Returns a promise resolving to an object where each property is a failed validation and the value of that property is the validation message or an array of promises resolving to the result of messagesAsync if the first parameter is an array
First parameter is the target object or array of objects we want to validate
Second parameter is the validation object containing our validation structure
Third parameter is the key for the validation input we want to get messages for, should be a string
```
    Promise || Array messagesAsync(targetObj, validationObj, validationInput)
```

### allMessages

Returns an object where each key is a failed validation input object and each property on the object is a failed validation prop and the value of that property is the validation message or an array containing the result of allMessages if the first parameter is an array
First parameter is the target object or array of objects we want to validate
Second parameter is the validation object containing our validation structure
```
    Array allMessages(targetObj, validationObj)
```

### allMessagesAsync

Returns a promise resolving to an object where each key is a failed validation input object and each property on the object is a failed validation prop and the value of that property is the validation message or an array of promises resolving to the result of allMessagesAsync if the first parameter is an array
First parameter is the target object or array of objects we want to validate
Second parameter is the validation object containing our validation structure
```
    Promise || Array allMessagesAsync(targetObj, validationObj)
```

### cleanAttributes

Filters the properties on the provided object to only those that were validated
Returns the filtered object or an array of filtered objects if the first parameter is an array

Note this function does not check the validity of the object

```
    Object || Array cleanAttributes(targetObj, validationObj)
```

#### Example #1

```
    var validationObj = {
		username: {
			required: {
				isValid: function(username) {
					return true;
				},
				message: 'Username is required'
			}
		}
	};
	
	var objectToValidate = {
	    username: 'test',
	    somethingElse: true
	};
	
	flexiValidate.cleanAttributes(objectToValidate, validationObj); 
	// returns the following object
	// somthingElse is filtered because we are not validating it
	{
	    username: 'test'
	}
```

#### Example #2

```
    var validationObj = {
		username: {
			required: {
				isValid: function(username) {
					return true;
				},
				message: 'Username is required'
			}
		},
		somethingElse: {}
	};
	
	var objectToValidate = {
	    username: 'test',
	    somethingElse: true
	};
	
	flexiValidate.cleanAttributes(objectToValidate, validationObj); 
	// returns the following object
	// somthingElse is not filtered because we are validating it even without
	// a validation prop on the validation input
	{
	    username: 'test',
	    somethingElse: true
	}
```

#### Example #3

```
    var validationObj = {
		username: {
			required: {
				isValid: function(username) {
					return true;
				},
				message: 'Username is required'
			}
		},
		somethingElse: {}
	};
	
	var objectToValidate = {
	    username: 'test',
	    somethingElse: true
	};
	
	var arrayToValidate = [
	    objectToValidate,
	    objectToValidate
	];
	
	flexiValidate.cleanAttributes(arrayToValidate, validationObj); 
	// returns the following array of objects
	// somthingElse is not filtered because we are validating it even without
	// a validation prop on the validation input
	[
		{
		    username: 'test',
		    somethingElse: true
		},
		{
		    username: 'test',
		    somethingElse: true
		}
	]
```

## More Code Exmaples

### Validate Nested Object

```
    var validationObj = {
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
		},
		'pet.name': {
			required: {
				isValid: function(name) {
					if(typeof(name) === 'undefined')
						return false;
					return true;
				},
				message: 'Pet name is required'
			}
		}
	};
	
	var objectToValidate = {
	    username: 'test',
	    pet: {
	    	type: 'cat'
	    }
	};
	
	flexiValidate.isValid(objectToValidate, validationObj); 
	// returns false because the pet name on the object failed the validation test
	
	flexiValidate.allMessages(objectToValidate, validationObj);
	// returns the following data structure
	{
	    'pet.name': {
        	required: 'Pet name is required'
        }
	}
	
	flexiValidate.messages(objectToValidate, validationObj, 'pet.name');
	// returns the following object
	{
	    required: 'Pet name is required'
	}
```

### Validate Complex Objects
```
    var userValidationObj = {
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
		},
		pets: {
			required: {
				isValid: function(pets) {
					return pets.reduce(function(result, current) {
						if(result) {
							return flexiValidate.isValid(current, petValidationObj);
						}
						return result;
					}, true);
				},
				message: function(pets) {
					return pets.map(function(current) {
						return flexiValidate.allMessages(current, petValidationObj);
					}).filter(function(item) {
						return (typeof(item) !== 'undefined');
					});
				}
			}
		}
	};
	
	var petValidationObj = {
		name: {
			required: {
				isValid: function(name) {
					if(typeof(name) === 'undefined')
						return false;
					return true;
				},
				message: 'Pet name is required'
			}
		}
	}
	
	var objectToValidate = {
	    username: 'test',
	    pets: [
		    {
		    	type: 'cat'
		    }
		]
	};
	
	flexiValidate.isValid(objectToValidate, validationObj); 
	// returns false because the pets array on the object failed the validation test
	
	flexiValidate.allMessages(objectToValidate, validationObj);
	// returns the following data structure
	{
	    pets: {
	    	required: [
	    	    {
	        		name: {
	        			required: 'Pet name is required'
	        		}
	        	}
	    	]
	    }
	}
	
	flexiValidate.messages(objectToValidate, validationObj, 'pets');
	// returns the following object
	{
    	required: [
        	{
        		name: {
            	    required:  'Pet name is required'
        	    }
        	}
    	]
    }
```