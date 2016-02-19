var flexiValidate = require('../build/flexiValidate.node');
    
describe('flexiValidate', function() {
    it('validate nested object code example should work', function() {
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
    	
    	var isValid = flexiValidate.isValid(objectToValidate, validationObj); 
    	// returns false because the pet name on the object failed the validation test
    	expect(isValid).toEqual(false);
    	
    	var allMessages = flexiValidate.allMessages(objectToValidate, validationObj);
    	// returns the following data structure
    	expect(allMessages).toEqual({
    	    'pet.name': {
            	required: 'Pet name is required'
            }
    	});
    	
    	var messages = flexiValidate.messages(objectToValidate, validationObj, 'pet.name');
    	// returns the following object
    	expect(messages).toEqual({
    	    required: 'Pet name is required'
    	});
    });
    
    it('validate complex object code exmaple should work', function() {
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
        
        var isValid = flexiValidate.isValid(objectToValidate, userValidationObj); 
        // returns false because the pets array on the object failed the validation test
        expect(isValid).toEqual(false);
        
        var allMessages = flexiValidate.allMessages(objectToValidate, userValidationObj);
        // returns the following data structure
        expect(allMessages).toEqual({
            pets: {
            	required: [
            	    {
                		name: {
                			required: 'Pet name is required'
                		}
                	}
            	]
            }
        });
        
        var messages = flexiValidate.messages(objectToValidate, userValidationObj, 'pets');
        // returns the following object
        expect(messages).toEqual({
        	required: [
            	{
            		name: {
                	    required:  'Pet name is required'
            	    }
            	}
        	]
        });
    });
    
    it('example #2 code example should work', function() {
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
    	
    	var cleanObj = flexiValidate.cleanAttributes(objectToValidate, validationObj); 
    	// returns the following object
    	// somthingElse is not filtered because we are validating it even without
    	// a validation prop on the validation input
    	expect(cleanObj).toEqual({
    	    username: 'test',
    	    somethingElse: true
    	});
    });
    
    it('example #1 code example should work', function() {
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
    	
    	var cleanObj = flexiValidate.cleanAttributes(objectToValidate, validationObj); 
    	// returns the following object
    	// somthingElse is filtered because we are not validating it
    	expect(cleanObj).toEqual({
    	    username: 'test'
    	});
    });
});