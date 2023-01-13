var IventoryBox = React.createClass({


    handleIventorySubmit: function (inv) {
        $.ajax({

            url: '/hour',
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
            hourdes: "",
            hourstart: "",
            hourend: "",
        };
    },
    handleOptionChange: function (e) {
        this.setState({
            selectedOption: e.target.value
        });
    },


    componentDidMount: function () {
        this.loaditem();
    },

    handleSubmit: function (e) {

        e.preventDefault();

        var hourdes = this.state.selectedOption;
        var hourstart = this.state.hourstart;
        var hourend = this.state.hourend;


        if (!hourstart || !hourend || !hourdes) {
            console.log("Not Entered");
            return;
        }

        this.props.onIventorySubmit({
            hourdes: hourdes ,
            hourstart: hourstart,
            hourend: hourend
        });
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
                <h1> Insert Schedule</h1>
                <table id="form">
                    <tbody>
                        <tr>
                            <th>Period</th>
                            <td>
                                <select name='hourdes' id="hourdes" onChange={this.handleOptionChange}>
                                    <option value=""></option>
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Dinner">Dinner</option>
                                </select>
                            </td>
                        </tr>
                 
                        <tr>
                            <th>Start Time</th>
                            <td>
                                <TextInput
                                    inputType="time"
                                    value={this.state.hourstart}
                                    uniqueName="hourstart"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'hourstart')}
                                    errorMessage="The Period is Invalid"
                                    emptyMessage="The Period is Required"
                                />
                            </td>
                        </tr>
                        <tr>
                            <th>Quantity Type</th>
                            <td>
                                <TextInput
                                    inputType="time"
                                    value={this.state.hourend}
                                    uniqueName="hourend"
                                    textArea={false}
                                    required={true}
                                    minCharacters={1}
                                    validate={this.commonValidate}
                                    onChange={this.setValue.bind(this, 'hourend')}
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
    <IventoryBox />,
    document.getElementById('content')
);