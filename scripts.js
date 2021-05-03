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

const Transaction = {

    all:[{
        description: 'Luz',
        amount: -500,
        date: '23/01/2021'
    },{
        description: 'Site',
        amount: 550,
        date: '23/01/2021'
    },{
        description: 'Internet',
        amount: -2000,
        date: '23/01/2021'
    },{
        description: 'Papel',
        amount: -200,
        date: '23/01/2021'
    }],

    add(transaction) {
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index) {
        Transctions.all.splice(index, 1)

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

    addTransaction(transaction){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction){
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'
        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <a href="#"
            onclick="Transaction.remove()"
            img src="./assets/minus.svg" alt="Remover Transação">
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
 
    createClassCardTotal(tag, transactionsTotal){
        let tagClass = document.createAttribute('class')
        const CSSclass = transactionsTotal > 0 ? 'positive' : 'negative'
        
        tagClass.value = `card-total ${CSSclass}`
        tag.setAttributeNode(tagClass)
    },
            
    innerHTMLCardTotal(transactionsTotal){
        const CSSclass = transactionsTotal > 0 ? 'income' : 'expense'
        const displayStatus = transactionsTotal > 0 ? 'Positivo' : 'Negativo'
        
        const html = `
            <div class="box">
                <h3>
                    <span>Saldo ${displayStatus}</span>
                    <img src="./assets/${CSSclass}.svg" alt="Ícone de Saldo ${displayStatus}">
                </h3>
                <p id="totalDisplay">R$ 3.000</p>
            </div>
            `   
        return html
    },

    updateBalance() {

/*         DOM.addCardTotal(Transaction.total())
 */
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.income())

        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expense())
        
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils. formatCurrency(Transaction.total())
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
    }
}


const App = { 
    init() {

        DOM.addCardTotal(Transaction.total())

        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })

        DOM.updateBalance()
    },

    reload() {
        DOM.clearTransactions()

        App.init()
    },
}

App.init()

Transaction.add({
    description: "OI",
    amount: 200,
    date: "23/01/2021",
})
