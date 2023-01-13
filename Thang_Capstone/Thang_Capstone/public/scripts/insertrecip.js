var RecipeBox = React.createClass({


    handleRecipeSubmit: function (recip) {
        $.ajax({

            url: '/recip',
            dataType: 'json',
            type: 'POST',
            data: recip,
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
            <div className="RecipeBox">

                <RecipeForm onRecipeSubmit={this.handleRecipeSubmit} />

            </div>
        );
    }

});

var RecipeForm = React.createClass({

    getInitialState: function () {

        return {
            menudata: [],
            itemdata: [],
            menuprice: "",
            menudes: "",
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

    componentDidMount: function () {
        this.loadmenu();
        this.loaditem();
        
    },
    handleSubmit: function (e) {

        e.preventDefault();
        var itemid = iID.value;
        var menuid = mID.value;
        var quantityused = this.state.quantityused;
        var quantitytype = this.state.quantitytype.trim();





        if (!quantityused || !quantitytype) {
            console.log("Not Entered");
            return;
        }

        this.props.onRecipeSubmit({
            itemid: itemid,
            menuid: menuid,
            quantityused : quantityused ,
            quantitytype: quantitytype
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
            <form className="RecipeForm" onSubmit={this.handleSubmit}>
                <h1> Insert Recipe</h1>
                <table id="form">
                    <tbody>

                        <tr>
                            <th>Menu Item</th>
                            <td>
                                <MenuList menudata={this.state.menudata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Item Used</th>
                            <td>
                                <ItemList itemdata={this.state.itemdata} />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity Used</th>
                            <td>
                                <TextInput
                                    value={this.state.quantityused}
                                    uniqueName="quantityused"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.validateNumber}
                                    onChange={this.setValue.bind(this, 'quantityused')}
                                    errorMessage="Quantity is Invalid"
                                    emptyMessage="Quantity is Required"
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
                                    errorMessage="The Type is Invalid"
                                    emptyMessage="The Type is Required"
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
            <select name="iID" id="iID" onChange={this.handleChange} >
                <option value=""></option>
                {optionNodes}
            </select>
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
    <RecipeBox />,
    document.getElementById('content')
);