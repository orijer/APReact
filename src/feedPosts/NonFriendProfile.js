import { useEffect, useState } from "react";
import { Modal, Button, Toast } from "react-bootstrap";

function NonFriendProfile({ token, userName }) {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showRequestSentToast, setShowRequestSentToast] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:80/api/users/" + userName, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = (await response.json())[0];
                    setUser(data);
                }
            } catch (error) {
                // We dont really want to do anything, just dont crash...
            }
        };

        fetchUser();
    }, [token, userName]);

    const handleFriendRequestButtonClicked = async () => {
        const response = await fetch("http://localhost:80/api/users/" + userName + "/friends", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            setShowRequestSentToast(true);
        } else if (response.status === 409) {
            setShowModal(true); // Show modal if the user already has a friend request
        }
    }

    return (
        <div className="card pt-3 pb-3" >

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Body className="text-center fw-bold" dir="RTL">
                    למשתמש הזה כבר יש בקשת חברות ממך
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button variant="secondary" size="lg" className="w-75" onClick={() => setShowModal(false)}>סגור</Button>
                </Modal.Footer>
            </Modal>

            {
                user &&
                <div className="row m-0 p-0 w-100">

                    <div className="col-7 d-flex align-items-center justify-content-end m-0">
                        <button className="w-100 h-100 btn btn-primary fw-bold" onClick={handleFriendRequestButtonClicked}>

                            <span className="m-3">
                                שליחת בקשת חברות
                            </span>

                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="white">
                                <path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80Zm-360-80q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T440-640q0-33-23.5-56.5T360-720q-33 0-56.5 23.5T280-640q0 33 23.5 56.5T360-560Zm0-80Zm0 400Z" />
                            </svg>

                        </button>
                    </div>

                    <div className="col-3 text-end p-0 d-flex align-items-center justify-content-end">
                        <p className="m-1 fw-bold">{user.showName}</p>
                    </div>

                    <div className="col-2 d-flex align-items-center justify-content-end m-0">
                        <img src={user.picture} alt="Author" className="profileImage img-fluid rounded-circle" />
                    </div>

                </div>
            }

            <Toast show={showRequestSentToast} onClose={() => setShowRequestSentToast(false)} className="position-fixed bottom-0 end-0 m-3">
                <Toast.Header className="d-flex justify-content-between align-items-center">
                    <span className="text-center" dir="RTL">בקשת החברות נשלחה בהצלחה</span>
                </Toast.Header>
            </Toast>

        </div>
    )
}

export default NonFriendProfile;
