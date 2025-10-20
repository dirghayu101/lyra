import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";

import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";


export const agentsRouter = createTRPCRouter({

    // TODO: Change to protected procedure.
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input, ctx }) => {
        const [existingAgent] = await db
            .select({
                // TODO: Change to actual meeting count.
                meetingCount: sql<number>`5`,
                ...getTableColumns(agents),
            })
            .from(agents)
            .where(and(
                eq(agents.id, input.id),
                eq(agents.userId, ctx.auth.user.id),

            ))

        if (!existingAgent)
            throw new TRPCError({ code: "NOT_FOUND", message: "Agent not found" })

        return existingAgent;
    }),

    // TODO: Change to protected procedure.
    getMany: protectedProcedure
        .input(z.object({
            page: z.number().default(DEFAULT_PAGE),
            pageSize: z
                .number()
                .min(MIN_PAGE_SIZE)
                .max(MAX_PAGE_SIZE)
                .default(DEFAULT_PAGE_SIZE),
            search: z.string().nullish()
        }))
        .query(async ({ ctx, input }) => {
            const { search, page, pageSize } = input

            const data = await db
                .select({
                    // TODO: Change to actual meeting count.
                    meetingCount: sql<number>`6`,
                    ...getTableColumns(agents),
                })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(agents)
                .where(
                    and(
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,
                    )
                )

            const totalPages = Math.ceil(total.count / pageSize)
            return {
                items: data,
                total: total.count,
                totalPages
            };
        }),

    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id
                })
                .returning()

            return createdAgent;
        })
})
