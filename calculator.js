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
    OPERATOR: 2,
}

SolvingOrder = {
    END_OF_EQUATION: -2,

    RIGHT_BRACE: -1,

    ADDITION: 0,
    SUBTRACTION: 0,

    DIVISION: 1,
    MULTIPLICATION: 1,

    POWER: 2,
    MODULO: 2,

    LEFT_BRACE: 3
}

CalculationErrors = {
    DivisionTroughNull: "Division trough zero is not allowed!",
    BraceNotClosed: "A Brace is not closed!",
    BraceClosed: "A Brace was closed but never opened!",
    InternalError: "A Internal error occurred!",
    NoArgumentsGiven: "Couldn't recognize any arguments!",
}

function evaluateMathematicalExpression(expressionString) {

    if (expressionString == '') {
        throw CalculationErrors.NoArgumentsGiven;
    } else {
        try {
            var lexList = lexExpression(expressionString);
        } catch (err) {
            throw err;
        }

        try {
            var parsedList = parseLexedList(lexList);
        } catch (err) {

        }
        
        try {
            var valueOfEquation = solveParsedExpression(parsedList);
            return valueOfEquation;
        } catch (err) {
            throw err;
        }

    }
};

function lexExpression(exprString) {
    var operators = '+-*/^';
    var numbers = '0123456789.';
    var brace = '()';

    var openBraces = 0;

    var lastType = TypeEnum.NONE;
    var currentString = '';
    var lexList = [];

    exprString = exprString.replace(/\s/g,'');

    for (var i = 0; i < exprString.length; i++) {
        for (var a = 0; a < operators.length; a++) {

            if (exprString[i] == operators[a]) {
                if (lastType == TypeEnum.OPERATOR) {
                    if (exprString[i] == '-') {
                        console.log("Negative Number detected!")

                        lastType = TypeEnum.NUMBER;

                        if (currentString != '') {
                            lexList.push(currentString);
                        }

                        currentString = '';
                        currentString += exprString[i];

                        console.log("Appended")

                        /* 
                        if (i + 1 == exprString.length) {
                            console.log("Length reached!")
                            return -1;
                        }
                        */
                    }
                } else {
                    lastType = TypeEnum.OPERATOR;

                    if (currentString != '') {
                        lexList.push(currentString);
                    }

                    lexList.push(exprString[i])

                    currentString = '';

                    if (i + 1 == exprString.length) {
                        lexList.push(currentString);
                    }
                }
            }
        }

        for (var a = 0; a < numbers.length; a++) {
            if (exprString[i] == numbers[a]) {
                if (lastType == TypeEnum.NUMBER) {
                    currentString += exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push(currentString);
                    }

                } else {
                    lastType = TypeEnum.NUMBER;

                    if (currentString != '') {
                        lexList.push(currentString);
                    }

                    currentString = exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push(currentString);
                    }
                }
            }
        }

        for (var a = 0; a < brace.length; a++) {
            if (exprString[i] == brace[a]) {
                if (lastType == TypeEnum.BRACE) {
                    lexList.push(currentString);
                    currentString = exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push(currentString);
                    }

                } else {
                    lastType = TypeEnum.BRACE;

                    if (currentString != '') {
                        lexList.push(currentString);
                    }

                    currentString = exprString[i];

                    if (i + 1 == exprString.length) {
                        lexList.push(currentString);
                    }
                }
            }

            if (exprString[i] == '(') {
                openBraces++;
            }

            if (exprString[i] == ')') {
                openBraces--
            }
        }
    }

    if (openBraces > 0) {
        throw CalculationErrors.BraceNotClosed;
    }

    if (openBraces < 0) {
        throw CalculationErrors.BraceClosed;
    }

    if (lexList.length == 0) {
        throw CalculationErrors.NoArgumentsGiven;
    }

    console.log("---------------------------------------");
    console.log("Lexing finished...")
    console.log(lexList);
    return lexList;
}

