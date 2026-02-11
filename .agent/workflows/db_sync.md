---
description: Sync database schema and client
---

This workflow ensures your database and Prisma client are synchronized with recent schema changes.

1. **Stop Development Server**

   - If your dev server (`npm run dev`) is running, you may need to stop it (`Ctrl+C`) to unlock file permissions for database files or generated client files.

2. **Sync Database Schema**

   - Run the following command to push schema changes to your database:
     ```bash
     npx prisma db push
     ```

3. **Regenerate Prisma Client**

   - Update the generated client types:
     ```bash
     npx prisma generate
     ```

4. **Restart Server**
   - Start your development server again:
     ```bash
     npm run dev
     ```
