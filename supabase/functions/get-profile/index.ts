import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
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
        if (req.method !== "GET") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Get user_id from query params
        const url = new URL(req.url);
        const userId = url.searchParams.get("user_id");

        if (!userId) {
            return new Response(
                JSON.stringify({ error: "user_id parameter is required" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 1️⃣ Get user profile
        const { data: user, error: userError } = await supabase
            .from("user")
            .select("id, full_name, email, is_active, is_trial, registered_at, last_login, last_logout")
            .eq("id", userId)
            .eq("is_active", true)
            .single();

        if (userError || !user) {
            return new Response(
                JSON.stringify({ error: "User tidak ditemukan atau tidak aktif" }),
                {
                    status: 404,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 2️⃣ Get user applications with details
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
          url,
          highlight,
          review
        )
      `)
            .eq("user_id", userId);

        if (appsError) {
            console.error("Error fetching user applications:", appsError);
            return new Response(
                JSON.stringify({ error: "Gagal mengambil data aplikasi" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 3️⃣ Process applications data
        const now = new Date();
        const processedApps = (userApps || []).map((app: any) => {
            const isExpired = app.expired_at ? new Date(app.expired_at) < now : false;
            const daysLeft = app.expired_at
                ? Math.ceil((new Date(app.expired_at).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
                : null;

            return {
                id: app.id,
                apps_id: app.apps_id,
                created_at: app.created_at,
                is_trial: app.is_trial,
                expired_at: app.expired_at,
                is_expired: isExpired,
                days_left: daysLeft,
                application: app.application,
            };
        });

        // 4️⃣ Separate active and expired apps
        const activeApps = processedApps.filter(app => !app.is_expired);
        const expiredApps = processedApps.filter(app => app.is_expired);

        // 5️⃣ Build response
        const response = {
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                is_active: user.is_active,
                is_trial: user.is_trial,
                registered_at: user.registered_at,
                last_login: user.last_login,
                last_logout: user.last_logout,
            },
            applications: {
                total: processedApps.length,
                active: activeApps.length,
                expired: expiredApps.length,
                list: processedApps,
            },
            summary: {
                has_active_apps: activeApps.length > 0,
                has_trial: processedApps.some(app => app.is_trial && !app.is_expired),
                trial_expiring_soon: processedApps.some(app =>
                    app.is_trial && !app.is_expired && app.days_left !== null && app.days_left <= 3
                ),
            },
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    } catch (err) {
        console.error("Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
