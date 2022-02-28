const express = require("express");
const app = express();
const exceljs = require("exceljs");
const port = 7700;
const mongoose = require('mongoose');
const db = require('./database/database')();
const Products = require('./database/models/Products');
const Sales = require('./database/models/Sales'); 
const Expense = require('./database/models/Expense');
const Report = require('./database/models/Reports');
const date = () =>{
    const dte = new Date()
    return`${dte.getDate()}-${dte.getMonth()+1}-${dte.getFullYear()}`;
}

app.use(express.json());

//Setting up repsonse headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
  next();
});

//Route handler for saving sales to a file
app.post("/save", (req, res) => {
  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Sales', {properties:{tabColor:{argb:'FFC0000'}}});
  const path = "./sales";
  worksheet.columns = [
    { header: "Product", key: "product_name", width: 20 },
    { header: "Price", key: "price", width: 15 },   
    { header: "Quantity", key: "quantity", width: 15 },
    {header:"Total", key:"", width:10}
  ];
  const sales = req.body.data;
  let counter = 1;
  sales.forEach((sale) => {
    worksheet.addRow(sale);
    counter++;
  });
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true };
  });

  const writeFile = async () => {
    const data = await workbook.xlsx.writeFile(`${path}/${date()}.xlsx`);
  };
  writeFile().then(()=>{
     res.send({
         status:'success',
         message:'File successfully written',
         path:`${path}/sales`
     })
  }).catch((err)=>{
    res.send({
        status:'error',
        message:'Unable to write file'
    })
  })
});

// Route for getting all the products
app.get('/products',(req,res)=>{
    Products.find()
    .then(data=>{
    res.send(data)
    }).catch(err=>{
      res.send(err)
    })
})


//Route for adding a new sale
app.post('/add-sale',(req,res)=>{
  Products.findOne({product_name: req.body.item}).then((data)=>{
   if(data !== null){
    Sales.findOneAndUpdate({product_name:data.product_name},{$inc:{quantity:1},price:data.price},{new:true,upsert:true})
    .then(data=>{
      const new_entry = Report({name:data.product_name,amount:data.price,category:'Sales',day:data.day,quantity:data.quantity})
      new_entry.save()
      .then(data=>{
        console.log('New Entry added to category sales')
      }).catch(err=>{
        console.log('Unable to create new')
      })
      // new_entry.save().then(data=>{
      //   console.log('Saved to sales category')
      // })
      .catch(err=>{
        console.log('Unable to save to reports')
      })
      res.send(data)
    })
    .catch(err=>{
      res.send(err)
    })
   }else{
     res.send(undefined)
   }
    
  }).catch(err=>{
    res.send('Database Error')
  })
})

//Route for returning all the current sales
app.get('/sales',(req,res)=>{
   Sales.find()
   .then(data=>{
     res.send(data)
   })
   .catch(err=>{
     res.send(err)
   })
})


// Route For Deleting sales
app.get('/delete-sales',(req,res)=>{
   mongoose.connection.db.dropCollection('sales')
   .then(data=>{
     mongoose.connection.db.dropCollection('expenses')
     .then(response=>{
      res.send({
        data,
        response
      })
     })
     
   })
   .catch(err=>{
     res.send(err)
   })
})

app.delete('/:id',(req,res)=>{
  Sales.findByIdAndDelete({_id:req.params.id})
  .then(resp=>{
    res.send('Sale Deleted')
  }).catch(err=>{
    res.send('Unable to delete sale')
  })
   
})

//Route for adding new expenses

app.post('/add-expense',(req,res)=>{
  
  const {expName,expCost} = req.body.data[0];
  const expense = new Expense({expense_name:expName,amount:expCost});
  expense.save()
  .then(resp=>{
    const new_entry = Report({name:resp.expense_name,amount:resp.amount,day:resp.day,category:'expenses'})
    new_entry.save()
    .then(data=>{
      console.log('Saved to expenses category')
    }).catch(err=>{
       console.log('Unable to save expense to reports')
    })
    //console.log(resp);
    res.send('Expense Saved')
  }).catch(err=>{
    console.log(err)
    res.send('Unable to add Expense')
  })
})

// Route for adding new product
app.post('/add-product',(req,res)=>{
  const {product_name,price} = req.body.data[0];
  const product = new Products({product_name,price})
  product.save()
  .then(response=>{
     res.send('Product Successfully Created')
  })
  .catch(err=>{
    res.send('Unable to save product')
  })
})

// Route for getting all expense
app.get('/expenses',(req,res)=>{
  Expense.find({}).then(data=>{
    res.send(data)
  }).catch(err=>{
    res.send('Server Error')
  })
})

// Route for updating a product
app.post('/update-product',(req,res)=>{
 const {product_name,updateVal} = req.body.data[0];
  Products.findOneAndUpdate({product_name},{price:updateVal},{new:true})
  .then(response=>{
    if(response !== null){
      res.send('Product updated..')
    }else{
      res.send('The product does not exist')
    }
  }).catch(err=>{
   res.send('Unable to update')
  })
})

// Reports route
app.get('/reports',(req,res)=>{
Report.find({})
.then(data=>{
  const days = ['Monday','Tuesday','Wednesday','Thursday']
   res.send(data)
}).catch(err=>{
  res.send(err)
})
})
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
