var ItemBox = React.createClass({


    handleItemSubmit: function (item) {
        $.ajax({

            url: '/item',
            dataType: 'json',
            type: 'POST',
            data: item,
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
            <div className="ItemBox">

                <ItemForm onItemSubmit={this.handleItemSubmit} />

            </div>
        );
    }

});

var ItemForm = React.createClass({

    getInitialState: function () {

        return {
            itemcost: "",
            itemsize: "",
            itemweight: "",
            itemname: "",
        };
    },
    handleSubmit: function (e) {

        e.preventDefault();

        var itemcost = this.state.itemcost;
        var itemsize = this.state.itemsize.trim();
        var itemweight = this.state.itemweight.trim();
        var itemname = this.state.itemname.trim();


        if (!itemcost || !itemsize || !itemweight || !itemname) {
            console.log("Not Entered");
            return;
        }

        this.props.onItemSubmit({
            itemcost: itemcost,
            itemsize: itemsize,
            itemweight: itemweight,
            itemname: itemname
        });
    },


    validateDollars: function (value) {

        var regex = /^\$?[0-9]+(\.[0-9][0-9])?$/;
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
            <form className="ItemForm" onSubmit={this.handleSubmit}>
                <h1> Insert Item</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Item Name</th>
                            <td>
                                <TextInput
                                    value={this.state.itemname}
                                    uniqueName="itemname"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'itemname')}
                                    errorMessage="Item Name is Invalid"
                                    emptyMessage="Item Name is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Cost</th>
                            <td>
                                <TextInput
                                    value={this.state.itemcost}
                                    uniqueName="itemcost"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.validateDollars}
                                    onChange={this.setValue.bind(this, 'itemcost')}
                                    errorMessage="The Cost is Invalid"
                                    emptyMessage="The Cost is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Size</th>
                            <td>
                                <TextInput
                                    value={this.state.itemsize}
                                    uniqueName="itemsize"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'itemsize')}
                                    errorMessage="Item Size is Invalid"
                                    emptyMessage="Item Size is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Weight</th>
                            <td>
                                <TextInput
                                    value={this.state.itemweight}
                                    uniqueName="itemweight"
                                    textArea={false}
                                    required={true}
                                    minCharacters={6}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'itemweight')}
                                    errorMessage="Item Weight is Invalid"
                                    emptyMessage="Item Weight is Required"
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
    <ItemBox />,
    document.getElementById('content')
);