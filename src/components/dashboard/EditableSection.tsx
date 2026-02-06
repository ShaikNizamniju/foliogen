import React, { useState, useCallback, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useProfile } from '@/contexts/ProfileContext';

export interface FieldConfig {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email';
  placeholder?: string;
}

interface EditableSectionProps {
  title: string;
  fields: FieldConfig[];
  data: Record<string, any>;
  editMode?: boolean;
  children: React.ReactNode;
  className?: string;
  onSave?: (updatedData: Record<string, any>) => void;
  /** For nested data like work experience items */
  nestedKey?: string;
  itemId?: string;
}

export function EditableSection({
  title,
  fields,
  data,
  editMode = false,
  children,
  className,
  onSave,
  nestedKey,
  itemId,
}: EditableSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { updateProfile, profile } = useProfile();

  // Initialize form data when dialog opens
  useEffect(() => {
    if (isOpen) {
      const initialData: Record<string, any> = {};
      fields.forEach((field) => {
        initialData[field.key] = data[field.key] ?? '';
      });
      setFormData(initialData);
    }
  }, [isOpen, data, fields]);

  const handleClick = useCallback(() => {
    if (editMode) {
      setIsOpen(true);
    }
  }, [editMode]);

  const handleFieldChange = useCallback(
    (key: string, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));

      // Auto-save: immediately update profile context
      if (onSave) {
        onSave({ ...formData, [key]: value });
      } else if (nestedKey && itemId) {
        // Handle nested data like work experience
        const items = (profile as any)[nestedKey] ?? [];
        const updatedItems = items.map((item: any) =>
          item.id === itemId ? { ...item, [key]: value } : item
        );
        updateProfile({ [nestedKey]: updatedItems });
      } else {
        // Direct profile field update
        updateProfile({ [key]: value });
      }
    },
    [formData, onSave, nestedKey, itemId, profile, updateProfile]
  );

  return (
    <>
      <div
        className={cn(
          'relative group',
          editMode && 'cursor-pointer hover:ring-2 hover:ring-primary/50 hover:ring-offset-2 rounded-lg transition-all',
          className
        )}
        onClick={handleClick}
      >
        {/* Edit indicator */}
        {editMode && (
          <div className="absolute -top-2 -right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
              <Pencil className="h-3 w-3" />
            </div>
          </div>
        )}
        {children}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit {title}</DialogTitle>
            <DialogDescription>
              Make changes to this section. Changes are saved automatically.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key}>{field.label}</Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.key}
                    value={formData[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                  />
                ) : (
                  <Input
                    id={field.key}
                    type={field.type}
                    value={formData[field.key] ?? ''}
                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Convenience components for common sections
export function EditableHero({
  profile,
  editMode,
  children,
  className,
}: {
  profile: any;
  editMode?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <EditableSection
      title="Profile Info"
      fields={[
        { key: 'fullName', label: 'Full Name', type: 'text', placeholder: 'Your Name' },
        { key: 'headline', label: 'Headline', type: 'text', placeholder: 'Professional Title' },
        { key: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Tell your story...' },
        { key: 'location', label: 'Location', type: 'text', placeholder: 'City, Country' },
      ]}
      data={profile}
      editMode={editMode}
      className={className}
    >
      {children}
    </EditableSection>
  );
}

export function EditableExperience({
  experience,
  editMode,
  children,
  className,
}: {
  experience: any;
  editMode?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <EditableSection
      title="Experience"
      fields={[
        { key: 'jobTitle', label: 'Job Title', type: 'text', placeholder: 'Job Title' },
        { key: 'company', label: 'Company', type: 'text', placeholder: 'Company Name' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your role...' },
        { key: 'startDate', label: 'Start Date', type: 'text', placeholder: 'Jan 2020' },
        { key: 'endDate', label: 'End Date', type: 'text', placeholder: 'Present' },
      ]}
      data={experience}
      editMode={editMode}
      nestedKey="workExperience"
      itemId={experience.id}
      className={className}
    >
      {children}
    </EditableSection>
  );
}

export function EditableProject({
  project,
  editMode,
  children,
  className,
}: {
  project: any;
  editMode?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <EditableSection
      title="Project"
      fields={[
        { key: 'title', label: 'Title', type: 'text', placeholder: 'Project Title' },
        { key: 'description', label: 'Description', type: 'textarea', placeholder: 'Describe your project...' },
        { key: 'link', label: 'Link', type: 'url', placeholder: 'https://...' },
      ]}
      data={project}
      editMode={editMode}
      nestedKey="projects"
      itemId={project.id}
      className={className}
    >
      {children}
    </EditableSection>
  );
}
