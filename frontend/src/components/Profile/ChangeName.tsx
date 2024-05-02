import React, { useState } from 'react'
import CustomActionBtn from '../UI/CustomActionBtn'
import CustomTextField from '../UI/CustomTextField'
import { useSnackBar } from '../../contexts/snackbar'
import ProfileRouteProps from '../../interface/ProfileRouteProps'

const ChangeName = ({ routeHandler }: ProfileRouteProps) => {
    const [name, setName] = useState("")
    const [isValidName, setIsValidName] = useState(true);

    const { showSnackBar } = useSnackBar()

    const validateName = (name: string): boolean => {
        // Regular expression pattern for name validation
        // const namePattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return name.length >= 1
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredName = e.target.value;
        setName(enteredName);
        setIsValidName(validateName(enteredName));
    };

    const submitHandler = (): void => {
        const isCorrect = true // api call 
        if (isCorrect) {
            routeHandler("/")
            showSnackBar('帳戶名稱更改成功', 'success')
        }
        else {
            showSnackBar('帳戶名稱更改失敗', 'error')
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <p style={{ fontSize: "20px", fontWeight: 500, margin: 0 }}>更改帳戶名稱</p>
            <CustomTextField
                id="outlined-basic"
                label={name ? "" : "請輸入帳戶名稱"}
                value={name}
                onChange={handleNameChange}
                error={!isValidName && name !== ""}
                helperText={!isValidName && name !== "" ? "請輸入有效的帳戶名稱" : ""}
            />
            <CustomActionBtn
                onClick={submitHandler}
                disabled={!isValidName || name === ''}
                sx={{
                    backgroundColor: "#18CE79",
                }}
                hoverBackgroundColor='#32E48E'
            >
                確認
            </CustomActionBtn>
        </div>
    );
}

export default ChangeName