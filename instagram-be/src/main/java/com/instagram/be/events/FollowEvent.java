package com.instagram.be.events;

import com.instagram.be.notification.enums.NotificationType;
import com.instagram.be.userprofile.UserProfile;
import lombok.Getter;

@Getter
public class FollowEvent extends BaseEvent {
    private final UserProfile target;
    private final UserProfile follower;
    private final NotificationType type;

    public FollowEvent(Object source, UserProfile target, UserProfile follower, NotificationType type) {
        super(source);
        this.target = target;
        this.follower = follower;
        this.type = type;
    }
}
