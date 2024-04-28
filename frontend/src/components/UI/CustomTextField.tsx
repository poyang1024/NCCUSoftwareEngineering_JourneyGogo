import TextField, { TextFieldProps } from '@mui/material/TextField';

type CustomTextFieldProps = TextFieldProps
const CustomTextField = (props: CustomTextFieldProps) => {

    const { InputProps: parentProps, InputLabelProps: parentLabelProps, ...otherProps } = props

    return (
        <TextField
            InputLabelProps={{
                ...parentLabelProps,
                shrink: false,
                style: {
                    textAlign: "center"
                }
            }}
            InputProps={{
                ...parentProps
            }}
            {...otherProps}
            sx={{
                border: "none",
                borderRadius: "6px",
                fontSize: "20px",
                fontWeight: 500,
                backgroundColor: "#F2F2F2",
                justifyContent: "center",
                "& fieldset": {
                    border: "none"
                },
                "& .MuiFormHelperText-root.Mui-error": {
                    backgroundColor: "white",
                    margin: 0,
                    paddingLeft: "5px",
                    paddingTop: "5px"
                },
            }}
            {...props}
        />
    );
}

export default CustomTextField;
