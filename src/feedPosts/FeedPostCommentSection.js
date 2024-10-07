import FeedPostComment from "./FeedPostComment";
import "./FeedPostCommentSection.css";
import { useState } from "react";

function FeedPostCommentSection({ token, postID, comments = [], updateComments, currentUserName }) {
    const [commentTextAreaValue, setCommentTextAreaValue] = useState('');

    const handleCommentTextAreaChange = (event) => {
        setCommentTextAreaValue(event.target.value);
    }

    async function handleAddComment() {
        const response = await fetch("http://localhost:80/api/posts/" + postID + "/comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ comment_text: commentTextAreaValue })
        });
        try{

            if (response.ok) {
                const newCommentSection = await response.json();
                updateComments(newCommentSection);
            }else{
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        }catch(error){  
        }
        setCommentTextAreaValue('');
    }

    async function handleUpdateComment(commentID, newCommentContent) {
        const response = await fetch("http://localhost:80/api/posts/" + postID + "/comment/" + commentID, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ comment_text: newCommentContent })
        });
        try{
            if (response.ok) {
                const newCommentSection = await response.json();
                updateComments(newCommentSection);
            }else{
                const errorData = await response.json();
                alert("Error: " + errorData.message);
            }
        }catch(error){
            if (error.message === "The comment new text contains a blacklisted url") {
                alert("The comment new text contains a blacklisted url. Please remove it and try again.");
            } else {
                alert("Failed to update comment: " + error.message);
            }
        }
    }

    async function handleDeleteComment(commentID) {
        const response = await fetch("http://localhost:80/api/posts/" + postID + "/comment/" + commentID, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.ok) {
            const newCommentSection = await response.json();
            updateComments(newCommentSection);
        }
    }

    return (
        <div className="commentSection">
            {
                //Display all the comments in the comment section:
                comments.map((comment) => <FeedPostComment key={comment._id} postID={postID} comment={comment} 
                                            isCurrentUserAuthor={currentUserName === comment.author_name} updateComment={handleUpdateComment} 
                                            deleteComment={handleDeleteComment} />)
            }

            <div>
                <textarea className="commentWriteTextArea" value={commentTextAreaValue} placeholder="כתיבת תגובה" onChange={handleCommentTextAreaChange} dir="RTL" />
                <div className="d-flex flex-column align-items-center">
                    <button className="btn btn-primary mt-2 mb-4" onClick={handleAddComment} disabled={commentTextAreaValue === ''}>פרסם תגובה</button>
                </div>
            </div>
        </div>
    );
}

export default FeedPostCommentSection;