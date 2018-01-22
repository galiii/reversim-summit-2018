import React from 'react';

const clickableTag = (name, clickHandler) => {
    let wasClicked = false;
    const localClickHandler = () => {
        wasClicked = !wasClicked;
        clickHandler(name);
    };

    return <div key={name} onClick={localClickHandler} className={"mr-3 " + wasClicked ? "active" : ""}>
            #{name}
        </div>
};

const TagsList = ({tags, filterByTags, ...props}) => {
    let selectedTags = [];

    const clickHandler = (tag) => {
        if(selectedTags.indexOf(tag) !== -1) {
            selectedTags.splice(selectedTags.indexOf(tag), 1);
        } else {
            selectedTags.push(tag);
        }
        filterByTags(selectedTags);
    }
    return <div>
            {tags.map(tag => clickableTag(tag, clickHandler))}
        </div>
}

export default TagsList;