import { Create } from "./api/Create"
import { CreateTest } from "./api/CreateTest"
import * as admin from "firebase-admin"
import { Migrate } from "./api/Migrate"
import { MigrateTest } from "./api/MigrateTest"
import { BalanceOf } from "./api/BalanceOf"
import { BalanceOfTest } from "./api/BalanceOfTest"
import { Transfer } from "./api/Transfer"
import { TransferTest } from "./api/TransfetTest"

admin.initializeApp()
export const create = Create
export const createTest = CreateTest
export const migrate = Migrate
export const migrateTest = MigrateTest
export const balanceOf = BalanceOf
export const balanceOfTest = BalanceOfTest
export const transfer = Transfer
export const transferTest = TransferTest
