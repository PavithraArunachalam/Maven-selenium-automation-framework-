# Demo — Spring Boot 3 + JWT Security + Swagger

A Spring Boot 3.x (Java 21) starter project generated with the dependencies you listed
(Web, JPA, Security, MySQL, Validation, Lombok, DevTools), plus **JWT** and **Swagger
(springdoc-openapi)** added manually to `pom.xml`.

## Stack

- Java 21
- Spring Boot 3.3.2
- Spring Web / Spring Data JPA / Spring Security
- MySQL (`mysql-connector-j`)
- Bean Validation
- Lombok
- Spring Boot DevTools
- JJWT `0.12.6` (JWT generation/validation)
- springdoc-openapi `2.6.0` (Swagger UI)

## Project structure

```
src/main/java/com/example/demo
 ├── DemoApplication.java
 ├── config/
 │    ├── SecurityConfig.java        # Spring Security + JWT filter chain
 │    ├── OpenApiConfig.java         # Swagger/OpenAPI + bearer auth scheme
 │    └── GlobalExceptionHandler.java
 ├── controller/
 │    ├── AuthController.java        # /api/auth/register, /api/auth/login
 │    └── TestController.java        # /api/test/secure (JWT-protected)
 ├── dto/
 │    ├── RegisterRequest.java
 │    ├── LoginRequest.java
 │    └── AuthResponse.java
 ├── entity/
 │    └── User.java
 ├── repository/
 │    └── UserRepository.java
 ├── security/
 │    ├── JwtUtil.java                # token generation/parsing
 │    ├── JwtAuthenticationFilter.java
 │    └── CustomUserDetailsService.java
 └── service/
      └── AuthService.java
```

## 1. Configure MySQL

Create a database (or let `createDatabaseIfNotExist=true` do it) and edit
`src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/demo_db?useSSL=false&serverTimezone=UTC&createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_mysql_password
```

For production, don't commit real credentials — use environment variables
(`${DB_USERNAME}`, `${DB_PASSWORD}`, `${JWT_SECRET}`) instead.

## 2. Run

```bash
mvn spring-boot:run
```

The app starts on `http://localhost:8080`.

## 3. Try it out

**Register**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"secret123"}'
```

**Login**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"secret123"}'
```
Both return `{ "token": "...", "type": "Bearer" }`.

**Call a protected endpoint**
```bash
curl http://localhost:8080/api/test/secure \
  -H "Authorization: Bearer <token>"
```

## 4. Swagger UI

Once running, open:
```
http://localhost:8080/swagger-ui.html
```
Use the "Authorize" button with `Bearer <token>` to test protected endpoints.

## Notes / next steps

- `spring.jpa.hibernate.ddl-auto=update` is convenient for dev; use Flyway/Liquibase
  migrations for production.
- Move `jwt.secret` and DB credentials to environment variables before deploying.
- Add role-based authorization (`@PreAuthorize`) as needed for admin/user endpoints.
