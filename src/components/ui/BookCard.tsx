
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CustomButton } from "@/components/ui/custom-button";
import { Star } from "lucide-react";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  rating: number;
  format: "digital" | "audio" | "both";
}

const BookCard = ({ id, title, author, coverImage, rating, format }: BookCardProps) => {
  const formatLabel = {
    digital: "E-Book",
    audio: "Áudio Livro",
    both: "E-Book & Áudio",
  };

  const formatIcon = {
    digital: "📱",
    audio: "🎧",
    both: "📱🎧",
  };

  return (
    <Card className="overflow-hidden book-card border transition-all duration-300 h-full flex flex-col justify-between">
      <div className="relative pt-[125%] overflow-hidden bg-slate-100">
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-medium">
          {formatLabel[format]}
        </div>
      </div>
      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-lg line-clamp-2 min-h-[3.5rem]">{title}</h3>
        <p className="text-muted-foreground text-sm mt-1">{author}</p>
        <div className="flex items-center mt-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Star
                key={i}
                size={14}
                className={`${
                  i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          <span className="ml-1 text-xs text-muted-foreground">{rating.toFixed(1)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <CustomButton className="w-full group" size="sm">
          <span>Emprestar</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </CustomButton>
      </CardFooter>
    </Card>
  );
};

export default BookCard;
