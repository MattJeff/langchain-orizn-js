import { StructuredTool } from "@langchain/core/tools";
import { z } from "zod";

const BASE_URL = "https://visa.orizn.app";

let _hinted = false;

export class OriznVisaCheckTool extends StructuredTool {
  name = "orizn_visa_check";
  description =
    "Check visa requirements between any two countries. " +
    "Returns visa type, duration, required documents, process steps, and travel tips. " +
    "Covers 39,585 passport-destination pairs in 15 languages. " +
    "Use ISO 3166-1 alpha-3 country codes (e.g., FRA for France, JPN for Japan).";

  schema = z.object({
    passport: z
      .string()
      .describe(
        "ISO 3166-1 alpha-3 code of passport country (e.g., FRA, USA, JPN)"
      ),
    destination: z
      .string()
      .describe(
        "ISO 3166-1 alpha-3 code of destination country (e.g., THA, BRA, GBR)"
      ),
    lang: z
      .string()
      .default("en")
      .describe(
        "Language code (en, fr, es, pt, de, ja, ko, zh, ru, it, ar, hi, th, vi, tl)"
      ),
  });

  private apiKey?: string;

  constructor(apiKey?: string) {
    super();
    this.apiKey = apiKey ?? process.env.ORIZN_API_KEY;

    if (!this.apiKey && !_hinted) {
      _hinted = true;
      console.warn(
        "[langchain-orizn] No API key — only quick checks available.\n" +
        "[langchain-orizn] Free key → https://visa.orizn.app\n" +
        '[langchain-orizn] new OriznVisaCheckTool("orizn_visa_...")'
      );
    }
  }

  async _call({
    passport,
    destination,
    lang,
  }: {
    passport: string;
    destination: string;
    lang?: string;
  }): Promise<string> {
    const params = new URLSearchParams({
      passport: passport.toUpperCase(),
      destination: destination.toUpperCase(),
      lang: lang ?? "en",
    });

    const headers: Record<string, string> = {};
    if (this.apiKey) {
      headers["x-api-key"] = this.apiKey;
    }

    const resp = await fetch(`${BASE_URL}/api/v1/visa?${params}`, { headers });
    if (!resp.ok) {
      throw new Error(`Orizn API error: ${resp.status} ${resp.statusText}`);
    }
    return JSON.stringify(await resp.json());
  }
}

export class OriznQuickVisaCheckTool extends StructuredTool {
  name = "orizn_quick_visa_check";
  description =
    "Quick check if a visa is required between two countries. " +
    "Returns visa type (visa_free, visa_required, e_visa, visa_on_arrival, eta, no_admission) and duration. " +
    "No API key needed. Use ISO 3166-1 alpha-3 codes.";

  schema = z.object({
    passport: z
      .string()
      .describe("ISO 3166-1 alpha-3 code of passport country"),
    destination: z
      .string()
      .describe("ISO 3166-1 alpha-3 code of destination country"),
  });

  async _call({
    passport,
    destination,
  }: {
    passport: string;
    destination: string;
  }): Promise<string> {
    const params = new URLSearchParams({
      passport: passport.toUpperCase(),
      destination: destination.toUpperCase(),
    });

    const resp = await fetch(`${BASE_URL}/api/v1/visa/check?${params}`);
    if (!resp.ok) {
      throw new Error(`Orizn API error: ${resp.status} ${resp.statusText}`);
    }
    return JSON.stringify(await resp.json());
  }
}
