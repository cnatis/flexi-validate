var validation = require('../build/flexiValidate.node');
    
describe('flexiValidate.allMessages', function() {
    // Parameter validation
    it('should throw an error if not given an object as the target object', function() {
        var constraints = {};
        var objectToTest = undefined;
        var result;
        try {
            validation.allMessages(objectToTest, constraints);
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
            validation.allMessages(objectToTest, constraints);
        } catch(err) {
            result = err;
        }
        expect(result).toBeDefined();
    });
    // Return validation
    it('should produce a message when constraints are not met', function () {
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
        var allMessages = validation.allMessages(objectToTest, constraints);
        expect(isValid).toBe(false);
        expect(allMessages).toEqual({
            testProperty: {
                isRequired: constraints.testProperty.isRequired.message
            }
        });
    });
    it('should produce a message for each failed constraint', function () {
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
        var isValid = validation.isValid(objectToTest, constraints);
        var allMessages = validation.allMessages(objectToTest, constraints);
        expect(isValid).toBe(false);
        expect(allMessages).toEqual({
            testProperty: {
                isRequired: constraints.testProperty.isRequired.message,
                isRequired2: constraints.testProperty.isRequired2.message
            }
        });
    });
    it('should validate an array of objects and produce a message for each failed constraint', function () {
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
        var objectToTest = [{}];
        var isValid = validation.isValid(objectToTest, constraints);
        var allMessages = validation.allMessages(objectToTest, constraints);
        expect(allMessages instanceof Array).toBe(true);
        expect(isValid instanceof Array).toBe(true);
        expect(isValid[0]).toBe(false);
        expect(allMessages).toEqual([{
            testProperty: {
                isRequired: constraints.testProperty.isRequired.message,
                isRequired2: constraints.testProperty.isRequired2.message
            }
        }]);
    });
    it('should produce a message for each failed validation input', function () {
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
        var isValid = validation.isValid(objectToTest, constraints);
        var allMessages = validation.allMessages(objectToTest, constraints);
        expect(isValid).toBe(false);
        expect(allMessages).toEqual({
            testProperty: {
                isRequired: constraints.testProperty.isRequired.message
            },
            testProperty2: {
                isRequired: constraints.testProperty2.isRequired.message
            }
        });
    });
    it('should allow a function or string for message', function () {
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
        var isValid = validation.isValid(objectToTest, constraints);
        var allMessages = validation.allMessages(objectToTest, constraints);
        expect(isValid).toBe(false);
        expect(allMessages).toEqual({
            testProperty: {
                isRequired: constraints.testProperty.isRequired.message,
                isRequired2: constraints.testProperty.isRequired2.message()
            }
        });
    });    
});