import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function InlineEdit({
  value,
  onSave,
  placeholder = 'Click to edit...',
  className,
  inputClassName,
  multiline = false,
  as: Component = 'span',
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onSave(editValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const sharedProps = {
      ref: inputRef as any,
      value: editValue,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        setEditValue(e.target.value),
      onBlur: handleBlur,
      onKeyDown: handleKeyDown,
      className: cn(
        'w-full bg-transparent border-b-2 border-primary outline-none',
        'focus:ring-0 transition-colors',
        inputClassName
      ),
      placeholder,
    };

    if (multiline) {
      return (
        <textarea
          {...sharedProps}
          rows={3}
          className={cn(sharedProps.className, 'resize-none')}
        />
      );
    }

    return <input type="text" {...sharedProps} />;
  }

  return (
    <Component
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative cursor-pointer group inline-flex items-center gap-2',
        'hover:bg-black/5 dark:hover:bg-white/5 rounded px-1 -mx-1 transition-colors',
        className
      )}
    >
      {value || <span className="text-muted-foreground italic">{placeholder}</span>}
      <Pencil 
        className={cn(
          'h-3.5 w-3.5 text-muted-foreground transition-opacity shrink-0',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
      />
    </Component>
  );
}
