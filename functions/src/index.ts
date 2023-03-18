import { Create } from "./api/Create"
import { CreateTest } from "./api/CreateTest"
import * as admin from "firebase-admin"
import { Migrate } from "./api/Migrate"
import { MigrateTest } from "./api/MigrateTest"

admin.initializeApp()
export const create = Create
export const createTest = CreateTest
export const migrate = Migrate
export const migrateTest = MigrateTest
