import "./FeedPost.css"
import { useState, useEffect } from "react";
import FeedPostContentModal from "./FeedPostContentModal";
import FeedPostCommentSection from "./FeedPostCommentSection";

function FeedPost({ post, token, currentUserName, updatePost, deletePost, isLiked, handleUserLikedPost, handleEnterOtherUserFeed }) {
    const [authorShowName, setAuthorShowName] = useState("");
    const [authorImg, setAuthorImg] = useState("");
    const [showPostMenuPopup, setShowPostMenuPopup] = useState(false);
    const [showPostSharePopup, setShowPostSharePopup] = useState(false);
    const [isCurrentUserAuthor, setIsCurrentUserAuthor] = useState(false);
    const [comments, setComments] = useState(post.comments);

    useEffect(() => {
        const fetchAuthorImg = async () => {
            try {
                const response = await fetch("http://localhost:80/api/users/" + post.author_name, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (response.ok) {
                    const userData = (await response.json())[0];
                    setAuthorImg(userData.picture);
                    setAuthorShowName(userData.showName);
                    setIsCurrentUserAuthor(userData.userName === currentUserName);
                } else {
                    console.error("Failed to fetch user image");
                }
            } catch (error) {
                console.error("Error fetching user image:", error);
            }
        };

        fetchAuthorImg();
    }, [token, post.author_name, currentUserName]);

    const handleTogglePostMenuPopup = () => {
        setShowPostMenuPopup(!showPostMenuPopup);
    };

    const handleTogglePostSharePopup = () => {
        setShowPostSharePopup(!showPostSharePopup);
    }

    const handleUpdatingPost = async (newPostText, newPostImg) => {
        var image = "";
        if (newPostImg !== null && newPostImg !== "") {
            const reader = new FileReader();
            reader.readAsDataURL(newPostImg);
            image = await new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    // Resolve the promise with the result when the image loading is complete
                    resolve(reader.result);
                };
                reader.onerror = reject;
            });
        }

        let postCopy = JSON.parse(JSON.stringify(post));
        postCopy.post_text = newPostText;
        if (image !== "")
            postCopy.post_img = image;

        updatePost(postCopy);
    }

    const handleDeletingPost = async () => {
        await fetch("http://localhost:80/api/users/" + post.author_name + "/posts/" + post._id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        handleTogglePostMenuPopup();
        setShowPostSharePopup(false);
        deletePost(post._id);
    };

    const handleLikeButton = () => {
        handleUserLikedPost(post._id);
    };

    const updateComment = (newComments) => {
        post.comments = [...newComments];
        setComments(newComments);
    }

    const displayDate = (date) => {
        date = new Date(date);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    }


    return (
        <div>
            <div className="card mb-4 mt-4">
                <div id="postInfo" className="container-fluid text-end w-100 h-100">
                    <div className="row flex-row-reverse">
                        <div className="col-11">
                            <button className="post-author-button w-100 bg-transparent border-0" id={"postButton" + post._id} 
                                    onClick={() => handleEnterOtherUserFeed(post.author_name)}>

                                <div className="row m-0 p-0">

                                    <div className="col-9 text-end p-0 postDetails">
                                        <p className="m-1">{authorShowName}</p>
                                        <p>{displayDate(post.date)}</p>
                                    </div>

                                    <div className="col-3 d-flex align-items-center justify-content-end m-0">
                                        <img src={authorImg} alt="Author" className="profileImage img-fluid rounded-circle" />
                                    </div>
                                </div>

                            </button>
                        </div>

                        <div className="col-1 text-end mt-3">
                            {isCurrentUserAuthor && (
                                <button id="postSettingsButton" className="border-0" onClick={handleTogglePostMenuPopup}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={showPostMenuPopup ? "orange" : "gray"}>
                                        <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                <div className="postContent">

                    {post.post_text_dir === "LTR" && <p dir="LRT" className="postContent">{post.post_text}</p>}
                    {post.post_text_dir === "RTL" && <p dir="RTL" className="postContent">{post.post_text}</p>}
                    {post.post_img !== null && post.post_img !== undefined && post.post_img !== "" &&
                        <img src={post.post_img} alt="Post img" className="postImage" />}

                    <div className="d-flex justify-content-end">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={isLiked ? "red" : "gray"}>
                            <path d="M480-147q-14 0-28.5-5T426-168l-69-63q-106-97-191.5-192.5T80-634q0-94 63-157t157-63q53 0 100 22.5t80 61.5q33-39 80-61.5T660-854q94 0 157 63t63 157q0 115-85 211T602-230l-68 62q-11 11-25.5 16t-28.5 5Z" />
                        </svg>
                        <span>{post.likes}</span>
                    </div>
                </div>

                <div className="footer">

                    <hr />

                    <div className="container-fluid w-100">

                        <button className="postFooterButton" onClick={handleTogglePostSharePopup}>
                            <span className="m-2">שיתוף</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={showPostSharePopup ? "blue" : "gray"}>
                                <path d="M720-80q-50 0-85-35t-35-85q0-7 1-14.5t3-13.5L322-392q-17 15-38 23.5t-44 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q23 0 44 8.5t38 23.5l282-164q-2-6-3-13.5t-1-14.5q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-23 0-44-8.5T638-672L356-508q2 6 3 13.5t1 14.5q0 7-1 14.5t-3 13.5l282 164q17-15 38-23.5t44-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z" />
                            </svg>

                        </button>

                        <button className="postFooterButton" onClick={handleLikeButton}>
                            <span className="m-2">לייק</span>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={isLiked ? "red" : "gray"}>
                                <path d="M840-640q32 0 56 24t24 56v80q0 7-1.5 15t-4.5 15L794-168q-9 20-30 34t-44 14H400q-33 0-56.5-23.5T320-200v-407q0-16 6.5-30.5T344-663l217-216q15-14 35.5-17t39.5 7q19 10 27.5 28t3.5 37l-45 184h218ZM160-120q-33 0-56.5-23.5T80-200v-360q0-33 23.5-56.5T160-640q33 0 56.5 23.5T240-560v360q0 33-23.5 56.5T160-120Z" />
                            </svg>
                        </button>

                    </div>

                    <hr />

                    <FeedPostCommentSection token={token} postID={post._id} comments={comments} updateComments={updateComment} currentUserName={currentUserName} />
                </div>

                {showPostMenuPopup && (
                    <div className="menuPopup w-25">
                        <div className="d-flex flex-column w-100 h-100">
                            <button className="postSettingsOption w-100 border-0" onClick={handleTogglePostMenuPopup} data-bs-toggle="modal" data-bs-target={"#postEditModal" + post._id}>עריכת פוסט</button>
                            <button className="postSettingsOption w-100 border-0" onClick={handleDeletingPost}>מחיקת פוסט</button>
                        </div>
                    </div>
                )}

                {showPostSharePopup && (
                    <div className="sharePopup">
                        <div className="d-flex flex-column w-100 h-100">
                            <button className="postShareOption w-100 border-0" onClick={handleTogglePostSharePopup}>שיתוף בפיד</button>
                            <button className="postShareOption w-100 border-0" onClick={handleTogglePostSharePopup}>שיתוף בסטורי</button>
                            <button className="postShareOption w-100 border-0" onClick={handleTogglePostSharePopup}>שליחה לחבר</button>
                        </div>
                    </div>
                )}
            </div>

            <FeedPostContentModal modalID={"postEditModal" + post._id} title={"עריכת פוסט"} applyPost={handleUpdatingPost} userImage={authorImg} userName={authorShowName} />
        </div>
    );
}

export default FeedPost;