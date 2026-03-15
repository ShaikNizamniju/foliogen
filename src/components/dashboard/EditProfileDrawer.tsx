import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProfile, WorkExperience, Project } from "@/contexts/ProfileContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SmartTagInput } from "./forms/SmartTagInput";
import { User, Briefcase, FolderKanban, Sparkles, Plus, Trash2, Save, X, ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase_v2";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  headline: z.string().min(2, "Headline is too short"),
  bio: z.string().min(10, "Bio is too short"),
  location: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  skills: z.array(z.string()),
  workExperience: z.array(z.object({
    id: z.string(),
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company is required"),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
  })),
  projects: z.array(z.object({
    id: z.string(),
    title: z.string().min(1, "Project title is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().optional().or(z.literal("")),
    techStack: z.array(z.string()).optional(),
  })),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface EditProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProfileDrawer({ open, onOpenChange }: EditProfileDrawerProps) {
  const { profile, updateProfile, saveProfile, saving } = useProfile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName || "",
      headline: profile.headline || "",
      bio: profile.bio || "",
      location: profile.location || "",
      email: profile.email || "",
      website: profile.website || "",
      linkedinUrl: profile.linkedinUrl || "",
      githubUrl: profile.githubUrl || "",
      twitterUrl: profile.twitterUrl || "",
      skills: profile.skills || [],
      workExperience: profile.workExperience || [],
      projects: profile.projects || [],
    },
  });

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({
    control: form.control,
    name: "workExperience",
  });

  const { fields: projectFields, append: appendProject, remove: removeProject } = useFieldArray({
    control: form.control,
    name: "projects",
  });

  // Sync form with profile data if it changes externally (e.g. AI parse)
  useEffect(() => {
    if (open) {
      form.reset({
        fullName: profile.fullName || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        location: profile.location || "",
        email: profile.email || "",
        website: profile.website || "",
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        twitterUrl: profile.twitterUrl || "",
        skills: profile.skills || [],
        workExperience: profile.workExperience || [],
        projects: profile.projects || [],
      });
    }
  }, [profile, open, form]);

  // Real-time sync
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Avoid circular updates by checking if something actually changed
      // But updateProfile is already debounced and handles Partial updates
      updateProfile(value as Partial<typeof profile>);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, updateProfile]);

  const onSubmit = async (data: ProfileFormValues) => {
    await saveProfile(data as any);
    onOpenChange(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Invalid file type", { description: "Please upload an image file." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 5MB." });
      return;
    }

    setIsUploadingPhoto(true);
    const toastId = toast.loading("Uploading photo...");

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      updateProfile({ photoUrl: publicUrl });
      toast.success("Photo updated", { id: toastId });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", { id: toastId, description: error.message });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0 h-full flex flex-col bg-[#0a0a0a] border-l border-white/10">
        <SheetHeader className="p-6 border-b border-white/5 shrink-0">
          <SheetTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Edit Profile
          </SheetTitle>
          <SheetDescription>
            Manually refine your AI-parsed data for a perfect portfolio.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col min-h-0">
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 bg-white/5 border border-white/10 p-1 h-11 shrink-0">
                    <TabsTrigger value="personal" className="data-[state=active]:bg-primary h-full rounded-md text-xs">Personal</TabsTrigger>
                    <TabsTrigger value="experience" className="data-[state=active]:bg-primary h-full rounded-md text-xs">Work</TabsTrigger>
                    <TabsTrigger value="projects" className="data-[state=active]:bg-primary h-full rounded-md text-xs">Projects</TabsTrigger>
                    <TabsTrigger value="skills" className="data-[state=active]:bg-primary h-full rounded-md text-xs">Skills</TabsTrigger>
                  </TabsList>

                  <div className="mt-6">
                    {/* Personal Info */}
                    <TabsContent value="personal" className="space-y-4 outline-none">
                      {/* Avatar Upload Section */}
                      <div className="flex flex-col items-center gap-4 py-4 mb-2 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <div className="relative group">
                          <div className="h-24 w-24 rounded-full border-2 border-white/10 overflow-hidden bg-muted flex items-center justify-center">
                            {isUploadingPhoto ? (
                              <Loader2 className="h-8 w-8 text-primary animate-spin" />
                            ) : profile.photoUrl ? (
                              <img src={profile.photoUrl} alt="Avatar" className="h-full w-full object-cover" />
                            ) : (
                              <div className="text-2xl font-bold text-primary/40 uppercase">
                                {profile.fullName?.substring(0, 2) || "??"}
                              </div>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploadingPhoto}
                            className="absolute bottom-0 right-0 p-2 bg-primary rounded-full shadow-lg border-2 border-[#0a0a0a] hover:scale-110 transition-transform disabled:opacity-50 disabled:scale-100"
                          >
                            <ImagePlus className="h-4 w-4 text-white" />
                          </button>
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium">Profile Picture</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">JPG, PNG, WebP (Max 5MB)</p>
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handlePhotoUpload}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/5 border-white/10 focus:border-primary/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="headline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Headline</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white/5 border-white/10 focus:border-primary/50" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Summary (About Me)</FormLabel>
                            <FormControl>
                              <Textarea {...field} rows={6} className="bg-white/5 border-white/10 focus:border-primary/50 resize-none" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Public Email</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="hello@example.com" className="bg-white/5 border-white/10" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">Location</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="San Francisco, CA" className="bg-white/5 border-white/10" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                         <FormField
                          control={form.control}
                          name="linkedinUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">LinkedIn</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="linkedin.com/..." className="h-8 text-xs bg-white/5 border-white/10" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="githubUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">GitHub</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="github.com/..." className="h-8 text-xs bg-white/5 border-white/10" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name="twitterUrl"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Twitter</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="x.com/..." className="h-8 text-xs bg-white/5 border-white/10" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    {/* Work Experience */}
                    <TabsContent value="experience" className="space-y-4 outline-none">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          Experience History
                        </h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => appendExp({ id: crypto.randomUUID(), jobTitle: "", company: "", current: false })}
                          className="h-8 text-xs gap-1 border-primary/20 hover:bg-primary/10"
                        >
                          <Plus className="h-3 w-3" /> Add Role
                        </Button>
                      </div>

                      <Accordion type="multiple" className="space-y-3">
                        {expFields.map((field, index) => (
                          <AccordionItem key={field.id} value={field.id} className="border border-white/10 rounded-xl overflow-hidden px-0">
                            <div className="flex items-center gap-2 pr-4 bg-white/5">
                              <AccordionTrigger className="flex-1 px-4 py-3 hover:no-underline">
                                <span className="text-sm font-medium text-left">
                                  {form.watch(`workExperience.${index}.jobTitle`) || "New Role"} 
                                  <span className="text-muted-foreground font-normal ml-2">
                                    at {form.watch(`workExperience.${index}.company`) || "Company"}
                                  </span>
                                </span>
                              </AccordionTrigger>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeExp(index)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <AccordionContent className="p-4 space-y-4 border-t border-white/10">
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`workExperience.${index}.jobTitle`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[10px] uppercase">Job Title</FormLabel>
                                      <FormControl>
                                        <Input {...field} className="bg-white/5 border-white/10" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`workExperience.${index}.company`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[10px] uppercase">Company</FormLabel>
                                      <FormControl>
                                        <Input {...field} className="bg-white/5 border-white/10" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`workExperience.${index}.startDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[10px] uppercase">Start Date</FormLabel>
                                      <FormControl>
                                        <Input {...field} placeholder="Jan 2020" className="bg-white/5 border-white/10" />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                                <FormField
                                  control={form.control}
                                  name={`workExperience.${index}.endDate`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-[10px] uppercase">End Date / Current</FormLabel>
                                      <FormControl>
                                        <Input 
                                          {...field} 
                                          placeholder="Present" 
                                          disabled={form.watch(`workExperience.${index}.current`)}
                                          className="bg-white/5 border-white/10" 
                                        />
                                      </FormControl>
                                    </FormItem>
                                  )}
                                />
                              </div>
                              <FormField
                                control={form.control}
                                name={`workExperience.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] uppercase">Impact Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} rows={3} className="bg-white/5 border-white/10 resize-none text-xs" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>

                    {/* Projects */}
                    <TabsContent value="projects" className="space-y-4 outline-none">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <FolderKanban className="h-4 w-4 text-primary" />
                          Project Showcase
                        </h4>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => appendProject({ id: crypto.randomUUID(), title: "", description: "", link: "" })}
                          className="h-8 text-xs gap-1 border-primary/20 hover:bg-primary/10"
                        >
                          <Plus className="h-3 w-3" /> Add Project
                        </Button>
                      </div>

                      <Accordion type="multiple" className="space-y-3">
                        {projectFields.map((field, index) => (
                          <AccordionItem key={field.id} value={field.id} className="border border-white/10 rounded-xl overflow-hidden px-0">
                            <div className="flex items-center gap-2 pr-4 bg-white/5">
                              <AccordionTrigger className="flex-1 px-4 py-3 hover:no-underline">
                                <span className="text-sm font-medium text-left truncate">
                                  {form.watch(`projects.${index}.title`) || "Untitled Project"}
                                </span>
                              </AccordionTrigger>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeProject(index)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <AccordionContent className="p-4 space-y-4 border-t border-white/10">
                              <FormField
                                control={form.control}
                                name={`projects.${index}.title`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] uppercase">Project Title</FormLabel>
                                    <FormControl>
                                      <Input {...field} className="bg-white/5 border-white/10" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`projects.${index}.description`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] uppercase">Description</FormLabel>
                                    <FormControl>
                                      <Textarea {...field} rows={3} className="bg-white/5 border-white/10 resize-none text-xs" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name={`projects.${index}.link`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-[10px] uppercase">Live Demo / Repo Link</FormLabel>
                                    <FormControl>
                                      <Input {...field} placeholder="https://..." className="bg-white/5 border-white/10 h-8" />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </TabsContent>

                    {/* Skills */}
                    <TabsContent value="skills" className="space-y-6 outline-none">
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Core Competencies
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          Add the technical skills, frameworks, and methodologies that define your expertise.
                        </p>
                        <FormField
                          control={form.control}
                          name="skills"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SmartTagInput 
                                  tags={field.value} 
                                  onChange={field.onChange} 
                                  placeholder="Type skill and press enter..."
                                  variant="tech"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </ScrollArea>

            <div className="p-6 border-t border-white/5 shrink-0 flex items-center justify-between gap-4 bg-black/40 backdrop-blur-md">
               <Button 
                 type="button" 
                 variant="ghost" 
                 onClick={() => onOpenChange(false)}
                 className="text-muted-foreground hover:text-white"
               >
                 Cancel
               </Button>
               <Button 
                type="submit" 
                disabled={saving}
                className="bg-primary hover:bg-primary/90 text-white shadow-glow px-8"
               >
                 {saving ? "Saving..." : "Save Profile"}
                 <Save className="ml-2 h-4 w-4" />
               </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
