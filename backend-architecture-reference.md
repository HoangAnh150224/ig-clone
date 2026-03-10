# Spring Boot Backend — Architecture Reference

> This document is the complete specification for building a production-grade Spring Boot REST API.
> It is written to be handed directly to an AI agent to scaffold a new project from scratch.
> Every rule here is derived from a real, working production-style codebase.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Base Infrastructure Classes](#3-base-infrastructure-classes)
4. [Entity Rules](#4-entity-rules)
5. [Request Classes](#5-request-classes)
6. [Response Classes](#6-response-classes)
7. [Service Pattern — BaseService](#7-service-pattern--baseservice)
8. [Repository Rules](#8-repository-rules)
9. [Controller Rules](#9-controller-rules)
10. [Exception Handling](#10-exception-handling)
11. [Security — OAuth2 + Keycloak + JWT](#11-security--oauth2--keycloak--jwt)
12. [Database Migrations — Flyway](#12-database-migrations--flyway)
13. [application.yml Configuration](#13-applicationyml-configuration)
14. [Maven — pom.xml Dependencies](#14-maven--pomxml-dependencies)
15. [Hard Rules — Non-Negotiable](#15-hard-rules--non-negotiable)
16. [Full Feature Implementation Walkthrough](#16-full-feature-implementation-walkthrough)

---

## 1. Technology Stack

| Concern              | Technology                                      |
| -------------------- | ----------------------------------------------- |
| Framework            | Spring Boot 3.4.3 (Java 17)                     |
| ORM                  | Spring Data JPA (Hibernate)                     |
| Database             | MySQL 8.0                                       |
| Migrations           | Flyway                                           |
| Auth / Identity      | Keycloak 26.x (JWT OAuth2 Resource Server)      |
| Cache                | Redis 7.x                                       |
| DTO Mapping          | MapStruct 1.6.3                                 |
| API Docs             | SpringDoc OpenAPI 2.8.4 (Swagger UI)            |
| Boilerplate          | Lombok 1.18.36                                  |
| SQL Logging          | P6Spy 1.9.2                                     |
| Build                | Maven (`./mvnw`)                                |
| Export               | OpenPDF 2.0.3, Apache POI 5.3.0, OpenCSV 5.9   |

---

## 2. Project Structure

```
com.{company}.{project}/
├── {ProjectApplication}.java
│
├── base/                          ← Shared infrastructure (never domain logic)
│   ├── BaseEntity.java
│   ├── UserContext.java
│   ├── api/
│   │   ├── ApiResponse.java
│   │   ├── ErrorDetail.java
│   │   ├── ResponseMetadata.java
│   │   ├── PaginationInfo.java
│   │   └── Link.java
│   ├── request/
│   │   ├── BaseRequest.java
│   │   └── PaginatedRequest.java
│   ├── response/
│   │   └── PaginatedResponse.java
│   ├── service/
│   │   └── BaseService.java
│   └── exception/
│       └── BaseException.java
│
├── config/                        ← Spring config beans
│   ├── SecurityConfig.java
│   ├── KeycloakRoleConverter.java
│   └── OpenApiConfig.java
│
├── exception/                     ← Domain-specific exceptions + global handler
│   ├── GlobalExceptionHandler.java
│   ├── NotFoundException.java
│   ├── BusinessException.java
│   ├── DuplicateResourceException.java
│   ├── ValidationException.java
│   └── IdentityProviderException.java
│
├── {feature}/                     ← One package per domain feature
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── entity/
│   ├── request/
│   └── response/
│
└── integration/                   ← Third-party adapters (Keycloak, payment, email)
    └── keycloak/
        ├── KeycloakService.java
        ├── KeycloakConfig.java
        └── KeyCloakRequest.java
```

**Package naming rule:** One package per domain feature. No shared "services" or "repositories" mega-packages. Features own everything they need.

---

## 3. Base Infrastructure Classes

These classes are the backbone. Every feature uses them. Copy them exactly.

---

### 3.1 BaseEntity

All entities extend this. Provides UUID PK, `createdAt`, `updatedAt`.
**Exception:** composite-key junction tables do NOT extend this.

```java
@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        BaseEntity that = (BaseEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
```

---

### 3.2 BaseRequest

All request objects extend this. Provides `requestId`, `userContext`, `createdAt`, and a `validate()` hook.

```java
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseRequest {

    @Schema(hidden = true)
    private UUID requestId;

    @Schema(hidden = true)
    private UserContext userContext;

    @Schema(hidden = true)
    private LocalDateTime createdAt;

    public void validate() { }  // override for business validation

    public String toLogString() {
        return String.format("%s[requestId=%s]", this.getClass().getSimpleName(), requestId);
    }

    public void initialize() {
        if (requestId == null) requestId = UUID.randomUUID();
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
```

---

### 3.3 PaginatedRequest

All search/list requests extend this. Provides `page`, `size`, `sortBy`, `sortDirection`, and `toPageable()`.

```java
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public abstract class PaginatedRequest extends BaseRequest {

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
```

---

### 3.4 BaseService

The core pattern. Every service extends this. **Never call `doProcess()` directly — always call `execute()`.**

```java
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
```

**Critical `@Transactional` rule:** Never put `@Transactional` on `doProcess()`. Self-invocation bypasses the Spring AOP proxy — the transaction never starts. Always override `execute()` and annotate that instead.

```java
// CORRECT
@Override
@Transactional
public MyResponse execute(MyRequest request) {
    return super.execute(request);
}

// WRONG — transaction is never applied
@Override
@Transactional
protected MyResponse doProcess(MyRequest request) { ... }
```

- Write services: `@Transactional` on overridden `execute()`
- Read services: `@Transactional(readOnly = true)` on overridden `execute()`

---

### 3.5 ApiResponse

All endpoints return `ApiResponse<T>`. Never return raw objects.

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String status;
    private String message;
    private int code;
    private T data;
    @Builder.Default private List<ErrorDetail> errors = new ArrayList<>();
    private ResponseMetadata metadata;
    private PaginationInfo pagination;
    @Builder.Default private List<Link> links = new ArrayList<>();
    @Builder.Default private Map<String, Object> additionalInfo = new HashMap<>();
    @Builder.Default private Instant timestamp = Instant.now();

    // Factory methods
    public static <T> ApiResponse<T> success(T data, String message, int code) { ... }
    public static <T> ApiResponse<T> success(T data, String message, int code, ResponseMetadata metadata) { ... }
    public static <T> ApiResponse<T> error(String message, int code, ErrorDetail error) { ... }
    public static <T> ApiResponse<T> error(String message, int code, List<ErrorDetail> errors) { ... }
    public static <T> ApiResponse<T> simpleError(String message, int code) { ... }
}
```

**Usage in controllers:**
```java
// 201 Created (no data returned)
return ResponseEntity.status(HttpStatus.CREATED).body(
    ApiResponse.success(null, "Resource created successfully", HttpStatus.CREATED.value())
);

// 200 OK (with data)
return ResponseEntity.ok(
    ApiResponse.success(data, "Resource fetched successfully", HttpStatus.OK.value())
);

// 200 OK (paginated)
PaginatedResponse<EmployeeResponse> data = service.execute(request);
return ResponseEntity.ok(
    ApiResponse.success(data, "Resources fetched successfully", HttpStatus.OK.value())
);
```

---

### 3.6 PaginatedResponse

Record wrapping Spring's `Page<T>` for all list endpoints.

```java
public record PaginatedResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last,
    boolean empty
) {
    public static <T> PaginatedResponse<T> from(Page<T> page) {
        return new PaginatedResponse<>(
            page.getContent(), page.getNumber(), page.getSize(),
            page.getTotalElements(), page.getTotalPages(),
            page.isFirst(), page.isLast(), page.isEmpty()
        );
    }
}
```

---

### 3.7 UserContext

Carries the authenticated user into service layer. Built from JWT claims.

```java
@Data
@Builder
public class UserContext {
    private UUID userId;
    private String username;
    private String email;
    private Set<String> roles;
    private String ipAddress;
    private String userAgent;

    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }
    public boolean isAdmin() { return hasRole("ADMIN"); }
}
```

---

### 3.8 ErrorDetail

Field-level or general error detail attached to `ApiResponse.errors`.

```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorDetail {
    private String field;           // null for general errors
    private Object rejectedValue;
    private String message;
    private String code;            // e.g. "FIELD_REQUIRED", "DUPLICATE_ENTRY"

    public static ErrorDetail fieldError(String field, Object rejectedValue, String message, String code) {
        return ErrorDetail.builder().field(field).rejectedValue(rejectedValue).message(message).code(code).build();
    }

    public static ErrorDetail generalError(String message, String code) {
        return ErrorDetail.builder().message(message).code(code).build();
    }
}
```

---

### 3.9 DateRange

Reusable record for date-range filters on search requests.

```java
public record DateRange(LocalDate from, LocalDate to) {}
```

Usage in search requests: name fields `xyzRange` (e.g. `createdAtRange`, `hireDateRange`) to avoid collision with `BaseRequest.createdAt`.

---

## 4. Entity Rules

1. **All entities extend `BaseEntity`** — except composite-key junction tables.
2. **All JPA relationships use `FetchType.LAZY`** — prevents N+1 queries.
3. **All monetary values use `BigDecimal`** — never `double` or `float`.
4. **PKs are UUID** — `@GeneratedValue(strategy = GenerationType.UUID)`.
5. **Use primitive types** (`boolean`, `int`) for non-nullable fields. Use wrapper types (`Boolean`, `Integer`) only when null is a valid value.
6. **Enums stored as STRING** — `@Enumerated(EnumType.STRING)`.
7. **Use `@PrePersist` / `@PreUpdate`** for derived fields (e.g. `fullName = firstName + lastName`).
8. **Required Lombok on entities:** `@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder`
9. **`@SuperBuilder` is required** — not `@Builder` — because entities extend `BaseEntity` which also uses `@SuperBuilder`.

```java
@Entity
@Table(name = "employee_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmployeeInfo extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false, unique = true)
    private Account account;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @Column(name = "hire_date")
    private LocalDate hireDate;

    @Column(name = "code", length = 20)
    private String code;
}
```

---

## 5. Request Classes

### @RequestBody requests
```java
@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CreateEmployeeRequest extends BaseRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;

    // ...
}
```

### @ModelAttribute (query param) requests
```java
@Data
@SuperBuilder
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SearchEmployeeRequest extends PaginatedRequest {

    private String name;
    private String email;
    private Gender gender;
    private Boolean isActive;
    private String department;
    private DateRange hireDateRange;
    private DateRange createdAtRange;
    // NOTE: never use "createdAt" as field name — conflicts with BaseRequest
}
```

**Rule:**
- `@RequestBody` requests → `@NoArgsConstructor @AllArgsConstructor`
- `@ModelAttribute` requests → `@NoArgsConstructor` only (Spring binds from query params)
- When using `@RequiredArgsConstructor` for injection, all injected fields **must be `final`** or Lombok ignores them and they stay null.

---

## 6. Response Classes

Use Java `record` for all response types. Add a static `from(Entity)` factory method.

```java
public record EmployeeResponse(
    UUID id,
    String code,
    LocalDate hireDate,
    AccountResponse account,
    DepartmentResponse department
) {
    public static EmployeeResponse from(EmployeeInfo info) {
        return new EmployeeResponse(
            info.getId(),
            info.getCode(),
            info.getHireDate(),
            AccountResponse.from(info.getAccount()),
            DepartmentResponse.from(info.getDepartment())
        );
    }
}
```

---

## 7. Service Pattern — BaseService

### Standard write service (Create/Update/Delete)

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class CreateXxxService extends BaseService<CreateXxxRequest, XxxResponse> {

    private final XxxRepository xxxRepository;
    private final SomeOtherDependency dep;

    // Step 1: Override execute() to apply @Transactional
    @Override
    @Transactional
    public XxxResponse execute(CreateXxxRequest request) {
        return super.execute(request);
    }

    // Step 2: Override validate() for DB-level uniqueness checks
    @Override
    protected void validate(CreateXxxRequest request) {
        super.validate(request);  // always call super first
        if (xxxRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Code already exists");
        }
    }

    // Step 3: Implement doProcess() — pure business logic, no @Transactional here
    @Override
    protected XxxResponse doProcess(CreateXxxRequest request) {
        log.info("Creating xxx: {}", request.getName());

        Xxx entity = Xxx.builder()
            .name(request.getName())
            .build();

        xxxRepository.save(entity);
        log.info("Xxx created successfully with id: {}", entity.getId());
        return XxxResponse.from(entity);
    }
}
```

### Standard read service

```java
@Slf4j
@Service
@RequiredArgsConstructor
public class GetXxxService extends BaseService<SearchXxxRequest, PaginatedResponse<XxxResponse>> {

    private final XxxRepository xxxRepository;

    @Override
    @Transactional(readOnly = true)  // readOnly = true for all reads
    public PaginatedResponse<XxxResponse> execute(SearchXxxRequest request) {
        return super.execute(request);
    }

    @Override
    protected PaginatedResponse<XxxResponse> doProcess(SearchXxxRequest request) {
        Page<Xxx> page = xxxRepository.findAll(
            XxxSpecification.withFilters(request),
            request.toPageable()
        );
        return PaginatedResponse.from(page.map(XxxResponse::from));
    }
}
```

### Shared service (called by multiple services)

When logic is shared across multiple entry points, extract it into its own `BaseService` subclass.

```java
// AccountRegistrationService — called by both CreateEmployeeService and CreatePatientService
@Service
@RequiredArgsConstructor
public class AccountRegistrationService extends BaseService<AccountRegistrationRequest, Account> {

    @Override
    @Transactional
    protected Account doProcess(AccountRegistrationRequest request) {
        // 1. Save to MySQL
        Account account = accountRepository.save(...);

        // 2. Register in Keycloak — if this fails, roll back MySQL
        try {
            String keycloakId = keycloakService.createUser(...);
            keycloakService.assignRoleToUser(keycloakId, role);
        } catch (Exception e) {
            log.error("Keycloak registration failed — rolling back", e);
            keycloakService.deleteUser(request.getUsername());  // compensation
            throw new IdentityProviderException("...");  // ALWAYS rethrow to trigger @Transactional rollback
        }

        return account;
    }
}
```

**Two-phase commit pattern:** MySQL save first, then external system. If external fails → compensate + rethrow. Never swallow the exception.

---

## 8. Repository Rules

1. **Extend `JpaRepository<Entity, UUID>`** for basic CRUD.
2. **Extend `JpaSpecificationExecutor<Entity>`** on any repository that needs dynamic filtering.
3. **Write `Specification` classes** in the repository package (not inside the service).
4. Use **Spring Data method names** (`findByUsernameIgnoreCase`, `existsByCode`) for simple queries.
5. Use **`@Query`** only when method names become unreadable or for native SQL.
6. For full-text search: use native `MATCH...AGAINST` with `IN BOOLEAN MODE`.

```java
public interface EmployeeInfoRepository extends JpaRepository<EmployeeInfo, UUID>,
        JpaSpecificationExecutor<EmployeeInfo> {

    boolean existsByCode(String code);

    Optional<EmployeeInfo> findByAccountId(UUID accountId);
}
```

### Specification Pattern

```java
public class EmployeeSpecification {

    private EmployeeSpecification() {}  // utility class — no instantiation

    public static Specification<EmployeeInfo> withFilters(SearchEmployeeRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Always join account (inner join)
            Join<Object, Object> account = root.join("account");

            if (request.getName() != null && !request.getName().isBlank()) {
                predicates.add(cb.or(
                    cb.like(cb.lower(account.get("username")), "%" + request.getName().toLowerCase() + "%"),
                    cb.like(cb.lower(account.get("fullName")), "%" + request.getName().toLowerCase() + "%")
                ));
            }

            if (request.getGender() != null) {
                predicates.add(cb.equal(account.get("gender"), request.getGender()));
            }

            if (request.getDepartment() != null) {
                // Conditional join — only join when filter is applied
                Join<Object, Object> dept = root.join("department");
                predicates.add(cb.like(cb.lower(dept.get("name")),
                    "%" + request.getDepartment().toLowerCase() + "%"));
            }

            if (request.getHireDateRange() != null) {
                predicates.add(cb.between(
                    root.get("hireDate"),
                    request.getHireDateRange().from().atStartOfDay(),
                    request.getHireDateRange().to().atTime(23, 59, 59)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

---

## 9. Controller Rules

1. `@RestController` — always.
2. `@RequestMapping("/resource-name")` — plural, kebab-case.
3. `@RequiredArgsConstructor` — inject via constructor, all fields `final`.
4. `@PreAuthorize("hasRole('ROLE_NAME')")` on every protected endpoint — no exceptions.
5. `@Tag(name = "...", description = "...")` for Swagger grouping.
6. `@SecurityRequirement(name = "bearerAuth")` on class level.
7. Annotate every endpoint with `@Operation`, `@ApiResponses`.
8. Controllers **never** call repositories directly. Controllers call services only.
9. Controllers **never** contain business logic. Map to request → call service → return `ApiResponse`.
10. For `@PathVariable` UUID endpoints — wrap the UUID into a request object before passing to service.

```java
@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@Tag(name = "Employee Management", description = "Endpoints for managing hospital staff")
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

    private final CreateEmployeeService createEmployeeService;
    private final GetEmployeeService getEmployeeService;
    private final GetEmployeeDetailService getEmployeeDetailService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create employee")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Employee created"),
        @ApiResponse(responseCode = "400", description = "Validation failed"),
        @ApiResponse(responseCode = "403", description = "Access denied"),
        @ApiResponse(responseCode = "404", description = "Department/Role not found"),
        @ApiResponse(responseCode = "409", description = "Duplicate username/email/code")
    })
    public ResponseEntity<ApiResponse<Void>> create(@Valid @RequestBody CreateEmployeeRequest request) {
        createEmployeeService.execute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(null, "Employee created successfully", HttpStatus.CREATED.value())
        );
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<EmployeeResponse>>> list(
            @Valid @ModelAttribute SearchEmployeeRequest request) {
        PaginatedResponse<EmployeeResponse> data = getEmployeeService.execute(request);
        return ResponseEntity.ok(
            ApiResponse.success(data, "Employees fetched successfully", HttpStatus.OK.value())
        );
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable UUID id) {
        // Wrap UUID in a request object — never pass raw UUID to service
        EmployeeResponse data = getEmployeeDetailService.execute(new EmployeeIdRequest(id));
        return ResponseEntity.ok(
            ApiResponse.success(data, "Employee fetched successfully", HttpStatus.OK.value())
        );
    }

    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deactivate(@PathVariable UUID id) {
        deactivateEmployeeService.execute(new EmployeeIdRequest(id));
        return ResponseEntity.ok(
            ApiResponse.success(null, "Employee deactivated successfully", HttpStatus.OK.value())
        );
    }
}
```

### No DELETE pattern

In production systems, hard-delete is almost always wrong. Use `deactivate` / `activate` instead.

```
PATCH /resource/{id}/deactivate   → sets isActive = false
PATCH /resource/{id}/activate     → sets isActive = true
```

---

## 10. Exception Handling

### Exception hierarchy

```
RuntimeException
 └── BaseException (message, errorCode, httpStatus)
      ├── NotFoundException         → 404, "RESOURCE_NOT_FOUND"
      ├── BusinessException         → 400 (or custom), "BUSINESS_ERROR"
      ├── DuplicateResourceException → 409, "RESOURCE_EXISTED"
      ├── ValidationException       → 400, "VALIDATION_ERROR"
      └── IdentityProviderException  → 502, "IDENTITY_PROVIDER_ERROR"
```

### Throwing exceptions

```java
// Not found
throw new NotFoundException("Employee", employeeId);
// or: throw new NotFoundException("Employee not found with code: " + code);

// Business rule violation
throw new BusinessException("Cannot deactivate the last admin");

// Duplicate
throw new DuplicateResourceException("Username already exists");

// Custom validation
throw new ValidationException("Hire date cannot be in the future");
```

### GlobalExceptionHandler — catches everything

```java
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Bean Validation (@Valid) → 400 with field-level errors
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(...) { ... }

    // All BaseException subclasses → use their embedded httpStatus
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ApiResponse<Object>> handleBaseException(...) { ... }

    // IllegalArgumentException → 400
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Object>> handleIllegalArgument(...) { ... }

    // Malformed JSON → 400
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Object>> handleMalformedJson(...) { ... }

    // Invalid sort property → 400
    @ExceptionHandler(PropertyReferenceException.class)
    public ResponseEntity<ApiResponse<Object>> handlePropertyReference(...) { ... }

    // DB unique constraint violation → 409
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrity(...) { ... }

    // Catch-all → 500
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneric(...) { ... }
}
```

**Rule:** Never catch and swallow exceptions inside services. Let them bubble up to `GlobalExceptionHandler`. The handler is the single source of truth for error formatting.

---

## 11. Security — OAuth2 + Keycloak + JWT

### How it works

1. Client logs in to Keycloak → gets JWT access token.
2. Client sends JWT in `Authorization: Bearer <token>` header.
3. Spring validates JWT against Keycloak's JWK endpoint.
4. `KeycloakRoleConverter` extracts `realm_access.roles` from JWT → converts to `ROLE_XXX` authorities for Spring Security.
5. `@PreAuthorize("hasRole('ADMIN')")` checks these authorities.

### SecurityConfig

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private static final String[] PUBLIC_ENDPOINTS = {
        "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**",
        "/actuator/health", "/actuator/info"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(Customizer.withDefaults())
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(PUBLIC_ENDPOINTS).permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter()))
            );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173")); // update for prod
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("Authorization", "Content-Disposition"));
        config.setAllowCredentials(true);
        config.setMaxAge(3600L);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
        converter.setJwtGrantedAuthoritiesConverter(new KeycloakRoleConverter());
        return converter;
    }
}
```

### KeycloakRoleConverter

```java
public class KeycloakRoleConverter implements Converter<Jwt, Collection<GrantedAuthority>> {

    @Override
    @SuppressWarnings("unchecked")
    public Collection<GrantedAuthority> convert(Jwt jwt) {
        Map<String, Object> realmAccess = (Map<String, Object>) jwt.getClaims().get("realm_access");
        if (realmAccess == null || realmAccess.isEmpty()) return Collections.emptyList();

        Collection<String> roles = (Collection<String>) realmAccess.get("roles");
        if (roles == null || roles.isEmpty()) return Collections.emptyList();

        return roles.stream()
            .map(role -> new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
            .collect(Collectors.toList());
    }
}
```

### Infrastructure Ownership Rules

These classes are the **only** classes that may touch their respective systems:

| System              | Owner class                  |
| ------------------- | ---------------------------- |
| Keycloak API        | `KeycloakService`            |
| Redis — JWT blacklist | `TokenBlacklistService`    |
| Redis — slot counting | `AppointmentSlotService`   |
| Notifications       | `NotificationDispatcher`     |

No other class interacts with Redis or Keycloak directly.

---

## 12. Database Migrations — Flyway

**All schema changes go through Flyway. No manual DB edits. Ever.**

```
src/main/resources/db/migration/
├── V1__init.sql
├── V2__create_core_tables.sql
├── V3__add_email_to_account.sql
├── V4__add_first_last_name_to_account.sql
├── V5__insert_default_roles.sql
└── V6__insert_default_departments.sql
```

**Naming convention:** `V{number}__{description_with_underscores}.sql`

**Iron rules:**
- Never edit a migration file that has already been applied. Flyway stores a checksum and will refuse to start if it doesn't match.
- Even a whitespace change in an applied file will break Flyway validation on other machines.
- If you made a mistake in a migration: create a new migration file to fix it.
- To undo a change: create a new migration that reverses it.

**Typical migration structure:**

```sql
-- V2__create_core_tables.sql

CREATE TABLE account (
    id          BINARY(16) NOT NULL,
    username    VARCHAR(50) NOT NULL UNIQUE,
    email       VARCHAR(100) UNIQUE,
    full_name   VARCHAR(100),
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    is_active   TINYINT(1) NOT NULL DEFAULT 1,
    role_id     BINARY(16) NOT NULL,
    created_at  DATETIME(6),
    updated_at  DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_account_role FOREIGN KEY (role_id) REFERENCES role(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

## 13. application.yml Configuration

```yaml
spring:
  application:
    name: My Application API

  datasource:
    url: jdbc:mysql://localhost:3306/mydb?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
    username: ${MYSQL_USER}
    password: ${MYSQL_PASSWORD}
    driver-class-name: com.mysql.cj.jdbc.Driver

  jpa:
    hibernate:
      ddl-auto: validate        # Flyway is authoritative — Hibernate must not touch schema
    show-sql: false
    properties:
      hibernate:
        format_sql: true
        default_batch_fetch_size: 16
        jdbc:
          batch_size: 25
        order_inserts: true
        order_updates: true
    open-in-view: false         # CRITICAL: prevents lazy-loading outside transaction

  flyway:
    enabled: true
    locations: classpath:db/migration
    baseline-on-migrate: true

  data:
    redis:
      host: ${REDIS_HOST:localhost}
      port: ${REDIS_PORT:6379}

  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${KEYCLOAK_ISSUER_URI:http://localhost:9090/realms/myrealm}
          jwk-set-uri: ${KEYCLOAK_JWK_SET_URI:http://localhost:9090/realms/myrealm/protocol/openid-connect/certs}

app:
  keycloak:
    server-url: ${KEYCLOAK_SERVER_URL:http://localhost:9090}
    realm: ${KEYCLOAK_REALM:myrealm}
    client-id: ${KEYCLOAK_CLIENT_ID:my-api}
    client-secret: ${KC_CLIENT_SECRET:}
    admin:
      username: ${KEYCLOAK_ADMIN:admin}
      password: ${KEYCLOAK_ADMIN_PASSWORD:admin}
      client-id: admin-cli

server:
  port: ${SERVER_PORT:8080}
  servlet:
    context-path: /api

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: when-authorized

logging:
  level:
    root: INFO
    com.yourpackage: DEBUG
    org.springframework.security: INFO
    org.hibernate.SQL: DEBUG

springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
```

**`open-in-view: false` is critical.** Without it, Spring keeps the JPA session open until the HTTP response is written — meaning lazy-loaded fields work in controllers by accident. With it disabled, lazy fields must be loaded inside a `@Transactional` method or they throw `LazyInitializationException`. This is the correct behavior — it forces you to be explicit about what data you need.

---

## 14. Maven — pom.xml Dependencies

```xml
<properties>
    <java.version>17</java.version>
    <lombok.version>1.18.36</lombok.version>
    <mapstruct.version>1.6.3</mapstruct.version>
</properties>

<dependencies>
    <!-- Core -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-mail</artifactId>
    </dependency>

    <!-- Auth -->
    <dependency>
        <groupId>org.keycloak</groupId>
        <artifactId>keycloak-admin-client</artifactId>
        <version>26.0.0</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId> <!-- for WebClient -->
    </dependency>

    <!-- API Docs -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.8.4</version>
    </dependency>

    <!-- Mapping -->
    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>${mapstruct.version}</version>
    </dependency>

    <!-- DB Migration -->
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-mysql</artifactId>
    </dependency>

    <!-- Export -->
    <dependency>
        <groupId>com.github.librepdf</groupId>
        <artifactId>openpdf</artifactId>
        <version>2.0.3</version>
    </dependency>
    <dependency>
        <groupId>org.apache.poi</groupId>
        <artifactId>poi-ooxml</artifactId>
        <version>5.3.0</version>
    </dependency>
    <dependency>
        <groupId>com.opencsv</groupId>
        <artifactId>opencsv</artifactId>
        <version>5.9</version>
    </dependency>

    <!-- Runtime -->
    <dependency>
        <groupId>com.mysql</groupId>
        <artifactId>mysql-connector-j</artifactId>
        <scope>runtime</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-devtools</artifactId>
        <scope>runtime</scope>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>com.github.gavlyukovskiy</groupId>
        <artifactId>p6spy-spring-boot-starter</artifactId>
        <version>1.9.2</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Dev -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Test -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.security</groupId>
        <artifactId>spring-security-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.maven.plugins</groupId>
            <artifactId>maven-compiler-plugin</artifactId>
            <configuration>
                <annotationProcessorPaths>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                        <version>${lombok.version}</version>
                    </path>
                    <path>
                        <groupId>org.mapstruct</groupId>
                        <artifactId>mapstruct-processor</artifactId>
                        <version>${mapstruct.version}</version>
                    </path>
                    <path>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok-mapstruct-binding</artifactId>
                        <version>0.2.0</version>
                    </path>
                </annotationProcessorPaths>
            </configuration>
        </plugin>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
            <configuration>
                <excludes>
                    <exclude>
                        <groupId>org.projectlombok</groupId>
                        <artifactId>lombok</artifactId>
                    </exclude>
                </excludes>
            </configuration>
        </plugin>
    </plugins>
</build>
```

**Lombok + MapStruct must both be in `annotationProcessorPaths` in this exact order**, with the binding bridge. If Lombok runs after MapStruct, MapStruct can't see the getters/setters Lombok generates — mapping code breaks.

---

## 15. Hard Rules — Non-Negotiable

### Architecture
- No shortcuts between layers. Controllers call services. Services call repositories. Never skip a layer.
- No business logic in controllers. Controllers are thin: parse input → call service → return ApiResponse.
- No repository calls from controllers.

### Service
- Always call `execute()`, never `doProcess()` directly.
- `@Transactional` goes on overridden `execute()`, not on `doProcess()`.
- Write services: `@Transactional`. Read services: `@Transactional(readOnly = true)`.
- Call `super.validate(request)` at the start of any overridden `validate()`.

### Entities
- All entities extend `BaseEntity`.
- All relationships: `FetchType.LAZY`.
- All monetary values: `BigDecimal`.
- Never `double` or `float` for money.
- All enums: `@Enumerated(EnumType.STRING)`.
- Use `@SuperBuilder`, not `@Builder`, on entities.

### Lombok injection
- Fields injected via `@RequiredArgsConstructor` **must be `final`** or Lombok ignores them.

### Exceptions
- Never catch and swallow exceptions in services.
- Always rethrow from catch blocks in two-phase patterns (e.g. MySQL + Keycloak).
- `GlobalExceptionHandler` is the only place that formats error responses.

### API
- Every endpoint returns `ApiResponse<T>`.
- Every protected endpoint has `@PreAuthorize`.
- Never return raw objects from controllers.

### Database
- All schema changes go through Flyway migration files.
- Never edit an applied migration file.
- `ddl-auto: validate` in production — Hibernate must not touch schema.
- `open-in-view: false` always.

### Money
- `BigDecimal` everywhere. No exceptions.

---

## 16. Full Feature Implementation Walkthrough

When building a new feature (e.g. `Product`), follow this exact order:

### Step 1: Flyway migration
Create `V{N}__{description}.sql`. Define the table.

### Step 2: Entity
```java
@Entity @Table(name = "product")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @SuperBuilder
public class Product extends BaseEntity {
    @Column(nullable = false) private String name;
    @Column(nullable = false) private BigDecimal price;
    @Column(name = "is_active", nullable = false) private boolean isActive = true;
}
```

### Step 3: Repository
```java
public interface ProductRepository
    extends JpaRepository<Product, UUID>, JpaSpecificationExecutor<Product> {

    boolean existsByName(String name);
}
```

### Step 4: Request classes
```java
// CreateProductRequest.java
@Data @SuperBuilder @NoArgsConstructor @AllArgsConstructor @EqualsAndHashCode(callSuper = true)
public class CreateProductRequest extends BaseRequest {
    @NotBlank private String name;
    @NotNull @DecimalMin("0.01") private BigDecimal price;
}

// SearchProductRequest.java
@Data @SuperBuilder @NoArgsConstructor @EqualsAndHashCode(callSuper = true)
public class SearchProductRequest extends PaginatedRequest {
    private String name;
    private Boolean isActive;
    private DateRange createdAtRange;
}
```

### Step 5: Response class
```java
public record ProductResponse(UUID id, String name, BigDecimal price, boolean isActive) {
    public static ProductResponse from(Product p) {
        return new ProductResponse(p.getId(), p.getName(), p.getPrice(), p.isActive());
    }
}
```

### Step 6: Specification
```java
public class ProductSpecification {
    private ProductSpecification() {}
    public static Specification<Product> withFilters(SearchProductRequest req) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (req.getName() != null && !req.getName().isBlank())
                predicates.add(cb.like(cb.lower(root.get("name")), "%" + req.getName().toLowerCase() + "%"));
            if (req.getIsActive() != null)
                predicates.add(cb.equal(root.get("isActive"), req.getIsActive()));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
```

### Step 7: Service(s)
```java
@Slf4j @Service @RequiredArgsConstructor
public class CreateProductService extends BaseService<CreateProductRequest, ProductResponse> {
    private final ProductRepository productRepository;

    @Override @Transactional
    public ProductResponse execute(CreateProductRequest request) { return super.execute(request); }

    @Override
    protected void validate(CreateProductRequest request) {
        super.validate(request);
        if (productRepository.existsByName(request.getName()))
            throw new DuplicateResourceException("Product name already exists");
    }

    @Override
    protected ProductResponse doProcess(CreateProductRequest request) {
        Product product = Product.builder().name(request.getName()).price(request.getPrice()).isActive(true).build();
        productRepository.save(product);
        return ProductResponse.from(product);
    }
}
```

### Step 8: Controller
```java
@RestController @RequestMapping("/products") @RequiredArgsConstructor
@Tag(name = "Product Management") @SecurityRequirement(name = "bearerAuth")
public class ProductController {
    private final CreateProductService createProductService;
    private final GetProductService getProductService;

    @PostMapping @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ProductResponse>> create(@Valid @RequestBody CreateProductRequest req) {
        ProductResponse data = createProductService.execute(req);
        return ResponseEntity.status(HttpStatus.CREATED).body(
            ApiResponse.success(data, "Product created successfully", HttpStatus.CREATED.value())
        );
    }

    @GetMapping @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginatedResponse<ProductResponse>>> list(
            @Valid @ModelAttribute SearchProductRequest req) {
        return ResponseEntity.ok(
            ApiResponse.success(getProductService.execute(req), "Products fetched successfully", HttpStatus.OK.value())
        );
    }
}
```

### Step 9: Verify Definition of Done

- [ ] Happy path works, returns correct response.
- [ ] Invalid input returns `4xx` (never `500`).
- [ ] `@PreAuthorize` guard is in place.
- [ ] At least one unit or integration test passes.
- [ ] Swagger UI shows the endpoint with correct docs.
- [ ] Flyway migration file exists and is not edited after first apply.
