import "./FeedPostComment.css";
import { useState } from "react";

function FeedPostComment({ postID, comment, isCurrentUserAuthor, updateComment, deleteComment }) {
    const [showCommentMenuPopup, setShowCommentMenuPopup] = useState(false);
    const [commentTextAreaValue, setCommentTextAreaValue] = useState('');

    const handleCommentTextAreaChange = (event) => {
        setCommentTextAreaValue(event.target.value);
    }

    function handleToggleCommentMenuPopup() {
        setShowCommentMenuPopup(!showCommentMenuPopup);
    }

    function handleUpdateComment() {
        updateComment(comment._id, commentTextAreaValue);
        setCommentTextAreaValue('');
    }

    function handleDeleteComment() {
        deleteComment(comment._id);
        handleToggleCommentMenuPopup();
    }

    return (
        <>
            <div className="card comment">
                <div className="card-body">
                    <div className="row align-items-center">

                        <div className="col-auto">
                            {
                                isCurrentUserAuthor && 
                                <button id="commentSettingsButton" className="border-0" onClick={handleToggleCommentMenuPopup}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill={showCommentMenuPopup ? "orange" : "gray"}>
                                        <path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" />
                                    </svg>
                                </button>
                            }
                        </div>

                        <div className="col">
                            <span className="text-end fw-bold" dir="RTL">{comment.author_showName}</span>
                        </div>
                    </div>

                    <p className="commentText" dir="RTL">{comment.comment_text}</p>

                </div>
            </div>

            {
                showCommentMenuPopup && (
                    <div className="menuPopup commentMenuPopup w-25">
                        <div className="d-flex flex-column w-100 h-100">
                            <button className="postSettingsOption w-100 border-0" onClick={handleToggleCommentMenuPopup} data-bs-toggle="modal" data-bs-target={"#updateComment" + postID + "_" + comment._id}>עריכת תגובה</button>
                            <button className="postSettingsOption w-100 border-0" onClick={handleDeleteComment}>מחיקת תגובה</button>
                        </div>
                    </div>
                )
            }

            <div className="modal fade" id={"updateComment" + postID + "_" + comment._id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <div className="modal-header">
                            <button type="button" className="closeCreationButton btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

                            <div className="text-center w-100">
                                <h1 className="modal-title fs-5" id="commentCreationModalLabel">עריכת תגובה</h1>
                            </div>
                        </div>

                        <div className="modal-body">
                            <textarea className="commentWriteTextArea" placeholder="כתבו את תוכן התגובה" value={commentTextAreaValue} onChange={handleCommentTextAreaChange} dir="RTL" />
                        </div>

                        <div className="modal-footer justify-content-center">
                            <button type="button" className="btn btn-primary" onClick={handleUpdateComment} disabled={commentTextAreaValue === ''} data-bs-dismiss="modal">שמור שינויים</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
}

export default FeedPostComment;