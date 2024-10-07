import { useState, useRef } from "react";
import "./UpdateUser.css";
import { checkPasswordValid } from "../Signup";
import { Toast } from 'react-bootstrap';

function UpdateUser({ token, currentUser }) {
    const [newShowName, setNewShowName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [showShowNameUpdatedToast, setshowShowNameUpdatedToast] = useState(false);
    const [showPasswordUpdatedToast, setPasswordUpdatedToast] = useState(false);

    const showNameInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const handleShowNameChange = event => {
        setNewShowName(event.target.value);
    }

    const handlePasswordChange = event => {
        const isValid = checkPasswordValid(event.target.value);
        setValidPassword(isValid);
        setNewPassword(event.target.value);
    }

    const handleUpdateShowName = async () => {
        if (newShowName === "")
            return

        const response = await fetch("http://localhost:80/api/users/" + currentUser.userName, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newShowName })
        });

        if (response.ok) {
            currentUser.showName = newShowName;
            setNewShowName("");
            showNameInputRef.current.value = "";
            setshowShowNameUpdatedToast(true);
        }
    }

    const handleUpdatePassword = async () => {
        if (!validPassword)
            return;

        const response = await fetch("http://localhost:80/api/users/" + currentUser.userName, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword })
        });

        if (response.ok) {
            currentUser.password = newPassword;
            setNewPassword("");
            passwordInputRef.current.value = "";
            setPasswordUpdatedToast(true);
        }
    }

    return (
        <>
            <div className="modal fade" id="updateUserModal" tabIndex="-1" aria-labelledby="updateUserModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <button type="button" className="btn-close m-0" data-bs-dismiss="modal" aria-label="Close" />
                            <div className="text-center w-100">
                                <h1 className="modal-title fs-5">עדכון משתמש</h1>
                            </div>
                        </div>

                        <div className="modal-body text-center">

                            <div className="input-group mb-5 w-100">
                                <input className="mb-3 text-center" ref={showNameInputRef} placeholder="שם זיהוי" onChange={handleShowNameChange} />
                                <button className="bg-primary fw-bold text-white" onClick={handleUpdateShowName}>עדכון שם זיהוי</button>
                            </div>

                            <div className="input-group text-center">
                                <input className="mb-3 text-start" id="updatePasswordInput" ref={passwordInputRef} placeholder="סיסמה" onChange={handlePasswordChange} />
                                {!validPassword && <p className="text-danger">הסיסמה צריכה לכלול לפחות 8 תווים ולהכיל גם תווים וגם מספרים</p>}
                                <button className="bg-primary fw-bold text-white" onClick={handleUpdatePassword}>עדכון סיסמה</button>
                            </div>

                        </div>

                    </div>
                </div>
            </div>

            <Toast show={showShowNameUpdatedToast} onClose={() => setshowShowNameUpdatedToast(false)} className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: "1060" }} stacked>
                <Toast.Header className="d-flex justify-content-between align-items-center">
                    <span className="text-center" dir="RTL">שם הזיהוי עודכן בהצלחה</span>
                </Toast.Header>
            </Toast>

            <Toast show={showPasswordUpdatedToast} onClose={() => setPasswordUpdatedToast(false)} className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: "1060" }} stacked>
                <Toast.Header className="d-flex justify-content-between align-items-center">
                    <span className="text-center" dir="RTL">הסיסמה עודכנה בהצלחה</span>
                </Toast.Header>
            </Toast>
        </>
    );
}

export default UpdateUser;
