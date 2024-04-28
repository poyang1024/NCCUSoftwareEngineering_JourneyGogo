import TextField, { TextFieldProps } from '@mui/material/TextField';

type CustomTextFieldProps = TextFieldProps
const CustomTextField = (props: CustomTextFieldProps) => {
    return (
        <TextField
            {...props}
            InputLabelProps={{
                shrink: false,
                style: {
                    paddingLeft: "5px",
                    textAlign: "center"
                }
            }}
            InputProps={{
                style: { paddingLeft: "5px" } // Apply padding to the Input
            }}
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
        />
    );
}

export default CustomTextField;
