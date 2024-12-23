'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CreatePost } from '@/actions/CreatePostAction';
import { Upload, ImageIcon, Type } from 'lucide-react';

export default function NewPostForm() {
  const [fileNames, setFileNames] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFileNames(Array.from(files).map((file) => file.name));
    }
  };

  return (
    <Card className="w-[90%] md:w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Create New Post</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={CreatePost} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="media" className="flex items-center space-x-2">
              <Upload className="w-5 h-5" />
              <span>Upload Media</span>
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                id="media"
                name="media"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('media')?.click()}
              >
                Choose Files
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {fileNames.length > 0
                  ? `${fileNames.length} file(s) selected`
                  : 'No files chosen'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center space-x-2">
              <Type className="w-5 h-5" />
              <span>Title</span>
            </Label>
            <Input
              type="text"
              id="title"
              name="title"
              placeholder="Enter post title"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="flex items-center space-x-2"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Description</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your post..."
              rows={5}
            />
          </div>

          <CardFooter className="px-0">
            <Button type="submit" className="w-full">
              Create Post
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
