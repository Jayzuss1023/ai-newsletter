"use client";

import { Loader2, Save, X } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  type UserSettingsInput,
  upsertUserSettings,
} from "@/actions/user-settings";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type UserSettings = {
  id: string;
  userId: string;
  newsletterName: string | null;
  description: string | null;
  targetAudience: string | null;
  defaultTone: string | null;
  brandVoice: string | null;
  companyName: string | null;
  industry: string | null;
  disclaimerText: string | null;
  defaultTags: string[];
  customFooter: string | null;
  senderName: string | null;
  senderEmail: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface SettingsFormProps {
  initialSettings: UserSettings | null;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [formTag, addTag] = useState<Partial<UserSettingsInput>>({
    defaultTags: [],
  });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<UserSettings>();

  const handleSave: SubmitHandler<UserSettings> = async (data) => {
    console.log(data);
    try {
      setIsSaving(true);
      const cleanedData: UserSettingsInput = {
        newsletterName: data.newsletterName?.trim() || null,
        description: data.description?.trim() || null,
        targetAudience: data.targetAudience?.trim() || null,
        defaultTone: data.defaultTone?.trim() || null,
        brandVoice: data.brandVoice?.trim() || null,
        companyName: data.companyName?.trim() || null,
        industry: data.industry?.trim() || null,
        disclaimerText: data.disclaimerText?.trim() || null,
        defaultTags: formTag.defaultTags || [],
        customFooter: data.customFooter?.trim() || null,
        senderName: data.senderName?.trim() || null,
        senderEmail: data.senderEmail?.trim() || null,
      };

      await upsertUserSettings(cleanedData);
      toast.success("Settings saved successfully");
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !formTag.defaultTags?.includes(trimmedTag)) {
      addTag((prevState) => ({
        ...prevState,
        defaultTags: [...(prevState.defaultTags || []), trimmedTag],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    addTag((prevState) => ({
      ...prevState,
      defaultTags:
        prevState.defaultTags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="max-w-4xl">
      {/* Basic Information */}
      <form className="space-y-6" onSubmit={handleSubmit(handleSave)}>
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Basic Information</CardTitle>
            <CardDescription className="text-base">
              Core details about your newsletter that will be used in every
              generation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="description">Newsletter Name</Label>
              <Input
                id="newsletterName"
                placeholder="e.g., Tech Weekly Digest"
                {...register("newsletterName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of your newsletter's purpose and content"
                {...register("description")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="e.g., Software developers, tech enthusiasts, startup founders"
                {...register("targetAudience")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultTone">Default Tone</Label>
              <Input
                id="defaultTone"
                placeholder="e.g., Professional, casual, friendly, informative"
                {...register("defaultTone")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Brand Identity */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Brand Identity</CardTitle>
            <CardDescription className="text-base">
              Your brand's voice and company information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Your company or organization name"
                {...register("companyName")}
              />
            </div>

            <div className="space=-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                placeholder="e.g., Technology, Healthcare, Finance"
                {...register("industry")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <Textarea
                id="brandVoice"
                placeholder="Describe your brand's unique voice and personal (e.g., witty, authorative,empathetic)"
                rows={3}
                {...register("brandVoice")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Additional Details</CardTitle>
            <CardDescription className="text-base">
              Extra information to ewnhance your newsletters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultTags">Default Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="defaultTags"
                  placeholder="Add a tag and press Enter"
                  {...register("defaultTags")}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
              {formTag.defaultTags && formTag.defaultTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formTag.defaultTags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="gap-1">
                      {tag}
                      <Button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="disclaimerText">Disclaimer Text</Label>
              <Textarea
                id="disclaimerText"
                placeholder="Any legal disclaimers or notices to include (will be automatically added at the end of every newsletter)"
                {...register("disclaimerText")}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This will be included near the end of every newsletter body
                before the footer
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customFooter">Custom Footer</Label>
              <Textarea
                id="customFooter"
                placeholder="Custom footer content for your newsletters (signature, contact info, social links, etc.)"
                {...register("customFooter")}
                rows={4}
              />
              <p className="text-cs text-muted-foreground">
                This will be included at the very end of every newsletter body
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sender Information */}
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Sender Information</CardTitle>
            <CardDescription className="text-base">
              Who is sending these newsletters?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                id="senderName"
                placeholder="e.g., John Doe"
                {...register("senderName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderEmail">Sender Email</Label>
              <Input
                id="senderEmail"
                type="email"
                placeholder="e.g., john@example.com"
                {...register("senderEmail")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onSubmit={handleSubmit(handleSave)}
            disabled={isSaving}
            size="lg"
            className="bg-linear-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
