class Calculator {
    constructor(previousOperandText, currentOperandText) {
        this.previousOperandText = previousOperandText
        this.currentOperandText = currentOperandText
        this.clear()
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }
    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return
        this.currentOperand = this.currentOperand.toString() + number.toString()
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return
        if (this.previousOperand !== '') {
            this.compute()
        }
        this.operation = operation
        this.previousOperand = this.currentOperand
        this.currentOperand = ''
    }

    compute() {
        let computation
        const prev = parseFloat(this.previousOperand)
        const current = parseFloat(this.currentOperand)
        if (isNaN(prev) || isNaN(current)) return

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
        this.currentOperand = computation
        this.operatoin = undefined
        this.previousOperand = ''
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString()
        const integerDigits = parseFloat(stringNumber.split('.')[0])
        const decimalDigits = stringNumber.split('.')[1]
        let integerDisplay

        if (isNaN(integerDigits)) {
            integerDisplay = ''
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`
        } else {
            return integerDisplay
        }
    }

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


const numberBtns = document.querySelectorAll('[data-number]')
const operationBtns = document.querySelectorAll('[data-operation]')
const equalsBtn = document.querySelector('[data-equals]')
const deleteBtn = document.querySelector('[data-delete]')
const allClearBtn = document.querySelector('[data-all-clear]')
const previousOperandText = document.querySelector('[data-previous-operand]')
const currentOperandText = document.querySelector('[data-current-operand]')

const calculator = new Calculator(previousOperandText, currentOperandText)
let complete = false

numberBtns.forEach(button => {
    button.addEventListener('click', () => {
        if (!complete) {
            calculator.appendNumber(button.innerText)
            calculator.updateDisplay()
        }
    })
})

operationBtns.forEach(button => {
    button.addEventListener('click', () => {
        complete = false
        calculator.chooseOperation(button.innerText)
        calculator.updateDisplay()
    })
})

equalsBtn.addEventListener('click', () => {
    complete = true
    calculator.compute()
    calculator.updateDisplay()
})

allClearBtn.addEventListener('click', () => {
    complete = false
    calculator.clear()
    calculator.updateDisplay()
})

deleteBtn.addEventListener('click', () => {
    if (complete) {
        calculator.clear()
        calculator.updateDisplay()
    } else {
        calculator.delete()
        calculator.updateDisplay()
    }

})