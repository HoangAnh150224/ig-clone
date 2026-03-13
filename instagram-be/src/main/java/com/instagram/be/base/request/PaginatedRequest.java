package com.instagram.be.base.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PaginatedRequest extends BaseRequest {

    @Min(0) @Max(10000)
    private Integer page = 0;

    @Min(1) @Max(100)
    private Integer size = 20;

    private String sortBy;

    @Pattern(regexp = "^(ASC|DESC)$", flags = Pattern.Flag.CASE_INSENSITIVE)
    private String sortDirection = "ASC";

    public Pageable toPageable() {
        int p = page != null ? page : 0;
        int s = size != null ? size : 20;
        if (sortBy != null && !sortBy.isBlank()) {
            Sort.Direction dir = "DESC".equalsIgnoreCase(sortDirection)
                    ? Sort.Direction.DESC : Sort.Direction.ASC;
            return PageRequest.of(p, s, Sort.by(dir, sortBy));
        }
        return PageRequest.of(p, s);
    }
}
