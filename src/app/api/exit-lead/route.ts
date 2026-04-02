import { NextRequest, NextResponse } from "next/server";
import { fireCAPIEvent } from "@/lib/capi";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, archetype } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "טלפון חובה" },
        { status: 400 }
      );
    }

    const phoneClean = phone.replace(/[-\s]/g, "");

    // Send to Zapier webhook
    const zapierResult = await fetch("https://hooks.zapier.com/hooks/catch/4214758/up6xr4o/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phone,
        source: "alma-adaptive-lp",
        lead_type: "exit_intent",
        archetype: archetype || "unknown",
        timestamp: new Date().toISOString(),
      }),
    });

    // Send to AMP lead-webhook
    const ampWebhookKey = process.env.SENSO_WEBHOOK_KEY;
    if (ampWebhookKey) {
      try {
        const ampRes = await fetch(
          `https://rxckkozbkrabpjdgyxqm.supabase.co/functions/v1/lead-webhook?tenant_id=00000000-0000-0000-0000-000000000001&source=landing_page`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "x-api-key": ampWebhookKey,
            },
            body: JSON.stringify({
              name: "ליד מחלון יציאה",
              phone: phoneClean,
              campaign_name: "Alma LP - Exit Intent",
              notes: `ארכיטיפ: ${archetype || "לא נבדק"}, מקור: חלון יציאה בדף נחיתה`,
            }),
          }
        );
        const ampResult = await ampRes.json().catch(() => ({}));
        console.log("AMP exit-lead response:", ampRes.status, ampResult);
      } catch (ampError) {
        console.error("AMP exit-lead error:", ampError);
      }
    }

    // Fire Meta CAPI event (fire-and-forget)
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const clientUserAgent = request.headers.get("user-agent") || "";
    fireCAPIEvent({
      eventName: "Lead",
      eventSourceUrl: "https://alma-lp-v2.vercel.app",
      userData: { phone, clientIp, clientUserAgent },
      customData: {
        content_name: "Exit Intent",
        archetype: archetype || "none",
      },
    }).catch(() => {});

    return NextResponse.json({ success: zapierResult.ok });
  } catch (error) {
    console.error("Exit lead API error:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה פנימית" },
      { status: 500 }
    );
  }
}
