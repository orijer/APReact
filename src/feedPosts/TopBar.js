import "./TopBar.css";
import UpdateUser from "./UpdateUser";

function TopBar({ handleThemeSwitch, logOut, token, currentUser }) {
    const handleSearch = (event) => {
        event.preventDefault(); // Prevent the form from submitting
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-white w-100 fixed-top">
                <div className="container-fluid">

                    <button className="navbar-toggler bg-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">

                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item dropdown">

                                <button type="button" className="btn rounded-circle custom-btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={currentUser.picture} alt="Button" className="img-fluid custom-img" />
                                </button>

                                <ul className="dropdown-menu">

                                    <li>
                                        <button className="profileDropdownItem" type="button" data-bs-toggle="modal" data-bs-target="#updateUserModal">
                                            <span className="text">הגדרות</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="gray">
                                                <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
                                            </svg>
                                        </button>
                                    </li>

                                    <li>
                                        <button className="profileDropdownItem" onClick={logOut}>
                                            <span className="text">התנתק</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="gray">
                                                <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                                            </svg>
                                        </button>
                                    </li>

                                </ul>

                            </li>
                        </ul>

                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={handleThemeSwitch} />
                        </div>

                        <form className="d-flex w-25" role="search" onSubmit={handleSearch}>
                            <input className="form-control me-2" id="topSearchBar" type="search" placeholder="חיפוש" aria-label="Search" />
                        </form>

                    </div>

                </div>

            </nav>

            <UpdateUser token={token} currentUser={currentUser} />
        </div>

    )
}

export default TopBar;