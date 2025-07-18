
import { articles } from "@/lib/articles";
import Link from 'next/link';
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export default function ArticlesPage() {
  return (
    <div className="container mx-auto py-8 z-10 relative bg-background/80 backdrop-blur-sm rounded-xl p-8 mt-24">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Articles & Insights</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Tips, tutorials, and best practices for freelancers and small businesses.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="group block">
            <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="relative h-48 w-full">
                <Image
                  src={article.imageUrl}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint="article photo"
                />
              </div>
              <CardHeader>
                <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{article.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{article.excerpt}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0 mt-auto">
                 <div className="flex items-center text-sm font-medium text-primary">
                    Read more <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
