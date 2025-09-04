import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Other tables here...

  todos: defineTable({
    completed: v.boolean(),
    createdAt: v.string(),
    description: v.string(),
    id: v.string(),
    sectionId: v.string(),
    title: v.string(),
    updatedAt: v.string(),
  }),
});
