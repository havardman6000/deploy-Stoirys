import { useMemo } from 'react';
import { Tag } from '../types';

export function useTags() {
  const parseTags = (tagsString: string): Tag[] => {
    if (!tagsString.trim()) {
      return [];
    }

    return tagsString
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.includes('='))
      .map(tag => {
        const [name, value] = tag.split('=', 2);
        return { name: name.trim(), value: value.trim() };
      });
  };

  const stringifyTags = (tags: Tag[]): string => {
    return tags.map(tag => `${tag.name}=${tag.value}`).join(', ');
  };

  const addTag = (tags: Tag[], name: string, value: string): Tag[] => {
    // Check if tag with this name already exists
    const existingIndex = tags.findIndex(tag => tag.name === name);
    
    if (existingIndex !== -1) {
      // Update existing tag
      const newTags = [...tags];
      newTags[existingIndex] = { name, value };
      return newTags;
    }
    
    // Add new tag
    return [...tags, { name, value }];
  };

  return useMemo(() => ({
    parseTags,
    stringifyTags,
    addTag
  }), []);
}