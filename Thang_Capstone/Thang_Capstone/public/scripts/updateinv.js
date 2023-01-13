var InvetoryBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadInvetoryFromServer: function () {
        $.ajax({
            url: '/searchinv/',
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
    updateInvFromServer: function (inv) {

        $.ajax({
            url: '/updateinv',
            dataType: 'json',
            data: inv,
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
        this.loadInvetoryFromServer();
        setInterval(this.loadloadInvetoryFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <div id="themid">
                    <Invetoryform2 onInvetorySubmit={this.loadInvetoryFromServer} />
                    <InvUpdateform onUpdateSubmit={this.updateInvFromServer} />
                </div>
                
                <br />
                <table id='theResult'>
                    <thead>
                        <tr>
                            <th>Item Key</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Stock Type</th>   
                            <th>Update</th>
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

        this.props.onInvetorySubmit({ iname: iname });

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
                            <th>Iventory ID</th>
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
var InvUpdateform = React.createClass({
    getInitialState: function () {
        return {
            updivnid: "",
            updinvquan: "",
            updinvtype: ""
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },


    handleUpSubmit: function (e) {
        e.preventDefault();

        var updinvid = upinvid.value;
        var updinvquan = upinvquan.value;
        var updinvtype = upinvtype.value;



        this.props.onUpdateSubmit({
            updinvid: updinvid,
            updinvquan: updinvquan,
            updinvtype : updinvtype 
        });


    },
    handleUpChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    validateNumber: function (value) {
        var regex = /^[1-9]\d*$/;
        return regex.test(value);
    },
    render: function () {

        return (
            <div>
                <div id="theform">
                    <form onSubmit={this.handleUpSubmit}>
                        <h1>Update Iventory</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Current Stock</th>
                                    <td>
                                        <input name="upinvquan" id="upinvquan" value={this.state.upinvquan} validate={this.validateNumber} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Stock Type</th>
                                    <td>
                                        <input name="upinvtype" id="upinvtype" value={this.state.upinvtype} onChange={this.handleUpChange} />
                                    </td>
                                </tr>

                            </tbody>
                        </table><br />
                        <input type="hidden" name="upinvid" id="upinvid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Employee" />
                    </form>
                </div>
            </div>
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

    getInitialState: function () {
        return {
            upinvid: "",
            singledata: []
        };
    },

    updateRecord: function (e) {
        e.preventDefault();
        var theupinvkey = this.props.iid;

        this.loadSingleUser(theupinvkey);
    },
    loadSingleUser: function (theupinvkey) {
        $.ajax({
            url: '/getsingleinventory/',
            data: {
                'upinvkey': theupinvkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateUser = this.state.singledata.map(function (inv) {
                    upinvid.value = theupinvkey;
                    upinvquan.value = inv.itemquantity;
                    upinvtype.value = inv.quantitytype;


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
                <td>
                    <form onSubmit={this.updateRecord}>

                        <input id="update" type="submit" value="Update" />
                    </form>
                </td>
            </tr>
        );
    }
});


ReactDOM.render(
    <InvetoryBox />,
    document.getElementById('content')
);

