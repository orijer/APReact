// buttonUtils.js
import React from 'react';
import buttonsData from './buttonsData.json';
import { Button } from 'react-bootstrap'; // Import Button component from react-bootstrap
import "./styles.css"

import MyComponent from './icon_renderer'

// Function to render buttons dynamically from the data in buttonsData
const renderButtons = (currentUser, handleClick) => {
	const buttons = [{id: "currentUserPosts", color: "secondary", label: currentUser.showName, button_img: currentUser.picture}, ...buttonsData];
	return buttons.map((button, index) => (
		<div className="d-grid gap-2 w-100" key={index}>
			<Button variant="outline" className={`btn button-background button-text-right w-100`} type="button" key={index} onClick={() => handleClick(button.id)} >

				<div className="d-flex justify-content-end w-100">
					<span className="m-2">{button.label}</span>
					<MyComponent iconType={button.button_img} />
				</div>

			</Button>

		</div>
	));
};

export default renderButtons;
