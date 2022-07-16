// Class for calculator 
class Calculator {
    constructor(previousOperandText, currentOperandText) {
        this.previousOperandText = previousOperandText
        this.currentOperandText = currentOperandText
        this.clear()
    }

    // clear() is called when AC button is pressed or DEL when operation is complete
    clear() {
        // screen will be cleared
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    // delete() is called when DEL button is pressed while the operation is not complete
    delete() {
        // delete the latest digit
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    // append the number as string when any of the number buttons are pressed
    appendNumber(number) {
        // if there already exists a '.', return
        if (number === '.' && this.currentOperand.includes('.')) return

        // append the string for number
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    // when operand buttons are pressed 
    chooseOperation(operation) {
        // if there is nothing typed up in the screen return
        if (this.currentOperand === '') return

        // if there are something typed up in both current and previous operand, compute so you can carry on with operation for the next
        if (this.previousOperand !== '') {
            this.compute()
        }

        // set operation and as computation is done, update the screen
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    // compute arithmetics
    compute() {
        // parse the strings into float to do computations
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)

        // if they're not typed up return
        if (isNaN(prev) || isNaN(current)) return

        // do the operation according to its symbols
        switch (this.operation) {
            case '+':
                computation = prev + current
                break
            case '-':
                computation = prev - current
                break
            case '×':
                computation = +parseFloat(prev * current).toFixed(8)
                break
            case '÷':
                computation = +parseFloat(prev / current).toFixed(8)
                break
            default:
                return
        }

        // update the operands for the screen to be updated
        this.currentOperand = computation
        this.operatoin = undefined
        this.previousOperand = ''
    }

    // to display the number (strings) in a more readable number format (commas)
    getDisplayNumber(number) {
        const stringNumber = number.toString()

        // divide the number in integer and decimal parts
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay

        // if the number if less than 1, display 0.something, otherwise toLocaleString
        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        // if the decimals are null, just display integer part, otherwise, concatenate them into a string
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

    // update the display
    updateDisplay() {
        if (this.currentOperand !== NaN)
            this.currentOperandText.innerText = this.getDisplayNumber(this.currentOperand)
        if (this.operation !== undefined && this.getDisplayNumber(this.previousOperand).length != 0) {
            this.previousOperandText.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
        } else {
            this.previousOperandText.innerText = ''
        }

    }
}

// variables for buttons and text divs
const numberBtns = document.querySelectorAll('[data-number]')
const operationBtns = document.querySelectorAll('[data-operation]')
const equalsBtn = document.querySelector('[data-equals]')
const deleteBtn = document.querySelector('[data-delete]')
const allClearBtn = document.querySelector('[data-all-clear]')
const previousOperandText = document.querySelector('[data-previous-operand]')
const currentOperandText = document.querySelector('[data-current-operand]')

// initialise a new calculator object
const calculator = new Calculator(previousOperandText, currentOperandText)

// this variable will make the UI more realistic, as it stops operations to continue when it's complete
let complete = false

// number buttons
numberBtns.forEach(button => {
    button.addEventListener('click', () => {
        // if the operation is complete, you can't type new numbers unless you press one of operands
        if (!complete) {
            calculator.appendNumber(button.innerText)
            calculator.updateDisplay()
        }
    })
})

// operation buttons
operationBtns.forEach(button => {
    button.addEventListener('click', () => {
        // when the operation is complete, by pressing the operation button will continue the operation with the given operands
        complete = false
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

// equals button to complete the operation
equalsBtn.addEventListener('click', () => {
    complete = true
    calculator.compute()
    calculator.updateDisplay()
})

// all clear restarts the operation
allClearBtn.addEventListener('click', () => {
    complete = false
    calculator.clear()
    calculator.updateDisplay()
})

// delete the latest digit, but if the operaion is complete, all clear
deleteBtn.addEventListener('click', () => {
    if (complete) {
        calculator.clear()
        calculator.updateDisplay()
    } else {
        calculator.delete()
        calculator.updateDisplay()
    }
})