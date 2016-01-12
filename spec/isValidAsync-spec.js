var validation = require('../build/flexiValidate.node');

describe('flexiValidate.isValidAsync', function () {
    // Parameter validation
    it('should throw an error if not given an object as the target object', function() {
        var constraints = {};
        var objectToTest = undefined;
        var result;
        try {
            validation.isValidAsync(objectToTest, constraints);
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
            validation.isValidAsync(objectToTest, constraints);
        } catch(err) {
            result = err;
        }
        expect(result).toBeDefined();
    });
    // Return validation
    it('should return a promise with a then property', function () {
        var constraints = {};
        var objectToTest = {};
        var isValid = validation.isValidAsync(objectToTest, constraints);
        expect(isValid.then).not.toBe(undefined);
    });
    it('should validate objects based on no constraints', function (done) {
        var constraints = {};
        var objectToTest = {};
        validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
               expect(result).toBe(true); 
               done();
            }, done);
    });
    it('should validate objects based on constraints', function (done) {
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
                return result;
            }));
        
        var objectToTest2 = {
            testProperty: 'test'
        };
        promises.push(validation.isValidAsync(objectToTest2, constraints)
            .then(function(result) {
                expect(result).toBe(true);
                return result;
            }));
        
        Promise.all(promises)
            .then(function() {
                done();
            }, done);
    });
    it('should allow validation props without constraints', function (done) {
        var constraints = {
            testProperty: {
                isRequired: {}
            }
        };
        var objectToTest = {};
        validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
                expect(result).toBe(true);
                done();
            }, done);
    });
});