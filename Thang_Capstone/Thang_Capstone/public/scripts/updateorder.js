var OrderBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadOrdersFromServer: function () {
        $.ajax({
            url: '/searchorderd',
            data: {
                'orderid': orderID.value
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },
    updateOrderFromServer: function (order) {

        $.ajax({
            url: '/updateorder',
            dataType: 'json',
            data: order,
            type: 'POST',
            cache: false,
            success: function (updata) {
                this.setState({ updata: updata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadOrdersFromServer();
        setInterval(this.loadloadOrdersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>

                
                <div id="themid">
                    <Orderform2 onOrderSubmit={this.loadOrdersFromServer} />
                    <OrderUpdateform onUpdateSubmit={this.updateOrderFromServer} />
                </div>
                <br />
                <table id='theResult'>
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Note</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <OrderList data={this.state.data} />
                </table>

            </div>
        );
    }
});

var Orderform2 = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    loaddata: function () {
        $.ajax({
            url: '/getorderid',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loaddata();

    },
    handleSubmit: function (e) {
        e.preventDefault();

        var orderid = orderID.value;


        this.props.onOrderSubmit({ orderid: orderid });

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Search Order</h1>
       
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Order #</th>
                            <td>
                                <SelectList data={this.state.data} />
                            </td>
                        </tr>
 
                    </tbody>
                </table>
                <input type="submit" value="Search Order" />

            </form>
        );
    }
});
var OrderUpdateform = React.createClass({
    getInitialState: function () {
        return {
            uporderkey: "",
            uporderdata: [],
            upmenudata: [],
            updorderquantity: "",
            updordernote: ""
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },
    loadmenu: function () {
        $.ajax({
            url: '/getmenudetail',
            dataType: 'json',
            cache: false,
            success: function (upmenudata) {
                this.setState({ upmenudata: upmenudata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadorder: function () {
        $.ajax({
            url: '/getuserorder',
            dataType: 'json',
            cache: false,
            success: function (uporderdata) {
                this.setState({ uporderdata: uporderdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.loadmenu();
        this.loadorder();

    },
    handleUpSubmit: function (e) {
        e.preventDefault();

        var updorderkey = uporderkey.value;
        var updorderid = oID.value;
        var updmenuid = mID.value;
        var updorderquantity = uporderquantity.value;
        var updordernote = upordernote.value;


        this.props.onUpdateSubmit({
            updorderkey: updorderkey,
            updorderid: updorderid,
            updmenuid: updmenuid,
            updorderquantity: updorderquantity,
            updordernote: updordernote
        });


    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>
                        <h1>Update Order</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Order ID</th>
                                    <td>
                                        <OrderIDList uporderdata={this.state.uporderdata} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Menu Item</th>
                                    <td>
                                        <MenuList upmenudata={this.state.upmenudata} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Quantity</th>
                                    <td>
                                        <input name="uporderquantity" id="uporderquantity" value={this.state.upuseremail} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>
                                        <input name="upordernote" id="upordernote" value={this.state.upuserphone} textArea={true} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                 
                            </tbody>
                        </table><br />
                        <input type="hidden" name="uporderkey" id="uporderkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Employee" />
                    </form>
                </div>
            </div>
        );
    }
});
var SelectList = React.createClass({
    render: function () {
        var optionNodes = this.props.data.map(function (Order) {
            return (
                <option
                    key={Order.orderid}
                    value={Order.orderid}
                >
                    {Order.orderid}
                </option>
            );
        });
        return (
            <select name="orderID" id="orderID">
                {optionNodes}
            </select>
        );
    }
});
var OrderList = React.createClass({
    render: function () {
        var orderNodes = this.props.data.map(function (order) {
            //map the data to individual donations
            return (
                <Order
                    okey={order.orderkey}
                    oid={order.orderid}
                    ides={order.itemdes}
                    oquan={order.orderquantity}
                    oprice={order.orderprice}
                    odate={order.orderdate}
                    otime={order.ordertime}
                    onote={order.ordernote}
                >
                </Order>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {orderNodes}
            </tbody>
        );
    }
});



var Order = React.createClass({

    getInitialState: function () {
        return {
            uporderkey: "",
            singledata: []
        };
    },

    updateRecord: function (e) {
        e.preventDefault();
        var theuporderkey = this.props.okey;

        this.loadSingleOrder(theuporderkey);
    },

    loadSingleOrder: function (theuporderkey) {
        $.ajax({
            url: '/getsingleorder',
            data: {
                'uporderkey': theuporderkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateUser = this.state.singledata.map(function (user) {
                    uporderkey.value = theuporderkey;
                    oID.value = user.orderid;
                    mID.value = user.menuid;
                    uporderquantity.value = user.orderquantity;
                    upordernote.value = user.ordernote;
               

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },


    render: function () {
        //display an individual donation

     
        return (

            <tr>
                <td>
                    {this.props.oid}
                </td>
                <td>
                    {this.props.ides}
                </td>
                <td>
                    {this.props.oquan}
                </td>
                <td>
                    $ {this.props.oprice}
                </td>
                <td>
                    {this.props.odate.slice(0,10)}
                </td>
                <td>
                    {this.props.otime}
                </td>
                <td>
                    {this.props.onote}
                </td>
                <td>
                    <form onSubmit={this.updateRecord}>

                        <input id="update" type="submit" value="Update" />
                    </form>
                </td>
            </tr>
        );
    }
});

var MenuList = React.createClass({
    render: function () {
        var optionNodes = this.props.upmenudata.map(function (Menu) {
            return (
                <option
                    key={Menu.menuid}
                    value={Menu.menuid}
                >
                    {Menu.itemdes}
                </option>
            );
        });
        return (
            <select name="mID" id="mID" onChange={this.handleChange} >
                <option value=""></option>
                {optionNodes}
            </select>
        );
    }
});
var OrderIDList = React.createClass({
    render: function () {
        var optionNodes = this.props.uporderdata.map(function (Orderd) {
            return (
                <option
                    key={Orderd.orderid}
                    value={Orderd.orderid}
                >
                    {Orderd.orderid}
                </option>
            );
        });
        return (
            <select name="oID" id="oID" onChange={this.handleChange} >
                <option value=""></option>
                {optionNodes}
            </select>
        );
    }
});
ReactDOM.render(
    <OrderBox />,
    document.getElementById('content')
);

