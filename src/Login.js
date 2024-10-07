import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from "./data/users_db.json";
import Signup from './Signup';
import "./Login.css"

function Login({ onLogin }) {
	const navigate = useNavigate();
	const [validated, setValidated] = useState("false");
	const [userName, setUserName] = useState('');
	const [password, setPassword] = useState('');
	const [tried, setTry] = useState(false);
	const [usersList, setUsers] = useState(users);

	const handleLoginSubmit = async (event) => {
		event.preventDefault()

		const response = await fetch("http://localhost:80/api/tokens", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userName, password })
		});

		if (!response.ok) {
			if (!tried)
				setTry(!tried)
			event.preventDefault();
			event.stopPropagation();
			setValidated("true");
			return;
		}

		const data = await response.json();
		if (data.token) {
			await onLogin(data.token, userName);
			navigate('/feed');
		} 
	};

	const handleNameChange = event => {
		setUserName(event.target.value);
	};

	const handlePassChange = event => {
		setPassword(event.target.value);
	};

	function FailInfo() {
		if (tried)
			return (
				<div id="error">incorrect username or password</div>
			);
	}

	return (
		<div className="container-fluid w-100 h-100">
			<div className="row h-100 justify-content-center align-items-center">
				<div className="card" id="loginCard">
					<form className="w-100 h-75" noValidate validated={validated} onSubmit={handleLoginSubmit}>
						<div className="container-fluid w-100 h-100">
							<input className="loginInput text-start mt-3" id="usernameInput" placeholder="שם משתמש" dir="LTR" onChange={handleNameChange} />
							<input className="loginInput text-start" id="passwordInput" placeholder="סיסמה" type="password" dir="LTR" onChange={handlePassChange} />
							<button className="fw-bold fs-5 btn btn-primary mt-3 w-100" id="loginButton" type="submit">התחברות</button>

							<FailInfo />
							<hr className="mb-4" />
							<div className="row justify-content-center h-100">
								<div className="col-auto h-75">
									<Signup setUsers={setUsers} usersList={usersList} />
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;


