'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var app = express();

const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "tthang_user",
    password: "user01",
    database: "tthang_milestone"
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");

});

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {

    res.sendFile(path.join(__dirname + '/public/userlogin.html'))
});
//insert user table
app.post('/user', function (req, res) {
    var ufname = req.body.userfname;
    var ulname = req.body.userlname;
    var uemail = req.body.useremail;
    var uphone = req.body.userphone;
    var uadmin = req.body.useradmin;
    var upw = req.body.userpw;
    console.log(ulname);

    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(upw, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad");
            return
        } else {
            theHashedPW = hashedPassword;
            console.log("Password 1: " + theHashedPW);
            var sqlins = "INSERT INTO usertable (userFirstName, userLastName, useremail,"
                + "userpassword, useradmin, userphone) VALUE(?,?,?,?,?,?)";
            var inserts = [ufname, ulname, uemail, theHashedPW, uadmin, uphone];

            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                res.redirect('insertuser.html');
                res.end();
            });
        }
    });

});
app.post('/login/', function (req, res) {

    var uemail = req.body.useremail;
    var upw = req.body.userpw;

    var sqlsel = 'select * from usertable where useremail = ?';

    var inserts = [uemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log("SQL: " + sql);
    con.query(sql, function (err, data) {
        if (data.length > 0) {
            console.log("User Name Correct:");
            console.log(data[0].userpassword);
            bcrypt.compare(upw, data[0].userpassword, function (err, passwordCorrect) {
                if (err) {
                    throw err
                } else if (!passwordCorrect) {
                    console.log("Password incorrect")
                } else {
                    console.log("Password correct")
                    res.send({ redirect: '/searchuser.html' });
                }
            })
        } else {
            console.log("Incorrect user name or password");
        }


    });
});
//search for user name
app.get('/searchuser/', function (req, res) {

    var ufname = req.query.userfname;
    var ulname = req.query.userlname;



    var sqlsel = 'Select * from usertable where userFirstName Like ? and useremail Like ?';
    var inserts = [ '%' + ufname + '%', '%' + ulname + '%'];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
//update menu
app.post('/updatemenu', function (req, res, ) {
    var mid = req.body.updmenuid;
    var mprice = req.body.updmenuprice;
    var mdes = req.body.updmenudes;


    var sqlins = "UPDATE menuitem SET menuprice = ?, itemdes= ? " +
        " WHERE menuid = ?";
    var inserts = [mprice, mdes, mid];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
}); 
//update inv
app.post('/updateinv', function (req, res, ) {
    var ikey = req.body.updinvid;
    var iquan = req.body.updinvquan;
    var itype = req.body.updinvtype;


    var sqlins = "UPDATE inventorytable SET itemquantity = ?, quantitytype = ? WHERE itemid = ?";
    var inserts = [iquan, itype, ikey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
});


//updateuser
app.post('/updateuser', function (req, res, ) {
    var ukey = req.body.upduserkey;
    var ufname = req.body.upduserfname;
    var ulname = req.body.upduserlname;
    var uemail = req.body.upduseremail;
    var uphone = req.body.upduserphone;
    var uadmin = req.body.upduseradmin;

    var sqlins = "UPDATE usertable SET userFirstName = ?, userLastName = ?, useremail = ?, " +
        " useradmin = ?, userphone = ?  WHERE userid = ?";
    var inserts = [ufname, ulname, uemail, uadmin, uphone, ukey];

    var sql = mysql.format(sqlins, inserts);
    console.log(sql);
    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
});  
app.get('/getsingleuser/', function (req, res) {

    var ukey = req.query.upuserkey;

    var sqlsel = 'select * from usertable where userid= ?';
    var inserts = [ukey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getsinglemenu/', function (req, res) {

    var mkey = req.query.upmenukey;

    var sqlsel = 'select * from menuitem where menuid= ?';
    var inserts = [mkey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleinventory/', function (req, res) {

    var ikey = req.query.upinvkey;

    var sqlsel = 'select * from inventorytable where itemid= ?';
    var inserts = [ikey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleorder/', function (req, res) {

    var okey = req.query.uporderkey;

    var sqlsel = 'select * from orderdetail where orderkey= ?';
    var inserts = [okey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
//insert into item table
app.post('/item', function (req, res) {
    var icost = req.body.itemcost;
    var isize = req.body.itemsize;
    var iweight = req.body.itemweight;
    var iname = req.body.itemname;
  

    var sqlins = "INSERT INTO itemdetail (itemcost, itemsize, itemweight, itemname) VALUE(?,?,?,?)";

    var inserts = [icost, isize, iweight, iname];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record entered");
        res.redirect("insertitem.html");
        res.end();

    });
});
//insert into inventory table
app.get('/getitemdetail', function (req, res) {


    var sqlsel = 'select itemid, itemname from itemdetail';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/inv', function (req, res) {
    var iid = req.body.itemid;
    var iquan = req.body.itemquantity;
    var itype = req.body.quantitytype;


    var sqlins = "INSERT INTO inventorytable (itemid, itemquantity, quantitytype) VALUE(?,?,?)";

    var inserts = [iid, iquan, itype];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record entered");
        res.redirect("insertinv.html");
        res.end();

    });
});
//update order
app.post('/updateorder', function (req, res, ) {


    var mid = req.body.updmenuid;

    var sqlsel = "select menuprice from menuitem where menuid = ?"
    var sel = [mid];

    var price = 0;

    var sql = mysql.format(sqlsel, sel);

    con.query(sql, function (err, data) {

        price = data[0].menuprice;

        var okey = req.body.updorderkey;
        var oquan = req.body.updorderquantity;
        var onote = req.body.updordernote;

        var totalCost = price * oquan;

        var sqlins = "UPDATE orderdetail SET menuid = ?, orderquantity = ?, orderprice = ?, ordernote=? "
            +"WHERE orderkey=?";

        var inserts = [mid, oquan, totalCost, onote, okey];

        var sql = mysql.format(sqlins, inserts);


        con.execute(sql, function (err, result) {
            if (err) throw err;

            console.log("1 record entered");
            res.redirect("insertcourse.html");
        });

    });

}); 

//insert recipe table
app.get('/getmenudetail', function (req, res) {


    var sqlsel = 'select menuid, itemdes from menuitem';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.post('/recip', function (req, res) {
    var mid = req.body.menuid;
    var iid = req.body.itemid;
    var quanused = req.body.quantityused;
    var quantype = req.body.quantitytype;


    var sqlins = "INSERT INTO recipetable (menuid, itemid, quantityused, quantitytype) VALUE(?,?,?,?)";

    var inserts = [mid, iid, quanused, quantype];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record entered");
        res.redirect("insertrecip.html");
        res.end();

    });
});
//insert into menu table
app.post('/menu', function (req, res) {
    var mprice = req.body.menuprice;
    var mdes = req.body.menudes;


    var sqlins = "INSERT INTO menuitem (menuprice, itemdes) VALUE(?,?)";

    var inserts = [mprice, mdes];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record entered");
        res.redirect("insertcourse.html");
        res.end();

    });
});
//search Menu table
app.get('/searchmenu/', function (req, res) {

    var mdes = req.query.menudes;

    var sqlsel = 'Select * from menuitem where itemdes Like ?';
    var inserts = ['%' + mdes + '%'];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
//insert into userorder table
app.get('/getuserdetail', function (req, res) {


    var sqlsel = 'select userid, userFirstName, userLastName from usertable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.post('/uorder', function (req, res) {
    var uid = req.body.userid;


    var sqlins = "INSERT INTO userorder (userid, orderstatus) VALUE(?,?)";

    var inserts = [uid, 1];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record entered");
        res.redirect("insertcourse.html");
        res.end();

    });
});
//insert into order detail table
app.get('/getuserorder', function (req, res) {


    var sqlsel = 'select orderid from userorder';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.post('/orderd', function (req, res) {

    var mid = req.body.menuid;

    var sqlsel = "select menuprice from menuitem where menuid = ?"
    var sel = [mid];

    var price = 0;

    var sql = mysql.format(sqlsel, sel);

    con.query(sql, function (err, data) {

        price = data[0].menuprice;

        var oid = req.body.orderid;
        var oquan = req.body.orderquantity;
        var onote = req.body.ordernote;

        var totalCost = price * oquan;

        var sqlins = "INSERT INTO orderdetail (orderid, menuid, orderquantity, orderprice, ordernote, orderdate, ordertime"
            + ") VALUE(?,?,?,?,?,now(),now())";

        var inserts = [oid, mid, oquan, totalCost, onote];

        var sql = mysql.format(sqlins, inserts);

        con.execute(sql, function (err, result) {
            if (err) throw err;

            console.log("1 record entered");
            res.redirect("insertcourse.html");
        });

    });
  
});
//search order detail and order table at the same time
app.get('/getorderid', function (req, res) {


    var sqlsel = 'select orderid from orderdetail';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/searchorders/', function (req, res) {

    var ostatus = req.query.orderstatus;

    var sqlsel = 'Select orderdetail.*,  menuitem.itemdes,userorder.* from orderdetail'
        + ' inner join menuitem on menuitem.menuid = orderdetail.menuid'
        + ' inner join userorder on userorder.orderid = orderdetail.orderid where orderstatus = ? ';
    var inserts = [ostatus];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});


app.get('/searchorderd/', function (req, res) {

    var oid = req.query.orderid;

    var sqlsel = 'Select orderdetail.*,  menuitem.itemdes from orderdetail'
        +' inner join menuitem on menuitem.menuid = orderdetail.menuid where orderid = ? ';
    var inserts = [oid];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
//search inventory table and  item  table at the same time
app.get('/searchinv/', function (req, res) {

    var iname= req.query.itemname;

    var sqlsel = 'Select inventorytable.*,  itemdetail.itemname from inventorytable'
        + ' inner join itemdetail on inventorytable.itemid = itemdetail.itemid where itemname like ? ';
    var inserts = ['%' + iname + '%'];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/searchinv2/', function (req, res) {

    var iID = req.query.itemID;

    var sqlsel = 'Select inventorytable.*, itemdetail.itemname from inventorytable'
        + ' inner join itemdetail on inventorytable.itemid = itemdetail.itemid where inventorytable.itemid = ? ';
    var inserts = [iID];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getinvid', function (req, res) {

    var sqlsel = 'Select inventorytable.*, itemdetail.itemname from inventorytable'
        + ' inner join itemdetail on inventorytable.itemid = itemdetail.itemid';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});

app.get('/getcourse/', function (req, res) {
    var cfac = req.query.coursefac;
    var csem = req.query.coursesem;
    var cyear = req.query.courseyear;
    var cpre = req.query.coursepre;
    var cnum = req.query.coursenum;
    var csec = req.query.coursesection;


    var sqlsel = 'Select * from coursetable where courseInstruct Like ? and courseSem Like ? and courseYear Like ? and coursePre Like ?'
        + ' and courseNum Like ? and courseSec Like ?';
    var inserts = ['%' + cfac + '%', '%' + csem + '%', '%' + cyear + '%', '%' + cpre + '%', '%' + cnum + '%', '%' + csec + '%'];

    var sql = mysql.format(sqlsel, inserts);

    console.log(sql);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/gethour/', function (req, res) {

    var sqlsel = 'select * from hourtable';

    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getsinglehour/', function (req, res) {

    var hid = req.query.uphourid;

    var sqlsel = 'select * from hourtable where hourid = ?';
    var inserts = [hid];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.post('/updatehour', function (req, res, ) {

    var hid = req.body.updhoursid;
    var hs = req.body.updhstart;
    var he = req.body.updhend;

    var sqlins = "UPDATE hourtable SET hourstart= ?, hourend= ? WHERE hourid= ? ";
    var inserts = [hs, he, hid];

    var sql = mysql.format(sqlins, inserts);

    con.execute(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record updated");

        res.end();
    });
});
app.post('/hour', function (req, res) {
    var hdes = req.body.hourdes;
    var hstart = req.body.hourstart;
    var hend= req.body.hourend;


    var sqlins = "INSERT INTO hourtable (hourdes, hourstart, hourend) VALUE(?,?,?)";

    var inserts = [hdes, hstart, hend];

    var sql = mysql.format(sqlins, inserts);
    console.log(hstart);
    console.log(hend);
    con.execute(sql, function (err, result) {
        if (err) throw err;

        console.log("1 record entered");
        res.redirect("insertitem.html");
        res.end();

    });
});
app.listen(app.get('port'), function () {
    console.log("Sever is runing");
});