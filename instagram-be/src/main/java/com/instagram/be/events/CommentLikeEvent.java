package com.instagram.be.events;

import com.instagram.be.comment.Comment;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import lombok.Getter;

@Getter
public class CommentLikeEvent extends BaseEvent {
    private final UserProfile target;
    private final UserProfile liker;
    private final Post post;
    private final Comment comment;

    public CommentLikeEvent(Object source, UserProfile target, UserProfile liker, Post post, Comment comment) {
        super(source);
        this.target = target;
        this.liker = liker;
        this.post = post;
        this.comment = comment;
    }
}

