const addSale = (e) => {
  e.preventDefault();
  let item = document.querySelector("#item").value.toUpperCase();
  if (item === "") {
    showAlert("Please add a new sale", "danger");
  } else {
    const result = axios.post("http://localhost:7700/add-sale", { item });
    result
      .then((res) => {
        if (res.data === "") {
          showAlert("The Product does not exist in our database", "danger");
        } else {
          addItem(
            res.data.product_name,
            res.data.price,
            res.data.quantity,
            res.data._id
          );
          showAlert("Sale added", "success");
        }
      })
      .catch((err) => {
        showAlert("Unable to add sale");
      });
    setTimeout(() => {
      window.location.reload();
      
    }, 2500);
  }
  item = document.querySelector("#item").value = "";
};

const updateProduct = (e) =>{
  e.preventDefault();
  let product_name = document.querySelector('#prod-name').value;
  let select_value = document.querySelector('.form-select').value;
  let updateVal = document.querySelector('#update-val').value;
  product_name = product_name.toUpperCase();
  updateVal = parseInt(updateVal)
  console.log(updateVal)
  axios.post('http://localhost:7700/update-product',{data:[{product_name,select_value,updateVal}]})
  .then(res=>{
    showAlert( `${res.data}`,'success');
    document.querySelector('#prod-name').value = '';
    document.querySelector('#update-val').value = '';
  })
  .catch(err=>{
    showAlert('Unable to update product','danger');
  })
  
  
}
const newProduct = (e) =>{
  e.preventDefault()
  let product_name = document.querySelector('#product-name').value;
  let price = document.querySelector('#product-price').value;
  if(product_name === '' || price === ''){
    showAlert('Please add the product name and the price','danger')
  }else{
    product_name = product_name.toUpperCase();
    price = parseInt(price);
    axios.post('http://localhost:7700/add-product',{data:[{product_name,price}]})
    .then(res=>{
      showAlert('Product Added','success');
      document.querySelector('#product-name').value = '';
      document.querySelector('#product-price').value ='';
    }).catch(()=>{
      showAlert('Unable to add product')
    })
  }
}
const addExpense = (e) =>{
  e.preventDefault();
  const expName = document.querySelector('#expense-name').value;
  const expCost = document.querySelector('#expense-cost').value;
  if(expName === '' || expCost === ''){
    showAlert('Please add the expense name and the cost','danger')
  }
  else{
    axios.post('http://localhost:7700/add-expense',{data:[{expName,expCost}]})
  .then(response=>{
    showAlert('Expense Added','success')
    document.querySelector('#expense-name').value = '';
    document.querySelector('#expense-cost').value = '';
  })
  .catch(err=>{
    showAlert('Unable to add Expense','danger')
  })
  }
}

const getChart = () =>{
  axios('http://localhost:7700/reports')
    .then(res=>{
      console.log(res)
    const chart = document.querySelector('.chart').getContext("2d");
    const options = {
      type:'bar',
      data:{
        labels:['Monday'],
        datasets:[
          {
           label:'sales',
           type:'bar',
           stack:'Sales',
           data:[110],
           backgroundColor:['rgb(120,72,166)'],
           barThickness:30
          },
          {
            label:'Expenses',
            type:'bar',
            stack:'Expenses',
            data:[200],
            backgroundColor:['rgb(220,172,166)'],
            barThickness:30
          },
          {
            label:'Profits',
           type:'bar',
           stack:'Profits',
           data:[45],
           backgroundColor:['rgb(150,202,166)'],
           barThickness:30
          }
        ]
      },
      options:{
        maintainAspectRatio:false,
        scales:{
          x:{
            stacked:true
          }
        }
      }
    }
    //Initialize the chart
    
   return new Chart(chart,options)
    }).catch(err=>{
      //console.log(err)
      showAlert('Unable to display chart. Refresh the page to load in a new chart', 'danger')
    })
}

const getExpenses = async() =>{
    const data = await axios('http://localhost:7700/expenses');
    return data;
}
const getSales = async () => {
  const data = await axios("http://localhost:7700/sales");
  return data;
};

const deleteSales = async () => {
  const data = await axios("http://localhost:7700/delete-sales");
  return data;
};
const deleteSale = async (id) => {
  const data = await axios.delete(`http://localhost:7700/${id}`);
  return data;
};
const addItem = (item, price, quantity, id) => {
  let tableBody = document.querySelector(".t_body");
  let tableRow = document.createElement("tr");

  tableRow.innerHTML = `<th scope="row">${id}</th>
      <td>${item}</td>
      <td>${price}</td>
      <td>${quantity}</td>
      <td>${price * quantity}</td>
      <td class="delete-item"><a href="#" style="color:white; font-weight:bold"><i class="fa-regular fa-trash-can"></i></a></td>
      `;
  tableBody.appendChild(tableRow);
};

