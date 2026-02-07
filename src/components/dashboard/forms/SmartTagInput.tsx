import { useState, KeyboardEvent } from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SmartTagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  className?: string;
  variant?: 'default' | 'tech' | 'keyword';
}

export function SmartTagInput({
  tags,
  onChange,
  placeholder = 'Add tag...',
  className,
  variant = 'default',
}: SmartTagInputProps) {
  const [inputValue, setInputValue] = useState('');

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onChange([...tags, trimmedTag]);
    }
    setInputValue('');
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    } else if (e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const getBadgeClasses = () => {
    switch (variant) {
      case 'tech':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/30';
      case 'keyword':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30';
      default:
        return 'bg-primary/20 text-primary border-primary/30 hover:bg-primary/30';
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      {/* Tags display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                'px-2 py-1 text-xs font-medium transition-colors cursor-default group',
                getBadgeClasses()
              )}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1.5 opacity-60 hover:opacity-100 transition-opacity"
                aria-label={`Remove ${tag}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => addTag(inputValue)}
          disabled={!inputValue.trim()}
          className="shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add tags
      </p>
    </div>
  );
}
