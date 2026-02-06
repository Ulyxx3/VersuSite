# API Verification & Setup Guide

Versusite uses external APIs to fetch real data for Games and Movies. By default, the application uses **mock data** for these categories because they require personal API keys.

To enable real data imports, you would need to modify the code to include your own API keys. Below is a guide on how to obtain them.

## 1. IGDB (Video Games)

IGDB is owned by Twitch/Amazon. To use their API, you need a Twitch Developer account.

### Steps to get keys:
1.  Go to [Twitch Developer Console](https://dev.twitch.tv/console).
2.  Log in with your Twitch account.
3.  Click **"Register Your Application"**.
4.  Fill in the details:
    - **Name**: Versusite (or similar)
    - **OAuth Redirect URLs**: `http://localhost` (Safe default for local apps)
    - **Category**: Game Integration
5.  Once created, click **Manage** to see your keys:
    - **Client ID**: (Public)
    - **Client Secret**: (Keep private!)

### Integration (Developer Note)
To use real data, you would need to update `src/components/Creator.jsx` to fetch from `https://api.igdb.com/v4/games`.
*Note: IGDB requires a server-side proxy to hide the Client Secret, or a generated Access Token. Direct usage in client-side React is resistant due to CORS and security.*

---

## 2. TMDB (Movies & TV)

The Movie Database (TMDB) is the standard free alternative to IMDb.

### Steps to get keys:
1.  Create an account at [TheMovieDB.org](https://www.themoviedb.org/signup).
2.  Go to your [Account Settings](https://www.themoviedb.org/settings/api).
3.  Click **"API"** in the sidebar.
4.  Click **"Create"** and choose "Developer".
5.  Accept the terms and fill in the form (Usage: "Personal project for tournament creation").
6.  You will receive an **API Key (v3 auth)**.

### Integration (Developer Note)
TMDB is easier to integrate client-side than IGDB.
- **Endpoint**: `https://api.themoviedb.org/3/movie/top_rated?api_key=YOUR_KEY`
- You can replace the `importMockMovies` function in `Creator.jsx` with a fetch call to this endpoint.
