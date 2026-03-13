package com.instagram.be.events;

import com.instagram.be.comment.Comment;
import com.instagram.be.post.Post;
import com.instagram.be.userprofile.UserProfile;
import lombok.Getter;

@Getter
public class CommentEvent extends BaseEvent {
    private final UserProfile target;
    private final UserProfile commenter;
    private final Post post;
    private final Comment comment;

    public CommentEvent(Object source, UserProfile target, UserProfile commenter, Post post, Comment comment) {
        super(source);
        this.target = target;
        this.commenter = commenter;
        this.post = post;
        this.comment = comment;
    }
}
