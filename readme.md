# Mythical Creature Sanctuary

A fun front-end project with **Supabase** that lets you manage a database of mythical creatures!  
Includes full **CRUD** functionality: add, view, update, and delete creatures.

---

## Features

- Add new creatures with:
  - Name
  - Species
  - Danger Level
  - Elemental Type
  - Status
- Edit creatures via a modal form
- Delete creatures
- Hide/show form dynamically

---

## Tech

- HTML / CSS / Bootstrap 5
- JavaScript
- [Supabase](https://supabase.com/) for the backend database

---

## Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/YOUR-GITHUB-USERNAME/mythical-creature-sanctuary.git
cd mythical-creature-sanctuary
```

2. **Get a Supabase project & anon key**
- Go to [Supabase](https://supabase.com/) and create a free project
- Set up a table called creatures with these columns:

| Column         | Type       | Notes                        |
| -------------- | ---------- | ---------------------------- |
| id             | int8       | Primary key, auto increment  |
| name           | text       | Required                     |
| species        | text       | Required                     |
| danger_level   | int4       | Optional                     |
| status         | text       | Optional, Default: "Contained" |
| elemental_type | text       | Optional                     |
| created_at     | timestamp  | Default: now()               |

- Copy your Project URL and Anon Key from Project Settings -> API

3. **Update your key in `app.js`**
```js
const client = supabase.createClient(
    "https://YOUR-PROJECT-LINK.supabase.co",
    "YOUR-ANON-KEY-HERE" // <- Replace this with your own anon key
);
```

4. **Open `index.html` in your browser**
- Just run it locally