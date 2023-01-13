var OrderBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadOrdersFromServer: function () {
        $.ajax({
            url: '/searchorders',
            data: {
                'orderstatus': odstatus.value
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
                            <th>Order Status</th>
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
            orderstatus:""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var orderstatus = odstatus.selectedOption;


        this.props.onOrderSubmit({ orderstatus: orderstatus});

    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Search Orders</h1>
       
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Order Status</th>
                            <td>
                                <select name='odstatus' id="odstatus" onChange={this.handleOptionChange}>
                                    <option value=""></option>
                                    <option value="0">Closed</option>
                                    <option value="1">Open</option>
                                </select>
                            </td>
                        </tr>
 
                    </tbody>
                </table>
                <input type="submit" value="Search Order" />

            </form>
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
                    ostatus={order.orderstatus}
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
        if (this.props.ostatus == 1) {
            var ostat = "Open";
        } else {
            var ostat = "Closed";
        }
     
        return (

            <tr>
                <td>
                    {this.props.okey}
                </td>
                <td id={ostat}>
                    {ostat}
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

