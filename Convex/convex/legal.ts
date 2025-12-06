import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const createDoc = mutation({
  args: {
    projectId: v.id("projects"),
    type: v.union(v.literal("SAFE"), v.literal("NDA")),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const docId = await ctx.db.insert("legalDocs", {
      projectId: args.projectId,
      type: args.type,
      storageId: args.storageId,
      status: "draft",
      createdAt: Date.now(),
    });

    return docId;
  },
});

export const getDocs = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const docs = await ctx.db
      .query("legalDocs")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    return Promise.all(
      docs.map(async (doc) => ({
        ...doc,
        url: await ctx.storage.getUrl(doc.storageId),
      }))
    );
  },
});

export const signDoc = mutation({
  args: { docId: v.id("legalDocs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.docId, {
      status: "signed",
      signedAt: Date.now(),
      signerId: user._id,
    });
  },
});
