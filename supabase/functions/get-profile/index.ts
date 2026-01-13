import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
    // Handle preflight request
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    try {
        if (req.method !== "POST") {
            return new Response(
                JSON.stringify({ error: "Method not allowed" }),
                {
                    status: 405,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        const { user_id } = await req.json();

        if (!user_id) {
            return new Response(
                JSON.stringify({ error: "user_id is required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 1️⃣ Find user
        const { data: user, error: userError } = await supabase
            .from("user")
            .select("*")
            .eq("id", user_id)
            .eq("is_active", true)
            .single();

        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: "User tidak ditemukan" }),
                {
                    status: 404,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 2️⃣ Fetch user applications
        const { data: userApps, error: appsError } = await supabase
            .from("user_application")
            .select(`
                id,
                apps_id,
                created_at,
                is_trial,
                expired_at,
                application (
                    id,
                    title,
                    description,
                    price,
                    discount_price,
                    image,
                    category,
                    version,
                    url
                )
            `)
            .eq("user_id", user.id);

        if (appsError) throw appsError;

        // 3️⃣ Build response
        const response = {
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                registered_at: user.registered_at,
                last_login: user.last_login,
            },
            applications: userApps ?? [],
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error:", err);
        return new Response(
            JSON.stringify({ error: err.message }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
