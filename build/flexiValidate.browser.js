var flexiValidate =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.isValid = isValid;
	exports.isValidAsync = isValidAsync;
	exports.messages = messages;
	exports.messagesAsync = messagesAsync;
	exports.allMessages = allMessages;
	exports.allMessagesAsync = allMessagesAsync;
	exports.cleanAttributes = cleanAttributes;
	/*
	    Example data structure for a validation object

	    validationObj = {
			validationInput: {
				validationProp: {
					isValid: function() {
						return true;
					},
					message: function() {
					    return 'is required';
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
	*/
	/*
	    This object has methods for working with a validation
	    data structure as seen above.
	*/

	// Reduces an array of booleans with the and
	// operation.
	// ie. item[0] && item[1] && item[n] ...
	// Returns true if all items are true
	function functionalAnd(result, current) {
	    if (result) {
	        return current;
	    } else {
	        return result;
	    }
	}
	// Reduces an array of keys to the resulting object
	// ie. result[nestedKey[0]][nestedKey[1]][nestedKey[n]] ...
	// Initial value should be the target object
	function nestedKeyReduce(result, nestedKey) {
	    if (typeof result !== 'undefined') {
	        if (typeof result[nestedKey] !== 'undefined') {
	            return result[nestedKey];
	        }
	    }

	    return undefined;
	}
	// Returns a property from a target object using
	// a key. If the key is nested it will resolve
	// the nesting before returning the object
	function resolveNestedObject(targetObj, key) {
	    var nestedKeys = key.split('.');
	    var isNestedKey = nestedKeys.length > 1;
	    var resultObj = undefined;
	    if (isNestedKey) {
	        resultObj = nestedKeys.reduce(nestedKeyReduce, targetObj);
	    } else {
	        resultObj = targetObj[key];
	    }

	    return resultObj;
	}
	// Returns true if the provided item is not
	// null or undefined
	function isNotUndefined(item) {
	    return typeof item !== 'undefined' && item !== null;
	}
	// Validates parameters
	function validateParams(targetObj, validationObj) {
	    if ((typeof targetObj === 'undefined' ? 'undefined' : _typeof(targetObj)) !== 'object') {
	        throw new Error('Target object must be an object');
	    }
	    if ((typeof validationObj === 'undefined' ? 'undefined' : _typeof(validationObj)) !== 'object') {
	        throw new Error('Validation object must be an object');
	    }
	}
	// Validates inputKey parameter
	function validateInputKey(validationObj, inputKey) {
	    if (typeof inputKey !== 'string') {
	        throw new Error('Validation input must be a property string');
	    } else if (typeof validationObj[inputKey] === 'undefined') {
	        throw new Error('Validation input property must exist on validation object');
	    }
	}
	// Returns true if all validations are valid
	function isValid(targetObj, validationObj) {
	    validateParams(targetObj, validationObj);

	    var validationKeys = Object.keys(validationObj);
	    return validationKeys.reduce(function (result, validationKey) {
	        if (result) {
	            var _ret = function () {
	                var validationInputObj = validationObj[validationKey];
	                var validationInputKeys = Object.keys(validationInputObj);
	                return {
	                    v: validationInputKeys.reduce(function (result, inputKey) {
	                        if (result) {
	                            var valdationProp = validationInputObj[inputKey];
	                            var resultObj = resolveNestedObject(targetObj, validationKey);
	                            if (valdationProp.isValid instanceof Function) {
	                                return valdationProp.isValid(resultObj);
	                            } else {
	                                return true;
	                            }
	                        } else {
	                            return result;
	                        }
	                    }, true)
	                };
	            }();

	            if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
	        } else {
	            return result;
	        }
	    }, true);
	}
	// Returns a promise resolving to true if all validations are valid
	// and resolving to false if a validation failed
	function isValidAsync(targetObj, validationObj) {
	    try {
	        validateParams(targetObj, validationObj);
	    } catch (err) {
	        return Promise.reject(err);
	    }

	    var validationKeys = Object.keys(validationObj);
	    var result = undefined;
	    if (validationKeys.length > 0) {
	        var validationPromises = validationKeys.map(function (validationKey) {
	            var validationInputObj = validationObj[validationKey];
	            var validationInputKeys = Object.keys(validationInputObj);
	            var validationInputPromises = validationInputKeys.map(function (inputKey) {
	                var valdationProp = validationInputObj[inputKey];
	                var resultObj = resolveNestedObject(targetObj, validationKey);
	                if (valdationProp.isValid instanceof Function) {
	                    return Promise.resolve(valdationProp.isValid(resultObj));
	                } else {
	                    return Promise.resolve(true);
	                }
	            });

	            return Promise.all(validationInputPromises).then(function (validationInputResults) {
	                return validationInputResults.reduce(functionalAnd);
	            });
	        }, true);

	        result = Promise.all(validationPromises).then(function (validationResults) {
	            return validationResults.reduce(functionalAnd);
	        });
	    } else {
	        // If there are no constraints every object is valid
	        result = Promise.resolve(true);
	    }
	    return result;
	}
	// Returns an array of validation messages for each validation prop
	// that fails for a single validation input
	function messages(targetObj, validationObj, validationInput) {
	    validateParams(targetObj, validationObj);
	    validateInputKey(validationObj, validationInput);

	    var keys = Object.keys(validationObj[validationInput]);

	    return keys.map(function (key) {
	        var validationProp = validationObj[validationInput][key];
	        var resultObj = resolveNestedObject(targetObj, validationInput);
	        var message = validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message;
	        if (!validationProp.isValid(resultObj)) return message;
	    }).filter(isNotUndefined);
	}
	// Returns a promise resolving to an array of validation messages
	// for each validation prop that fails for a single validation input
	function messagesAsync(targetObj, validationObj, validationInput) {
	    try {
	        validateParams(targetObj, validationObj);
	        validateInputKey(validationObj, validationInput);
	    } catch (err) {
	        return Promise.reject(err);
	    }

	    var keys = Object.keys(validationObj[validationInput]);

	    var validationPromises = keys.map(function (key) {
	        var validationProp = validationObj[validationInput][key];
	        var resultObj = resolveNestedObject(targetObj, validationInput);
	        var message = validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message;
	        return Promise.resolve(validationProp.isValid(resultObj)).then(function (isValid) {
	            if (!isValid) return message;
	        });
	    });

	    return Promise.all(validationPromises).then(function (message) {
	        return message.filter(isNotUndefined);
	    });
	}
	// Returns an array of objects, one object for each validation
	// input, with each key on that object being the failed validation
	// prop, and the value is the validation message
	function allMessages(targetObj, validationObj) {
	    validateParams(targetObj, validationObj);

	    var keys = Object.keys(validationObj);

	    return keys.reduce(function (result, key) {
	        var validationInputObj = validationObj[key];
	        var validationInputKeys = Object.keys(validationInputObj);
	        var validationResult = {};

	        validationInputKeys.forEach(function (inputKey) {
	            var validationProp = validationInputObj[inputKey];
	            var resultObj = resolveNestedObject(targetObj, key);
	            var message = validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message;
	            if (!validationProp.isValid(resultObj)) {
	                validationResult[inputKey] = message;
	            }
	        });

	        result[key] = validationResult;

	        return result;
	    }, {});
	}
	// Returns a promise resolving to an array of objects, one object for
	// each validation input, with each key on that object being the failed
	// validation prop, and the value is the validation message
	function allMessagesAsync(targetObj, validationObj) {
	    try {
	        validateParams(targetObj, validationObj);
	    } catch (err) {
	        return Promise.reject(err);
	    }

	    var keys = Object.keys(validationObj);

	    var validationPromises = keys.map(function (key) {
	        var validationInputObj = validationObj[key];
	        var validationInputKeys = Object.keys(validationInputObj);
	        var validationInputPromises = validationInputKeys.map(function (inputKey) {
	            var validationProp = validationInputObj[inputKey];
	            var resultObj = resolveNestedObject(targetObj, key);
	            var message = validationProp.message instanceof Function ? validationProp.message(resultObj) : validationProp.message;
	            return Promise.resolve(validationProp.isValid(resultObj)).then(function (isValid) {
	                if (!isValid) {
	                    return {
	                        message: message,
	                        key: inputKey
	                    };
	                }
	            });
	        });

	        return Promise.all(validationInputPromises).then(function (validationInputResults) {
	            var resultObj = validationInputResults.reduce(function (result, current) {
	                result[current.key] = current.message;
	                return result;
	            }, {});
	            resultObj.inputKey = key;
	            return resultObj;
	        });
	    });

	    return Promise.all(validationPromises).then(function (allMessages) {
	        return allMessages.reduce(function (result, current) {
	            result[current.inputKey] = current;
	            delete current.inputKey;
	            return result;
	        }, {});
	    });
	}
	// Returns an object that contains all the attributes of
	// the target object that are being validated
	function cleanAttributes(targetObj, validationObj) {
	    validateParams(targetObj, validationObj);

	    var keys = Object.keys(validationObj);
	    var result = {};
	    keys.forEach(function (key) {
	        var isNestedKey = key.indexOf('.') > -1;
	        if (!isNestedKey) {
	            result[key] = targetObj[key];
	        } else {
	            var rootKey = key.split('.')[0];
	            result[rootKey] = targetObj[rootKey];
	        }
	    });
	    return result;
	}
	// Default export object with all functions as properties
	exports.default = {
	    isValid: isValid,
	    isValidAsync: isValidAsync,
	    messages: messages,
	    messagesAsync: messagesAsync,
	    allMessages: allMessages,
	    allMessagesAsync: allMessagesAsync,
	    cleanAttributes: cleanAttributes
	};

/***/ }
/******/ ]);