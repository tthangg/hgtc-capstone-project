var UserBox = React.createClass({
    getInitialState: function () {
        return { data: [] };
    },
    loadUsersFromServer: function () {
        $.ajax({
            url: '/searchuser',
            data: {
                'userfname': userfname.value,
                'userlname': userlname.value,

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
    updateUserFromServer: function (user) {

        $.ajax({
            url: '/updateuser',
            dataType: 'json',
            data: user,
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
                    <UserUpdateform onUpdateSubmit={this.updateUserFromServer} />
                </div>

                <br />
                <table id='theResult'>
                    <thead>
                        <tr>
                            <th>Key</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Admin</th>
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
            userfname: "",
            userlname: ""
        };
    },

    handleSubmit: function (e) {
        e.preventDefault();

        var userfname = this.state.userfname.trim();
        var userlname = this.state.userlname.trim();


        this.props.onUserSubmit({ userfname: userfname, userlname: userlname});

    },
    handleChange: function (event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    },
    render: function () {

        return (
            <form onSubmit={this.handleSubmit}>
                <h1>Search Users</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>First Name</th>
                            <td>
                                <input name="userfname" id="userfname" value={this.state.userfname} onChange={this.handleChange} />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <input name="userlname" id="userlname" value={this.state.userlname} onChange={this.handleChange} />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input type="submit" value="Search User" />

            </form>
        );
    }
});
var UserUpdateform = React.createClass({
    getInitialState: function () {
        return {
            upduserkey: "",
            upduserfname: "",
            upduserlname: "",
            upduseremail: "",
            upduserphone: "",
            upduseradmin: ""
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },

 
    handleUpSubmit: function (e) {
        e.preventDefault();

        var upduserkey = upuserkey.value;
        var upduserfname = upuserfname.value;
        var upduserlname = upuserlname.value;
        var upduseremail = upuseremail.value;
        var upduserphone = upuserphone.value;
        var upduseradmin = this.state.upselectedOption;
     

        this.props.onUpdateSubmit({
            upduserkey: upduserkey,
            upduserfname: upduserfname,
            upduserlname: upduserlname,
            upduseremail: upduseremail,
            upduserphone: upduserphone,
            upduseradmin: upduseradmin 
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
                        <h1>Update User</h1>
                        <table>
                            <tbody>
                                <tr>
                                    <th>First Name</th>
                                    <td>
                                        <input name="upuserfname" id="upuserfname" value={this.state.upuserfname} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Last Name</th>
                                    <td>
                                        <input name="upuserlname" id="upuserlname" value={this.state.upuserlname} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Email</th>
                                    <td>
                                        <input name="upuseremail" id="upuseremail" value={this.state.upuseremail} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>
                                        <input name="upuserphone" id="upuserphone" value={this.state.upuserphone} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Admin</th>
                                    <td>
                                        <select name='useradmin' id="useradmin" onChange={this.handleOptionChange}>
                                            <option value=""></option>
                                            <option value="0">No</option>
                                            <option value="1">Yes</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table><br />
                        <input type="hidden" name="upuserkey" id="upuserkey" onChange={this.handleUpChange} />
                        <input type="submit" value="Update Employee" />
                    </form>
                </div>
            </div>
        );
    }
});
var UserList = React.createClass({
    render: function () {
        var userNodes = this.props.data.map(function (user) {
            //map the data to individual donations
            return (
                <User
                   
                   ukey={user.userid}
                   ufname={user.userFirstName}
                   ulname={user.userLastName}
                   uemail={user.useremail}
                   uphone={user.userphone}
                   uadmin={user.useradmin}
                >
                </User>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {userNodes}
            </tbody>
        );
    }
});



var User = React.createClass({

    getInitialState: function () {
        return {
            upuserkey: "",
            singledata: []
        };
    },

    updateRecord: function (e) {
        e.preventDefault();
        var theupuserkey = this.props.ukey;

        this.loadSingleUser(theupuserkey);
    },
    loadSingleUser: function (theupuserkey) {
        $.ajax({
            url: '/getsingleuser',
            data: {
                'upuserkey': theupuserkey
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateUser = this.state.singledata.map(function (user) {
                    upuserkey.value = theupuserkey;
                    upuserfname.value = user.userFirstName;
                    upuserlname.value = user.userLastName;
                    upuseremail.value = user.useremail;
                    upuserphone.value = user.userphone;
                    if (user.useradmin == 1) {
                        useradmin.value = '1';
                    } else {
                        useradmin.value = '0';
                    }

                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },





    render: function () {
        //display an individual donation
        if (this.props.uadmin == 1) {
            var admin = "YES";
        } else {
            var admin = "NO";
        }
        return (

            <tr>
                <td>
                    {this.props.ukey}
                </td>
                <td>
                    {this.props.ufname}
                </td>
                <td>
                    {this.props.ulname}
                </td>
                <td>
                    {this.props.uemail}
                </td>
                <td>
                    {this.props.uphone}
                </td>
                <td>
                    {admin}
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

