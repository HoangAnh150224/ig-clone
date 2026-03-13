package com.instagram.be.events;

import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import lombok.Getter;

@Getter
public class LikeEvent extends BaseEvent {
    private final UserProfile target;
    private final UserProfile liker;
    private final Post post;

    public LikeEvent(Object source, UserProfile target, UserProfile liker, Post post) {
        super(source);
        this.target = target;
        this.liker = liker;
        this.post = post;
    }
}
