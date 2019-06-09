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

// TODO: Support for negative numbers

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
        return findBraceAndSolveIt(lexedTuple).string;
    }
}

function lexExpression(exprString) {
    var operators = '+-*/^';
    var numbers = '0123456789.';
    var brace = '()';

    var type = TypeEnum.NONE;
    var string = '';
    var lexList = [];

    exprString = exprString.replace(/\s/g,'');

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
    // Proves that the input string is a valid mathematical string

    if (exprTuple.length == 1 && exprTuple[0].type == TypeEnum.NUMBER) {
        return true;
    }

    // 1. A Maximum of 2 operators after each other,
    // but only if the second operator is a minus
    let lastlastType = TypeEnum.NONE;
    let lastType = TypeEnum.NONE;
    let currentType = TypeEnum.NONE;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        console.log(index);

        lastlastType = lastType;
        lastType = currentType;
        currentType = element.type;

        if (lastType == currentType && lastlastType == lastType) {
            if (currentType != TypeEnum.BRACE) {
                return false;
            }
        } else {
            if (currentType == lastType && lastlastType != lastType) {
                if (currentType != TypeEnum.OPERATOR && currentType != TypeEnum.BRACE) {
                    return false;
                }

                if (element.string != "-" && element.string != '(' && element.string != ')') {
                    return false;
                }
            }
        }
    }
    // !1 --------------------------------------------------

    console.log("Condition 1: true");

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

    if (openBraceCount != 0 && openBraceCount != null) {
        // If the open brace count is higher than zero 
        // when the loop has finished a brace 
        // that was opened was not closed
        return false;
    }
    // !2 --------------------------------------------------
    console.log("Condition 2: true");

    // 3. The first symbol can't be a Operator except '-' and '+'
    if (exprTuple[0].type == TypeEnum.OPERATOR && exprTuple[0].string != "-" && exprTuple[0].string != "+") {
        return false;
    }
    // !3 --------------------------------------------------
    console.log("Condition 3: true");

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
    console.log("Condition 4: true");


    // 5. If a numeric is not the first element a operator 
    // or a opening brace must be the element before
    lastType = TypeEnum.NONE;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (index >= 1) {
            if (element.type == TypeEnum.NUMBER && lastType != TypeEnum.OPERATOR) {
                if (exprTuple[index - 1].string != '(') {
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
    console.log("Condition 5: true");


    // 6. The last element can't be a operator
    if (exprTuple[exprTuple.length - 1].type == TypeEnum.OPERATOR) {
        return false;
    }
    // !6 --------------------------------------------------
    console.log("Condition 6: true");


    // 7. The first element in a brace can't 
    // be an operator except '+' or '-'
    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (element.string == '(' && exprTuple[index + 1].type == TypeEnum.OPERATOR) {
            if (!(exprTuple[index + 1].string == '-' || exprTuple[index + 1].string == '+')) {
                return false;
            }
        }
    }
    // !7 --------------------------------------------------
    console.log("Condition 7: true");

    // 8. The element before a closing brace can't be an operator
    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (element.string == ')' && exprTuple[index - 1].type == TypeEnum.OPERATOR) {
            return false;
        }
    }
    // !8 --------------------------------------------------
    console.log("Condition 8: true");


    // If no other of the listed cases are false the input must be valid
    return true;
}

function findBraceAndSolveIt(exprTuple) {
    console.log("Solving:");
    console.log(exprTuple);

    let openBraceCounter = null;
    let startIndex = null;
    let endIndex = null;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (element.string == '(') {
            if (openBraceCounter == null) {
                startIndex = index;
            }

            openBraceCounter++;
        }

        if (element.string == ')') {
            if (openBraceCounter == 1) {
                endIndex = index;
            }

            openBraceCounter--;
        }

        if (openBraceCounter == 0) {
            break;
        }
    }

    if ((startIndex == null && endIndex != null) || (startIndex != null && endIndex == null)) {
        // Should be catched within the checkRules() function but Yolo
        return false;
    }


    if (startIndex == null && endIndex == null) {
        // If the loop didn't find a matching pair of braces
        // the tuple doesn't contain one and can be solved

        console.log("Solving because no brace found!")
        console.log(exprTuple);

        console.log("Resolved: ")
        let res = solveTupleWithoutBraces(exprTuple)

        console.log("Returning: ");
        console.log(res);

        return res;
    } else {
        // The loop found a matching pair of
        // braces and solves them recursively

        let tmpTuple = Array.from(exprTuple);

        console.log("Recursively solving: ")
        console.log(tmpTuple);
        console.log("Solving from: " + startIndex + " to " + endIndex);

        let toBeSolved = tmpTuple.splice(startIndex, endIndex-startIndex+1);
        toBeSolved.splice(0, 1); // Delete the first brace
        toBeSolved.splice(toBeSolved.length-1, 1); // Delete the last brace

        console.log("This will be solved!")
        console.log(toBeSolved);

        let res = findBraceAndSolveIt(toBeSolved);

        tmpTuple = exprTuple;

        console.log("Current exprTuple: ")
        console.log(exprTuple);

        console.log("Replacing:");
        console.log(tmpTuple.splice(startIndex, endIndex-startIndex+1, res));

        console.log("Inserted:")
        console.log(tmpTuple);

        return findBraceAndSolveIt(tmpTuple);
    }
}

