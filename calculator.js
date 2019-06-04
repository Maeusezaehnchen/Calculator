/*
Calculator.js;
Version: V1.0
Author: Sebastian Kern
Git: https://github.com/Maeusezaehnchen/Calculator

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

function evaluateMathematicalExpression(expressionString) {

    if (expressionString == '') {
        return -1;
    } else {
        var lexList = lexExpression(expressionString);

        if (lexList == -1) {
            return -1;
        }

        var parsedList = parseLexedList(lexList);

        try {
            var valueOfEquation = solveParsedExpression(parsedList);
            if (valueOfEquation == -1) {
                return -1;
            }
            return valueOfEquation;
        } catch (err) {
            return -1;
        }

    }
};

function lexExpression(exprString) {
    
    var operators = '+-*/^';
    var numbers = '0123456789';
    var brace = '()';

    var openBraces = 0;

    var lastType = TypeEnum.NONE;
    var currentString = '';
    var lexList = [];

    for (var i = 0; i < exprString.length; i++) {

        for (var a = 0; a < operators.length; a++) {
            if (exprString[i] == operators[a]) {
                if (lastType == TypeEnum.OPERATOR) {
                    return -1;
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
        if (confirm("Eine Klammer wurde nicht geschlossen! Möchten Sie fortfahren?")) {
            return -1;
        }
    }

    if (openBraces < 0) {
        if (confirm("Eine Klammer wurde umsonst geschlossen! Möchten Sie fortfahren?")) {
            return -1;
        }
    }

    if (lexList.length == 0) {
        return -1;
    }

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
            // console.log(lexList[i] + " Contains operator!");

            currentOperator = lexList[i];

            parsedList.push({currentNumeric, currentOperator})
            currentNumeric = '';
            currentOperator = '';
        }

        if (numbers.includes(lexList[i][0])) {
            // console.log(lexList[i] + " Contains number!");

            currentNumeric = lexList[i];

            if (i + 1 == lexList.length) {
                currentOperator = '//';

                parsedList.push({currentNumeric, currentOperator})
            }
        }

        if (brace.includes(lexList[i][0])) {
            // console.log(lexList[i] + " Contains bracket!");

            if (lexList[i][0] == "(") {
                currentNumeric = '';
            }
        
            currentOperator = lexList[i];

            parsedList.push({currentNumeric, currentOperator})
            currentNumeric = '';
            currentOperator = '';
        }
    }

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

    while (!isSolved) {
        console.log("---------------------------------------");

        if (tmpList.length == 1) {
            console.log("solved");
            return tmpList[0].currentNumeric;
        } else {
            if (tmpList.length == 1) {
                return tmpList[0].currentNumeric;
            } else {
                var returnVal = 0;
                
                operatorIndex = getFirstHighestRankedOperator(tmpList, 0);

                returnVal = solveAtIndex(tmpList, operatorIndex);

                if (returnVal == -1) {
                    return -1;
                }

                console.log("Last: " + returnVal.last);

                console.log(tmpList.splice(returnVal.last, returnVal.next - returnVal.last + 1));
                console.log(tmpList.splice(returnVal.last, 0, {currentNumeric: returnVal.result, currentOperator: returnVal.operator}));
                console.log(tmpList.join());
            }

            console.log(tmpList);
        }
    }
    console.log("solved");
    return tmpList[0].currentNumeric;
}

function solveAtIndex(parsedList, index) {

    console.log(index);

    var result = 0;
    var left_operator = parsedList[getNextNumeric(parsedList, index)].currentOperator;

    var number1 = Number(parsedList[getLastNumeric(parsedList, index)].currentNumeric);
    var number2 = Number(parsedList[getNextNumeric(parsedList, index)].currentNumeric);

    var operator = parsedList[index].currentOperator;

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

    console.log("Computing: " + number1 + operator + number2);

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
                return -1;
            } else {
                result = number1 / number2;
            }
            break;
        case '^':
            result = Math.pow(number1, number2); 
            break;
        case ')':
        
            return solveAtIndex(parsedList, index - 1);
        case '(':
            if (index - 1 <= 0) {
                result = number2;
            } else {
                return solveAtIndex(parsedList, index - 1);
            }
        case '//':
            break;
        default:
            return -1;
    }

    return {result: result, 
            operator: left_operator,
            last: getLastNumeric(parsedList, index), 
            next: getNextNumeric(parsedList, index)};
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
        if (compareOperator(parsedList[currentIndex].currentOperator, parsedList[currentIndex + 1].currentOperator)) {
            if (parsedList[currentIndex].currentOperator == "(") {
                return getFirstHighestRankedOperator(parsedList, currentIndex + 1)
            } else {
                return currentIndex;
            }
        } else {
            return getFirstHighestRankedOperator(parsedList, currentIndex + 1);
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
            return -1;
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
            return -1;
    }

    if (op1Val < op2Val) {
        return false;
    } else {
        return true;
    }
}