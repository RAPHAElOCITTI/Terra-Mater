import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import type { Testimonial } from "./db";

const App: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data, error } = await supabase.from("testimonials").select("*");
      if (error) {
        console.error("Error fetching testimonials:", error.message);
      } else {
        setTestimonials(data as Testimonial[]);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <div>
      <h1>Terra Mater Testimonials</h1>
      <ul>
        {testimonials.map((t) => (
          <li key={t.id}>
            "{t.quote}" – <strong>{t.author}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
