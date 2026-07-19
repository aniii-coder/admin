import React, { useState, useEffect } from 'react';
import { Editor } from "@tinymce/tinymce-react";
import { 
  Type, FileText, Link2, Image as ImageIcon, Search, 
  Settings, Layers, Tag, ListOrdered, X, UploadCloud 
} from 'lucide-react';
import styles from './BlogForm.module.css';

import { useRouter } from 'next/router'; 
import { useDispatch } from 'react-redux';
import { errorToast, successToast } from '@/services/slices/toastSlice';
import { useGetSpecificBlogQuery } from '../../api';
import { useCreateBlogMutation, useUpdateBlogMutation } from './api'; 

function ImageUploader({ label, selectedFile, initialImageUrl, onFileChange, onFileClear, id, error }) {
  const [previewUrl, setPreviewUrl] = useState('');

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (initialImageUrl) {
      setPreviewUrl(initialImageUrl);
    } else {
      setPreviewUrl('');
    }
  }, [selectedFile, initialImageUrl]);

  const handleDropZoneChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <div className={`${styles.fieldGroup} ${error ? styles.fieldError : ''}`}>
      <label><ImageIcon size={18} /> {label}</label>
      <div className={styles.uploaderContainer}>
        {previewUrl ? (
          <div className={styles.previewWrapper}>
            <img src={previewUrl} alt={`${label} Preview`} className={styles.imagePreview} />
            <button type="button" onClick={onFileClear} className={styles.removeImgBtn}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className={styles.uploadPrompt}>
            <UploadCloud size={32} style={{ color: error ? '#ef4444' : '#9ca3af' }} />
            <p>Drag & drop or <span>browse</span> your image</p>
            <input 
              id={id}
              type="file" 
              accept="image/*" 
              onChange={handleDropZoneChange} 
              className={styles.fileInput} 
            />
          </div>
        )}
      </div>
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
}

