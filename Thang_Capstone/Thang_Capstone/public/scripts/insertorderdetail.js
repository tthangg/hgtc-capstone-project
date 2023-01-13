var OrderBox = React.createClass({


    handleOrderSubmit: function (orderd) {
        $.ajax({

            url: '/orderd',
            dataType: 'json',
            type: 'POST',
            data: orderd,
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
            orderdata:[],
            menudata: [],
            orderquantity: "",
            ordernote: "",
        };
    },
    loadmenu: function () {
        $.ajax({
            url: '/getmenudetail',
            dataType: 'json',
            cache: false,
            success: function (menudata) {
                this.setState({ menudata: menudata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    loadorder: function () {
        $.ajax({
            url: '/getuserorder',
            dataType: 'json',
            cache: false,
            success: function (orderdata) {
                this.setState({ orderdata: orderdata });
            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.loadmenu();
        this.loadorder();

    },

    handleSubmit: function (e) {

        e.preventDefault();
        var orderid = oID.value;
        var menuid = mID.value;
        var orderquantity = this.state.orderquantity;
        var ordernote = this.state.ordernote.trim();

 

        if (isNaN(orderquantity)) {
            console.log("Not a Phone Number !!!! duh!!!");
            return;
        }
        if (!orderid || !menuid || !orderquantity || !ordernote) {
            console.log("Not Entered");
            return;
        }

        this.props.onOrderSubmit({
            orderid: orderid,
            menuid: menuid,
            orderquantity: orderquantity,
            ordernote: ordernote,
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
                <h1> Insert Details</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Order ID</th>
                            <td>
                                <OrderList orderdata={this.state.orderdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Menu Item</th>
                            <td>
                                <MenuList menudata={this.state.menudata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity</th>
                            <td>
                                <TextInput
                                    value={this.state.orderquantity}
                                    uniqueName="orderquantity"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'orderquantity')}
                                    errorMessage="Quantity is Invalid"
                                    emptyMessage="Quantity is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Order Note</th>
                            <td>
                                <TextInput
                                    value={this.state.ordernote}
                                    uniqueName="ordernote"
                                    textArea={true}
                                    required={false}
                                    minCharacters={2}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'ordernote')}
                                    errorMessage=""
                                    emptyMessage=""
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
var MenuList = React.createClass({
    render: function () {
        var optionNodes = this.props.menudata.map(function (Menu) {
            return (
                <option
                    key={Menu.menuid}
                    value={Menu.menuid}
                >
                    {Menu.itemdes}
                </option>
            );
        });
        return (
            <select name="mID" id="mID" onChange={this.handleChange} >
                <option value=""></option>
                {optionNodes}
            </select>
        );
    }
});
var OrderList = React.createClass({
    render: function () {
        var optionNodes = this.props.orderdata.map(function (Order) {
            return (
                <option
                    key={Order.orderid}
                    value={Order.orderid}
                >
                    {Order.orderid}
                </option>
            );
        });
        return (
            <select name="oID" id="oID" onChange={this.handleChange} >
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