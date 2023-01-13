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
                            <th>Menu Item</th>
                            <th>Price</th>
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

var UserList = React.createClass({
    render: function () {
        var userNodes = this.props.data.map(function (user) {
            //map the data to individual donations
            return (
                <User
                    //key={user.dbuserkey}
                   mkey={user.menuid}
                   mprice={user.menuprice}
                   mdes={user.itemdes}

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

            </tr>
        );
    }
});


ReactDOM.render(
    <UserBox />,
    document.getElementById('content')
);

