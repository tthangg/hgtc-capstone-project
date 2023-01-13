var OrderBox = React.createClass({


    handleOrderSubmit: function (uorder) {
        $.ajax({

            url: '/uorder',
            dataType: 'json',
            type: 'POST',
            data: uorder,
            success: function (data) {
                this.setState({ data: data });
            }.bind(this),

            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)

        });
    },


    render: function () {

        return (
            <div className="OrderBox">

                <OrderForm onOrderSubmit={this.handleOrderSubmit} />

            </div>
        );
    }

});

var OrderForm = React.createClass({

    getInitialState: function () {

        return {
            userdata:[],
            orderstatus: "",

        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    loaduser: function () {
        $.ajax({
            url: '/getuserdetail',
            dataType: 'json',
            cache: false,
            success: function (userdata) {
                this.setState({ userdata: userdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    componentDidMount: function () {
        this.loaduser();
    },
    handleSubmit: function (e) {

        e.preventDefault();

        var userid = uID.value;
        var orderstatus = this.state.selectedOption;


        this.props.onOrderSubmit({
            userid: userid,
            orderstatus: orderstatus,

        });
    },

    validateEmail: function (value) {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(value);
    },
    validateDollars: function (value) {

        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
        return regex.test(value);
    },
    validateNumber: function (value) {
        var regex = /^[1-9]\d*$/;
        return regex.test(value);
    },
    commonValidate: function () {

        return true;
    },
    setValue: function (field, event) {

        var object = {};
        object[field] = event.target.value;
        this.setState(object);
    },

    render: function () {

        return (
            <form className="OrderForm" onSubmit={this.handleSubmit}>
                <h1> Insert Order</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>User ID</th>
                            <td>
                                <UserList userdata={this.state.userdata} />
                            </td>
                        </tr>

                    </tbody>
                </table>
                <input type="submit" value="Submit" />
            </form>


        );

    }



});
var UserList = React.createClass({
    render: function () {
        var optionNodes = this.props.userdata.map(function (User) {
            return (
                <option
                    key={User.userid}
                    value={User.userid}
                >
                    {User.userFirstName} {User.userLastName} 
                </option>
            );
        });
        return (
            <select name="uID" id="uID" onChange={this.handleChange} >
                <option value=""></option>
                {optionNodes}
            </select>
        );
    }
});
var InputError = React.createClass({
    getInitialState: function () {
        return {
            message: 'Input is invalid'
        };
    },
    render: function () {
        var errorClass = classNames(this.props.className, {
            'error_container': true,
            'visible': this.props.visible,
            'invisible': !this.props.visible
        });

        return (
            <div className={errorClass}>
                <td>{this.props.errorMessage}</td>
            </div>
        )
    }

});

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            isEmpty: true,
            value: null,
            valid: false,
            errorMessage: '',
            errorVisible: false
        };
    },

    handleChange: function (event) {
        this.validation(event.target.value);
        if (this.props.onChange) {
            this.props.onChange(event);
        }
    },

    validation: function (value, valid) {
        if (typeof valid === 'undefined') {
            valid = true;
        }

        var message = "";
        var errorVisible = false;

        if (!valid) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }
        else if (this.props.required && jQuery.isEmptyObject(value)) {
            message = this.props.emptyMessage;
            valid = false;
            errorVisible = true;
        }
        else if (value.length < this.props.minCharacters) {
            message = this.props.errorMessage;
            valid = false;
            errorVisible = true;
        }

        this.setState({
            value: value,
            isEmpty: jQuery.isEmptyObject(value),
            valid: valid,
            errorMessage: message,
            errorVisible: errorVisible
        });

    },


    handleBlur: function (event) {
        var valid = this.props.validate(event.target.value);
        this.validation(event.target.value, valid);
    },
    render: function () {
        if (this.props.textArea) {
            return (
                <div className={this.props.uniqueName}>
                    <textarea
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        } else {
            return (
                <div className={this.props.uniqueName}>
                    <input
                        name={this.props.uniqueName}
                        id={this.props.uniqueName}
                        placeholder={this.props.text}
                        className={'input input-' + this.props.uniqueName}
                        onChange={this.handleChange}
                        onBlur={this.handleBlur}
                        value={this.props.value} />

                    <InputError
                        visible={this.state.errorVisible}
                        errorMessage={this.state.errorMessage} />
                </div>
            );
        }
    }
});






ReactDOM.render(
    <OrderBox />,
    document.getElementById('content')
);