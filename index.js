const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const multer=require("multer");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const http = require("http"); //import http module which helps to create http server

const hostname = "127.0.0.1";
const port = 3000;

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "finance_manager",
});

con.connect(); //connect express instance with sql database

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // The destination folder where files will be stored
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext); // Appending the timestamp to the file name to make it unique
  }
});
const upload = multer({ storage: storage });


//So, when someone visits the home page of your website,
//this code will send them the "welcome to personal finance manager" message, and they will see it displayed in their web browser
//"/"-->root url
//When a user visits the main page of your website (the root URL), the application will respond by sending a "welcome to personal finance manager" message back to the user's web browser.
app.get("/", (req, res) => {
  res.send("welcome to personal finance manager ");
});


// upload api
app.post('/api/uploadimage', upload.single('picture'), (req,res)=> {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

    if(!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const fileDetails = {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype
    };
    return res.json(fileDetails);
});


app.get("/api/getusers", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var sql = `Select * from fmr_user`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("Records fetched");
      return res.status(200).send(result);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records fetched";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/getusersv2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from fmr_user`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.idno = result[i].id;
      ret_val.name = result[i].name;
      ret_val.email = result[i].email;
      ret_val.phone = result[i].phone;
      ret_val.address = result[i].address;
      ret_val.picture = result[i].picture;
      ret_val.occupation = result[i].occupation;
      ret_val.password = result[i].password;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.post("/api/createusers", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
    var phone = req.body.phone;
    var picture = req.body.picture;
    var occupation = req.body.occupation;
    var password = req.body.password;

    var sql = `Insert into fmr_user (name, email, address, phone,picture, occupation, password)  values ('${name}','${email}','${address}','${phone}','${picture}','${occupation}','${password}')`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deleteuser", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from fmr_user where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readoneuser", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from fmr_user where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.name = result[i].name;
      ret_val.email = result[i].email;
      ret_val.phone = result[i].phone;
      ret_val.address = result[i].address;
      ret_val.picture = result[i].picture;
      ret_val.occupation = result[i].occupation;
      ret_val.password = result[i].password;

      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.patch("/api/updateuser", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.body.id;
    var name = req.body.name;
    var email = req.body.email;
    var address = req.body.address;
    var phone = req.body.phone;
    var picture = req.body.picture;
    var occupation = req.body.occupation;
    var password = req.body.password;

    var sql = `UPDATE fmr_user set name='${name}', email='${email}', address='${address}', phone='${phone}',picture='${picture}', occupation='${occupation}', password='${password}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "USER record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.post("/api/userlogin", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var email = req.body.email;
    var password = req.body.password;

    var sql = `SELECT * from fmr_user where email= '${email}' and password='${password}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;

      var l = result.length;
      if (l == 1) {
        var i = 0;
        ret_val.id = result[i].id;
        ret_val.name = result[i].name;
        ret_val.email = result[i].email;
        ret_val.phone = result[i].phone;
        ret_val.address = result[i].address;
        ret_val.picture = result[i].picture;
        ret_val.occupation = result[i].occupation;

        ret_val.code = 1;
        ret_val.message = "Login Successfull";

        console.log(ret_val);

        return res.status(200).send(ret_val);
      } else {
        ret_val.code = 0;
        ret_val.message = "Invalid login";
        console.log(ret_val);
        return res.status(200).send(ret_val);
      }

      console.log("Records fetched");
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Invalid Login";
    return res.status(500).send(ret_val);
  }
});

//-----------------------------------------------INCOME-------------------------------------------------------

app.post("/api/createincome", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var source = req.body.source;
    var amount = req.body.amount;
    var description = req.body.description;
    var type = req.body.type;
    var date = req.body.date;
    var time = req.body.time;
    var user_id = req.body.user_id;

    var sql = `Insert into income (source, amount, description, type,date, time, user_id)  values ('${source}','${amount}','${description}','${type}','${date}','${time}',${user_id})`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/getincomev2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from income`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.idno = result[i].id;
      ret_val.source = result[i].source;
      ret_val.amount = result[i].amount;
      ret_val.description = result[i].description;
      ret_val.type = result[i].type;
      ret_val.date = result[i].date;
      ret_val.time = result[i].time;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.patch("/api/updateincome", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.body.id;
    var source = req.body.source;
    var amount = req.body.amount;
    var description = req.body.description;
    var type = req.body.type;
    var date = req.body.date;
    var time = req.body.time;
    var user_id = req.body.user_id;

    var sql = `UPDATE income set source='${source}', amount='${amount}', description='${description}', type='${type}',date='${date}', time='${time}', user_id='${user_id}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "INCOME record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deleteincome", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from income where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readoneincome", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from income where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.source = result[i].source;
      ret_val.amount = result[i].amount;
      ret_val.description = result[i].description;
      ret_val.type = result[i].type;
      ret_val.date = result[i].date;
      ret_val.time = result[i].time;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

//-----------------------------------INSURANCE----------------------------------

app.post("/api/createinsurance", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var organization = req.body.organization;
    var amount = req.body.amount;
    var insurance_type = req.body.insurance_type;
    var policy_file = req.body.policy_file;
    var tenure = req.body.tenure;
    var premium_amount = req.body.premium_amount;
    var premium_type = req.body.premium_type;
    var money_back = req.body.money_back;
    var maturity_amount = req.body.maturity_amount;
    var claim_amount = req.body.claim_amount;
    var user_id = req.body.user_id;

    var sql = `Insert into insurance (organization, amount, insurance_type, policy_file,tenure, premium_amount,premium_type,money_back,maturity_amount,claim_amount ,user_id)  values ('${organization}','${amount}','${insurance_type}','${policy_file}','${tenure}','${premium_amount}','${premium_type}','${money_back}','${maturity_amount}','${claim_amount}',${user_id})`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/getinsurancev2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from insurance`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.idno = result[i].id;
      ret_val.organization = result[i].organization;
      ret_val.amount = result[i].amount;
      ret_val.insurance_type = result[i].insurance_type;
      ret_val.policy_file = result[i].policy_file;
      ret_val.tenure = result[i].tenure;
      ret_val.premium_amount = result[i].premium_amount;
      ret_val.money_back = result[i].money_back;
      ret_val.maturity_amount = result[i].maturity_amount;
      ret_val.claim_amount = result[i].claim_amount;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.patch("/api/updateinsurance", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;
    var organization = req.body.organization;
    var amount = req.body.amount;
    var insurance_type = req.body.insurance_type;
    var policy_file = req.body.policy_file;
    var tenure = req.body.tenure;
    var premium_amount = req.body.premium_amount;
    var premium_type = req.body.premium_type;
    var money_back = req.body.money_back;
    var maturity_amount = req.body.maturity_amount;
    var claim_amount = req.body.claim_amount;
    var user_id = req.body.user_id;

    var sql = `UPDATE insurance set organization='${organization}', amount='${amount}', insurance_type='${insurance_type}', policy_file='${policy_file}',tenure='${tenure}', premium_amount='${premium_amount}', premium_type='${premium_type}', money_back='${money_back}', maturity_amount='${maturity_amount}', claim_amount='${claim_amount}', user_id='${user_id}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "INSURANCE record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deleteinsurance", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from insurance where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readoneinsurance", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from insurance where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.organization = result[i].organization;
      ret_val.amount = result[i].amount;
      ret_val.insurance_type = result[i].insurance_type;
      ret_val.policy_file = result[i].policy_file;
      ret_val.tenure = result[i].tenure;
      ret_val.premium_amount = result[i].premium_amount;
      ret_val.premium_type = result[i].premium_type;
      ret_val.money_back = result[i].money_back;
      ret_val.maturity_amount = result[i].maturity_amount;
      ret_val.claim_amount = result[i].claim_amount;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

//--------------------------------LOAN-----------------------------------

app.post("/api/createloan", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var lender = req.body.lender;
    var lender_loan_id = req.body.lender_loan_id;
    var principal_amount = req.body.principal_amount;
    var date = req.body.date;
    var emi_amount = req.body.emi_amount;
    var due_date = req.body.due_date;
    var user_id = req.body.user_id;

    var sql = `Insert into loans (lender, lender_loan_id, principal_amount, date, emi_amount, due_date,user_id)  values ('${lender}','${lender_loan_id}','${principal_amount}','${date}','${emi_amount}','${due_date}',${user_id})`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/getloanv2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from loans`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.id = result[i].id;
      ret_val.lender = result[i].lender;
      ret_val.lender_loan_id = result[i].lender_loan_id;
      ret_val.principal_amount = result[i].principal_amount;
      ret_val.date = result[i].date;
      ret_val.emi_amount = result[i].emi_amount;
      ret_val.due_date = result[i].due_date;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.patch("/api/updateloan", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.body.id;
    var lender = req.body.lender;
    var lender_loan_id = req.body.lender_loan_id;
    var principal_amount = req.body.principal_amount;
    var date = req.body.date;
    var emi_amount = req.body.emi_amount;
    var due_date = req.body.due_date;
    var user_id = req.body.user_id;

    var sql = `UPDATE loans set lender='${lender}', lender_loan_id='${lender_loan_id}', principal_amount='${principal_amount}', date='${date}',emi_amount='${emi_amount}', due_date='${due_date}', user_id='${user_id}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "LOAN record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deleteloan", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from loans where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readoneloan", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from loans where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.lender = result[i].lender;
      ret_val.lender_loan_id = result[i].lender_loan_id;
      ret_val.principal_amount = result[i].principal_amount;
      ret_val.date = result[i].date;
      ret_val.emi_amount = result[i].emi_amount;
      ret_val.due_date = result[i].due_date;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

//------------------------------------TAXES--------------------------------

app.post("/api/createtaxes", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var type = req.body.type;
    var description = req.body.description;
    var amount = req.body.amount;
    var date = req.body.date;
    var user_id = req.body.due_date;

    var sql = `Insert into taxes (type, description, amount, date, user_id)  values ('${type}','${description}','${amount}','${date}','${user_id}')`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/gettaxesv2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from taxes`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.id = result[i].id;
      ret_val.type = result[i].type;
      ret_val.description = result[i].description;
      ret_val.amount = result[i].amount;
      ret_val.date = result[i].date;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.patch("/api/updatetaxes", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.body.id;
    var type = req.body.type;
    var description = req.body.description;
    var amount = req.body.amount;
    var date = req.body.date;
    var user_id = req.body.user_id;

    var sql = `UPDATE taxes set type='${type}', description='${description}', amount='${amount}',date='${date}', user_id='${user_id}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "LOAN record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deletetaxes", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from taxes where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readonetaxes", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from taxes where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.type = result[i].type;
      ret_val.description = result[i].description;
      ret_val.amount = result[i].amount;
      ret_val.date = result[i].date;
      ret_val.user_id = result[i].user_id;
      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

//--------------------------------------INVESTMENT--------------------------------

app.post("/api/createinvestments", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    
    var organization = req.body.organization;
    var type = req.body.type;
    var risk = req.body.risk;
    var amount = req.body.amount;
    var date = req.body.date;
    var tenure = req.body.tenure;
    var istaxsaving = req.body.istaxsaving;
    var user_id = req.body.user_id;

    var sql = `Insert into investments (id, organization, type, risk, amount,date,tenure,istaxsaving,user_id)  values ('${id}','${organization}','${type}','${risk}','${amount}','${date}','${tenure}','${istaxsaving}','${user_id}')`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/getinvestments2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from investments`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.id = result[i].id;
      ret_val.organization = result[i].organization;
      ret_val.type = result[i].type;
      ret_val.risk = result[i].risk;
      ret_val.amount = result[i].amount;
      ret_val.date = result[i].date;
      ret_val.tenure = result[i].tenure;
      ret_val.istaxsaving = result[i].istaxsaving;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.patch("/api/updateinvestments", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.body.id;
    var organization = req.body.organization;
    var type = req.body.type;
    var risk = req.body.risk;
    var amount = req.body.amount;
    var date = req.body.date;
    var tenure = req.body.tenure;
    var istaxsaving = req.body.istaxsaving;
    var user_id = req.body.user_id;

    var sql = `UPDATE investments set organization='${organization}', type='${type}',risk='${risk}',amount='${amount}',date='${date}',tenure='${tenure}',istaxsaving='${istaxsaving}', user_id='${user_id}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "INVESTMENTS record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deleteinvestments", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from investments where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readoneinvestments", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from investments where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.organization = result[i].organization;
      ret_val.type = result[i].type;
      ret_val.risk = result[i].risk;
      ret_val.amount = result[i].amount;
      ret_val.date = result[i].date;
      ret_val.tenure = result[i].tenure;
      ret_val.istaxsaving = result[i].istaxsaving;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

// ------------------------------------------------------------------------EXPENSES--------------------------------------------------------------------------------//

app.post("/api/createexpenses", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
   
    var type = req.body.type;
    var date = req.body.date;
    var time = req.body.time;
    var description = req.body.description;
    var amount = req.body.amount;
    var user_id = req.body.user_id;

    var sql = `Insert into expenses (type, date, time, description, amount,user_id)  values ('${type}','${date}','${time}','${description}','${amount}','${user_id}')`;

    con.query(sql, function (err, result, fields) {
      if (err) throw err;
      console.log("1 Record inserted");
      ret_val.code = "1";
      ret_val.msg = "Inserted Successfully";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. No records inserted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/getexpensesv2", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var sql = `Select * from expenses`;
  con.query(sql, function (err, result, fields) {
    var aryresults = [];
    var ret_val = {};
    if (err) throw err;
    console.log("Records fetched");
    // console.log("Records fetched:", result.length);
    var l = result.length;

    var i = 0;
    while (i < l) {
      ret_val.id = result[i].id;
      ret_val.type = result[i].type;
      ret_val.date = result[i].date;
      ret_val.time = result[i].time;
      ret_val.description = result[i].description;
      ret_val.amount = result[i].amount;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      aryresults[i] = ret_val;
      ret_val = {};

      i = i + 1;
    }
    return res.status(200).send(aryresults);
  });
});

app.patch("/api/updateexpenses", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.body.id;
    var type = req.body.type;
    var date = req.body.date;
    var time = req.body.time;
    var description = req.body.description;
    var amount = req.body.amount;
    var user_id = req.body.user_id;

    var sql = `UPDATE expenses set type='${type}', date='${date}',time='${time}',description='${description}',amount='${amount}', user_id='${user_id}' where id='${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Records updated");
      ret_val.code = "1";
      ret_val.message = "INVESTMENTS record updated";
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not updated";
    return res.status(500).send(ret_val);
  }
});

app.delete("/api/deleteexpenses", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `DELETE from expenses where id= '${id}'`;

    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("1 record deleted");
    });

    ret_val.code = "1";
    ret_val.message = "Success. User deleted";
    return res.status(200).send(ret_val);
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});

app.get("/api/readoneexpenses", (req, res) => {

  if ( req.get('apikey') !== 'rbfinmngraot2023' )
	{	
		return res.status(404).send('Unauthorised request. Please use API key');
	}

  var ret_val = {};
  try {
    var id = req.query.id;

    var sql = `SELECT * from expenses where id= '${id}'`;

    con.query(sql, function (err, result, fields) {
      var ret_val = {};
      if (err) throw err;
      console.log("Records fetched");
      var i = 0;
      ret_val.id = result[i].id;
      ret_val.type = result[i].type;
      ret_val.date = result[i].date;
      ret_val.time = result[i].time;
      ret_val.description = result[i].description;
      ret_val.amount = result[i].amount;
      ret_val.user_id = result[i].user_id;

      console.log(ret_val);
      return res.status(200).send(ret_val);
    });
  } catch (error) {
    console.log(error);
    ret_val.code = "0";
    ret_val.message = "ERROR. Data not deleted";
    return res.status(500).send(ret_val);
  }
});


//The HTTP server is started and begins listening for incoming HTTP requests on the specified port (e.g., port 3000).
//Once the server is successfully listening, the callback function (the arrow function) is executed. In this case,
//it prints the message "Listening on port ${port}..." to the console, where ${port} is replaced with the actual value of the port variable.
//listen() is a method provided by Express.js to start the HTTP server and make it listen for incoming HTTP requests on a specified port.
app.listen(port, () => console.log(`Listening on port ${port}..`));
