import { Button, ButtonProps } from "@mui/material"
import InterfaceUI from "../../interface/InterfaceUI";

type CustomActionBtnProps = ButtonProps & InterfaceUI & {
    hoverBackgroundColor: string
}


const CustomActionBtn = ({ children, hoverBackgroundColor, ...props }: CustomActionBtnProps) => {

    //focus on the sx of MUI Button
    const { sx: sxProps, ...otherProps } = props

    return <Button
        sx={{
            ...sxProps,
            fontSize: 15,
            fontWeight: "bold",
            "&:hover": {
                backgroundColor: hoverBackgroundColor,
                boxShadow: "none"
            },
            boxShadow: "none"

        }}
        variant='contained'
        {...otherProps}
    >
        {children}
    </Button>
};


export default CustomActionBtn
