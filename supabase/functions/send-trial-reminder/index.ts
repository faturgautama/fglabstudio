// Cron job untuk kirim reminder trial yang akan expired
// Run setiap hari jam 9 pagi

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { getTrialExpiringEmail } from "../_shared/email-templates.ts";

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
        // Calculate date 3 days from now
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        threeDaysFromNow.setHours(0, 0, 0, 0);

        const fourDaysFromNow = new Date(threeDaysFromNow);
        fourDaysFromNow.setDate(fourDaysFromNow.getDate() + 1);

        // Get all user_applications that will expire in 3 days
        const { data: expiringTrials, error } = await supabase
            .from("user_application")
            .select(`
        id,
        expired_at,
        is_trial,
        user:user_id (
          id,
          full_name,
          email
        ),
        application:apps_id (
          id,
          title
        )
      `)
            .eq("is_trial", true)
            .gte("expired_at", threeDaysFromNow.toISOString())
            .lt("expired_at", fourDaysFromNow.toISOString());

        if (error) {
            console.error("Error fetching expiring trials:", error);
            return new Response(
                JSON.stringify({ error: "Failed to fetch expiring trials" }),
                {
                    status: 500,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        if (!expiringTrials || expiringTrials.length === 0) {
            return new Response(
                JSON.stringify({
                    message: "No expiring trials found",
                    count: 0
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                }
            );
        }

        // Send reminder emails
        const emailPromises = expiringTrials.map(async (trial: any) => {
            try {
                const expiredDate = new Date(trial.expired_at);
                const expiredDateFormatted = expiredDate.toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                await resend.emails.send({
                    from: "FGLab Studio <noreply@codebyxerenity.my.id>",
                    to: trial.user.email,
                    subject: "Trial Anda Akan Berakhir ⏰",
                    html: getTrialExpiringEmail(
                        trial.user.full_name,
                        trial.application.title,
                        3,
                        expiredDateFormatted
                    ),
                });

                console.log(`Reminder sent to: ${trial.user.email}`);
                return { success: true, email: trial.user.email };
            } catch (emailError) {
                console.error(`Failed to send reminder to ${trial.user.email}:`, emailError);
                return { success: false, email: trial.user.email, error: emailError.message };
            }
        });

        const results = await Promise.all(emailPromises);
        const successCount = results.filter(r => r.success).length;
        const failCount = results.filter(r => !r.success).length;

        return new Response(
            JSON.stringify({
                message: "Trial reminders sent",
                total: expiringTrials.length,
                success: successCount,
                failed: failCount,
                results: results,
            }),
            {
                status: 200,
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
