
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
import { toast } from '@/components/ui/use-toast';
import { Image, FileUp, X } from 'lucide-react';
import { syncAllBooks } from '@/services/syncService';

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
  const [filePreview, setFilePreview] = useState<string | null>(null);
  // Use the toast import directly, not useToast()
  // const { toast } = useToast();
  const coverInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileChange = (file: File | null) => {
    if (file) {
      form.setValue('bookFile', file);
      
      // Show preview for some file types
      if (file.type === 'application/pdf') {
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
        
        // Auto-set file type
        form.setValue('fileType', FileType.PDF);
      } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
        form.setValue('fileType', FileType.DOCX);
        setFilePreview(null);
      } else if (file.name.toLowerCase().endsWith('.ppt') || file.name.toLowerCase().endsWith('.pptx')) {
        form.setValue('fileType', FileType.PPT);
        setFilePreview(null);
      } else if (file.name.toLowerCase().endsWith('.epub')) {
        form.setValue('fileType', FileType.EPUB);
        setFilePreview(null);
      } else {
        form.setValue('fileType', FileType.OTHER);
        setFilePreview(null);
      }
    } else {
      form.setValue('bookFile', undefined as unknown as File);
      setFilePreview(null);
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
      
      // 4. Sync with PostgreSQL
      await syncAllBooks();
      
      toast({
        title: 'Book added successfully',
        description: `"${data.title}" has been added to the library.`,
      });
      
      // Reset form
      form.reset();
      setCoverPreview(null);
      setFilePreview(null);
      
      onSuccess();
    } catch (err: any) {
      console.error('Error adding book:', err);
      setError(err.message || 'Error adding book. Please try again.');
      
      toast({
        title: 'Error adding book',
        description: err.message || 'There was an error adding the book.',
        variant: 'destructive'
      });
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="coverImage"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem className="flex flex-col h-full">
                <FormLabel>Book Cover (optional)</FormLabel>
                <div className="flex flex-col items-center justify-center h-full">
                  {coverPreview ? (
                    <div className="mb-2 relative">
                      <img 
                        src={coverPreview} 
                        alt="Cover preview" 
                        className="h-60 max-w-full object-contain rounded border"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => handleCoverImageChange(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed rounded flex items-center justify-center p-6 cursor-pointer h-60 w-full"
                      onClick={() => coverInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <Image className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">Click to add cover image</p>
                        <p className="text-xs text-gray-400">Recommended: 400x600px</p>
                      </div>
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={coverInputRef}
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
              <FormItem className="flex flex-col h-full">
                <FormLabel>Book File</FormLabel>
                <div className="flex flex-col h-full">
                  {filePreview ? (
                    <div className="mb-2 relative flex-grow">
                      <iframe 
                        src={filePreview} 
                        className="w-full h-60 border rounded"
                        title="Book preview"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                        onClick={() => handleFileChange(null)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : form.getValues('bookFile') ? (
                    <div className="border rounded p-4 mb-2 relative flex-grow">
                      <div className="text-center">
                        <p className="font-medium">{form.getValues('bookFile')?.name}</p>
                        <p className="text-sm text-gray-500">
                          {(form.getValues('bookFile')?.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          className="mt-2"
                          onClick={() => handleFileChange(null)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed rounded flex items-center justify-center p-6 cursor-pointer flex-grow"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="text-center">
                        <FileUp className="h-10 w-10 mx-auto text-gray-400" />
                        <p className="text-sm text-gray-500 mt-2">Click to upload book file</p>
                        <p className="text-xs text-gray-400">PDF, DOCX, PPT, EPUB</p>
                      </div>
                    </div>
                  )}
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf,.docx,.doc,.ppt,.pptx,.epub"
                      className="hidden"
                      ref={fileInputRef}
                      {...field}
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        if (file) {
                          handleFileChange(file);
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
        
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
