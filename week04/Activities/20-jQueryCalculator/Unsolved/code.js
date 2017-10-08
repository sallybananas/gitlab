$(document).ready(function () {
    var result = 0;
    var currentNumber = '0';
    var operation = null;
    var prevNumber = 0;
    updateScreen(result);
    var toReset = false

    $('.btn').on('click', function (evt) {
        var buttonPressed = $(this).text();
        console.log(buttonPressed, toReset);

        if (buttonPressed === "clear") {
            result = 0;
            currentNumber = '0';
        } else if (isNumber(buttonPressed)) {
            if (toReset === true) {
                console.log("first", toReset);
                result = 0;
                currentNumber = '0';
                toReset = false;
                console.log(toReset)
            }

                if (currentNumber === '0') currentNumber = buttonPressed;
                else currentNumber = currentNumber + buttonPressed;
        } else if (isOperator(buttonPressed)) {
            prevEntry = parseFloat(currentNumber);
            operation = buttonPressed;
            currentNumber = '';

        } else if (buttonPressed === '=') {
            currentNumber = operate(prevEntry, currentNumber, operation);
            operation = null;
            toReset = true;
        }

        updateScreen(currentNumber);
    });
});

updateScreen = function (displayValue) {
    var displayValue = displayValue.toString();
    $('.result').text(displayValue.substring(0, 10));
};

isNumber = function (value) {
    return !isNaN(value);
}

isOperator = function (value) {
    return value === '/' || value === '*' || value === '+' || value === '-';
};

operate = function (a, b, operation) {
    a = parseFloat(a);
    b = parseFloat(b);

    console.log(a, b, operation);
    if (operation === '+') return a + b;
    if (operation === '-') return a - b;
    if (operation === '*') return a * b;
    if (operation === '/') return a / b;
}