function parseLexedList(lexList) {

    var operators = '+-*/^';
    var numbers = '0123456789';
    var brace = '()';

    var parsedList = [];

    var currentNumeric = '';
    var currentOperator = '';

    for (var i = 0; i < lexList.length; i++) {
        if (operators.includes(lexList[i][0])) {
            if (lexList[i][0] == '-' && lexList[i].length > 1) {
                // For support of negative numerics

                currentNumeric = lexList[i];

                if (i + 1 == lexList.length) {
                    currentOperator = '//';

                    console.log("Pushing: " + currentNumeric + " and " + currentOperator + " to parse list...");
                    parsedList.push({
                        currentNumeric,
                        currentOperator
                    });
                }
            } else {
                currentOperator = lexList[i];
                parsedList.push({
                    currentNumeric,
                    currentOperator
                })
                currentNumeric = '';
                currentOperator = '';
            }
        }

        if (numbers.includes(lexList[i][0])) {
            // For support of positive numerics

            currentNumeric = lexList[i];

            if (i + 1 == lexList.length) {
                currentOperator = '//';

                parsedList.push({
                    currentNumeric,
                    currentOperator
                })
            }
        }

        if (brace.includes(lexList[i][0])) {
            // For support of braces

            if (lexList[i][0] == "(") {
                currentNumeric = '';
            }

            currentOperator = lexList[i];

            parsedList.push({
                currentNumeric,
                currentOperator
            })
            currentNumeric = '';
            currentOperator = '';
        }
    }

    console.log("---------------------------------------");
    console.log("Parsing finished...");

    console.log(parsedList);
    return parsedList;
}

function solveParsedExpression(parsedList) {

    var tmpList = parsedList;
    var operatorIndex = null;

    if (parsedList.length <= 1) {
        var isSolved = true
    } else {
        var isSolved = false;
    }

    counter = 0;

    while (!isSolved) {
        counter++;
        console.log("---------------------------------------");
        console.log(counter + ". passing...");

        if (tmpList.length == 1) {
            console.log("Expression solved");
            return tmpList[0].currentNumeric;
        } else {
            if (tmpList.length == 1) {
                return tmpList[0].currentNumeric;
            } else {
                var returnVal = 0;

                operatorIndex = getFirstHighestRankedOperator(tmpList, 0);

                try {
                    returnVal = solveAtIndex(tmpList, operatorIndex);
                } catch (err) {
                    throw err;
                }

                console.log("Solved elements from: " + returnVal.last + " to " + returnVal.next);

                console.log(tmpList.splice(returnVal.last, returnVal.next - returnVal.last + 1));
                console.log(tmpList.splice(returnVal.last, 0, {
                    currentNumeric: returnVal.result,
                    currentOperator: returnVal.operator
                }));
                console.log(tmpList.join());
            }

            console.log(tmpList);
        }
    }
    console.log("Expression solved...");
    return tmpList[0].currentNumeric;
}

function solveAtIndex(parsedList, index) {

    console.log("Solving at index: " + index);

    var result = 0;
    var left_operator = parsedList[getNextNumeric(parsedList, index)].currentOperator;

    console.log("Converting string to number...");

    try {
        var number1 = Number(parsedList[getLastNumeric(parsedList, index)].currentNumeric);
        var number2 = Number(parsedList[getNextNumeric(parsedList, index)].currentNumeric);
    } catch (err) {
        throw err;
    }
    
    console.log("Number 1: " + number1);
    console.log("Number 2: " + number2);

    var operator = parsedList[index].currentOperator;

    console.log("Operator: " + operator);

    var index_cpy = index

    if (operator == '(') {
        while (operator == '(' && index_cpy > 0) {
            console.log(index_cpy);
            operator = parsedList[index_cpy].currentOperator;
            index_cpy--;
        }

        if (!(index_cpy > 0)) {
            operator = parsedList[0].currentOperator;
        }
    }

    if (operator == ')') {
        while (operator == ')' && index_cpy > 0) {
            console.log(index_cpy);
            operator = parsedList[index_cpy].currentOperator;
            index_cpy--;
        }

        if (!(index_cpy > 0)) {
            operator = parsedList[0].currentOperator;
        }
    }

    console.log("Computing: " + number1 + " " + operator + " " + number2);

    switch (operator) {
        case '+':
            result = number1 + number2;
            break;
        case '-':
            result = number1 - number2;
            break;
        case '*':
            result = number1 * number2;
            break;
        case '/':
            if (number2 == 0) {
                throw CalculationErrors.DivisionTroughNull;
            } else {
                result = number1 / number2;
            }
            break;
        case '^':
            result = Math.pow(number1, number2);
            break;
        case ')':
            try {
                return solveAtIndex(parsedList, index - 1);
            } catch (err) {
                throw err;
            }
            
        case '(':
            if (index - 1 <= 0) {
                result = number2;
            } else {
                try {
                    return solveAtIndex(parsedList, index - 1);
                } catch (err) {
                    throw err;
                }
            }
        case '//':
            break;
        default:
            throw CalculationErrors.InternalError;
    }

    console.log("Result is: " + result);
    try {

    } catch (err) {
        throw err;
    }
    var next = getNextNumeric(parsedList, index);
    var last = getLastNumeric(parsedList, index);

    return {
        result: result,
        operator: left_operator,
        last: last,
        next: next
    };
}

