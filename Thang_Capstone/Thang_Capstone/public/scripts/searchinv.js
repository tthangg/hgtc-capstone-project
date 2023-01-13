var InvetoryBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadInvetoryFromServer: function () {
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
        this.loadInvetoryFromServer();
        setInterval(this.loadloadInvetoryFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>

                <Invetoryform2 onInvetorySubmit={this.loadInvetoryFromServer} />
                <br />
                <table id='theResult'>
                    <thead>
                        <tr>
                            <th>Item Key</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Stock Type</th>                  
                        </tr>
                    </thead>
                    <InvetoryList data={this.state.data} />
                </table>

            </div>
        );
    }
});

var Invetoryform2 = React.createClass({
    getInitialState: function () {
        return {
            iname: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var iname = this.state.iname.trim();

        this.props.onInvetorySubmit({ iname: iname});

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Search Invetory</h1>
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
                <input type="submit" value="Search Invetory" />

            </form>
        );
    }
});

var InvetoryList = React.createClass({
    render: function () {
        var invNodes = this.props.data.map(function (inv) {
            //map the data to individual donations
            return (
                <Invetory
                    //key={inv.dbinvkey}
                    iid={inv.itemid}
                    iname={inv.itemname}
                    iquan={inv.itemquantity}
                    itype={inv.quantitytype}
                >
                </Invetory>
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



var Invetory = React.createClass({

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
                    {this.props.iquan}
                </td>
                <td>
                    {this.props.itype}
                </td>
            </tr>
        );
    }
});


ReactDOM.render(
    <InvetoryBox />,
    document.getElementById('content')
);

