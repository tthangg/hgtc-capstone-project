var MenuBox = React.createClass({


    handleMenuSubmit: function (menu) {
        $.ajax({

            url: '/menu',
            dataType: 'json',
            type: 'POST',
            data: menu,
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
            <div className="MenuBox">

                <MenuForm onMenuSubmit={this.handleMenuSubmit} />

            </div>
        );
    }

});

var MenuForm = React.createClass({

    getInitialState: function () {

        return {
            menuprice: "",
            menudes: "",
        };
    },
    handleSubmit: function (e) {

        e.preventDefault();
        var menuprice = this.state.menuprice;
        var menudes = this.state.menudes.trim();




        if (!menuprice || !menudes) {
            console.log("Not Entered");
            return;
        }

        this.props.onMenuSubmit({
            menuprice: menuprice,
            menudes: menudes
        });
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
            <form className="MenuForm" onSubmit={this.handleSubmit}>
                <h1> Insert Menu</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Menu Item</th>
                            <td>
                                <TextInput
                                    value={this.state.menudes}
                                    uniqueName="menudes"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'menudes')}
                                    errorMessage="Menu Item is Invalid"
                                    emptyMessage="Menu Item is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Menu Price</th>
                            <td>
                                <TextInput
                                    value={this.state.menuprice}
                                    uniqueName="menuprice"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'menuprice')}
                                    errorMessage="The Price is Invalid"
                                    emptyMessage="The Price is Required"
                                />
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
    <MenuBox />,
    document.getElementById('content')
);