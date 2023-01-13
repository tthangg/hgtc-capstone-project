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
    componentDidMount: function () {
        this.loadOrdersFromServer();
        setInterval(this.loadloadOrdersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>

                <Orderform2 onOrderSubmit={this.loadOrdersFromServer} />
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
                <h1>Seatch Orders</h1>
       
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
                    okey={order.orderid}
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

    render: function () {
        //display an individual donation

     
        return (

            <tr>
                <td>
                    {this.props.okey}
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
                    {this.props.odate.slice(0, 10)}
                </td>
                <td>
                    {this.props.otime}
                </td>
                <td>
                    {this.props.onote}
                </td>
            </tr>
        );
    }
});


ReactDOM.render(
    <OrderBox />,
    document.getElementById('content')
);

