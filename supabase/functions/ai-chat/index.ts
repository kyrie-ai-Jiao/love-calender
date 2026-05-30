import "@supabase/functions-js/edge-runtime.d.ts";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是恋爱日历 App 中的 AI 恋爱助手。

身份：温暖、理性、善于沟通的恋爱顾问
风格：温柔、真诚、不说教、给实际可操作的建议

你可以帮用户：
- 恋爱建议和情感沟通技巧
- 推荐礼物和惊喜创意
- 策划约会方案
- 生成生日祝福、纪念日文案、朋友圈文案
- 异地恋维系感情的建议
- 分析恋爱中的困惑

要求：
1. 中文回答，语气温暖如朋友
2. 给出具体可执行的建议，不空谈道理
3. 每次回答控制在 300-600 字
4. 问题不清晰时温和询问细节
5. 积极建设性，不评判`;

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

Deno.serve(async (req: Request) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { messages } = await req.json() as { messages: ChatMessage[] };

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "缺少 messages" }),
        {
          status: 400,
          headers: corsHeaders(),
        }
      );
    }

    const apiKey = Deno.env.get("DEEPSEEK_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key 未配置" }),
        {
          status: 500,
          headers: corsHeaders(),
        }
      );
    }

    const fullMessages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.slice(-20),
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: fullMessages,
        temperature: 0.8,
        max_tokens: 1024,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.error?.message || "AI 请求失败";
      return new Response(
        JSON.stringify({ error: errMsg }),
        {
          status: response.status,
          headers: corsHeaders(),
        }
      );
    }

    const reply = data.choices?.[0]?.message?.content || "抱歉，我暂时无法回复。";

    return new Response(
      JSON.stringify({ reply }),
      { headers: corsHeaders() }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "服务器错误";
    return new Response(
      JSON.stringify({ error: msg }),
      {
        status: 500,
        headers: corsHeaders(),
      }
    );
  }
});

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  };
}
