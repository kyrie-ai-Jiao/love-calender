import "@supabase/functions-js/edge-runtime.d.ts";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是专业恋爱策划顾问，帮用户设计完整的纪念日/约会方案。

性格：温暖、真诚、浪漫、注重细节

输出规则：
1. 你只输出一个 JSON 对象，不要输出任何其他文字
2. JSON 格式必须严格如下：

{
  "title": "活动主题名称，如「浪漫一周年约会计划」",
  "timeline": [
    { "time": "14:00", "title": "咖啡馆见面", "detail": "具体说明20字内" }
  ],
  "gifts": [
    { "name": "礼物名称", "price": "约金额", "reason": "推荐理由30字内" }
  ],
  "surprises": [
    { "title": "惊喜名称", "detail": "具体做法50字内" }
  ],
  "budget": {
    "total": "总预算范围",
    "breakdown": "各部分花费说明，如：餐饮约X元，礼物约X元..."
  },
  "tips": "3条注意事项，每条用简短中文，分号分隔"
}

设计原则：
- 时间安排合理，每个环节间隔适当
- 礼物适合场景和预算，给出具体推荐而非泛泛
- 惊喜环节真诚可执行，不浮夸
- 预算分配合理，不超用户设定
- 考虑城市特色，推荐适合当地的场所或活动`;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const { budget, scene, city, style } = await req.json() as {
      budget: string;
      scene: string;
      city: string;
      style: string;
    };

    if (!budget || !scene || !city || !style) {
      return new Response(
        JSON.stringify({ error: "缺少必要参数：budget, scene, city, style" }),
        { status: 400, headers: corsHeaders() }
      );
    }

    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key 未配置" }),
        { status: 500, headers: corsHeaders() }
      );
    }

    const userPrompt = `请为以下场景策划一个完整的约会方案：

预算：${budget}
场景：${scene}
城市：${city}
风格偏好：${style}

请严格按照 JSON 格式输出，不要加任何额外说明文字。`;

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.error?.message || "AI 请求失败" }),
        { status: response.status, headers: corsHeaders() }
      );
    }

    const raw = data.choices?.[0]?.message?.content || "";

    // 解析 JSON（处理可能的 markdown 包裹）
    let plan;
    try {
      plan = JSON.parse(raw);
    } catch {
      // 尝试提取 JSON 块
      const match = raw.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          plan = JSON.parse(match[0]);
        } catch {
          return new Response(
            JSON.stringify({ error: "AI 返回格式异常，请重试", raw }),
            { status: 500, headers: corsHeaders() }
          );
        }
      } else {
        return new Response(
          JSON.stringify({ error: "AI 返回格式异常，请重试", raw }),
          { status: 500, headers: corsHeaders() }
        );
      }
    }

    return new Response(
      JSON.stringify({ plan }),
      { headers: corsHeaders() }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "服务器错误";
    return new Response(
      JSON.stringify({ error: msg }),
      { status: 500, headers: corsHeaders() }
    );
  }
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };
}
