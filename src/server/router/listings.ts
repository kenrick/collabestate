import { z } from "zod";
import { fetchListingsForSale, fetchLocation } from "../common/realtor";
import { createProtectedRouter } from "./context";

export const listingRouter = createProtectedRouter()
  .query("search", {
    input: z
      .object({
        searchType: z.enum(["sale", "rent"]),
        input: z.string().default("new york"),
        offset: z.number().default(0),
        limit: z.number().default(50),
        prop_type: z.array(z.enum(['single_family', 'condo', 'mobile', 'multi_family'])).optional(),
        prop_sub_type: z.array(z.string()).optional(),
        baths_min: z.string().optional(),
        beds_min: z.string().optional(),
        price_min: z.string().optional(),
        price_max: z.string().optional()
      }),
    async resolve({ input }) {
      const locationResponse = await fetchLocation(input.input)
      const location = locationResponse.autocomplete[0]

      if (!location) { return null }

      const listingResponse = await fetchListingsForSale({
        state_code: location.state_code,
        city: location.city,
        offset: input.offset,
        limit: input.limit,
        prop_type: input.prop_type ? input.prop_type.join(",") : undefined,
        prop_sub_type: input.prop_sub_type ? input.prop_sub_type.join(",") : undefined,
        baths_min: input.baths_min,
        beds_min: input.beds_min,
        price_min: input.price_min,
        price_max: input.price_max,
      })

      return { listings: { ...listingResponse, properties: listingResponse.properties.filter(p => p.thumbnail) }, location: location }
    },
  });
