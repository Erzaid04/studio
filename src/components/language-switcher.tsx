'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Languages } from "lucide-react";

type LanguageSwitcherProps = {
    language: 'en' | 'hi';
    setLanguage: (lang: 'en' | 'hi') => void;
};

export function LanguageSwitcher({ language, setLanguage }: LanguageSwitcherProps) {
  const onValueChange = (value: string) => {
    if (value === 'en' || value === 'hi') {
      setLanguage(value);
    }
  };

  return (
    <Select onValueChange={onValueChange} defaultValue={language}>
      <SelectTrigger className="w-auto gap-2 text-sm">
        <Languages className="h-4 w-4 text-muted-foreground" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="hi">Hindi</SelectItem>
      </SelectContent>
    </Select>
  );
}
