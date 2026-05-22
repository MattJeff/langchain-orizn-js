import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";
export declare class OriznVisaCheckTool extends StructuredTool {
    name: string;
    description: string;
    schema: z.ZodObject<{
        passport: z.ZodString;
        destination: z.ZodString;
        lang: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
    private apiKey?;
    constructor(apiKey?: string);
    _call({ passport, destination, lang, }: {
        passport: string;
        destination: string;
        lang?: string;
    }): Promise<string>;
}
export declare class OriznQuickVisaCheckTool extends StructuredTool {
    name: string;
    description: string;
    schema: z.ZodObject<{
        passport: z.ZodString;
        destination: z.ZodString;
    }, z.core.$strip>;
    _call({ passport, destination, }: {
        passport: string;
        destination: string;
    }): Promise<string>;
}
