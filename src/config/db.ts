import { DataSource } from "typeorm"

const hostname = process.env.DB_HOST
const port = +process.env.DB_PORT
const dbName = process.env.DB_NAME
const username = process.env.DB_USER
const password = process.env.DB_PASS

export const db = new DataSource({
    type: "postgres",
    host: hostname,
    port: port,
    username: username,
    password: password,
    database: dbName,
    entities: ["src/entity/*.ts"],
    logging: true,
    synchronize: true,
})