const showAlert = (message, color) => {
  document.querySelector(
    ".alert_div"
  ).innerHTML = `<div class="alert alert-${color}" role="alert">
  ${message}
</div>`;
  setTimeout(() => {
    document.querySelector(".alert_div").innerHTML = "";
  }, 2000);
};

// const showAlertModal = () => {
//   document.querySelector(
//     ".alert_div-modal"
//   ).classList.add('alert_div-modal-show')
//   setTimeout(() => {
//     document.querySelector(".alert_div-modal").innerHTML = "";
//   }, 2000);
// };

const deleteItem = (e) => {
  if (e.target.parentElement.parentElement.classList.contains("delete-item")) {
    showAlert("sale removed", "warning");

    const sale_id =
      e.target.parentElement.parentElement.parentElement.firstChild.textContent;
    deleteSale(sale_id)
      .then((data) => {
        console.log("Sale Deleted");
      })
      .catch((err) => {
        console.log("Unable to delete sale");
      });
    //console.log(sale_id);
    e.target.parentElement.parentElement.parentElement.remove();
  }
};



const addSalesUI = () => {
  axios
    .get("http://localhost:7700/sales")
    .then((res) => {
      console.log(res);
      res.data.forEach((el) => {
        let tableBody = document.querySelector(".t_body");
        let tableRow = document.createElement("tr");

        tableRow.innerHTML = `<th scope="row">${el._id}</th>
            <td>${el.product_name}</td>
            <td>${el.price}</td>
            <td>${el.quantity}</td>
            <td>${el.price * el.quantity}</td>
            <td class="delete-item"><a href="#" style="color:white; font-weight:bold"><i class="fa-regular fa-trash-can"></i></a></td>
            `;
        tableBody.appendChild(tableRow);
        document.querySelector(
          ".calculate-total"
        ).innerHTML = `<div class="crud">
        <a href="#" class="btn btn-warning btn-total">Calculate Total</a> <a href="index.html" class="btn btn-danger btn-clear">Clear Sales</a> <a href="#" class="btn btn-primary btn-save">Save To File</a>
        <a href="#" class="btn btn-outline-dark btn-visualize">Visualize 
        weekly Report</a>
        </div>`;
      // Listen for a click event on the viz button
    document.querySelector('.btn-visualize').addEventListener('click',getChart)
        // Delete Sales
        document.querySelector(".btn-clear").addEventListener("click", () => {
          if(confirm('Are you sure you want to delete sales. this action cannot be undone')){
            deleteSales()
            .then((resp) => {
                showAlert("Sales Deleted", "success")
            })
            .catch((err) => {
              showAlert("Unable To Delete Sales", "danger");
            });
          }
        });

        // Calculate Total Sales
        document.querySelector(".btn-total").addEventListener("click", () => {
          let total = 0;
          getSales()
            .then((res) => {
              res.data.forEach((item) => {
                total += item.price * item.quantity;
              });
              getExpenses().then(res=>{
              let totalExp = res.data.reduce((sum,expense)=>{
                  return sum +=expense.amount
               },0)
               //console.log(totalExp)
               document.querySelector(
                ".total-sales"
              ).innerHTML = `<p class="lead display-3">Total Sales: ksh${total}</p>
                             <p class="lead display-3">Total Expenses: ksh${totalExp}</p>      
                            <p class="lead display-3">Total Profit: ksh${total - totalExp}</p>
                             `; 
              }).catch(err=>{
                console.log('Unable to fetch expenses')
              })
            })
            .catch((err) => {
              showAlert("The Total Could not be Calculated", "info");
            });
        });
      });

      // Listen for a click on the save to file button
      document.querySelector(".btn-save").addEventListener("click", (e) => {
        axios("http://localhost:7700/sales")
          .then((res) => {
            axios
              .post("http://localhost:7700/save", { data: res.data })
              .then((res) => {
                showAlert(res.data.message, "dark");
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log("There is no data to display");
    });

    
};


document.querySelector(".today").innerHTML = moment().format('dddd, MMMM Do YYYY');
document.querySelector(".sales-form").addEventListener("submit", addSale);
document.querySelector(".updateproduct-form").addEventListener('submit',updateProduct);
document.querySelector(".expense-form").addEventListener('submit',addExpense);
document.querySelector(".newproduct-form").addEventListener('submit',newProduct);
document.body.addEventListener("click", deleteItem);
document.addEventListener("DOMContentLoaded", addSalesUI);



