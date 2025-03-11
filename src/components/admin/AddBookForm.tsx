
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FileType, BookStatus } from '@/types';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Image } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  description: z.string().optional(),
  fileType: z.enum([FileType.PDF, FileType.DOCX, FileType.PPT, FileType.EPUB, FileType.OTHER]),
  coverImage: z.instanceof(File).optional().nullable(),
  bookFile: z.instanceof(File)
});

type FormValues = z.infer<typeof formSchema>;

interface AddBookFormProps {
  onSuccess: () => void;
}

const AddBookForm = ({ onSuccess }: AddBookFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      author: '',
      description: '',
      fileType: FileType.PDF,
      coverImage: null,
      bookFile: undefined as unknown as File
    }
  });

  const handleCoverImageChange = (file: File | null) => {
    if (file) {
      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setCoverPreview(previewUrl);
      form.setValue('coverImage', file);
    } else {
      setCoverPreview(null);
      form.setValue('coverImage', null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      // 1. Upload book file to Firebase Storage
      const bookFileName = `books/${Date.now()}_${data.bookFile.name}`;
      const bookFileRef = ref(storage, bookFileName);
      await uploadBytes(bookFileRef, data.bookFile);
      const bookFileUrl = await getDownloadURL(bookFileRef);
      
      // 2. Upload cover image to Firebase Storage (if provided)
      let coverUrl = '';
      if (data.coverImage) {
        const coverFileName = `covers/${Date.now()}_${data.coverImage.name}`;
        const coverFileRef = ref(storage, coverFileName);
        await uploadBytes(coverFileRef, data.coverImage);
        coverUrl = await getDownloadURL(coverFileRef);
      }
      
      // 3. Add book to Firestore
      const newBook = {
        title: data.title,
        author: data.author,
        description: data.description || '',
        cover: coverUrl,
        filePath: bookFileName,
        fileUrl: bookFileUrl,
        fileType: data.fileType,
        status: BookStatus.AVAILABLE,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, 'books'), newBook);
      
      toast({
        title: 'Book added successfully',
        description: `"${data.title}" has been added to the library.`,
      });
      
      onSuccess();
    } catch (err: any) {
      console.error('Error adding book:', err);
      setError(err.message || 'Error adding book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-600 text-sm">
            {error}
          </div>
        )}
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Book title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Author name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Book description" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="fileType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={FileType.PDF}>PDF</SelectItem>
                  <SelectItem value={FileType.DOCX}>Word (DOCX)</SelectItem>
                  <SelectItem value={FileType.PPT}>PowerPoint (PPT)</SelectItem>
                  <SelectItem value={FileType.EPUB}>EPUB</SelectItem>
                  <SelectItem value={FileType.OTHER}>Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Book Cover (optional)</FormLabel>
              <div className="flex flex-col items-center">
                {coverPreview ? (
                  <div className="mb-2 relative">
                    <img 
                      src={coverPreview} 
                      alt="Cover preview" 
                      className="h-40 w-30 object-cover rounded border"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                      onClick={() => handleCoverImageChange(null)}
                    >
                      ✕
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="w-30 h-40 border-2 border-dashed rounded flex items-center justify-center mb-2 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="text-center p-4">
                      <Image className="h-8 w-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500 mt-2">Click to add cover</p>
                    </div>
                  </div>
                )}
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    className={coverPreview ? "hidden" : ""}
                    ref={fileInputRef}
                    {...field}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleCoverImageChange(file);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bookFile"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Book File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.docx,.ppt,.pptx,.epub"
                  {...field}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                      
                      // Auto-detect file type
                      const fileName = file.name.toLowerCase();
                      if (fileName.endsWith('.pdf')) {
                        form.setValue('fileType', FileType.PDF);
                      } else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) {
                        form.setValue('fileType', FileType.DOCX);
                      } else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) {
                        form.setValue('fileType', FileType.PPT);
                      } else if (fileName.endsWith('.epub')) {
                        form.setValue('fileType', FileType.EPUB);
                      } else {
                        form.setValue('fileType', FileType.OTHER);
                      }
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Uploading...' : 'Add Book'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddBookForm;
