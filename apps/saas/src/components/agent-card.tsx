"use client";

import {
  Button,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
} from "@rocketmind/ui";
import { Plus, Check } from "lucide-react";
import type { Agent } from "@/lib/types";
import { getInitials } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
  isAdded?: boolean;
  onAdd?: () => void;
}

export function AgentCard({ agent, isAdded, onAdd }: AgentCardProps) {
  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-3">
          <Avatar size="md">
            {agent.avatar_url && <AvatarImage src={agent.avatar_url} />}
            <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-16)] font-bold uppercase truncate">
              {agent.name}
            </p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">
              /{agent.slug}
            </p>
          </div>
        </div>

        <p className="flex-1 text-[length:var(--text-14)] text-muted-foreground line-clamp-2">
          {agent.description}
        </p>

        {onAdd && (
          <Button
            variant={isAdded ? "outline" : "default"}
            size="sm"
            className="w-full"
            disabled={isAdded}
            onClick={onAdd}
          >
            {isAdded ? (
              <>
                <Check className="mr-1.5 h-3.5 w-3.5" />
                Добавлен
              </>
            ) : (
              <>
                <Plus className="mr-1.5 h-3.5 w-3.5" />
                Добавить в кейс
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
