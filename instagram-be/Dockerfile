# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app

# Cache dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source and build
COPY src ./src
RUN mvn package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Add a non-root user for security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Environment variables with defaults
ENV MYSQL_USER=root \
    MYSQL_PASSWORD=root \
    REDIS_HOST=localhost \
    REDIS_PORT=6379 \
    SERVER_PORT=8080 \
    JWT_SECRET=change-me-in-production-must-be-at-least-32-chars

ENTRYPOINT ["java", "-jar", "app.jar"]
