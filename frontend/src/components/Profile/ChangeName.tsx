import React, { useState } from 'react'
import CustomActionBtn from '../UI/CustomActionBtn'
import CustomTextField from '../UI/CustomTextField'
import ProfileEditProps from '../../interface/ProfileEditProps'

const ChangeName = ({ submitHandler }: ProfileEditProps) => {
    const [name, setName] = useState("")
    const [isValidName, setIsValidName] = useState(true);

    const validateName = (name: string): boolean => {
        return name.length >= 1
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredName = e.target.value;
        setName(enteredName);
        setIsValidName(validateName(enteredName));
    };

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
                onClick={() => submitHandler({
                    last_name: name
                })}
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