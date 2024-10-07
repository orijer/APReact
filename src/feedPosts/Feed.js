import "./Feed.css";

import { useState, useEffect } from "react";
import TopBar from "./TopBar";
import NonFriendProfile from "./NonFriendProfile";
import FriendsPage from "./FriendsPage";
import FeedPost from "./FeedPost";
import FeedPostCreation from "./FeedPostCreation";
import renderButtons from '../leftBar/buttonUtils';
import { Button } from 'react-bootstrap';

function Feed({ currentUser, token, logout }) {
    const [feedPostsList, setFeedPostsList] = useState([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [showPostCreation, setShowPostCreation] = useState(true);
    const [showNonFriendProfile, setShowNonFriendProfile] = useState(null);
    const [showFriendsPage, setShowFriendsPage] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch("http://localhost:80/api/posts", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    console.error("Failed to fetch posts");
                    return;
                }

                const data = await response.json();
                setFeedPostsList(data);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchPosts();
    }, [token]);

    function handleThemeSwitch() {
        setIsDarkMode(prevIsDarkMode => !prevIsDarkMode);
        document.body.classList.toggle('dark-mode', !isDarkMode);
    }

    const handleSidebarButtonClicked = async (buttonID) => {
        if (buttonID === "currentUserPosts") {
            const response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFeedPostsList(data);
                setShowPostCreation(true);
                setShowNonFriendProfile(null);
                setShowFriendsPage(false);
            }

        } else if (buttonID === "Feed") {
            const response = await fetch("http://localhost:80/api/posts", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFeedPostsList(data);
                setShowPostCreation(true);
                setShowNonFriendProfile(null);
                setShowFriendsPage(false);
            }
        } else if (buttonID === "friendsButton") {
            setFeedPostsList([]);
            setShowPostCreation(false);
            setShowNonFriendProfile(null);
            setShowFriendsPage(true);
        }
    };


    async function updatePost(newPostDetails) {
        const IDtoUpdate = newPostDetails._id;
    
        try {
            const response = await fetch(`http://localhost:80/api/users/${currentUser.userName}/posts/${IDtoUpdate}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ post_text: newPostDetails.post_text, post_img: newPostDetails.post_img })
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to update post.");
            }
    
            setFeedPostsList(prevList => {
                // Create a new array with updated post_text for the specified id
                return prevList.map(post => {
                    if (post._id === IDtoUpdate) {
                        return { ...newPostDetails };
                    }
                    return post;
                });
            });
        } catch (error) {
            if (error.message === "The new post text contains a blacklisted url") {
                alert("The new post text contains a blacklisted URL. Please remove it and try again.");
            } else {
                alert("Failed to update post: " + error.message);
            }
        }
    }


    function deletePost(IDtoRemove) {
        setFeedPostsList(feedPostsList.filter(post => post._id !== IDtoRemove));
    }

    function wasPostLikedByCurrentUser(postID) {
        return currentUser.likedPosts.includes(postID);
    }

    async function handleUserLikedPost(postID) {
        const response = await fetch("http://localhost:80/api/users/like/" + postID, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.ok) {
            const len = currentUser.likedPosts.length;
            const result = (await response.json()).likedPosts;
            currentUser.likedPosts = result;

            const likeChange = (len < result.length) ? 1 : -1
            setFeedPostsList(feedPostsList.map(post => {
                if (post._id === postID) {
                    return { ...post, likes: post.likes + likeChange };
                } else {
                    return post;
                }
            }));
        }
    }

    function handleLogout() {
        setIsDarkMode(false);
        document.body.classList.remove('dark-mode');
        logout();
    }

    async function handleEnterOtherUserFeed(otherUserName) {
        let response = await fetch("http://localhost:80/api/users/" + otherUserName + "/posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            setFeedPostsList(data);
            setShowPostCreation(false);
            setShowNonFriendProfile(null);
            setShowFriendsPage(false);
        } else if (response.status === 403) {
            // We tried to see the posts of a user we are not friends with
            setFeedPostsList([]);
            setShowPostCreation(false);
            setShowNonFriendProfile(otherUserName);
            setShowFriendsPage(false);
        }
    }

    return (

        <div id="feedPage" className="container-fluid h-100 w-100 m-0 p-0">
            <TopBar handleThemeSwitch={handleThemeSwitch} logOut={handleLogout} token={token} currentUser={currentUser} />

            <div className="row h-100 w-100" id="feed">
                <div className="col-3">

                    <div className="headline" style={{ textAlign: 'right', fontWeight: 'bold', marginBottom: '10px' }}>שיחות קבוצתיות</div>
                    <Button variant="outline" className="button-max-width button-background button-text-right" >
                        צור קבוצה חדשה
                    </Button>

                </div>

                <div className="col-6">
                    <div id="feed" className="container">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-10 mx-auto">
                                {
                                    /* The code that handles creating new posts */
                                    showPostCreation &&
                                    <FeedPostCreation feedPostsList={feedPostsList} setFeedPostsList={setFeedPostsList} currentUser={currentUser} token={token} />
                                }

                                {
                                    /* The code that handles showing the profile of a nonfriend and allows the user to send them a friend request */
                                    (showNonFriendProfile != null) &&
                                    <NonFriendProfile token={token} userName={showNonFriendProfile} />
                                }

                                {
                                    /* The code that handles showing the friends section to the user: see all their current friends and friend requests */
                                    showFriendsPage &&
                                    <FriendsPage token={token} currentUser={currentUser} />
                                }

                                {
                                    // The posts on the feed:
                                    (showNonFriendProfile == null) &&
                                    feedPostsList.map((feedPost) => <FeedPost key={feedPost._id} post={feedPost} token={token} currentUserName={currentUser.userName} updatePost={updatePost}
                                        deletePost={deletePost} isLiked={wasPostLikedByCurrentUser(feedPost._id)} handleUserLikedPost={handleUserLikedPost} handleEnterOtherUserFeed={handleEnterOtherUserFeed} />)
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-3" id="sideBar">
                    {/*renderer the buttons of the right side bar */}
                    {renderButtons(currentUser, handleSidebarButtonClicked)}
                </div>
            </div>
        </div>
    );


}

export default Feed;