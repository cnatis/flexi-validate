var validation = require('../build/flexiValidate.node');

describe('flexiValidate.cleanAttributes', function() {
    var cleanObj, objectToTest, cleanArr, arrayToTest;
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
            testProperty3: {},
            'testNestedProperty.nested': {}
        };
        objectToTest = {
            testProperty: 'test',
            testProperty2: 'test2',
            testProperty3: 'test3',
            testNestedProperty: {
                nested: 'test4'
            }
        };
        arrayToTest = [objectToTest];
        cleanObj = validation.cleanAttributes(objectToTest, constraints);
        cleanArr = validation.cleanAttributes(arrayToTest, constraints);
    });
    
    it('should accept an array and remove attributes that are not in the validation object', function () {
        expect(cleanArr instanceof Array).toBe(true);
        expect(cleanArr.length).toBe(1);
        expect(cleanArr[0].testProperty2).toEqual(undefined);
    });
    
    it('should remove attributes that are not in the validation object', function () {
        expect(cleanObj.testProperty2).toEqual(undefined);
    });
    
    it('should accept an array and keep attributes that are in the validation object', function () {
        expect(cleanArr instanceof Array).toBe(true);
        expect(cleanArr.length).toBe(1);
        expect(cleanArr[0].testProperty).toEqual(objectToTest.testProperty);
    });
    
    it('should keep attributes that are in the validation object', function () {
        expect(cleanObj.testProperty).toEqual(objectToTest.testProperty);
    });
    
    it('should accept an array and keep attributes that are in the validation object even if they have no constraints', function () {
        expect(cleanArr instanceof Array).toBe(true);
        expect(cleanArr.length).toBe(1);
        expect(cleanArr[0].testProperty3).toEqual(objectToTest.testProperty3);
    });
    
    it('should keep attributes that are in the validation object even if they have no constraints', function () {
        expect(cleanObj.testProperty3).toEqual(objectToTest.testProperty3);
    });
    
    it('should accept an array and keep nested attributes that are in the validation object', function () {
        expect(cleanArr instanceof Array).toBe(true);
        expect(cleanArr.length).toBe(1);
        expect(cleanArr[0].testNestedProperty).toEqual(objectToTest.testNestedProperty);
    });
    
    it('should keep nested attributes that are in the validation object', function () {
        expect(cleanObj.testNestedProperty).toEqual(objectToTest.testNestedProperty);
    });
}); 