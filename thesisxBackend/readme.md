## Auth Routes

| Method  | Endpoint                                         | Description                      |
|-------- |--------------------------------------------------|----------------------------------|
| POST    | [/api/auth/verifyEmail](#post-apiauthverifyemail)| Verify email step before signup  |
| POST    | [/api/auth/signup](#post-apiauthsignup)          | Create new User                  |
| POST    | [/api/auth/login](#post-apiauthlogin)            | Login                            |



### POST /api/auth/verifyEmail
---
**Description**: Send OTP for email verification before signup

### Expected Input:

- **Body (json)**:
```bash
{
    email: "example@email.com"
}
```

### Expected Output:
```bash
{
    success: true,
    message: "Otp sent successfully"
}
```
---
### POST /api/auth/signup
---
**Description**: Take user information and create a new account.

### Expected Input:

- **Body (json)**: 
```bash
{
    email: "example@gmail.com",
    otp: "395988",
    name: "name",
    password: "password",
    role: "STUDENT", // can be 2 types STUDENT, FACULTY
    department: "CS"
}
```

### Expected Output:
```bash
{
    success: true,
    message: "Account created successfully"
}
```
---
### POST /api/auth/login
---
**Description**: User Login

### Expected Input:

- **Body (json)**: 
```bash
{
    email: "example@gmail.com",
    password: "password",
}
```

### Expected Output:
```bash
{
    success: true,
    message: "Login successful",
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImlhbWJhdG1hbi5pYWJAZ21haWwuY29tIiwicm9sZSI6IlNUVURFTlQiLCJkZXB0IjoiQ1MiLCJpYXQiOjE3MzMzODMwMzR9.Bpso2tMdhc1UXdCtpm6eGJLY-fCJiD7fLnxz5jz72nU"
}
```
---
