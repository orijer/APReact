import React from 'react';
import BookmarkIcon from './sideBarIcons/bookmark_btn_icon';
import FriendsIcon from './sideBarIcons/friends_btn_icon';
import GraphIcon from './sideBarIcons/graph_btn_icon'
import MemoriesIcon from './sideBarIcons/memories_btn_icon'
import SeedIcon from './sideBarIcons/seed_btn_icon'
import GroupsIcon from './sideBarIcons/groups_btn_icon'
import ClipIcon from './sideBarIcons/clip_btn_icon'
import MarketplaceIcon from './sideBarIcons/marketplace_btn_icon'
import CalenderIcon from './sideBarIcons/calender_btn_icon'
import FeedsIcon from './sideBarIcons/feeds_btn_icon'
const MyComponent = ({ iconType }) => {
  let iconComponent;

  switch (iconType) {
    case 'bookmark':
      iconComponent = <BookmarkIcon />;
      break;
    case 'friends':
      iconComponent = <FriendsIcon />;
      break;
    case 'graph':
      iconComponent = <GraphIcon />;
      break;
    case 'memories':
        iconComponent = <MemoriesIcon />;
        break;
    case 'calender':
        iconComponent = <CalenderIcon />;
        break;
        case 'seed':
        iconComponent = <SeedIcon />;
        break;
    case 'marketplace':
        iconComponent = <MarketplaceIcon />;
        break;
    case 'clip':
        iconComponent = <ClipIcon />;
        break;
    case 'groups':
        iconComponent = <GroupsIcon />;
        break;
    case 'feeds':
        iconComponent = <FeedsIcon />;
        break;
    default: // It is the user's profile button:
      iconComponent = <img src={iconType} alt="Button" className="img-fluid custom-img" style={{ width: "50px" }} />;
  }

  return iconComponent;
};

export default MyComponent;
