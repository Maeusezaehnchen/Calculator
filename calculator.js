/*
Calculator.js;
Version: V1.0
Author: Sebastian Kern
Git: https://github.com/Maeusezaehnchen/Calculator

License:

MIT License

Copyright (c) 2019 Maeusezaehnchen

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
}

function lexExpression(exprString) {
    var operators = '+-*/^';
    var numbers = '0123456789.';
    var brace = '()';

    var lastType = TypeEnum.NONE;
    var string = '';
    var lexList = [];

    for (var i = 0; i < exprString.length; i++) {
        for (var a = 0; a < operators.length; a++) {
            if (exprString[i] == operators[a]) {
                if (string != '') {
                    console.log(lastType, string);
                    lexList.push({lastType, string});
                }

                lastType = TypeEnum.OPERATOR;

                console.log(lastType, exprString[i]);
                lexList.push({lastType, string: exprString[i]})

                string = '';

                if (i + 1 == exprString.length && string != '') {
                    console.log(lastType, string);
                    lexList.push({lastType, string});
                }
            }
        }

        for (var a = 0; a < numbers.length; a++) {
            if (exprString[i] == numbers[a]) {
                if (lastType == TypeEnum.NUMBER) {
                    string += exprString[i];

                    if (i + 1 == exprString.length) {
                        console.log(lastType, string);
                        lexList.push({lastType, string});
                    }

                } else {
                    if (string != '') {
                        console.log(lastType, string);
                        lexList.push({lastType, string});
                    }

                    lastType = TypeEnum.NUMBER;

                    string = exprString[i];

                    if (i + 1 == exprString.length) {
                        console.log(lastType, string);
                        lexList.push({lastType, string});
                    }
                }
            }
        }

        for (var a = 0; a < brace.length; a++) {
            if (exprString[i] == brace[a]) {
                if (lastType == TypeEnum.BRACE) {
                    console.log(lastType, string);
                    lexList.push({lastType, string});
                    string = exprString[i];

                    if (i + 1 == exprString.length) {
                        console.log(lastType, string);
                        lexList.push({lastType, string});
                    }

                } else {
                    if (string != '') {
                        console.log(lastType, string);
                        lexList.push({lastType, string});
                    }

                    lastType = TypeEnum.BRACE;

                    string = exprString[i];

                    if (i + 1 == exprString.length) {
                        console.log(lastType, string);
                        lexList.push({lastType, string});
                    }
                }
            }
        }
    }

    if (lexList.length == 0) {
        return null;
    }

    return lexList;
}

function getAndSolveBrace(exprString) {
        let openBraceCounter = null;
        let startIndex = null;
        let endIndex = null;

        exprString = exprString.replace(/\s/g, "");

        for (let index = 0; index < exprString.length; index++) {
            const element = exprString[index];

            if (element == '(') {
                openBraceCounter++;

                console.log("Found '(' at index: " + index);

                if (openBraceCounter == 1) {
                    startIndex = index;
                }
            }

            if (element == ')') {
                openBraceCounter--;

                console.log("Found ')' at index: " + index);

                if (openBraceCounter == 0) {
                    endIndex = index;
                    break;
                }
            }
        }

        if (openBraceCounter == null) {
            // solveExpression(exprString);

            return 0;
        }

        if (openBraceCounter == 0) {
            // let result = getAndSolveBrace(exprString.splice(startIndex, endIndex - startIndex));
            // console.log(result);

            let dif = endIndex - startIndex;

            console.log("Startindex: " + startIndex);
            console.log("Endindex: " + endIndex);
            console.log("Difference: ", dif);

            console.log(exprString.slice(startIndex, dif));
            
            console.log(exprString);
        }
            
        if (openBraceCounter < 0) {
            return null;
        }

        if (openBraceCounter > 0) {
            return null;
        }
}

console.log(lexExpression("/"));