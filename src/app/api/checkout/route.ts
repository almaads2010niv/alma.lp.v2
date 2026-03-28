import { NextRequest, NextResponse } from "next/server";
import { fireCAPIEvent } from "@/lib/capi";

interface UTMData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
}

interface CheckoutBody {
  name: string;
  phone: string;
  email?: string;
  marketing_consent?: boolean;
  archetype?: string;
  businessName?: string;
  businessType?: string;
  utm?: UTMData;
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json();

    // Validate required fields
    if (!body.name || !body.phone) {
      return NextResponse.json(
        { success: false, message: "שדות חובה חסרים: שם, טלפון" },
        { status: 400 }
      );
    }

    // Basic email validation (only if provided)
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json(
          { success: false, message: "כתובת אימייל לא תקינה" },
          { status: 400 }
        );
      }
    }

    // Basic phone validation (Israeli format)
    const phoneClean = body.phone.replace(/[-\s]/g, "");
    if (!/^0\d{8,9}$/.test(phoneClean)) {
      return NextResponse.json(
        { success: false, message: "מספר טלפון לא תקין" },
        { status: 400 }
      );
    }

    // Extract client info for CAPI
    const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
    const clientUserAgent = request.headers.get("user-agent") || "";
    const referer = request.headers.get("referer") || "";

    // Send to Zapier webhook
    const zapierResult = await fetch("https://hooks.zapier.com/hooks/catch/4214758/up6xr4o/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: body.name,
        phone: body.phone,
        email: body.email || "",
        business_name: body.businessName || "",
        business_type: body.businessType || "",
        archetype: body.archetype || "",
        marketing_consent: body.marketing_consent ?? false,
        source: "alma-adaptive-lp",
        lead_type: "checkout",
        timestamp: new Date().toISOString(),
        utm_source: body.utm?.utm_source || "",
        utm_medium: body.utm?.utm_medium || "",
        utm_campaign: body.utm?.utm_campaign || "",
        utm_content: body.utm?.utm_content || "",
        utm_term: body.utm?.utm_term || "",
        fbclid: body.utm?.fbclid || "",
        gclid: body.utm?.gclid || "",
      }),
    });

    // Send to AMP lead-webhook (fire-and-forget, non-blocking)
    const ampWebhookKey = process.env.SENSO_WEBHOOK_KEY;
    if (ampWebhookKey) {
      fetch(
        `https://rxckkozbkrabpjdgyxqm.supabase.co/functions/v1/lead-webhook?tenant_id=00000000-0000-0000-0000-000000000001&source=landing_page`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ampWebhookKey,
          },
          body: JSON.stringify({
            name: body.name,
            phone: body.phone,
            email: body.email || "",
            business_name: body.businessName || "",
            campaign_name: body.utm?.utm_campaign || "Alma Adaptive LP",
            notes: `ארכיטיפ: ${body.archetype || "לא נבדק"}, סוג עסק: ${body.businessType || "לא צוין"}, מקור: דף נחיתה אדפטיבי`,
          }),
        }
      ).catch(() => {});
    }

    // Fire Meta CAPI Lead event (non-blocking, fire-and-forget)
    fireCAPIEvent({
      eventName: "Lead",
      eventSourceUrl: referer || "https://alma-lp-v2.vercel.app",
      userData: {
        email: body.email,
        phone: body.phone,
        firstName: body.name,
        clientIp,
        clientUserAgent,
        fbclid: body.utm?.fbclid,
      },
      customData: {
        content_name: "Checkout Form",
        archetype: body.archetype || "none",
        utm_source: body.utm?.utm_source || "",
        utm_campaign: body.utm?.utm_campaign || "",
      },
    }).catch(() => {});

    if (zapierResult.ok) {
      return NextResponse.json({
        success: true,
        message: "הפרטים נשלחו בהצלחה! ניצור איתך קשר בהקדם.",
      });
    }

    console.error("Zapier webhook failed:", zapierResult.status);
    return NextResponse.json(
      { success: false, message: "שגיאה בשליחת הטופס. נסו שוב." },
      { status: 500 }
    );
  } catch (error) {
    console.error("Checkout API error:", error);
    return NextResponse.json(
      { success: false, message: "שגיאה פנימית. נסו שוב מאוחר יותר." },
      { status: 500 }
    );
  }
}
