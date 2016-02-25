var validation = require('../build/flexiValidate.node');

describe('flexiValidate.isValid', function() {
    // Parameter validation
    it('should throw an error if not given an object as the target object', function() {
        var constraints = {};
        var objectToTest = undefined;
        var result;
        try {
            validation.isValid(objectToTest, constraints);
        } catch(err) {
            result = err;
        }
        expect(result).toBeDefined();
    });
    it('should throw an error if not given an object as the validation object', function() {
        var constraints = undefined;
        var objectToTest = {};
        var result;
        try {
            validation.isValid(objectToTest, constraints);
        } catch(err) {
            result = err;
        }
        expect(result).toBeDefined();
    });
    // Return validation
    it('should validate objects based on no constraints', function () {
        var constraints = {};
        var objectToTest = {};
        var isValid = validation.isValid(objectToTest, constraints);
        expect(isValid).toBe(true);
    });
    it('should validate objects based on constraints', function () {
        var constraints = {
            testProperty: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required'
                }
            }
        };
        var objectToTest = {};
        var isValid = validation.isValid(objectToTest, constraints);
        expect(isValid).toBe(false);
        var objectToTest2 = {
            testProperty: 'test'
        };
        var isValid2 = validation.isValid(objectToTest2, constraints);
        expect(isValid2).toBe(true);
    });
    it('should validate an array of objects based on constraints', function () {
        var constraints = {
            testProperty: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required'
                }
            }
        };
        var objectToTest = [{}];
        var isValid = validation.isValid(objectToTest, constraints);
        expect(isValid instanceof Array).toBe(true);
        expect(isValid.length).toBe(1);
        expect(isValid[0]).toBe(false);
        var objectToTest2 = [{
            testProperty: 'test'
        }];
        var isValid2 = validation.isValid(objectToTest2, constraints);
        expect(isValid2 instanceof Array).toBe(true);
        expect(isValid2.length).toBe(1);
        expect(isValid2[0]).toBe(true);
    });
    it('should allow validation props without constraints', function () {
        var constraints = {
            testProperty: {
                isRequired: {}
            }
        };
        var objectToTest = {};
        var isValid = validation.isValid(objectToTest, constraints);
        expect(isValid).toBe(true);
    });
    it('should validate complex objects', function() {
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
    				    if(pets.length > 0) {
        					return pets.reduce(function(result, current) {
        						if(result) {
        							return validation.isValid(current, petValidationObj);
        						}
        						return result;
        					}, true);
    				    } else {
    				        return false;
    				    }
    				},
    				message: function(pets) {
    					return pets.map(function(current) {
    						return {
    						    pet: current,
    						    messages: validation.allMessages(current, petValidationObj)
    						};
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
    		},
    		type: {
    			required: {
    				isValid: function(name) {
    					if(typeof(name) === 'undefined')
    						return false;
    					return true;
    				},
    				message: 'Pet type is required'
    			}
    		}
    	}
    	
    	var objectToValidate = {
    	    username: 'test',
    	    pets: []
    	};
    	
    	var objectToValidate2 = {
    	    username: 'test',
    	    pets: [
    		    {
    		    	type: 'cat',
    		    	name: 'kitty'
    		    }
    		]
    	};
    	
    	var isValid = validation.isValid(objectToValidate, userValidationObj);
    	var isValid2 = validation.isValid(objectToValidate2, userValidationObj);
    	
    	expect(isValid).toBe(false);
    	expect(isValid2).toBe(true);
    });
});