import { Card } from "@/app/components/ui/card";
import { Clock } from "lucide-react";

export interface News {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
  source: string;
}

interface NewsCardProps {
  news: News;
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h4 className="font-medium text-sm mb-2 line-clamp-2">{news.title}</h4>
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{news.summary}</p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock className="size-3" />
            <span>{news.timestamp}</span>
            <span>•</span>
            <span>{news.source}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
