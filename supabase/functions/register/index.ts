import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getWelcomeEmail } from "../_shared/email-templates.ts";

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

    const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

    try {
        if (req.method !== "POST") {
            return new Response(JSON.stringify({ error: "Method not allowed" }), {
                status: 405,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const { full_name, email, password, password_confirmation, trial_product_id } = await req.json();

        // 1️⃣ Validate input
        if (!full_name || !email || !password || !password_confirmation || !trial_product_id) {
            return new Response(
                JSON.stringify({ error: "Semua field wajib diisi" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 2️⃣ Validate password confirmation
        if (password !== password_confirmation) {
            return new Response(
                JSON.stringify({ error: "Password dan konfirmasi password tidak sesuai" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 3️⃣ Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ error: "Format email tidak valid" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 4️⃣ Check if email already exists
        const { data: existingUser } = await supabase
            .from("user")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return new Response(
                JSON.stringify({ error: "Email sudah terdaftar" }),
                {
                    status: 409,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 5️⃣ Validate trial product exists
        const { data: application, error: appError } = await supabase
            .from("application")
            .select("id, title, description, price, discount_price, image, category, version, url")
            .eq("id", trial_product_id)
            .single();

        if (appError || !application) {
            return new Response(
                JSON.stringify({ error: "Aplikasi trial tidak ditemukan" }),
                {
                    status: 404,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 6️⃣ Insert new user
        const now = new Date().toISOString();
        const { data: newUser, error: userError } = await supabase
            .from("user")
            .insert({
                full_name,
                email,
                password, // Plain text as per existing pattern
                is_active: true,
                is_trial: true,
                registered_at: now,
            })
            .select()
            .single();

        if (userError || !newUser) {
            console.error("User insert error:", userError);
            return new Response(
                JSON.stringify({ error: "Gagal membuat akun. Silakan coba lagi" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 7️⃣ Calculate trial expiration (7 days from now)
        const trialExpiration = new Date();
        trialExpiration.setDate(trialExpiration.getDate() + 7);

        // 8️⃣ Assign trial application to user
        const { data: userApp, error: userAppError } = await supabase
            .from("user_application")
            .insert({
                user_id: newUser.id,
                apps_id: trial_product_id,
                is_trial: true,
                expired_at: trialExpiration.toISOString(),
            })
            .select()
            .single();

        if (userAppError) {
            console.error("User application insert error:", userAppError);
            // Rollback: delete user if app assignment fails
            await supabase.from("user").delete().eq("id", newUser.id);

            return new Response(
                JSON.stringify({ error: "Gagal assign aplikasi trial" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // 9️⃣ Update login info (auto-login after registration)
        await supabase
            .from("user")
            .update({ last_login: now })
            .eq("id", newUser.id);

        // 🔟 Send welcome email
        try {
            const expiredDateFormatted = trialExpiration.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            await resend.emails.send({
                from: "FGLab Studio <noreply@codebyxerenity.my.id>",
                to: email,
                subject: "Selamat Datang di FGLab Studio! 🎉",
                html: getWelcomeEmail(full_name, application.title, expiredDateFormatted),
            });

            console.log("Welcome email sent successfully to:", email);
        } catch (emailError) {
            // Don't fail registration if email fails
            console.error("Failed to send welcome email:", emailError);
        }

        // 1️⃣1️⃣ Build response (same format as login)
        const response = {
            user: {
                id: newUser.id,
                full_name: newUser.full_name,
                email: newUser.email,
                registered_at: newUser.registered_at,
                last_login: now,
            },
            applications: [
                {
                    id: userApp.id,
                    apps_id: userApp.apps_id,
                    created_at: userApp.created_at,
                    is_trial: userApp.is_trial,
                    expired_at: userApp.expired_at,
                    application: application,
                },
            ],
        };

        return new Response(JSON.stringify(response), {
            status: 201,
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
