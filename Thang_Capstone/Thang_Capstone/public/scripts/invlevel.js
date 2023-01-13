var CustomerBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadCustomersFromServer: function () {
        $.ajax({
            url: '/searchinv',
            data: {
                'itemname': iname.value,
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
        this.loadCustomersFromServer();
        setInterval(this.loadloadCustomersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>

                <Customerform2 onCustomerSubmit={this.loadCustomersFromServer} />
                <br />
                <table id='theResult'>
                    <thead>
                        <tr>
                            <th>Item Key</th>
                            <th>Name</th>
                            <th>Current Stocks</th> 
                            <th>Stock Level</th> 
                        </tr>
                    </thead>
                    <CustomerList data={this.state.data} />
                </table>

            </div>
        );
    }
});

var Customerform2 = React.createClass({
    getInitialState: function () {
        return {
            iname: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var iname = this.state.iname.trim();

        this.props.onCustomerSubmit({ iname: iname});

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Current Iventory Level</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Item Name</th>
                            <td>
                                <input type="text" name="iname" id="iname" value={this.state.iname} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Customer" />

            </form>
        );
    }
});

var CustomerList = React.createClass({
    render: function () {
        var invNodes = this.props.data.map(function (inv) {
            //map the data to individual donations
            return (
                <Customer
                    //key={inv.dbinvkey}
                    iid={inv.itemid}
                    iname={inv.itemname}
                    iquan={inv.itemquantity}
                    itype={inv.quantitytype}
                >
                </Customer>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {invNodes}
            </tbody>
        );
    }
});



var Customer = React.createClass({

    render: function () {
        //display an individual donation

        return (

            <tr>
                <td>
                    {this.props.iid}
                </td>
                <td>
                    {this.props.iname}
                </td>
                <td>
                    {this.props.iquan}/100  {this.props.itype}
                </td>
                <td>
                    {this.props.iquan}%
                </td>
            </tr>
        );
    }
});


ReactDOM.render(
    <CustomerBox />,
    document.getElementById('content')
);

