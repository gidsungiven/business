import React from "react";
import { Formik, useField, Form, Field } from "formik";
import {
    TextField,
    Checkbox,
    Select,
    FormHelperText,
    FormControlLabel,
    InputLabel,
    Radio,
    Switch,
    MenuItem,
    RadioGroup,
    FormControl,
    createMuiTheme,
    Typography,
    CircularProgress,
    Chip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { fieldToTextField } from "formik-material-ui";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";

const formLabelsTheme = createMuiTheme({ overrides: { MuiFormLabel: { asterisk: { color: "#db3131", }, }, }, });

export const Forms = (data) => {
    const onChangeRuleHandler = (elementId, elementName, elementValue, anchor) => {
        if (typeof data.onChangeEvent === "function") {
            data.onChangeRuleHandler(elementId, elementName, elementValue, anchor);
        }
    };
    return (
        <div>
            <Formik initialValues={data.initialValues}
                validationSchema={data.validationSchema}
                onSubmit={(values) => {
                    //add spinner here to prevent spam resubmission          
                    data.setIsSubmitting(true);
                    data.onSubmitAction(values);
                    //spinner end        
                }}>
                {(props) => (
                    <Form>
                        <Fields fields={data.fields} onChangeRuleHandler={onChangeRuleHandler} />
                        {data.formButtons ? data.formButtons : null}
                    </Form>)}
            </Formik>
        </div>);
};
export const Fields = ({ fields = [], onChangeRuleHandler, onChangeCallback, showFormHelperText, }) => {
    const hasRequired = fields.some((field) => {
        return field.required ? field.required : false;
    });
    const showRequiredHelpTxt = showFormHelperText && showFormHelperText == false;

    return (
        <MuiThemeProvider theme={formLabelsTheme}>
            {showRequiredHelpTxt != false && hasRequired ?
                (<FormHelperText>
                    <span style={{ color: "#db3131" }}>*</span> indicates a Required field
                </FormHelperText>) : null}
            {fields.map((field, i) => {
                let isFullWidth = !!field.size ? false : true; let fieldSize = field.size === "small" ? "25%" : field.size === "medium" ? "50%" : null;
                if (!field.hidden) {
                    switch (field.type) {
                        case "TEXT":
                            return (
                                <CustomTextInput label={field.label} {...field} style={{ width: fieldSize }}
                                    name={field.name} type="input" placeholder={field.placeholder} key={i}
                                    fullWidth={isFullWidth} disabled={field.disabled} onChangeRuleHandler={onChangeRuleHandler}
                                    onChangeCallback={onChangeCallback} anchor={field.anchor} />);
                        case "TEXT_MULTI":
                            return (<CustomTextInput label={field.label} {...field} multiline name={field.name}
                                type="input" placeholder={field.placeholder} key={i} fullWidth={isFullWidth}
                                disabled={field.disabled} onChangeRuleHandler={onChangeRuleHandler} onChangeCallback={onChangeCallback}
                                anchor={field.anchor} />);
                        case "SELECT":
                            const blankOption = <MenuItem value=""> &nbsp; </MenuItem>;
                            const selectOptions = field.options ? (field.options.map((option, i) => {
                                return (
                                    <MenuItem value={option.value} key={i}> {option.label}
                                    </MenuItem>);
                            }))
                                : (
                                    <MenuItem value="" key={i} disabled>No Options
                                    </MenuItem>); selectOptions.unshift(blankOption);
                            return (
                                <div key={i}>
                                    <CustomSelect label={field.label} name={field.name}
                                        {...field} disabled={field.disabled} onChangeRuleHandler={onChangeRuleHandler}
                                        onChangeCallback={field.onChangeCallback ? field.onChangeCallback : onChangeCallback} anchor={field.anchor}>
                                        {selectOptions}
                                    </CustomSelect>
                                </div>);
                        case "SELECT_MULTI":
                            const selectOptionsMulti = field.options.map((option, i) => {
                                return (
                                    <MenuItem value={option.value} key={i}>
                                        {option.label}
                                    </MenuItem>);
                            });
                            return (
                                <div key={i}>
                                    <CustomSelectMulti label={field.label} name={field.name} multiple {...field}
                                        disabled={field.disabled} onChangeRuleHandler={onChangeRuleHandler}
                                        onChangeCallback={onChangeCallback} anchor={field.anchor}>
                                        {selectOptionsMulti}
                                    </CustomSelectMulti>
                                </div>);
                        case "CHECKBOX":
                            return (
                                <CustomCheckBox name={field.name} key={i} label={field.label} disabled={field.disabled}
                                    onChangeRuleHandler={onChangeRuleHandler} onChangeCallback={onChangeCallback} anchor={field.anchor}>
                                    {field.label}
                                </CustomCheckBox>);
                        case "RADIO":
                            const radioButtons = field.options.map((option, i) => {
                                return (
                                    <CustomRadioButton name={field.name} type="radio" value={option.value} label={option.label} key={i} />);
                            });
                            return (
                                <div key={i}>
                                    <InputLabel>{field.label}</InputLabel>
                                    <RadioGroup name={field.name} value={field.value} row disabled={field.disabled} onChange={(e) => {
                                        if (typeof onChangeRuleHandler === "function") {
                                            onChangeRuleHandler(field.name, field.label, e.target.value, field.anchor);
                                        }
                                        if (typeof onChangeCallback === "function") {
                                            onChangeCallback(field.name, e.target.value);
                                        }
                                    }} anchor={field.anchor}>
                                        {radioButtons}
                                    </RadioGroup>
                                </div>);
                        case "SWITCH":
                            return (
                                <div key={i}>
                                    <CustomSwitch name={field.name} label={field.label} disabled={field.disabled}
                                        onChangeRuleHandler={onChangeRuleHandler} onChangeCallback={onChangeCallback}
                                        anchor={field.anchor}                  >                    {field.label}
                                    </CustomSwitch>                </div>);
                        case "SWITCH_YESNO":
                            return (
                                <div key={i}>
                                    <InputLabel>{field.label}</InputLabel>
                                    <CustomSwitchYN name={field.name} label={field.label} disabled={field.disabled}
                                        onChangeRuleHandler={onChangeRuleHandler} onChangeCallback={onChangeCallback} anchor={field.anchor} />
                                </div>);
                        case "AUTOCOMPLETE":
                            return (<div key={i}>
                                <Field filterSelectedOptions size={field.size} name={field.name} component={CustomAutocomplete}
                                    label={field.label} options={field.options} getOptionLabel={(option) => option.label ? option.label : ""}
                                    textFieldProps={{ fullWidth: true, margin: "dense", variant: "outlined", }}
                                    getOptionSelected={(option, value) => option.label === value || JSON.stringify(option) === JSON.stringify(value)}
                                    disabled={field.disabled} onChangeRuleHandler={(label, value, anchor) => {
                                        if (typeof onChangeRuleHandler === "function") { onChangeRuleHandler(label, value, anchor); }
                                    }} onChangeCallback={(label, value) => {
                                        if (typeof onChangeCallback === "function") { onChangeCallback(field.name, value); }
                                    }} anchor={field.anchor} />
                            </div>);
                        case "AUTOCOMPLETE_MULTI":
                            return (<div key={i}>
                                <Field multiple disableCloseOnSelect filterSelectedOptions
                                    limitTags={field.limitTag} size={field.size} name={field.name}
                                    component={CustomAutocomplete} label={field.label} options={field.options}
                                    getOptionLabel={(option) => option.label} textFieldProps={{ fullWidth: true, margin: "dense", variant: "outlined", }}
                                    getOptionSelected={(option, value) => option.label === value.label || JSON.stringify(option) === JSON.stringify(value)}
                                    disabled={field.disabled} onChangeRuleHandler={(label, value, anchor) => {
                                        if (typeof onChangeRuleHandler === "function") {
                                            onChangeRuleHandler(label, value, anchor);
                                        }
                                        if (typeof onChangeCallback === "function") {
                                            onChangeCallback(field.name, value);
                                        }
                                    }} anchor={field.anchor} />
                            </div>);
                        case "TYPEAHEAD":
                            return (<div key={i}>
                                <Field freeSolo autoSelect filterSelectedOptions size={field.size}
                                    name={field.name} component={CustomAutocomplete} label={field.label}
                                    options={field.options} getOptionLabel={(option) => option.label || option}
                                    textFieldProps={{ fullWidth: true, margin: "dense", variant: "outlined", }}
                                    getOptionSelected={(option, value) => option.label === value || option === value || JSON.stringify(option) === JSON.stringify(value)}
                                    disabled={field.disabled} onChangeRuleHandler={(label, value, anchor) => {
                                        if (typeof onChangeRuleHandler === "function") {
                                            onChangeRuleHandler(label, value, anchor);
                                        }
                                        if (typeof onChangeCallback === "function") {
                                            onChangeCallback(field.name, value);
                                        }
                                    }} anchor={field.anchor} />
                            </div>);
                        case "HIDDEN":
                            return (
                                <TextField key={i} name={field.name} type="hidden" placeholder={field.placeholder}
                                    {...field} onChange={(e) => {
                                        field.onChange(field.name)(e.target.value);
                                        if (typeof onChangeRuleHandler === "function") {
                                            onChangeRuleHandler(field.name, field.label, e.target.value, field.anchor);
                                        }
                                        if (typeof onChangeCallback === "function") {
                                            onChangeCallback(field.name, e.target.value);
                                        }
                                    }} anchor={field.anchor} />);
                        case "STATIC":
                        default:
                            return (
                                <CustomTextInput label={field.label} key={i} style={{ width: fieldSize }}
                                    fullWidth={isFullWidth} name={field.name} type="input" placeholder={field.placeholder}
                                    InputProps={{ readOnly: true }}
                                    {...field} disabled={field.disabled} anchor={field.anchor} />);
                        case "INTEGER": return (<CustomIntegerInput label={field.label}
                            {...field} style={{ width: fieldSize }} name={field.name} type="number"
                            placeholder={field.placeholder} key={i} fullWidth={isFullWidth} disabled={field.disabled}
                            onChangeRuleHandler={onChangeRuleHandler} onChangeCallback={onChangeCallback} anchor={field.anchor} />);
                    }
                }
            })}    </MuiThemeProvider>);
};
export const CustomTextInput = ({ label, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta] = useField(props);
    let isValid = meta.touched && meta.error ? true : false;
    return (
        <>
            <TextField  {...field} {...props} error={isValid} label={label} variant="outlined" margin="dense" color="secondary" fullWidth
                onChange={(e) => {
                    field.onChange(props.name)(e.target.value);
                    if (typeof onChangeRuleHandler === "function") {
                        onChangeRuleHandler(props.name, label, e.target.value, props.anchor);
                    }
                    if (typeof onChangeCallback === "function") { onChangeCallback(props.name, e.target.value); }
                }} />
            <FormHelperText error>
                {isValid ? meta.error : null}
            </FormHelperText>
        </>);
};
export const CustomIntegerInput = ({ label, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta] = useField(props);
    let isValid = meta.touched && meta.error ? true : false;
    return (<>
        <TextField {...field} {...props} error={isValid} label={label} variant="outlined" margin="dense"
            color="secondary" fullWidth onChange={(e) => {
                field.onChange(props.name)(e.target.value);
                if (typeof onChangeRuleHandler === "function") {
                    onChangeRuleHandler(props.name, label, e.target.value, props.anchor);
                }
                if (typeof onChangeCallback === "function") {
                    onChangeCallback(props.name, e.target.value);
                }
            }} />
        <FormHelperText error>
            {isValid ? meta.error : null}
        </FormHelperText>
    </>);
};
export const CustomRadioButton = ({ label, ...props }) => {
    const [field, meta] = useField(props, "checkbox");
    let isValid = meta.error ? true : false;
    return (
        <>
            <FormControlLabel {...field} control={<Radio />} label={label} />
            <FormHelperText error>{isValid ? meta.error : null}</FormHelperText>
        </>);
};
export const CustomCheckBox = ({ children, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta] = useField(props, "checkbox");
    let isValid = meta.touched && meta.error ? true : false;
    return (
        <>
            <FormControlLabel control={<Checkbox {...field} {...props} onChange={(e) => {
                if (typeof onChangeRuleHandler === "function") {
                    onChangeRuleHandler(props.name, props.label, e.target.value, props.anchor);
                }
                if (typeof onChangeCallback === "function") {
                    onChangeCallback(props.name, e.target.value);
                }
            }} checked={meta.value} />} label={children} />
            <FormHelperText error>{isValid ? meta.error : null}</FormHelperText>
        </>);
};
export const CustomSwitch = ({ children, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta] = useField(props, "checkbox");
    let isValid = meta.touched && meta.error ? true : false;
    return (<>
        <FormControlLabel control={<Switch {...field} {...props} onChange={(e) => {
            if (typeof onChangeRuleHandler === "function") {
                onChangeRuleHandler(props.name, props.label, e.target.value, props.anchor);
            }
            if (typeof onChangeCallback === "function") {
                onChangeCallback(props.name, e.target.value);
            }
        }} />} label={children} />
        <FormHelperText error>{isValid ? meta.error : null}</FormHelperText>
    </>);
};
export const CustomSwitchYN = ({ onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta] = useField(props, "checkbox");
    let isValid = meta.touched && meta.error ? true : false;
    return (<>
        <FormControlLabel control={<Switch {...field} {...props} onChange={(e) => {
            if (typeof onChangeRuleHandler === "function") {
                onChangeRuleHandler(props.name, props.label, e.target.value, props.anchor);
            }
            if (typeof onChangeCallback === "function") {
                onChangeCallback(props.name, e.target.value);
            }
        }} />} label={field.value ? "Yes" : "No"} />
        <FormHelperText error>{isValid ? meta.error : null}</FormHelperText>
    </>);
};
export const CustomSelect = ({ label, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta, helpers] = useField(props);
    let isValid = meta.touched && meta.error ? true : false;
    return (
        <>
            <TextField label={label} variant="outlined" select {...field} {...props} style={{ minWidth: 200 }}
                margin="dense" color="secondary" error={isValid} fullWidth onChange={(e) => {
                    helpers.setValue(e.target.value);
                    if (typeof onChangeRuleHandler === "function") {
                        onChangeRuleHandler(props.name, label, e.target.value, props.anchor);
                    }
                    if (typeof onChangeCallback === "function") { onChangeCallback(props.name, e.target.value); }
                }} />
            <FormHelperText error>{isValid ? meta.error : null}</FormHelperText>
        </>);
};
export const CustomSelectMulti = ({ label, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const [field, meta, helpers] = useField(props);
    let isValid = meta.touched && meta.error ? true : false;
    return (
        <>
            <FormControl>
                <InputLabel htmlFor={props.id || props.name} error={isValid}> {label}
                </InputLabel>
                <Field {...field} {...props} error={isValid} as={Select} style={{ minWidth: 200 }} margin="dense" onChange={(e) => {
                    helpers.setValue(e.target.value);
                    if (typeof onChangeRuleHandler === "function") {
                        onChangeRuleHandler(props.name, label, e.target.value, props.anchor);
                    }
                    if (typeof onChangeCallback === "function") { onChangeCallback(props.name, e.target.value); }
                }} />
                <FormHelperText error>{isValid ? meta.error : null}</FormHelperText>
            </FormControl>
        </>);
};
export const CustomAutocomplete = ({ textFieldProps, onChangeRuleHandler, onChangeCallback, ...props }) => {
    const { form: { setTouched, setFieldValue }, } = props;
    const { error, helperText, ...field } = fieldToTextField(props);
    const { name, label } = field;
    const setValue = (name, value) => {
        /* if freeSolo activated, manually convert entered text     
        ** into {label:label, value:value} format     
        ** else just set selected value as is */
        if (JSON.stringify(props.multiple) === undefined && value !== null && JSON.stringify(value.label) === undefined) {
            setFieldValue(name, { label: value, value: value });
        }
        else {
            setFieldValue(name, value);
        }
    };
    return (
        <Autocomplete {...props} {...field} onChange={(_, value) => {
            setValue(name, value);
            if (typeof onChangeRuleHandler === "function") {
                onChangeRuleHandler(textFieldProps.name, label, value, textFieldProps.anchor);
            }
            if (typeof onChangeCallback === "function") {
                onChangeCallback(props.name, value);
            }
        }}
            onBlur={() => setTouched({ [name]: true })}
            renderInput={(props) => (<TextField {...props} {...textFieldProps} helperText={helperText} error={error} label={label} />)}
        />);
};
export const CustomAutocompleteOnSearch = (props) => {
    let fieldName = props.fieldName;
    let error = props.errors[fieldName] ? true : false;
    let helperText = props.errors[fieldName];
    if (props.initLoadFlag && props.initLoadFlag == true) { error = false; helperText = ""; }
    return (
        <>
            <Autocomplete  {...props} multiple={props.multiple ? props.multiple : null}
                filterSelectedOptions value={props.fieldVal} open={props.openFlag}
                onOpen={() => {
                    props.onOpenHandler(true);
                }}
                onClose={() => {
                    props.onCloseHandler(false);
                }} getOptionSelected={(option, value) => option === value} getOptionLabel={(option) => option}
                options={props.options} noOptionsText="Type to Search..." loading={props.loading}
                loadingText={
                    <Typography>
                        <CircularProgress color="inherit" size={20} /> Loading ...
                  </Typography>}
                onInputChange={(e, value) => value.length > 2 ? props.onInputChangeHandlerFn(value) : null}
                onChange={(e, value) => {
                    props.setFieldValue(fieldName, value); props.onChangeHandlerFn(value); props.setTouched({ [fieldName]: true });
                }}
                onBlur={() => props.setTouched({ [fieldName]: true })}
                renderInput={(params) => (<TextField {...params} placeholder={props.placeholder} name={fieldName}
                    label={
                        <span>
                            {" "} {props.label} <span style={{ color: "#ff0000" }}>*</span>
                        </span>} variant="outlined" margin="dense"
                    helperText={helperText} error={error}
                    InputProps={{
                        ...params.InputProps, endAdornment: (
                            <React.Fragment>
                                {params.InputProps.endAdornment}
                            </React.Fragment>),
                    }} />)}
                renderTags={(tagValue, getTagProps) => {
                    if (typeof props.onDeleteTagHandler === "function") {
                        return tagValue.map((option, index) => (
                            <Chip {...getTagProps({ index })} label={option}
                                onDelete={() => props.onDeleteTagHandler(option)} />));
                    }
                    else {
                        return tagValue.map((option, index) => (
                            <Chip {...getTagProps({ index })} label={option} />));
                    }
                }} />
        </>);
};