function getNextNumeric(parsedList, start_at_index) {

    for (let index = start_at_index + 1; index < parsedList.length; index++) {
        if (parsedList[index].currentNumeric != '') {
            return index;
        }
    }

    return false;
}

function getLastNumeric(parsedList, end_at_index) {

    var lastIndex = null;

    for (let index = 0; index <= end_at_index; index++) {
        if (parsedList[index].currentNumeric != '') {
            lastIndex = index;
        }
    }

    if (lastIndex < 0 || lastIndex == null) {
        return 0;
    }

    return lastIndex;
}

function getFirstHighestRankedOperator(parsedList, currentIndex) {
    console.log("Trying index: " + currentIndex);

    if (!(parsedList.length - 1 > currentIndex)) {
        if (currentIndex <= 1) {
            return 0;
        } else {
            return currentIndex - 1;
        }
    } else {
        try {
            if (compareOperator(parsedList[currentIndex].currentOperator, parsedList[currentIndex + 1].currentOperator)) {
                if (parsedList[currentIndex].currentOperator == "(") {
                    return getFirstHighestRankedOperator(parsedList, currentIndex + 1)
                } else {
                    return currentIndex;
                }
            } else {
                return getFirstHighestRankedOperator(parsedList, currentIndex + 1);
            }
        } catch (err) {
            throw err;
        }
    }
}

function compareOperator(operator1, operator2) {

    var op1Val;
    var op2Val;

    switch (operator1) {
        case '+':
            op1Val = SolvingOrder.ADDITION;
            break;
        case '-':
            op1Val = SolvingOrder.SUBTRACTION;
            break;
        case '*':
            op1Val = SolvingOrder.MULTIPLICATION;
            break;
        case '/':
            op1Val = SolvingOrder.DIVISION;
            break;
        case '^':
            op1Val = SolvingOrder.POWER;
            break;
        case '(':
            op1Val = SolvingOrder.LEFT_BRACE;
            break;
        case ')':
            op1Val = SolvingOrder.RIGHT_BRACE;
            break;
        case '//':
            op1Val = SolvingOrder.END_OF_EQUATION;
            break;
        default:
            throw CalculationErrors.InternalError;
    }

    switch (operator2[0]) {
        case '+':
            op2Val = SolvingOrder.ADDITION;
            break;
        case '-':
            op2Val = SolvingOrder.SUBTRACTION;
            break;
        case '*':
            op2Val = SolvingOrder.MULTIPLICATION;
            break;
        case '/':
            op2Val = SolvingOrder.DIVISION;
            break;
        case '^':
            op2Val = SolvingOrder.POWER;
            break;
        case '(':
            op2Val = SolvingOrder.LEFT_BRACE;
            break;
        case ')':
            op2Val = SolvingOrder.RIGHT_BRACE;
            break;
        case '//':
            op1Val = SolvingOrder.END_OF_EQUATION;
            break;
        default:
            throw CalculationErrors.InternalError;
    }

    if (op1Val < op2Val) {
        console.log("Compared Operator: '" + operator1 + "' and Operator: '" + operator2 + "' :: '" + operator2 + "' is higher");
        return false;
    } else {
        console.log("Compared '" + operator1 + "' and '" + operator2 + "' -> '" + operator1 + "' is higher");
        return true;
    }
}

console.log(evaluateMathematicalExpression("2 ^ 8 "))