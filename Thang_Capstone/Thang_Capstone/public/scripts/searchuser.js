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
    componentDidMount: function () {
        this.loadUsersFromServer();
        setInterval(this.loadloadUsersFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div>

                <Userform2 onUserSubmit={this.loadUsersFromServer} />
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

var UserList = React.createClass({
    render: function () {
        var userNodes = this.props.data.map(function (user) {
            //map the data to individual donations
            return (
                <User
                    //key={user.dbuserkey}
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
            </tr>
        );
    }
});


ReactDOM.render(
    <UserBox />,
    document.getElementById('content')
);

