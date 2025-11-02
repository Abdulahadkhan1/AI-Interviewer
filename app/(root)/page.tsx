import InterviewCard from "@/components/InterviewCard";
import { Button } from "@/components/ui/button";
import { dummyInterviews } from "@/constants";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>  
      <section className="card-cta">
      <div className="flex flex-col gap-6 max-w-lg">
        <h2>Get Interview Ready with AI-Powered Practice & Feedback</h2>
        <p className="text-muted-foreground">
          Practice on Real Interview questions, Get Instant AI Feedback, and
          Improve Your Skills.
        </p>
        <Button asChild className="btn-primary max-small:w-full">
          <Link href="/interview" >Start an Interview</Link>
        </Button>
      </div>

      <Image 
      src="/robot.png" 
      alt="robo-dude" 
      width={400} 
      height={400} 
      className="max-sm:hidden" />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="">Your Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => ( 
            <InterviewCard {...interview} key={interview.id} />
          ))}

          {/* <p>You haven&apos;t taken any interviews yet</p> */}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2 className="">Take an Interview</h2>

        <div className="interviews-section">
          {dummyInterviews.map((interview) => ( 
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
    </>
  );
}
