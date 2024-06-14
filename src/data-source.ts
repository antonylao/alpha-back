import { DataSource } from "typeorm"
import dotenv from "dotenv"
dotenv.config({
  path: process.env.NODE_ENV === "dev" ? ".env" : ".env.prod"
})

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  // entities: ["./src/entities/*{ts,js}"],
  entities: [process.env.TYPEORM_ENTITIES],
  migrations: [],
  subscribers: []
})
