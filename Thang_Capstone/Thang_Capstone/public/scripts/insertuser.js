var UserBox = React.createClass({


    handleUserSubmit: function (user) {
        $.ajax({

            url: '/user/',
            dataType: 'json',
            type: 'POST',
            data: user,
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
            <div className="UserBox">

                <UserForm onUserSubmit={this.handleUserSubmit} />

            </div>
        );
    }

});

var UserForm = React.createClass({

    getInitialState: function () {

        return {
            userid: "",
            userfname: "",
            userlname: "",
            useremail: "",
            userpw: "",
            userpw2: "",
            userphone: "",
            useradmin: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },
    handleSubmit: function (e) {

        e.preventDefault();
        var userfname = this.state.userfname.trim();
        var userlname = this.state.userlname.trim();
        var useremail = this.state.useremail.trim();
        var userpw = this.state.userpw.trim();
        var userpw2 = this.state.userpw2.trim();
        var userphone = this.state.userphone.trim();
        var useradmin = this.state.selectedOption;

        if (!this.validateEmail(useremail)) {
            console.log("Not Email");
            return;
        }
        if (userpw != userpw2) {
            alert("Passwords do not match!!");
            return;
        }
        if (isNaN(userphone)) {
            console.log("Not a Phone Number !!!! duh!!!");
            return;
        }
        if ( !useremail || !userfname || !userlname) {
            console.log("Not Entered");
            return;
        }

        this.props.onUserSubmit({
            userfname: userfname,
            userlname: userlname,
            useremail: useremail,
            userphone: userphone,
            useradmin: useradmin,
            userpw: userpw
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
            <form className="UserForm" onSubmit={this.handleSubmit}>
                <h1> Insert User</h1>
                <h2>User</h2>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>First Name</th>
                            <td>
                                <TextInput
                                    inputType="text"
                                    value={this.state.userfname}
                                    uniqueName="userfname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'userfname')}
                                    errorMessage="First Name is Invalid"
                                    emptyMessage="First Name is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>
                                <TextInput
                                    inputType="text"
                                    value={this.state.userlname}
                                    uniqueName="userlname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'userlname')}
                                    errorMessage="Last Name is Invalid"
                                    emptyMessage="Last Name is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>
                                <TextInput
                                    inputType="text"
                                    value={this.state.useremail}
                                    uniqueName="useremail"
                                    textArea={false}
                                    required={true}
                                    minCharacters={6}
                                    validate={this.validateEmail}
                                    onChange={this.setValue.bind(this, 'useremail')}
                                    errorMessage="Invalid E-Mail Address"
                                    emptyMessage="E-Mail Address is  Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>User Password</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.userpw}
                                    uniqueName="userpw"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'userpw')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>User Password Confirm</th>
                            <td>
                                <TextInput
                                    inputType="password"
                                    value={this.state.userpw2}
                                    uniqueName="userpw2"
                                    textArea={false}
                                    required={true}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'userpw2')}
                                    errorMessage="Invalid Password"
                                    emptyMessage="Password is Required" />
                            </td>
                        </tr>
                        <tr>
                            <th>Phone Number</th>
                            <td>
                                <TextInput
                                    value={this.state.userphone}
                                    uniqueName="userphone"
                                    textArea={false}
                                    required={true}
                                    minCharacters={10}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'userphone')}
                                    errorMessage="Phone Number is Invalid"
                                    emptyMessage="Phone Number Required"
                                />
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
                </table>
                <input type="submit" value="Submit" />
            </form>


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
                        type={this.props.inputType}
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
    <UserBox />,
    document.getElementById('content')
);