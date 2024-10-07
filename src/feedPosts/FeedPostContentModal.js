import "./FeedPostContentModal.css"
import { useState } from "react";

function FeedPostContentModal({ modalID, title, applyPost, userImage, userName }) {
    const [textAreaValue, setTextAreaValue] = useState('');
    const [imageFile, setImageFile] = useState(null);

    const handleTextareaChange = (event) => {
        setTextAreaValue(event.target.value);
    };

    const handleImageUpload = (event) => {
        const postImage = event.target.files[0];
        setImageFile(postImage);
        event.target.value = null;
    };

    const handleApplyPost = () => {
        applyPost(textAreaValue, imageFile)
        setTextAreaValue('');
        setImageFile(null);
    }

    return (
        <div className="modal fade h-100" id={modalID} tabIndex="-1" aria-labelledby="postCreationModalLabel" aria-hidden="true">
            <div className="modal-dialog h-75">
                <div className="modal-content h-100">
                    <div className="modal-header">
                        <button type="button" className="closeCreationButton btn-close m-0" data-bs-dismiss="modal" aria-label="Close" />
                        <div className="text-center w-100">
                            <h1 className="modal-title fs-5" id={"postCreationModalLabel" + modalID}>{title}</h1>
                        </div>
                    </div>

                    <div className="modal-body d-flex flex-column h-100">
                        <div className="container-fluid mb-2">
                            <div className="row flex-row-reverse">
                                <div className="col-2 text-end">
                                    <img src={userImage} alt="Profile Pic" className="profileImage rounded-circle" />
                                </div>
                                <div className="col-8 m-0 p-0 d-flex align-items-center justify-content-end">
                                    <p className="fw-bold m-0">{userName}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-grow-1">
                            <textarea className="postCreationTextArea" id={"postCreationTextArea" + modalID} dir="RTL" value={textAreaValue} placeholder="על מה אתם חושבים?" onChange={handleTextareaChange} />
                        </div>
                        { /* The part responsible for uploading a file in the post */}
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="imageUploadInput" id={"imageUploadInput" + modalID} />
                        <button id={"uploadImageButton" + modalID} className="uploadImageButton border-1 mt-2 fw-bold" onClick={() => document.getElementById("imageUploadInput" + modalID).click()}>העלו תמונה</button>
                    </div>
                    <div className="modal-footer">
                        <button type="button" id={"publishPostButton" + modalID} className="publishPostButton btn btn-primary w-100" disabled={textAreaValue.trim() === ''} onClick={handleApplyPost} data-bs-dismiss="modal">פרסם</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default FeedPostContentModal;