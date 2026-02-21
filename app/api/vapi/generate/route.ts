import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

// Simple in-memory rate limiter
const rateLimiter = new Map<string, number>();

export async function POST(request: Request) {
  console.log("=== POST /api/vapi/generate started ===");
  
  try {
    const body = await request.json();
    const { type, role, level, techstack, amount, userid } = body;

    // Rate limiting check (1 request per user per 5 seconds)
    const now = Date.now();
    const lastRequest = rateLimiter.get(userid);
    
    if (lastRequest && now - lastRequest < 5000) {
      const waitTime = Math.ceil((5000 - (now - lastRequest)) / 1000);
      return Response.json(
        { 
          success: false, 
          error: `Please wait ${waitTime} seconds before making another request` 
        },
        { status: 429 }
      );
    }
    
    rateLimiter.set(userid, now);

    if (!role || !level || !techstack || !amount || !userid || !type) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      return Response.json(
        { success: false, error: "API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Prepare questions for a job interview.
The job role is ${role}.
The job experience level is ${level}.
The tech stack used in the job is: ${techstack}.
The focus between behavioural and technical questions should lean towards: ${type}.
The amount of questions required is: ${amount}.
Please return only the questions, without any additional text.
The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
Return the questions formatted like this:
["Question 1", "Question 2", "Question 3"]

Thank you! <3`;

    console.log("Calling Gemini API...");
    
    // Try gemini-1.5-flash instead (might have separate quota)
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      }),
    });

    const responseText = await response.text();

    if (!response.ok) {
      console.error("API error:", responseText);
      
      // Handle rate limit specifically
      if (response.status === 429) {
        return Response.json(
          { 
            success: false, 
            error: "API quota exceeded. Please try again in a few minutes or upgrade your API plan.",
            details: "You've hit the free tier limit. Consider using a different API key or upgrading to paid tier."
          },
          { status: 429 }
        );
      }
      
      return Response.json(
        { success: false, error: `API error (${response.status})` },
        { status: response.status }
      );
    }

    const data = JSON.parse(responseText);
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      return Response.json(
        { success: false, error: "No text generated" },
        { status: 500 }
      );
    }

    let parsedQuestions;
    try {
      const cleanedText = generatedText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      
      parsedQuestions = JSON.parse(cleanedText);
      
      if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
        throw new Error("Invalid format");
      }
      
    } catch (parseError) {
      return Response.json(
        { 
          success: false, 
          error: "AI returned invalid format",
          rawResponse: generatedText.substring(0, 500),
        },
        { status: 500 }
      );
    }

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((tech: string) => tech.trim()),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    console.log("Saving to Firebase...");
    const docRef = await db.collection("interviews").add(interview);

    return Response.json({ 
      success: true, 
      interviewId: docRef.id,
      questionsCount: parsedQuestions.length,
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error:", error);
    
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({ 
    success: true, 
    data: "API is working!",
  }, { status: 200 });
}