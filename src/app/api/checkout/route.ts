import { NextRequest, NextResponse } from "next/server";

interface CheckoutBody {
  name: string;
  phone: string;
  email?: string;
  marketing_consent?: boolean;
  archetype?: string;
  businessName?: string;
  businessType?: string;
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

    const subject = body.businessName
      ? `ליד חדש מדף Adaptive — ${body.businessName}`
      : "ליד חדש מדף Adaptive — עלמה";

    // Send to Web3Forms and Zapier in parallel
    const [web3Result, zapierResult] = await Promise.allSettled([
      // Web3Forms
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "5e7c6215-2df6-4051-9d19-5a5ea96e0b9c",
          subject,
          name: body.name,
          phone: body.phone,
          email: body.email || "",
          business_name: body.businessName || "",
          business_type: body.businessType || "",
          archetype: body.archetype || "",
          marketing_consent: body.marketing_consent ? "כן" : "לא",
          from_name: "עלמה? Adaptive LP",
        }),
      }),

      // Zapier Webhook
      fetch("https://hooks.zapier.com/hooks/catch/4214758/ua57pgr/", {
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
          timestamp: new Date().toISOString(),
        }),
      }),
    ]);

    // Check results — succeed if EITHER service delivered
    let web3Ok = false;
    let zapierOk = false;

    if (web3Result.status === "fulfilled" && web3Result.value.ok) {
      web3Ok = true;
    } else {
      const reason =
        web3Result.status === "rejected"
          ? web3Result.reason
          : `HTTP ${web3Result.value.status}`;
      console.warn("Web3Forms failed (non-blocking):", reason);
    }

    if (zapierResult.status === "fulfilled" && zapierResult.value.ok) {
      zapierOk = true;
    } else {
      const reason =
        zapierResult.status === "rejected"
          ? zapierResult.reason
          : `HTTP ${zapierResult.value.status}`;
      console.warn("Zapier webhook failed (non-blocking):", reason);
    }

    // If at least one delivery channel succeeded, count as success
    if (web3Ok || zapierOk) {
      return NextResponse.json({
        success: true,
        message: "הפרטים נשלחו בהצלחה! ניצור איתך קשר בהקדם.",
      });
    }

    // Both failed
    console.error("Both Web3Forms and Zapier failed");
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
