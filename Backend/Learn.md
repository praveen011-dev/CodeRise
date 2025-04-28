  RelationShip in Prisma Schema

  user User  @relation (fields: [userId],references: [id],onDelete: Cascade)

  user: name of the relation field in the current model.

  User: this is the target model for linking to--

  @relation(...): This tells Prisma you're defining a relation (foreign key relationship).

  fields: [userId]	This says: "In THIS model, the userId field will store the ID that connects to the User." (foreign key in SQL terms)

  references: [id]	This says: "Which field in the User model should it point to?" — here it points to User.id.

  onDelete: Cascade	Important: If the User is deleted, automatically delete this record too (cascade delete).


# Database Relationship Documentation

## Models Overview

### User Model

Represents a user in the system.

- `id`: Primary Key (UUID)
- `username`: Optional unique username
- `email`: Unique email address
- `image`: Optional profile image
- `role`: Role of the user (`ADMIN` or `USER`)
- `password`: User's password (hashed)
- `isVerified`: Whether the user is email verified
- `verificationToken`, `verificationTokenExpiry`: Fields for email verification
- `forgetPasswordToken`, `forgetPasswordTokenExpiry`: Fields for password reset
- `refreshToken`: Field for refresh token
- `createdAt`, `updatedAt`: Timestamps
- **Relationships**:
  - `problems`: One-to-Many relationship with `Problem` model (a User can create multiple Problems)

---

### Problem Model

Represents a coding problem created by a user.

- `id`: Primary Key (UUID)
- `title`: Title of the problem
- `description`: Description of the problem
- `difficulty`: Difficulty level (`EASY`, `MEDIUM`, `HARD`)
- `tags`: List of tags (stored as string array)
- `userId`: Foreign Key (points to `User.id`)
- `examples`: Example inputs and outputs (JSON)
- `constraints`: Problem constraints
- `hints`: Optional hints
- `editorial`: Optional detailed explanation
- `testcases`: JSON array of test cases
- `codeSnippet`: Example code snippets (JSON)
- `referenceSolution`: A reference solution (JSON)
- `createdAt`, `updatedAt`: Timestamps
- **Relationships**:
  - `user`: Many-to-One relationship with `User` model

---

## Relationship Details

| Model | Relation Type | Field(s) | References | Behavior on Delete |
|:------|:--------------|:---------|:-----------|:-------------------|
| Problem → User | Many-to-One | `userId` | `User.id` | Cascade (Problems are deleted if the User is deleted) |

- **Explanation**: Each `Problem` is created by one `User` (`userId` foreign key). If a `User` is deleted, all their associated `Problem` records are **automatically deleted** due to `onDelete: Cascade`.

---

## Visual Diagram

