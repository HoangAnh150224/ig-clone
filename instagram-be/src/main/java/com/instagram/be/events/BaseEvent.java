package com.instagram.be.events;

import lombok.Getter;
import org.springframework.context.ApplicationEvent;

import java.time.Clock;

@Getter
public abstract class BaseEvent extends ApplicationEvent {
    public BaseEvent(Object source) {
        super(source);
    }

    public BaseEvent(Object source, Clock clock) {
        super(source, clock);
    }
}
