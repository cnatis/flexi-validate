var validation = require('../build/flexiValidate.node');

describe('flexiValidate.cleanAttributes', function() {
    var cleanObj, objectToTest;
    beforeEach(function() {
        var constraints = {
            testProperty: {
                isRequired: {
                    isValid: function(prop) {
                        return (typeof(prop) !== 'undefined');
                    },
                    message: 'testProperty is required'
                }
            },
            testProperty3: {}
        };
        objectToTest = {
            testProperty: 'test',
            testProperty2: 'test2',
            testProperty3: 'test3'
        };
        cleanObj = validation.cleanAttributes(objectToTest, constraints);
    });
    
    it('should remove attributes that are not in the validation object', function () {
        expect(cleanObj.testProperty2).toEqual(undefined);
    });
    
    it('should keep attributes that are in the validation object', function () {
        expect(cleanObj.testProperty).toEqual(objectToTest.testProperty);
    });
    
    it('should keep attributes that are in the validation object even if they have no constraints', function () {
        expect(cleanObj.testProperty3).toEqual(objectToTest.testProperty3);
    });
}); 