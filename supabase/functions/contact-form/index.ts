// Edge function untuk handle contact form submission
// Simpan ke database + kirim email ke admin

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getContactFormNotification } from "../_shared/email-templates.ts";

export const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
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

        const { full_name, email, phone_number, subject, content } = await req.json();

        // Validate input
        if (!full_name || !email || !phone_number || !subject || !content) {
            return new Response(
                JSON.stringify({ error: "Semua field wajib diisi" }),
                {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Validate email format
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

        // Get IP address and location (optional)
        const ipAddress = req.headers.get("x-forwarded-for") ||
            req.headers.get("x-real-ip") ||
            "unknown";

        // Insert to database
        const { data: contactData, error: dbError } = await supabase
            .from("contact")
            .insert({
                full_name,
                email,
                phone_number,
                subject,
                content,
                ip_address: ipAddress,
            })
            .select()
            .single();

        if (dbError) {
            console.error("Database insert error:", dbError);
            return new Response(
                JSON.stringify({ error: "Gagal menyimpan pesan" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Send notification email to admin
        try {
            await resend.emails.send({
                from: "FGLab Studio <noreply@codebyxerenity.my.id>",
                to: "admin@codebyxerenity.my.id", // Change to your admin email
                subject: "Pesan Baru dari Contact Form 📧",
                html: getContactFormNotification(
                    full_name,
                    email,
                    phone_number,
                    subject,
                    content,
                    ipAddress
                ),
            });

            console.log("Admin notification sent successfully");
        } catch (emailError) {
            // Don't fail if email fails
            console.error("Failed to send admin notification:", emailError);
        }

        return new Response(
            JSON.stringify({
                message: "Pesan berhasil dikirim. Kami akan segera menghubungi Anda.",
                data: {
                    id: contactData.id,
                    created_at: contactData.created_at,
                },
            }),
            {
                status: 201,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        console.error("Error:", err);
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
