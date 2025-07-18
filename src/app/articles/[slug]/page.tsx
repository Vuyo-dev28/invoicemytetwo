
import { articles } from "@/lib/articles";
import { notFound } from "next/navigation";
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { ArrowLeft } from "lucide-react";

// This is a simple function to convert markdown-like syntax to HTML.
// A more robust solution would use a library like 'marked' or 'react-markdown'.
function renderContent(content: string) {
    const htmlContent = content
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>')
      .replace(/\n\n/g, '</p><p class="text-lg leading-relaxed text-muted-foreground mb-4">')
      .replace(/\n/g, '<br />');
    return <div dangerouslySetInnerHTML={{ __html: `<p class="text-lg leading-relaxed text-muted-foreground mb-4">${htmlContent}</p>` }} />;
}


export async function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <Link href="/articles" className="inline-flex items-center text-primary mb-8 hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Articles
      </Link>
      <article>
        <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
            </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">{article.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            By {article.author} on {format(parseISO(article.date), 'MMMM d, yyyy')}
          </p>
        </header>
        
        <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
            <Image 
                src={article.imageUrl} 
                alt={article.title} 
                layout="fill"
                objectFit="cover"
                data-ai-hint="article photo"
            />
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
            {renderContent(article.content)}
        </div>
      </article>
    </div>
  );
}
