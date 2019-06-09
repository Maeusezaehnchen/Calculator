/*
Calculator.js;
Version: V1.0
Author: Sebastian Kern
Git: https://github.com/Maeusezaehnchen/Calculator

License:

MIT License

Copyright (c) 2019 Sebastian Kern

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

TypeEnum = {
    NONE: -1,
    BRACE: 0,
    NUMBER: 1,
    OPERATOR: 2
}

SolvingOrder = {
    END_OF_EQUATION: -2,

    ADDITION: 0,
    SUBTRACTION: 0,

    DIVISION: 1,
    MULTIPLICATION: 1,
    MODULO: 1,

    POWER: 2,

}

function evaluateMathematicalExpression(expressionString) {
    let lexedTuple = lexExpression(expressionString);

    if (!checkRules(lexedTuple)) {
        return false;
    } else {
        return true;
    }
}

function lexExpression(exprString) {
    var operators = '+-*/^';
    var numbers = '0123456789.';
    var brace = '()';

    var type = TypeEnum.NONE;
    var string = '';
    var lexList = [];

    for (var i = 0; i < exprString.length; i++) {
        for (var a = 0; a < operators.length; a++) {
            if (exprString[i] == operators[a]) {
                if (string != '') {
                    lexList.push({
                        type,
                        string
                    });
                }

                type = TypeEnum.OPERATOR;

                lexList.push({
                    type,
                    string: exprString[i]
                })

                string = '';

                if (i + 1 == exprString.length && string != '') {
                    lexList.push({
                        type,
                        string
                    });
                }
            }
        }

        for (var a = 0; a < numbers.length; a++) {
            if (exprString[i] == numbers[a]) {
                if (type == TypeEnum.NUMBER) {
                    string += exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push({
                            type,
                            string
                        });
                    }

                } else {
                    if (string != '') {
                        lexList.push({
                            type,
                            string
                        });
                    }

                    type = TypeEnum.NUMBER;

                    string = exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push({
                            type,
                            string
                        });
                    }
                }
            }
        }

        for (var a = 0; a < brace.length; a++) {
            if (exprString[i] == brace[a]) {
                if (type == TypeEnum.BRACE) {
                    lexList.push({
                        type,
                        string
                    });
                    string = exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push({
                            type,
                            string
                        });
                    }

                } else {
                    if (string != '') {
                        lexList.push({
                            type,
                            string
                        });
                    }

                    type = TypeEnum.BRACE;

                    string = exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push({
                            type,
                            string
                        });
                    }
                }
            }
        }
    }

    console.log(lexList);

    if (lexList.length == 0) {
        console.log("String is empty")

        return null;
    }

    return lexList;
}

function checkRules(exprTuple) {
    // Proves that the input string is a legit mathematical string

    // 1. A Maximum of 2 operators after each other,
    // but only if the second operator is a minus
    let lastlastType = TypeEnum.NONE;
    let lastType = TypeEnum.NONE;
    let currentType = TypeEnum.NONE;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        lastlastType = lastType;
        lastType = currentType;
        currentType = element.type;

        if (lastType == currentType && lastlastType == lastType) {
            return false;
        } else {
            if (currentType == lastType && lastlastType != lastType) {
                if (currentType != TypeEnum.OPERATOR) {
                    return false;
                }

                if (element.string != "-") {
                    return false;
                }
            }
        }
    }
    // !1 --------------------------------------------------


    // 2. No closing braces before the first opening brace
    let openBraceCount = null;

    exprTuple.forEach(element => {
        if (element.string == '(') {
            openBraceCount++;
        }

        if (element.string == ')') {
            openBraceCount--;
        }

        if (openBraceCount < 0) {
            // If the open brace count falls below zero a 
            // brace was closed that was never opened
            return false;
        }
    });

    if (openBraceCount != 0) {
        // If the open brace count is higher than zero 
        // when the loop has finished a brace 
        // that was opened was not closed
        return false;
    }
    // !2 --------------------------------------------------


    // 3. The first symbol can't be a Operator except '-' and '+'
    if (exprTuple[0].type == TypeEnum.OPERATOR && exprTuple[0].string != "-" && exprTuple[0].string != "+") {
        return false;
    }
    // !3 --------------------------------------------------


    // 4. A numeric must be followed by an operator 
    // if the numeric is not the last argument
    lastType = TypeEnum.NONE;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (exprTuple.length - 1 != index) {
            if (lastType == TypeEnum.NUMBER && (element.type != TypeEnum.OPERATOR && element.string != ')')) {
                return false;
            }
        } else {
            break;
        }

        lastType = element.type;
    }
    // !4 --------------------------------------------------

    // 5. If a numeric is not the first element a operator 
    // or a opening brace must be the element before
    lastType = TypeEnum.NONE;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (index >= 1) {
            if (element.type == TypeEnum.NUMBER && lastType != TypeEnum.OPERATOR) {
                if (exprTuple[index-1].string != '(') {
                    return false;
                }
            }
            lastType = element.type;
        } else {
            if (index == 1) {
                lastType = element.type;
            }
            continue;
        }
    }
    // !5 --------------------------------------------------

    // 6. The last element can't be a operator
    if (exprTuple[exprTuple.length-1].type == TypeEnum.OPERATOR) {
        return false;
    }
    // !6 --------------------------------------------------

    // 7. The first element in a brace can't 
    // be an operator except '+' or '-'
    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];
        
        if (element.string == '(' && exprTuple[index+1].type == TypeEnum.OPERATOR) {
            return false;
        }
    }
    // !7 --------------------------------------------------


    // 8. The element before a closing brace can't be an operator
    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];
        
        if (element.string == ')' && exprTuple[index-1].type == TypeEnum.OPERATOR) {
            return false;
        }
    }
    // !8 --------------------------------------------------
    return true;
}

console.log(evaluateMathematicalExpression("12 * ( 12 + 12.45) / 546"));