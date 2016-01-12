var validation = require('../build/flexiValidate.node');
    
describe('flexiValidate.allMessagesAsync', function() {
    // Parameter validation
    it('should throw an error if not given an object as the target object', function() {
        var constraints = {};
        var objectToTest = undefined;
        var result;
        try {
            validation.allMessagesAsync(objectToTest, constraints);
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
            validation.allMessagesAsync(objectToTest, constraints);
        } catch(err) {
            result = err;
        }
        expect(result).toBeDefined();
    });
    // Return validation
    it('should produce a message when constraints are not met', function (done) {
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
        var promises = [];
        promises.push(validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
                expect(result).toBe(false);
            }));
        promises.push(validation.allMessagesAsync(objectToTest, constraints)
            .then(function(allMessages) {
                expect(allMessages).toEqual({
                    testProperty: {
                        isRequired: constraints.testProperty.isRequired.message
                    }
                });
            }));
        
        Promise.all(promises)
            .then(function() {
                done(); 
            }, done);
    });
    it('should produce a message for each failed constraint', function (done) {
        var constraints = {
            testProperty: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required'
                },
                isRequired2: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required2'
                }
            }
        };
        var objectToTest = {};
        var promises = [];
        promises.push(validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
                expect(result).toBe(false);
            }));
        promises.push(validation.allMessagesAsync(objectToTest, constraints)
            .then(function(allMessages) {
                expect(allMessages).toEqual({
                    testProperty: {
                        isRequired: constraints.testProperty.isRequired.message,
                        isRequired2: constraints.testProperty.isRequired2.message
                    }
                });
            }));
        
        Promise.all(promises)
            .then(function() {
                done(); 
            }, done);
    });
    it('should produce a message for each failed validation input', function (done) {
        var constraints = {
            testProperty: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required'
                }
            },
            testProperty2: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty2 is required'
                }
            }
        };
        var objectToTest = {};
        var promises = [];
        promises.push(validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
                expect(result).toBe(false);
            }));
        promises.push(validation.allMessagesAsync(objectToTest, constraints)
            .then(function(allMessages) {
                expect(allMessages).toEqual({
                    testProperty: {
                        isRequired: constraints.testProperty.isRequired.message
                    },
                    testProperty2: {
                        isRequired: constraints.testProperty2.isRequired.message
                    }
                });
            }));
        
        Promise.all(promises)
            .then(function() {
                done(); 
            }, done);
    });
    it('should allow a function or string for message', function (done) {
        var constraints = {
            testProperty: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required'
                },
                isRequired2: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: function() {
                        return 'testProperty is required2'
                    }
                }
            }
        };
        var objectToTest = {};
        var promises = [];
        promises.push(validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
                expect(result).toBe(false);
            }));
        promises.push(validation.allMessagesAsync(objectToTest, constraints)
            .then(function(allMessages) {
                expect(allMessages).toEqual({
                    testProperty: {
                        isRequired: constraints.testProperty.isRequired.message,
                        isRequired2: constraints.testProperty.isRequired2.message()
                    }
                });
            }));
        
        Promise.all(promises)
            .then(function() {
                done(); 
            }, done);
    });    
});