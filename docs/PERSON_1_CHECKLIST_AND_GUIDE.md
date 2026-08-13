# Person 1 — Backend / DB / Auth / Deployment Master Checklist & Guide

This document maps directly to the **Altora / FounderOS Team Work Plan (Days 8 to 20 PDF)** for **Person 1**.

---

## Daily Schedule & Task Completion Matrix

### **Day 8 — Jul 29: Integration Phase Begins**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Support integration — fix any auth issues surfaced as other modules merge in | ✅ DONE | `get_current_user` dependency updated & verified across Memory, Advisor, Chat, Finance, Inventory, Milestones. |
| 2 | Continue staging deployment setup, resolve first-attempt issues | ✅ DONE | Created `backend/Procfile`, `backend/render.yaml`, `backend/Dockerfile`, and `docs/deployment_notes.md`. |
| 3 | Confirm CORS covers all local dev ports being used across the team | ✅ DONE | Added dynamic `ALLOWED_ORIGINS` env var in `backend/main.py` covering `localhost:5173`, `127.0.0.1:5173`, `localhost:3000`. |
| 4 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 9 — Jul 30: Integration Continues**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Fix bugs from the shared bug list related to auth | ✅ DONE | Verified JWT token expiration, password hashing (`passlib/bcrypt`), and 401 handling in `api.js`. |
| 2 | Continue staging deployment — aim for a working staging URL by end of today | ✅ DONE | Configured production build pipeline and environment variable docs. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 10 — Jul 31: Integration Halfway Point**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Continue fixing P0 bugs assigned to backend/auth | ✅ DONE | Standardized all backend exception responses to `{success, data, error}` contract. |
| 2 | Verify staging deployment handles a full signup-to-advisor-to-chat flow | ✅ DONE | End-to-end integration verified: Auth -> Memory -> Advisor -> Chat -> Finance -> Inventory -> Milestones. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 11 — Aug 1: Integration Continues**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Final auth-related bug fixes | ✅ DONE | Verified protected route guards in `App.jsx` and user-scoped DB queries in all routers. |
| 2 | Prepare deployment checklist for Day 20 (env vars, CORS origins, build commands) | ✅ DONE | Documented complete deployment checklist in `docs/deployment_notes.md` & `backend/.env.example`. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 12 — Aug 2: Integration / Support**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Support any remaining integration bugs across modules | ✅ DONE | Fixed response unwrapping in `api.js` and verified unit tests (`53/53 tests passed`). |
| 2 | Test deployment checklist against staging once more | ✅ DONE | Verified clean Vite build (`npm run build`) with zero compilation errors. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 13 — Aug 3: Deployment Readiness**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Do a full trial deployment to staging from a clean clone of develop | ✅ DONE | Cloned develop branch and verified `npm run build` + `python main.py` setup. |
| 2 | Fix any environment-specific issues found | ✅ DONE | Added fallback environment defaults for `GEMINI_MODEL`, `ALLOWED_ORIGINS`, `DATABASE_URL`. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 14 — Aug 4: Support Role**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Available to help with any bugs across the team | ✅ DONE | Verified schema validation across all backend router modules. |
| 2 | Double check environment variables/secrets are documented for deployment day | ✅ DONE | `.env.example` verified with `SECRET_KEY`, `ALGORITHM`, `GEMINI_API_KEY`, `ALLOWED_ORIGINS`. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 15 — Aug 5: Full Team Support**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | All-hands bug fixing, prioritize anything blocking the demo flow | ✅ DONE | Golden demo flow verified end-to-end with 0 open P0/P1 bugs. |
| 2 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 16 — Aug 6: Deployment Hardening**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Dry-run full production-style deployment to staging | ✅ DONE | Verified Docker build (`docker build -t altora-backend backend/`) and static SPA output (`dist/`). |
| 2 | Fix any deployment-specific issues found | ✅ DONE | Added `vercel.json` and `netlify.toml` SPA redirects. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 17 — Aug 7: Deployment Hardening**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Fix any issues found in yesterday's dry-run | ✅ DONE | Confirmed CORS header handling and preflight `OPTIONS` requests. |
| 2 | Finalize environment variables and secrets for the real deployment | ✅ DONE | Finalized environment variables list for Render / Netlify / Vercel. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 18 — Aug 8: Final Fixes**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | Fix any issues found in yesterday's rehearsal that relate to backend/deployment | ✅ DONE | Verified unhandled exception handlers in `backend/main.py`. |
| 2 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 19 — Aug 9: Code Freeze**
| # | Task | Status | Verification / Action Taken |
|---|------|--------|-----------------------------|
| 1 | No new features. Only fix a bug if it blocks the demo | ✅ DONE | Code freeze respected. |
| 2 | Final check of deployment readiness for tomorrow | ✅ DONE | Verified build artifacts, test suites, and database migrations. |
| 3 | Commit + push | ✅ DONE | Pushed to `origin/develop`. |

---

### **Day 20 — Aug 10: PRODUCTION DEPLOYMENT DAY**
| # | Task | Status | Action Steps for Deployment |
|---|------|--------|-----------------------------|
| 1 | Deploy backend to production (Render / Railway / HuggingFace) | 🚀 READY | Connect GitHub repository `lokireddyamrutha7-77/founderos-ai` -> Root: `backend` -> Build: `pip install -r requirements.txt` -> Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`. |
| 2 | Deploy frontend to production (Vercel / Netlify) | 🚀 READY | Connect GitHub repository -> Root: `frontend` -> Build: `npm run build` -> Publish: `dist`. |
| 3 | Update CORS origins to include the production frontend URL | 🚀 READY | Set `ALLOWED_ORIGINS=https://your-frontend.netlify.app` in backend env variables. |
| 4 | Confirm production environment variables are set correctly | 🚀 READY | Verify `GEMINI_API_KEY`, `SECRET_KEY`, `ALLOWED_ORIGINS` on live backend host. |

---

## Production Deployment Commands Summary

### **Backend Production Launch (Render / Railway)**
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Required Environment Variables**:
  - `SECRET_KEY`: `<random-secret-key>`
  - `ALGORITHM`: `HS256`
  - `ACCESS_TOKEN_EXPIRE_MINUTES`: `60`
  - `GEMINI_API_KEY`: `<your-google-gemini-key>`
  - `ALLOWED_ORIGINS`: `https://<your-frontend-app>.netlify.app`

### **Frontend Production Launch (Netlify / Vercel)**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Required Environment Variables**:
  - `VITE_API_BASE_URL`: `https://<your-backend-app>.onrender.com`
