import React, { useState, useEffect } from 'react';
import styles from './BlogForm.module.css';

const BlogForm = ({ mode = 'create', initialData = null, onSave }) => {
  // Form States
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isAutoSlug, setIsAutoSlug] = useState(true);
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  
  // Media & Metadata States
  const [thumbnail, setThumbnail] = useState(null);
  const [banner, setBanner] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  
  // SEO States
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [canonicalTag, setCanonicalTag] = useState('');
  const [schemaMarkup, setSchemaMarkup] = useState('');
  
  // UI Panels State
  const [isSeoExpanded, setIsSeoExpanded] = useState(true);
  const [isHtmlMode, setIsHtmlMode] = useState(false);

  // Populate data if in 'edit' mode
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title || '');
      setSlug(initialData.slug || '');
      setIsAutoSlug(initialData.isAutoSlug ?? false);
      setDescription(initialData.description || '');
      setContent(initialData.content || '');
      setTags(initialData.tags || []);
      setSeoTitle(initialData.seoTitle || '');
      setSeoDescription(initialData.seoDescription || '');
      setCanonicalTag(initialData.canonicalTag || '');
      setSchemaMarkup(initialData.schemaMarkup || '');
    }
  }, [mode, initialData]);

  // Handle Auto-Slug Generation
  useEffect(() => {
    if (isAutoSlug) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .replace(/\s+/g, '-');        // Replace spaces with dashes
      setSlug(generatedSlug);
    }
  }, [title, isAutoSlug]);

  // Tag Management
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const cleanedTag = tagInput.trim().toLowerCase();
      if (cleanedTag && !tags.includes(cleanedTag)) {
        setTags([...tags, cleanedTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  // Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      title,
      slug,
      isAutoSlug,
      description,
      content,
      thumbnail,
      banner,
      tags,
      seo: {
        title: seoTitle,
        description: seoDescription,
        canonical: canonicalTag,
        schema: schemaMarkup,
      }
    };
    if (onSave) onSave(formData);
  };

  return (
    <form className={styles.formContainer} onSubmit={handleSubmit}>
      {/* Top Header Controls */}
      <div className={styles.formHeader}>
        <h2 className={styles.formTitle}>
          {mode === 'edit' ? 'Edit Blog Post' : 'Create New Blog'}
        </h2>
        <div className={styles.headerActions}>
          <button type="button" className={styles.btnSecondary}>Save Draft</button>
          <button type="submit" className={styles.btnPrimary}>
            {mode === 'edit' ? 'Update & Publish' : 'Publish'}
          </button>
        </div>
      </div>

      <div className={styles.formBody}>
        {/* Left Column: Primary Content */}
        <div className={styles.mainContentColumn}>
          {/* Title Field */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Title</label>
            <input 
              type="text" 
              className={styles.input} 
              placeholder="Enter blog title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Slug Controls */}
          <div className={styles.slugControlGroup}>
            <div className={styles.toggleRow}>
              <span className={styles.toggleLabel}>Auto-generate URL Slug from Title</span>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={isAutoSlug}
                  onChange={(e) => setIsAutoSlug(e.target.checked)}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.slugPreviewWrapper}>
              <span className={styles.domainPrefix}>yourdomain.com/blog/</span>
              <input 
                type="text" 
                className={styles.slugInput}
                value={slug}
                disabled={isAutoSlug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Text Area Description */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Short Description</label>
            <textarea 
              className={styles.textarea} 
              rows="3" 
              placeholder="Provide a concise brief of the post..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Editor Sandbox Container */}
          <div className={styles.editorWrapper}>
            <div className={styles.editorToolbar}>
              <div className={styles.toolbarLeft}>
                <button type="button" className={styles.toolBtn}><b>B</b></button>
                <button type="button" className={styles.toolBtn}><i>I</i></button>
                <button type="button" className={styles.toolBtn}>🔗</button>
                <button type="button" className={styles.toolBtn}>🖼️ Image</button>
              </div>
              <button 
                type="button" 
                className={`${styles.toolBtnCode} ${isHtmlMode ? styles.activeTool : ''}`}
                onClick={() => setIsHtmlMode(!isHtmlMode)}
              >
                &lt;/&gt; {isHtmlMode ? 'View Rich Text' : 'View Code'}
              </button>
            </div>
            
            {isHtmlMode ? (
              <textarea
                className={styles.codeEditor}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="<h1>HTML Raw Source View</h1>"
              />
            ) : (
              <textarea
                className={styles.editorArea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your content here... Handles direct pasting formatting from Google Docs seamlessly."
              />
            )}
          </div>
        </div>

        {/* Right Column: Asset and SEO Side-panel */}
        <aside className={styles.sidebarColumn}>
          {/* Thumbnail Image Zone */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Thumbnail Image</label>
            <div className={styles.dropZone}>
              <span className={styles.dropZoneText}>Drag & drop thumbnail or click to upload</span>
            </div>
          </div>

          {/* Banner Image Zone */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Banner Image</label>
            <div className={styles.dropZone}>
              <span className={styles.dropZoneText}>Drag & drop banner or click to upload</span>
            </div>
          </div>

          {/* Tags Element */}
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Tags</label>
            <div className={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tagBadge}>
                  {tag}
                  <button type="button" onClick={() => removeTag(index)} className={styles.tagRemoveBtn}>×</button>
                </span>
              ))}
              <input 
                type="text" 
                className={styles.tagInput} 
                placeholder="Add tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>
          </div>

          {/* Collapsible SEO block */}
          <div className={styles.accordionSection}>
            <div 
              className={styles.accordionHeader} 
              onClick={() => setIsSeoExpanded(!isSeoExpanded)}
            >
              <span>SEO & Meta Settings</span>
              <span>{isSeoExpanded ? '▲' : '▼'}</span>
            </div>
            
            {isSeoExpanded && (
              <div className={styles.accordionContent}>
                <div className={styles.fieldGroup}>
                  <label className={styles.subLabel}>SEO Title</label>
                  <input 
                    type="text" 
                    className={styles.inputSmall} 
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.subLabel}>SEO Description</label>
                  <textarea 
                    className={styles.textareaSmall} 
                    rows="3"
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.subLabel}>Canonical Tag URL</label>
                  <input 
                    type="url" 
                    className={styles.inputSmall} 
                    value={canonicalTag}
                    onChange={(e) => setCanonicalTag(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.subLabel}>Schema Markup (JSON-LD)</label>
                  <textarea 
                    className={styles.codeTextareaSmall} 
                    rows="4" 
                    placeholder="{ '@context': 'https://schema.org' }"
                    value={schemaMarkup}
                    onChange={(e) => setSchemaMarkup(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </form>
  );
};

export default BlogForm;