function solveTupleWithoutBraces(exprTuple) {
    let parsedTuple = convertLexedToParsedForm(exprTuple);

    let isSolved = false;

    if (parsedTuple.length == 1) {
        console.log()
        return {type: TypeEnum.NUMBER, string: String(exprTuple[0].string)};
    }

    if (parsedTuple.length < 1) {
        return false;
    }

    while (!isSolved) {
        let index = getFirstHighestRankedOperator(parsedTuple, 0);

        let index_result = solveAtIndex(parsedTuple, index);

        console.log(index_result);
        
        parsedTuple.splice(index, 2, {numeric: index_result[0].string, operator: index_result[1].string});
    
        if (parsedTuple.length == 1) {
            return index_result[0];
        }
    }
}

function convertLexedToParsedForm(exprTuple) {
    let numeric = null;
    let operator = null;

    let parsedList = [];

    // Allows to generate negative numbers 
    // from the possible second operator
    let lastType = TypeEnum.NONE;

    for (let index = 0; index < exprTuple.length; index++) {
        const element = exprTuple[index];

        if (element.type == TypeEnum.NUMBER) {
            if (lastType == TypeEnum.NUMBER) {
                numeric += element.string;
            } else {
                numeric = element.string;
            }

            if (index + 1 == exprTuple.length) {
                operator = '//';

                parsedList.push({
                    numeric,
                    operator
                })
            }

            lastType = TypeEnum.NUMBER;
        }

        if (element.type == TypeEnum.OPERATOR) {
            

            if (lastType == TypeEnum.OPERATOR) {
                // The second operator must be minus
                numeric = element.string;

                lastType = TypeEnum.NUMBER;
            } else {
                operator = element.string;

                parsedList.push({
                    numeric,
                    operator
                })
    
                lastType = TypeEnum.OPERATOR;
            }
        }
    }
    return parsedList;
}

function getFirstHighestRankedOperator(parsedTuple, index) {
    if (!(parsedTuple.length - 1 > index)) {
        if (index <= 1) {
            return 0;
        } else {
            return index - 1;
        }
    } else {
        if (compareOperator(parsedTuple[index].operator, parsedTuple[index + 1].operator)) {
            return index;
        } else {
            return getFirstHighestRankedOperator(parsedTuple, index + 1);
        }
    }
}

function solveAtIndex(parsedTuple, index) {

    let number1 = Number(parsedTuple[index].numeric);
    let number2 = Number(parsedTuple[index + 1].numeric);
    let operator = parsedTuple[index].operator;

    let result = null;
    let left_operator = parsedTuple[index + 1].operator;

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
                result = null;
            } else {
                result = number1 / number2;
            }
            break;
        case '^':
            result = Math.pow(number1, number2);
            break;
        default:
            break;
    }


    return [{type: TypeEnum.NUMBER, string: String(result)}, {type: TypeEnum.OPERATOR, string: String(left_operator)}];
}

function compareOperator(operator1, operator2) {
    let op1Val;
    let op2Val;

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
        case '//':
            op1Val = SolvingOrder.END_OF_EQUATION;
            break;
        default:
            return null;
    }

    switch (operator2) {
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
        case '//':
            op1Val = SolvingOrder.END_OF_EQUATION;
            break;
        default:
            return null;
    }

    if (op1Val < op2Val) {
        return false;
    } else {
        return true;
    }
}

console.log(evaluateMathematicalExpression("2 ^ 8 "))