var validation = require('../build/flexiValidate.node');
    
describe('flexiValidate.messages', function() {
    // Parameter validation
    it('should throw an error if not given an object as the target object', function() {
        var constraints = {};
        var objectToTest = undefined;
        var result;
        try {
            validation.messages(objectToTest, constraints);
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
            validation.messages(objectToTest, constraints);
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
        var message = validation.messages(objectToTest, constraints, 'testProperty');
        expect(isValid).toBe(false);
        expect(message).toEqual({
            isRequired: constraints.testProperty.isRequired.message
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
        var message = validation.messages(objectToTest, constraints, 'testProperty');
        expect(isValid).toBe(false);
        expect(message).toEqual({
            isRequired: constraints.testProperty.isRequired.message,
            isRequired2: constraints.testProperty.isRequired2.message
        });
        expect(Object.keys(message).length).toBe(2);
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
        var message = validation.messages(objectToTest, constraints, 'testProperty');
        expect(isValid instanceof Array).toBe(true);
        expect(isValid[0]).toBe(false);
        expect(message instanceof Array).toBe(true);
        expect(message[0]).toEqual({
            isRequired: constraints.testProperty.isRequired.message,
            isRequired2: constraints.testProperty.isRequired2.message
        });
        expect(Object.keys(message[0]).length).toBe(2);
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
        var message = validation.messages(objectToTest, constraints, 'testProperty');
        expect(isValid).toBe(false);
        expect(message).toEqual({
            isRequired: constraints.testProperty.isRequired.message,
            isRequired2: constraints.testProperty.isRequired2.message()
        });
        expect(Object.keys(message).length).toBe(2);
    });    
});