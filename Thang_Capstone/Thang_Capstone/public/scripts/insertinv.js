var IventoryBox = React.createClass({


    handleIventorySubmit: function (inv) {
        $.ajax({

            url: '/inv',
            dataType: 'json',
            type: 'POST',
            data: inv,
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
            <div className="IventoryBox">

                <IventoryForm onIventorySubmit={this.handleIventorySubmit} />

            </div>
        );
    }

});

var IventoryForm = React.createClass({

    getInitialState: function () {

        return {
            itemdata:[],
            itemquantity: "",
            quantitytype: "",
        };
    },
    loaditem: function () {
        $.ajax({
            url: '/getitemdetail',
            dataType: 'json',
            cache: false,
            success: function (itemdata) {
                this.setState({ itemdata: itemdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.loaditem();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var itemid = ID.value;
        var itemquantity = this.state.itemquantity;
        var quantitytype = this.state.quantitytype.trim();


        if (!itemquantity  || !quantitytype) {
            console.log("Not Entered");
            return;
        }

        this.props.onIventorySubmit({
            itemid: itemid ,
            itemquantity: itemquantity,
            quantitytype: quantitytype
        });
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
            <form className="IventoryForm" onSubmit={this.handleSubmit}>
                <h1> Insert Iventory</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Item ID</th>
                            <td>
                                <ItemList itemdata={this.state.itemdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Quantity</th>
                            <td>
                                <TextInput
                                    value={this.state.itemquantity}
                                    uniqueName="itemquantity"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'itemquantity')}
                                    errorMessage="The Quantity is Invalid"
                                    emptyMessage="The Quantity is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity Type</th>
                            <td>
                                <TextInput
                                    value={this.state.quantitytype}
                                    uniqueName="quantitytype"
                                    textArea={false}
                                    required={true}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'quantitytype')}
                                    errorMessage="Quantity Type is Invalid"
                                    emptyMessage="Quantity Type is Required"
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
var ItemList = React.createClass({
    render: function () {
        var optionNodes = this.props.itemdata.map(function (Item) {
            return (
                <option
                    key={Item.itemid}
                    value={Item.itemid}
                >
                    {Item.itemname}
                </option>
            );
        });
        return (
            <select name="ID" id="ID" onChange={this.handleChange} >
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
    <IventoryBox />,
    document.getElementById('content')
);