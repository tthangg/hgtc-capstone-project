var UserBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadUsersFromServer: function () {
        $.ajax({
            url: '/searchmenu',
            data: {
                'menudes': menudes.value,

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
    updateMenuFromServer: function (menu) {

        $.ajax({
            url: '/updatemenu',
            dataType: 'json',
            data: menu,
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
        this.loadUsersFromServer();
        setInterval(this.loadloadUsersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>
                <div id="themid">
                    <Userform2 onUserSubmit={this.loadUsersFromServer} />
                    <MenuUpdateform onUpdateSubmit={this.updateMenuFromServer} />
                </div>
                
                <br />
                <table id='theResult'>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>Menu Item</th>
                            <th>Price</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <UserList data={this.state.data} />
                </table>

            </div>
        );
    }
});

var Userform2 = React.createClass({
    getInitialState: function () {
        return {
            menudes: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var menudes = this.state.menudes.trim();


        this.props.onUserSubmit({ menudes: menudes});

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Search Menu</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Menu Item</th>
                            <td>
                                <input name="menudes" id="menudes" value={this.state.menudes} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search Menu" />

            </form>
        );
    }
});
var MenuUpdateform = React.createClass({
    getInitialState: function () {
        return {
            updmenuid: "",
            updmenuprice: "",
            updmenudes: ""
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },


    handleUpSubmit: function (e) {
        e.preventDefault();

        var updmenuid = upmenuid.value;
        var updmenuprice = upmenuprice.value;
        var updmenudes = upmenudes.value;



        this.props.onUpdateSubmit({
            updmenuid: updmenuid,
            updmenuprice: updmenuprice,
            updmenudes: updmenudes
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
                        <h1>Update Menu</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Menu Item</th>
                                    <td>
                                        <input name="upmenudes" id="upmenudes" value={this.state.upmenudes} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Price</th>
                                    <td>
                                        <input name="upmenuprice" id="upmenuprice" value={this.state.upmenuprice} validate={this.validateNumber} onChange={this.handleUpChange} />
                                    </td>
                                </tr>

                            </tbody>
                        </table><br />
                        <input type="hidden" name="upmenuid" id="upmenuid" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Employee" />
                    </form>
                </div>
            </div>
        );
    }
});
var UserList = React.createClass({
    render: function () {
        var menuNodes = this.props.data.map(function (menu) {
            //map the data to individual donations
            return (
                <User
                    //key={menu.dbmenukey}
                   mkey={menu.menuid}
                   mprice={menu.menuprice}
                   mdes={menu.itemdes}

                >
                </User>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {menuNodes}
            </tbody>
        );
    }
});



var User = React.createClass({

    getInitialState: function () {
        return {
            upmenuid: "",
            singledata: []
        };
    },

    updateRecord: function (e) {
        e.preventDefault();
        var theupmenukey = this.props.mkey;

        this.loadSingleUser(theupmenukey);
    },
    loadSingleUser: function (theupmenukey) {
        $.ajax({
            url: '/getsinglemenu',
            data: {
                'upmenukey': theupmenukey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateUser = this.state.singledata.map(function (menu) {
                    upmenuid.value = theupmenukey;
                    upmenuprice.value = menu.menuprice;
                    upmenudes.value = menu.itemdes;


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
                    {this.props.mkey}
                </td>
                <td>
                    {this.props.mdes}
                </td>
                <td>
                    $ {this.props.mprice}
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
    <UserBox />,
    document.getElementById('content')
);

