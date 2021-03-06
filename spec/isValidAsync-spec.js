var validation = require('../build/flexiValidate.node');

describe('flexiValidate.isValidAsync', function () {
    // Parameter validation
    it('should reject with an error if not given an object as the target object', function() {
        var constraints = {};
        var objectToTest = undefined;
        validation.isValidAsync(objectToTest, constraints)
            .catch(function(err) {
                expect(err).toBeDefined();            
            });
    });
    it('should throw an error if not given an object as the validation object', function() {
        var constraints = undefined;
        var objectToTest = {};
        validation.isValidAsync(objectToTest, constraints)
            .catch(function(err) {
                expect(err).toBeDefined();            
            });
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
    it('should validate an array of objects based on constraints', function (done) {
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
        var promises = [];
        promises.push(validation.isValidAsync(objectToTest, constraints)
            .then(function(result) {
                expect(result instanceof Array).toBe(true);
                expect(result.length).toBe(1);
                expect(result[0]).toBe(false);
                return result;
            }));
        
        var objectToTest2 = [{
            testProperty: 'test'
        }];
        promises.push(validation.isValidAsync(objectToTest2, constraints)
            .then(function(result) {
                expect(result instanceof Array).toBe(true);
                expect(result.length).toBe(1);
                expect(result[0]).toBe(true);
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