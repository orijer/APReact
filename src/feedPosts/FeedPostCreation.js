import "./FeedPostCreation.css";

import FeedPostContentModal from "./FeedPostContentModal";

function FeedPostCreation({ feedPostsList, setFeedPostsList, currentUser, token }) {
    const addNewPost = async (post_text, post_image) => {
        var image = "";
        if (post_image !== null && post_image !== "") {
            const reader = new FileReader();
            reader.readAsDataURL(post_image);
            image = await new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    // Resolve the promise with the result when the image loading is complete
                    resolve(reader.result);
                };
                reader.onerror = reject;
            });
        }

        let response;
        if (image !== "") {
            response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ post_text, post_img: image })
            });
        } else {
            response = await fetch("http://localhost:80/api/users/" + currentUser.userName + "/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ post_text })
            });
        }
        
        if (response.ok) {
            response = await response.json();    
            setFeedPostsList([response, ...feedPostsList]);
        } else {
            const errorData = await response.json();
            alert("Error: " + errorData.error);
        }
        /*response = await response.json();    
        setFeedPostsList([response, ...feedPostsList]);*/
    }

    return (
        <div id="postCreation">
            {/* The card that contains the button that opens the post creation window */ }
            <div className="card">
                <div className="card-body">
                    <div className="row flex-row-reverse justify-content-center align-items-center">

                        <div className="col-2 text-end">
                            <img src={currentUser.picture} alt="Profile Pic" className="profileImage rounded-circle" />
                        </div>

                        <div className="col-10">
                            <button id="openPostCreationButton" className="p-2 text-end" dir="RTL" data-bs-toggle="modal" data-bs-target="#postCreationModal">על מה אתם חושבים?</button>
                        </div>
                        
                    </div>
                </div>
            </div>

            {/* The post creation window */}
            <FeedPostContentModal modalID={"postCreationModal"} title={"יצירת פוסט"} applyPost={addNewPost} userImage={currentUser.picture} userName={currentUser.showName}/>
        </div>
    );
}

export default FeedPostCreation;