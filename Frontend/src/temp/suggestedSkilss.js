import OpenAI from 'openai';
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
const siteUrl = import.meta.env.VITE_SITE_URL
const siteName = import.meta.env.VITE_SITE_TITLE

const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    dangerouslyAllowBrowser : true,
    defaultHeaders: {
        'HTTP-Referer': siteUrl,
        'X-Title': siteName,
    },
});

export const fetchSuggestedSkills = async (bio, newSkill, currentSkills) => {
    try {
        const prompt = `
Suggest up to 5 **professional, industry-recognized skill names** based on the user's bio and currently typed keyword.

Bio:
"${bio}"

Already selected skills:
${currentSkills.join(", ") || "None"}

User is currently typing:
"${newSkill}"

Return only concise skill names in proper format (e.g., "Web Development", "JavaScript", "Cloud Computing").
Don't repeat existing skills. Just list the names — one per line.
    `;

        const completion = await openai.chat.completions.create({
            model: 'openai/gpt-4o',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            max_tokens: 1000,
        });

        const result = completion.choices[0].message.content;
        console.log("result",result)

        // Convert into clean array
        const skillsArray = result
            .split("\n")
            .map((s) => s.replace(/^\d+\.?\s*/, "").trim()) // remove "1. " etc
            .filter((s) => s && !currentSkills.includes(s));

        return skillsArray;
    } catch (err) {
        console.error("Error getting suggestions:", err.message);
        return [];
    }
};

export const fetchGPTResponse = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: message }],
      max_tokens: 1000,
    });

    const content = completion.choices[0]?.message?.content;
    return content || "I received an empty response. Please try again.";
  } catch (error) {
    return "⚠️ I'm sorry, the GPT API failed to respond. Please try again later.";
  }
};
