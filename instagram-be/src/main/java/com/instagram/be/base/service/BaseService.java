package com.instagram.be.base.service;

import com.instagram.be.base.request.BaseRequest;
import com.instagram.be.exception.NotFoundException;

import java.util.Optional;

public abstract class BaseService<REQ extends BaseRequest, RES> {

  protected abstract RES doProcess(REQ request);

  protected void validate(REQ request) {
    if (request == null) throw new IllegalArgumentException("Request cannot be null");
    request.validate();
  }

  public RES execute(REQ request) {
    if (request != null) request.initialize();
    validate(request);
    return doProcess(request);
  }

  public Optional<RES> executeOptional(REQ request) {
    try {
      return Optional.ofNullable(execute(request));
    } catch (NotFoundException e) {
      return Optional.empty();
    }
  }
}
