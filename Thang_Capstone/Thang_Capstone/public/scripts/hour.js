var HoursBox = React.createClass({
    getInitialState: function () {
        return {
            data: []
        };
    },
    loadHoursFromServer: function () {
        $.ajax({
            url: '/gethour/',
            data: {
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
    updateSingleHoursFromServer: function (hour) {

        $.ajax({
            url: '/updatehour',
            dataType: 'json',
            data: hour,
            type: 'POST',
            cache: false,
            success: function (upsingledata) {
                this.setState({ upsingledata: upsingledata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
        window.location.reload(true);
    },
    componentDidMount: function () {
        this.loadHoursFromServer();
    },

    render: function () {
        return (
            <div><center>
                <h1>Hours of Operation</h1>
                <br />
                <div>         
                        <table id="theResult">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Period</th>
                                    <th>Opening Time</th>
                                    <th>Closing Time</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <HoursList data={this.state.data} />
                        </table>
                    <div id="theright">
                        <h2>Update Hours</h2>
                        <HoursUpdateform onUpdateSubmit={this.updateSingleHoursFromServer} />
                    </div>
                </div></center>
            </div>
        );
    }
});



var HoursUpdateform = React.createClass({
    getInitialState: function () {
        return {
            updhourid: "",
            updhouropen: "",
            updhourclose: ""
        };
    },
    handleUpOptionChange: function (e) {
        this.setState({
            upselectedOption: e.target.value
        });
    },

    componentDidMount: function () {
    },

    handleUpSubmit: function (e) {
        e.preventDefault();

        var updhoursid = hID.value;
        var updhstart = uphstart.value;
        var updhend = uphend.value;

       
        this.props.onUpdateSubmit({
            updhoursid: updhoursid,
            updhstart: updhstart,
            updhend: updhend
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

                        <table>
                            <tbody>
                                <tr>
                                    <th>Opening Time</th>
                                    <td>
                                        <input inputType="time" name="uphstart" id="uphstart" value={this.state.uphstart} onChange={this.handleUpChange} />
                                    </td>
                                </tr>
                                <tr>
                                    <th>Closing Time</th>
                                    <td>
                                        <input inputType="time" name="uphend" id="uphend" value={this.state.uphend} onChange={this.handleUpChange} />
                                    </td>
                                </tr>

                            </tbody>
                        </table><br />
                        <input type="hidden" name="hID" id="hID" onChange={this.handleUpChange} />
                        <input id="submit" type="submit" value="Update Hours" />
                    </form>
                </div>
            </div>
        );
    }
});

var HoursList = React.createClass({
    render: function () {
        var hoursNodes = this.props.data.map(function (hours) {
            return (
                <Hours
                    hID={hours.hourid}
                    hdes={hours.hourdes}
                    hstart={hours.hourstart}
                    hend={hours.hourend}
                >
                </Hours>
            );

        });

        //print all the nodes in the list
        return (
            <tbody>
                {hoursNodes}
            </tbody>
        );
    }
});



var Hours = React.createClass({
    getInitialState: function () {
        return {
            hID: "",
            singledata: []
        };
    },
    updateRecord: function (e) {
        e.preventDefault();
        var thehID = this.props.hID;

        this.loadSingleHour(thehID);
    },
    loadSingleHour: function (thehID) {
        $.ajax({
            url: '/getsinglehour/',
            data: {
                'uphourid': thehID
            },
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({ singledata: data });
                console.log(this.state.singledata);
                var populateHour = this.state.singledata.map(function (h) {
                    hID.value = h.hourid;
                    uphstart.value = h.hourstart;
                    uphend.value = h.hourend;
                });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });

    },

    render: function () {

        return (

            <tr>
                <td>
                    {this.props.hID}
                </td>
                <td>
                    {this.props.hdes}
                </td>
                <td>
                    {this.props.hstart.slice(0,5)}
                </td>
                <td>
                    {this.props.hend.slice(0, 5)}
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
    <HoursBox />,
    document.getElementById('content')
);

