import { db } from "../connectionDB.js"

await db.createCollection("books", {
    validator: {
        $jsonSchema: {
            required: [title],
        }
    }
})