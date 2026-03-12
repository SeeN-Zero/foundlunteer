# Foundlunteer Backend

Backend API untuk platform volunteer berbasis **Express 5 + Prisma 7 + PostgreSQL**.

## Stack
- Node.js (disarankan `>=20`, tested di `v24`)
- Express 5
- Prisma 7 (`@prisma/client` + `prisma migrate`)
- PostgreSQL
- TypeScript

## Quick Start
1. Install dependency:
```bash
npm install
```
2. Buat file `.env` (copy dari contoh di bawah).
3. Jalankan migration ke database:
```bash
npm run migration:uat:up
```
4. Jalankan mode development:
```bash
npm run dev
```
5. Buka:
- API: `http://localhost:3000/`
- Swagger UI: `http://localhost:3000/api-docs`

## Environment Variables
Gunakan `.env` di root project:

```env
# App
NODE_ENV=development
PORT=3000
HOST_URL=http://localhost:3000

# Auth (required)
TOKEN_KEY=replace-with-a-strong-random-secret

# Database (required)
DATABASE_URL=postgresql://postgres:password@localhost:5432/foundlunteer?schema=public

# SMTP (required for forgot password email)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=your-email@example.com
SMTP_PASSWORD=your-email-app-password
```

Catatan:
- `TOKEN_KEY` dan `DATABASE_URL` wajib, aplikasi akan error saat start jika kosong.
- Fitur forgot password butuh konfigurasi SMTP valid.

## Scripts
- `npm run dev` jalankan server dev via `tsx` + `nodemon`
- `npm run build` compile TypeScript ke `dist/`
- `npm start` jalankan hasil build (`dist/www.js`)
- `npm run lint` cek ESLint strict
- `npm run typecheck` cek TypeScript tanpa emit
- `npm run migration:uat:up` apply migration (`prisma migrate deploy`)
- `npm run migration:uat:down` reset database (`prisma migrate reset --force --skip-seed`)

## Database Migration Flow
Project saat ini memakai satu migration baseline:
- `prisma/migrations/20230430090130_initialization/migration.sql`

Alur umum:
1. Up migration:
```bash
npm run migration:uat:up
```
2. Down/reset migration:
```bash
npm run migration:uat:down
```

## API Scope (Current)
- `/user` registrasi, login, profil, image, CV/ijazah/sertifikat, forgot password
- `/individual` update profil, save/register job, upload file dokumen
- `/organization` kelola profil, job milik organisasi, update status registrant
- `/job` tambah/list/detail/update/status/delete job

Dokumentasi endpoint lengkap ada di `swagger_output.json` dan disajikan lewat `/api-docs`.
