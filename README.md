HRM backend

<b>How to setup</b>
<i>Depend on whatever package manager you having on your machine, replace pnpm with corresponding package manager. For example if your machine has npm then run `npm install` instead of `pnpm install`</i>

<p>Configurate .env file first then do the following steps below</p>

1. Run `docker compose up -d` to running docker container
2. Run `pnpm install` to install all packages
3. Run `pnpx prisma migrate dev` to keep database table sync with schema file
4. Run `pnpx prisma generate` to generate prisma client
5. Run `pnpx db seed` to seed sample data to database.
6. Run `pnpm run start` to start project
