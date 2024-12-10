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
## Public Routes

| Method  | Endpoint                                         | Description                      |
|-------- |--------------------------------------------------|----------------------------------|
| GET     | [/api/public/image/:filename](#get-apipublicimagefilename) | Get Image from server             |

### GET /api/public/image/:filename
---
**Description**: Get public image from server

Query params:
* ```format```  boolean can be true or false ```format=true``` returns a webp version of the image.
* ```quality``` determined image quality range ```1-100``` default 80
* ```width``` determines image width in pixels ```width=160```.
*```height``` determines image height in pixels ```height=200```.

### Expected URL:
```https://example.com/api/public/images/example.jpg?format=true&width=400&height=400```
---
## User Routes

| Method  | Endpoint                                         | Description                      |
|-------- |--------------------------------------------------|----------------------------------|
| GET     | [/api/user/getuser](#get-apiusergetuser)         | Get user information             |
| GET     | [/api/user/getprofile](#get-apiusergetprofile)   | Get user profile            |
| POST     | [/api/user/upload-image](#post-apiuseruploadimage)   | Upload Profile image            |
| POST     | [/api/user/update-basic-info](#post-apiuserupdate-basic-info)   | Update user info           |
| POST     | [/api/user/update-research-interests](#post-apiuserupdate-research-interests)   | Update research interest of Faculty and Students          |
| GET     | [/api/user/get-faculties](#get-apiuserget-faculties)   | Get all Supervisors         |

### GET /api/user/getuser
---
**Description**: Get user information from token

### Expected Output:
```bash
{
    success: true,
    data: {
        id: 1,
        email: "example@gmail.com",
        name: "example name",
        department: "CS",
        role: "STUDENT",
        bio: null,
        verified: false,
        createdAt: "2024-12-05T06:56:46.865Z",
        updatedAt: "2024-12-05T06:56:46.865Z"
    }
}
```
---
### GET /api/user/getprofile
---
**Description**: Get user information from token and fetch profile 

### Expected Output:
```bash
// for faculties
{
    success: true,
    data: {
        id: 1,
        email: "faculty@example.com",
        name: "Dr. Smith",
        department: "Computer Science",
        role: "FACULTY",
        bio: "Researcher in AI and ML",
        verified: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-12-01T00:00:00.000Z",
        image:null,
        facultyDetails: {
            department: "Computer Science",
            researchInterests: ["AI", "ML"],
            availability: null,
            publications: [
                {
                    id: 1,
                    title: "Advances in AI",
                    abstract: "Study on AI advancements.",
                    authors: ["Dr. Smith", "Dr. Doe"],
                    publicationDate: "2024-06-01T00:00:00.000Z",
                    url: "https://example.com/publication",
                    createdAt: "2024-05-01T00:00:00.000Z"
                }
            ]
        }
    }
}

// for students
{
    success: true,
    data: {
        id: 1,
        email: "faculty@example.com",
        name: "Dr. Smith",
        department: "Computer Science",
        role: "FACULTY",
        bio: "Researcher in AI and ML",
        verified: true,
        image:null,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-12-01T00:00:00.000Z",
        facultyDetails: {
            "researchInterests": ["AI", "Blockchain"]
        }
    }
}
```
---
### POST /api/user/upload-image
---
**Description**: Update user profile image
### Expected Output:
```bash
{
    image: "base64_encoded_image_data"
}
```
### Expected Output:
```bash
{
    success: true,
    data: {
        image: "example.jpg"
    }
}
```
---
### POST /api/user/update-basic-info
---
**Description**: Update the basic user information like bio, name, or department.
### Expected Input:
```bash
{
    bio: "Updated bio information",
    name: "Updated Name",
    department: "Updated Department"
}
```
### Expected Output:
```bash
{
    success: true,
    message: "User information updated successfully."
}
```
---
### POST /api/user/update-research-interests
---
**Description**: Update research interest for both students and teachers.
### Expected Input:
```bash
{
    researchInterests: ["AI", "Machine Learning"]
}
```
### Expected Output:
```bash
{
    success: true,
    message: "Research interests updated successfully."
}
```
---
### GET /api/user/get-faculties
---
**Description**: Update research interest for both students and teachers.
### Expected Input:
```bash
{
    researchInterests: ["AI", "Machine Learning"]
}
```
### Expected Output:
```bash
{
    success: true,
    data: [
            {
                "id": 1,
                "user": {
                    "name": "John Doe",
                    "department": "CSE",
                    "image": "4b0be401-07a4-42ce-86da-30618a254dc3.png"
                },
                "availability": {
                    "slots": ["Monday 10 AM", "Thursday 2 PM"]
                }
            },
            {
                "id": 2,
                "user": {
                    "name": "Emma Carter",
                    "department": "ECO_SSC",
                    "image": "85ee8344-dc38-4637-98d8-3a533c7b88c8.jpg"
                },
                "availability": {
                    "slots": ["Monday 10 AM", "Thursday 2 PM"]
                }
            },
        ]
    }
}
```
---



