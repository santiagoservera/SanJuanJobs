import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Building2, Banknote } from "lucide-react";
import { Link } from "react-router-dom";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "full-time" | "part-time" | "temporal" | "pasantia";
  salary?: string;
  postedAt: string;
  description: string;
  tags: string[];
  featured?: boolean;
}

interface JobCardProps {
  job: Job;
}

const typeLabels: Record<Job["type"], string> = {
  "full-time": "Tiempo Completo",
  "part-time": "Medio Tiempo",
  temporal: "Temporal",
  pasantia: "Pasantía",
};

const typeColors: Record<
  Job["type"],
  "default" | "gold" | "wine" | "secondary"
> = {
  "full-time": "default",
  "part-time": "secondary",
  temporal: "gold",
  pasantia: "wine",
};

export const JobCard = ({ job }: JobCardProps) => {
  return (
    <Card
      className={`group relative overflow-hidden ${
        job.featured ? "ring-2 ring-primary/20" : ""
      }`}
    >
      {job.featured && (
        <div className="absolute top-0 right-0 bg-gold text-gold-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
          Destacado
        </div>
      )}

      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <Link to={`/empleo/${job.id}`}>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
              <Building2 className="w-4 h-4" />
              <span>{job.company}</span>
            </div>
          </div>
          <Badge variant={typeColors[job.type]}>{typeLabels[job.type]}</Badge>
        </div>

        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {job.description}
        </p>

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{job.location}</span>
          </div>
          {job.salary && (
            <div className="flex items-center gap-1">
              <Banknote className="w-4 h-4 text-primary" />
              <span>{job.salary}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-primary" />
            <span>{job.postedAt}</span>
          </div>
        </div>

        {job.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {job.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="muted" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button variant="hero" className="w-full" asChild>
          <Link to={`/empleo/${job.id}`}>Ver Detalle</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
