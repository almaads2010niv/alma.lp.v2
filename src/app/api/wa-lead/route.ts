import { NextRequest, NextResponse } from "next/server";

// Lightweight lead capture for WhatsApp float button
// No Zapier, no CAPI — just send to AMP lead-webhook directly
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, archetype, businessName } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, message: "שם וטלפון חובה" },
        { status: 400 }
      );
    }

    // Normalize phone — accept any reasonable format
    const phoneClean = phone.replace(/[-\s\(\)\.]/g, "");

    const ampWebhookKey = process.env.SENSO_WEBHOOK_KEY;
    if (!ampWebhookKey) {
      console.error("SENSO_WEBHOOK_KEY not configured");
      return NextResponse.json({ success: true }); // Don't block user
    }

    // Send directly to AMP lead-webhook (await — we want to confirm)
    const res = await fetch(
      `https://rxckkozbkrabpjdgyxqm.supabase.co/functions/v1/lead-webhook?tenant_id=00000000-0000-0000-0000-000000000001&source=landing_page`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ampWebhookKey,
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phoneClean,
          business_name: businessName || "",
          campaign_name: "Alma LP - WhatsApp Float",
          notes: `ארכיטיפ: ${archetype || "לא נבדק"}, מקור: כפתור וואטסאפ צף`,
        }),
      }
    );

    const result = await res.json().catch(() => ({}));
    console.log("AMP wa-lead response:", res.status, result);

    return NextResponse.json({ success: true, leadId: result.leadId });
  } catch (error) {
    console.error("wa-lead API error:", error);
    return NextResponse.json({ success: true }); // Don't block user even on error
  }
}
