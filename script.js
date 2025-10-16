class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.isErrorState = false;
        this.updateDisplay();
    }

    backspace() {
        if (this.isErrorState) return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.isErrorState) return;
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand += number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.isErrorState) return;
        if (this.currentOperand === '' && this.previousOperand !== '') {
             this.operation = operation;
             return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }

        if (operation === '%') {
             this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
             return;
        }

        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        if (this.isErrorState) return;
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+': computation = prev + current; break;
            case '-': computation = prev - current; break;
            case '×': computation = prev * current; break;
            case '÷':
                if (current === 0) {
                    this.displayError("Nie dziel przez 0");
                    return;
                }
                computation = prev / current;
                break;
            default: return;
        }

        this.currentOperand = Math.round(computation * 1000000) / 1000000;
        this.operation = undefined;
        this.previousOperand = '';
    }

    displayError(message) {
        this.isErrorState = true;
        this.currentOperand = message;
        this.previousOperand = '';
        this.operation = undefined;
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = this.currentOperand;
        if (this.operation != null && !this.isErrorState) {
            this.previousOperandTextElement.innerText = `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener('click', () => {
    calculator.compute();
    calculator.updateDisplay();
});

allClearButton.addEventListener('click', () => {
    calculator.clear();
});

deleteButton.addEventListener('click', () => {
    calculator.backspace();
    calculator.updateDisplay();
});
