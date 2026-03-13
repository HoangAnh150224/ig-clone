package com.instagram.be.events;

import com.instagram.be.story.Story;
import com.instagram.be.userprofile.UserProfile;
import lombok.Getter;

@Getter
public class StoryLikeEvent extends BaseEvent {
    private final UserProfile target;
    private final UserProfile liker;
    private final Story story;

    public StoryLikeEvent(Object source, UserProfile target, UserProfile liker, Story story) {
        super(source);
        this.target = target;
        this.liker = liker;
        this.story = story;
    }
}