export default function BlogForm({ mode = 'create' }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { blog_id } = router.query;
  const isEditMode = mode === 'edit';

  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation(); 
  
  const isSubmitting = isCreating || isUpdating;

  const {
    data: responseData,
    isLoading: isLoadingBlogData,
    isError,
  } = useGetSpecificBlogQuery(blog_id, {
    skip: !blog_id || !isEditMode,
  });

  const blogData = responseData?.data;

  // Form Field States
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slug, setSlug] = useState('');
  const [isCustomSlug, setIsCustomSlug] = useState(false);
  const [content, setContent] = useState('');
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [initialThumbnailUrl, setInitialThumbnailUrl] = useState('');
  const [bannerFile, setBannerFile] = useState(null);
  const [initialBannerUrl, setInitialBannerUrl] = useState('');
  
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonical, setCanonical] = useState('');
  const [schemaMarkup, setSchemaMarkup] = useState('');

  const [tags, setTags] = useState([]);
  const [currentTagInput, setCurrentTagInput] = useState('');

  const [toc, setToc] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode && blogData) {
      setTitle(blogData.title || '');
      setDescription(blogData.description || '');
      setSlug(blogData.slug || '');
      setIsCustomSlug(true); 
      setContent(blogData.content || '');
      
      setInitialThumbnailUrl(blogData.thumbnail || '');
      setInitialBannerUrl(blogData.banner || '');
      
      const seoData = blogData.seo || {};
      setSeoTitle(seoData.seoTitle || '');
      setSeoDescription(seoData.seoDescription || '');
      setCanonical(seoData.canonical || '');
      
      if (seoData.schemaMarkup) {
        setSchemaMarkup(
          typeof seoData.schemaMarkup === 'object' 
            ? JSON.stringify(seoData.schemaMarkup, null, 2) 
            : seoData.schemaMarkup
        );
      } else {
        setSchemaMarkup('');
      }

      setTags(Array.isArray(blogData.tags) ? blogData.tags : []);
      setToc(Array.isArray(blogData.tableOfContents) ? blogData.tableOfContents : []);
    }
  }, [blogData, isEditMode]);

  useEffect(() => {
    if (!isCustomSlug) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') 
        .replace(/\s+/g, '-')         
        .replace(/-+/g, '-');         
      setSlug(generatedSlug);
    }
  }, [title, isCustomSlug]);

  // 💡 Updated effect to temporarily bypass the uncreated API endpoint
  useEffect(() => {
    setRelatedBlogs([]); 
    setIsLoadingRelated(false);
    
    /* 
    // Temporarily disabled until /api/blogs/related endpoint is active
    if (tags.length === 0) {
      setRelatedBlogs([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoadingRelated(true);
      try {
        const tagsParam = encodeURIComponent(tags.join(','));
        const response = await fetch(`/api/blogs/related?tags=${tagsParam}`);
        
        const contentType = response.headers.get("content-type");
        if (!response.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error('Endpoint returned non-JSON response structure');
        }
        
        const data = await response.json();
        setRelatedBlogs(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('API Error while processing related blogs:', error);
        setRelatedBlogs([]);
      } finally {
        setIsLoadingRelated(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
    */
  }, [tags]);

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (validationErrors.title && val.trim()) {
      setValidationErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const handleSchemaChange = (e) => {
    const val = e.target.value;
    setSchemaMarkup(val);
    if (validationErrors.schemaMarkup) {
      setValidationErrors(prev => ({ ...prev, schemaMarkup: undefined }));
    }
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    const parser = new DOMParser();
    const doc = parser.parseFromString(newContent, 'text/html');
    const h2Elements = doc.querySelectorAll('h2');
    
    const extractedHeaders = Array.from(h2Elements).map((h2, idx) => ({
      id: idx,
      text: h2.textContent || h2.innerText
    }));
    setToc(extractedHeaders);
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const sanitizedTag = currentTagInput.trim().toLowerCase();
      if (sanitizedTag && !tags.includes(sanitizedTag)) {
        setTags([...tags, sanitizedTag]);
      }
      setCurrentTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const validateForm = () => {
    const errors = {};
    const errorMessages = [];

    if (!title.trim()) {
      errors.title = "Title field cannot consist of empty spaces.";
      errorMessages.push("Blog Title is required.");
    }

    if (!slug.trim()) {
      errors.slug = "URL Slug cannot be left blank.";
      errorMessages.push("URL Slug is required.");
    }

    if (schemaMarkup.trim()) {
      try {
        JSON.parse(schemaMarkup);
      } catch (_) {
        errors.schemaMarkup = "Invalid structured object notation. Please review your JSON syntax.";
        errorMessages.push("Schema Markup contains invalid JSON formatting syntax.");
      }
    }

    setValidationErrors(errors);

    if (errorMessages.length > 0) {
      dispatch(errorToast({ message: errorMessages[0] }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('slug', slug.trim());
    formData.append('content', content);
    
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    } else if (isEditMode && initialThumbnailUrl) {
      formData.append('thumbnail', initialThumbnailUrl);
    }
    
    if (bannerFile) {
      formData.append('banner', bannerFile);
    } else if (isEditMode && initialBannerUrl) {
      formData.append('banner', initialBannerUrl);
    }
    
    formData.append('seoTitle', seoTitle.trim());
    formData.append('seoDescription', seoDescription.trim());
    formData.append('canonical', canonical.trim());
    formData.append('schemaMarkup', schemaMarkup.trim() === "" ? "{}" : schemaMarkup);
    formData.append('clientId', '6a5bb7f7d89993b2f5cbcfc8');
    formData.append('tags', JSON.stringify(tags));
    formData.append('tableOfContents', JSON.stringify(toc));

    try {
      let response;
      if (isEditMode) {
        response = await updateBlog({ 
          blog_id, 
          blogFormDataPayload: formData 
        }).unwrap();
      } else {
        response = await createBlog(formData).unwrap();
      }

      if (response?.success) {
        dispatch(successToast({ message: response?.message || (isEditMode ? "Blog post updated successfully!" : "Blog post successfully published!") }));
        router.push("/admin/dashboard");
      } else {
        dispatch(errorToast({ message: response?.message || "Operation failed. Try again." }));
      }
    } catch (err) {
      console.error("Mutation Submission Failure:", err);
      dispatch(errorToast({ message: err?.data?.message || err?.message || "An unexpected error occurred while communicating with backend endpoints." }));
    }
  };

  if (isEditMode && isLoadingBlogData) {
    return (
      <div style={{ display: 'flex', padding: '4rem', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>Loading target document details into view workspace...</p>
      </div>
    );
  }

  if (isEditMode && isError) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#ef4444' }}>Failed to retrieve requested blog information. Verify routing parameters.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>{isEditMode ? "Modify Existing Blog Post" : "Create New Blog Post"}</h2>
      <hr style={{ borderColor: '#e5e7eb', marginBottom: '2rem' }} />

      <div className={`${styles.fieldGroup} ${validationErrors.title ? styles.fieldError : ''}`}>
        <label><Type size={18} /> Blog Title</label>
        <input 
          type="text" 
          value={title} 
          onChange={handleTitleChange} 
          className={styles.input} 
          placeholder="e.g., Designing Scalable Frontends" 
          required 
        />
        {validationErrors.title && <span className={styles.errorMessage}>{validationErrors.title}</span>}
      </div>

      <div className={styles.fieldGroup}>
        <label><FileText size={18} /> Short Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className={styles.textarea} 
          rows={3} 
          placeholder="Brief intro text..." 
        />
      </div>

      <div className={`${styles.fieldGroup} ${validationErrors.slug ? styles.fieldError : ''}`}>
        <label><Link2 size={18} /> URL Slug</label>
        <div className={styles.slugWrapper}>
          <input 
            type="text" 
            value={slug} 
            onChange={(e) => isCustomSlug && setSlug(e.target.value)} 
            disabled={!isCustomSlug} 
            className={styles.input} 
            required 
          />
          <button 
            type="button" 
            onClick={() => setIsCustomSlug(!isCustomSlug)} 
            className={`${styles.toggleBtn} ${isCustomSlug ? styles.toggleBtnActive : ''}`}
          >
            {isCustomSlug ? "Lock Dynamic" : "Custom Slug"}
          </button>
        </div>
        {validationErrors.slug && <span className={styles.errorMessage}>{validationErrors.slug}</span>}
      </div>

      <div className={styles.grid2}>
        <ImageUploader 
          id="thumbnail-upload"
          label="Thumbnail Image" 
          selectedFile={thumbnailFile} 
          initialImageUrl={initialThumbnailUrl}
          onFileChange={setThumbnailFile} 
          onFileClear={() => {
            setThumbnailFile(null);
            setInitialThumbnailUrl('');
          }} 
        />
        <ImageUploader 
          id="banner-upload"
          label="Banner Image" 
          selectedFile={bannerFile} 
          initialImageUrl={initialBannerUrl}
          onFileChange={setBannerFile} 
          onFileClear={() => {
            setBannerFile(null);
            setInitialBannerUrl('');
          }} 
        />
      </div>

      <div className={styles.fieldGroup}>
        <label><Layers size={18} /> Rich Blog Content Editor Workspace</label>
        <Editor
          apiKey={process.env.EDITOR_KEY}
          value={content}
          onEditorChange={handleEditorChange}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist", "autolink", "lists", "link", "image", "table", 
              "code", "codesample", "fullscreen", "preview", "wordcount"
            ],
            toolbar:
              "undo redo | blocks | bold italic underline | \
               alignleft aligncenter alignright | \
               bullist numlist | link image table | \
               codesample code preview fullscreen",
            branding: false,
            image_dimensions: true,
            image_class_list: [
              { title: 'Responsive Flow', value: 'img-fluid inline-image' }
            ],
            paste_as_text: false,
            smart_paste: true
          }}
        />
      </div>

      <h3 className={styles.sectionTitle}><Search size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Search Engine Optimization (SEO)</h3>
      
      <div className={styles.grid2}>
        <div className={styles.fieldGroup}>
          <label>Meta SEO Title</label>
          <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className={styles.input} placeholder="Title for SERP display" />
        </div>
        <div className={styles.fieldGroup}>
          <label>Canonical Destination Tag</label>
          <input type="url" value={canonical} onChange={(e) => setCanonical(e.target.value)} className={styles.input} placeholder="https://..." />
        </div>
      </div>

      <div className={styles.fieldGroup}>
        <label>SEO Meta Description</label>
        <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className={styles.textarea} rows={2} placeholder="Search brief summary snippet..." />
      </div>

      <div className={`${styles.fieldGroup} ${validationErrors.schemaMarkup ? styles.fieldError : ''}`}>
        <label><Settings size={18} /> JSON-LD Schema Structured Data Markup</label>
        <textarea 
          value={schemaMarkup} 
          onChange={handleSchemaChange} 
          className={styles.textarea} 
          rows={3} 
          style={{ fontFamily: 'monospace', fontSize: '0.9rem' }} 
          placeholder='{ "@context": "https://schema.org", "@type": "BlogPosting", ... }'
        />
        {validationErrors.schemaMarkup && <span className={styles.errorMessage}>{validationErrors.schemaMarkup}</span>}
      </div>

      <h3 className={styles.sectionTitle}><Tag size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Taxonomy & Categorization</h3>
      <div className={styles.fieldGroup}>
        <label>Categorization Tags (Press Enter or comma to insert)</label>
        <div className={styles.tagInputWrapper}>
          {tags.map((tag, idx) => (
            <span key={idx} className={styles.tagBadge}>
              {tag}
              <button type="button" onClick={() => removeTag(idx)}><X size={14} /></button>
            </span>
          ))}
          <input 
            type="text" 
            value={currentTagInput}
            onChange={(e) => setCurrentTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className={styles.tagInput}
            placeholder={tags.length === 0 ? "e.g., technology, tutorial" : ""}
          />
        </div>
      </div>

      <h3 className={styles.sectionTitle}><ListOrdered size={20} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> Computed Analytics (Admin View)</h3>
      
      <div className={styles.grid2}>
        <div className={styles.fieldGroup}>
          <label>Auto-Generated Table of Contents (From H2s)</label>
          <div className={styles.previewBox}>
            {toc.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>Write sub-sections structured with H2 headings inside the editor zone to auto-generate index nodes.</p>
            ) : (
              <ul className={styles.previewList}>
                {toc.map((heading, i) => (
                  <li key={heading.id || i}>📌 {heading.text}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label>Related Internal Blog Nodes (Matched by Shared Tags)</label>
          <div className={styles.previewBox}>
            {isLoadingRelated ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>Querying matching nodes...</p>
            ) : relatedBlogs.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9rem', margin: 0 }}>No shared matches detected. Set active tag keys above.</p>
            ) : (
              <ul className={styles.previewList}>
                {relatedBlogs.map(blog => (
                  <li key={blog.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>🔗 {blog.title}</span>
                    <span style={{ color: '#16a34a', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {blog.sharedCount} matching tags
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className={`${styles.submitBtn} ${isSubmitting ? styles.submitBtnDisabled : ''}`}
      >
        {isSubmitting 
          ? "Processing Assets..." 
          : isEditMode 
            ? "Update System Blog Post" 
            : "Publish System Blog Post"}
      </button>
    </form>
  );
}