
const Modal = {
    open(){
            //Abrir modal
            //Adicionar a class active ao modal
    document
      .querySelector('.modal-overlay')
      .classList.add('active')
    },
    
    close(){
            //fechar o modal
            //remoder a class active do modal
      document
        .querySelector('.modal-overlay')
        .classList.remove('active')
    }
}
const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
  },
  set(transactions) {
    localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))

  }
}

const Transaction = {
  all: Storage.get(),
  
  add(transaction){
    Transaction.all.push(transaction)

    App.reload()
  },

  remove(index){
    Transaction.all.splice(index, 1)

    App.reload()
  },

  incomes() {
    //Somar as entradas
    let income = 0;
    //pegar todas as transaçoes
    // para cada transação,
    Transaction.all.forEach(transaction =>{
      //se ela for maior que zero
      if(transaction.amount > 0){
        //somar a uma variavel e retornar a variavel
        income +=transaction.amount;
      }
    })
    return income;
  },
  expenses(){
    //somar as saidas
    let expense = 0;
    //pegar tods as transaçoes
    //para cada transaçao,
    Transaction.all.forEach(transaction =>{
      //se ela for menor que zero
      if(transaction.amount < 0){
        // somar a uma variavel e retorarna a variavel
        expense += transaction.amount;
      }
    })
    return expense;
  },
  total(){
    //entradas - saidas
    return Transaction.incomes() + Transaction.expenses();
  }
}

// pegar transaçoes do meu obj js e colocar no html

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),

  addTransaction(transaction, index){
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
    tr.dataset.index = index
    DOM.transactionsContainer.appendChild(tr)

  },
  innerHTMLTransaction(transaction, index){
    const CSSclass = transaction.amount > 0 ? "income" : "expense"
    const amount = Utils.formatCurrency(transaction.amount)



    const html = ` 
      <td class="description">${transaction.description}</td>
      <td class="${CSSclass}">${amount}</td>
      <td class="date">${transaction.date}</td>
      <td>
          <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remover transação" />
      </td>
  `
  return html
  },

  //Mostra os valores
  updateBalance(){
    document
      .getElementById('incomeDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.incomes())
    document
      .getElementById('expenseDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.expenses())
    document
      .getElementById('totalDisplay')
      .innerHTML = Utils.formatCurrency(Transaction.total())
  },
  clearTransactions(){
    DOM.transactionsContainer.innerHTML = ""
  }
}
//Transforma moeda
const Utils = {
  formatAmount(value){
    value = Number(value) * 100

    return value
  },
  formatData(date){
    const splittedDate = date.split("-")
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurrency(value){
    const signal = Number(value) < 0 ? "-" : ""

    value = String(value).replace(/\D/g, "")
    value = Number(value) / 100

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
    })

    return signal + value
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues(){
    return{
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },
  
  validateFields(){
    const{ description, amount, date } = Form.getValues()
    if( description.trim() === "" ||
        amount.trim() === ""||
        date.trim() ===""){
          throw new Error ("Por favor, preencha todos os campos")
        }
  },
  formatValues(){
    let{ description, amount, date} = Form.getValues()

    amount = Utils.formatAmount(amount)
    
    // date = Utils.formatDate(date)
    

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction(transaction){
    Transaction.add(transaction)
  },

  clearFields(){
    Form.description.value = ""
    Form.amount.value = ""
    Form.date.value = ""
  },
  submit(event){
    event.preventDefault()
    try{
      
        //Verificar se todas as informaçoes foram preechidas
        Form.validateFields()
        //formatar os dados pra salvar
        const transaction = Form.formatValues()
        //salvar
        Form.saveTransaction(transaction)
        //apagar os dados do formulario
        Form.clearFields()
        //modal feche
        Modal.close()
        //atualizar a aplicação
    } catch(error){
        alert(error.message)

    }
  }
}



const App = {
  init(){
    Transaction.all.forEach((transaction, index) =>{
      DOM.addTransaction(transaction, index)
    })
    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  reload() {
    DOM.clearTransactions()
    App.init()
  },
}

App.init()

