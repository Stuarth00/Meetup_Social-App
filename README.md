# Meetup — Social App

A full-stack social media app where users can share posts, follow other users, like and comment on content, and manage their profiles.

🔗 **[Live Demo](https://meetupsocial-app-production.up.railway.app/)**

---

## Screenshots / Demo

> _(Drop your .mp4 videos here by dragging them into the GitHub README editor)_

| Sign Up       | Create Post       |
| ------------- | ----------------- |
| _sign-up.mp4_ | _create-post.mp4_ |

| Like & Comment     | Edit Profile      |
| ------------------ | ----------------- |
| _like-comment.mp4_ | _edit-avatar.mp4_ |

---

## Tech Stack

**Frontend**

- React + TypeScript
- Tailwind CSS
- Lucide React (icons)
- React Router

**Backend**

- Node.js + Express
- PostgreSQL + pg-promise
- JWT (authentication)
- bcrypt (password hashing)
- Cloudinary (image storage)

**Deployment**

- Railway (backend + database)
- Railway (frontend)

---

## Features

- **Authentication** — signup, login, and logout with JWT tokens. Passwords are hashed with bcrypt before storage.
- **Profile** — edit your name, bio, location, interests, and avatar. Avatar uploads go directly to Cloudinary.
- **Posts** — create, edit, and delete posts with image uploads. Supports carousel (multiple images per post).
- **Feed** — public home feed showing all posts ordered by newest first, accessible without login.
- **Likes** — toggle likes with optimistic UI updates and automatic rollback if the request fails.
- **Comments** — add comments on any post, visible in a modal with the full post detail.
- **Follow system** — follow and unfollow users. Follower/following counts update in real time.
- **Search** — browse all registered users and navigate to their public profiles.

---

## Architecture

The app is split into three layers that communicate through a defined contract (TypeScript interfaces):

```
React (UI) → Express API → PostgreSQL
```

**Database schema** — 6 tables with foreign key relationships:

```
users
├── posts (author_id → users.user_id)
│   ├── post_media (post_id → posts.post_id)
│   ├── likes (post_id → posts.post_id, user_id → users.user_id)
│   └── comments (post_id → posts.post_id, user_id → users.user_id)
└── follows (follower_id → users.user_id, following_id → users.user_id)
```

**Authentication flow:**

1. User logs in → backend verifies password with bcrypt → signs a JWT
2. JWT is stored in `localStorage` on the frontend
3. Every protected request sends the token in the `Authorization` header
4. `express-jwt` middleware verifies the token on each request

**Image uploads:**

- Frontend converts selected image to base64
- Backend receives base64, uploads to Cloudinary
- Cloudinary returns a permanent URL
- URL is stored in the database (`post_media` or `users.avatar`)

---

## Key Technical Decisions

**Separate tables for likes, comments, and follows** — instead of storing arrays inside the posts table, each relationship has its own table. This allows efficient querying, prevents data duplication, and makes filtering (e.g. "posts liked by user X") fast with indexed lookups.

**Subquery pattern for aggregations** — to avoid row multiplication when joining multiple one-to-many relationships, each relationship (media, likes, comments) is aggregated in its own subquery before being joined to the posts query.

**Parameterized queries everywhere** — all SQL uses `$1, $2` placeholders instead of string interpolation, preventing SQL injection attacks.

**Optimistic UI updates** — likes update instantly in the UI before the server responds, with automatic rollback if the request fails, making the app feel responsive.

---

## What I Built and Learned

This project was built from scratch without a backend framework or ORM — just raw SQL and Express. Key things I worked through:

- Designing a relational database schema from scratch, including foreign keys and cascade deletes
- Writing complex SQL with JOINs, subqueries, and aggregation functions (`JSON_AGG`, `ARRAY_AGG`, `COALESCE`)
- Implementing JWT authentication with token expiration handling
- Understanding the difference between local component state and global state, and when each is appropriate
- Debugging across three layers simultaneously (database → backend → frontend)
- Deploying a full-stack app with environment variables, CORS configuration, and a cloud database

---

## Local Setup

**Prerequisites:** Node.js, PostgreSQL

**1. Clone both repositories**

```bash
git clone https://github.com/Stuarth00/Meetup_Social-App
```

**2. Backend setup**

```bash
cd backend
npm install
```

Create a `.env` file:

```
DB_USER=your_postgres_user
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=meetup
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the database schema (create tables in this order):

```sql
-- users → posts → post_media → likes → comments → follows
```

```bash
npm start
```

**3. Frontend setup**

```bash
cd frontend
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:3001
```

```bash
npm run dev
```

---

## Author

**Cedric Salvador** — self-taught developer
[GitHub](https://github.com/Stuarth00)
