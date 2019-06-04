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

function evaluateMathematicalExpression() {
    // Definiert den grundlegenden Programmablauf

    var expression = document.getElementById('in').value;

    if (expression == '') {
        alert("Bitte geben Sie einen mathematischen Ausdruck ein!");
    } else {
        var lexList = lexExpression(expression);

        if (lexList == -1) {
            return -1;
        }

        var parsedList = parseLexedList(lexList);

        try {
            var valueOfEquation = solveParsedExpression(parsedList);
            document.getElementById('out').innerHTML = valueOfEquation;
        } catch (err) {
            document.getElementById('out').innerHTML = err.message;
        }
        
    }
    
};

function lexExpression(exprString) {
    // Konvertiert string mit einem mathematischen Asudruck
    // in eine Liste von zugehörigen Zeichenfolgen
    // Bsp: '562 / (789 + 45)' -> ['562', '/', '(', '789', '+', '45', ')']
    
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
                    alert("Es sind keine zwei aufeinander folgenden Operatoren erlaubt!");
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
        alert("Kein mathematischer Ausdruck erkannt!");
        return -1;
    }

    console.log(lexList);
    return lexList;
}

function parseLexedList(lexList) {
    // Konvertiert die gelexte Liste in eine geparste Liste

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
    // Löst die geparste Gleichung

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
    // Löst eine Teilgleichung an der Stelle der 
    // Liste sie durch index festgelegt wird

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
                alert("Durch 0 teilen ist nicht erlaubt!")
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
            alert("An Error occured while computing expression!");
            break;
    }

    return {result: result, 
            operator: left_operator,
            last: getLastNumeric(parsedList, index), 
            next: getNextNumeric(parsedList, index)};
}

function getNextNumeric(parsedList, start_at_index) {
    // Gibt den nächsten definierten numerischen Wert zurück 

    for (let index = start_at_index + 1; index < parsedList.length; index++) {
        if (parsedList[index].currentNumeric != '') {
            return index;
        }
    }

    return false;
}

function getLastNumeric(parsedList, end_at_index) {
    // Gibt den letzten vorherigen numerischen Wert zurück

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
    // Gibt die Stelle mit dem Operator 
    // der am höchsten gerankt ist zurück
    
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
    // Gibt True zurück wenn operator1 den höheren Wert hat und False wenn operator2 größer ist
    // Bei gleichem Wert wird True zurückgegeben

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
            alert("An Error occured while trying to compare two operators");
            break;
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
            alert("An Error occured while trying to compare two operators");
            break;
    }

    if (op1Val < op2Val) {
        return false;
    } else {
        return true;
    }
}