# Backend Deployment Notes

## Environment Variables

Set these variables before deployment:

```
SECRET_KEY=<your-production-secret-key>
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
DATABASE_URL=<production-database-url>
```

---

## CORS Configuration

Development:

```
http://localhost:5173
```

Production:

```
https://your-frontend-domain.com
```

Replace the production URL with the actual frontend domain before deployment.

---

## Authentication

- JWT Authentication
- Password hashing using bcrypt
- Protected endpoints use `get_current_user`

---

## API Server

Development:

```
uvicorn main:app --reload
```

Production:

```
uvicorn main:app
```

---

## Security

- Use HTTPS in production.
- Keep `SECRET_KEY` private.
- Never commit `.env` files to GitHub.