const Modal = {
    open(){
        //abrir o Modal
        //Adicionar active na class input-group
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },

    close(){
        //Remover active da class input-group
        //fechar Modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')   
    }   
}

const BrowserStorage = {
    get() {
        return JSON.parse(localStorage.getItem("transactions")) || []
    },
    set(transaction) {
        localStorage.setItem("transactions", JSON.stringify(transaction))
    }
}

const Transaction = {

    all: BrowserStorage.get(),

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },

    income(){
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })

        return income;
    },

    expense(){
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })

        return expense;
    },

    total(){
        return Transaction.income() + Transaction.expense()
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    transactionsTotalContainer: document.querySelector('#balance2'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        
        DOM.transactionsContainer.appendChild(tr)
    },
    
    innerHTMLTransaction(transaction, index){

        const CSSclass = transaction.amount >= 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img 
            onclick="Transaction.remove(${index})" 
            src="./assets/minus.svg" 
            alt="Remover Transação">
        </td>
        `

        return html
    },

    addCardTotal(transactionsTotal){
        let div = document.createElement('div')
        DOM.createClassCardTotal(div, transactionsTotal)
        div.innerHTML = DOM.innerHTMLCardTotal(transactionsTotal)

        DOM.transactionsTotalContainer.appendChild(div)
    },
 
    createClassCardTotal(tag, total){
        let tagClass = document.createAttribute('class')
        const CSSclass = total >= 0 ? 'positive' : 'negative'
        
        tagClass.value = `card-total ${CSSclass}`
        tag.setAttributeNode(tagClass)
    },
            
    innerHTMLCardTotal(total){
        const fillGap = total >= 0 ? 
        {type:'income', outcome: 'Positivo'} : 
        {type:'expense', outcome: 'Negativo'}
        
        const html = `
            <div class="box">
                <h3>
                    <span>Saldo ${fillGap.outcome}</span>
                    <img src="./assets/${fillGap.type}.svg" alt="Ícone de Saldo ${fillGap.outcome}">
                </h3>
                <p id="totalDisplay">R$ 0,00</p>
            </div>
            `   
        return html
    },

    updateBalance() {

        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.income())

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense())
        
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
        DOM.transactionsTotalContainer.innerHTML = ""
    },
}

const Utils = {
   
    formatCurrency(value) {
        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return value
    },

    formatAmount(value, type) {
        value = Number(value) * 100
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return  `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ){
                throw new Error ('Por favor, preencha todos os campos.')
        }
    },

    getTransactionType() {
        let type = document.getElementsByName('transaction-type')

        for(i = 0; i < type.length; i++) {
            if(type[i].checked) {
                type = type[i]
                return type.value;             
            }
        }
    },
    formatValues() {
        let { description, amount, date } = Form.getValues()
        amount = Form.getTransactionType() === 'income'? 
        Utils.formatAmount(amount) : 
        (Utils.formatAmount(amount) * -1)
        date = Utils.formatDate(date)

        return { description, amount, date } 
    },

    clearFields() {

        Form.description.value = ''
        Form.amount.value = ''
        Form.date.value= ''
    },

    submit(event) {
        event.preventDefault()
        
        try{
            Form.validateFields()
            const transaction = Form.formatValues()
            Transaction.add(transaction)
            Form.clearFields()
            Modal.close()

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = { 
    init() {
        
        DOM.addCardTotal(Transaction.total())
        Transaction.all.forEach(DOM.addTransaction)
        DOM.updateBalance()
        BrowserStorage.set(Transaction.all)
        
        
    },

    reload() {
        DOM.clearTransactions()

        App.init()
    },
}

App.init()
