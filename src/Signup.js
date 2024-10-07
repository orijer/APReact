import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Toast } from 'react-bootstrap';
import "./Signup.css"

function checkUsernameValid(inputString) {
	let bannedUsernames = ["", "idiot", "stupid", "moron"];
	return (!bannedUsernames.includes(inputString));
}

function checkPasswordValid(inputString) {
	const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
	return passwordRegex.test(inputString);
}

function Signup({ setUsers, usersList }) {
	const [show, setShow] = useState(false);
	const handleClose = () => {
		setShow(false);
		setValidName(false);
		setValidPassword(false);
		setValidShow(false);
		setValidConfirm(false);
		setValidImage(false);
		setUserNameTaken(false);
	}
	const handleShow = () => setShow(true);

	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [showName, setShowName] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [imageFile, setImageFile] = useState(null);
	const [showToast, setShowToast] = useState(false);

	const [validName, setValidName] = useState(false);
	const [validPassword, setValidPassword] = useState(false);
	const [validShow, setValidShow] = useState(false);
	const [validConfirm, setValidConfirm] = useState(false);
	const [validImage, setValidImage] = useState(false);
	const [userNameTaken, setUserNameTaken] = useState(false);

	function allFieldsValid() {
		return validName && validPassword && validShow && validConfirm && validImage;
	}

	const handleSignupSubmit = async (event) => {
		event.preventDefault();

		if (allFieldsValid()) {
			let image = imageFile;
			if (imageFile !== null && imageFile !== "") {
				const reader = new FileReader();
				reader.readAsDataURL(imageFile);
				image = await new Promise((resolve, reject) => {
					reader.onloadend = () => {
						// Resolve the promise with the result when the image loading is complete
						resolve(reader.result);
					};
					reader.onerror = reject;
				});
			}

			const response = await fetch("http://localhost:80/api/users", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userName, password, showName, picture: image })
			});

			if (response.ok) {
				handleClose();
				setShowToast(true);
			} else if (response.status === 409) {
				setUserNameTaken(true);
			}
		} else {
			event.preventDefault();
			event.stopPropagation();
		}
	};

	const handleNameChange = event => {
		setUserName(event.target.value);
		checkName(event.target.value);
	};

	const handlePassChange = event => {
		setPassword(event.target.value);
		checkPassword(event.target.value);
		setValidConfirm(false);
	};

	const handleShowChange = event => {
		setShowName(event.target.value);
		checkShow(event.target.value);
	};

	const handleConfirmChange = event => {
		setConfirmPassword(event.target.value);
		checkConfirm(event.target.value);
	};

	const handleImageUpload = (event) => {
		const userImage = event.target.files[0];
		setImageFile(userImage);
		checkImg(userImage);
	};

	function checkName(name) {
		if (!checkUsernameValid(name)) {
			setValidName(false);
		} else {
			const found = usersList.find(user => {
				return user.userName === name;
			});
			if (found != null)
				setValidName(false);
			else
				setValidName(true);
		}
	}

	function checkPassword(pass) {
		if (pass === "") {
			setValidPassword(false);
		} else {
			setValidPassword(checkPasswordValid(pass));
		}
	}

	function checkShow(show) {
		if (show === "") {
			setValidShow(false);
		} else {
			setValidShow(true);
		}
	}

	function checkConfirm(confirm) {
		if (confirm === password) {
			setValidConfirm(true);
		} else {
			setValidConfirm(false);
		}
	}

	function checkImg(img) {
		if (img === null) {
			setValidImage(false);
		} else {
			setValidImage(true);
		}
	}

	return (
		<>
			<button type="button" className="btn btn-success mt-0 h-25" onClick={handleShow}>
				להרשמה
			</button>
			<Modal show={show} onHide={handleClose} id="signupModal">
				<div className="modal-header">
					<button type="button" id="closeSignupButton" className="btn-close m-0" onClick={handleClose} />
					<div className="text-end w-100">
						<h1 className="modal-title" id="signupModalLabel">הרשמה</h1>
					</div>
				</div>

				<Form>
					<Modal.Body className="w-100">
						<Row className="mb-3">
							<Form.Group as={Col} md="4" controlId="validationCustom03" className="signupFormGroup">
								<Form.Control
									type="text"
									placeholder="שם משתמש"
									onChange={handleNameChange}
									isInvalid={!validName || userNameTaken}
									isValid={validName && !userNameTaken}
									className="signupFormControl"
								/>
								<Form.Control.Feedback type="invalid" className="signupFeedback">
									{userNameTaken ? 'שם המשתמש כבר קיים' : 'שם המשתמש לא תקין'}
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} md="4" controlId="validationCustom04" className="signupFormGroup">
								<Form.Control
									type="text"
									placeholder="סיסמה"
									onChange={handlePassChange}
									isInvalid={!validPassword}
									isValid={validPassword}
									className="signupFormControl"
								/>
								<Form.Control.Feedback type="invalid" className="signupFeedback">
									הסיסמה צריכה לכלול לפחות 8 תווים ולהכיל גם תווים וגם מספרים
								</Form.Control.Feedback>
							</Form.Group>
						</Row>
						<Row className="mb-3">
							<Form.Group as={Col} md="4" controlId="validationCustom05" className="signupFormGroup">
								<Form.Control
									type="text"
									placeholder="שם זיהוי"
									onChange={handleShowChange}
									isInvalid={!validShow}
									isValid={validShow}
									className="signupFormControl"
								/>
								<Form.Control.Feedback type="invalid" className="signupFeedback">
									הכנסו שם שאחרים יוכלו לראות
								</Form.Control.Feedback>
							</Form.Group>
							<Form.Group as={Col} md="4" controlId="validationCustom06" className="signupFormGroup">
								<Form.Control
									type="text"
									placeholder="אישור סיסמה"
									onChange={handleConfirmChange}
									isInvalid={!validConfirm}
									isValid={validConfirm}
									className="signupFormControl"
								/>
								<Form.Control.Feedback type="invalid" className="signupFeedback">
									הסיסמה שונה מהמקורית
								</Form.Control.Feedback>
							</Form.Group>
						</Row>
						<Row>
							<Form.Control type="file" accept="image/*" onChange={handleImageUpload} id="imageUploadInput"
								isInvalid={!validImage}
								isValid={validImage}
							/>
							<Form.Control.Feedback type="invalid" className="signupFeedback">
								בבקשה בחרו תמונה
							</Form.Control.Feedback>
							<button type="button" id="uploadImageButton" className="border-1 mt-2 fw-bold" onClick={() => document.getElementById('imageUploadInput').click()}>בחירת תמונת פרופיל</button>
						</Row>
					</Modal.Body>

					<Modal.Footer className="w-100">
						<div className="d-flex justify-content-center w-100">
							<button type="button" id="signupButton" onClick={handleSignupSubmit}>להרשמה</button>
						</div>
					</Modal.Footer>
				</Form>
			</Modal>

			<Toast show={showToast} id="signupSuccessfulToast" onClose={() => setShowToast(false)} className="position-fixed bottom-0 end-0 m-3">
				<Toast.Header className="d-flex justify-content-between align-items-center">
					<span className="text-center" dir="RTL">המשתמש נוצר בהצלחה</span>
				</Toast.Header>
			</Toast>

		</>
	);
}

export { checkUsernameValid, checkPasswordValid };
export default Signup;