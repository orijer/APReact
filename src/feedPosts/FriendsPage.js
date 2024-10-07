import { useEffect, useState } from "react";
import "./FriendsPage.css"
import { Toast } from 'react-bootstrap';

function FriendsPage({ token, currentUser }) {
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [showFriendDeletedToast, setShowFriendDeletedToast] = useState(false);
    const [showRequestAcceptedToast, setShowRequestAcceptedToast] = useState(false);
    const [showRequestRejectedToast, setShowRequestRejectedToast] = useState(false);

    useEffect(() => {
        const fetchFriends = async () => {
            const response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/friends", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return;
            }

            try {
                const friendsData = await response.json();
                const friendDetailsPromises = friendsData.map(async (friendUsername) => {
                    const response = await fetch("http://localhost:80/api/users/" + friendUsername, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch user data for ${friendUsername}`);
                    }

                    return (await response.json())[0];
                });

                const friendDetails = await Promise.all(friendDetailsPromises);
                setFriends(friendDetails);
            } catch (error) {
                console.error("Error fetching friend details:", error);
            }
        };

        const fetchFriendRequests = async () => {
            const response = await fetch("http://localhost:80/api/users/friends/requests", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return;
            }

            try {
                const friendRequestsData = await response.json();

                const friendRequestsDetailsPromises = friendRequestsData.map(async (userName) => {
                    const response = await fetch("http://localhost:80/api/users/" + userName, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`Failed to fetch user data for ${userName}`);
                    }

                    return (await response.json())[0];
                });

                const friendRequestsDetails = await Promise.all(friendRequestsDetailsPromises);
                setFriendRequests(friendRequestsDetails);
            } catch (error) {
                console.error("Error fetching friend requests details:", error);
            }
        };

        fetchFriends();
        fetchFriendRequests();
    }, [token, currentUser]);

    const handleDeleteFriends = async (friendUserName) => {
        const response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/friends/" + friendUserName, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            setFriends(friends.filter(friend => friend.userName !== friendUserName));
            currentUser.friends = currentUser.friends.filter(friend => friend.userName !== friendUserName);
            setShowFriendDeletedToast(true);
        }
    }

    const handleAcceptFriendRequest = async (senderUserName) => {
        try {
            const response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/friends/" + senderUserName, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return;
            }

            const userResponse = await fetch("http://localhost:80/api/users/" + senderUserName, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (userResponse.ok) {
                setFriends([...friends, (await userResponse.json())[0]]);
                setFriendRequests(friendRequests.filter(request => request.userName !== senderUserName));
                currentUser.friends = [...currentUser.friends, senderUserName];
                currentUser.friendRequests = currentUser.friendRequests.filter(request => request.userName !== senderUserName);
                setShowRequestAcceptedToast(true);
            }
        } catch (error) {
            if (error.message === 'No appropriate user request found') {
                console.log("No appropriate user request found");
            } else {
                console.error(error);
            }
        }
    }


    const handleRejectFriendRequest = async (senderUserName) => {
        const response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/friends/" + senderUserName, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            setFriendRequests(friendRequests.filter(request => request.userName !== senderUserName));
            setShowRequestRejectedToast(true);
        }
    }


    return (
        <div>
            <h2 className="text-center">חברים</h2>
            {friends.map(friend => (
                <div key={friend.userName} className="card m-1">
                    <div className="row flex-row-reverse justify-content-right align-items-center w-100 p-2">

                        <div className="col-2 text-end">
                            <img src={friend.picture} alt="Profile Pic" className="profileImage rounded-circle" />
                        </div>

                        <div className="col-8 text-end">
                            <span className="card-body text-end">{friend.showName}</span>
                        </div>

                        <div className="col-2 text-end">
                            <button className="border-0 deleteFriendButton" onClick={() => handleDeleteFriends(friend.userName)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="red">
                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM400-280q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280ZM280-720v520-520Z" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
            ))}

            <hr className="mt-5 mb-5" />

            <h2 className="text-center">בקשות חברות</h2>
            {
                friendRequests.map(friendRequest => (
                    <div key={friendRequest.userName} className="card m-1">
                        <div className="row flex-row-reverse justify-content-right align-items-center w-100 p-2">

                            <div className="col-2 text-end">
                                <img src={friendRequest.picture} alt="Profile Pic" className="profileImage rounded-circle" />
                            </div>

                            <div className="col-5 text-end">
                                <span className="card-body text-end">{friendRequest.showName}</span>
                            </div>

                            <div className="col-2 text-end p-2">
                                <button className="border-0 btn btn-primary w-100 fw-bold" onClick={() => handleRejectFriendRequest(friendRequest.userName)}>
                                    דחה
                                </button>
                            </div>

                            <div className="col-2 text-end p-2">
                                <button className="border-0 btn btn-primary w-100 fw-bold" onClick={() => handleAcceptFriendRequest(friendRequest.userName)}>
                                    אשר
                                </button>
                            </div>

                        </div>
                    </div>
                ))
            }

            <Toast show={showFriendDeletedToast} onClose={() => setShowFriendDeletedToast(false)} className="position-fixed bottom-0 end-0 m-3">
                <Toast.Header className="d-flex justify-content-between align-items-center">
                    <span className="text-center" dir="RTL">החבר\ה הוסרו בהצלחה</span>
                </Toast.Header>
            </Toast>

            <Toast show={showRequestAcceptedToast} onClose={() => setShowRequestAcceptedToast(false)} className="position-fixed bottom-0 end-0 m-3">
                <Toast.Header className="d-flex justify-content-between align-items-center">
                    <span className="text-center" dir="RTL">בקשת החברות אושרה בהצלחה</span>
                </Toast.Header>
            </Toast>

            <Toast show={showRequestRejectedToast} onClose={() => setShowRequestRejectedToast(false)} className="position-fixed bottom-0 end-0 m-3">
                <Toast.Header className="d-flex justify-content-between align-items-center">
                    <span className="text-center" dir="RTL">בקשת החברות נדחתה בהצלחה</span>
                </Toast.Header>
            </Toast>
        </div>
    )
}

export default FriendsPage;