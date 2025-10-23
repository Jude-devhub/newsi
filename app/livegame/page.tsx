'use client'

import NewsLayout from "@/components/layout/NewsLayout";
import { fetchNews } from "@/lib/fetchNews";
import { get } from "http";
import { use, useEffect , useState} from "react";

export default function LiveGamePage() {
    const [matches, setMatches] = useState<any[]>([]);

    useEffect(() => {
        document.title = "Live Game - NewsI";
    }, []); 

    useEffect(() => {
            const getMatches = async () => {
                try {
                    const res = await fetchNews("live games");
                    
                    setMatches(res);
                    // Process the live game data as needed
                } catch (error) {
                    console.error("Error fetching live games:", error);
                }
            };
        getMatches();
    }, []);


  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-3xl font-bold">Live Game Page - Coming Soon!</h1>
      
      <NewsLayout articles={matches} />
        </div>
  );
}